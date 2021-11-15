<?php
/**
 * 解析 pokemon home js 檔案的靜態資料.
 */

namespace App\Services\Pokemon;

use App\Services\Pokemon\Exceptions\PokemonException;
use App\Services\Pokemon\Exceptions\PokemonFormatException;

class PokemonHomeJsParser
{
    // pokemon home 網頁 js 檔
    const JS_SOURCE_URL = 'https://resource.pokemon-home.com/battledata/js/bundle.js';

    private function __construct()
    {
    }

    public static function get_parser()
    {
        return new self();
    }

    /**
     * 解析 pokemon home 的 js 檔，裡面有 pokemon 名稱、屬性、招式、特性...等資料.
     *
     * @param string 資料名稱
     *
     * @return array
     */
    public function data($name)
    {
        $data = [];

        switch ($name) {
            case 'poke':
            case 'pokeType':
                $data[$name] = $this->parse1($name);
                break;
            case 'waza':
            case 'tokusei':
            case 'item':
            case 'seikaku':
            case 'wazaType':
                $data[$name] = $this->parse2($name);
                break;
        }

        if (isset($data['waza']) && is_array($data['waza'])) {
            $wazaType = $this->parse2('wazaType');

            foreach ($data['waza'] as $i => &$v) {
                $v['type'] = isset($wazaType[$i]) ? $wazaType[$i] : null;
            }
        }

        return $data;
    }

    /**
     * 把不同語系同一種資料放到同陣列.
     *
     * @param array
     *
     * @return array
     */
    public function array_cols($data)
    {
        $d = [];

        foreach ($data['jp'] as $i => $v) {
            $d[$i] = [
                'jp'    => isset($v) ? $v : null,
                'zh_tw' => isset($data['zh_tw'][$i]) ? $data['zh_tw'][$i] : null,
                'en'    => isset($data['en'][$i]) ? $data['en'][$i] : null,
            ];
        }

        return $d;
    }

    /**
     * 解析 pokemon home 的 js 檔 pokemon 名稱和屬性種類的資料.
     *
     * @param string poke(名稱) | pokeType(屬性)
     *
     * @return array
     */
    public function parse1($name)
    {
        $source_data = $this->get_source();

        // 抓取陣列類型的資料
        if (!preg_match_all("/{$name}:(\[.*\])/U", $source_data, $match)) {
            throw new PokemonFormatException();
        }

        $jp = json_decode($match[1][0], true);
        $en = json_decode($match[1][1], true);
        $zh_tw = json_decode($match[1][8], true);

        if (empty($jp) || empty($en) || empty($zh_tw)) {
            throw new PokemonFormatException();
        }

        return $this->array_cols([
            'jp'    => $jp,
            'en'    => $en,
            'zh_tw' => $zh_tw,
        ]);
    }

    /**
     * 解析 pokemon home 的 js 檔 pokemon 招式、道具、性格和特性的資料.
     *
     * @param string waza(招式) | tokusei(特性) | item(道具) | seikaku(性格) | wazaType(招式屬性)
     *
     * @return array
     */
    public function parse2($name)
    {
        $source_data = $this->get_source();

        // 抓取物件類型的資料
        if (!preg_match_all("/{$name}:\{(.*)\}/U", $source_data, $match)) {
            throw new PokemonFormatException();
        }

        if ($name === 'wazaType') {
            // pokemon home index 1000 時用 1e3 表示
            $r = preg_replace_callback('/(\w+):(\d+)/', function ($m) {
                return '"'.intval($m[1]).'":'.intval($m[2]);
            }, $match[1][0]);

            $r = json_decode('{'.$r.'}', true);

            if (empty($r)) {
                throw new PokemonFormatException();
            }

            return $r;
        }

        $data = [];

        $data['jp'] = $match[1][0];
        $data['en'] = $match[1][1];
        $data['zh_tw'] = $match[1][8];

        foreach ($data as $k => &$w) {
            // pokemon home index 1000 時用 1e3 表示
            $w = preg_replace_callback('/(\w+):(".*")/U', function ($m) {
                return '"'.intval($m[1]).'":'.$m[2];
            }, $w);

            $w = json_decode('{'.$w.'}', true);
            if (empty($w)) {
                throw new PokemonFormatException();
            }
        }

        return $this->array_cols($data);
    }

    /**
     * 解析 pokemon home 賽季可用寶可夢資料.
     *
     * @param string PokemonHome::get_season_list() 賽季列表回傳的資料
     *
     * @return array
     */
    public function season_active_pokemon($reg)
    {
        $source_data = $this->get_active_pokemon_page_source($reg);

        if (!preg_match("/const P_LIST = (\[.*\]);/U", $source_data, $match)) {
            throw new PokemonFormatException();
        }

        $r = json_decode($match[1], true);

        if (empty($r)) {
            throw new PokemonFormatException();
        }

        $data = [];

        foreach ($r as $v) {
            $data = array_merge($data, $v);
        }

        return $data;
    }

    /**
     * 取得所有 pokemon 型態編號，及其對應的屬性的編號
     *
     * @return array
     */
    public function get_pokemon_form_code()
    {
        $source_data = $this->get_source();

        if (!preg_match_all("/pokeType:\{(.*\})\}/U", $source_data, $match)) {
            throw new PokemonFormatException();
        }

        if (!preg_match_all('/\w+:\{.*\}/U', $match[1][0], $match)) {
            throw new PokemonFormatException();
        }

        $pokeform = [];

        foreach ($match[0] as $v) {
            // &1 = 寶可夢編號
            // pokemon home 索引 1000 時會用 1e3 表示
            if (!preg_match('/(\w+):\{(.+)\}/U', $v, $m)) {
                throw new PokemonFormatException();
            }

            $pokeform[$m[1]] = [];

            // &1 = 寶可夢型態編號，&2 = 寶可夢屬性
            if (!preg_match_all('/(\d+):(\[.+\])/U', $m[2], $m2)) {
                throw new PokemonFormatException();
            }

            foreach ($m2[1] as $k => $w) {
                $pokeform[$m[1]][$w] = json_decode($m2[2][$k], true);
            }
        }

        return $pokeform;
    }

    /**
     * 取得 pokemon home 的 js 檔.
     *
     * @return string
     */
    public function get_source()
    {
        static $source = null;

        if (!empty($source)) {
            return $source;
        }

        if (($s = @file_get_contents(self::JS_SOURCE_URL)) == false) {
            throw new PokemonException('file_get_contents('.self::JS_SOURCE_URL.'): 無法抓取檔案');
        }

        $source = $s;

        return $source;
    }

    /**
     * 取得 pokemon home 賽季可用寶可夢頁面的 html 檔.
     *
     * @param string PokemonHome::get_season_list() 賽季列表回傳的資料
     *
     * @return string
     */
    public function get_active_pokemon_page_source($reg)
    {
        $url = "https://battle.pokemon-home.com/regulation/{$reg}/available-pokemon-list-ja-s";

        if (($s = @file_get_contents($url)) == false) {
            throw new PokemonException('file_get_contents('.$url.'): 無法抓取檔案');
        }

        return $s;
    }
}
