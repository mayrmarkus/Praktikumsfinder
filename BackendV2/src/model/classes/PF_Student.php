<?php


/**
 * Class Student
 * @author Alex Larentis
 */
class PF_Student extends DatabaseTable implements JsonSerializable
{
    private $id;
    private $firstname;
    private $surname;
    private $password;
    private $email;
    private $is_verified;
    private $is_enabled;

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
    public function getEmail()
    {
        return $this->email;
    }

    /**
     * @return mixed
     */
    public function getIsVerified()
    {
        return $this->is_verified;
    }

    /**
     * @param mixed $is_verified
     */
    public function setIsVerified($is_verified)
    {
        $this->is_verified = $is_verified;
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

    public function toArray($mitId = true)
    {
        $attributs = get_object_vars($this);
        if ($mitId === false) {
            unset($attributs['id']);
        }
        return $attributs;
    }

    /**
     * @return mixed
     */
    public function getIsEnabled()
    {
        return $this->is_enabled;
    }

    /**
     * @param mixed $is_enabled
     */
    public function setIsEnabled($is_enabled)
    {
        $this->is_enabled = $is_enabled;
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
        $this->setIsVerified(0);
        $sql = 'INSERT INTO pf_student (email, password,  firstname, surname, is_verified,is_enabled)'
            . 'VALUES (:email, :password, :firstname, :surname, :is_verified,:is_enabled)';
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
        $sql = "UPDATE pf_student SET firstname=:firstname, surname=:surname, password=:password, email=:email, is_verified=:is_verified, is_enabled=:is_enabled WHERE id=:id;";
        $query = Database::getDB()->prepare($sql);
        $ret = $query->execute($this->toArray());
        return $ret;
    }

    /**
     * @param $email
     * @return PF_Student
     */
    public static function findByEmail($email)
    {
        $sql = "SELECT * FROM pf_student WHERE email = '$email'";

        $query = Database::getDB()->query($sql);
        $query->setFetchMode(PDO::FETCH_CLASS, "PF_Student");
        return $query->fetch();
    }


    /**
     * @param $id
     * @return PF_Student
     */
    public static function findById($id)
    {
        $sql = "SELECT * FROM pf_student WHERE id = '$id'";
        $query = Database::getDB()->query($sql);
        $query->setFetchMode(PDO::FETCH_CLASS, "PF_Student");
        return $query->fetch();
    }

    /**
     * @param $id
     * @return array[]
     */
    public static function findByIdextra($id)
    {
        $sql = "SELECT s.id,s.firstname,s.surname,s.password,s.email,s.is_verified, c.name, s2.description
        FROM pf_student s
         JOIN pf_student_has_class shc ON s.id = shc.student_id
         JOIN pf_schoolclass c ON shc.class_id = c.id
         JOIN pf_specializations s2 ON c.specializations_id = s2.id
         where c.active =1 and s.id =$id";
        $query = Database::getDB()->query($sql);
        return $query->fetchAll(PDO::FETCH_ASSOC);
    }

    /**
     * @return PF_Student[]
     */
    public static function findAll()
    {
        $sql = 'SELECT DISTINCT s.*
    FROM pf_student s
         left outer JOIN pf_student_has_class shc ON s.id = shc.student_id
         left outer join pf_schoolclass c ON shc.class_id = c.id
         left outer JOIN pf_specializations s2 ON c.specializations_id = s2.id';
        $abfrage = Database::getDB()->query($sql);
        $abfrage->setFetchMode(PDO::FETCH_CLASS, 'PF_Student');
        $studentObj = $abfrage->fetchAll();
        $ret = array();
        foreach ($studentObj as $c) {
            $ret[] = $c->jsonSerialize();
        }
        return $ret;
    }

    /**
     * @param $email
     * @param $password
     * @return  null | array
     */
    public static function checkLogin($email, $password)
    {
        $rvlaue = null;
        $sql = 'SELECT * FROM pf_student where password=:password AND email=:email AND is_verified=true ';
        $query = Database::getDB()->prepare($sql);
        $rvlaue = $query->fetch();
        return $rvlaue;
    }

    /**
     * @inheritDoc
     */

    public function jsonSerialize()
    {
        return get_object_vars($this);
    }

    /**
     * @param PF_Schoolclass $class
     * @return PF_Student
     */
    public static function findeNachClass(PF_Schoolclass $class)
    {
        $sql = 'SELECT pf_student.* FROM pf_student '
            . 'JOIN pf_student_has_class ON pf_student.id=pf_student_has_class.student_id '
            . 'WHERE pf_student_has_class.class_id=?';
        $abfrage = Database::getDB()->prepare($sql);
        $abfrage->execute(array($class->getId()));
        $abfrage->setFetchMode(PDO::FETCH_CLASS, 'PF_Student');
        return $abfrage->fetchAll();
    }

    /**
     * @param PF_Specializations $specializations
     * @return PF_Student[]
     */
    public static function findBySpecialization(PF_Specializations $specializations)
    {
        $sql = 'SELECT DISTINCT pf_student.*
            FROM pf_student
         JOIN pf_student_has_class ON pf_student.id = pf_student_has_class.student_id
         JOIN pf_schoolclass ps on pf_student_has_class.class_id = ps.id
         join pf_specializations p on ps.specializations_id = p.id
            where p.id=?';
        $abfrage = Database::getDB()->prepare($sql);
        $abfrage->execute(array($specializations->getId()));
        $abfrage->setFetchMode(PDO::FETCH_CLASS, 'PF_Student');
        return $abfrage->fetchAll();
    }

    /**
     * @return array[]
     */
    public function getClass()
    {
        return PF_Schoolclass::findeNachStudent($this);
    }

    /**
     * @param PF_Internship $internship
     * @return PF_Student
     */
    public static function findByInternship(PF_Internship $internship)
    {
        $sql = 'SELECT pf_student.* FROM pf_student ' .
            'WHERE pf_student.id=?';
        $abfrage = Database::getDB()->prepare($sql);
        $abfrage->execute(array($internship->getStudentId()));
        $abfrage->setFetchMode(PDO::FETCH_CLASS, 'PF_Student');
        return $abfrage->fetch();
    }

    /**
     * @param $student_id
     * @param $class_id
     * @return bool|PDOStatement
     */
    public static function addStudentToClass($student_id, $class_id)
    {
        $sql = "INSERT INTO pf_student_has_class(student_id, class_id) VALUES(?,?)";
        $query = Database::getDB()->prepare($sql);
        $query->execute([$student_id, $class_id]);
        return $query;
    }

    /**
     * @param $student_id
     * @param $class_id
     * @return array
     */
    public static function checkStudentInClass($student_id, $class_id)
    {
        $sql = "SELECT * FROM pf_student_has_class shc where shc.student_id=? and shc.class_id=?";
        $query = Database::getDB()->prepare($sql);
        $query->execute([$student_id, $class_id]);
        return $query->fetch();
    }

    /**
     * @param $term
     * @param $offset
     * @param $limit
     * @return PF_Student[]
     */
    public static function findByString($term, $offset, $limit)
    {
        $sql = "SELECT distinct s.*
FROM pf_student s
         left outer join   pf_student_has_class pshc on s.id = pshc.student_id
         left outer join   pf_schoolclass ps on pshc.class_id = ps.id
         left outer join  pf_specializations p on ps.specializations_id = p.id
WHERE s.firstname LIKE '%$term%'
   OR s.surname LIKE '%$term%'
   OR s.email LIKE '%$term%'
   OR ps.name LIKE '%$term%'
   OR CONCAT(s.firstname, ' ', s.surname) LIKE '%$term%'
   OR p.description LIKE '%$term%' group by (s.surname) LIMIT " . $limit . " OFFSET " . $offset;

        $query = Database::getDB()->query($sql);
        $query->setFetchMode(PDO::FETCH_CLASS, "PF_Student");
        return $query->fetchAll();
    }
}
