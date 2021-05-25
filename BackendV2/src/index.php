<?php


use PhpOffice\PhpWord\Exception\CopyFileException;
use PhpOffice\PhpWord\Exception\CreateTemporaryFileException;

error_reporting(E_ALL);
ini_set("display_errors", 1);

include 'model/classes/DatabaseTable.php';
include 'Database/dbconn.php';
include 'model/classes/PF_Student.php';
include 'model/classes/PF_State.php';
include 'model/classes/PF_Workday.php';
include 'model/classes/PF_TutorCompany.php';
include 'model/classes/PF_Specializations.php';
include 'model/classes/PF_Schoolperson.php';
include 'model/classes/PF_Role.php';
include 'model/classes/PF_Internship.php';
include 'model/classes/PF_Evaluation_Points.php';
include 'model/classes/PF_District.php';
include 'model/classes/PF_Company.php';
include "model/classes/PF_Schoolclass.php";
include "model/classes/PF_Evaluation.php";
include "model/classes/PF_Internship_Rating_Email.php";
include '../vendor/autoload.php';
include '../vendor/phpmailer/phpmailer/src/PHPMailer.php';
include "api.php";
include 'model/classes/PF_Contract.php';
include 'model/classes/PF_Contract_State.php';

include 'generateContract.php';
include './helper/CompanyInternshipRating.php';
include './helper/MailConfig.php';
include "./helper/VerificationMail.php";

$ajax = new index();
if (isset($_GET['action'])) {
    $ajax->run($_GET['action']);
} else {
    echo json_encode(array(
        "message" => "No action provided.",
        "error" => "#876",
    ));
}

class index
{

    private $rights;
    private $encyptedToken;
    private $token;

    public function __construct()
    {
        session_start();

    }

    /**
     * Führt eine Funktion aus
     * @param $aktion
     */
    public function run($aktion)
    {


        if (isset($_SERVER['HTTP_ORIGIN'])) {
            header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
            header('Access-Control-Allow-Credentials: true');
            header('Access-Control-Max-Age: 86400');
        }
        if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {

            if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD']))
                header("Access-Control-Allow-Methods:  GET, POST, PUT, DELETE, OPTIONS");

            if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']))
                header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");

        }


        $xmlrights = file_get_contents('config/rights.xml');
        $this->rights = simplexml_load_string($xmlrights);

        if (isset(getallheaders()['Auth-Token'])) {
            $token = getallheaders()['Auth-Token'];
            $this->encyptedToken = getallheaders()['Auth-Token'];
        }

        if ($aktion == 'login' || $aktion == 'register' || $aktion == 'getContract' || $aktion == 'mailVerify') {
            $this->$aktion();
        } else {
            if (isset($_GET['token']) && $_GET['token'] == 'Lbshi12345') {
                $this->$aktion();
            } elseif (isset($token) && api::checkToken($token)) {
                $role = api::getRole($token);
                if ($this->rights->$aktion->$role == 1) {
                    $this->token = API::getTokenData($token);
                    $this->$aktion();
                } else {
                    echo json_encode(array(
                        "message" => "Not enough permission.",
                        "error" => "#707",
                    ));
                }
            } else {
                echo json_encode(array(
                    "message" => "Token is not valid.",
                    "error" => "#708",
                ));
            }
        }

    }

    function checkToken()
    {
        if (isset($this->encyptedToken) && api::checkToken($this->encyptedToken)) {
            echo json_encode(array(
                "message" => "Token is valid"
            ));
        } else {
            echo json_encode(array(
                "message" => "Token is not valid.",
                "error" => "#708",
            ));
        }
    }


    function makeInternship()
    {
        $i = new PF_Internship();
        $i->setSchoolclassId($_POST['schoolclass_id']);
        $i->setStudentId($this->token->id);
        $i->save();
        echo json_encode($i);
    }

    function login()
    {
        $username = '';
        if (isset($_POST['email']) && isset($_POST['password'])) {
            $username = PF_Schoolperson::findByEmail($_POST['email']);
            if ($username == false) {
                $username = PF_TutorCompany::findByEmail($_POST['email']);
                if ($username == false) {
                    $username = PF_Student::findByEmail($_POST['email']);
                    if ($username == false) {

                    } else if ($username->getIsVerified() == 0) {
                        $username = false;
                        echo json_encode(array(
                            "message" => "Email ist nicht verifiziert",
                            "error" => "#709",
                        ));
                    } else if ($username->getIsEnabled() == 0) {
                        $username = false;
                        echo json_encode(array(
                            "message" => "Der Account wurde von der Verwaltung deaktiviert",
                            "error" => "#710",
                        ));
                    }
                }
            }
        }
        if ($username != false && get_class($username) != 'PF_TutorCompany') {
            if (password_verify($_POST['password'], $username->getPassword())) {
                $information = array();
                $information['role'] = $this->getRole($username);
                $token = api::generateJWTToken($username, $information);
                $temp = array();
                $temp['message'] = 'Successful login.';
                $temp['token'] = $token;
                $temp['tokenData'] = API::getTokenData($token);
                echo json_encode($temp);
            } else {
                echo json_encode(array(
                    "message" => "Login failed",
                    "error" => "#710",
                ));
            }
        } elseif ($username != false && gettype($username) == 'object' && get_class($username) == 'PF_TutorCompany') {
            $information = array();
            $information['role'] = $this->getRole($username);
            $information['companyID'] = $username->getCompany_id();
            $token = api::generateJWTToken($username, $information);
            $temp = array();
            $temp['message'] = 'Successful login.';
            $temp['token'] = $token;
            $temp['tokenData'] = API::getTokenData($token);
            echo json_encode($temp);
        } else if ($username != false) {
            echo json_encode(array(
                "message" => "Login failed",
                "error" => "#711",
            ));
        }
    }

    function loginWithToken()
    {
        $token = $_POST['token'];
        $role = API::getRole($token);
        $temp = array();
        if ($role == 'Company') {
            $temp['message'] = 'Successful login.';
            $temp['token'] = $token;
            $temp['tokenData'] = API::getTokenData($token);
            echo json_encode($temp);
        }
    }


    function getRole($username)
    {
        if (get_class($username) == 'PF_Student') {
            return 'Student';
        } elseif (get_class($username) == 'PF_Schoolperson') {
            if ($username->getIsAdministration() == false) {
                return 'Teacher';
            } else {
                return 'Administration';
            }
        } elseif (get_class($username) == 'PF_TutorCompany') {
            return 'Company';
        } else {
            return 'No Role Found ';
        }
    }


    function register()
    {
        if (isset($_POST['role']) && $_POST['role'] == 'student') {
            if (!empty($_POST['firstname']) && !empty($_POST['surname']) && !empty($_POST['email']) && !empty($_POST['password'])) {
                try {
                    $password = password_hash($_POST['password'], PASSWORD_DEFAULT);
                    if ($this->checkIfEmailIsNotUsed($_POST['email'])) {
                        $student = new PF_Student($_POST);
                        $student->setPassword($password);
                        $student->setIsEnabled(1);
                        $student->save();
                        $mh = new \helper\VerificationMail();
                        $mh->sendVerificationEmail($student);
                    } else {
                        echo json_encode(array(
                            "message" => "Email wird bereits verwendet",
                            "error" => "#715",
                        ));
                    }
                } catch (PDOException $e) {
                    $errCode = $e->getCode();
                    $errMesg = $e->getMessage();
                    if ($e->getCode() == 23000) {
                        echo json_encode(array(
                            "message" => "Email wird bereits verwendet",
                            "error" => "#715",
                        ));
                    } else {
                        echo json_encode(array(
                            "message" => "Fehler nicht protokolliert.",
                        ));
                    }
                }
            } else {
                echo json_encode(array(
                    "message" => "Bitte füllen Sie alle Felder aus.",
                    "error" => "#716",
                ));
            }
        }
    }

