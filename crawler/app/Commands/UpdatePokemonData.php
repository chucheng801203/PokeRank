<?php

namespace App\Commands;

use App\Services\Pokemon\PokemonHome;
use Monolog\Logger;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\ArrayInput;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;

class UpdatePokemonData extends Command
{
    protected static $defaultName = 'pokemonHome:update-data';

    protected static $defaultDescription = '抓取 pokemon home 的資料(圖鑑、屬性、招式、特性、道具、性格的名稱與編號列表)，並將其存入資料庫';

    public function __construct(Logger $log, PokemonHome $pm)
    {
        $this->log = $log;
        $this->pm = $pm;

        parent::__construct();
    }

    protected function configure(): void
    {
        $this->addOption(
            'upload',
            null,
            InputOption::VALUE_NONE,
            '是否要上傳到 S3'
        );
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        try {
            new \App\Services\Pokerank\UpdatePokemonData($this->pm);

            // 載入種族值資料
            $command = $this->getApplication()->find('pokemonShowDown:load-baseStat-data');
            $command->run(new ArrayInput([]), $output);

            $this->log->info('pokemonHome:update-data 命令已執行完畢');

            $upload = $input->getOption('upload');
            if ($upload) {
                $command = $this->getApplication()->find('pokemonHome:upload-data-to-S3');

                return $command->run(new ArrayInput([]), $output);
            }

            return Command::SUCCESS;
        } catch (\Exception $e) {
            $this->log->error($e->getMessage());
            echo $e->getMessage()."\n";

            return Command::FAILURE;
        }
    }
}
