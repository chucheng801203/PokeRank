<?php

namespace App\Commands;

require __DIR__.'/../../vendor/autoload.php';

use App\Models\WikiItemData;
use App\Models\WikiAbilityData;
use App\Models\WikiMoveData;
use App\Models\WikiNatureData;
use Aws\S3\S3Client;
use Illuminate\Filesystem\Filesystem;
use Monolog\Logger;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

class UploadWikiDataToS3 extends Command
{
    protected static $defaultName = 'pokemonWiki:upload-wiki-to-S3';

    protected static $defaultDescription = '將資料庫從 wiki 抓取的資料上傳到 AWS S3';

    public function __construct(Logger $log, Filesystem $fileSystem, S3Client $S3)
    {
        $this->log = $log;
        $this->fileSystem = $fileSystem;
        $this->S3 = $S3;

        parent::__construct();
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        try {
            $wiki_data = [
                // 道具
                'items' => WikiItemData::all()->mapWithKeys(function ($item, $key) {
                    return [
                        $item['name_zh_tw'] => [
                            "description" => $item['description'],
                        ],
                    ];
                }),

                // 特性
                'abilities' => WikiAbilityData::all()->mapWithKeys(function ($item, $key) {
                    return [
                        $item['name_zh_tw'] => [
                            "description" => $item['description'],
                        ],
                    ];
                }),
                // 招式
                'moves' => WikiMoveData::all()->mapWithKeys(function ($item, $key) {
                    return [
                        $item['name_zh_tw'] => [
                            'class'      => $item['class'],
                            'type'      => $item['type'],
                            'damage'    => $item['damage'],
                            'hitRate' => $item['hitRate'],
                            'PP' => $item['PP'],
                            'description' => $item['description'],
                        ],
                    ];
                }),

                // 性格
                'natures' => WikiNatureData::all()->mapWithKeys(function ($item, $key) {
                    return [
                        $item['name_zh_tw'] => [
                            'advantage'   => $item['advantage'],
                            "weakness" => $item['weakness'],
                            'like'   => $item['like'],
                            "notlike" => $item['notlike'],
                        ],
                    ];
                }),
            ];

            $file_name = 'wiki_data_'.date('Ymd').'.json';

            $this->fileSystem->put(storage_path("app/{$file_name}"), json_encode($wiki_data));

            $this->S3->putObject([
                'Bucket'       => $_ENV['AWS_BUCKET'],
                'Key'          => 'wiki_data.json',
                'SourceFile'   => storage_path("app/{$file_name}"),
                'ACL'          => 'public-read',
                'CacheControl' => 'max-age=86400',
            ]);

            $this->log->info('pokemonWiki:upload-wiki-to-S3 命令已執行完畢');

            return Command::SUCCESS;
        } catch (\Exception $e) {
            $this->log->error($e->getMessage());
            echo $e->getMessage()."\n";

            return Command::FAILURE;
        }
    }
}
