<?php


/**
 * Class TutorCompany
 * @author Christian Tutzer
 */
class PF_TutorCompany extends DatabaseTable implements JsonSerializable
{
    private $id;
    private $firstname;
    private $surname;
    private $password;
    private $email;
    private $company_id;
    private $isEmployed;
    private $phonenumber;
    private $isVerified = 0;

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
    public function getIsVerified()
    {
        return $this->isVerified;
    }

    /**
     * @param mixed $isVerified
     */
    public function setIsVerified($isVerified)
    {
        $this->isVerified = $isVerified;
    }


    /**
     * @param mixed $company_id
     */
    public function setCompany_id($company_id)
    {
        $this->company_id = $company_id;
    }

    public function getCompany_id()
    {
        return $this->company_id;
    }

    /**
     * @return mixed
     */
    public function getIsEmployed()
    {
        return $this->isEmployed;
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
     * @param mixed $isEmployed
     */
    public function setIsEmployed($isEmployed)
    {
        $this->isEmployed = $isEmployed;
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
     * TutorCompany constructor.
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
        $sql = 'INSERT INTO pf_tutor_company (isEmployed, firstname, surname, email, phonenumber, company_id,password, isVerified)'
            . 'VALUES (:isEmployed,:firstname,:surname,:email,:phonenumber,:company_id,:password, :isVerified)';
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
        $sql = "UPDATE pf_tutor_company SET firstname=:firstname, surname=:surname, password=:password, email=:email, phonenumber=:phonenumber, company_id=:company_id, isEmployed=:isEmployed, isVerified=:isVerified WHERE id=:id;";
        $query = Database::getDB()->prepare($sql);
        $ret = $query->execute($this->toArray());
        return $ret;
    }

    /**
     * @param $id
     * @return PF_TutorCompany
     */
    public static function findById($id)
    {
        $sql = "SELECT * FROM pf_tutor_company WHERE id = '$id'";

        $query = Database::getDB()->query($sql);
        $query->setFetchMode(PDO::FETCH_CLASS, "PF_TutorCompany");
        return $query->fetch();
    }

    /**
     * @param $cid
     * @return  PF_TutorCompany[]
     */
    public static function findByCompanyId($cid)
    {
        $sql = "SELECT * FROM pf_tutor_company WHERE company_id = '$cid'";

        $query = Database::getDB()->query($sql);
        $query->setFetchMode(PDO::FETCH_CLASS, "PF_TutorCompany");
        return $query->fetchAll();
    }

    /**
     * @param $cid
     * @return PF_TutorCompany[]
     */
    public static function findVerifiedByCompanyId($cid)
    {
        $sql = "SELECT * FROM pf_tutor_company WHERE company_id = '$cid' and isVerified=1 ";

        $query = Database::getDB()->query($sql);
        $query->setFetchMode(PDO::FETCH_CLASS, "PF_TutorCompany");
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
     * @return PF_Company
     */
    public function getCompany()
    {
        return PF_Company::findCompanyByTutorCompany($this);
    }

    /**
     * @param PF_Internship $internship
     * @return PF_TutorCompany
     */
    public static function findTutorByInternship(PF_Internship $internship)
    {
        $sql = 'SELECT pf_tutor_company.* FROM pf_tutor_company
        WHERE pf_tutor_company.id=?';
        $abfrage = Database::getDB()->prepare($sql);
        $abfrage->execute(array($internship->getTutorCompanyId()));
        $abfrage->setFetchMode(PDO::FETCH_CLASS, 'PF_TutorCompany');
        return $abfrage->fetch();
    }

    /**
     * @param $email
     * @return PF_TutorCompany
     */
    public static function findByEmail($email)
    {
        $sql = "SELECT * FROM pf_tutor_company WHERE email = '$email'";

        $query = Database::getDB()->query($sql);
        $query->setFetchMode(PDO::FETCH_CLASS, "PF_TutorCompany");
        return $query->fetch();
    }


}
