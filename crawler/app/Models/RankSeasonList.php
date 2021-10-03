<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RankSeasonList extends Model
{
    use HasFactory;

    protected $table = 'rank_season_list';

    protected $primaryKey = 'season';

    public $incrementing = false;

    protected $fillable = ['season', 'start', 'end'];
}
