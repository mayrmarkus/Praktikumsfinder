<?php


/**
 * Class Evaluation
 * @author Christian Tutzer
 */
class PF_Evaluation implements JsonSerializable
{
    private $evaluation;
    private $evaluation_points_id;
    private $internship_id;

    /**
     * @return mixed
     */
    public function getEvaluation()
    {
        return $this->evaluation;
    }

    /**
     * @param mixed $evaluation
     */
    public function setEvaluation($evaluation)
    {
        $this->evaluation = $evaluation;
    }

    /**
     * @return mixed
     */
    public function getEvaluationPointsId()
    {
        return $this->evaluation_points_id;
    }

    /**
     * @param mixed $evaluation_points_id
     */
    public function setEvaluationPointsId($evaluation_points_id)
    {
        $this->evaluation_points_id = $evaluation_points_id;
    }

    /**
     * @return mixed
     */
    public function getInternshipId()
    {
        return $this->internship_id;
    }

    /**
     * @param mixed $internship_id
     */
    public function setInternshipId($internship_id)
    {
        $this->internship_id = $internship_id;
    }


    /**
     * Evaluation constructor.
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
        return $this->_insert();
    }

    /**
     * inserts values in database
     */
    protected function _insert()
    {
        $sql = 'INSERT INTO pf_evaluation (evaluation, evaluation_points_id, internship_id)'
            . 'VALUES (:evaluation, :evaluation_points_id, :internship_id)';
        $query = Database::getDB()->prepare($sql);
        $ret = $query->execute($this->toArray(false));

        // setze die ID auf den von der DB generierten Wert
        $this->id = Database::getDB()->lastInsertId();
        return $ret;
    }

    //todo WATCH

    /**
     * @param PF_Specializations $specializations
     * @return PF_Evaluation[]
     */
    public static function findeNachEvaluation_Points(PF_Specializations $specializations)
    {
        $sql = "SELECT pe.* FROM pf_evaluation pe JOIN pf_evaluation_points_has_specialization pephs on pe.evaluation_points_id = pephs.evaluation_points_id where pephs.specializations_id=?";
        $abfrage = Database::getDB()->prepare($sql);
        $abfrage->execute(array($specializations->getId()));
        $abfrage->setFetchMode(PDO::FETCH_CLASS, 'PF_Evaluation');
        return $abfrage->fetchAll();
    }

    /**
     * @param PF_Internship $internship
     * @return PF_Evaluation[]
     */
    public static function findByInternship(PF_Internship $internship)
    {
        $sql = 'SELECT pf_evaluation.*
                FROM pf_evaluation
                    JOIN pf_internship pi on pf_evaluation.internship_id = pi.id
                WHERE pf_evaluation.internship_id = ?';
        $abfrage = Database::getDB()->prepare($sql);
        $abfrage->execute(array($internship->getId()));
        $abfrage->setFetchMode(PDO::FETCH_CLASS, 'PF_Evaluation');
        return $abfrage->fetchAll();
    }

    /**
     * @param PF_Internship $internship
     * @return bool
     */
    public function deleteEvaluation(PF_Internship $internship)
    {
        $sql = "DELETE FROM pf_evaluation WHERE internship_id = ?";
        $query = Database::getDB()->prepare($sql);
        $ret = $query->execute([$internship->getId()]);
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
