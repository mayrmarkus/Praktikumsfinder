<?php

/**
 * Class Evaluation_Points
 * @author Maximilian Mauroner
 */
class PF_Evaluation_Points extends DatabaseTable implements JsonSerializable
{
    private $id;
    private $name;
    private $description;

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
        $this->description = $description;
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
        $sql = 'INSERT INTO pf_evaluation_points (name,description)'
            . 'VALUES (:name,:description)';
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
        $sql = "UPDATE pf_evaluation_points SET id=:id, name=:name, description=:description
            WHERE id=:id";

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


    /**
     * @param $id
     * @return PF_Evaluation_Points
     */
    public static function findById($id)
    {
        $sql = "SELECT * FROM pf_evaluation_points WHERE id = '$id'";

        $query = Database::getDB()->query($sql);
        $query->setFetchMode(PDO::FETCH_CLASS, "PF_Evaluation_Points");
        return $query->fetch();
    }


    /**
     * @param $specializations
     * löst n<>n beziehung auf
     * @return  PF_Evaluation_Points[]
     */
    public static function findeNachSpecializations(PF_Specializations $specializations)
    {
        $sql = 'SELECT pf_evaluation_points.*
from pf_evaluation_points
         join pf_evaluation_points_has_specialization pephs on pf_evaluation_points.id = pephs.evaluation_points_id
WHERE pephs.specializations_id =?';
        $abfrage = Database::getDB()->prepare($sql);
        $abfrage->execute(array($specializations->getId()));
        $abfrage->setFetchMode(PDO::FETCH_CLASS, 'PF_Evaluation_Points');
        return $abfrage->fetchAll();
    }

    /**
     * @return PF_Specializations[]
     */
    public function getSpecializations()
    {
        return PF_Specializations::findeNachEvaluation_Points($this);
    }
}