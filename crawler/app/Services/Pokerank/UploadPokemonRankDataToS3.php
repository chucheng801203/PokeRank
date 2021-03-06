<?php

namespace App\Services\Pokerank;

use App\Models\Pokemon;
use App\Models\RankActivePokemon;
use App\Models\RankTopPokemon;
use App\Services\Pokemon\PokemonHome;
use Aws\S3\S3Client;
use Illuminate\Filesystem\Filesystem;

class UploadPokemonRankDataToS3
{
    public function __construct(string $seasons, Filesystem $fileSystem, S3Client $S3, PokemonHome $pm)
    {
        $tmp_path = 'pokemon_rank_data_'.date('Ymd');

        $seasons = $pm->season_selector($seasons);

        $rules = $pm->get_rules();
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
                    'CacheControl' => 'max-age=1800, must-revalidate',
                    'ContentType'  => 'application/json',
                ]);

                echo "{$season_number} {$pm->id}\n";
            }

            $fileSystem->ensureDirectoryExists(storage_path("app/{$tmp_path}/{$season_number}/top_list"), 0755, true);
            $fileSystem->ensureDirectoryExists(storage_path("app/{$tmp_path}/{$season_number}/active_pokemon"), 0755, true);

            // 使用率排名和可以使用的寶可夢列表
            foreach ($rules as $r) {
                $d = json_encode(
                    $this->rankTopPokemonResource(
                        RankTopPokemon::with('pokeform')
                                    ->where('season_number', $season_number)
                                    ->where('rule', $r['value'])
                                    ->orderBy('ranking')
                                    ->get()
                    )
                );

                $fileSystem->put(storage_path("app/{$tmp_path}/{$season_number}/top_list/{$r['value']}.json"), $d);

                $S3->putObject([
                    'Bucket'       => $_ENV['AWS_BUCKET'],
                    'Key'          => "rank_data/{$season_number}/top_list/{$r['value']}.json",
                    'Body'         => $d,
                    'ACL'          => 'public-read',
                    'CacheControl' => 'max-age=1800, must-revalidate',
                    'ContentType'  => 'application/json',
                ]);

                $d = json_encode(
                    $this->rankActivePokemonResource(
                        RankActivePokemon::with('pokeform')
                                    ->where('season_number', $season_number)
                                    ->where('rule', $r['value'])
                                    ->where('active', 1)
                                    ->orderBy('pf_id')
                                    ->get()
                    )
                );

                $fileSystem->put(storage_path("app/{$tmp_path}/{$season_number}/active_pokemon/{$r['value']}.json"), $d);

                $S3->putObject([
                    'Bucket'       => $_ENV['AWS_BUCKET'],
                    'Key'          => "rank_data/{$season_number}/active_pokemon/{$r['value']}.json",
                    'Body'         => $d,
                    'ACL'          => 'public-read',
                    'CacheControl' => 'max-age=31536000',
                    'ContentType'  => 'application/json',
                ]);
            }
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

    /**
     * @param Illuminate\Support\Collection
     */
    public function rankActivePokemonResource($collection)
    {
        return $collection->map(function ($item, $key) {
            return [
                'pf_id'   => $item['pf_id'],
                'id'      => $item['pokeform']['pm_id'],
                'form_id' => $item['pokeform']['form_id'],
            ];
        });
    }
}
