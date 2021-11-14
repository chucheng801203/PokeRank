<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RankActivePokemon extends Model
{
    use HasFactory;

    protected $table = 'rank_active_pokemon';

    protected $fillable = ['pf_id', 'season_number', 'rule', 'active'];

    public function pokeform()
    {
        return $this->belongsTo(Pokeform::class, 'pf_id', 'id');
    }
}
