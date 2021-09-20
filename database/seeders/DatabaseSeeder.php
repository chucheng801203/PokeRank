<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        $this->call([
            AbilitySeeder::class,
            ItemSeeder::class,
            TypeSeeder::class,
            PokemonSeeder::class,
            PokeformSeeder::class,
            PoketypeSeeder::class,
            MoveSeeder::class,
            NatureSeeder::class,
            RankSeasonListSeeder::class,
            RankAbilitySeeder::class,
            RankItemSeeder::class,
            RankLoseMoveSeeder::class,
            RankLosePokemonSeeder::class,
            RankMoveSeeder::class,
            RankNatureSeeder::class,
            RankPokemonSeeder::class,
            RankTopPokemonSeeder::class,
            RankWinMoveSeeder::class,
            RankWinPokemonSeeder::class,
        ]);
    }
}
