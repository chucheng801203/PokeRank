<?php
/**
 * 轉換 PokemonHome::get_rank_data 傳回的資料，轉成資料庫對應的欄位.
 */

namespace App\Services\Pokemon;

use App\Models\Pokeform;

// use Illuminate\Support\Facades\Log;

class PokemonRankDataAdapter
{
    private $season_num;
    private $rank_data;
    private $now;

    public function __construct($season_num, $rank_data)
    {
        $this->season_num = $season_num;
        $this->rank_data = $rank_data;
        $this->now = date('Y-m-d H:i:s');
    }

    public function data()
    {
        // 賽制
        foreach ($this->rank_data as $rule => $w) {
            // 寶可夢編號
            foreach ($w as $pm_id => $x) {
                // 寶可夢型態編號
                foreach ($x as $form_id => $data) {
                    $tables = [];

                    // 取得資料庫裡型態的流水號(id)
                    $pf = Pokeform::where([
                        'pm_id'   => $pm_id,
                        'form_id' => $form_id,
                    ])->first();

                    if (empty($pf)) {
                        // Log::warning("在 pokeform 資料表找不到 pokemon，pm_id = {$pm_id} && form_id = {$form_id}");
                        continue;
                    }

                    $tables['rank_move'] = $this->waza_adapter($pf->id, $rule, $data['temoti']['waza']);
                    $tables['rank_win_move'] = $this->waza_adapter($pf->id, $rule, $data['win']['waza']);
                    $tables['rank_lose_move'] = $this->waza_adapter($pf->id, $rule, $data['lose']['waza']);

                    $tables['rank_pokemon'] = $this->pokemon_adapter($pf->id, $rule, $data['temoti']['pokemon']);
                    $tables['rank_win_pokemon'] = $this->pokemon_adapter($pf->id, $rule, $data['win']['pokemon']);
                    $tables['rank_lose_pokemon'] = $this->pokemon_adapter($pf->id, $rule, $data['lose']['pokemon']);

                    $tables['rank_ability'] = $this->other_adapter($pf->id, $rule, $data['temoti']['tokusei'], 'ability');
                    $tables['rank_item'] = $this->other_adapter($pf->id, $rule, $data['temoti']['motimono'], 'item');

                    // 賽季 9 以前沒有性格資料
                    if (isset($data['temoti']['seikaku'])) {
                        $tables['rank_nature'] = $this->other_adapter($pf->id, $rule, $data['temoti']['seikaku'], 'nature');
                    }

                    yield $tables;
                }
            }
        }
    }

    /**
     * 轉換招式(waza)資料，對應到資料庫中的 rank_move, rank_win_move, rank_lose_move 資料表.
     *
     * @param int
     * @param int 0 (單打) | 1 (雙打)
     * @param array
     *
     * @return array
     */
    public function waza_adapter($pf_id, $rule, $data)
    {
        $table = [];

        foreach ($data as $sort => $move) {
            $table[] = [
                'pf_id'         => $pf_id,
                'season_number' => $this->season_num,
                'rule'          => $rule,
                'move_id'       => $move['id'],
                'percentage'    => $move['val'],
                'sort'          => $sort,
                'created_at'    => $this->now,
                'updated_at'    => $this->now,
            ];
        }

        return $table;
    }

    /**
     * 轉換 pokemon 資料，對應到資料庫中的 rank_pokemon, rank_win_pokemon, rank_lose_pokemon 資料表.
     *
     * @param int
     * @param int 0 (單打) | 1 (雙打)
     * @param array
     *
     * @return array
     */
    public function pokemon_adapter($pf_id, $rule, $data)
    {
        $table = [];

        foreach ($data as $sort => $pokemon) {
            $team_pf = Pokeform::where([
                'pm_id'   => $pokemon['id'],
                'form_id' => $pokemon['form'],
            ])->first();

            if (empty($team_pf)) {
                // Log::warning("在 pokeform 資料表找不到 pokemon，pm_id = {$pokemon['id']} && form_id = {$pokemon['form']}");
                continue;
            }

            $table[] = [
                'pf_id'         => $pf_id,
                'season_number' => $this->season_num,
                'rule'          => $rule,
                'team_pf_id'    => $team_pf->id,
                'sort'          => $sort,
                'created_at'    => $this->now,
                'updated_at'    => $this->now,
            ];
        }

        return $table;
    }

    /**
     * 轉換 pokemon 資料，對應到資料庫中的 rank_ability, rank_nature, rank_item 資料表.
     *
     * @param int
     * @param int 0 (單打) | 1 (雙打)
     * @param array
     * @param string 'ability' | 'nature' | 'item'
     *
     * @return array
     */
    public function other_adapter($pf_id, $rule, $data, $type)
    {
        $table = [];

        foreach ($data as $sort => $item) {
            $table[] = [
                'pf_id'         => $pf_id,
                'season_number' => $this->season_num,
                'rule'          => $rule,
                $type.'_id'     => $item['id'],
                'percentage'    => $item['val'],
                'sort'          => $sort,
                'created_at'    => $this->now,
                'updated_at'    => $this->now,
            ];
        }

        return $table;
    }
}
