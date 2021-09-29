<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RankMove extends Model
{
    use HasFactory;

    protected $table = 'rank_move';

    protected $primaryKey = null;

    public $incrementing = false;

    protected $fillable = ['pf_id', 'season_number', 'rule', 'move_id', 'percentage', 'sort'];

    public function move()
    {
        return $this->belongsTo(Move::class, 'move_id', 'id');
    }

    public function pokeform()
    {
        return $this->belongsTo(Pokeform::class, 'pf_id', 'id');
    }
}
