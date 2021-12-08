<?php

namespace App\Commands;

use App\Models\Pokeform;
use App\Models\SdBaseStat;
use App\Services\Pokemon\SdPokeDex;
use Illuminate\Database\Capsule\Manager as Capsule;
use Monolog\Logger;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

class LoadBaseStatByShowDown extends Command
{
    protected static $defaultName = 'pokemonShowDown:load-baseStat-data';

    protected static $defaultDescription = '從 showdown library 下載圖鑑資料';

    public function __construct(Logger $log, SdPokeDex $dex)
    {
        $this->log = $log;
        $this->dex = $dex;

        parent::__construct();
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        try {
            Capsule::transaction(function () {
                $pokeform = Pokeform::all();

                foreach ($pokeform as $pf) {
                    $pms = $this->dex->getById($pf->pm_id);

                    if (empty($pms[$pf->form_id]) || empty($baseStats = $pms[$pf->form_id]['baseStats'])) {
                        continue;
                    }

                    if (!isset($baseStats['hp']) || !isset($baseStats['atk']) || !isset($baseStats['def']) || !isset($baseStats['spa']) || !isset($baseStats['spd']) || !isset($baseStats['spe'])) {
                        continue;
                    }

                    $updates = [
                        'hp'  => $baseStats['hp'],
                        'atk' => $baseStats['atk'],
                        'def' => $baseStats['def'],
                        'spa' => $baseStats['spa'],
                        'spd' => $baseStats['spd'],
                        'spe' => $baseStats['spe'],
                    ];

                    SdBaseStat::updateOrCreate(['pf_id' => $pf->id], $updates);
                }

                // 大蔥鴨
                SdBaseStat::updateOrCreate(['pf_id' => 120], [
                    'hp'  => 52,
                    'atk' => 90,
                    'def' => 55,
                    'spa' => 58,
                    'spd' => 62,
                    'spe' => 60,
                ]);

                SdBaseStat::updateOrCreate(['pf_id' => 121], [
                    'hp'  => 52,
                    'atk' => 95,
                    'def' => 55,
                    'spa' => 58,
                    'spd' => 62,
                    'spe' => 55,
                ]);

                // 魔牆人偶
                SdBaseStat::updateOrCreate(['pf_id' => 167], [
                    'hp'  => 40,
                    'atk' => 45,
                    'def' => 65,
                    'spa' => 100,
                    'spd' => 120,
                    'spe' => 90,
                ]);

                SdBaseStat::updateOrCreate(['pf_id' => 168], [
                    'hp'  => 50,
                    'atk' => 65,
                    'def' => 65,
                    'spa' => 90,
                    'spd' => 90,
                    'spe' => 100,
                ]);

                // 基格爾德
                SdBaseStat::updateOrCreate(['pf_id' => 991], [
                    'hp'  => 54,
                    'atk' => 100,
                    'def' => 71,
                    'spa' => 61,
                    'spd' => 85,
                    'spe' => 115,
                ]);

                SdBaseStat::updateOrCreate(['pf_id' => 992], [
                    'hp'  => 54,
                    'atk' => 100,
                    'def' => 71,
                    'spa' => 61,
                    'spd' => 85,
                    'spe' => 115,
                ]);
            });

            $this->log->info('pokemonShowDown:load-baseStat-data 命令已執行完畢');

            return Command::SUCCESS;
        } catch (\Exception $e) {
            $this->log->error($e->getMessage());
            echo $e->getMessage()."\n";

            return Command::FAILURE;
        }
    }
}