    function mailVerify()
    {
        if (isset($_GET['hash'])) {
            $hash = $_GET['hash'];
            $userid = \helper\VerificationMail::crypt($hash, 'd');
            $student = PF_Student::findById($userid);
            if ($student != false) {
                $student->setIsVerified(true);
                $student->save();
                echo "<h1>Hallo " . $student->getFirstname() . ",</h1><br> du kannst dich jetzt anmelden ";
            }
        }
    }

    function getEncryptedTokenData()
    {
        echo json_encode(API::getTokenData($this->encyptedToken));
    }

    function getStudentByClass()
    {
        $class = PF_Schoolclass::findById($_POST['id']);
        $students = $class->getStudent();
        echo json_encode($students);
    }

    function getInternshipByStudent()
    {
        $internships = PF_Internship::findInternshipByStudentId($_POST['id']);
        $student = PF_Student::findById($_POST['id']);
        $schoolClassArray = array();
        $schoolClassArray = PF_Schoolclass::findeNachStudent($student);
        $temp = $schoolClassArray;
        $schoolClassArray = array();
        foreach ($temp as $key => $class) {
            $schoolClassArray[$key][0] = $class['name'];
            $schoolClassArray[$key][1] = $class['schoolyear'];
            $schoolClassArray[$key][2] = $class['active'];
            $schoolClassArray[$key][3] = $class['id'];
        }
        $final = array();
        $b = false;
        if ($internships != null) {
            foreach ($internships as $singleInternship) {
                $singleInternship['startdate'] = date("d.m.Y", strtotime($singleInternship['startdate']));
                $singleInternship['enddate'] = date("d.m.Y", strtotime($singleInternship['enddate']));
                $counter = 0;
                for ($i = 0; $i < sizeof($schoolClassArray) && $b == false; $i++) {
                    if ($schoolClassArray[$i] != $singleInternship['classname']) {
                        $counter++;
                    }
                    if ($counter == sizeof($schoolClassArray)) {
                        //$final[$schoolClassArray[$i][1] . "," . $schoolClassArray[$i][0]]['internships'][] = array();
                        $final[$schoolClassArray[$i][1] . "," . $schoolClassArray[$i][0]]['active'] = $schoolClassArray[$i][2];
                        $final[$schoolClassArray[$i][1] . "," . $schoolClassArray[$i][0]]['schoolYear'] = $schoolClassArray[$i][1];
                        $final[$schoolClassArray[$i][1] . "," . $schoolClassArray[$i][0]]['id'] = $schoolClassArray[$i][3];
                        $b = true;
                    }
                }
                $final[$singleInternship['schoolyear'] . "," . $singleInternship['classname']]['internships'][] = $singleInternship;
                $final[$singleInternship['schoolyear'] . "," . $singleInternship['classname']]['active'] = $singleInternship['classactive'];
                $final[$singleInternship['schoolyear'] . "," . $singleInternship['classname']]['schoolYear'] = $singleInternship['schoolyear'];
                $final[$singleInternship['schoolyear'] . "," . $singleInternship['classname']]['id'] = $singleInternship['classid'];
            }
        } else {
            $counter = 0;
            for ($i = 0; $i < sizeof($schoolClassArray) && $b == false; $i++) {
                $final[$schoolClassArray[$i][1] . "," . $schoolClassArray[$i][0]]['internships'][] = array();
                $final[$schoolClassArray[$i][1] . "," . $schoolClassArray[$i][0]]['active'] = $schoolClassArray[$i][2];
                $final[$schoolClassArray[$i][1] . "," . $schoolClassArray[$i][0]]['schoolYear'] = $schoolClassArray[$i][1];
                $final[$schoolClassArray[$i][1] . "," . $schoolClassArray[$i][0]]['id'] = $schoolClassArray[$i][3];
            }
        }
        ksort($final);
        foreach ($final as $key => $f) {
            $internshipcounter = 0;
            if (isset($f['internships'])) {
                if (sizeof($f['internships']) == 1) {
                    if (!sizeof($f['internships'][0]) == 0) {
                        $internshipcounter++;
                    }
                } else {
                    $internshipcounter += sizeof($f['internships']);
                }
            } else {
                $internshipcounter = 0;
            }
            $final[$key]['internshipcounter'] = $internshipcounter;
        }
        echo json_encode($final);

    }

    function getOwnInternship()
    {
        $internships = PF_Internship::findInternshipByStudentId($this->token->id);
        $student = PF_Student::findById($this->token->id);
        $schoolClassArray = array();
        $schoolClassArray = PF_Schoolclass::findeNachStudent($student);
        $temp = $schoolClassArray;
        $schoolClassArray = array();
        foreach ($temp as $key => $class) {
            $schoolClassArray[$key][0] = $class['name'];
            $schoolClassArray[$key][1] = $class['schoolyear'];
            $schoolClassArray[$key][2] = $class['active'];
            $schoolClassArray[$key][3] = $class['id'];
        }
        $final = array();
        $b = false;
        if ($internships != null) {
            foreach ($internships as $singleInternship) {
                $singleInternship['startdate'] = date("d.m.Y", strtotime($singleInternship['startdate']));
                $singleInternship['enddate'] = date("d.m.Y", strtotime($singleInternship['enddate']));
                $counter = 0;
                for ($i = 0; $i < sizeof($schoolClassArray) && $b == false; $i++) {
                    if ($schoolClassArray[$i] != $singleInternship['classname']) {
                        $counter++;
                    }
                    if ($counter == sizeof($schoolClassArray)) {
                        $final[$schoolClassArray[$i][1] . "," . $schoolClassArray[$i][0]]['internships'][] = array();
                        $final[$schoolClassArray[$i][1] . "," . $schoolClassArray[$i][0]]['active'] = $schoolClassArray[$i][2];
                        $final[$schoolClassArray[$i][1] . "," . $schoolClassArray[$i][0]]['schoolYear'] = $schoolClassArray[$i][1];
                        $final[$schoolClassArray[$i][1] . "," . $schoolClassArray[$i][0]]['id'] = $schoolClassArray[$i][3];
                        $b = true;
                    }
                }
                $final[$singleInternship['schoolyear'] . "," . $singleInternship['classname']]['internships'][] = $singleInternship;
                $final[$singleInternship['schoolyear'] . "," . $singleInternship['classname']]['active'] = $singleInternship['classactive'];
                $final[$singleInternship['schoolyear'] . "," . $singleInternship['classname']]['schoolYear'] = $singleInternship['schoolyear'];
                $final[$singleInternship['schoolyear'] . "," . $singleInternship['classname']]['id'] = $singleInternship['classid'];
            }
        } else {
            $counter = 0;
            for ($i = 0; $i < sizeof($schoolClassArray) && $b == false; $i++) {
                $final[$schoolClassArray[$i][1] . "," . $schoolClassArray[$i][0]]['internships'][] = array();
                $final[$schoolClassArray[$i][1] . "," . $schoolClassArray[$i][0]]['active'] = $schoolClassArray[$i][2];
                $final[$schoolClassArray[$i][1] . "," . $schoolClassArray[$i][0]]['schoolYear'] = $schoolClassArray[$i][1];
                $final[$schoolClassArray[$i][1] . "," . $schoolClassArray[$i][0]]['id'] = $schoolClassArray[$i][3];
            }
        }
        ksort($final);
        foreach ($final as $key => $f) {
            $internshipcounter = 0;
            if (sizeof($f['internships']) == 1) {
                if (!sizeof($f['internships'][0]) == 0) {
                    $internshipcounter++;
                }
            } else {
                $internshipcounter += sizeof($f['internships']);
            }
            $final[$key]['internshipcounter'] = $internshipcounter;
        }
        echo json_encode($final);
    }

