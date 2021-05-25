<?php


/**
 * Class PF_Internship_Rating_Email
 * @author Alex Larentis
 *
 * this is a table for logging all rating emails.
 */
class PF_Internship_Rating_Email implements JsonSerializable
{

    private $id;
    private $sentBy;
    private $sentTo;
    private $content;
    private $internshipId;
    private $sent;

    /**
     * @return  PF_Internship_Rating_Email[]
     */
    public static function findAll()
    {
        $sql = 'SELECT * FROM pf_internship_rating_email';
        $abfrage = Database::getDB()->query($sql);
        $abfrage->setFetchMode(PDO::FETCH_CLASS, 'PF_Internship_Rating_Email');
        $districtObj = $abfrage->fetchAll();
        $ret = array();
        foreach ($districtObj as $c) {
            $ret[] = $c->jsonSerialize();
        }
        return $ret;

    }

    /**
     * @param $id
     * @return  PF_Internship_Rating_Email
     */
    public static function findById($id)
    {
        $sql = "SELECT content FROM pf_internship_rating_email WHERE id = '$id'";

        $query = Database::getDB()->query($sql);
        $query->setFetchMode(PDO::FETCH_CLASS, "PF_Internship_Rating_Email");
        return $query->fetch();
    }

    /**
     * @return array[]
     */
    public static function findAllWithNames()
    {
        $sql = "SELECT 
                pf_internship_rating_email.id as id,
                CONCAT(ps.firstname, ' ', ps.surname) as schoolpersonName, 
                CONCAT(ptc.firstname, ' ', ptc.surname) as companyTutorName,
                pc.name as companyName,
                pc.id as companyId,
                ptc.id as sentTo,
                ps.id as sentBy,
                pi.id as internshipId,
                CONCAT(p.firstname, ' ', p.surname) as studentName,
                p.id as studentId,
                pf_internship_rating_email.sent as sent
                FROM pf_internship_rating_email 
                JOIN pf_schoolperson ps on pf_internship_rating_email.sentBy = ps.id 
                join pf_tutor_company ptc on pf_internship_rating_email.sentTo = ptc.id
                join pf_company pc on ptc.company_id = pc.id
                join pf_internship pi on pc.id = pi.company_id
                join pf_student p on pi.student_id = p.id
                GROUP BY id";
        $abfrage = Database::getDB()->query($sql);
        $abfrage->setFetchMode(PDO::FETCH_ASSOC);
        return ($abfrage->fetchAll());
    }

    /**
     * @return mixed
     */
    public function getSentBy()
    {
        return $this->sentBy;
    }

    /**
     * @return mixed
     */
    public function getSent()
    {
        return $this->sent;
    }

    /**
     * @param mixed $sent
     */
    public function setSent($sent)
    {
        $this->sent = $sent;
    }


    /**
     * @param mixed $sentBy
     */
    public function setSentBy($sentBy)
    {
        $this->sentBy = $sentBy;
    }

    /**
     * @return mixed
     */
    public function getSentTo()
    {
        return $this->sentTo;
    }

    /**
     * @param mixed $sentTo
     */
    public function setSentTo($sentTo)
    {
        $this->sentTo = $sentTo;
    }

    /**
     * @return mixed
     */
    public function getContent()
    {
        return $this->content;
    }

    /**
     * @param mixed $content
     */
    public function setContent($content)
    {
        $this->content = $content;
    }

    /**
     * @return mixed
     */
    public function getInternshipId()
    {
        return $this->internshipId;
    }

