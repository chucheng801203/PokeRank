<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WikiNatureData extends Model
{
    use HasFactory;

    protected $table = 'wiki_nature_data';

    protected $fillable = ['id', 'name_zh_tw', 'name_en', 'name_jp', 'advantage', 'weakness', 'like', 'notlike'];
}
