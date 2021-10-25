<?php

namespace App\Commands;

require __DIR__.'/../../vendor/autoload.php';

use App\Models\WikiNatureData;
use Illuminate\Database\Capsule\Manager as Capsule;
use Monolog\Logger;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

class LoadNatureDataByWiki extends Command
{
    protected static $defaultName = 'pokemonWiki:load-nature-data';

    protected static $defaultDescription = '從神奇寶貝百科抓取性格資料';

    public function __construct(Logger $log)
    {
        $this->log = $log;

        parent::__construct();
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        try {
            Capsule::transaction(function () {
                $doc = new \DOMDocument();
                libxml_use_internal_errors(true);
                $doc->loadHTMLFile("https://wiki.52poke.com/zh-hant/%E6%80%A7%E6%A0%BC");
                libxml_clear_errors();
    
                $finder = new \DomXPath($doc);
                $nodes = $finder->query("//table[contains(@class,'at-c a-c')]/tbody");

                for ($j = 1; $j < $nodes[0]->childNodes->length; $j++) {
                    if ($nodes[0]->childNodes[$j]->nodeName === 'tr' && $nodes[0]->childNodes[$j]->childNodes->length === 14) {
                        $row = [];
                        $row['name_zh_tw'] = trim($nodes[0]->childNodes[$j]->childNodes[1]->textContent);
                        $row['name_en'] = trim($nodes[0]->childNodes[$j]->childNodes[5]->textContent);
                        $row['name_jp'] = trim($nodes[0]->childNodes[$j]->childNodes[3]->textContent);
                        $row['advantage'] = trim($nodes[0]->childNodes[$j]->childNodes[7]->textContent);
                        $row['weakness'] = trim($nodes[0]->childNodes[$j]->childNodes[9]->textContent);
                        $row['like'] = trim($nodes[0]->childNodes[$j]->childNodes[11]->textContent);
                        $row['notlike'] = trim($nodes[0]->childNodes[$j]->childNodes[13]->textContent);
                        WikiNatureData::updateOrCreate(['name_zh_tw' => $row['name_zh_tw']], $row);
                    }
                }
            });

            $this->log->info('pokemonWiki:load-nature-data 命令已執行完畢');

            return Command::SUCCESS;
        } catch (\Exception $e) {
            $this->log->error($e->getMessage());
            echo $e->getMessage()."\n";

            return Command::FAILURE;
        }
    }
}
