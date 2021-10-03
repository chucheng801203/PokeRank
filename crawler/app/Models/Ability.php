<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Ability extends Model
{
    use HasFactory;

    protected $table = 'ability';

    public $incrementing = false;

    protected $fillable = ['id', 'name_zh_tw', 'name_en', 'name_jp', 'percentage'];

    public function rankAbility()
    {
        return $this->hasMany(RankAbility::class, 'ability_id', 'id');
    }
}
