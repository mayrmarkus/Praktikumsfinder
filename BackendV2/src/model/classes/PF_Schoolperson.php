<?php


/**
 * Class Schoolperson
 * @author Christian Tutzer
 */
class PF_Schoolperson extends DatabaseTable implements JsonSerializable
{
    private $id;
    private $firstname;
    private $surname;
    private $password;
    private $email;
    private $phonenumber;
    private $role_id;
    private $isAdministration = 0;

    /**
     * @return mixed
     */
    public function getIsAdministration()
    {
        return $this->isAdministration;
    }

    /**
     * @param mixed $isAdministration
     */
    public function setIsAdministration($isAdministration)
    {
        $this->isAdministration = $isAdministration;
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
    public function getFirstname()
    {
        return $this->firstname;
    }

    /**
     * @param mixed $firstname
     */
    public function setFirstname($firstname)
    {
        $this->firstname = $firstname;
    }

    /**
     * @return mixed
     */
    public function getSurname()
    {
        return $this->surname;
    }

    /**
     * @param mixed $surname
     */
    public function setSurname($surname)
    {
        $this->surname = $surname;
    }

    /**
     * @return mixed
     */
    public function getPassword()
    {
        return $this->password;
    }

    /**
     * @param mixed $password
     */
    public function setPassword($password)
    {
        $this->password = $password;
    }

    /**
     * @return mixed
     */
    public function getEmail()
    {
        return $this->email;
    }

    /**
     * @param mixed $email
     */
    public function setEmail($email)
    {
        $this->email = $email;
    }

    /**
     * @return mixed
     */
    public function getPhonenumber()
    {
        return $this->phonenumber;
    }

    /**
     * @param mixed $phonenumber
     */
    public function setPhonenumber($phonenumber)
    {
        $this->phonenumber = $phonenumber;
    }


    /**
     * @param mixed $role_id
     */
    public function setRole_Id($role_id)
    {
        $this->role_id = $role_id;
    }

    /**
     * @return mixed
     */
    public function getRole_Id()
    {
        return $this->role_id;
    }


    /**
     * Schoolperson constructor.
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
        $sql = 'INSERT INTO pf_schoolperson (email, password,  firstname, surname, phonenumber, role_id,isAdministration)'
            . 'VALUES (:email, :password, :firstname, :surname,  :phonenumber,:role_id,:isAdministration)';
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
        $sql = 'UPDATE pf_schoolperson SET id=:id, firstname=:firstname, surname=:surname, password=:password, email=:email, phonenumber=:phonenumber, role_id=:role_id, isAdministration:=isAdministration WHERE id=:id';

        $query = Database::getDB()->prepare($sql);
        $ret = $query->execute($this->toArray());
        return $ret;
    }

    /**
     * @param $id
     * @return PF_Schoolperson
     */
    public static function findById($id)
    {
        $sql = "SELECT * FROM pf_schoolperson WHERE id = '$id'";

        $query = Database::getDB()->query($sql);
        $query->setFetchMode(PDO::FETCH_CLASS, "PF_Schoolperson");
        return $query->fetch();
    }

    /**
     * @param $surname
     * @return PF_Schoolperson[]
     */
    public static function findByName($surname)
    {
        $sql = "SELECT * FROM pf_schoolperson WHERE surname like '%$surname%' or firstname like '%$surname%'";
        $query = Database::getDB()->query($sql);
        $query->setFetchMode(PDO::FETCH_CLASS, "PF_Schoolperson");
        $studentObj = $query->fetchAll();
        $ret = array();
        foreach ($studentObj as $c) {
            $ret[] = $c->jsonSerialize();
        }
        return $ret;
    }

    /**
     * @param $term
     * @param $offset
     * @param $limit
     * @return PF_Schoolperson[]
     */
    public static function findByString($term, $offset, $limit)
    {
        $sql = "SELECT distinct pfp.*
                FROM pf_schoolperson pfp
                left outer join pf_schoolclass ps on pfp.id = ps.classteacher_id
                WHERE pfp.surname like '%$term%'
                or pfp.firstname like '%$term%'
                or pfp.email like '%$term%'
                or ps.name like '%$term%'
                or CONCAT(pfp.firstname, ' ', pfp.surname) like '%$term%'
                or ps.schoolyear like '%$term%' group by (pfp.surname)LIMIT " . $limit . " OFFSET " . $offset;
        $query = Database::getDB()->query($sql);
        $query->setFetchMode(PDO::FETCH_CLASS, "PF_Schoolperson");
        $studentObj = $query->fetchAll();
        return $studentObj;
    }

    /**
     * @param $email
     * @return PF_Schoolperson
     */
    public static function findByEmail($email)
    {
        $sql = "SELECT * FROM pf_schoolperson WHERE email = '$email'";

        $query = Database::getDB()->query($sql);
        $query->setFetchMode(PDO::FETCH_CLASS, "PF_Schoolperson");
        return $query->fetch();
    }

    /**
     * @return PF_Schoolperson[]
     */
    public static function findAll()
    {
        $sql = 'SELECT * FROM pf_schoolperson';
        $abfrage = Database::getDB()->query($sql);
        $abfrage->setFetchMode(PDO::FETCH_CLASS, 'PF_Schoolperson');
        $studentObj = $abfrage->fetchAll();
        $ret = array();
        foreach ($studentObj as $c) {
            $ret[] = $c->jsonSerialize();
        }
        return $ret;
    }

    /**
     * @return PF_Schoolperson[]
     */
    public static function findAllTeachers()
    {
        $sql = 'SELECT * FROM pf_schoolperson where pf_schoolperson.isAdministration=1';
        $abfrage = Database::getDB()->query($sql);
        $abfrage->setFetchMode(PDO::FETCH_CLASS, 'PF_Schoolperson');
        $studentObj = $abfrage->fetchAll();
        $ret = array();
        foreach ($studentObj as $c) {
            $ret[] = $c->jsonSerialize();
        }
        return $ret;
    }


    /**
     * @inheritDoc
     */
    public function jsonSerialize()
    {
        return get_object_vars($this);
    }

    /**
     * @return PF_Role
     */
    public function getRole()
    {
        return PF_Role::findRoleByID($this);
    }

    /**
     * @param PF_Schoolclass $schoolclass
     * @return PF_Schoolperson
     */
    public static function findClassTeacherByID(PF_Schoolclass $schoolclass)
    {
        $sql = 'SELECT pf_schoolperson.* FROM pf_schoolperson
            WHERE pf_schoolperson.id=?';
        $abfrage = Database::getDB()->prepare($sql);
        $abfrage->execute(array($schoolclass->getId()));
        $abfrage->setFetchMode(PDO::FETCH_CLASS, 'PF_Schoolperson');
        return $abfrage->fetch();
    }

    /**
     * @param PF_Schoolclass $schoolclass
     * @return PF_Schoolperson
     */
    public static function findTeacherByClass(PF_Schoolclass $schoolclass)
    {
        $sql = 'SELECT pf_schoolperson.* FROM pf_schoolperson, pf_schoolclass
                WHERE pf_schoolperson.id=pf_schoolclass.classteacher_id AND pf_schoolclass.id=?';
        $abfrage = Database::getDB()->prepare($sql);
        $abfrage->execute(array($schoolclass->getId()));
        $abfrage->setFetchMode(PDO::FETCH_CLASS, 'PF_Schoolperson');
        return $abfrage->fetch();
    }

    /**
     * @param PF_Specializations $specializations
     * @return PF_Schoolperson[]
     */
    public static function findTeacherBySpecialization(PF_Specializations $specializations)
    {
        $sql = 'SELECT distinct pf_schoolperson.*
        FROM pf_schoolperson
         JOIN pf_schoolclass ps on pf_schoolperson.id = ps.classteacher_id
        join pf_specializations p on ps.specializations_id = p.id
        where p.id=?';
        $abfrage = Database::getDB()->prepare($sql);
        $abfrage->execute(array($specializations->getId()));
        $abfrage->setFetchMode(PDO::FETCH_CLASS, 'PF_Schoolperson');
        return $abfrage->fetchAll();
    }


    /**
     * @param PF_Internship $internship
     * @return PF_Schoolperson[]
     */
    public static function findSchoolTutorByInternship(PF_Internship $internship)
    {
        $sql = 'SELECT pf_schoolperson.* FROM pf_schoolperson
            WHERE pf_schoolperson.id=?';
        $abfrage = Database::getDB()->prepare($sql);
        $abfrage->execute(array($internship->getTutor()));
        $abfrage->setFetchMode(PDO::FETCH_CLASS, 'PF_Schoolperson');
        return $abfrage->fetch();
    }
}
