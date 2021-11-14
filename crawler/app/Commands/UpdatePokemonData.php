<?php

namespace App\Commands;

use App\Libraries\Pokemon\PokemonHome;
use App\Models\Ability;
use App\Models\Item;
use App\Models\Move;
use App\Models\Nature;
use App\Models\Pokeform;
use App\Models\Pokemon;
use App\Models\Poketype;
use App\Models\RankSeasonList;
use App\Models\Type;
use App\Models\RankActivePokemon;
use Illuminate\Database\Capsule\Manager as Capsule;
use Monolog\Logger;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\ArrayInput;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;

class UpdatePokemonData extends Command
{
    protected static $defaultName = 'pokemonHome:update-data';

    protected static $defaultDescription = '抓取 pokemon home 的資料(圖鑑、屬性、招式、特性、道具、性格的名稱與編號列表)，並將其存入資料庫';

    public function __construct(Logger $log, PokemonHome $pm)
    {
        $this->log = $log;
        $this->pm = $pm;

        parent::__construct();
    }

    protected function configure(): void
    {
        $this->addOption(
            'upload',
            null,
            InputOption::VALUE_NONE,
            '是否要上傳到 S3'
        );
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        try {
            $pm = $this->pm;

            Capsule::transaction(function () use ($pm) {
                // 更新 pokemon、屬性、特性、道具、性格和招式列表
                $tables = ['pokemon', 'type', 'ability', 'item', 'nature', 'move'];

                foreach ($tables as $name) {
                    $data = $pm->get_pokemon_data($name);

                    foreach ($data[$name] as $id => $v) {
                        $updates = [
                            'name_zh_tw' => $v['zh_tw'],
                            'name_en'    => $v['en'],
                            'name_jp'    => $v['jp'],
                        ];

                        switch ($name) {
                            case 'pokemon':
                                Pokemon::updateOrCreate(['id' => intval($id) + 1], $updates);
                                break;
                            case 'type':
                                Type::updateOrCreate(['id' => $id], $updates);
                                break;
                            case 'ability':
                                Ability::updateOrCreate(['id' => $id], $updates);
                                break;
                            case 'item':
                                Item::updateOrCreate(['id' => $id], $updates);
                                break;
                            case 'nature':
                                Nature::updateOrCreate(['id' => $id], $updates);
                                break;
                            case 'move':
                                $updates['type_id'] = $v['type'];
                                Move::updateOrCreate(['id' => $id], $updates);
                                break;
                        }
                    }
                }

                // 更新 pokemon型態、屬性
                $pokeform = $pm->get_pokeform_type_code();

                foreach ($pokeform as $pm_id => $v) {
                    foreach ($v as $form_id => $w) {
                        $pf = Pokeform::updateOrCreate([
                            'pm_id'   => $pm_id,
                            'form_id' => $form_id,
                        ]);

                        foreach ($w as $type_id) {
                            Poketype::updateOrCreate([
                                'pf_id' => $pf->id,
                                // 有可能會有小數點，將小數點轉成整數
                                'type_id' => intval($type_id),
                            ]);
                        }
                    }
                }

                // 更新賽季列表
                $season_list = $pm->get_season_list();
                $rules = $pm->get_rules();

                foreach ($season_list as $season_num => $data) {
                    $d = array_values($data);

                    $rank_season_list = RankSeasonList::updateOrCreate(
                        ['season' => $season_num],
                        [
                            'season' => $season_num,
                            'start'  => date('Y-m-d H:i:s', strtotime($d[0]['start'])),
                            'end'    => date('Y-m-d H:i:s', strtotime($d[0]['end'])),
                        ]
                    );

                    // 檢查是否 create
                    if ($rank_season_list->wasRecentlyCreated) {
                        foreach ($rules as $r) {
                            $active_pm = $pm->get_season_active_pokemon($d[$r['value']]['reg']);

                            foreach ($active_pm as $v) {
                                $pf = Pokeform::where([
                                    'pm_id'   => intval($v['ino']),
                                    'form_id' => intval($v['ifo']),
                                ])->first();

                                // 有一些比較特殊的型態(薩戮德 阿爸型態)，home 兩個頁面資料不同步
                                // 以 home 主頁面 js 檔資料為主
                                if (empty($pf)) {
                                    continue;
                                }
        
                                RankActivePokemon::updateOrCreate([
                                    'pf_id' => $pf->id,
                                    'season_number' => $season_num,
                                    'rule' => $r['value'],
                                ], [
                                    'active' => $v['av'],
                                ]);
                            }
                        }
                    }
                }

                // 裝備劍的蒼響屬性少一個
                Poketype::updateOrCreate([
                    'pf_id'   => 1235,
                    'type_id' => 8,
                ]);

                // 招式有些會缺少屬性
                $move_type = [
                    '165' => 0,
                    '617' => 17,
                    '826' => 13,
                    '825' => 7,
                    '824' => 14,
                    '823' => 1,
                    '822' => 16,
                    '821' => 13,
                    '820' => 15,
                    '819' => 12,
                    '782' => 8,
                    '781' => 8,
                ];

                foreach ($move_type as $id => $type_id) {
                    Move::where('id', $id)
                        ->update([
                            'type_id' => $type_id,
                        ]);
                }
            });

            // 載入種族值資料
            $command = $this->getApplication()->find('pokemonShowDown:load-baseStat-data');
            $command->run(new ArrayInput([]), $output);

            $this->log->info('pokemonHome:update-data 命令已執行完畢');

            $upload = $input->getOption('upload');
            if ($upload) {
                $command = $this->getApplication()->find('pokemonHome:upload-data-to-S3');
    
                return $command->run(new ArrayInput([]), $output);
            }

            return Command::SUCCESS;
        } catch (\Exception $e) {
            $this->log->error($e->getMessage());
            echo $e->getMessage()."\n";

            return Command::FAILURE;
        }
    }
}
