<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Pokemon;
use App\Models\Pokeform;
use App\Models\RankTopPokemon;
use App\Http\Resources\RankTopPokemonResource;
use App\Http\Resources\IdPercentageCollection;
use App\Http\Resources\RankPokemonCollection;

class RankController extends Controller
{
    /**
     * 顯示指定賽季 rank 前 150 名的 pokemon
     *
     * @param int $season_number 賽季
     * @param int $rule 賽制(0=單打 或 1=雙打)
     */
    public function top150($season_number, $rule)
    {
        $r = RankTopPokemonResource::collection(
            RankTopPokemon::where('season_number', $season_number)
                        ->where('rule', $rule)
                        ->orderBy('ranking')
                        ->get()
        );

        return response()->json($r);
    }

    /**
     * 顯示指定賽季 rank pokemon 的詳細資料
     *
     * @param int $season_number 賽季
     * @param int $id pokemon 編號
     */
    public function pokemon($season_number, $id)
    {
        $pm = Pokemon::find($id);

        // pokemon 本賽季排名
        $top_rank = [];
        $top_rank_data = $pm->rankTopPokemon()
                        ->with('Pokeform')
                        ->where('season_number', $season_number)
                        ->get();
        
        foreach($top_rank_data as $rank) {
            if(empty($top_rank[$rank->rule]))
                $top_rank[$rank->rule] = [];

            if(empty($top_rank[$rank->rule][$rank->pokeform->form_id]))
                $top_rank[$rank->rule][$rank->pokeform->form_id] = [];
            
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

        return response()->json($r);
    }
}
