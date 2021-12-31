<?php

use Illuminate\Database\Capsule\Manager as Capsule;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class CreateRankLosePokemonTable extends Migration
{
    protected $tableName = 'rank_lose_pokemon';

    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        $tableName = $this->tableName;

        Capsule::schema()->create($tableName, function (Blueprint $table) {
            $table->unsignedSmallInteger('pf_id')->comment('pokemon 型態 id');
            $table->unsignedTinyInteger('season_number')->comment('賽季');
            $table->boolean('rule')->comment('0=單打, 1=雙打');
            $table->unsignedSmallInteger('team_pf_id')->comment('同隊 pokemon 型態 id');
            $table->unsignedTinyInteger('sort')->comment('排序');
            $table->timestampsTz($precision = 0);
            $table->primary(['pf_id', 'season_number', 'rule', 'team_pf_id']);
            $table->foreign('pf_id')->references('id')->on('pokeform')->onUpdate('cascade')->onDelete('cascade');
            $table->foreign('team_pf_id')->references('id')->on('pokeform')->onUpdate('cascade')->onDelete('cascade');
            $table->foreign('season_number')->references('season')->on('rank_season_list')->onUpdate('cascade')->onDelete('cascade');
            $table->charset = 'utf8mb4';
            $table->collation = 'utf8mb4_unicode_ci';
            $table->engine = 'InnoDB';
        });

        // DB::statement("ALTER TABLE `$tableName` comment 'pokemon 每個賽季打輸的 pokemon'");
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Capsule::schema()->dropIfExists($this->tableName);
    }
}
