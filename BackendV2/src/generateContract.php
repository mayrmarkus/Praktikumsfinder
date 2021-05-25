<?php


use PhpOffice\PhpWord\Exception\CopyFileException;
use PhpOffice\PhpWord\Exception\CreateTemporaryFileException;
use PhpOffice\PhpWord\PhpWord;
use PhpOffice\PhpWord\Settings;
use PhpOffice\PhpWord\TemplateProcessor;

Settings::setPdfRendererPath('vendor/dompdf/dompdf');
Settings::setPdfRendererName('DomPDF');
$phpWord = new PhpWord();

/**
 * @param $arr
 * @return string file content, file location
 * @throws CopyFileException
 * @throws CreateTemporaryFileException
 *
 */
function generateContract($arr)
{
    $c = PF_Company::findById($arr["company_id"]);
    $district = $c->getDistrict();
    $c = $c->toArray(true);
    $district = $district->toArray(true);


    $inter = PF_Internship::findById($arr["internship_id"]);
    $inter = $inter->toArray(true);

    $tutor = PF_Schoolperson::findById($arr["tutor_id"]);
    $tutor = $tutor->toArray(true);

    $tutorCompany = PF_TutorCompany::findById($inter["tutor_company_id"]);

    if ($tutorCompany->getIsVerified() == 1 && $tutorCompany->getIsEmployed() == 1 && $c['isVerified'] == 1) {
        $arr["company"] = $c["name"];
        $arr["companyLocation"] = $district["name"];
        $arr["companyPLZ"] = $c["cap"];
        $arr["companyAddress"] = $c["address"];
        $arr["telephone"] = $c["phonenumber"];
        $arr["email"] = $c["email"];
        $from = ($arr["from"]);
        $to = ($arr["to"]);
        $arr["from"] = date("d.m.Y", strtotime($inter["from"]));
        $arr["to"] = date("d.m.Y", strtotime($inter["to"]));
        $arr["schoolTutor"] = $tutor["surname"] . " " . $tutor["firstname"];
        $arr["birthdate"] = date("d.m.Y", strtotime($arr["birthdate"]));
        $arr['duration'] = getWorkdays($from, $to) . ' Tage';

        $arr['companyTutor'] = $tutorCompany->getSurname() . " " . $tutorCompany->getFirstname();

        //prepartion
        $path = "../files/contracts/" . $arr["schoolyear"] . "/" . $arr['schoolclass'] . "/" . $arr['name'];

        //Creates folders for structure
        checkCreateFolder($path);


        //filling contract
        $templateProcessor = new TemplateProcessor('../assets/contracts/contractTemplate_de.docx');
        $templateProcessor->setValues($arr);

        $fileLoc = $path . "/vertrag" . $arr['internship_id'] . ".docx";

        $templateProcessor->saveAs($fileLoc);

        return $fileLoc;
    } else {
        return false;
    }
}


/**
 * checks and creates directory
 *
 * @param $path
 */
function checkCreateFolder($path)
{
    $arr = explode("/", $path);

    $strRed = "./";

    for ($i = 0; $i < count($arr); $i++) {
        $strRed .= $arr[$i] . "/";

        if (!file_exists($strRed)) {
            mkdir($strRed);
        }
    }
}

function getWorkdays($from, $to)
{
    $retArrr = array();
    $sdFormat = strtotime(date("j F Y", strtotime($from)));
    $edFormat = strtotime(date("j F Y", strtotime($to)));
    for ($sdFormat; $sdFormat <= $edFormat; $sdFormat += 86400) {
        if (date("N", $sdFormat) < 6) {
            $retArrr['days'][] = (date("d.m.Y", $sdFormat));
        }
    }
    return $nwd = sizeof($retArrr['days']);

}
