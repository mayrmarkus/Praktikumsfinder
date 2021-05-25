<?php


/**
 * Class Company
 * @author Christian Tutzer
 */
class PF_Company extends DatabaseTable implements JsonSerializable
{
    private $id;
    private $address;
    private $email;
    private $phonenumber;
    private $name;
    private $cap;
    private $isVerified = 0;

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
     * @return mixed
     */
    public function getCap()
    {
        return $this->cap;
    }

    /**
     * @param mixed $cap
     */
    public function setCap($cap)
    {
        $this->cap = $cap;
    }


    /**
     * Company constructor.
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
     * @return mixed
     */
    public function getAddress()
    {
        return $this->address;
    }

    /**
     * @param mixed $address
     */
    public function setAddress($address)
    {
        $this->address = $address;
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
        $sql = 'INSERT INTO pf_company (address, email, phonenumber, name,cap, isVerified)'
            . 'VALUES (:address, :email, :phonenumber, :name,:cap, :isVerified)';
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
        $sql = 'UPDATE pf_company
            SET id=:id,
            address=:address,
            email=:email,
            phonenumber=:phonenumber,
            name=:name,
            cap=:cap,
                isVerified=:isVerified
            WHERE id = :id';
        $query = Database::getDB()->prepare($sql);
        $ret = $query->execute($this->toArray());
        return $ret;
    }

    /**
     * @param $id
     * @return PF_Company
     */
    public static function findById($id)
    {
        $sql = "SELECT * FROM pf_company WHERE id = '$id'";

        $query = Database::getDB()->query($sql);
        $query->setFetchMode(PDO::FETCH_CLASS, "PF_Company");
        return $query->fetch();
    }

    /**
     * @param $email
     * @return PF_Company
     */
    public static function findByEmail($email)
    {
        $sql = "SELECT * FROM pf_company WHERE email = '$email'";
        $query = Database::getDB()->query($sql);
        $query->setFetchMode(PDO::FETCH_CLASS, "PF_Company");
        return $query->fetch();
    }


    /**
     * Führt eine Funktion aus
     * @return array
     */
    public static function findAll()
    {
        $sql = 'SELECT * FROM pf_company';
        $abfrage = Database::getDB()->query($sql);
        $abfrage->setFetchMode(PDO::FETCH_CLASS, 'PF_Company');
        $companyObj = $abfrage->fetchAll();
        return $companyObj;
    }

    /**
     * Führt eine Funktion aus
     * @return array
     */
    public static function findAllVerified()
    {
        $sql = 'SELECT * FROM pf_company where isVerified=1';
        $abfrage = Database::getDB()->query($sql);
        $abfrage->setFetchMode(PDO::FETCH_CLASS, 'PF_Company');
        $companyObj = $abfrage->fetchAll();
        return $companyObj;
    }


    /**
     * @inheritDoc
     */
    public function jsonSerialize()
    {
        return get_object_vars($this);
    }

    //company has district

    /**
     * @param PF_District
     * @return PF_Company[]
     */
    public static function findeNachDistrict(PF_District $district)
    {
        $sql = 'SELECT pf_company.* FROM pf_company '
            . 'JOIN pf_company_has_district ON pf_company.id=pf_company_has_district.company_id '
            . 'WHERE pf_company_has_district.district_id=?';
        $abfrage = Database::getDB()->prepare($sql);
        $abfrage->execute(array($district->getId()));
        $abfrage->setFetchMode(PDO::FETCH_CLASS, 'PF_Company');
        return $abfrage->fetchAll();
    }

    /**
     * @return PF_District
     */
    public function getDistrict()
    {
        return PF_District::findeNachCompany($this);
    }

    /**
     * @param PF_Specializations $specializations
     * @return PF_Company[]
     */
    public static function findeNachSpecializations(PF_Specializations $specializations)
    {
        $sql = 'SELECT pf_company.* FROM pf_company
            JOIN pf_company_has_specializations chs ON pf_company.id=chs.company_id
            WHERE chs.specializations_id=?';
        $query = Database::getDB()->prepare($sql);
        $query->execute(array($specializations->getId()));
        $query->setFetchMode(PDO::FETCH_CLASS, 'PF_Company');
        return $query->fetchAll();
    }

