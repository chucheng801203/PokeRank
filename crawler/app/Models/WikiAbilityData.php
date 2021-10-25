<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WikiAbilityData extends Model
{
    use HasFactory;

    protected $table = 'wiki_ability_data';

    protected $fillable = ['id', 'name_zh_tw', 'name_en', 'name_jp', 'description'];
}
