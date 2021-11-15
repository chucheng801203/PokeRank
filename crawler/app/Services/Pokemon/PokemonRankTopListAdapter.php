<?php
/**
 * 轉換 PokemonHome::get_top_pokemon 傳回的資料，轉成資料庫對應的欄位.
 */

namespace App\Services\Pokemon;

use App\Models\Pokeform;

class PokemonRankTopListAdapter
{
    private $season_num;
    private $top_list_data;
    private $now;

    public function __construct($season_num, $top_list_data)
    {
        $this->season_num = $season_num;
        $this->top_list_data = $top_list_data;
        $this->now = date('Y-m-d H:i:s');
    }

    public function data()
    {
        foreach ($this->top_list_data as $rule => $w) {
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
                    'season_number' => $this->season_num,
                    'rule'          => $rule,
                    'ranking'       => $ranking,
                    'created_at'    => $this->now,
                    'updated_at'    => $this->now,
                ];
            }

            yield $data;
        }
    }
}
