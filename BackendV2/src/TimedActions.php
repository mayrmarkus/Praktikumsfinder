<?php

namespace TimedAction;

use Thread;

class TimedActions extends Thread
{
    private $running;
    private $timedActions = array();


    public function __construct()
    {

    }

    public function run() {
        if ($this->running){
            foreach ($this->timedActions as $timedAction){
                $timedAction->getAction()();
            }
        }
    }

    public function setActive($active = true)
    {
        while (true){

        }
    }
}