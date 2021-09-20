<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;
use App\Models\Pokeform;
use App\Libraries\Pokemon\PokemonHome;

class DownloadPokemonImages extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'pokemon:download-images';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = '依序圖鑑編號下載所有寶可夢的圖片';

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
        $tmp_path = 'tmp_pokemon_image_' . date('YmdHis');

        if (! is_dir(storage_path() . '/app/' . $tmp_path)) {
            if (! Storage::makeDirectory($tmp_path)) {
                throw new \Exception("無法創建目錄 {$tmp_path}");
            }
        }

        foreach (Pokeform::all() as $pf) {
            $pm->download_pokemon_image(storage_path() . '/app/' . $tmp_path, $pf->pm_id, $pf->form_id);
        }

        $public_path = 'public/pokemon_images';

        if (is_dir(storage_path() . '/app/' . $public_path)) {
            if (! Storage::deleteDirectory($public_path)) {
                throw new \Exception("無法刪除目錄 {$public_path}.");
            }
        }

        rename(storage_path() . '/app/' . $tmp_path, storage_path() . '/app/' . $public_path);

        return 0;
    }
}
