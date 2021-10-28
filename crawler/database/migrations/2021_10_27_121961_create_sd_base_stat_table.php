<?php

use Illuminate\Database\Capsule\Manager as Capsule;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class CreateSdBaseStatTable extends Migration
{
    protected $tableName = 'sd_base_stat';

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
            $table->unsignedTinyInteger('hp')->nullable(true)->comment('HP');
            $table->unsignedTinyInteger('atk')->nullable(true)->comment('攻擊');
            $table->unsignedTinyInteger('def')->nullable(true)->comment('防禦');
            $table->unsignedTinyInteger('spa')->nullable(true)->comment('特功');
            $table->unsignedTinyInteger('spd')->nullable(true)->comment('特防');
            $table->unsignedTinyInteger('spe')->nullable(true)->comment('速度');
            $table->index('pf_id');
            $table->foreign('pf_id')->references('id')->on('pokeform')->onUpdate('cascade')->onDelete('SET NULL');
            $table->timestampsTz($precision = 0);
            $table->charset = 'utf8mb4';
            $table->collation = 'utf8mb4_unicode_ci';
            $table->engine = 'InnoDB';
        });

        // DB::statement("ALTER TABLE `$tableName` comment '從 ShowDown api 取得種族值資料'");
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
