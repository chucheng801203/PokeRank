<?php
/**
 * 取得 pokemon home 靜態資料與每個 pokemon rank 資料
 */

namespace App\Libraries\Pokemon;

use App\Libraries\Pokemon\Exceptions\PokemonException;
use App\Libraries\Pokemon\Exceptions\PokemonFormatException;

class PokemonHome {
    // pokemon 圖片網址路徑
    const POKEMON_IMAGE_URL = 'https://resource.pokemon-home.com/battledata/img/poke/';
    
    const RANK_LIST_URL = 'https://api.battle.pokemon-home.com/cbd/competition/rankmatch/list';

    const RANK_DATA_URL = 'https://resource.pokemon-home.com/battledata/ranking';

    /**
     * 取得 pokemon 名稱、屬性、招式、特性...等資料
     * 
     * @param string pokemon(名稱) | type(屬性)| move(招式) | ability(特性) | item(道具) | nature(性格) | moveType(招式屬性)
     * 
     * @return array
     */
    public function get_pokemon_data($name = '') {
        $parser = PokemonHomeJsParser::get_parser();

        $switch_name = $this->switch_name($name);

        return [
            $name => $parser->data($switch_name)[$switch_name]
        ];
    }

    /**
     * 切換本地資料命名與 pokemon home js 檔的資料命名
     * 
     * @param string
     * 
     * @return string
     */
    public function switch_name($name) {
        switch ($name) {
            case 'pokemon':
                return 'poke';
            case 'type':
                return 'pokeType';
            case 'ability':
                return 'tokusei';
            case 'item':
                return 'item';
            case 'nature':
                return 'seikaku';
            case 'move':
                return 'waza';
            case 'moveType':
                return 'wazaType';
            default:
                throw new PokemonFormatException();
        }
    }

    /**
     * 取得所有 pokemon 型態編號，及其對應的屬性的編號
     * 
     * @return array
     */
    public function get_pokeform_type_code () {
        $parser = PokemonHomeJsParser::get_parser();

        return $parser->get_pokemon_form_code();
    }

    /**
     * 下載 pokemon home 的 pokemon 圖片
     * 
     * @param string $directory 要把檔案存到哪個目錄
     * @param string $poke_id pokemon 圖鑑編號
     * @param string $form_id pokemon 型態編號
     * 
     * @return void
     */
    public function download_pokemon_image($directory, $poke_id, $form_id) {
        $img_name = 'cap' . sprintf("%04d", $poke_id) . '_f' . sprintf("%02d", $form_id) . '_s0.png';
        $local_img_name = 'cap' . $poke_id . '_f' . $form_id . '_s0.png';

        // 來悲茶圖片不分正品和贗品
        $img_url = self::POKEMON_IMAGE_URL . ($poke_id === 854 ? 'cap0854_f00_s0.png' : $img_name);
        $save_name = $directory . '/' . $local_img_name;

        if (($file = @file_get_contents($img_url)) == false) {
            throw new PokemonException("file_get_contents({$img_url}): 無法抓取檔案");
        }

        file_put_contents($save_name, $file);
    }

    /**
     * 下載 pokemon rank 賽季列表
     * 
     * @return array
     */
    public function get_season_list() {
        static $season_list = NULL;

        if (! empty($season_list)) {
            return $season_list;
        }

        $client = new \GuzzleHttp\Client();

        $result = $client->request('POST', self::RANK_LIST_URL, [
            'json' => ['soft' => 'Sw']
        ]);

        $result = json_decode((string)$result->getBody(), true);
    
        if(empty($result['list']) || ! is_array($result['list'])) {
            throw new PokemonFormatException();
        }

        $season_list = $result['list'];

        return $result['list'];
    }

    /**
     * 檢查數字是否是有效的賽季
     * 
     * @param mixed string | int
     * 
     * @return boolean
     */
    public function is_valid_season_num($num) {
        $season_list = $this->get_season_list();

        if (is_string($num)) {
            if (! preg_match('/^\d+$/', $num)) {
                return false;
            }

            $num = intval($num);
        }

        if ($num === 0 || $num > max(array_keys($season_list))) {
            return false;
        }

        return true;
    }