    function insertInternshipRating()
    {
        $int = PF_Internship::findById($_GET['internship_id']);
        $ret = array();
        $valuesArray = array();
        $eva = PF_Evaluation::findByInternship($int);
        if ($eva == null) {
            foreach ($_POST as $key => $item) {
                $item = json_decode($item);
                for ($i = 0; $i < sizeof($item) - 1; $i += 2) {
                    $valuesArray[$key][$item[$i]] = $item[$i + 1];
                }
            }
            foreach ($valuesArray as $rating) {
                $eval = new PF_Evaluation();
                $eval->setInternshipId($int->getId());
                $eval->setEvaluationPointsId($rating['id']);
                $eval->setEvaluation($rating['rating']);
                $ret[] = $eval->save();
            }
            echo json_encode($ret);
        } else {
            echo "false";
        }
    }


    function getInternshipByCompany()
    {
        $internships = PF_Internship::findInternshipByCompanyIdWithTutor($_POST['id'], $this->token->id);
        $final = array();
        foreach ($internships as $singleInternship) {
            $singleInternship['startdate'] = date("d.m.Y", strtotime($singleInternship['startdate']));
            $singleInternship['enddate'] = date("d.m.Y", strtotime($singleInternship['enddate']));
            $final[$singleInternship['classname'] . " " . $singleInternship['schoolyear']]['internships'][] = $singleInternship;
            $final[$singleInternship['classname'] . " " . $singleInternship['schoolyear']]['active'] = $singleInternship['classactive'];
            $final[$singleInternship['classname'] . " " . $singleInternship['schoolyear']]['schoolYear'] = $singleInternship['schoolyear'];
            $final[$singleInternship['classname'] . " " . $singleInternship['schoolyear']]['id'] = $singleInternship['classid'];
        }
        ksort($final);
        foreach ($final as $key => $f) {
            $internshipcounter = 0;
            if (sizeof($f['internships']) == 1) {
                if (!sizeof($f['internships'][0]) == 0) {
                    $internshipcounter++;
                }
            } else {
                $internshipcounter += sizeof($f['internships']);
            }
            $final[$key]['internshipcounter'] = $internshipcounter;
        }
        echo json_encode($final);

    }


    function getInternshipByCompanySortedByYear()
    {
        $internships = PF_Internship::findInternshipByCompanyId($_POST['id']);
        $final = array();
        $b = false;
        $years = array();
        foreach ($internships as $singleIntership) {
            $thisyear = $singleIntership['schoolyear'];
            $bol = true;
            foreach ($years as $key => $year) {
                if ($thisyear == $years[$key]) {
                    $bol = false;
                }
            }
            if ($bol == true) {
                $years[] = $singleIntership['schoolyear'];
            }
        }
        foreach ($internships as $singleInternship) {
            $singleInternship['startdate'] = date("d.m.Y", strtotime($singleInternship['startdate']));
            $singleInternship['enddate'] = date("d.m.Y", strtotime($singleInternship['enddate']));
            $final[$singleInternship['schoolyear']]['schoolclass'][$singleInternship['classname']]['internships'][] = $singleInternship;
            $final[$singleInternship['schoolyear']]['schoolclass'][$singleInternship['classname']]['active'] = $singleInternship['classactive'];
            $final[$singleInternship['schoolyear']]['schoolclass'][$singleInternship['classname']]['schoolYear'] = $singleInternship['schoolyear'];
            $final[$singleInternship['schoolyear']]['schoolclass'][$singleInternship['classname']]['id'] = $singleInternship['classid'];
        }
        ksort($final);
        foreach ($final as $key => $z) {
            $internshipcounter = 0;
            foreach ($z as $key2 => $y) {
                foreach ($y as $key3 => $f) {
                    if (sizeof($f['internships']) == 1) {
                        if (!sizeof($f['internships'][0]) == 0) {
                            $internshipcounter++;
                        }
                    } else {
                        $internshipcounter += sizeof($f['internships']);

                    }
                    $final[$key]['internshipcounter'] = $internshipcounter;

                }
            }
        }
        foreach ($final as $key => $f) {
            ksort($f['schoolclass']);
            $final[$key] = $f;
        }
        echo json_encode($final);
    }

    function getInternshipById()
    {
        $internship = PF_Internship::findById($_GET["id"]);
        echo json_encode($internship);
    }

    function deleteSchoolclass()
    {
        $role = $this->token->role;

        if ($role == 'Administration' || $role == 'Teacher') {
            $schoolclass = PF_Schoolclass::findById($_POST['schoolclass_id']);
            $schoolclass->removeStudents();
            $internships = PF_Internship::findBySchooclassId($schoolclass->getId());
            foreach ($internships as $internship) {
                $workdays = PF_Workday::findByInternshipId($internship->getId());
                $evaluations = PF_Evaluation::findByInternship($internship);
                $internship->deleteInternships();
                $internshipRatingEmails = PF_Internship_Rating_Email::findByInternshipId();
                if ($workdays != false) {
                    foreach ($workdays as $workday) {
                        $workdays->deleteWorkday();
                    }
                }
                if ($evaluations != false) {
                    foreach ($evaluations as $evaluation) {
                        $evaluation->deleteEvaluation($internship);
                    }
                }
                if ($internshipRatingEmails != false) {
                    foreach ($internshipRatingEmails as $internshipRatingEmail) {
                        $internshipRatingEmail->deleteInternshipRatingEmail();
                    }
                }
            }
            $schoolclass->deleteSchooclass();
            echo json_encode(array("worked" => "true"));
        } else {
            echo json_encode(array("worked" => "false"));
        }
    }

    function internshipDataUpload()
    {
        if (isset($_POST['id']) && $_POST['id'] !== 'null') {
            $toSave = PF_Internship::findById($_POST['id']);
            if (isset($_POST['to']) && $_POST['to'] !== 'null') {
                $toSave->setTo($_POST['to']);
            }
            if (isset($_POST['from']) && $_POST['from'] !== 'null') {
                $toSave->setFrom($_POST['from']);

            }
            if (isset($_POST['tutor']) && $_POST['tutor'] !== 'null') {

                $toSave->setTutor($_POST['tutor']);
            }
            if (isset($_POST['company_id']) && $_POST['company_id'] !== 'null') {

                $toSave->setCompanyId($_POST['company_id']);
            }
            if (isset($_POST['state_id']) && $_POST['state_id'] !== 'null') {

                $toSave->setStateId($_POST['state_id']);
            }
            if (isset($_POST['tutor_company_id']) && $_POST['tutor_company_id'] !== 'null') {
                $toSave->setTutorCompanyId($_POST['tutor_company_id']);
            }
            if (isset($_POST['rating']) && $_POST['rating'] !== 'null') {
                $toSave->setRating($_POST['rating']);
            }
            if ($toSave->getId() == null) {
                $toSave->insertEmpty();
            }
            echo json_encode($toSave->save());
        }


    }

    function rateContract()
    {
        $retArr = array();
        if (isset($_POST['internshipId'])) {
            $internship = PF_Internship::findById($_POST['internshipId']);
            $contract = PF_Contract::findById($internship->getContractId());
            if ($contract != false) {
                if (isset($_POST['approved'])) {
                    if ($_POST['approved'] != true) {
                        $contract->setApproved(0);
                        if (isset($_POST['stateValues'])) {
                            $stateValues = json_decode($_POST['stateValues']);
                            $contract->removeContractState();
                            foreach ($stateValues as $singleState) {
                                $arr = array();
                                for ($i = 0; $i < sizeof($singleState) - 1; $i += 2) {
                                    $arr[$singleState[$i]] = $singleState[$i + 1];
                                }
                                if ($arr['isChecked']) {
                                    $con_state = PF_Contract_State::findById($arr['id']);

                                    if ($con_state == false) {
                                        $con_state = new  PF_Contract_State();
                                        $con_state->setName($arr['name']);
                                        $con_state->setGeneral(0);
                                        $con_state->save();
                                    }
                                    $retArr[] = $contract->addContractStateToContract($con_state);
                                }
                            }
                        }
                        $retArr['Approved'] = "Not Approved";
                    } else {
                        $retArr['Approved'] = "Approved";
                        $contract->setApproved(1);
                        $contract->save();
                        $retArr['contract'] = $contract;
                    }
                }
            }
        }
        echo json_encode($retArr);
    }

