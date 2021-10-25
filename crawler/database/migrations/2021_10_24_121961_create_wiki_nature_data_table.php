<?php

use Illuminate\Database\Capsule\Manager as Capsule;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class CreateWikiNatureDataTable extends Migration
{
    protected $tableName = 'wiki_nature_data';

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
            $table->string('advantage', 60)->nullable(true)->comment('容易成長的能力');
            $table->string('weakness', 60)->nullable(true)->comment('不容易成長的能力');
            $table->string('like', 60)->nullable(true)->comment('喜歡口味');
            $table->string('notlike', 60)->nullable(true)->comment('不喜歡口味');
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
