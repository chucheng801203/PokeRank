<?php
/**
 * 取得 pokemon home 靜態資料與每個 pokemon rank 資料.
 */

namespace App\Services\Pokemon;

use App\Models\RankSeasonList;
use App\Services\Pokemon\Exceptions\PokemonException;
use App\Services\Pokemon\Exceptions\PokemonFormatException;

class PokemonHome
{
    // pokemon 圖片網址路徑
    const POKEMON_IMAGE_URL = 'https://resource.pokemon-home.com/battledata/img/poke/';

    const RANK_LIST_URL = 'https://api.battle.pokemon-home.com/cbd/competition/rankmatch/list';

    const RANK_DATA_URL = 'https://resource.pokemon-home.com/battledata/ranking';

    /**
     * 取得 pokemon 名稱、屬性、招式、特性...等資料.
     *
     * @param string pokemon(名稱) | type(屬性)| move(招式) | ability(特性) | item(道具) | nature(性格) | moveType(招式屬性)
     *
     * @return array
     */
    public function get_pokemon_data($name)
    {
        $parser = PokemonHomeJsParser::get_parser();

        $switch_name = $this->switch_name($name);

        return [
            $name => $parser->data($switch_name)[$switch_name],
        ];
    }

    /**
     * 切換本地資料命名與 pokemon home js 檔的資料命名.
     *
     * @param string
     *
     * @return string
     */
    public function switch_name($name)
    {
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
    public function get_pokeform_type_code()
    {
        $parser = PokemonHomeJsParser::get_parser();

        return $parser->get_pokemon_form_code();
    }

    /**
     * 取得 pokemon home 賽季可用寶可夢資料.
     *
     * @param string PokemonHome::get_season_list() 賽季列表回傳的資料
     *
     * @return array
     */
    public function get_season_active_pokemon($reg)
    {
        $parser = PokemonHomeJsParser::get_parser();

        return $parser->season_active_pokemon($reg);
    }

    /**
     * 下載 pokemon home 的 pokemon 圖片.
     *
     * @param string $directory 要把檔案存到哪個目錄
     * @param string $poke_id   pokemon 圖鑑編號
     * @param string $form_id   pokemon 型態編號
     *
     * @return void
     */
    public function download_pokemon_image($directory, $poke_id, $form_id)
    {
        $img_name = 'cap'.sprintf('%04d', $poke_id).'_f'.sprintf('%02d', $form_id).'_s0.png';
        $local_img_name = 'cap'.$poke_id.'_f'.$form_id.'_s0.png';

        // 來悲茶圖片不分正品和贗品
        $img_url = self::POKEMON_IMAGE_URL.($poke_id === 854 ? 'cap0854_f00_s0.png' : $img_name);
        $save_name = $directory.'/'.$local_img_name;

        if (($file = @file_get_contents($img_url)) == false) {
            throw new PokemonException("file_get_contents({$img_url}): 無法抓取檔案");
        }

        file_put_contents($save_name, $file);
    }

    /**
     * 下載 pokemon rank 賽季列表.
     *
     * @return array
     */
    public function get_season_list()
    {
        static $season_list = null;

        if (!empty($season_list)) {
            return $season_list;
        }

        $client = new \GuzzleHttp\Client();

        $result = $client->request('POST', self::RANK_LIST_URL, [
            'json' => ['soft' => 'Sw'],
        ]);

        $result = json_decode((string) $result->getBody(), true);

        if (empty($result['list']) || !is_array($result['list'])) {
            throw new PokemonFormatException();
        }

        $season_list = $result['list'];

        return $result['list'];
    }

    /**
     * 從資料庫取得賽季並回傳陣列.
     *
     * @param string $season 'all' | 'latest' | '[integer]'
     *
     * @return array array<int>
     */
    public function season_selector(string $season)
    {
        switch ($season) {
            case 'latest':
                return [RankSeasonList::select('season')->max('season')];
                break;
            case 'all':
                return array_column(RankSeasonList::select('season')->get()->toArray(), 'season');
                break;
            default:
                $r = array_column(RankSeasonList::select('season')->where('season', $season)->get()->toArray(), 'season');

                if (count($r) === 0) {
                    throw new PokemonException('$season 為無效參數');
                }

                return $r;
                break;
        }
    }

    /**
     * 把從 home 抓回來的資料轉換成資料庫對應欄位.
     *
     * @param int $season_number 指定賽季資料
     *
     * @return App\Services\Pokemon\PokemonRankDataAdapter
     */
    public function rank_data_generator($season_num)
    {
        $data = $this->get_rank_data($season_num);

        return new PokemonRankDataAdapter($season_num, $data);
    }

    /**
     * 把從 home 抓回來的資料轉換成資料庫對應欄位.
     *
     * @param int $season_number 指定賽季資料
     *
     * @return App\Services\Pokemon\PokemonRankTopListAdapter
     */
    public function top_list_generator($season_num)
    {
        $data = $this->get_top_pokemon($season_num);

        return new PokemonRankTopListAdapter($season_num, $data);
    }

    /**
     * 下載指定賽季 pokemon 對戰資料.
     *
     * @param int $season_number 指定賽季資料
     *
     * @return array
     */
    public function get_rank_data($season_number)
    {
        $season_list = $this->get_season_list();

        $season = $season_list[$season_number];

        $pm_data = [];

        $client = new \GuzzleHttp\Client();

        foreach ($season as $cid => $v) {
            if (!isset($pm_data[$v['rule']])) {
                $pm_data[$v['rule']] = [];
            }

            $i = 0;
            do {
                $i += 1;

                $pdetail_url = self::RANK_DATA_URL.'/'.$cid.'/'.$v['rst'].'/'.$v['ts2'].'/pdetail-'.$i;

                $result = null;

                try {
                    $result = $client->request('GET', $pdetail_url);
                } catch (\Throwable $th) {
                    $result = null;
                }

                if ($result === null) {
                    continue;
                }

                $result = json_decode((string) $result->getBody(), true);

                if (empty($result) || !is_array($result)) {
                    throw new PokemonFormatException();
                }

                // 0 => single, 1 => double
                $pm_data[$v['rule']] += $result;
            } while ($i < 6);
        }

        return $pm_data;
    }

    /**
     * 下載指定賽季 pokemon 使用率前 150 名.
     *
     * @param int $season_number 指定賽季資料
     *
     * @return array
     */
    public function get_top_pokemon($season_number)
    {
        $season_list = $this->get_season_list();

        $season = $season_list[$season_number];

        $top_150 = [];

        $client = new \GuzzleHttp\Client();

        foreach ($season as $cid => $v) {
            $ranking_url = self::RANK_DATA_URL.'/'.$cid.'/'.$v['rst'].'/'.$v['ts2'].'/pokemon';

            $result = null;

            try {
                $result = $client->request('GET', $ranking_url);
            } catch (\Throwable $th) {
                $result = null;
            }

            if ($result === null) {
                $top_150[$v['rule']] = [];
                continue;
            }

            $result = json_decode((string) $result->getBody(), true);

            if (empty($result) || !is_array($result)) {
                throw new PokemonFormatException();
            }

            // 0 => single, 1 => double
            $top_150[$v['rule']] = $result;
        }

        return $top_150;
    }

    /**
     * 取得賽制: 單打、雙打.
     *
     * @return array
     */
    public function get_rules()
    {
        // value 0、1 是 pokemon home 定義的
        return [
            ['value'=> 0, 'text' => '單打'],
            ['value'=> 1, 'text' => '雙打'],
        ];
    }

    /**
     * 取得不同屬性之間的傷害倍率.
     *
     * @return mixed array
     */
    public function type_weakness()
    {
        // $cols = ['一般', '格鬥', '飛行', '毒', '地面', '岩石', '蟲', '幽靈', '鋼', '火', '水', '草', '電', '超能力', '冰', '龍', '惡', '妖精'];

        return  [
            0  => [1, 2, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            1  => [1, 1, 2, 1, 1, 0.5, 0.5, 1, 1, 1, 1, 1, 1, 2, 1, 1, 0.5, 2],
            2  => [1, 0.5, 1, 1, 0, 2, 0.5, 1, 1, 1, 1, 0.5, 2, 1, 2, 1, 1, 1],
            3  => [1, 0.5, 1, 0.5, 2, 1, 0.5, 1, 1, 1, 1, 0.5, 1, 2, 1, 1, 1, 0.5],
            4  => [1, 1, 1, 0.5, 1, 0.5, 1, 1, 1, 1, 2, 2, 0, 1, 2, 1, 1, 1],
            5  => [0.5, 2, 0.5, 0.5, 2, 1, 1, 1, 2, 0.5, 2, 2, 1, 1, 1, 1, 1, 1],
            6  => [1, 0.5, 2, 1, 0.5, 2, 1, 1, 1, 2, 1, 0.5, 1, 1, 1, 1, 1, 1],
            7  => [0, 0, 1, 0.5, 1, 1, 0.5, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1],
            8  => [0.5, 2, 0.5, 0, 2, 0.5, 0.5, 1, 0.5, 2, 1, 0.5, 1, 0.5, 0.5, 0.5, 1, 0.5],
            9  => [1, 1, 1, 1, 2, 2, 0.5, 1, 0.5, 0.5, 2, 0.5, 1, 1, 0.5, 1, 1, 0.5],
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