    function getAllContractStates()
    {
        echo json_encode(PF_Contract_State::findAllGeneral());
    }

    function createCompany()
    {
        $cp = new PF_Company();

        if (isset($_POST['email']) && !empty($_POST['email'])) {
            if ($this->checkIfEmailIsNotUsed($_POST['email'])) {
                $cp->setEmail($_POST['email']);
            } else {
                echo json_encode(array(
                    "message" => "Email already used",
                    "error" => "#725",
                ));
            }
        }
        if (isset($_POST['address']) && !empty($_POST['address'])) {
            $cp->setAddress($_POST['address']);
        }
        if (isset($_POST['companyname']) && !empty($_POST['companyname'])) {
            $cp->setName($_POST['companyname']);
        }
        if (isset($_POST['phonenumber']) && !empty($_POST['phonenumber'])) {
            $cp->setPhonenumber($_POST['phonenumber']);
        }
        if (isset($_POST['cap']) && !empty($_POST['cap'])) {
            $cp->setCap($_POST['cap']);
        }
        if (isset($_POST['isVerified']) && !empty($_POST['isVerified'])) {
            $cp->setIsVerified($_POST['isVerified']);
        }
        $cp->save();
        echo json_encode($cp);

        if (isset($_POST['specialization']) && !empty($_POST['specialization'])) {
            if (!is_numeric($_POST['specialization'])) {
                $spec = new PF_Specializations();
                $spec->setDescription($_POST['specialization']);
                $spec->save();
                $cp->addToSpecialization($spec->getId());
            } else {
                $cp->addToSpecialization($_POST['specialization']);
            }
        }
        if (isset($_POST['districtname']) && !empty($_POST['districtname'])) {
            $dis = PF_District::findByName($_POST['districtname']);
            if ($dis != false) {
                $cp->addToDistrict($dis->getId());
            } else {
                $dis = new PF_District();
                $dis->setName($_POST['districtname']);
                $dis->save();
                $cp->addToDistrict($dis->getId());
            }
        }
    }

    function createTutorCompany()
    {
        $tutorCompany = new PF_TutorCompany();

        if (isset($_POST['email']) && !empty($_POST['email'])) {
            if ($this->checkIfEmailIsNotUsed($_POST['email'])) {
                $tutorCompany->setEmail($_POST['email']);
                if (isset($_POST['phonenumber']) && !empty($_POST['phonenumber'])) {
                    $tutorCompany->setPhonenumber($_POST['phonenumber']);
                }
                if (isset($_POST['firstname']) && !empty($_POST['firstname'])) {
                    $tutorCompany->setFirstname($_POST['firstname']);
                }
                if (isset($_POST['surname']) && !empty($_POST['surname'])) {
                    $tutorCompany->setSurname($_POST['surname']);
                }
                if (isset($_POST['company_id']) && !empty($_POST['company_id'])) {
                    $tutorCompany->setCompany_id($_POST['company_id']);
                }
                if (isset($_POST['isVerified']) && !empty($_POST['isVerified'])) {
                    $tutorCompany->setIsVerified($_POST['isVerified']);
                }
                if (isset($_POST['isEmployed']) && !empty($_POST['isEmployed'])) {
                    $tutorCompany->setIsEmployed($_POST['isEmployed']);
                }
                $tutorCompany->save();
                echo json_encode($tutorCompany);
            } else {
                echo json_encode(array(
                    "message" => "Email already used",
                    "error" => "#725",
                ));
            }
        }

    }

    /**
     * @param $email
     * return boolean
     */
    function checkIfEmailIsNotUsed($email)
    {
        $tc = PF_TutorCompany::findByEmail($email);
        $c = PF_Company::findByEmail($email);
        $s = PF_Student::findByEmail($email);
        $sp = PF_Schoolperson::findByEmail($email);
        if ($tc == false && $c == false && $s == false && $sp == false) {
            return true;
        } else {
            return false;
        }
    }

    function createClass()

    {
        $class = new PF_Schoolclass();
        if (isset($_POST['name']) && !empty($_POST['name'])) {
            $class->setName($_POST['name']);
        }
        if (isset($_POST['schoolyear']) && !empty($_POST['schoolyear'])) {
            $class->setSchoolyear($_POST['schoolyear']);
        }
        if (isset($_POST['token']) && !empty($_POST['token'])) {
            $class->setToken($_POST['token']);
        }
        if (isset($_POST['specialization']) && !empty($_POST['specialization'])) {
            if (!is_numeric($_POST['specialization'])) {
                $spec = new PF_Specializations();
                $spec->setDescription($_POST['specialization']);
                $spec->save();
                $class->setSpecializationsid($spec->getId());
            } else {
                $class->setSpecializationsid($_POST['specialization']);
            }
        }
        if (isset($_POST['classteacher_id']) && !empty($_POST['classteacher_id'])) {
            $class->setClassteacherId($_POST['classteacher_id']);
        }
        if (isset($_POST['isActive']) && !empty($_POST['isActive'])) {
            $class->setActive($_POST['isActive']);
        } else {
            $class->setActive(1);
        }
        if ($class->save() == true) {
            echo json_encode(array(
                "message" => "successful",
                "schoolclass" => $class,
            ));
        } else {
            echo json_encode(array(
                "message" => "error",
                "error" => "error in createClass",
            ));
        }
    }

    function markFinished()
    {
        $internship = PF_Internship::findById($_POST['internship_id']);
        $from = $internship->getFrom();
        $to = $internship->getTo();
        $today = strtotime('today');
        $sdFormat = strtotime(date("j F Y", strtotime($from)));
        $edFormat = strtotime(date("j F Y", strtotime($to)));
        if ($edFormat <= $today) {
            $retArrr['canChange'] = true;
            $internship->setStateId(10);
            $internship->save();
        } else {
            $retArrr['canChange'] = false;
        }
        $retArrr['internship'] = $internship;
        echo json_encode($retArrr);
    }

    function getWorkdays()
    {
        $retArrr = array();
        $from = $_POST['from'];
        $to = $_POST['to'];
        $today = strtotime('today');
        $sdFormat = strtotime(date("j F Y", strtotime($from)));
        $edFormat = strtotime(date("j F Y", strtotime($to)));
        if ($edFormat <= $today) {
            $retArrr['canChange'] = true;
        } else {
            $retArrr['canChange'] = false;
        }
        for ($sdFormat; $sdFormat <= $edFormat; $sdFormat += 86400) {
            if (date("N", $sdFormat) < 6) {
                $retArrr['days'][] = (date("d.m.Y", $sdFormat));
            }
        }
        $retArrr['weekdays'] = sizeof($retArrr['days']);
        echo json_encode($retArrr);
    }

    function updateTCInfo()
    {
        $tc = PF_TutorCompany::findById($this->token['id']);
        $retarr = array();
        if (isset($_POST['company_id'])) {
            $c = PF_Company::findById($_POST['company_id']);
            if (isset($_POST['firstname'])) {
                $tc->setFirstname($_POST['firstname']);
            }
            if (isset($_POST['surname'])) {
                $tc->setSurname($_POST['surname']);
            }
            if (isset($_POST['t_email'])) {
                $tc->setEmail($_POST['t_email']);
            }
            if (isset($_POST['address'])) {
                $c->setAddress($_POST['address']);
            }
            if (isset($_POST['c_email'])) {
                $c->setEmail($_POST['c_email']);
            }
            if (isset($_POST['companyname'])) {
                $c->setName($_POST['companyname']);
            }
            if (isset($_POST['phonenumber'])) {
                $c->setPhonenumber($_POST['phonenumber']);
            }
            $retarr[] = $c->save();
            $retarr[] = $tc->save();
        }
        echo json_encode($retarr);
    }

