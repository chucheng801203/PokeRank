<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RankWinPokemon extends Model
{
    use HasFactory;

    protected $table = 'rank_win_pokemon';

    protected $primaryKey = ['pf_id', 'season_number', 'rule', 'team_pf_id'];

    public $incrementing = false;

    protected $fillable = ['pf_id', 'season_number', 'rule', 'team_pf_id', 'sort'];

    public function pokeform()
    {
        return $this->belongsTo(Pokeform::class, 'pf_id', 'id');
    }

    public function pokeformTeam()
    {
        return $this->belongsTo(Pokeform::class, 'team_pf_id', 'id');
    }
}