    /**
     * 下載指定賽季 pokemon 對戰資料
     * 
     * @param int $season_number 指定賽季資料
     * 
     * @return array
     */
    public function get_rank_data($season_number) {
        $season_list = $this->get_season_list();

        $season = $season_list[$season_number];

        $pm_data = [];

        $client = new \GuzzleHttp\Client();

        foreach ($season as $cid => $v) {
            if ($v['rst'] === 0 && $v['ts2'] === 0) {
                throw new PokemonFormatException();
            }

            $i = 1;

            do {
                $pdetail_url = self::RANK_DATA_URL . '/' . $cid . '/' . $v['rst'] . '/' . $v['ts2'] . '/pdetail-' . $i;

                $result = NULL;
                try {
                    $result = $client->request('GET', $pdetail_url);
                } catch (\Throwable $th) {
                    $result = NULL;
                }

                if ($result === NULL) {
                    if ($i < 5) {
                        throw new PokemonFormatException();
                    }

                    break;
                }

                $result = json_decode((string)$result->getBody(), true); 

                if (empty($result) || ! is_array($result)) {
                    throw new PokemonFormatException();
                }

                if (! isset($pm_data[$v['rule']])) {
                    $pm_data[$v['rule']] = [];
                }

                // 0 => single, 1 => double
                $pm_data[$v['rule']] += $result;
            } while ($i += 1);
        }

        return $pm_data;
    }

    /**
     * 下載指定賽季 pokemon 使用率前 150 名
     * 
     * @param int $season_number 指定賽季資料
     * 
     * @return array
     */
    public function get_top_pokemon($season_number) {
        $season_list = $this->get_season_list();

        $season = $season_list[$season_number];

        $top_150 = [];

        $client = new \GuzzleHttp\Client();

        foreach ($season as $cid => $v) {
            if ($v['rst'] === 0 && $v['ts2'] === 0) {
                throw new PokemonFormatException();
            }

            $ranking_url = self::RANK_DATA_URL . '/' . $cid . '/' . $v['rst'] . '/' . $v['ts2'] . '/pokemon';

            $result = $client->request('GET', $ranking_url);

            $result = json_decode((string)$result->getBody(), true);

            if (empty($result) || ! is_array($result)) {
                throw new PokemonFormatException();
            }

            // 0 => single, 1 => double
            $top_150[$v['rule']] = $result;
        }

        return $top_150;
    }

    /**
     * 取得不同屬性之間的傷害倍率
     * 
     * @return mixed  array
     */
    public function type_weakness() {
        // $cols = ['一般', '格鬥', '飛行', '毒', '地面', '岩石', '蟲', '幽靈', '鋼', '火', '水', '草', '電', '超能力', '冰', '龍', '惡', '妖精'];

        return  [
            0 => [1, 2, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            1 => [1, 1, 2, 1, 1, 0.5, 0.5, 1, 1, 1, 1, 1, 1, 2, 1, 1, 0.5, 2],
            2 => [1, 0.5, 1, 1, 0, 2, 0.5, 1, 1, 1, 1, 0.5, 2, 1, 2, 1, 1, 1],
            3 => [1, 0.5, 1, 0.5, 2, 1, 0.5, 1, 1, 1, 1, 0.5, 1, 2, 1, 1, 1, 0.5],
            4 => [1, 1, 1, 0.5, 1, 0.5, 1, 1, 1 ,1, 2, 2, 0, 1, 2, 1, 1, 1],
            5 => [0.5, 2, 0.5, 0.5, 2, 1, 1, 1, 2, 0.5, 2, 2, 1, 1, 1, 1, 1, 1],
            6 => [1, 0.5, 2, 1, 0.5, 2, 1, 1, 1, 2, 1, 0.5, 1, 1, 1, 1, 1, 1],
            7 => [0, 0, 1, 0.5, 1, 1, 0.5, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1],
            8 => [0.5, 2, 0.5, 0, 2, 0.5, 0.5, 1, 0.5, 2, 1, 0.5, 1, 0.5, 0.5, 0.5, 1, 0.5],
            9 => [1, 1, 1, 1, 2, 2, 0.5, 1, 0.5, 0.5, 2, 0.5, 1, 1, 0.5, 1, 1, 0.5],
            10 => [1, 1, 1, 1, 1, 1, 1, 1, 0.5, 0.5, 0.5, 2, 2, 1, 0.5, 1, 1, 1],
            11 => [1, 1, 2, 2, 0.5, 1, 2, 1, 1, 2, 0.5, 0.5, 0.5, 1, 2, 1, 1, 1],
            12 => [1, 1, 0.5, 1, 2, 1, 1, 1, 0.5, 1, 1, 1, 0.5, 1, 1, 1, 1, 1],
            13 => [1, 0.5, 1, 1, 1, 1, 2, 2, 1, 1, 1, 1, 1, 0.5, 1, 1, 2, 1],
            14 => [1, 2, 1, 1, 1, 2, 1, 1, 2, 2, 1, 1, 1, 1, 0.5, 1, 1, 1],
            15 => [1, 1, 1, 1, 1, 1, 1, 1, 1, 0.5, 0.5, 0.5, 0.5, 1, 2, 2, 1, 2],
            16 => [1, 2, 1, 1, 1, 1, 2, 0.5, 1, 1, 1, 1, 1, 0, 1, 1, 0.5, 2],
            17 => [1, 0.5, 1, 2, 1, 1, 0.5, 1, 2, 1, 1, 1, 1, 1, 1, 0, 0.5, 1],
        ];
    }
}