    function editCompany()
    {
        $retarr = array();
        if (isset($_POST['company_id'])) {
            $c = PF_Company::findById($_POST['company_id']);
            if (isset($_POST['address'])) {
                $c->setAddress($_POST['address']);
            }
            if (isset($_POST['c_email'])) {
                $c->setEmail($_POST['c_email']);
            }
            if (isset($_POST['companyname'])) {
                $c->setName($_POST['companyname']);
            }
            if (isset($_POST['phonenumber'])) {
                $c->setPhonenumber($_POST['phonenumber']);
            }
            $retarr[] = $c->save();
        }
        echo json_encode($retarr);
    }

    function editSpecialization()
    {
        if (isset($_POST['specializations_id']) && !empty($_POST['specializations_id'])) {
            $spec = PF_Specializations::findById($_POST['specializations_id']);
            if ($spec != false) {
                if (isset($_POST['description']) && !empty($_POST['description'])) {
                    $spec->setDescription($_POST['description']);
                }
                if (PF_Specializations::findByDescription($_POST['description']) == false) {
                    $spec->save();
                    $specs = PF_Specializations::findAll();
                    echo json_encode($specs);
                } else {
                    echo json_encode(array(
                        "message" => "Fachrichtung existiert schon",
                        "error" => "#777",
                    ));
                }
            } else {
                echo json_encode(array(
                    "message" => "Fachrichtung ID gibt es nicht",
                    "error" => "#781",
                ));
            }
        } else {
            echo json_encode(array(
                "message" => "Fachrichtung ID nicht übergeben",
                "error" => "#783",
            ));
        }
    }

    function editRole()
    {
        if (isset($_POST['role_id']) && !empty($_POST['role_id'])) {
            $role = PF_Role::findById($_POST['role_id']);
            if ($role != false) {
                if (isset($_POST['description']) && !empty($_POST['description'])) {
                    $role->setDescription($_POST['description']);
                }
                if (isset($_POST['name']) && !empty($_POST['name'])) {
                    $role->setName($_POST['name']);
                }
                $role->save();
                $roles = PF_Role::findAll();
                echo json_encode($roles);
            } else {
                echo json_encode(array(
                    "message" => "Role ID doesnt exist",
                    "error" => "#780",
                ));
            }
        } else {
            echo json_encode(array(
                "message" => "Role ID nicht übergeben",
                "error" => "#782",
            ));
        }
    }

    function createSpecialization()
    {
        if (isset($_POST['specialization_description']) && !empty($_POST['specialization_description'])) {
            $spec = PF_Specializations::findByDescription($_POST['specialization_description']);
            if ($spec == false) {
                $spec = new PF_Specializations();
                $spec->setDescription($_POST['specialization_description']);
                $spec->save();
                $specs = PF_Specializations::findAll();
                echo json_encode($specs);
            } else {
                echo json_encode(array(
                    "message" => "Fachrichtung existiert schon",
                    "error" => "#777",
                ));
            }
        } else {
            echo json_encode(array(
                "message" => "Fachrichtung nicht übergeben",
                "error" => "#778",
            ));
        }

    }

    function createRole()
    {
        $role = new PF_Role();
        if (isset($_POST['name']) && !empty($_POST['name']) && isset($_POST['description']) && !empty($_POST['description'])) {
            $role->setName($_POST['name']);
            $role->setDescription($_POST['description']);
            if ($role->save() == 1) {
                $roles = PF_Role::findAll();
                echo json_encode($roles);
            } else {
                echo json_encode(array(
                    "message" => "Es gab einen Fehler beim Eintragen in die Datenbank",
                    "error" => "#878",
                ));
            }
        } else {
            echo json_encode(array(
                "message" => "Es gab einen Fehler beim Übertragen der Daten",
                "error" => "#879",
            ));
        }
    }


    function getAllRoles()
    {
        $roles = PF_Role::findAll();
        echo json_encode($roles);
    }

    function getClassByStudent()
    {
        $a = PF_Student::findById($_GET['id']);
        $ret = $a->getClass();
        echo json_encode($ret);

    }

    function addSchoolperson()
    {
        $sp = new PF_Schoolperson();
        if (isset($_POST['email']) && !empty($_POST['email'])) {
            if ($this->checkIfEmailIsNotUsed($_POST['email'])) {
                $sp->setEmail($_POST['email']);
                if (isset($_POST['firstname']) && !empty($_POST['firstname'])) {
                    $sp->setFirstname($_POST['firstname']);
                }
                if (isset($_POST['surname']) && !empty($_POST['surname'])) {
                    $sp->setSurname($_POST['surname']);
                }
                if (isset($_POST['password']) && !empty($_POST['password'])) {
                    $password = password_hash($_POST['password'], PASSWORD_DEFAULT);
                    $sp->setPassword($password);
                }
                if (isset($_POST['phonenumber']) && !empty($_POST['phonenumber'])) {
                    $sp->setPhonenumber($_POST['phonenumber']);
                }
                if (isset($_POST['role']) && !empty($_POST['role'])) {
                    if (!is_numeric($_POST['role'])) {
                        $r = new  PF_Role();
                        $r->setName($_POST['role']);
                        $r->setDescription($_POST['role_description']);
                        $r->save();
                        $sp->setRole_Id($r->getId());
                    } else {
                        $sp->setRole_Id($_POST['role']);
                    }
                }
                if (isset($_POST['isAdministration']) && !empty($_POST['isAdministration'])) {
                    if ($_POST['isAdministration'] == "false") {
                        $sp->setIsAdministration(0);
                    } else if ($_POST['isAdministration'] == "true") {
                        $sp->setIsAdministration(1);
                    }
                }

                $sp->save();
                echo json_encode($sp);
            } else {
                echo json_encode(array(
                    "message" => "Email already used",
                    "error" => "#725",
                ));
            }
        }
    }

    function getCompanyById()
    {
        $company = PF_Company::findById($_POST["id"]);
        echo json_encode($company);
    }

    function getOwnCompany()
    {
        $tc = PF_TutorCompany::findById($this->token->id);
        echo json_encode($tc->getCompany());
    }

    function getSpecializationsByEmail()
    {
        $speck = PF_Specializations::findeSpecializationfromEmail(PF_Student::findByEmail($_GET['email']));
        echo json_encode($speck);
    }


    function getAllCompanies()
    {
        $c = PF_Company::findAll();
        echo json_encode($c);
    }

    function getAllVerifiedCompanies()
    {
        $c = PF_Company::findAllVerified();
        echo json_encode($c);
    }

    function getAllDistricts()
    {
        $c = PF_District::findAll();
        echo json_encode($c);
    }

    function getAllTeachers()
    {
        $teacher = PF_Schoolperson::findAllTeachers();
        echo json_encode($teacher);
    }


    function joinClass()
    {
        $student = $this->token->id;
        $c = PF_Schoolclass::isTokenValid($_GET['classId']);

        if ($c != false) {
            $e = (PF_Student::checkStudentInClass($student, $c[0]->getId()));
            if ($e == false) {
                $a = PF_Student::addStudentToClass($student, $c[0]->getId());
                echo json_encode(array(
                    "message" => "Token valid",
                ));
            } else {
                echo json_encode(array(
                    "message" => "Token already used",
                    "error" => "#713",
                ));
            }
        } else {
            echo json_encode(array(
                "message" => "Wrong Token",
                "error" => "#714",
            ));
        }
    }

