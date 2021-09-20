<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\RankSeasonList;
use App\Models\Item;
use App\Models\Ability;
use App\Models\Move;
use App\Models\Nature;
use App\Models\Type;
use App\Models\Pokemon;
use App\Models\Poketype;
use App\Http\Resources\RankSeasonListResource;
use App\Http\Resources\IdNameCollection;
use App\Http\Resources\MoveCollection;
use App\Http\Resources\PokeTypeCollection;
use App\Libraries\Pokemon\PokemonHome;

class MainController extends Controller
{
    /**
     * SPA 入口
     *
     * @param  \Illuminate\Http\Request  $request
     */
    public function __invoke(Request $request, PokemonHome $pm)
    {
        $pr_data = [
            // 賽季列表
            'seasons' => RankSeasonListResource::collection(RankSeasonList::all()),
            
            // 賽制
            'rules' => [
                ['value'=> 0, 'text' => '單打'],
                ['value'=> 1, 'text' => '雙打'],
            ],

            // 道具
            'items' => new IdNameCollection(Item::all()),

            // 特性
            'abilities' => new IdNameCollection(Ability::all()),

            // 屬性
            'types' => new IdNameCollection(Type::all()),

            // 招式
            'moves' => new MoveCollection(Move::all()),

            // 性格
            'natures' => new IdNameCollection(Nature::all()),

            // pokemon 圖鑑名稱
            'pokemon' => new IdNameCollection(Pokemon::all()),

            // pokemon 個型態的屬性
            'pokemon_types' => new PokeTypeCollection(Poketype::all()),

            // 各屬性之間的傷害倍率
            'type_weakness' => $pm->type_weakness(),
        ];

        return view('welcome', [ 'pr_data' => $pr_data ]);
    }
}
