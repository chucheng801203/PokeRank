<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateRankTopPokemonTable extends Migration
{
    protected $tableName = 'rank_top_pokemon';
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        $tableName = $this->tableName;

        Schema::create($tableName, function (Blueprint $table) {
            $table->unsignedSmallInteger('pf_id')->nullable(true)->comment('pokemon 型態 id');
            $table->unsignedTinyInteger('season_number')->nullable(true)->comment('賽季');
            $table->string('rule', 6)->comment('single=單打, double=雙打');
            $table->unsignedTinyInteger('ranking')->comment('排名');
            $table->timestampsTz($precision = 0);
            $table->index('pf_id');
            $table->foreign('pf_id')->references('id')->on('pokeform')->onUpdate('cascade')->onDelete('SET NULL');
            $table->foreign('season_number')->references('season')->on('rank_season_list')->onUpdate('cascade')->onDelete('SET NULL');
            $table->charset = 'utf8mb4';
            $table->collation = 'utf8mb4_unicode_ci';
            $table->engine = 'InnoDB';
        });

        DB::statement("ALTER TABLE `$tableName` comment 'pokemon 每個賽季使用率前 150 名'");
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists($this->tableName);
    }
}
