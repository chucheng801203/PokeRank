<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SdBaseStat extends Model
{
    use HasFactory;

    protected $table = 'sd_base_stat';

    protected $primaryKey = 'pf_id';

    public $incrementing = false;

    protected $fillable = ['pf_id', 'hp', 'atk', 'def', 'spa', 'spd', 'spe'];

    public function pokeform()
    {
        return $this->belongsTo(Pokeform::class, 'pf_id', 'id');
    }
}
