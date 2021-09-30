<?php

namespace App\Console\Commands;

use App\Libraries\Pokemon\PokemonHome;
use App\Models\Ability;
use App\Models\Item;
use App\Models\Move;
use App\Models\Nature;
use App\Models\Pokeform;
use App\Models\Pokemon;
use App\Models\Poketype;
use App\Models\Type;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class UpdatePokemonData extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'pokemon:update-data';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = '抓取 pokemon home 的資料(圖鑑、屬性、招式、特性、道具、性格的名稱與編號列表)，並將其存入資料庫';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle(PokemonHome $pm)
    {
        DB::transaction(function () use ($pm) {
            $tables = ['pokemon', 'type', 'ability', 'item', 'nature', 'move'];

            foreach ($tables as $name) {
                $data = $pm->get_pokemon_data($name);

                foreach ($data[$name] as $id => $v) {
                    $updates = [
                        'name_zh_tw' => $v['zh_tw'],
                        'name_en' => $v['en'],
                        'name_jp' => $v['jp'],
                    ];

                    switch ($name) {
                        case 'pokemon':
                            Pokemon::updateOrCreate(['id' => intval($id) + 1], $updates);
                            break;
                        case 'type':
                            Type::updateOrCreate(['id' => $id], $updates);
                            break;
                        case 'ability':
                            Ability::updateOrCreate(['id' => $id], $updates);
                            break;
                        case 'item':
                            Item::updateOrCreate(['id' => $id], $updates);
                            break;
                        case 'nature':
                            Nature::updateOrCreate(['id' => $id], $updates);
                            break;
                        case 'move':
                            $updates['type_id'] = $v['type'];
                            Move::updateOrCreate(['id' => $id], $updates);
                            break;
                    }
                }
            }

            $pokeform = $pm->get_pokeform_type_code();

            foreach ($pokeform as $pm_id => $v) {
                foreach ($v as $form_id => $w) {
                    $pf = Pokeform::updateOrCreate([
                        'pm_id' => $pm_id,
                        'form_id' => $form_id,
                    ]);

                    foreach ($w as $type_id) {
                        Poketype::updateOrCreate([
                            'pf_id' => $pf->id,
                            // 有可能會有小數點，將小數點轉成整數
                            'type_id' => intval($type_id),
                        ]);
                    }
                }
            }
        });

        $this->call('pokemon:upload-data-to-S3');

        return 0;
    }
}
