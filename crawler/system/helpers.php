<?php

if (!function_exists('app')) {
    /**
     * 取得 application 實體
     * 
     * @return System\Application
     */

    function app()
    {
        return System\Application::getInstance();
    }
}

if (!function_exists('base_path')) {
    /**
     * 取得專案根目錄絕對路徑
     * 
     * @return string
     */

    function base_path($path = null)
    {
        return app()->basePath().($path ? '/'.$path : '');
    }
}


if (!function_exists('app_path')) {
    /**
     * 取得專案 app 目錄絕對路徑
     * 
     * @return string
     */

    function app_path($path = null)
    {
        return base_path('app').($path ? '/'.$path : '');
    }
}

if (!function_exists('storage_path')) {
    /**
     * 取得專案製造的檔案存放位置目錄絕對路徑
     * 
     * @return string
     */

    function storage_path($path = null)
    {
        return base_path('storage').($path ? '/'.$path : '');
    }
}