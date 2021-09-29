<?php

namespace App\Libraries\Pokemon\Exceptions;

class PokemonFormatException extends \Exception
{
    public function __construct($err_msg = null)
    {
        $err_msg = $err_msg !== null ? $err_msg : '資料格式錯誤';
        parent::__construct($err_msg);
    }
}
