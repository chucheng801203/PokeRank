<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Capsule\Manager as Capsule;

class CreatePoketypeTable extends Migration
{
    protected $tableName = 'poketype';

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
            $table->unsignedSmallInteger('type_id')->nullable(true)->comment('屬性 id');
            $table->timestampsTz($precision = 0);
            $table->index('pf_id');
            $table->index('type_id');
            $table->foreign('pf_id')->references('id')->on('pokeform')->onUpdate('cascade')->onDelete('SET NULL');
            $table->foreign('type_id')->references('id')->on('type')->onUpdate('cascade')->onDelete('SET NULL');
            $table->charset = 'utf8mb4';
            $table->collation = 'utf8mb4_unicode_ci';
            $table->engine = 'InnoDB';
        });

        // DB::statement("ALTER TABLE `$tableName` comment 'pokemon 各個型態的屬性'");
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
