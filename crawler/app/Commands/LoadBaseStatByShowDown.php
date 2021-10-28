<?php

namespace App\Commands;

require __DIR__.'/../../vendor/autoload.php';

use App\Libraries\Pokemon\SdPokeDex;
use App\Models\Pokeform;
use App\Models\SdBaseStat;
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

                    if (empty($pms[$pf->form_id]) || empty($pms[$pf->form_id]['baseStats'])) {
                        continue;
                    }

                    $baseStats = $pms[$pf->form_id]['baseStats'];

                    if (!isset($baseStats['hp']) || !isset($baseStats['atk']) || !isset($baseStats['def']) || !isset($baseStats['spa']) || !isset($baseStats['spd']) || !isset($baseStats['spe'])) {
                        continue;
                    }

                    $updates = [
                        'hp' => $pms[$pf->form_id]['baseStats']['hp'],
                        'atk' => $pms[$pf->form_id]['baseStats']['atk'],
                        'def' => $pms[$pf->form_id]['baseStats']['def'],
                        'spa' => $pms[$pf->form_id]['baseStats']['spa'],
                        'spd' => $pms[$pf->form_id]['baseStats']['spd'],
                        'spe' => $pms[$pf->form_id]['baseStats']['spe'],
                    ];

                    SdBaseStat::updateOrCreate(['pf_id' => $pf->id], $updates);
                }
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