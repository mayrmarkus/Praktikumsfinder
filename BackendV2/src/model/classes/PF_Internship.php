<?php

/**
 * Class Internship
 * @author Christian Tutzer
 */
class PF_Internship extends DatabaseTable implements JsonSerializable
{
    private $id = null;
    private $from = null;
    private $to = null;
    private $rating = null;
    private $student_id = null;
    private $tutor = null;
    private $schoolclass_id = null;
    private $company_id = null;
    private $tutor_company_id = null;
    private $state_id = null;
    private $contractId = null;

    /**
     * @return null
     */
    public function getContractId()
    {
        return $this->contractId;
    }


    /**
     * @param null $contractId
     */
    public function setContractId($contractId)
    {
        $this->contractId = $contractId;
    }


    /**
     * @return mixed
     */
    public function getId()
    {
        return $this->id;
    }


    /**
     * @return mixed
     */
    public function getSchoolclassId()
    {
        return $this->schoolclass_id;
    }

    /**
     * @param mixed $schoolclass_id
     */
    public function setSchoolclassId($schoolclass_id)
    {
        $this->schoolclass_id = $schoolclass_id;
    }


    /**
     * @param mixed $id
     */
    public function setId($id)
    {
        $this->id = $id;
    }


    /**
     * @return mixed
     */
    public function getFrom()
    {
        return $this->from;
    }

    /**
     * @param mixed $from
     */
    public function setFrom($from)
    {
        $this->from = $from;
    }

    /**
     * @return mixed
     */
    public function getTo()
    {
        return $this->to;
    }

    /**
     * @param mixed $to
     */
    public function setTo($to)
    {
        $this->to = $to;
    }

    /**
     * @return mixed
     */
    public function getRating()
    {
        return $this->rating;
    }

    /**
     * @param mixed $rating
     */
    public function setRating($rating)
    {
        $this->rating = $rating;
    }


    /**
     * @param mixed $student_id
     */
    public function setStudentId($student_id)
    {
        $this->student_id = $student_id;
    }

    /**
     * @return null
     */
    public function getStudentId()
    {
        return $this->student_id;
    }

    /**
     * @param mixed $tutor
     */
    public function setTutor($tutor)
    {
        $this->tutor = $tutor;
    }


    /**
     * @param mixed $company_id
     */
    public function setCompanyId($company_id)
    {
        $this->company_id = $company_id;
    }

    public function getCompany_ID()
    {
        return $this->company_id;
    }


    /**
     * @param mixed $tutor_company_id
     */
    public function setTutorCompanyId($tutor_company_id)
    {
        $this->tutor_company_id = $tutor_company_id;
    }

    /**
     * @return null
     */
    public function getTutorCompanyId()
    {
        return $this->tutor_company_id;
    }


    /**
     * @param mixed $state_id
     */
    public function setStateId($state_id)
    {
        $this->state_id = $state_id;
    }

    /**
     * Student constructor.
     * @param array $data
     */
    public function __construct($data = array())
    {
        if ($data) {
            foreach ($data as $key => $value) {
                $setterName = "set" . ucfirst($key);
                if (method_exists($this, $setterName)) {
                    if (empty($value))
                        $value = null;
                    $this->$setterName($value);
                }
            }
        }
    }


    public function toArray($mitId = true)
    {
        $attributs = get_object_vars($this);
        if ($mitId === false) {
            unset($attributs['id']);
        }
        return $attributs;
    }

    /**
     * Saves values to Database or updates them
     */
    public function save()
    {
        if ($this->getId() > 0) {
            return $this->_update();
        } else {
            return $this->_insert();
        }
    }

    /**
     * inserts values in database
     */
    protected function _insert()
    {
        $sql = "INSERT INTO pf_internship (`from`, `to`, rating, student_id, tutor, company_id, tutor_company_id, state_id,contractId,schoolclass_id)
                                    VALUES (:from, :to, :rating, :student_id, :tutor, :company_id, :tutor_company_id, :state_id, :contractId,:schoolclass_id)";
        $query = Database::getDB()->prepare($sql);
        $ret = $query->execute($this->toArray(false));

        // setze die ID auf den von der DB generierten Wert
        $this->id = Database::getDB()->lastInsertId();
        return $ret;
    }

