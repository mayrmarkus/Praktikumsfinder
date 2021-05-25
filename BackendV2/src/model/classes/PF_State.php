<?php


/**
 * Class State
 * @author Maximilian Mauroner
 */

class PF_State extends DatabaseTable implements JsonSerializable
{
    private $id;
    private $name;
    private $description;
    private $color;


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
        $this->description = description;
    }

    /**
     * @return mixed
     */
    public function getColor()
    {
        return $this->color;
    }

    /**
     * @param mixed $color
     */
    public function setColor($color)
    {
        $this->color = $color;
    }

    public function save()
    {
        if ($this->getId() > 0) {
            $this->_update();
        } else {
            $this->_insert();
        }
    }

    protected function _insert()
    {
        $sql = 'INSERT INTO pf_state (name,description,color)'
            . 'VALUES (:name,:description,:color)';
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
        $sql = "UPDATE pf_state SET id=:id, name=:name, description=:description,color=:color
            WHERE id=:id";

        $query = Database::getDB()->prepare($sql);
        $query->execute($this->toArray());
    }

    /**
     * @param $id
     * @return PF_State
     */
    public static function findById($id)
    {
        $sql = "SELECT * FROM pf_state WHERE id = $id";

        $query = Database::getDB()->query($sql);
        $query->setFetchMode(PDO::FETCH_CLASS, "PF_State");
        return $query->fetch();
    }

    /**
     * @inheritDoc
     */
    public function jsonSerialize()
    {
        return get_object_vars($this);
    }

    /**
     * @param PF_Internship $internship
     * @return PF_State[]
     */
    public static function findStateByInternship(PF_Internship $internship)
    {
        $sql = 'SELECT pf_state.* FROM pf_state WHERE pf_state.id=?';
        $abfrage = Database::getDB()->prepare($sql);
        $abfrage->execute(array($internship->getId()));
        $abfrage->setFetchMode(PDO::FETCH_CLASS, 'PF_State');
        return $abfrage->fetchAll();
    }

}