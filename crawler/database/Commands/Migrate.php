<?php

namespace Database\Commands;

require __DIR__.'/../../vendor/autoload.php';

use Illuminate\Database\Capsule\Manager as Capsule;
use Illuminate\Database\ConnectionResolver;
use Illuminate\Database\Migrations\DatabaseMigrationRepository;
use Illuminate\Database\Migrations\Migrator;
use Illuminate\Filesystem\Filesystem;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;

class Migrate extends Command
{
    protected static $defaultName = 'migrate';

    protected static $defaultDescription = '執行資料庫的 migration';

    public function __construct(Filesystem $filesystem)
    {
        $this->filesystem = $filesystem;

        parent::__construct();
    }

    protected function configure(): void
    {
        $this->addOption(
            'type',
            't',
            InputOption::VALUE_OPTIONAL,
            'latest 執行資料庫所有的 migration, rollback 回滾到最舊的 migration',
            'latest'
        );
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $resolver = new ConnectionResolver(['' => Capsule::connection()]);
        $repository = new DatabaseMigrationRepository($resolver, 'migrations');

        if (!$repository->repositoryExists()) {
            $repository->createRepository();
        }

        $migrator = new Migrator($repository, $resolver, $this->filesystem);
        $migrator->setOutput($output);

        $type = $input->getOption('type');

        $migrations_path = __DIR__.'/../migrations';

        switch ($type) {
            case 'latest':
                $migrator->run([$migrations_path]);
                break;
            case 'rollback':
                $migrator->rollback([$migrations_path]);
                break;
            default:
                $migrator->run([$migrations_path]);
                break;
        }

        return Command::SUCCESS;
    }
}
