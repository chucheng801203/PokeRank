<?php

namespace App\Console\Commands;

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
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class UpdatePokemonRankData extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'pokemon:update-rank
                            {--season=all : 需要更新的賽季}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = '抓取 pokemon home 的賽季資料，並將其存入資料庫';

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
    public function handle(PokemonHome $pm)
    {
        $seasons = $season_input = $this->option('season');

        DB::transaction(function () use ($pm, $seasons) {
            $date_time = date('Y-m-d H:i:s');

            $season_list = $pm->get_season_list();

            foreach ($season_list as $season_num => $data) {
                $d = array_values($data);

                RankSeasonList::updateOrCreate(
                    ['season' => $season_num],
                    [
                        'season' => $season_num,
                        'start' => date('Y-m-d H:i:s', strtotime($d[0]['start'])),
                        'end' => date('Y-m-d H:i:s', strtotime($d[0]['end'])),
                    ]
                );
            }

            switch ($seasons) {
                case 'latest':
                    $seasons = [max(array_keys($season_list))];
                    break;
                case 'all':
                    $seasons = array_keys($season_list);
                    break;
                default:
                    if (! $pm->is_valid_season_num($seasons)) {
                        throw new \Exception('season 為無效參數');
                    }

                    $seasons = [$seasons];
                    break;
            }

            foreach ($seasons as $season_num) {
                $battle_data = $pm->get_rank_data($season_num);

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
                            'pm_id' => $pm_data['id'],
                            'form_id' => $pm_data['form'],
                        ])->first();

                        $data[] = [
                            'pf_id' => $pf->id,
                            'season_number' => $season_num,
                            'rule' => $rule,
                            'ranking' => $ranking,
                            'created_at' => $date_time,
                            'updated_at' => $date_time,
                        ];
                    }

                    RankTopPokemon::insert($data);
                }
            }
        });

        $this->call('pokemon:upload-rank-to-S3', [
            '--season' => $season_input,
        ]);

        Log::info('pokemon:update-rank --season='.$season_input.' 命令已執行完畢');

        return 0;
    }
}
