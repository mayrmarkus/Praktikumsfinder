<?php


namespace helper;


class VerificationMail
{

    static function crypt($string, $action = 'e')
    {
        $secret_key = '13B7482B2987CD8511BB9B9826588';
        $secret_iv = 'AB11AE3D553D5B9A387D987D51517';

        $output = false;
        $encrypt_method = "AES-256-CBC";
        $key = hash('sha256', $secret_key);
        $iv = substr(hash('sha256', $secret_iv), 0, 16);
        if ($action == 'e') {
            $output = base64_encode(openssl_encrypt($string, $encrypt_method, $key, 0, $iv));
            var_dump($output);
        } else if ($action == 'd') {
            $output = openssl_decrypt(base64_decode($string), $encrypt_method, $key, 0, $iv);
        }

        return $output;
    }

    function sendVerificationEmail(\PF_Student $student)
    {
        $cript = self::crypt($student->getId());
        date_default_timezone_set('Etc/UTC');
        //require './Libs/PHPMailer/PHPMailerAutoload.php';
        $mail = MailConfig::getInstance();
        $mail->addAddress($student->getEmail());
        $mail->Subject = "Email Verifizierung";
        $mail->Body = "<h1>Hallo " . $student->getFirstname() . "</h1><br>Willkommen beim Praktikumsfinder.<br />Bitte Klicke auf den Link um deine E-Mail zu verifizieren! <br /><br /><a href='https://api.praktikumsfinder.tk/src/?action=mailVerify&hash=$cript'>Bestätigen</a>";

        $mail->AltBody = 'This is a plain-text message body';

        if (!$mail->send()) {
            echo "Mailer Error: " . $mail->ErrorInfo;
        } else {
            echo "Message sent!";
        }
    }
}