<?php

namespace App\Commands;

require __DIR__.'/../../vendor/autoload.php';

use App\Libraries\Pokemon\PokemonHome;
use App\Models\Pokemon;
use App\Models\RankSeasonList;
use App\Models\RankTopPokemon;
use Aws\S3\S3Client;
use Illuminate\Filesystem\Filesystem;
use Monolog\Logger;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;

class uploadPokemonRankDataToS3 extends Command
{
    protected static $defaultName = 'pokemonHome:upload-rank-to-S3';

    protected static $defaultDescription = '上傳 pokemon home 的賽季資料到 AWS S3';

    public function __construct(Logger $log, Filesystem $fileSystem, S3Client $S3, PokemonHome $pm)
    {
        $this->log = $log;
        $this->fileSystem = $fileSystem;
        $this->S3 = $S3;
        $this->pm = $pm;

        parent::__construct();
    }

    protected function configure(): void
    {
        $this->addOption(
            'season',
            's',
            InputOption::VALUE_OPTIONAL,
            '需要上傳的賽季： all 更新所有賽季, latest 上傳最新賽季, int $number 上傳指定賽季',
            'all'
        );
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        try {
            $fileSystem = $this->fileSystem;
            $S3 = $this->S3;

            $tmp_path = 'pokemon_rank_data_'.date('Ymd');

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

            $pokemons = Pokemon::select('id')->get();

            foreach ($seasons as $season_number) {
                foreach ($pokemons as $pm) {
                    // pokemon 本賽季排名
                    $top_rank = [];
                    $top_rank_data = $pm->rankTopPokemon()
                                    ->with('Pokeform')
                                    ->where('season_number', $season_number)
                                    ->get();

                    foreach ($top_rank_data as $rank) {
                        if (empty($top_rank[$rank->rule])) {
                            $top_rank[$rank->rule] = [];
                        }

                        if (empty($top_rank[$rank->rule][$rank->pokeform->form_id])) {
                            $top_rank[$rank->rule][$rank->pokeform->form_id] = [];
                        }

                        $top_rank[$rank->rule][$rank->pokeform->form_id] = $rank->ranking;
                    }

                    $r = [
                        'rank' => $top_rank,
                        'team' => [
                            // 同隊伍 pokemon 前十
                            'pokemon' => $this->rankPokemonCollection(
                                $pm->rankPokemon()
                                    ->with('Pokeform')
                                    ->with('PokeformTeam')
                                    ->where('season_number', $season_number)
                                    ->orderBy('sort')
                                    ->get()
                            ),
                            // 最常用招式前十
                            'move' => $this->idPercentageCollection(
                                $pm->rankMove()
                                    ->select(['pf_id', 'rule', 'move_id as id', 'percentage'])
                                    ->with(['Pokeform:id,form_id'])
                                    ->where('season_number', $season_number)
                                    ->orderBy('sort')
                                    ->get()
                            ),
                            // 最常用特性
                            'ability' => $this->idPercentageCollection(
                                $pm->rankAbility()
                                    ->select(['pf_id', 'rule', 'ability_id as id', 'percentage'])
                                    ->with(['Pokeform:id,form_id'])
                                    ->where('season_number', $season_number)
                                    ->orderBy('sort')
                                    ->get()
                            ),
                            // 最常用性格
                            'nature' => $this->idPercentageCollection(
                                $pm->rankNature()
                                    ->select(['pf_id', 'rule', 'nature_id as id', 'percentage'])
                                    ->with(['Pokeform:id,form_id'])
                                    ->where('season_number', $season_number)
                                    ->orderBy('sort')
                                    ->get()
                            ),
                            // 最常用道具前十
                            'item' => $this->idPercentageCollection(
                                $pm->rankItem()
                                    ->select(['pf_id', 'rule', 'item_id as id', 'percentage'])
                                    ->with(['Pokeform:id,form_id'])
                                    ->where('season_number', $season_number)
                                    ->orderBy('sort')
                                    ->get()
                            ),
                        ],
                        'win' => [
                            // 最常打倒的 pokemon 前十
                            'pokemon' => $this->rankPokemonCollection(
                                $pm->rankWinPokemon()
                                    ->with('Pokeform')
                                    ->with('PokeformTeam')
                                    ->where('season_number', $season_number)
                                    ->orderBy('sort')
                                    ->get()
                            ),
                            // 打贏對手時所使用的招式前十
                            'move' => $this->idPercentageCollection(
                                $pm->rankWinMove()
                                    ->select(['pf_id', 'rule', 'move_id as id', 'percentage'])
                                    ->with(['Pokeform:id,form_id'])
                                    ->where('season_number', $season_number)
                                    ->orderBy('sort')
                                    ->get()
                            ),
                        ],
                        'lose' => [
                            // 被其他 pokemon 打倒前十
                            'pokemon' => $this->rankPokemonCollection(
                                $pm->rankLosePokemon()
                                    ->with('Pokeform')
                                    ->with('PokeformTeam')
                                    ->where('season_number', $season_number)
                                    ->orderBy('sort')
                                    ->get()
                            ),
                            // 被打倒時所使用的招式前十
                            'move' => $this->idPercentageCollection(
                                $pm->rankLoseMove()
                                    ->select(['pf_id', 'rule', 'move_id as id', 'percentage'])
                                    ->with(['Pokeform:id,form_id'])
                                    ->where('season_number', $season_number)
                                    ->orderBy('sort')
                                    ->get()
                            ),
                        ],
                    ];

                    $content = json_encode($r);
                    $fileSystem->ensureDirectoryExists(storage_path("app/{$tmp_path}/{$season_number}"), 0755, true);
                    $fileSystem->put(storage_path("app/{$tmp_path}/{$season_number}/{$pm->id}.json"), $content);
                    $S3->putObject([
                        'Bucket'       => $_ENV['AWS_BUCKET'],
                        'Key'          => "rank_data/{$season_number}/{$pm->id}.json",
                        'Body'         => $content,
                        'ACL'          => 'public-read',
                        'CacheControl' => 'max-age=10800',
                    ]);

                    echo "{$season_number} {$pm->id}\n";
                }

                $fileSystem->ensureDirectoryExists(storage_path("app/{$tmp_path}/{$season_number}/top_list"), 0755, true);

                $single_top_list = json_encode(
                    $this->rankTopPokemonResource(
                        RankTopPokemon::with('pokeform')
                                    ->where('season_number', $season_number)
                                    ->where('rule', 0)
                                    ->orderBy('ranking')
                                    ->get()
                    )
                );

                $fileSystem->put(storage_path("app/{$tmp_path}/{$season_number}/top_list/0.json"), $single_top_list);
                $S3->putObject([
                    'Bucket'       => $_ENV['AWS_BUCKET'],
                    'Key'          => "rank_data/{$season_number}/top_list/0.json",
                    'Body'         => $single_top_list,
                    'ACL'          => 'public-read',
                    'CacheControl' => 'max-age=10800',
                ]);

                $doublie_top_list = json_encode(
                    $this->rankTopPokemonResource(
                        RankTopPokemon::with('pokeform')
                                    ->where('season_number', $season_number)
                                    ->where('rule', 1)
                                    ->orderBy('ranking')
                                    ->get()
                    )
                );
                $fileSystem->put(storage_path("app/{$tmp_path}/{$season_number}/top_list/1.json"), $doublie_top_list);
                $S3->putObject([
                    'Bucket'       => $_ENV['AWS_BUCKET'],
                    'Key'          => "rank_data/{$season_number}/top_list/1.json",
                    'Body'         => $doublie_top_list,
                    'ACL'          => 'public-read',
                    'CacheControl' => 'max-age=10800',
                ]);
            }

            $this->log->info('pokemonHome:upload-rank-to-S3 命令已執行完畢');

            return Command::SUCCESS;
        } catch (\Exception $e) {
            $this->log->error($e->getMessage());
            echo $e->getMessage()."\n";

            return Command::FAILURE;
        }
    }

