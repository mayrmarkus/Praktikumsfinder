<?php

/**
 * Class District
 * @author Maximilian Mauroner
 */
class PF_District extends DatabaseTable implements JsonSerializable
{
    private $id;
    private $name;
    private $isVerified = 0;

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
     * @return int
     */
    public function getIsVerified()
    {
        return $this->isVerified;
    }

    /**
     * @param int $isVerified
     */
    public function setIsVerified($isVerified)
    {
        $this->isVerified = $isVerified;
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
        $sql = 'INSERT INTO pf_district (name,isVerified)'
            . 'VALUES (:name,:isVerified)';
        $query = Database::getDB()->prepare($sql);
        $query->execute($this->toArray(false));

        // setze die ID auf den von der DB generierten Wert
        $this->id = Database::getDB()->lastInsertId();
    }

    /**
     * @inheritDoc
     */
    protected function _update()
    {
        $sql = "UPDATE pf_district SET id=:id, name=:name, isVerified=:isVerified WHERE id=:id";

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

    public function save()
    {
        if ($this->getId() > 0) {
            $this->_update();
        } else {
            $this->_insert();
        }
    }


    /**
     * @param $id
     * @return PF_District
     */
    public static function findById($id)
    {
        $sql = "SELECT * FROM pf_district WHERE id = '$id'";

        $query = Database::getDB()->query($sql);
        $query->setFetchMode(PDO::FETCH_CLASS, "PF_District");
        return $query->fetch();
    }

    /**
     * @param PF_Company $company
     * @return PF_District
     */
    public static function findeNachCompany(PF_Company $company)
    {
        $sql = 'SELECT pf_district.* FROM pf_district 
            JOIN pf_company_has_district ON pf_district.id=pf_company_has_district.district_id 
            WHERE pf_company_has_district.company_id=?';
        $abfrage = Database::getDB()->prepare($sql);
        $abfrage->execute(array($company->getId()));
        $abfrage->setFetchMode(PDO::FETCH_CLASS, 'PF_District');
        return $abfrage->fetch();
    }

    /**
     * @param $name
     * @return PF_District , false
     */
    public static function findByName($name)
    {
        $sql = "SELECT * FROM pf_district WHERE pf_district.name like '$name'";
        $query = Database::getDB()->query($sql);
        $query->setFetchMode(PDO::FETCH_CLASS, "PF_District");
        return $query->fetch();
    }

    /**
     * @return PF_Company[]
     */
    public function getCompany()
    {
        return PF_Company::findeNachDistrict($this);
    }

    /**
     * @return PF_District[]
     */
    public static function findAll()
    {
        $sql = 'SELECT * FROM pf_district';
        $abfrage = Database::getDB()->query($sql);
        $abfrage->setFetchMode(PDO::FETCH_CLASS, 'PF_District');
        $districtObj = $abfrage->fetchAll();
        $ret = array();
        foreach ($districtObj as $c) {
            $ret[] = $c->jsonSerialize();
        }
        return $ret;
    }

    /**
     * @return PF_District[]
     */
    public static function findAllVerified()
    {
        $sql = 'SELECT * FROM pf_district where isVerified=1';
        $abfrage = Database::getDB()->query($sql);
        $abfrage->setFetchMode(PDO::FETCH_CLASS, 'PF_District');
        $districtObj = $abfrage->fetchAll();
        $ret = array();
        foreach ($districtObj as $c) {
            $ret[] = $c->jsonSerialize();
        }
        return $ret;
    }

}