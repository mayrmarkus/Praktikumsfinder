<?php


namespace helper;


class CompanyInternshipRating
{

    function sendMail($content, \PF_TutorCompany $companyTutor, \PF_Internship $internship)
    {



        $student = \PF_Student::findById($internship->getStudentId());



        $mail = MailConfig::getInstance();
        $mail->Body = $content;

        $mail->SMTPDebug = 2;

        $mail->addAddress($companyTutor->getEmail());
        $mail->Subject = "Bewertung Schüler";

        $mail->AltBody = 'Bitte Bewerten sie unseren Schüler' . $student->getFirstname() . " " . $student->getSurname();

        if (!$mail->send()) {
            echo "Mailer Error: " . $mail->ErrorInfo;
        } else {
            echo "Message sent!";
        }

    }

    function getMailContent($name, $token)
    {
        $link = "localhost:3000/login/jwt/" . $token;

        return "<!DOCTYPE html>
<html lang=\"en\">
<head>
    <meta charset=\"UTF-8\">
    <title>Title</title>
</head>
<style>
    * {
        margin: 0;

        font-family: sans-serif;}

    h1 {
        font-family: sans-serif;
        font-weight: 100;
        text-align: center;
    }

    .content {
        width: 800px;
        margin: auto;
    }

    #toLogin {
        padding: 10px;
        background-color: #4b77bf;
        display: block;
        width: 150px;
        border-radius: 5px;
        text-decoration: none;
        color: white;
        margin: auto;
    }
    
    .logo{
        position: absolute;
        top: 60px;
        right: 30px;
        height: 120px;
    }
</style>
<body>pf_internship
<img class=\"logo\" src=\"https://unroll-images-production.s3.amazonaws.com/projects/0/1588452252226-finalOld.png\" />
<div class=\"content\">
    <h1>Bitte Bewerten sie unseren Schüler</h1>
    <br><br>
    <p>Klicken sie auf diesen Kopf den Schüler $name zu bewerten! Achtung das ist verpflichtend und entscheidet die Endnote des Schülers.</p>
    <br><br>

    <p>Mit freundlichen Grüßen <br> das Praktikumsfinder Dev Team<br> und die Landesberufsschule Bozen</p>
<br><br>
    <a id='toLogin' href=\"$link\">Zur Bewertungsseite</a>
</div>
</body>
</html>
 ";
    }
}
