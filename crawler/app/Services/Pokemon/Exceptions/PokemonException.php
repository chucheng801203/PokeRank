<?php

namespace App\Services\Pokemon\Exceptions;

class PokemonException extends \Exception
{
    public function __construct(string $err_msg = '')
    {
        $err_msg = 'PokemonException: '.($err_msg !== '' ? $err_msg : '發生錯誤');
        parent::__construct($err_msg);
    }
}
