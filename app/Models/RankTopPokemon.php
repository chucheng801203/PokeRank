<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RankTopPokemon extends Model
{
    use HasFactory;

    protected $table = 'rank_top_pokemon';

    protected $primaryKey = null;

    public $incrementing = false;

    protected $fillable = ['pf_id', 'season_number', 'rule', 'ranking'];

    public function pokeform()
    {
        return $this->belongsTo(Pokeform::class, 'pf_id', 'id');
    }
}
