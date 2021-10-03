<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Capsule\Manager as Capsule;

class CreateRankSeasonList extends Migration
{
    protected $tableName = 'rank_season_list';

    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        $tableName = $this->tableName;

        Capsule::schema()->create($tableName, function (Blueprint $table) {
            $table->unsignedTinyInteger('season')->comment('賽季');
            $table->dateTimeTz('start', $precision = 0)->comment('賽季開始');
            $table->dateTimeTz('end', $precision = 0)->comment('賽季結束');
            $table->timestampsTz($precision = 0);
            $table->primary('season');
            $table->charset = 'utf8mb4';
            $table->collation = 'utf8mb4_unicode_ci';
            $table->engine = 'InnoDB';
        });

        // DB::statement("ALTER TABLE `$tableName` comment 'pokemon 賽季列表'");
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
