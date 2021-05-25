<?php


interface ITask
{
    function run();
    function prepare();
    function create();
    function _cleenup();
}