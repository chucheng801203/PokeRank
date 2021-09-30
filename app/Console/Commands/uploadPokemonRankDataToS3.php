<?php

namespace App\Console\Commands;

use App\Http\Resources\IdPercentageCollection;
use App\Http\Resources\RankPokemonCollection;
use App\Http\Resources\RankTopPokemonResource;
use App\Models\Pokeform;
use App\Models\Pokemon;
use App\Models\RankSeasonList;
use App\Models\RankTopPokemon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class uploadPokemonRankDataToS3 extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'pokemon:upload-rank-to-S3
                            {--season=all : 需要上傳的賽季}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = '上傳 pokemon home 的賽季資料到 AWS S3';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $tmp_path = 'pokemon_rank_data_'.date('Ymd');

        $seasons = $season_input = $this->option('season');

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
                        'pokemon' => new RankPokemonCollection(
                            $pm->rankPokemon()
                                ->with('Pokeform')
                                ->with('PokeformTeam')
                                ->where('season_number', $season_number)
                                ->orderBy('sort')
                                ->get()
                        ),
                        // 最常用招式前十
                        'move' => new IdPercentageCollection(
                            $pm->rankMove()
                                ->select(['pf_id', 'rule', 'move_id as id', 'percentage'])
                                ->with(['Pokeform:id,form_id'])
                                ->where('season_number', $season_number)
                                ->orderBy('sort')
                                ->get()
                        ),
                        // 最常用特性
                        'ability' => new IdPercentageCollection(
                            $pm->rankAbility()
                                ->select(['pf_id', 'rule', 'ability_id as id', 'percentage'])
                                ->with(['Pokeform:id,form_id'])
                                ->where('season_number', $season_number)
                                ->orderBy('sort')
                                ->get()
                        ),
                        // 最常用性格
                        'nature' => new IdPercentageCollection(
                            $pm->rankNature()
                                ->select(['pf_id', 'rule', 'nature_id as id', 'percentage'])
                                ->with(['Pokeform:id,form_id'])
                                ->where('season_number', $season_number)
                                ->orderBy('sort')
                                ->get()
                        ),
                        // 最常用道具前十
                        'item' => new IdPercentageCollection(
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
                        'pokemon' => new RankPokemonCollection(
                            $pm->rankWinPokemon()
                                ->with('Pokeform')
                                ->with('PokeformTeam')
                                ->where('season_number', $season_number)
                                ->orderBy('sort')
                                ->get()
                        ),
                        // 打贏對手時所使用的招式前十
                        'move' => new IdPercentageCollection(
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
                        'pokemon' => new RankPokemonCollection(
                            $pm->rankLosePokemon()
                                ->with('Pokeform')
                                ->with('PokeformTeam')
                                ->where('season_number', $season_number)
                                ->orderBy('sort')
                                ->get()
                        ),
                        // 被打倒時所使用的招式前十
                        'move' => new IdPercentageCollection(
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
                Storage::put($tmp_path.'/'.$season_number.'/'.$pm->id.'.json', $content);
                Storage::disk('s3')->put('rank_data/'.$season_number.'/'.$pm->id.'.json', $content, [
                    'visibility' => 'public',
                    'CacheControl' => 'max-age=86400',
                ]);

                echo "{$season_number} {$pm->id}\n";
            }

            $single_top_list = json_encode(
                RankTopPokemonResource::collection(
                    RankTopPokemon::where('season_number', $season_number)
                                ->where('rule', 0)
                                ->orderBy('ranking')
                                ->get()
                )
            );
            Storage::put($tmp_path.'/'.$season_number.'/top_list/0.json', $content);
            Storage::disk('s3')->put('rank_data/'.$season_number.'/top_list/0.json', $single_top_list, [
                'visibility' => 'public',
                'CacheControl' => 'max-age=86400',
            ]);

            $doublie_top_list = json_encode(
                RankTopPokemonResource::collection(
                    RankTopPokemon::where('season_number', $season_number)
                                ->where('rule', 1)
                                ->orderBy('ranking')
                                ->get()
                )
            );
            Storage::put($tmp_path.'/'.$season_number.'/top_list/1.json', $content);
            Storage::disk('s3')->put('rank_data/'.$season_number.'/top_list/1.json', $doublie_top_list, [
                'visibility' => 'public',
                'CacheControl' => 'max-age=86400',
            ]);
        }

        Log::info('pokemon:upload-rank-to-S3 --season='.$season_input.' 命令已執行完畢');

        return 0;
    }
}