    function getCreatedToken()
    {
        $permitted_chars = '0123456789abcdefghijklmnopqrstuvwxyz';
        $bole = false;
        while ($bole == false) {
            $token = substr(str_shuffle($permitted_chars), 0, 10);
            $schoolclass = PF_Schoolclass::isTokenValid($token);
            if ($schoolclass === false) {
                echo $token;
                $bole = true;
            }
        }
    }


    function getStudentsClass()
    {
        $st = PF_Student::findByEmail($_GET['email']);
        $c = PF_Schoolclass::findeNachStudent($st);
        echo json_encode($c);
    }

    function insertWorkday()
    {
        $retArr = array();
        $inten = $_GET['internship_id'];
        $workdays = $_POST;
        $valuesArray = array();
        foreach ($workdays as $key => $workday) {
            $workday = json_decode($workday);
            for ($i = 0; $i < sizeof($workday) - 1; $i += 2) {
                $valuesArray[$key][$workday[$i]] = $workday[$i + 1];
            }
            $w = new PF_Workday();
            $w->setInternshipId($inten);
            $w->setDate($valuesArray[$key]['date']);
            $totalminutes = 0;
            foreach (explode(":", $valuesArray[$key]['worktimebeforLunch']) as $index => $item) {
                if ($index == 0) {
                    $totalminutes += $item * 60;
                } elseif ($index == 1) {
                    $totalminutes += $item;
                }

            }
            foreach (explode(":", $valuesArray[$key]['worktimeafterLunch']) as $index => $item) {
                if ($index == 0) {
                    $totalminutes += $item * 60;
                } elseif ($index == 1) {
                    $totalminutes += $item;
                }
            }
            $w->setHoursCount($totalminutes / 60);
            if ($w->save() == 1) {
                $retArr[$key]['worked'] = true;
            } else {
                $retArr[$key]['worked'] = false;
            }
            $retArr[$key]['workday'] = $w;
        }
        echo json_encode($retArr);
    }

    function getSchoolpersonsByName()
    {
        $c = PF_Schoolperson::findByName($_GET['name']);
        echo json_encode($c);
    }

    function getStudentextra()
    {
        $c = PF_Student::findByIdextra($this->token->id);
        echo json_encode($c);
    }

    function sendEmailToTutorCompany()
    {
        $inter_id = $_POST['internship_id'];
        $intern = PF_Internship::findById($inter_id);
        $comp = PF_Company::findById($intern->getCompany_ID());
        $cir = new \helper\CompanyInternshipRating();
        $tc = $intern->getTutorCompanyById();
        $information = array();
        $information['role'] = $this->getRole($tc->getEmail());
        $token = api::generateJWTToken($tc->getEmail(), $information);
        $temp = array();
        $temp['message'] = 'Successful login.';
        $temp['token'] = $token;
        $temp['tokenData'] = API::getTokenData($token);

        //token von tutor
        $cir->sendMail($token, $comp, $intern);

    }

    function getAllSpecializations()
    {
        $c = PF_Specializations::findAll();
        sort($c);
        echo json_encode($c);
    }

    function addInternshipsToInternshipRatingEmail()
    {
        $internships = PF_Internship::getAllInternshipsNotInInternshipRatingEmail();

        foreach ($internships as $internship) {
            $internship_rating_email = new PF_Internship_Rating_Email();
            $internship_rating_email->setInternshipId($internship->getId());
            $internship_rating_email->setSent(0);
            $internship_rating_email->save();
        }
    }

    function findAllInternshipWhereEmailIsNotYetSent()
    {
        echo json_encode(PF_Internship_Rating_Email::findAllNotYetSent());
    }

    function getSpecializationsById()
    {
        $specialization = PF_Specializations::findById($_GET["id"]);
        echo json_encode($specialization);
    }

    function getSecializationsByClassID()
    {
        $class = PF_Schoolclass::findById($_GET['id']);
        $specialization = PF_Specializations::findById($class->getSpecializationsid());
        echo json_encode($specialization);
    }

    function getSpecializationByInternship()
    {
        $int = PF_Internship::findById($_POST['id']);
        $class = PF_Schoolclass::findById($int->getSchoolclassId());
        $specialization = PF_Specializations::findById($class->getSpecializationsid());
        echo json_encode($specialization);
    }

    function getEvaluationPointsByInternship()
    {
        $int = PF_Internship::findById($_POST['id']);
        if ($int->getTutorCompanyId() == $_POST['tutor_id']) {
            $class = PF_Schoolclass::findById($int->getSchoolclassId());
            $specialization = PF_Specializations::findById($class->getSpecializationsid());
            $evaluation_Points = $specialization->getEvaluation_Points();
            $withRatingArray = array();
            foreach ($evaluation_Points as $key => $item) {
                $withRatingArray[$key]['id'] = $item->getId();
                $withRatingArray[$key]['name'] = $item->getName();
                $withRatingArray[$key]['description'] = $item->getDescription();
                $withRatingArray[$key]['rating'] = 3;
            }
            echo json_encode($withRatingArray);
        } else {
            echo 'NotTutorForInternship';
        }
    }

    function getEntityBySearchInput()
    {
        $retar = array();
        $limit = 33;
        $input = $_POST['searchinput'];
        $offset = $limit * $_POST['offset'];
        $retar['Schulperson']['items'] = PF_Schoolperson::findByString($input, $offset, $limit);
        $retar['Schüler']['items'] = PF_Student::findByString($input, $offset, $limit);
        $retar['Unternehmen']['items'] = PF_Company::findByString($input, $offset, $limit);
        $retar['Schulperson']['size'] = sizeof($retar['Schulperson']['items']);
        $retar['Schüler']['size'] = sizeof($retar['Schüler']['items']);
        $retar['Unternehmen']['size'] = sizeof($retar['Unternehmen']['items']);
        $retar['offset'] = $_POST['offset'];
        echo json_encode($retar);
    }


    function getClassBySpecializationsId()
    {
        $specialization = PF_Specializations::findById($_POST['id']);
        $retArray = array();
        if ($specialization != false) {
            $class = $specialization->getSchooclass();
            foreach ($class as $key => $singleClass) {
                $retArray[$key] = $singleClass->toArray();
                $teacher = $singleClass->getClassTeacher();
                if ($teacher != false) {
                    $retArray[$key]['TeacherFirstName'] = $teacher->getFirstname();
                    $retArray[$key]['TeacherSurname'] = $teacher->getSurname();
                    $retArray[$key]['TeacherAssigned'] = true;
                } else {
                    $retArray[$key]['TeacherAssigned'] = false;
                }
            }
            echo json_encode($retArray);
        } else {
            echo json_encode("specialization id FALSE");
        }
    }

    function getSchoolpersonBySpecializations()
    {
        $specialization = PF_Specializations::findById($_POST['id']);
        $retArray = array();
        if ($specialization != false) {
            $teachers = PF_Schoolperson::findTeacherBySpecialization($specialization);
            foreach ($teachers as $key => $teacher) {
                $retArray[] = $teacher->toArray();
            }
            echo json_encode($retArray);
        } else {
            echo json_encode("specialization id FALSE");
        }
    }

    function getStudentbyInfo()
    {
        $students = PF_Student::findByString($_POST['info']);
        if ($students != false) {
            echo json_encode($students);
        } else {
            echo json_encode("nothing found of search term");
        }
    }

    function getStudentbySpecializations()
    {
        $specialization = PF_Specializations::findById($_POST['id']);
        $retArray = array();
        if ($specialization != false) {
            $students = PF_Student::findBySpecialization($specialization);
            foreach ($students as $key => $student) {
                $retArray[] = $student->toArray();
            }
            echo json_encode($retArray);
        } else {
            echo json_encode("specialization id FALSE");
        }
    }

