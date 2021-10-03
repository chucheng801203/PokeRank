<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pokeform extends Model
{
    use HasFactory;

    protected $table = 'pokeform';

    protected $fillable = ['id', 'pm_id', 'form_id'];

    public function pokemon()
    {
        return $this->belongsTo(Pokemon::class, 'pm_id', 'id');
    }

    public function pokeType()
    {
        return $this->hasMany(Poketype::class, 'pf_id', 'id');
    }

    public function rankTopPokemon()
    {
        return $this->hasMany(RankTopPokemon::class, 'pf_id', 'id');
    }

    public function rankItem()
    {
        return $this->hasMany(RankItem::class, 'pf_id', 'id');
    }

    public function rankAbility()
    {
        return $this->hasMany(RankAbility::class, 'pf_id', 'id');
    }

    public function rankPokemon()
    {
        return $this->hasMany(RankPokemon::class, 'pf_id', 'id');
    }

    public function rankPokemonTeam()
    {
        return $this->hasMany(RankPokemon::class, 'team_pf_id', 'id');
    }

    public function rankWinPokemon()
    {
        return $this->hasMany(RankWinPokemon::class, 'pf_id', 'id');
    }

    public function rankWinPokemonTeam()
    {
        return $this->hasMany(RankWinPokemon::class, 'team_pf_id', 'id');
    }

    public function rankLosePokemon()
    {
        return $this->hasMany(RankLosePokemon::class, 'pf_id', 'id');
    }

    public function rankLosePokemonTeam()
    {
        return $this->hasMany(RankLosePokemon::class, 'team_pf_id', 'id');
    }

    public function rankLoseMove()
    {
        return $this->hasMany(RankLoseMove::class, 'pf_id', 'id');
    }

    public function rankWinMove()
    {
        return $this->hasMany(RankWinMove::class, 'pf_id', 'id');
    }

    public function rankMove()
    {
        return $this->hasMany(RankMove::class, 'pf_id', 'id');
    }

    public function rankNature()
    {
        return $this->hasMany(RankNature::class, 'pf_id', 'id');
    }
}
