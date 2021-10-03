<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Capsule\Manager as Capsule;

class CreatePokeformTable extends Migration
{
    protected $tableName = 'pokeform';

    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        $tableName = $this->tableName;

        Capsule::schema()->create($tableName, function (Blueprint $table) {
            $table->unsignedSmallInteger('id')->autoIncrement()->comment('pokemon 型態 id');
            $table->unsignedSmallInteger('pm_id')->nullable(true)->comment('pokemon 編號');
            $table->unsignedTinyInteger('form_id')->comment('pokemon 型態');
            $table->timestampsTz($precision = 0);
            $table->index('pm_id');
            $table->index('form_id');
            $table->foreign('pm_id')->references('id')->on('pokemon')->onUpdate('cascade')->onDelete('SET NULL');
            $table->charset = 'utf8mb4';
            $table->collation = 'utf8mb4_unicode_ci';
            $table->engine = 'InnoDB';
        });

        // DB::statement("ALTER TABLE `$tableName` comment 'pokemon 型態'");
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