    function getClassById()
    {
        $class = PF_Schoolclass::findById($_POST['id']);
        $retArray = $class->toArray();
        $teacher = $class->getClassTeacher();
        if ($teacher != false) {
            $retArray['TeacherFirstName'] = $teacher->getFirstname();
            $retArray['TeacherSurname'] = $teacher->getSurname();
            $retArray['TeacherAssigned'] = true;
        } else {
            $retArray['TeacherAssigned'] = false;
        }
        echo json_encode($retArray);
    }

    function getAllClasses()
    {
        $retArray = array();
        $class = (PF_Schoolclass::findAll());
        foreach ($class as $key => $singleClass) {
            $retArray[$key] = $singleClass->toArray();
            $teacher = $singleClass->getClassTeacher();
            if ($teacher != false) {
                $retArray[$key]['TeacherFirstName'] = $teacher->getFirstname();
                $retArray[$key]['TeacherSurname'] = $teacher->getSurname();
                $retArray[$key]['TeacherAssigned'] = true;
            } else {
                $retArray[$key]['TeacherAssigned'] = false;
            }
        }
        ksort($retArray);
        echo json_encode($retArray);
    }

    function getStateById()
    {
        $state = PF_State::findById($_POST["id"]);
        echo json_encode($state);
    }

    function getStateByInternship()
    {
        $internship = PF_Internship::findById($_POST["id"]);

        $state = PF_State::findById($internship->getStateId());

        echo json_encode($state);
    }

    function getAllStudents()
    {
        $c = PF_Student::findAll();
        echo json_encode($c);
    }

    function getAllSchoolpersons()
    {
        $c = PF_Schoolperson::findAll();
        echo json_encode($c);
    }

    function getRoleById()
    {
        $role = PF_Role::findById($_POST["id"]);
        echo json_encode($role);
    }

    function getDistrictById()
    {
        $district = PF_District::findById($_GET["id"]);
        echo json_encode($district);
    }

    function getEvaluationPointsBySpecialization()
    {
        $specialization = PF_Specializations::findById($_GET['id']);
        $evaluation_Points = $specialization->getEvaluation_Points();
        $withRatingArray = array();
        foreach ($evaluation_Points as $key => $item) {
            $withRatingArray[$key]['id'] = $item->getId();
            $withRatingArray[$key]['name'] = $item->getName();
            $withRatingArray[$key]['description'] = $item->getDescription();
            $withRatingArray[$key]['rating'] = 3;
        }
        echo json_encode($withRatingArray);
    }

    function insertEvluation()
    {
        var_dump($_POST);
    }

    function getEvaluationPointsById()
    {
        $evaluationpoints = PF_Evaluation_Points::findById($_GET["id"]);
        echo json_encode($evaluationpoints);
    }

    function getStudentById()
    {
        $student = PF_Student::findById($_POST["id"]);
        echo json_encode($student);
    }

    function getDistrictByName()
    {
        $dis = PF_District::findByName($_POST["name"]);
        echo json_encode($dis);
    }

    function invertEnabledStudent()
    {
        $student = PF_Student::findById($_POST['id']);
        $student->setIsEnabled(abs($student->getIsEnabled() - 1));
        $student->save();
        echo json_encode($student);
    }

    function invertEnabledSchoolclass()
    {
        $schoolclass = PF_Schoolclass::findById($_POST['id']);
        $schoolclass->setActive(abs($schoolclass->getActive() - 1));
        $schoolclass->save();
        $retArray = $schoolclass->toArray();
        $teacher = $schoolclass->getClassTeacher();
        if ($teacher != false) {
            $retArray['TeacherFirstName'] = $teacher->getFirstname();
            $retArray['TeacherSurname'] = $teacher->getSurname();
            $retArray['TeacherAssigned'] = true;
        } else {
            $retArray['TeacherAssigned'] = false;
        }
        echo json_encode($retArray);
    }

    function invertIsVerifiedTutorCompany()
    {
        $tutorCompany = PF_TutorCompany::findById($_POST['id']);
        $tutorCompany->setIsVerified(abs($tutorCompany->getIsVerified() - 1));
        $tutorCompany->save();
        echo json_encode($tutorCompany);
    }

    function invertIsVerifiedTutorCompanyReturnsAll()
    {
        $tutorCompany = PF_TutorCompany::findById($_POST['id']);
        $tutorCompany->setIsVerified(abs($tutorCompany->getIsVerified() - 1));
        $tutorCompany->save();
        echo json_encode(PF_TutorCompany::findByCompanyId($tutorCompany->getCompany_id()));
    }

    function invertIsVerifiedCompany()
    {
        $tutorCompany = PF_Company::findById($_POST['id']);
        $tutorCompany->setIsVerified(abs($tutorCompany->getIsVerified() - 1));
        $tutorCompany->save();
        echo json_encode($tutorCompany);
    }

    function getInternshipInformationById()
    {
        $retArr = array();
        $internship = PF_Internship::findById($_POST['id']);
        if ($internship != false) {
            $student = PF_Student::findByInternship($internship);
            $schooclass = PF_Schoolclass::findByInternship($internship);
            $schoolperson = PF_Schoolperson::findSchoolTutorByInternship($internship);
            $tutorCompany = PF_TutorCompany::findTutorByInternship($internship);
            $student->setPassword("");
            $schoolperson->setPassword("");
            $tutorCompany->setPassword("");
            $internship->setTo(date("d.m.Y", strtotime($internship->getTo())));
            $internship->setFrom(date("d.m.Y", strtotime($internship->getFrom())));

            $retArr['internship'] = $internship;
            $retArr['student'] = $student;
            $retArr['schoolperson'] = $schoolperson;
            $retArr['schooclass'] = $schooclass;
            $retArr['tutorCompany'] = $tutorCompany;
            if ($student != false && $schooclass != false && $schoolperson != false && $tutorCompany != false) {
                echo json_encode($retArr);
            } else {
                echo json_encode(array('error' => "Student or Schooclass or Schoolperon not found", 'retun' => $retArr));
            }
        } else {
            echo json_encode(array('error' => "Internship not found", 'retun' => $retArr));
        }


    }

    function evaluationPointsHasSpecialization()
    {
        $evaluationpointshasspecialization = new PF_Evaluation_Points();
        $evaluationpointshasspecialization = $evaluationpointshasspecialization->getSpecializations();
        echo json_encode($evaluationpointshasspecialization);
    }

    function companyHasDistrict()
    {
        $companyhasdistrictobject = PF_Company::findById($_POST['company_id']);
        $companyhasdistrict = $companyhasdistrictobject->getDistrict();
        echo json_encode($companyhasdistrict);
    }

    function getCompanyByDistrict()
    {
        $ds = PF_District::findById($_POST['id']);
        echo json_encode($ds->getCompany());
    }

    function getCompanyByDistrictAndSpecialization()
    {
        if (isset($_POST['districtId']) && isset($_POST['specializations_id'])) {
            $district = PF_District::findById($_POST['districtId']);
            $specialization = PF_Specializations::findById($_POST['specializations_id']);
            $company = PF_Company::findByDistrictAndSpecialization($district, $specialization);
            echo json_encode($company);
        } else if (isset($_POST['districtId'])) {
            $district = PF_District::findById($_POST['districtId']);
            echo json_encode($district->getCompany());

        } else if (isset($_POST['specializations_id'])) {
            $specialization = PF_Specializations::findById($_POST['specializations_id']);
            echo json_encode($specialization->getCompany());
        } else {
            echo json_encode(array('error' => 'no company found'));
        }

    }


    function getWorkDayById()
    {
        $workday = PF_Workday::findById($_GET["id"]);
        echo json_encode($workday);
    }

    function getCompanyByTutorId()
    {
        $tutorcompany = PF_TutorCompany::findById($_GET["id"]);
        $company = PF_Company::findById($tutorcompany->getCompany_id());
        echo json_encode($company);
    }

