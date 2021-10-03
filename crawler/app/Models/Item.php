<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Item extends Model
{
    use HasFactory;

    protected $table = 'item';

    public $incrementing = false;

    protected $fillable = ['id', 'name_zh_tw', 'name_en', 'name_jp'];

    public function rankItem()
    {
        return $this->hasMany(RankItem::class, 'item_id', 'id');
    }
}
