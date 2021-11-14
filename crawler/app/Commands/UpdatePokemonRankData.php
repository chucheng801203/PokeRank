<?php

namespace App\Commands;

use App\Libraries\Pokemon\PokemonHome;
use App\Libraries\Pokemon\PokemonRankDataAdapter;
use App\Models\Pokeform;
use App\Models\RankAbility;
use App\Models\RankItem;
use App\Models\RankLoseMove;
use App\Models\RankLosePokemon;
use App\Models\RankMove;
use App\Models\RankNature;
use App\Models\RankPokemon;
use App\Models\RankSeasonList;
use App\Models\RankTopPokemon;
use App\Models\RankWinMove;
use App\Models\RankWinPokemon;
use Illuminate\Database\Capsule\Manager as Capsule;
use Monolog\Logger;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\ArrayInput;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;

class UpdatePokemonRankData extends Command
{
    protected static $defaultName = 'pokemonHome:update-rank';

    protected static $defaultDescription = '抓取 pokemon home 的賽季資料(排名、道具使用率、招式使用率...)，並將其存入資料庫';

    public function __construct(Logger $log, PokemonHome $pm)
    {
        $this->log = $log;
        $this->pm = $pm;

        parent::__construct();
    }

    protected function configure(): void
    {
        $this->addOption(
            'season',
            's',
            InputOption::VALUE_OPTIONAL,
            '需要更新的賽季： all 更新所有賽季, latest 更新最新賽季, int $number 更新指定賽季',
            'all'
        );

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
            $seasons = $season_input = $input->getOption('season');

            switch ($seasons) {
                case 'latest':
                    $seasons = [RankSeasonList::select('season')->max('season')];
                    break;
                case 'all':
                    $seasons = array_column(RankSeasonList::select('season')->get()->toArray(), 'season');
                    break;
                default:
                    $seasons = array_column(RankSeasonList::select('season')->where('season', $seasons)->get()->toArray(), 'season');

                    if (count($seasons) === 0) {
                        throw new \Exception('season 為無效參數');
                    }

                    break;
            }

            $pm = $this->pm;

            Capsule::transaction(function () use ($pm, $seasons) {
                $date_time = date('Y-m-d H:i:s');

                foreach ($seasons as $season_num) {
                    $battle_data = $pm->get_rank_data($season_num);

                    // 先刪除資料庫已存在該賽季的資料
                    RankMove::where('season_number', $season_num)->delete();
                    RankWinMove::where('season_number', $season_num)->delete();
                    RankLoseMove::where('season_number', $season_num)->delete();

                    RankPokemon::where('season_number', $season_num)->delete();
                    RankWinPokemon::where('season_number', $season_num)->delete();
                    RankLosePokemon::where('season_number', $season_num)->delete();

                    RankAbility::where('season_number', $season_num)->delete();
                    RankItem::where('season_number', $season_num)->delete();
                    RankNature::where('season_number', $season_num)->delete();

                    $generator = new PokemonRankDataAdapter($season_num, $battle_data);

                    foreach ($generator->data() as $data) {
                        RankMove::insert($data['rank_move']);
                        RankWinMove::insert($data['rank_win_move']);
                        RankLoseMove::insert($data['rank_lose_move']);

                        RankPokemon::insert($data['rank_pokemon']);
                        RankWinPokemon::insert($data['rank_win_pokemon']);
                        RankLosePokemon::insert($data['rank_lose_pokemon']);

                        RankAbility::insert($data['rank_ability']);
                        RankItem::insert($data['rank_item']);

                        if (isset($data['rank_nature'])) {
                            RankNature::insert($data['rank_nature']);
                        }
                    }

                    $top_list = $pm->get_top_pokemon($season_num);

                    RankTopPokemon::where('season_number', $season_num)->delete();

                    foreach ($top_list as $rule => $w) {
                        $data = [];

                        foreach ($w as $ranking => $pm_data) {
                            $pf = Pokeform::where([
                                'pm_id'   => $pm_data['id'],
                                'form_id' => $pm_data['form'],
                            ])->first();

                            if (empty($pf)) {
                                continue;
                            }

                            $data[] = [
                                'pf_id'         => $pf->id,
                                'season_number' => $season_num,
                                'rule'          => $rule,
                                'ranking'       => $ranking,
                                'created_at'    => $date_time,
                                'updated_at'    => $date_time,
                            ];
                        }

                        RankTopPokemon::insert($data);
                    }
                }
            });

            $this->log->info('pokemonHome:update-rank 命令已執行完畢');

            $upload = $input->getOption('upload');
            if ($upload) {
                $command = $this->getApplication()->find('pokemonHome:upload-rank-to-S3');

                $arguments = [
                    '--season'  => $season_input,
                ];
    
                return $command->run(new ArrayInput($arguments), $output);
            }

            return Command::SUCCESS;
        } catch (\Exception $e) {
            $this->log->error($e->getMessage());
            echo $e->getMessage()."\n";

            return Command::FAILURE;
        }
    }
}
