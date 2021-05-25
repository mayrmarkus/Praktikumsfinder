<?php


/**
 * Class Specializations
 * @author Christian Tutzer
 */
class PF_Specializations extends DatabaseTable implements JsonSerializable
{
    private $id;
    private $description;

    /**
     * Specializations constructor.
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

    /**
     * @return mixed
     */
    public function getId()
    {
        return $this->id;
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
    public function getDescription()
    {
        return $this->description;
    }

    /**
     * @param mixed $description
     */
    public function setDescription($description)
    {
        $this->description = $description;
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
            $this->_update();
        } else {
            $this->_insert();
        }
    }

    /**
     * inserts values in database
     */
    protected function _insert()
    {
        $sql = 'INSERT INTO pf_specializations ( description)'
            . 'VALUES (:description)';
        $query = Database::getDB()->prepare($sql);
        $query->execute($this->toArray(false));

        // setze die ID auf den von der DB generierten Wert
        $this->id = Database::getDB()->lastInsertId();
    }

    /**
     * updates values in Database
     */
    protected function _update()
    {
        $sql = 'UPDATE pf_specializations SET id=:id, description=:description '
            . 'WHERE id=:id';

        $query = Database::getDB()->prepare($sql);
        $query->execute($this->toArray());
    }

    /**
     * @inheritDoc
     */
    public function jsonSerialize()
    {
        return get_object_vars($this);
    }

    /**
     * @param $id
     * @return PF_Specializations
     */
    public static function findById($id)
    {
        $sql = "SELECT * FROM pf_specializations WHERE id = '$id'";

        $query = Database::getDB()->query($sql);
        $query->setFetchMode(PDO::FETCH_CLASS, "PF_Specializations");
        return $query->fetch();
    }

    /**
     * @param $id
     * @return PF_Specializations
     */
    public static function findByDescription($description)
    {
        $sql = "SELECT * FROM pf_specializations WHERE description = '$description'";

        $query = Database::getDB()->query($sql);
        $query->setFetchMode(PDO::FETCH_CLASS, "PF_Specializations");
        return $query->fetch();
    }

    /**
     * @return PF_Specializations[]
     */
    public static function findAll()
    {
        $sql = 'SELECT * FROM pf_specializations';
        $abfrage = Database::getDB()->query($sql);
        $abfrage->setFetchMode(PDO::FETCH_CLASS, 'PF_Specializations');
        $specializationsObj = $abfrage->fetchAll();
        $ret = array();
        foreach ($specializationsObj as $c) {
            $ret[] = $c->jsonSerialize();
        }
        return $ret;
    }

    /**
     * @param  $evaluation_Points
     * löst n<>n beziehung auf
     * @return PF_Specializations[]
     */
    public static function findeNachEvaluation_Points(PF_Evaluation_Points $evaluation_Points)
    {
        $sql = 'SELECT pf_specializations.* FROM pf_specializations '
            . 'JOIN pf_evaluation_points_has_specialization ON pf_specializations.id=pf_evaluation_points_has_specialization.specializations_id '
            . 'WHERE pf_evaluation_points_has_specialization.evaluation_points_id=?';
        $abfrage = Database::getDB()->prepare($sql);
        $abfrage->execute(array($evaluation_Points->getId()));
        $abfrage->setFetchMode(PDO::FETCH_CLASS, 'PF_Specializations');
        return $abfrage->fetchAll();
    }

    /**
     * @return PF_Evaluation_Points[]
     */
    public function getEvaluation_Points()
    {
        return PF_Evaluation_Points::findeNachSpecializations($this);
    }

    /**
     * @param PF_Company $company
     * @return PF_Specializations[]
     */
    public static function findeNachCompany(PF_Company $company)
    {
        $sql = "SELECT pf_specializations.* FROM pf_specializations JOIN pf_company_has_specializations ON pf_specializations.id =pf_company_has_specializations.specializations_id WHERE pf_company_has_specializations.company_id=?";
        $abfrage = Database::getDB()->prepare($sql);
        $abfrage->execute(array($company->getId()));
        $abfrage->setFetchMode(PDO::FETCH_CLASS, 'PF_Specializations');
        return $abfrage->fetchAll();
    }

    /**
     * @return PF_Company[]
     */
    public function getCompany()
    {
        return PF_Company::findeNachSpecializations($this);
    }


    /**
     * @param PF_Schoolclass $schoolclass
     * @return PF_Specializations[]
     */
    public static function findNachSchoolclassfromID(PF_Schoolclass $schoolclass)
    {
        $sql = "SELECT pf_specializations.* FROM pf_specializations
            WHERE pf_specializations.id=?";
        $abfrage = Database::getDB()->prepare($sql);
        $abfrage->execute(array($schoolclass->getSpecializationsid()));
        $abfrage->setFetchMode(PDO::FETCH_CLASS, 'PF_Specializations');
        return $abfrage->fetchAll();
    }

    /**
     * @return PF_Schoolclass[]
     */
    public function getSchooclass()
    {
        return PF_Schoolclass::findeNachSpecialization($this);
    }

    /**
     * @param PF_Student $student
     * @return PF_Specializations[]
     */
    public static function findeSpecializationfromEmail(PF_Student $student)
    {
        $sql = 'select s.id, s.description,s3.firstname,s3.surname,s2.name
        from pf_specializations s
         join pf_schoolclass s2 on s.id = s2.specializations_id
         join pf_student_has_class shc on s2.id = shc.class_id
         join pf_student s3 on shc.student_id = s3.id where s3.email=?';
        $abfrage = Database::getDB()->prepare($sql);
        $abfrage->execute(array($student->getEmail()));
        $abfrage->setFetchMode(PDO::FETCH_CLASS, 'PF_Specializations');
        $specializationsObj = $abfrage->fetchAll();
        $ret = array();
        foreach ($specializationsObj as $c) {
            $ret[] = $c->jsonSerialize();
        }
        return $ret;
    }
}
