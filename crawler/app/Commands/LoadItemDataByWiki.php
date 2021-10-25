<?php

namespace App\Commands;

require __DIR__.'/../../vendor/autoload.php';

use App\Models\WikiItemData;
use Illuminate\Database\Capsule\Manager as Capsule;
use Monolog\Logger;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

class LoadItemDataByWiki extends Command
{
    protected static $defaultName = 'pokemonWiki:load-item-data';

    protected static $defaultDescription = '從神奇寶貝百科抓取道具資料';

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
                $doc->loadHTMLFile('https://wiki.52poke.com/zh-hant/%E9%81%93%E5%85%B7%E5%88%97%E8%A1%A8');
                libxml_clear_errors();

                $finder = new \DomXPath($doc);
                $nodes = $finder->query("//table[contains(@class,'hvlist')]/tbody");

                for ($i = 0; $i < $nodes->length; $i++) {
                    $index = null;
                    for ($j = 1; $j < $nodes[$i]->childNodes->length; $j++) {
                        if ($nodes[$i]->childNodes[$j]->nodeName === 'tr') {
                            if ($nodes[$i]->childNodes[$j]->childNodes->length === 10) {
                                $index = $j;
                                $row = [];
                                $row['name_zh_tw'] = trim($nodes[$i]->childNodes[$j]->childNodes[3]->textContent);
                                $row['name_en'] = trim($nodes[$i]->childNodes[$j]->childNodes[7]->textContent);
                                $row['name_jp'] = trim($nodes[$i]->childNodes[$j]->childNodes[5]->textContent);
                                $row['description'] = trim($nodes[$i]->childNodes[$j]->childNodes[9]->textContent);
                                WikiItemData::updateOrCreate(['name_zh_tw' => $row['name_zh_tw']], $row);
                            } elseif ($nodes[$i]->childNodes[$j]->childNodes->length === 8 && $index !== null) {
                                $row = [];
                                $row['name_zh_tw'] = trim($nodes[$i]->childNodes[$j]->childNodes[3]->textContent);
                                $row['name_en'] = trim($nodes[$i]->childNodes[$j]->childNodes[5]->textContent);
                                $row['name_jp'] = trim($nodes[$i]->childNodes[$j]->childNodes[7]->textContent);
                                $row['description'] = trim($nodes[$i]->childNodes[$index]->childNodes[9]->textContent);
                                WikiItemData::updateOrCreate(['name_zh_tw' => $row['name_zh_tw']], $row);
                            }
                        }
                    }
                }
            });

            $this->log->info('pokemonWiki:load-item-data 命令已執行完畢');

            return Command::SUCCESS;
        } catch (\Exception $e) {
            $this->log->error($e->getMessage());
            echo $e->getMessage()."\n";

            return Command::FAILURE;
        }
    }
}
