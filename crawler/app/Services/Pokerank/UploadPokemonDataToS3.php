<?php

namespace App\Services\Pokerank;

use App\Models\Ability;
use App\Models\Item;
use App\Models\Move;
use App\Models\Nature;
use App\Models\Pokemon;
use App\Models\Poketype;
use App\Models\RankSeasonList;
use App\Models\SdBaseStat;
use App\Models\Type;
use App\Services\Pokemon\PokemonHome;
use Aws\S3\S3Client;
use Illuminate\Filesystem\Filesystem;

class UploadPokemonDataToS3
{
    public function __construct(Filesystem $fileSystem, S3Client $S3, PokemonHome $pm)
    {
        $pr_data = [
            // 賽季列表
            'seasons' => RankSeasonList::all()->map(function ($item, $key) {
                return [
                    'value' => $item->season,
                    'text'  => '第 '.$item->season.' 季',
                    'start' => $item->start,
                    'end'   => $item->end,
                ];
            }),

            // 賽制
            'rules' => $pm->get_rules(),

            // 道具
            'items' => Item::all()->mapWithKeys(function ($item, $key) {
                return [
                    $item['id'] => [
                        'id'   => $item['id'],
                        'name' => $item['name_zh_tw'],
                    ],
                ];
            }),

            // 特性
            'abilities' => Ability::all()->mapWithKeys(function ($item, $key) {
                return [
                    $item['id'] => [
                        'id'   => $item['id'],
                        'name' => $item['name_zh_tw'],
                    ],
                ];
            }),

            // 屬性
            'types' => Type::all()->mapWithKeys(function ($item, $key) {
                return [$item['id'] => $item['name_zh_tw']];
            }),

            // 招式
            'moves' => Move::all()->mapWithKeys(function ($item, $key) {
                return [
                    $item['id'] => [
                        'id'      => $item['id'],
                        'name'    => $item['name_zh_tw'],
                        'type_id' => $item['type_id'],
                    ],
                ];
            }),

            // 性格
            'natures' => Nature::all()->mapWithKeys(function ($item, $key) {
                return [
                    $item['id'] => [
                        'id'   => $item['id'],
                        'name' => $item['name_zh_tw'],
                    ],
                ];
            }),

            // pokemon 圖鑑名稱
            'pokemon' => Pokemon::all()->mapWithKeys(function ($item, $key) {
                return [$item['id'] => $item['name_zh_tw']];
            }),

            // pokemon 個型態的屬性
            'pokemon_types' => Poketype::all()->mapToGroups(function ($item, $key) {
                return [
                    $item['pokeform']['pm_id'] => [
                        'form_id' => $item['pokeform']['form_id'],
                        'type_id' => $item['type_id'],
                    ],
                ];
            })->map(function ($item, $key) {
                return $item->mapToGroups(function ($item, $key) {
                    return [$item['form_id'] => $item['type_id']];
                });
            }),

            // pokemon 種族值
            'base_stats' => SdBaseStat::all()->mapToGroups(function ($item, $key) {
                return [
                    $item['pokeform']['pm_id'] => [
                        'form_id'   => $item['pokeform']['form_id'],
                        'baseStats' => [
                            'hp'  => $item['hp'],
                            'atk' => $item['atk'],
                            'def' => $item['def'],
                            'spa' => $item['spa'],
                            'spd' => $item['spd'],
                            'spe' => $item['spe'],
                        ],
                    ],
                ];
            })->map(function ($item, $key) {
                return $item->mapWithKeys(function ($item, $key) {
                    return [$item['form_id'] => $item['baseStats']];
                });
            }),

            // 各屬性之間的傷害倍率
            'type_weakness' => $pm->type_weakness(),
        ];

        $file_name = 'pokemon_data_'.date('Ymd').'.json';

        $fileSystem->put(storage_path("app/{$file_name}"), json_encode($pr_data));

        $S3->putObject([
            'Bucket'       => $_ENV['AWS_BUCKET'],
            'Key'          => 'pr_data.json',
            'SourceFile'   => storage_path("app/{$file_name}"),
            'ACL'          => 'public-read',
            'CacheControl' => 'max-age=10800, must-revalidate',
            'ContentType'  => 'application/json',
        ]);
    }
}