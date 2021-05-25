<?php


namespace helper;

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

class MailConfig
{
    /**
     * @return PHPMailer
     */
    static function getInstance(){
        $mail = new PHPMailer;
        $mail->isSMTP();
        $mail->CharSet = 'UTF-8';
        $mail->Host = 'panel.tutzer.net';
        $mail->Port = 587;
        $mail->SMTPSecure = 'tls';
        $mail->SMTPAuth = true;
        $mail->Username = "no-reply@api.praktikumsfinder.tk";
        $mail->Password = "HLTXnjzCz_ctu4yE_rGJd9NKAA";
        $mail->setFrom('no-reply@api.praktikumsfinder.tk', 'Praktikumsfinder');

        return $mail;
    }

}
