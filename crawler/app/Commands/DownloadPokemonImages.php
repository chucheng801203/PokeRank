<?php

namespace App\Commands;

require __DIR__.'/../../vendor/autoload.php';

use App\Libraries\Pokemon\PokemonHome;
use App\Models\Pokeform;
use Aws\S3\S3Client;
use Illuminate\Filesystem\Filesystem;
use Monolog\Logger;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

class DownloadPokemonImages extends Command
{
    protected static $defaultName = 'pokemonHome:download-images';

    protected static $defaultDescription = '依序圖鑑編號下載所有寶可夢的圖片';

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
            $fileSystem = $this->fileSystem;
            $S3 = $this->S3;
            $pm = $this->pm;

            $tmp_path = 'pokemon_image_'.date('Ymd');

            $fileSystem->ensureDirectoryExists(storage_path("app/{$tmp_path}"), 0755, true);

            foreach (Pokeform::all() as $pf) {
                $pm->download_pokemon_image(
                    storage_path("app/{$tmp_path}"),
                    $pf->pm_id,
                    $pf->form_id
                );
            }

            $files = $fileSystem->files(storage_path("app/{$tmp_path}"));
            foreach ($files as $file) {
                $S3->putObject([
                    'Bucket'       => $_ENV['AWS_BUCKET'],
                    'Key'          => 'images/'.basename($file),
                    'SourceFile'   => $file,
                    'ACL'          => 'public-read',
                    'CacheControl' => 'max-age=86400',
                ]);
            }

            $this->log->info('pokemonHome:download-images 命令已執行完畢');

            return Command::SUCCESS;
        } catch (\Exception $e) {
            $this->log->error($e->getMessage());
            echo $e->getMessage()."\n";

            return Command::FAILURE;
        }
    }
}
