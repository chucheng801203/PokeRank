<?php

namespace App\Commands;

use App\Services\Pokemon\PokemonHome;
use Aws\S3\S3Client;
use Illuminate\Filesystem\Filesystem;
use Monolog\Logger;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;

class UploadPokemonRankDataToS3 extends Command
{
    protected static $defaultName = 'pokemonHome:upload-rank-to-S3';

    protected static $defaultDescription = '上傳 pokemon home 的賽季資料到 AWS S3';

    public function __construct(Logger $log, Filesystem $fileSystem, S3Client $S3, PokemonHome $pm)
    {
        $this->log = $log;
        $this->fileSystem = $fileSystem;
        $this->S3 = $S3;
        $this->pm = $pm;

        parent::__construct();
    }

    protected function configure(): void
    {
        $this->addOption(
            'season',
            's',
            InputOption::VALUE_OPTIONAL,
            '需要上傳的賽季： all 更新所有賽季, latest 上傳最新賽季, int $number 上傳指定賽季',
            'all'
        );
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        try {
            $seasons = $season_input = $input->getOption('season');

            new \App\Services\Pokerank\UploadPokemonRankDataToS3($seasons, $this->fileSystem, $this->S3, $this->pm);

            $this->log->info('pokemonHome:upload-rank-to-S3 命令已執行完畢');

            return Command::SUCCESS;
        } catch (\Exception $e) {
            $this->log->error($e->getMessage());
            echo $e->getMessage()."\n";

            return Command::FAILURE;
        }
    }
}