    /**
     * @param Illuminate\Support\Collection
     */
    public function rankPokemonCollection($collection)
    {
        $data = [];

        foreach ($collection as $rank) {
            if (empty($data[$rank->rule])) {
                $data[$rank->rule] = [];
            }

            if (empty($data[$rank->rule][$rank->pokeform->form_id])) {
                $data[$rank->rule][$rank->pokeform->form_id] = [];
            }

            $data[$rank->rule][$rank->pokeform->form_id][] = [
                'id'      => $rank->pokeformTeam->pm_id,
                'form_id' => $rank->pokeformTeam->form_id,
            ];
        }

        return $data;
    }

    /**
     * @param Illuminate\Support\Collection
     */
    public function idPercentageCollection($collection)
    {
        $data = [];

        foreach ($collection as $rank) {
            if (empty($data[$rank->rule])) {
                $data[$rank->rule] = [];
            }

            if (empty($data[$rank->rule][$rank->pokeform->form_id])) {
                $data[$rank->rule][$rank->pokeform->form_id] = [];
            }

            $data[$rank->rule][$rank->pokeform->form_id][] = [
                'id'         => $rank->id,
                'percentage' => $rank->percentage,
            ];
        }

        return $data;
    }

    /**
     * @param Illuminate\Support\Collection
     */
    public function rankTopPokemonResource($collection)
    {
        return $collection->map(function ($item, $key) {
            return [
                'ranking' => $item['ranking'],
                'pokemon' => [
                    'id'      => $item['pokeform']['pm_id'],
                    'form_id' => $item['pokeform']['form_id'],
                ],
            ];
        });
    }
}
