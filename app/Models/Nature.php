<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Nature extends Model
{
    use HasFactory;

    protected $table = 'nature';

    public $incrementing = false;

    protected $fillable = ['id', 'name_zh_tw', 'name_en', 'name_jp'];

    public function rankNature() {
        return $this->hasMany(RankNature::class, 'nature_id', 'id');
    }
}