    /**
     * @param mixed $internshipId
     */
    public function setInternshipId($internshipId)
    {
        $this->internshipId = $internshipId;
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
     * updates values in Database
     */
    protected function _update()
    {

        $sql = 'UPDATE pf_internship_rating_email
        SET `pf_internship_rating_email`.sentBy =:sentBy,
        sentTo=:sentTo,
        content=:content,
        internshipId=:internshipId,
            sent=:sent
        WHERE id =:id';
        $query = Database::getDB()->prepare($sql);
        $ret = $query->execute($this->toArray());
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
     * inserts values in database
     */
    protected function _insert()
    {
        $sql = "INSERT into pf_internship_rating_email (sentBy, sentTo, content, internshipId, sent) values (:sentBy, :sentTo, :content, :internshipId, :sent)";
        $query = Database::getDB()->prepare($sql);
        $ret = $query->execute($this->toArray(false));

        // setze die ID auf den von der DB generierten Wert
        $this->id = Database::getDB()->lastInsertId();
        return $ret;
    }

    public function jsonSerialize()
    {
        return get_object_vars($this);
    }


    /**
     * @return PF_Internship_Rating_Email[]
     *
     */
    public static function findAllNotYetSent()
    {

        $sql = 'SELECT * FROM pf_internship_rating_email where sent=false';
        $abfrage = Database::getDB()->query($sql);
        $abfrage->setFetchMode(PDO::FETCH_CLASS, 'PF_Internship_Rating_Email');
        $districtObj = $abfrage->fetchAll();
        $ret = array();
        foreach ($districtObj as $c) {
            $ret[] = $c->jsonSerialize();
        }
        return $ret;

    }

    /**
     * @return  PF_Internship_Rating_Email[]
     *
     */
    public static function findAllNotYetSentExtra()
    {

        $sql = 'SELECT pf_internship_rating_email.id           as id,
       CONCAT(ps.firstname, \' \', ps.surname)   as schoolpersonName,
       CONCAT(ptc.firstname, \' \', ptc.surname) as companyTutorName,
       pc.name                                 as companyName,
       pc.id                                   as companyId,
       ptc.id                                  as sentTo,
       ps.id                                   as sentBy,
       pi.id                                   as internshipId,
       CONCAT(p.firstname, \' \', p.surname)     as studentName,
       p.id                                    as studentId,
       pf_internship_rating_email.sent         as sent
FROM pf_internship_rating_email
         join pf_schoolperson ps on pf_internship_rating_email.sentBy = ps.id
         join pf_tutor_company ptc on pf_internship_rating_email.sentTo = ptc.id
         join pf_internship pi on pf_internship_rating_email.internshipId = pi.id
         join pf_student p on pi.student_id = p.id
         join pf_company pc on pi.company_id = pc.id
where pf_internship_rating_email.sent = false';
        $abfrage = Database::getDB()->query($sql);
        $abfrage->setFetchMode(PDO::FETCH_CLASS, 'PF_Internship_Rating_Email');
        $districtObj = $abfrage->fetchAll();
        $ret = array();
        foreach ($districtObj as $c) {
            $ret[] = $c->jsonSerialize();
        }
        return $ret;

    }

    /**
     * @return  PF_Internship_Rating_Email[]
     *
     */
    public static function findAllSentExtra()
    {

        $sql = 'SELECT pf_internship_rating_email.id           as id,
       CONCAT(ps.firstname, \' \', ps.surname)   as schoolpersonName,
       CONCAT(ptc.firstname, \' \', ptc.surname) as companyTutorName,
       pc.name                                 as companyName,
       pc.id                                   as companyId,
       ptc.id                                  as sentTo,
       ps.id                                   as sentBy,
       pi.id                                   as internshipId,
       CONCAT(p.firstname, \' \', p.surname)     as studentName,
       p.id                                    as studentId,
       pf_internship_rating_email.sent         as sent
FROM pf_internship_rating_email
         join pf_schoolperson ps on pf_internship_rating_email.sentBy = ps.id
         join pf_tutor_company ptc on pf_internship_rating_email.sentTo = ptc.id
         join pf_internship pi on pf_internship_rating_email.internshipId = pi.id
         join pf_student p on pi.student_id = p.id
         join pf_company pc on pi.company_id = pc.id
where pf_internship_rating_email.sent = true';
        $abfrage = Database::getDB()->query($sql);
        $abfrage->setFetchMode(PDO::FETCH_CLASS, 'PF_Internship_Rating_Email');
        $districtObj = $abfrage->fetchAll();
        $ret = array();
        foreach ($districtObj as $c) {
            $ret[] = $c->jsonSerialize();
        }
        return $ret;

    }

    /**
     * @return  PF_Internship_Rating_Email[]
     *
     */
    public static function findAllSent()
    {

        $sql = 'SELECT * FROM pf_internship_rating_email where sent=true';
        $abfrage = Database::getDB()->query($sql);
        $abfrage->setFetchMode(PDO::FETCH_CLASS, 'PF_Internship_Rating_Email');
        $districtObj = $abfrage->fetchAll();
        $ret = array();
        foreach ($districtObj as $c) {
            $ret[] = $c->jsonSerialize();
        }
        return $ret;

    }

    /**
     * @param $iid
     * @return  PF_Internship_Rating_Email[]
     */
    public static function findByInternshipId($iid)
    {
        $sql = "SELECT content FROM pf_internship_rating_email WHERE internshipId = '$iid'";

        $query = Database::getDB()->query($sql);
        $query->setFetchMode(PDO::FETCH_CLASS, "PF_Internship_Rating_Email");
        return $query->fetchAll();
    }

    /**
     * @return bool
     */
    public function deleteInternshipRatingEmail()
    {
        $sql = "DELETE FROM pf_internship WHERE id = ?";
        $query = Database::getDB()->prepare($sql);
        $ret = $query->execute([$this->getId()]);
        return $ret;
    }
}
