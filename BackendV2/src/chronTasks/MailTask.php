<?php

/**
 * Class MailTask
 * @author Alex Larentis
 *
 * sends periodic mails managed by crontab
 *
 */

include "../../vendor/autoload.php";
class MailTask implements ITask
{
    function run()
    {
        require '../model/classes/DatabaseTable.php';
        require '../Database/dbconn.php';
        require '../model/classes/PF_Internship.php';

        require '../helper/MailConfig.php';

        require '../helper/VerificationMail.php';


        //$helper = new \helper\CompanyInternshipRating()

        $a = PF_Internship::getByEndNow();


        foreach ($a as $item) {
        }
       // $helper->sendMail($jwtToken, \PF_Company $company, \PF_Internship $internship);
    }

    function prepare()
    {

    }

    function create()
    {}

    function _cleenup()
    {}
}
