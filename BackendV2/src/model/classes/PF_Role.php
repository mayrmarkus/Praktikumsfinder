<?php

/**
 * Class Role
 * @author Maximilian Mauroner
 */
class PF_Role extends DatabaseTable implements JsonSerializable
{
    private $id;
    private $name;
    private $description;

    /**
     * Role constructor.
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


    /**
     * @inheritDoc
     */
    protected function _insert()
    {
        $sql = 'INSERT INTO pf_role (name, description)'
            . 'VALUES (:name, :description)';
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
        $sql = "UPDATE pf_role SET id=:id, name=:name, description=:description
            WHERE id=:id";

        $query = Database::getDB()->prepare($sql);
        return $query->execute($this->toArray());
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
     * @return PF_Role
     */
    public static function findById($id)
    {
        $sql = "SELECT * FROM pf_role WHERE id = '$id'";

        $query = Database::getDB()->query($sql);
        $query->setFetchMode(PDO::FETCH_CLASS, "PF_Role");
        return $query->fetch();
    }

    /**
     * @param PF_Schoolperson $schoolperson
     * @return PF_Role
     */
    public static function findRoleByID(PF_Schoolperson $schoolperson)
    {
        $sql = "SELECT pf_role.* FROM pf_role WHERE pf_role.id=?";
        $abfrage = Database::getDB()->prepare($sql);
        $abfrage->execute(array($schoolperson->getRoleId()));
        $abfrage->setFetchMode(PDO::FETCH_CLASS, 'PF_Role');
        return $abfrage->fetch();
    }

    /**
     * @return PF_Role[]
     */
    public static function findAll()
    {
        $sql = "SELECT * FROM pf_role";
        $abfrage = Database::getDB()->prepare($sql);
        $abfrage->execute();
        $abfrage->setFetchMode(PDO::FETCH_CLASS, 'PF_Role');
        return $abfrage->fetchAll();
    }

    /**
     * @param $rolename
     * @return PF_Role
     */
    public static function findByName($rolename)
    {
        $sql = "SELECT * FROM pf_role WHERE name like  '$rolename'";
        $query = Database::getDB()->query($sql);
        $query->setFetchMode(PDO::FETCH_CLASS, "PF_Role");
        return $query->fetch();
    }
}