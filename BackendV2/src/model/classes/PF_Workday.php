<?php


/**
 * Class Workday
 * @author Christian Tutzer
 */

class PF_Workday extends DatabaseTable implements JsonSerializable
{
    private $id;
    private $date;
    private $hours_count;
    private $internship_id;

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
    public function getDate()
    {
        return $this->date;
    }

    /**
     * @param mixed $date
     */
    public function setDate($date)
    {
        $this->date = $date;
    }

    /**
     * @return mixed
     */
    public function getHoursCount()
    {
        return $this->hours_count;
    }

    /**
     * @param mixed $hours_count
     */
    public function setHoursCount($hours_count)
    {
        $this->hours_count = $hours_count;
    }
    /**
     *
     * public function getInternshipId()
     * {
     * return $this->internship_id;
     * }
     **/

    /**
     * @param mixed $internship_id
     */
    public function setInternshipId($internship_id)
    {
        $this->internship_id = $internship_id;
    }

    /**
     * Workday constructor.
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
        $sql = 'INSERT INTO pf_workday (date,  hours_count, internship_id)'
            . 'VALUES (:date, :hours_count, :internship_id)';
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
        $sql = 'UPDATE pf_workday SET id=:id, date=:date, hours_count=:hours_count,  internship_id=:internship_id '
            . 'WHERE id=:id';

        $query = Database::getDB()->prepare($sql);
        $ret = $query->execute($this->toArray());
        return $ret;
    }

    /**
     * @param $id
     * @return PF_Workday
     */
    public static function findById($id)
    {
        $sql = "SELECT * FROM pf_workday WHERE id = '$id'";

        $query = Database::getDB()->query($sql);
        $query->setFetchMode(PDO::FETCH_CLASS, "PF_Workday");
        return $query->fetch();
    }

    /**
     * @param $iid
     * @return PF_Workday[]
     */
    public static function findByInternshipId($iid)
    {
        $sql = "SELECT * FROM pf_workday WHERE internship_id = '$iid'";

        $query = Database::getDB()->query($sql);
        $query->setFetchMode(PDO::FETCH_CLASS, "PF_Workday");
        return $query->fetchAll();
    }

    /**
     * @return bool
     */
    public function deleteWorkday()
    {
        $sql = "DELETE FROM pf_workday WHERE id = ?";
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

    /**
     * @return PF_Internship[]
     */
    public function getInternshipID()
    {
        return PF_Internship::findInternshipByWorkday($this);
    }
}
