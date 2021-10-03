<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Type extends Model
{
    use HasFactory;

    protected $table = 'type';

    public $incrementing = false;

    protected $fillable = ['id', 'name_zh_tw', 'name_en', 'name_jp'];

    public function move()
    {
        return $this->hasMany(Move::class, 'type_id', 'id');
    }

    public function poketype()
    {
        return $this->hasMany(Poketype::class, 'type_id', 'id');
    }
}
