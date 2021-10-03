<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Poketype extends Model
{
    use HasFactory;

    protected $table = 'poketype';

    protected $primaryKey = null;

    public $incrementing = false;

    protected $fillable = ['pf_id', 'type_id'];

    public function pokeform()
    {
        return $this->belongsTo(Pokeform::class, 'pf_id', 'id');
    }

    public function Type()
    {
        return $this->belongsTo(Type::class, 'type_id', 'id');
    }
}