    function insertEmpty()
    {
        $sql = 'INSERT INTO `pf_internship`(`from`, `to`, `student_id`, `state_id`, `schoolclass_id`)
                                    VALUES (\'2000-01-01\',\'2000-01-01\',:student_id, 1, :schoolclass_id)';
        $query = Database::getDB()->prepare($sql);
        $ret = $query->execute($this->toArray(false));

        // setze die ID auf den von der DB generierten Wert
        $this->id = Database::getDB()->lastInsertId();
        return $ret;

    }

    /**
     * updates values in Database
     */
    protected function _update()
    {
        $sql = "UPDATE pf_internship
        SET `from`=:from,
        `to`=:to,
        rating=:rating,
        student_id=:student_id,
        tutor=:tutor,
        company_id=:company_id,
        tutor_company_id=:tutor_company_id,
        state_id=:state_id,
        schoolclass_id=:schoolclass_id,
            contractId=:contractId
        WHERE id =:id";
        $query = Database::getDB()->prepare($sql);
        $ret = $query->execute($this->toArray());
        return $ret;

    }

    /**
     * @param $id
     * @return array[]
     */
    public static function findInternshipByStudentId($id)
    {
        $sql = "SELECT c.name         as companyname,
       i.id           as internship_id,
       i.`from`       as startdate,
       i.`to`         as enddate,
       i.rating    as rating,
       s2.id          as classid,
       s2.name        as classname,
       s2.active      as classactive,
       s2.schoolyear   as schoolyear,
       s3.id          as state_id,
       s3.name        as state_name,
       s3.description as state_description,
       s3.color       as state_color,
       s4.id          as schoolperson_id,
       s4.firstname as schoopersonFirstName,
       s4.surname as schoopersonSurname,
       s4.email as schoopersonEmail

        from pf_student s      
         right outer join  pf_student_has_class shc on s.id = shc.student_id
         right join  pf_schoolclass s2 on shc.class_id = s2.id
         right join  pf_internship i on s.id = i.student_id and s2.id = i.schoolclass_id
         left join pf_company c on i.company_id = c.id
         left join pf_state s3 on i.state_id = s3.id
         left join pf_schoolperson s4 on i.tutor = s4.id

  where s.id = '$id' order by s2.active";
        $query = Database::getDB()->query($sql);
        $query->setFetchMode(PDO::FETCH_ASSOC);
        return $query->fetchAll();
    }


    /**
     * @param $id
     * @return array[]
     */
    public static function findInternshipByCompanyId($id)
    {
        $sql = "SELECT c.name         as companyname,
       i.id           as internship_id,
       i.`from`       as startdate,
       i.`to`         as enddate,
       i.rating    as rating,
       s.firstname as studentFirstName,
       s.surname as studentSurname,
       s.email as studentMail,
       s.id as studentId,
       s2.id          as classid,
       s2.name        as classname,
       s2.active      as classactive,
       s2.schoolyear   as schoolyear,
       s3.id          as state_id,
       s3.name        as state_name,
       s3.description as state_description,
       s3.color       as state_color,
       s4.id          as schoolperson_id,
       s4.firstname as scdhoopersonFirstName,
       s4.surname as schoopersonSurname,
       s4.email as schoopersonEmail,
       i.tutor_company_id as tutor_company_id
       

        from pf_student s
         right outer join  pf_student_has_class shc on s.id = shc.student_id
         right join  pf_schoolclass s2 on shc.class_id = s2.id
         right join  pf_internship i on s.id = i.student_id and s2.id = i.schoolclass_id
         left join pf_company c on i.company_id = c.id
         left join pf_state s3 on i.state_id = s3.id
         left join pf_schoolperson s4 on i.tutor = s4.id
        where c.id = '$id' order by s2.active";
        $query = Database::getDB()->query($sql);
        $query->setFetchMode(PDO::FETCH_ASSOC);
        return $query->fetchAll();
    }

    /**
     * @param $id
     * @param $t_id
     * @return array[]
     */
    public static function findInternshipByCompanyIdWithTutor($id, $t_id)
    {
        $sql = "SELECT c.name         as companyname,
       i.id           as internship_id,
       i.`from`       as startdate,
       i.`to`         as enddate,
       i.rating    as rating,
       s.firstname as studentFirstName,
       s.surname as studentSurname,
       s.email as studentMail,
       s.id as studentId,
       s2.id          as classid,
       s2.name        as classname,
       s2.active      as classactive,
       s2.schoolyear   as schoolyear,
       s3.id          as state_id,
       s3.name        as state_name,
       s3.description as state_description,
       s3.color       as state_color,
       s4.id          as schoolperson_id,
       s4.firstname as scdhoopersonFirstName,
       s4.surname as schoopersonSurname,
       s4.email as schoopersonEmail,
       i.tutor_company_id as tutor_company_id
       

        from pf_student s
         right outer join  pf_student_has_class shc on s.id = shc.student_id
         right join  pf_schoolclass s2 on shc.class_id = s2.id
         right join  pf_internship i on s.id = i.student_id and s2.id = i.schoolclass_id
         left join pf_company c on i.company_id = c.id
         left join pf_state s3 on i.state_id = s3.id
         left join pf_schoolperson s4 on i.tutor = s4.id
        where c.id = '$id' and i.tutor_company_id='$t_id' order by s2.active";
        $query = Database::getDB()->query($sql);
        $query->setFetchMode(PDO::FETCH_ASSOC);
        return $query->fetchAll();
    }

    /**
     * @param $id
     * @return PF_Internship
     */
    public static function findById($id)
    {
        $sql = "SELECT * FROM pf_internship WHERE id = '$id'";
        $query = Database::getDB()->query($sql);
        $query->setFetchMode(PDO::FETCH_CLASS, "PF_Internship");
        return $query->fetch();
    }

    /**
     * @param $path
     * @return PF_Internship
     */
    public static function findByPath($path)
    {
        $contract = PF_Contract::findByPath($path);
        if ($contract != false) {
            $contractId = $contract->getId();
            $sql = "SELECT * FROM pf_internship WHERE contractId = '$contractId'";
            $query = Database::getDB()->query($sql);
            $query->setFetchMode(PDO::FETCH_CLASS, "PF_Internship");
            return $query->fetch();
        }
    }


    /**
     * @param $path
     * @return PF_Internship
     */
    public static function getByEndNow()
    {
        $sql = "select * from pf_internship where `to` like date(now())";
        $query = Database::getDB()->query($sql);
        $query->setFetchMode(PDO::FETCH_CLASS, "PF_Internship");
        return $query->fetchAll();
    }


    /**
     * @inheritDoc
     */

    public function jsonSerialize()
    {
        return get_object_vars($this);
    }


    /**
     * @param PF_Workday $workday
     * @return PF_Internship[]
     */
    public static function findInternshipByWorkday(PF_Workday $workday)
    {
        $sql = 'SELECT pf_internship.* FROM pf_internship
            WHERE pf_internship.id=?';
        $abfrage = Database::getDB()->prepare($sql);
        $abfrage->execute(array($workday->getId()));
        $abfrage->setFetchMode(PDO::FETCH_CLASS, 'PF_Internship');
        return $abfrage->fetchAll();
    }

    /**
     * @return PF_Company[]
     */
    public function getCompanyByCompanyId()
    {
        return PF_Company::findCompanyInternship($this);
    }

    /**
     * @return $state_id
     */
    public function getStateId()
    {
        return $this->state_id;
    }

    /**
     * @return PF_Student
     */
    public function getStudent()
    {
        return PF_Student::findByInternship($this);
    }

    /**
     * @return PF_TutorCompany
     */
    public function getTutorCompanyById()
    {
        return PF_TutorCompany::findTutorByInternship($this);
    }

    /**
     * @return $tutor
     */
    public function getTutor()
    {
        return $this->tutor;
    }


    /**
     * @return PF_Internship[]
     */
    public static function getAllInternshipsNotInInternshipRatingEmail()
    {
        $sql = "SELECT i.* FROM pf_internship i LEFT JOIN pf_internship_rating_email ire ON ire.internshipId = i.id WHERE ire.id IS NULL";
        $abfrage = Database::getDB()->query($sql);
        $abfrage->setFetchMode(PDO::FETCH_CLASS, 'PF_Internship');
        $internshipObj = $abfrage->fetchAll();
        return $internshipObj;
    }

    /**
     * @return  PF_Internship[]
     */
    public static function findAllWithoutEvaluation()
    {
        $sql = "SELECT i.*
            FROM pf_internship i
            WHERE NOT EXISTS(SELECT 1
                 FROM pf_internship
                          join pf_evaluation pe on pf_internship.id = pe.internship_id
                 WHERE pf_internship.id = i.id)";
        $abfrage = Database::getDB()->query($sql);
        $abfrage->setFetchMode(PDO::FETCH_CLASS, 'PF_Internship');
        $internshipObj = $abfrage->fetchAll();
        return $internshipObj;
    }

    /**
     * @param $scid
     * @return  PF_Internship[]
     */
    public static function findBySchooclassId($scid)
    {
        $sql = "SELECT i.* FROM pf_internship i WHERE schoolclass_id='$scid'";
        $abfrage = Database::getDB()->query($sql);
        $abfrage->setFetchMode(PDO::FETCH_CLASS, 'PF_Internship');
        $internshipObj = $abfrage->fetchAll();
        return $internshipObj;
    }

    /**
     * @return bool
     */
    public function deleteInternships()
    {
        $sql = "DELETE FROM pf_internship WHERE id = ?";
        $query = Database::getDB()->prepare($sql);
        $ret = $query->execute([$this->getId()]);
        return $ret;
    }
}
