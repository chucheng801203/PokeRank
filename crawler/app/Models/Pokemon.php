<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pokemon extends Model
{
    use HasFactory;

    protected $table = 'pokemon';

    public $incrementing = false;

    protected $fillable = ['id', 'name_zh_tw', 'name_en', 'name_jp'];

    public function pokeform()
    {
        return $this->hasMany(Pokeform::class, 'pm_id', 'id');
    }

    public function rankTopPokemon()
    {
        return $this->hasManyThrough(
            RankTopPokemon::class,
            Pokeform::class,
            'pm_id',
            'pf_id',
            'id',
            'id'
        );
    }

    public function rankPokemon()
    {
        return $this->hasManyThrough(
            RankPokemon::class,
            Pokeform::class,
            'pm_id',
            'pf_id',
            'id',
            'id'
        );
    }

    public function rankWinPokemon()
    {
        return $this->hasManyThrough(
            RankWinPokemon::class,
            Pokeform::class,
            'pm_id',
            'pf_id',
            'id',
            'id'
        );
    }

    public function rankLosePokemon()
    {
        return $this->hasManyThrough(
            RankLosePokemon::class,
            Pokeform::class,
            'pm_id',
            'pf_id',
            'id',
            'id'
        );
    }

    public function rankMove()
    {
        return $this->hasManyThrough(
            RankMove::class,
            Pokeform::class,
            'pm_id',
            'pf_id',
            'id',
            'id'
        );
    }

    public function rankWinMove()
    {
        return $this->hasManyThrough(
            RankWinMove::class,
            Pokeform::class,
            'pm_id',
            'pf_id',
            'id',
            'id'
        );
    }

    public function rankLoseMove()
    {
        return $this->hasManyThrough(
            RankLoseMove::class,
            Pokeform::class,
            'pm_id',
            'pf_id',
            'id',
            'id'
        );
    }

    public function rankAbility()
    {
        return $this->hasManyThrough(
            RankAbility::class,
            Pokeform::class,
            'pm_id',
            'pf_id',
            'id',
            'id'
        );
    }

    public function rankNature()
    {
        return $this->hasManyThrough(
            RankNature::class,
            Pokeform::class,
            'pm_id',
            'pf_id',
            'id',
            'id'
        );
    }

    public function rankItem()
    {
        return $this->hasManyThrough(
            RankItem::class,
            Pokeform::class,
            'pm_id',
            'pf_id',
            'id',
            'id'
        );
    }
}
