<?php

namespace App\Services\Pokemon\Exceptions;

class PokemonFormatException extends \Exception
{
    public function __construct(string $err_msg = '')
    {
        $err_msg = 'PokemonFormatException: ' . ($err_msg !== '' ? $err_msg : '資料格式錯誤');
        parent::__construct($err_msg);
    }
}
