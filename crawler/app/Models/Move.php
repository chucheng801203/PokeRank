<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Move extends Model
{
    use HasFactory;

    protected $table = 'move';

    public $incrementing = false;

    protected $fillable = ['id', 'name_zh_tw', 'name_en', 'name_jp', 'type_id', 'percentage'];

    public function type()
    {
        return $this->belongsTo(Type::class, 'type_id', 'id');
    }

    public function rankMove()
    {
        return $this->hasMany(RankMove::class, 'move_id', 'id');
    }

    public function rankWinMove()
    {
        return $this->hasMany(RankWinMove::class, 'move_id', 'id');
    }

    public function rankLoseMove()
    {
        return $this->hasMany(RankLoseMove::class, 'move_id', 'id');
    }
}