    function getTutorByCompanyId()
    {
        $tutorcompany = PF_TutorCompany::findByCompanyId($_POST["id"]);
        echo json_encode($tutorcompany);
    }

    function getVerifiedTutorByCompanyId()
    {
        $tutorcompany = PF_TutorCompany::findVerifiedByCompanyId($_GET["id"]);
        echo json_encode($tutorcompany);
    }

    function getAllVerifiedDistricts()
    {
        $c = PF_District::findAllVerified();
        echo json_encode($c);
    }

    function getTutorCompanyById()
    {
        $tutorcompany = PF_TutorCompany::findById(4);
        echo json_encode($tutorcompany);
    }

    function getSchoolPersonById()
    {
        $schoolperson = PF_Company::findById($_GET["id"]);
        echo json_encode($schoolperson);
    }

//</editor-fold>


    function generateContract()
    {
        $information = $_POST;

        $class = PF_Schoolclass::findById($_POST['schoolclass_id']);

        $internship = PF_Internship::findById($_POST['internship_id']);

        $information['schoolyear'] = $class->getSchoolyear();
        $information['from'] = $internship->getFrom();
        $information['to'] = $internship->getTo();

        try {
            $pathToFile = generateContract($information);
            if ($pathToFile == false) {
                $temp = array();
                $temp['message'] = 'Error creating Contract.';
                $temp['error'] = 'TutorCompany or Company not Verified';
                echo json_encode($temp);
            } else {
                header('Content-Description: File Transfer');
                header('Content-Type: application/ms-word');
                header('Content-Disposition: attachment; filename="' . basename($pathToFile) . '"');
                header('Expires: 0');
                header('Cache-Control: must-revalidate');
                header('Pragma: public');
                header('Content-Length: ' . filesize($pathToFile));
                readfile($pathToFile);
            }
        } catch (CopyFileException $e) {
        } catch (CreateTemporaryFileException $e) {
        }
    }

    private
        $i = 0;

    function listFolders($dir)
    {

        // Liebe Leute wenn do no jemand die hend zui tuat nor schned i sie nen o!!!!!!!!!!!

        // ok xD - Maxi
        $dh = scandir($dir);
        $return = array();


        foreach ($dh as $folder) {
            if ($folder != '.' && $folder != '..') {
                $this->i++;

                if (is_file($dir . '/' . $folder)) {

                    $internship = PF_Internship::findByPath(str_replace("//", "/", $dir . '/' . $folder));
                    if ($internship != false) {
                        $contract = PF_Contract::findById($internship->getContractId());
                        $return[] = array(
                            'text' => $folder,
                            'id' => $this->i,
                            'internshipId' => $internship->getId(),
                            'isApproved' => $contract->getApproved(),
                            'children' => []
                        );
                    } else {
                        $return[] = array(
                            'text' => $folder,
                            'id' => $this->i,
                            'children' => [],
                            'path' => str_replace("//", "/", $dir . '/' . $folder)
                        );
                    }
                } elseif (is_dir($dir . '/' . $folder)) {
                    $return[] = array(
                        'text' => $folder,
                        'id' => $this->i,
                        'children' => $this->listFolders($dir . '/' . $folder)
                    );
                }

            }
        }
        return $return;
    }


    function getContractPath()
    {
        $internship = PF_Internship::findById($_POST['id']);
        $contract = PF_Contract::findById($internship->getContractId());
        echo json_encode(array("path" => $contract->getContractPath()));
    }

    function getContract()
    {
        readfile($_POST['path']);
    }

    function getContractsFolderContent()
    {
        //echo json_encode($this->listFolders("../files/filledContracts/"));
        echo "{ \"text\": \"Verträge\", \"id\": 0, \"children\": " . json_encode($this->listFolders("../files/filledContracts/")) . "}";
    }


    function uploadContract()
    {

        try {

            if (isset($_FILES["contract"])) {

                $internship = PF_Internship::findById($_POST["internshipId"]);
                $class = PF_Schoolclass::findById($internship->getSchoolclassId());
                $student = PF_Student::findById($internship->getStudentId());
                $name = $student->getFirstname() . " " . $student->getSurname();
                $path = "../files/filledContracts/" . $class->getSchoolyear() . "/" . $class->getName() . "/" . $name . "/";
                checkCreateFolder($path);
                $extension = explode(".", $_FILES["contract"]['name'])[1];
                move_uploaded_file($_FILES["contract"]["tmp_name"], "$path/Unterschrieben." . $extension);
                $internship->setStateId(7);
                $contract = PF_Contract::findById($internship->getContractId());
                if ($contract == false) {
                    $contract = new PF_Contract();
                }
                $contract->setContractPath(str_replace("//", "/", "$path/Unterschrieben." . $extension));
                $contract->save();
                $internship->setContractId($contract->getId());
                $internship->save();
                echo json_encode(array(
                    "message" => "success"
                ));


            } else {
                echo json_encode(array(
                    "message" => "Error while uploading file",
                    "error" => "#900",
                ));
            }

        } catch (Exception $e) {
            echo json_encode(array(
                "message" => "Error while uploading file",
                "error" => $e,
            ));
        }

    }

    function sendRatingEmail($internsipId = null, $tutorId = null, $id)
    {
        //Check if called internally with parameters
        if (is_null($internsipId) && is_null($tutorId)) {
            $internship = PF_Internship::findById($_POST['internsipId']);
            $tutor = PF_TutorCompany::findById($_POST['tutorId']);
        } else {
            $internship = PF_Internship::findById($internsipId);
            $tutor = PF_TutorCompany::findById($tutorId);
        }

        //Generate JWT Token
        $information = array();
        $information['role'] = $this->getRole($tutor);
        $information['companyID'] = $tutor->getCompany_id();
        $token = api::generateJWTToken($tutor, $information);


        //Mail Helper
        $mailHelper = new \helper\CompanyInternshipRating();

        $student = PF_Student::findById($internship->getStudentId());

        $studentName = $student->getFirstname() . " " . $student->getSurname();

        $a = new PF_Internship_Rating_Email();

        $content = $mailHelper->getMailContent($studentName, $token);


        $a->setId($id);
        $a->setContent($content);
        $a->setSentBy($this->token->id);
        $a->setSentTo($tutor->getId());
        $a->setSent(1);
        $a->setInternshipId($internship->getId());


        $a->save();

        $mailHelper->sendMail($content, $tutor, $internship);
    }

    function getAllEmailsSentAndNot()
    {
        $retArr = array();
        $retArr['notSent'] = PF_Internship_Rating_Email::findAllNotYetSentExtra();
        $retArr['sent'] = PF_Internship_Rating_Email::findAllSentExtra();
        echo json_encode($retArr);

    }


    function sendAllDueRatingEmail()
    {
        $notYetSentEmails = PF_Internship_Rating_Email::findAllNotYetSent();
        $arr = array();
        foreach ($notYetSentEmails as $notYetSentEmail) {
            $this->sendRatingEmail($notYetSentEmail['internshipId'], $notYetSentEmail['sentTo'], $notYetSentEmail['id']);
        }
    }

    function getAllInternshipsWithoutEvalutation()
    {
        $retar = array();
        $internships = PF_Internship::findAllWithoutEvaluation();
        foreach ($internships as $internship) {
            $retar[] = $internship;
        }
        echo json_encode($retar);
    }


    function getAllRatingEmails()
    {
        echo json_encode(PF_Internship_Rating_Email::findAllWithNames());
    }

    function getRatingEmailContent()
    {
        echo json_encode(PF_Internship_Rating_Email::findById($_POST['id']));
    }

    function getFinishedInternshipsToday()
    {
        echo json_encode(PF_Internship::getByEndNow());
    }

}
