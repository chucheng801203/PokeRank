<?php

namespace App\Commands;

use App\Services\Pokemon\PokemonHome;
use Aws\S3\S3Client;
use Illuminate\Filesystem\Filesystem;
use Monolog\Logger;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

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
            new \App\Services\Pokerank\UploadPokemonDataToS3($this->fileSystem, $this->S3, $this->pm);

            $this->log->info('pokemonHome:upload-data-to-S3 命令已執行完畢');

            return Command::SUCCESS;
        } catch (\Exception $e) {
            $this->log->error($e->getMessage());
            echo $e->getMessage()."\n";

            return Command::FAILURE;
        }
    }
}
