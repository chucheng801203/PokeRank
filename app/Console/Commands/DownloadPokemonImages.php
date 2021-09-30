<?php

namespace App\Console\Commands;

use App\Libraries\Pokemon\PokemonHome;
use App\Models\Pokeform;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

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
        $tmp_path = 'pokemon_image_'.date('Ymd');

        if (! Storage::makeDirectory($tmp_path)) {
            throw new \Exception('無法創建目錄 '.storage_path("app/{$tmp_path}"));
        }

        foreach (Pokeform::all() as $pf) {
            $pm->download_pokemon_image(
                storage_path("app/{$tmp_path}"),
                $pf->pm_id,
                $pf->form_id
            );
        }

        $files = Storage::files($tmp_path);
        foreach ($files as $file) {
            Storage::disk('s3')->put(
                'images/'.basename($file),
                file_get_contents(storage_path("app/{$file}")),
                [
                    'visibility' => 'public',
                    'CacheControl' => 'max-age=86400',
                ]
            );
        }

        Log::info('pokemon:download-images 命令已執行完畢');

        return 0;
    }
}
