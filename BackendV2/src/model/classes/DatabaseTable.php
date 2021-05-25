<?php


abstract class DatabaseTable
{
    /**
     * declare public
     * Saves values to Database or updates them
     */
    abstract public function save();

    /**
     * declare private
     * inserts values in database
     */
    abstract protected function _insert();

    /**
     * declare private!
     * updates values in Database
     */
    abstract protected function _update();

}