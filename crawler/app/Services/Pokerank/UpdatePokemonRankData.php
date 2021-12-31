<?php

namespace App\Services\Pokerank;

use App\Models\RankAbility;
use App\Models\RankItem;
use App\Models\RankLoseMove;
use App\Models\RankLosePokemon;
use App\Models\RankMove;
use App\Models\RankNature;
use App\Models\RankPokemon;
use App\Models\RankTopPokemon;
use App\Models\RankWinMove;
use App\Models\RankWinPokemon;
use App\Services\Pokemon\PokemonHome;
use Illuminate\Database\Capsule\Manager as Capsule;

class UpdatePokemonRankData
{
    public function __construct(string $seasons, PokemonHome $pm)
    {
        $seasons = $pm->season_selector($seasons);

        Capsule::transaction(function () use ($pm, $seasons) {
            foreach ($seasons as $season_num) {
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

                $generator = new PokemonRankDataAdapter($season_num, $pm->get_rank_data($season_num));

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

                RankTopPokemon::where('season_number', $season_num)->delete();

                $top_list_generator = new PokemonRankTopListAdapter($season_num, $pm->get_top_pokemon($season_num));

                foreach ($top_list_generator->data() as $data) {
                    RankTopPokemon::insert($data);
                }
            }
        });
    }
}
