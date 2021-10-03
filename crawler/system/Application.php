<?php

namespace System;

require __DIR__.'/../vendor/autoload.php';

use Symfony\Component\Console\Application as SymfonyApplication;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Dotenv\Dotenv;
use Illuminate\Database\Capsule\Manager as Capsule;
use Illuminate\Filesystem\Filesystem;

class Application
{
    protected static $instance;

    protected $basePath;

    protected $symfonyApp;

    protected $services = [];

    public static function getInstance()
    {
        if(!static::$instance) {
            static::$instance = new static;
        }

        return static::$instance;
    }

    private function __construct()
    {
        $this->symfonyApp = new SymfonyApplication();
    }

    /** 載入環境變數 */
    public function loadEnv($path)
    {
        $dotenv = new Dotenv();
        $dotenv->load($path);
        return $this;
    }

    /** 初始化資料庫 */
    public function initDataBase($config)
    {
        $capsule = new Capsule;
        $capsule->addConnection($config);
        $capsule->setAsGlobal();
        $capsule->bootEloquent();
        return $this;
    }

    /** 預先載入套件 */
    public function addServices($name, $instance)
    {
        $this->services[$name] = $instance;

        return $this;
    }

    /** 載入 commands */
    public function addAppCommands($namespace, $dirPath)
    {
        $commandNamespace = $namespace;

        $fileSystem = $this->services['fileSystem'];
        $files = $fileSystem->glob($this->basePath($dirPath.'/*.php'));
        
        foreach($files as $file) {
            $path_parts = pathinfo($file);

            $commandName = $commandNamespace.$path_parts['filename'];

            $command = NULL;
            
            if (class_exists($commandName)) {
                $command = $this->commandDependencyInject($commandName);
            }

            if ($command instanceof Command) {
                $this->symfonyApp->add($command);
            }
        }

        return $this;
    }

    /** command 依賴注入 */
    public function commandDependencyInject(string $class)
    {
        $command = new \ReflectionClass($class);
        $params = $command->getConstructor()->getParameters();

        $args = [];
        foreach($params as $param) {
            if ($param->getType()->isBuiltin()) {
                continue;
            }

            if (class_exists($dependencyClass = $param->getType()->getName())) {
                $match = false;
                foreach($this->services as $service) {
                    if(get_class($service) === $dependencyClass) {
                        array_push($args, $service);
                        $match = true;
                    }
                }

                if (! $match) {
                    array_push($args, new $dependencyClass);
                }
            }
            else 
            {

            }
        }
        return $command->newInstanceArgs($args);
    }
    
    public function setBasePath($basePath)
    {
        $this->basePath = rtrim($basePath, '\/');
        return $this;
    }

    public function basePath($path = null)
    {
        return $this->basePath.($path ? '/'.$path : '');
    }

    public function run()
    {
        $this->symfonyApp->run();
    }
}
