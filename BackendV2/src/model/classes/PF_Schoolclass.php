<?php

/**
 * Class Schoolclass
 * @author Christian Tutzer
 */

class PF_Schoolclass extends DatabaseTable implements JsonSerializable
{
    private $id;
    private $schoolyear;
    private $name;
    private $token;
    private $specializations_id;
    private $classteacher_id;
    private $active;

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
    public function getSchoolyear()
    {
        return $this->schoolyear;
    }

    /**
     * @param mixed $schoolyear
     */
    public function setSchoolyear($schoolyear)
    {
        $this->schoolyear = $schoolyear;
    }

    /**
     * @return mixed
     */
    public function getName()
    {
        return $this->name;
    }

    /**
     * @param mixed $name
     */
    public function setName($name)
    {
        $this->name = $name;
    }

    /**
     * @return mixed
     */
    public function getToken()
    {
        return $this->token;
    }

    /**
     * @param mixed $token
     */
    public function setToken($token)
    {
        $this->token = $token;
    }

    /**
     * @return mixed
     */
    public function getSpecializationsid()
    {
        return $this->specializations_id;
    }

    /**
     * @param mixed $specializations_id
     */
    public function setSpecializationsid($specializations_id)
    {
        $this->specializations_id = $specializations_id;
    }


    /**
     * @param mixed $classteacher_id
     */
    public function setClassteacherId($classteacher_id)
    {
        $this->classteacher_id = $classteacher_id;
    }

    /**
     * @return mixed
     */
    public function getActive()
    {
        return $this->active;
    }

    /**
     * @param mixed $active
     */
    public function setActive($active)
    {
        $this->active = $active;
    }


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
     * @inheritDoc
     */
    protected function _insert()
    {
        $sql = 'INSERT INTO pf_schoolclass (schoolyear, name, token, specializations_id, classteacher_id, active)'
            . 'VALUES (:schoolyear, :name, :token, :specializations_id, :classteacher_id, :active)';
        $query = Database::getDB()->prepare($sql);
        $ret = $query->execute($this->toArray(false));
        // setze die ID auf den von der DB generierten Wert
        $this->id = Database::getDB()->lastInsertId();
        return $ret;
    }

    /**
     * @inheritDoc
     */
    protected function _update()
    {
        $sql = "UPDATE pf_schoolclass SET schoolyear=:schoolyear, name=:name, token=:token, specializations_id=:specializations_id, classteacher_id=:classteacher_id, active=:active
            WHERE id=:id";

        $query = Database::getDB()->prepare($sql);
        $ret = $query->execute($this->toArray());
        return $ret;
    }

    /**
     * @inheritDoc
     */
    public function jsonSerialize()
    {
        return get_object_vars($this);
    }

    public function save()
    {
        if ($this->getId() > 0) {
            return $this->_update();
        } else {
            return $this->_insert();
        }
    }

    /**
     * @param $id
     * @return PF_Schoolclass
     */
    public static function findById($id)
    {
        $sql = "SELECT * FROM pf_schoolclass WHERE id = $id";

        $query = Database::getDB()->query($sql);
        $query->setFetchMode(PDO::FETCH_CLASS, "PF_Schoolclass");
        return $query->fetch();
    }

    /**
     * @param $token
     * @return array|bool
     */
    public static function isTokenValid($token)
    {
        $sql = "SELECT * FROM pf_schoolclass WHERE token = '$token'";
        $query = Database::getDB()->query($sql);
        $query->setFetchMode(PDO::FETCH_CLASS, "PF_Schoolclass");
        $res = $query->fetchAll();
        if ($query->rowCount() == 0) {
            return false;
        } else {
            return $res;
        }

    }

    /**
     * @return PF_Schoolclass[]
     */
    public static function findeNachSpecialization(PF_Specializations $specializations)
    {
        $sql = 'SELECT pf_schoolclass.* FROM pf_schoolclass JOIN pf_specializations s on pf_schoolclass.specializations_id = s.id where specializations_id=?';
        $abfrage = Database::getDB()->prepare($sql);
        $abfrage->execute(array($specializations->getId()));
        $abfrage->setFetchMode(PDO::FETCH_CLASS, 'PF_Schoolclass');
        return $abfrage->fetchAll();
    }

    /**
     * @return PF_Schoolclass[]
     */
    public static function findAll()
    {
        $sql = 'SELECT pf_schoolclass.* FROM pf_schoolclass';
        $abfrage = Database::getDB()->query($sql);
        $abfrage->setFetchMode(PDO::FETCH_CLASS, 'PF_Schoolclass');
        return $abfrage->fetchAll();
    }

    /**
     * @param PF_Student $student
     * @return array[]
     */
    public static function findeNachStudent(PF_Student $student)
    {
        $sql = 'SELECT *  FROM pf_schoolclass s
                JOIN pf_student_has_class ON s.id = pf_student_has_class.class_id
                WHERE pf_student_has_class.student_id =?';
        $abfrage = Database::getDB()->prepare($sql);
        $abfrage->execute(array($student->getId()));
        $abfrage->setFetchMode(PDO::FETCH_ASSOC);
        return $abfrage->fetchAll();
    }

    /**
     * @return PF_Schoolclass
     */
    public static function findByInternship(PF_Internship $internship)
    {
        $sql = "SELECT s.* FROM pf_schoolclass s JOIN pf_internship pi on s.id = pi.schoolclass_id WHERE pi.schoolclass_id=? ";
        $abfrage = Database::getDB()->prepare($sql);
        $abfrage->execute(array($internship->getSchoolclassId()));
        $abfrage->setFetchMode(PDO::FETCH_CLASS, 'PF_Schoolclass');
        return $abfrage->fetch();
    }

    /**
     * @return PF_Student
     */
    public function getStudent()
    {
        return PF_Student::findeNachClass($this);
    }

    /**
     * @return PF_Specializations
     */
    public function getSpecializationID()
    {
        return PF_Specializations::findSpecializationfromID($this);
    }


    /**
     * @return PF_Schoolperson
     */
    public function getClassTeacher()
    {
        return PF_Schoolperson::findTeacherByClass($this);
    }

    /**
     * @return PF_Schoolclass
     */
    public static function getActiveClasses()
    {
        $sql = 'SELECT * FROM pf_schoolclass where active=1';
        $query = Database::getDB()->query($sql);
        $query->setFetchMode(PDO::FETCH_CLASS, "PF_Schoolclass");
        return $query->fetchAll();
    }

    /**
     * @return bool
     */
    public function removeStudents()
    {
        $sql = "DELETE FROM pf_student_has_class WHERE class_id = ?";
        $query = Database::getDB()->prepare($sql);
        $ret = $query->execute([$this->getId()]);
        return $ret;
    }

    /**
     * @return bool
     */
    public function deleteSchooclass()
    {
        $sql = "DELETE FROM pf_schoolclass WHERE id = ?";
        $query = Database::getDB()->prepare($sql);
        $ret = $query->execute([$this->getId()]);
        return $ret;
    }


}