<?php

namespace App\Commands;

use App\Services\Pokemon\PokemonHome;
use App\Models\Pokeform;
use App\Models\RankAbility;
use App\Models\RankItem;
use App\Models\RankLoseMove;
use App\Models\RankLosePokemon;
use App\Models\RankMove;
use App\Models\RankNature;
use App\Models\RankPokemon;
use App\Models\RankTopPokemon;
use App\Models\RankWinMove;
use App\Models\RankWinPokemon;
use Illuminate\Database\Capsule\Manager as Capsule;
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

            $pm = $this->pm;

            $seasons = $pm->season_selector($seasons);

            Capsule::transaction(function () use ($pm, $seasons) {
                foreach ($seasons as $season_num) {
                    // 先刪除資料庫已存在該賽季的資料
                    RankMove::where('season_number', $season_num)->delete();
                    RankWinMove::where('season_number', $season_num)->delete();
                    RankLoseMove::where('season_number', $season_num)->delete();

                    RankPokemon::where('season_number', $season_num)->delete();
                    RankWinPokemon::where('season_number', $season_num)->delete();
                    RankLosePokemon::where('season_number', $season_num)->delete();

                    RankAbility::where('season_number', $season_num)->delete();
                    RankItem::where('season_number', $season_num)->delete();
                    RankNature::where('season_number', $season_num)->delete();

                    $generator = $pm->rank_data_generator($season_num);

                    foreach ($generator->data() as $data) {
                        RankMove::insert($data['rank_move']);
                        RankWinMove::insert($data['rank_win_move']);
                        RankLoseMove::insert($data['rank_lose_move']);

                        RankPokemon::insert($data['rank_pokemon']);
                        RankWinPokemon::insert($data['rank_win_pokemon']);
                        RankLosePokemon::insert($data['rank_lose_pokemon']);

                        RankAbility::insert($data['rank_ability']);
                        RankItem::insert($data['rank_item']);

                        if (isset($data['rank_nature'])) {
                            RankNature::insert($data['rank_nature']);
                        }
                    }

                    RankTopPokemon::where('season_number', $season_num)->delete();

                    $top_list_generator = $pm->top_list_generator($season_num);

                    foreach ($top_list_generator->data() as $data) {
                        RankTopPokemon::insert($data);
                    }
                }
            });

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
