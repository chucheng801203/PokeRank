<?php

use Illuminate\Database\Capsule\Manager as Capsule;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class CreateTypeTable extends Migration
{
    protected $tableName = 'type';

    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        $tableName = $this->tableName;

        Capsule::schema()->create($tableName, function (Blueprint $table) {
            $table->unsignedSmallInteger('id')->comment('屬性 id');
            $table->string('name_zh_tw', 60)->nullable(true)->comment('中文名稱');
            $table->string('name_en', 60)->nullable(true)->comment('英文名稱');
            $table->string('name_jp', 60)->nullable(true)->comment('日文名稱');
            $table->timestampsTz($precision = 0);
            $table->primary('id');
            $table->charset = 'utf8mb4';
            $table->collation = 'utf8mb4_unicode_ci';
            $table->engine = 'InnoDB';
        });

        // DB::statement("ALTER TABLE `$tableName` comment '屬性名稱'");
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
