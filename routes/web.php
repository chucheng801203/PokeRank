<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\MainController;
use App\Http\Controllers\RankController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::prefix('api')->group(function () {
    Route::get('rank/top150/{season_number}/{rule}', [RankController::class, 'top150']);
    Route::get('rank/pokemon/{season_number}/{pm_id}', [RankController::class, 'pokemon']);
});

Route::get('/{any}', MainController::class)->where('any', '^.*$');
