<?php


error_reporting(E_ALL);
date_default_timezone_set('Europe/Berlin');


use \Firebase\JWT\JWT;


class API
{
    //private $xmllocation = 'config/config.xml';
//private $config = simplexml_load_file($xmllocation, API::class);

    private static $config;


    public static function generateJWTToken($username, $moreInfo)
    {
        $settings = include('config/configuration.php');

        // $xmllocation = 'config/config.xml';
        // self::$config = simplexml_load_file($xmllocation);

        //  $iss = self::$config->iss;
        //  $aud = self::$config->aud;
        //  $key = self::$config->key;

        $token = array(
            //Der Aussteller des Tokens
            "iss" => $settings['iss'],
            //Die Zieldomäne, für die das Token ausgestellt wurde.
            "aud" => $settings['aud'],
            //Die Unixzeit, zu der das Token ausgestellt wurde.
            "iat" => time(),
            //Die Unixzeit, ab der das Token gültig ist.
            "nbf" => time(),
            //Das Ablaufdatum des Tokens in Unixzeit, also der Anzahl der Sekunden seit 1970-01-01T00:00:00Z.
            "exp" => time() + (604800), // Token ist 7 Tage gültig
            "data" => array(
                "id" => $username->getId(),
                "firstname" => $username->getFirstname(),
                "surname" => $username->getSurname(),
                "email" => $username->getEmail(),
                "role" => $moreInfo['role']
            )
        );
        foreach ($moreInfo as $key => $info) {
            if ($moreInfo['role'] != $info) {
                $token['data'][$key] = $info;
            }
        }
        return JWT::encode($token, $settings['key']);
    }

    public static function getTokenData($jwtToken)
    {
        $settings = include('config/configuration.php');
        //  $xmllocation = 'config/config.xml';
        //self::$config = simplexml_load_file($xmllocation);

        // $key = self::$config->key;
        if ($jwtToken) {

            try {
                $decoded = JWT::decode($jwtToken, $settings['key'], array('HS256'));

                return $decoded->data;


            } catch (Exception $e) {


                echo json_encode(array(
                    "message" => "Fehler",
                    "error" => $e->getMessage()
                ));
            }
        } else {
            echo json_encode(array(
                "message" => "Token wurde nicht übergeben.",
            ));
        }
    }

    public static function getRole($jwt)
    {
        //$xmllocation = 'config/config.xml';
        //self::$config = simplexml_load_file($xmllocation);

        //$key = self::$config->key;
        $settings = include('config/configuration.php');


        try {
            $decoded = JWT::decode($jwt, $settings['key'], array('HS256'));
            return $decoded->data->role;

        } catch (Exception $e) {
            return null;
        }

    }

    public static function checkToken($jwtToken)
    {
        // $xmllocation = 'config/config.xml';
        //self::$config = simplexml_load_file($xmllocation);

        // $key = self::$config->key;
        $settings = include('config/configuration.php');
        if ($jwtToken) {
            try {
                $decoded = JWT::decode($jwtToken, $settings['key'], array('HS256'));
                return true;

            } catch (Exception $e) {
                return false;
            }
        } else {
            echo json_encode(array(
                "message" => "Token nicht uebergeben",
                "error" => "#801",
            ));
        }
    }
}