    /**
     * @return PF_Specializations
     */
    public function getSpecialization()
    {
        return PF_Specializations::findeNachCompany($this);
    }

    /**
     * @param PF_TutorCompany $tutorCompany
     * @return PF_Company
     */
    public static function findCompanyByTutorCompany(PF_TutorCompany $tutorCompany)
    {
        $sql = 'SELECT pf_company.* FROM pf_company
            WHERE id=?';
        $abfrage = Database::getDB()->prepare($sql);
        $abfrage->execute(array($tutorCompany->getCompany_id()));
        $abfrage->setFetchMode(PDO::FETCH_CLASS, 'PF_Company');
        return $abfrage->fetch();
    }

    //nr 8

    /**
     * @param PF_Internship $internship
     * @return PF_Company
     */
    public static function findCompanyByInternship(PF_Internship $internship)
    {
        $sql = 'SELECT pf_company.* FROM pf_company
            WHERE id=?';
        $abfrage = Database::getDB()->prepare($sql);
        $abfrage->execute(array($internship->getCompany_ID()));
        $abfrage->setFetchMode(PDO::FETCH_CLASS, 'PF_Company');
        return $abfrage->fetch();
    }

    /**
     * @param $districtId
     * @return bool
     */
    public function addToDistrict($districtId)
    {
        $sql = 'INSERT INTO pf_company_has_district(company_id, district_id)'
            . 'VALUES (?,?)';
        $query = Database::getDB()->prepare($sql);
        $ret = $query->execute(array($this->getId(), $districtId));
        // setze die ID auf den von der DB generierten Wert
        return $ret;
    }

    /**
     * @param $specializationsId
     * @return bool
     */
    public function addToSpecialization($specializationsId)
    {
        $sql = 'INSERT INTO pf_company_has_specializations (company_id, specializations_id)'
            . 'VALUES (?,?)';
        $query = Database::getDB()->prepare($sql);
        $ret = $query->execute(array($this->getId(), $specializationsId));

        // setze die ID auf den von der DB generierten Wert
        return $ret;

    }

    /**
     * @param $term
     * @param $offset
     * @param $limit
     * @return PF_Company[]
     */
    public static function findByString($term, $offset, $limit)
    {
        $sql = "SELECT distinct c.*
FROM pf_company c
         left join pf_tutor_company ptc on c.id = ptc.company_id
WHERE c.name like '%$term%'
   or c.email like '%$term%'
   or ptc.firstname like '%$term%'
   or ptc.surname like '%$term%'
   or CONCAT(ptc.firstname, ' ', ptc.surname) like '%$term%'
   or ptc.email like '%$term%' group by (c.name) LIMIT " . $limit . " OFFSET " . $offset;

        $query = Database::getDB()->query($sql);
        $query->setFetchMode(PDO::FETCH_CLASS, "PF_Company");
        return $query->fetchAll();
    }

    /**
     * @param PF_District $district
     * @param PF_Specializations $specializations
     * @return PF_Company[]
     */
    public static function findByDistrictAndSpecialization(PF_District $district, PF_Specializations $specializations)
    {
        $sql = "SELECT DISTINCT c.*
        FROM pf_company c
         JOIN pf_company_has_district pchd ON c.id = pchd.company_id
         JOIN pf_district pd ON pchd.district_id = pd.id
         JOIN pf_company_has_specializations pchs ON c.id = pchs.company_id
         JOIN pf_specializations ps ON pchs.specializations_id = ps.id WHERE district_id = ? AND specializations_id = ?";
        $query = Database::getDB()->prepare($sql);
        $query->execute(array($district->getId(), $specializations->getId()));
        $query->setFetchMode(PDO::FETCH_CLASS, 'PF_Company');
        return $query->fetchAll();
    }

}
