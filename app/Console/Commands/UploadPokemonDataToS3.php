<?php

namespace App\Console\Commands;

use App\Http\Resources\IdNameCollection;
use App\Http\Resources\MoveCollection;
use App\Http\Resources\PokeTypeCollection;
use App\Http\Resources\RankSeasonListResource;
use App\Libraries\Pokemon\PokemonHome;
use App\Models\Ability;
use App\Models\Item;
use App\Models\Move;
use App\Models\Nature;
use App\Models\Pokemon;
use App\Models\Poketype;
use App\Models\RankSeasonList;
use App\Models\Type;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class UploadPokemonDataToS3 extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'pokemon:upload-data-to-S3';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = '將資料庫的 pokemon 資料上傳到 AWS S3';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle(PokemonHome $pm)
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

        $file_name = 'pokemon_data_'.date('Ymd').'.json';

        Storage::put($file_name, json_encode($pr_data));

        Storage::disk('s3')->put(
            'pr_data.json',
            file_get_contents(storage_path("app/{$file_name}")),
            [
                'visibility' => 'public',
                'CacheControl' => 'max-age=86400',
            ]
        );

        Log::info('pokemon:upload-data-to-S3 命令已執行完畢');

        return 0;
    }
}
