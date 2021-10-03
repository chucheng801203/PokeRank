<?php

namespace App\Commands;

require __DIR__.'/../../vendor/autoload.php';

use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Illuminate\Filesystem\Filesystem;
use Monolog\Logger;
use Aws\S3\S3Client;
use App\Libraries\Pokemon\PokemonHome;
use App\Models\Ability;
use App\Models\Item;
use App\Models\Move;
use App\Models\Nature;
use App\Models\Pokemon;
use App\Models\Poketype;
use App\Models\RankSeasonList;
use App\Models\Type;

class UploadPokemonDataToS3 extends Command
{
    protected static $defaultName = 'pokemonHome:upload-data-to-S3';

    protected static $defaultDescription = '將資料庫的 pokemon 資料上傳到 AWS S3';

    public function __construct(Logger $log, Filesystem $fileSystem, S3Client $S3, PokemonHome $pm)
    {
        $this->log = $log;
        $this->fileSystem = $fileSystem;
        $this->S3 = $S3;
        $this->pm = $pm;

        parent::__construct();
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        try {
            $pr_data = [
                // 賽季列表
                'seasons' => RankSeasonList::all()->map(function ($item, $key) {
                    return [
                        'value' => $item->season,
                        'text' => '第 '.$item->season.' 季',
                        'start' => $item->start,
                        'end' => $item->end,
                    ];
                }),
    
                // 賽制
                'rules' => [
                    ['value'=> 0, 'text' => '單打'],
                    ['value'=> 1, 'text' => '雙打'],
                ],
    
                // 道具
                'items' => Item::all()->mapWithKeys(function ($item, $key) {
                    return [$item['id'] => $item['name_zh_tw']];
                }),
    
                // 特性
                'abilities' => Ability::all()->mapWithKeys(function ($item, $key) {
                    return [$item['id'] => $item['name_zh_tw']];
                }),
    
                // 屬性
                'types' => Type::all()->mapWithKeys(function ($item, $key) {
                    return [$item['id'] => $item['name_zh_tw']];
                }),
    
                // 招式
                'moves' => Move::all()->mapWithKeys(function ($item, $key) {
                    return [
                        $item['id'] => [
                            'id' => $item['id'],
                            'name' => $item['name_zh_tw'],
                            'type_id' => $item['type_id'],
                        ],
                    ];
                }),
    
                // 性格
                'natures' => Nature::all()->mapWithKeys(function ($item, $key) {
                    return [$item['id'] => $item['name_zh_tw']];
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
    
                // 各屬性之間的傷害倍率
                'type_weakness' => $this->pm->type_weakness(),
            ];
    
            $file_name = 'pokemon_data_'.date('Ymd').'.json';
    
            $this->fileSystem->put(storage_path("app/{$file_name}"), json_encode($pr_data));
    
            $this->S3->putObject([
                'Bucket' => $_ENV['AWS_BUCKET'],
                'Key'    => 'pr_data.json',
                'SourceFile'   => storage_path("app/{$file_name}"),
                'ACL'    => 'public-read',
                'CacheControl' => 'max-age=86400',
            ]);
    
            $this->log->info('pokemonHome:upload-data-to-S3 命令已執行完畢');
    
            return Command::SUCCESS;
        } catch (\Exception $e) {
            $this->log->error($e->getMessage());
            echo $e->getMessage()."\n";
            return Command::FAILURE;
        }
    }
}