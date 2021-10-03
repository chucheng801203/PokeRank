<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RankNature extends Model
{
    use HasFactory;

    protected $table = 'rank_nature';

    protected $primaryKey = null;

    public $incrementing = false;

    protected $fillable = ['pf_id', 'season_number', 'rule', 'nature_id', 'percentage', 'sort'];

    public function nature()
    {
        return $this->belongsTo(Nature::class, 'nature_id', 'id');
    }

    public function pokeform()
    {
        return $this->belongsTo(Pokeform::class, 'pf_id', 'id');
    }
}
