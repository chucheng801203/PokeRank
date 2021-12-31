<?php

namespace App\Commands;

use App\Services\Pokemon\PokemonHome;
use Monolog\Logger;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\ArrayInput;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;

class UpdatePokemonRankData extends Command
{
    protected static $defaultName = 'pokemonHome:update-rank';

    protected static $defaultDescription = '抓取 pokemon home 的賽季資料(排名、道具使用率、招式使用率...)，並將其存入資料庫';

    public function __construct(Logger $log, PokemonHome $pm)
    {
        $this->log = $log;
        $this->pm = $pm;

        parent::__construct();
    }

    protected function configure(): void
    {
        $this->addOption(
            'season',
            's',
            InputOption::VALUE_OPTIONAL,
            '需要更新的賽季： all 更新所有賽季, latest 更新最新賽季, int $number 更新指定賽季',
            'all'
        );

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
            $seasons = $season_input = $input->getOption('season');

            new \App\Services\Pokerank\UpdatePokemonRankData($seasons, $this->pm);

            $this->log->info('pokemonHome:update-rank 命令已執行完畢');

            $upload = $input->getOption('upload');
            if ($upload) {
                $command = $this->getApplication()->find('pokemonHome:upload-rank-to-S3');

                $arguments = [
                    '--season'  => $season_input,
                ];

                return $command->run(new ArrayInput($arguments), $output);
            }

            return Command::SUCCESS;
        } catch (\Exception $e) {
            $this->log->error($e->getMessage());
            echo $e->getMessage()."\n";

            return Command::FAILURE;
        }
    }
}
