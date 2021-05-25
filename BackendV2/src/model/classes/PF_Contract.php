<?php

/**
 * Class PF_contract
 * @author Alex Larentis
 */
class PF_Contract extends DatabaseTable implements JsonSerializable
{
    private $id;
    private $contract_path;
    private $approved = 0;


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
        $sql = 'INSERT INTO pf_contract (contract_path,approved)'
            . 'VALUES (:contract_path,:approved)';
        $query = Database::getDB()->prepare($sql);
        $ret = $query->execute($this->toArray(false));

        // setze die ID auf den von der DB generierten Wert
        $this->id = Database::getDB()->lastInsertId();
        return $ret;
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
     * updates values in Database
     */
    protected function _update()
    {
        $sql = 'UPDATE pf_contract
            SET id=:id,
            contract_path=:contract_path,
            approved=:approved
            WHERE id = :id';
        $query = Database::getDB()->prepare($sql);
        $ret = $query->execute($this->toArray());
        return $ret;
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
    public function getContractPath()
    {
        return $this->contract_path;
    }

    /**
     * @param mixed $contract_path
     */
    public function setContractPath($contract_path)
    {
        $this->contract_path = $contract_path;
    }

    /**
     * @return mixed
     */
    public function getApproved()
    {
        return $this->approved;
    }

    /**
     * @param mixed $approved
     */
    public function setApproved($approved)
    {
        $this->approved = $approved;
    }

    /**
     * @param $id
     * @return PF_Contract
     */
    public static function findById($id)
    {
        $sql = "SELECT * FROM pf_contract WHERE id = '$id'";

        $query = Database::getDB()->query($sql);
        $query->setFetchMode(PDO::FETCH_CLASS, "PF_Contract");
        return $query->fetch();
    }


    /**
     * Führt eine Funktion aus
     * @return array
     */
    public static function findAll()
    {
        $sql = 'SELECT * FROM pf_contract';
        $abfrage = Database::getDB()->query($sql);
        $abfrage->setFetchMode(PDO::FETCH_CLASS, 'PF_Contract');
        $companyObj = $abfrage->fetchAll();
        return $companyObj;
    }

    /**
     * @param $path
     * @return PF_Contract
     */
    public static function findByPath($path)
    {
        $sql = "SELECT * FROM pf_contract WHERE contract_path = '$path'";
        $query = Database::getDB()->query($sql);
        $query->setFetchMode(PDO::FETCH_CLASS, "PF_Contract");
        return $query->fetch();
    }

    /**
     * @param PF_Contract_State $contract_State
     * @return bool
     */
    public function addContractStateToContract(PF_Contract_State $contract_State)
    {
        $sql = 'INSERT INTO pf_contract_has_contract_state (contract_id,contract_state_id)'
            . 'VALUES (?,?)';
        $query = Database::getDB()->prepare($sql);
        $ret = $query->execute([$this->getId(), $contract_State->getId()]);

        // setze die ID auf den von der DB generierten Wert
        return $ret;

    }

    /**
     * @return bool
     */
    public function removeContractState()
    {
        $sql = "DELETE FROM pf_contract_has_contract_state WHERE contract_id = ?";
        $query = Database::getDB()->prepare($sql);
        $ret = $query->execute([$this->getId()]);
        return $ret;
    }


    /**
     * @inheritDoc
     */
    public function jsonSerialize()
    {
        return get_object_vars($this);
    }

}

/*
 * -- auto-generated definition
create table pf_contract
(
    id            int        not null
        primary key,
    state_id      int        null,
    contract_path text       null,
    approved      tinyint(1) not null,
    constraint pf_contract_pf_contract_state_id_fk
        foreign key (state_id) references pf_contract_state (id)
);
 */