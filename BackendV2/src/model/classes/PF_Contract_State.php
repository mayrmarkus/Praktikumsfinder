<?php


class PF_Contract_State extends DatabaseTable implements JsonSerializable
{

    private $id;
    private $name;
    private $description;
    private $general = 0;

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
     * @return mixed
     */
    public function getGeneral()
    {
        return $this->general;
    }

    /**
     * @param mixed $general
     */
    public function setGeneral($general)
    {
        $this->general = $general;
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
        $sql = 'INSERT INTO pf_contract_state (name, description,general)'
            . 'VALUES (:name, :description,:general)';
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
        $sql = "UPDATE pf_contract_state SET id=:id, name=:name, description=:description, general=:general WHERE id=:id";

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
     * @return PF_Contract_State
     */
    public static function findById($id)
    {
        $sql = "SELECT * FROM pf_contract_state WHERE id = '$id'";

        $query = Database::getDB()->query($sql);
        $query->setFetchMode(PDO::FETCH_CLASS, "PF_Contract_State");
        return $query->fetch();
    }

    /**
     * @return PF_Contract_State[]
     */
    public static function findAll()
    {
        $sql = 'SELECT * FROM pf_contract_state';
        $abfrage = Database::getDB()->query($sql);
        $abfrage->setFetchMode(PDO::FETCH_CLASS, 'PF_Contract_State');
        $districtObj = $abfrage->fetchAll();
        $ret = array();
        foreach ($districtObj as $c) {
            $ret[] = $c->jsonSerialize();
        }
        return $ret;
    }


    /**
     * @return PF_Contract_State[]
     */
    public static function findAllGeneral()
    {
        $sql = 'SELECT * FROM pf_contract_state where general=1';
        $abfrage = Database::getDB()->query($sql);
        $abfrage->setFetchMode(PDO::FETCH_CLASS, 'PF_Contract_State');
        $districtObj = $abfrage->fetchAll();
        $ret = array();
        foreach ($districtObj as $c) {
            $ret[] = $c->jsonSerialize();
        }
        return $ret;
    }

}