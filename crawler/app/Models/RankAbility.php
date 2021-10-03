<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RankAbility extends Model
{
    use HasFactory;

    protected $table = 'rank_ability';

    protected $primaryKey = null;

    public $incrementing = false;

    protected $fillable = ['pf_id', 'season_number', 'rule', 'ability_id', 'percentage', 'sort'];

    public function ability()
    {
        return $this->belongsTo(Ability::class, 'ability_id', 'id');
    }

    public function pokeform()
    {
        return $this->belongsTo(Pokeform::class, 'pf_id', 'id');
    }
}
