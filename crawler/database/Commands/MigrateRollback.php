<?php

namespace Database\Commands;

require __DIR__.'/../../vendor/autoload.php';

use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\ArrayInput;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

class MigrateRollback extends Command
{
    protected static $defaultName = 'migrate:rollback';

    protected static $defaultDescription = '回滾到最舊的 migration';

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $command = $this->getApplication()->find('migrate');

        $arguments = [
            '--type'  => 'rollback',
        ];

        $command->run(new ArrayInput($arguments), $output);

        return Command::SUCCESS;
    }
}
