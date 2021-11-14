<?php

use Illuminate\Database\Capsule\Manager as Capsule;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class CreateRankNatureTable extends Migration
{
    protected $tableName = 'rank_nature';

    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        $tableName = $this->tableName;

        Capsule::schema()->create($tableName, function (Blueprint $table) {
            $table->unsignedSmallInteger('pf_id')->nullable(true)->comment('pokemon 型態 id');
            $table->unsignedTinyInteger('season_number')->nullable(true)->comment('賽季');
            $table->boolean('rule')->comment('0=單打, 1=雙打');
            $table->unsignedSmallInteger('nature_id')->nullable(true)->comment('個性 id');
            $table->decimal('percentage', $precision = 5, $scale = 2);
            $table->unsignedTinyInteger('sort')->comment('排序');
            $table->timestampsTz($precision = 0);
            $table->index('pf_id');
            $table->index('nature_id');
            $table->index('season_number');
            $table->foreign('pf_id')->references('id')->on('pokeform')->onUpdate('cascade')->onDelete('SET NULL');
            $table->foreign('nature_id')->references('id')->on('nature')->onUpdate('cascade')->onDelete('SET NULL');
            $table->foreign('season_number')->references('season')->on('rank_season_list')->onUpdate('cascade')->onDelete('SET NULL');
            $table->charset = 'utf8mb4';
            $table->collation = 'utf8mb4_unicode_ci';
            $table->engine = 'InnoDB';
        });

        // DB::statement("ALTER TABLE `$tableName` comment 'pokemon 每個賽季所使用的個性百分比'");
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
