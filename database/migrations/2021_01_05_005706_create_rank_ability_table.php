<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateRankAbilityTable extends Migration
{
    protected $tableName = 'rank_ability';
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
            $table->unsignedSmallInteger('ability_id')->nullable(true)->comment('特性 id');
            $table->decimal('percentage', $precision = 5, $scale = 2);
            $table->unsignedTinyInteger('sort')->comment('排序');
            $table->timestampsTz($precision = 0);
            $table->index('pf_id');
            $table->index('ability_id');
            $table->foreign('pf_id')->references('id')->on('pokeform')->onUpdate('cascade')->onDelete('SET NULL');
            $table->foreign('ability_id')->references('id')->on('ability')->onUpdate('cascade')->onDelete('SET NULL');
            $table->foreign('season_number')->references('season')->on('rank_season_list')->onUpdate('cascade')->onDelete('SET NULL');
            $table->charset = 'utf8mb4';
            $table->collation = 'utf8mb4_unicode_ci';
            $table->engine = 'InnoDB';
        });

        DB::statement("ALTER TABLE `$tableName` comment 'pokemon 每個賽季所使用的特性百分比'");
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