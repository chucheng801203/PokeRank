<?php

use Illuminate\Database\Capsule\Manager as Capsule;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class CreateWikiAbilityDataTable extends Migration
{
    protected $tableName = 'wiki_ability_data';

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
            $table->string('name_zh_tw', 60)->nullable(true)->comment('中文名稱');
            $table->string('name_en', 60)->nullable(true)->comment('英文名稱');
            $table->string('name_jp', 60)->nullable(true)->comment('日文名稱');
            $table->string('description', 120)->nullable(true)->comment('說明');
            $table->timestampsTz($precision = 0);
            $table->charset = 'utf8mb4';
            $table->collation = 'utf8mb4_unicode_ci';
            $table->engine = 'InnoDB';
        });

        // DB::statement("ALTER TABLE `$tableName` comment '從寶可夢百科抓取特性資料'");
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
