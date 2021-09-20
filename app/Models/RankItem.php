<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RankItem extends Model
{
    use HasFactory;

    protected $table = 'rank_item';

    protected $primaryKey = NULL;

    public $incrementing = false;

    protected $fillable = ['pf_id', 'season_number', 'rule', 'item_id', 'percentage', 'sort'];

    public function item() {
        return $this->belongsTo(Item::class, 'item_id', 'id');
    }

    public function pokeform() {
        return $this->belongsTo(Pokeform::class, 'pf_id', 'id');
    }
}
