<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WikiMoveData extends Model
{
    use HasFactory;

    protected $table = 'wiki_move_data';

    protected $fillable = ['id', 'wiki_id', 'name_zh_tw', 'name_en', 'name_jp', 'type', 'class', 'damage', 'hitRate', 'PP', 'description'];
}
