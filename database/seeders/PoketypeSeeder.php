<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PoketypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::transaction(function () {
            $sql_path = __DIR__.'/development_data/poketype.sql';
            if (is_readable($sql_path)) {
                $sql = file_get_contents($sql_path);
                if (! empty($sql)) {
                    DB::unprepared($sql);
                }
            }
        });
    }
}
