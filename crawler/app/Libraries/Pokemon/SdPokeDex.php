<?php
/**
 * pokemon 圖鑑資料，裡面有寶可夢資料包含種族值的資料，但是只有英文
 */

namespace App\Libraries\Pokemon;

use App\Libraries\Pokemon\Exceptions\PokemonException;

class SdPokeDex
{
    private $data;

    public function __construct()
    {
        $data_path = __DIR__.'/data/dex_en.json';

        if (($data = @file_get_contents($data_path)) === false) {
            throw new PokemonException("file_get_contents({$data_path}): 無法抓取檔案");
        }

        $this->data = json_decode($data, true);
    }

    public function all() {
        return $this->data;
    }

    public function getById(int $id) {
        $dex = array_filter($this->data, function($pm) use($id) {
            return $pm['num'] === $id;
        });

        $dex_values = array_values($dex);

        if (count($dex_values) === 0) {
            return [];
        }

        if (count($dex_values) === 1) {
            return $dex_values;
        }

        if (!isset($dex_values[0]['formeOrder']) || !is_array($dex_values[0]['formeOrder']) || count($dex_values[0]['formeOrder']) < 2) {
            return [$dex_values[0]];
        }

        return array_map(function($formeName) use ($dex) {
            $formeName = strtolower(str_replace('-', '', $formeName));
            if (!isset($dex[$formeName])) {
                return null;
            }

            return $dex[$formeName];
        }, $dex_values[0]['formeOrder']);
    }
}
