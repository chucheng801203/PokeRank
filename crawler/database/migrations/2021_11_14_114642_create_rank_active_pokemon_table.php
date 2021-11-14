<?php

use Illuminate\Database\Capsule\Manager as Capsule;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class CreateRankActivePokemonTable extends Migration
{
    protected $tableName = 'rank_active_pokemon';

    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        $tableName = $this->tableName;

        Capsule::schema()->create($tableName, function (Blueprint $table) {
            $table->unsignedSmallInteger('id')->autoIncrement()->comment('id 流水號');
            $table->unsignedSmallInteger('pf_id')->nullable(true)->comment('pokemon 型態 id');
            $table->unsignedTinyInteger('season_number')->nullable(true)->comment('賽季');
            $table->boolean('rule')->comment('0=單打, 1=雙打');
            $table->boolean('active')->default(0)->comment('是否可以使用');
            $table->timestampsTz($precision = 0);
            $table->index('pf_id');
            $table->index('season_number');
            $table->foreign('pf_id')->references('id')->on('pokeform')->onUpdate('cascade')->onDelete('SET NULL');
            $table->foreign('season_number')->references('season')->on('rank_season_list')->onUpdate('cascade')->onDelete('SET NULL');
            $table->charset = 'utf8mb4';
            $table->collation = 'utf8mb4_unicode_ci';
            $table->engine = 'InnoDB';
        });

        // DB::statement("ALTER TABLE `$tableName` comment '每個賽季可以使用哪幾隻 pokemon'");
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
