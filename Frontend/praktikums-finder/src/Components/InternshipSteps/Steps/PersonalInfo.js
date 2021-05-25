import 'rc-steps/assets/index.css';
import 'rc-steps/assets/iconfont.css';
import '../InternshipStepsStyle.css';
import React, {Component} from 'react';
import {Button, Col, Row} from "react-bootstrap";
import {Calendar} from "react-date-range";


class PersonalInfo extends Component {
    state = {

    };

    onChange = (date) => {
        this.setState(prevState => {
            let personalinfo = Object.assign({}, prevState.personalinfo);
            personalinfo.birthdate = date;
            return {personalinfo};
        })
    };


    /**
     * saves state of input in state array personalinfo
     * @param e
     */
    handleInputChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
    };

    /**
     * sets personal info into state from login information
     * */
    setPersonalInfo = () => {
        this.setState({
            firstname: this.props.currentUser.firstname,
            surname: this.props.currentUser.surname
        })
    };

    /**
     * nachdem fenster geladen hat werden diese Methoden ausgeführt
     * */
    componentDidMount() {
        this.setPersonalInfo();

        console.log(this.props.currentUser.surname);

        
        window.addEventListener('load', this.getStudentextraInfo());
    }

    /**
     * gettet klasse und fachrichtung von api
     * */
    getStudentextraInfo = () => {

        let url = localStorage.getItem('url');

        url += "?action=getStudentextra";
        let url_search = url;
        const axios = require('axios');

        axios({
            method: 'post',
            url: url_search,

            //asas
        }).then((res) => {
            if (res.data.length > 0) {
                this.setState({
                    schoolclass: res.data[0].name,
                    specialisation: res.data[0].description,
                    school: "LBSHI-BZ"

                })
            }


        })
    };

    saveDateIntoState = (date) => {
        this.setState({
            birthdate : date
        })
    };


    render() {

        return (
            <div className={'d-flex justify-content-center align-items-center bg-light'}>
                <Col className={'justify-content-md-center'}>
                    <Row className={'justify-content-md-center'}>
                        <h1>Persönliche Informationen</h1>
                    </Row>
                    <br/>
                    <Row className={'justify-content-md-center'}>

                        <form>
                            <Row>
                                <Col>
                                    {/*Input for Zu- und Vorname*/}
                                    <div className="input-group mb-3">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text">Zu- und Vorname</span>
                                        </div>
                                        <input type="text"
                                               className="form-control"
                                               value={this.state.firstname + " " + this.state.surname}
                                               aria-label="Vor_Zuname"
                                               name={"firstname_surname"}
                                               aria-describedby="basic-addon1"
                                               disabled
                                        />
                                    </div>
                                    {/*Input for Geburtsdatum*/}
                                    <div className="input-group mb-3">

                                    </div>
                                    {/*Input for Steuernummer*/}
                                    <div className="input-group mb-3">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text">Steuernummer</span>
                                        </div>
                                        <input type="text" className="form-control" placeholder="Steuernummer"
                                               aria-label="Steuernummer"
                                               name={"tax_number"}
                                               aria-describedby="basic-addon1"
                                               onChange={this.handleInputChange}
                                        />
                                    </div>
                                    {/*Input for Straße*/}
                                    <div className="input-group mb-3">
                                        <div className="input-group-prepend">
                                    <span className="input-group-text"
                                    >Straße</span>
                                        </div>
                                        <input type="text" className="form-control" placeholder="Straße"
                                               aria-label="Straße"
                                               name={"street"}
                                               aria-describedby="basic-addon1"
                                               onChange={this.handleInputChange}
                                        />
                                        {/*Input for Wohnsitz*/}
                                        <div className="input-group-prepend">
                                    <span className="input-group-text"
                                    >Wohnsitz</span>
                                        </div>
                                        <input type="text" className="form-control" placeholder="Wohnsitz"
                                               aria-label="Wohnsitz"
                                               name={"residence"}
                                               aria-describedby="basic-addon1"
                                               onChange={this.handleInputChange}
                                        />
                                        {/*Input for Postleitzahl*/}
                                        <div className="input-group-prepend">
                                    <span className="input-group-text"
                                    >Postleitzahl</span>
                                        </div>
                                        <input type="text" className="form-control" placeholder="Postleitzahl"
                                               aria-label="Postleitzahl"
                                               name={"postcode"}
                                               aria-describedby="basic-addon1"
                                               onChange={this.handleInputChange}
                                        />
                                    </div>
                                    {/*Input for Schule*/}
                                    <div className="input-group mb-3">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text">Schule</span>
                                        </div>
                                        <input type="text" className="form-control"
                                               value={this.state.school}
                                               aria-label={"Schule"}
                                               name={"school"}
                                               aria-describedby="basic-addon1"
                                               onChange={this.handleInputChange}
                                               disabled
                                        />
                                        {/*Input for Klasse/Zug*/}
                                        <div className="input-group-prepend">
                                            <span className="input-group-text">Klasse/Zug</span>
                                        </div>
                                        <input type="text" className="form-control"
                                               aria-label="Klasse/Zug"
                                               value={this.state.schoolclass}
                                               name={"schoolclass"}
                                               id={"schoolclass"}
                                               aria-describedby="basic-addon1"
                                               onChange={this.handleInputChange}
                                               disabled
                                        />
                                        {/*Input for Fachrichtung*/}
                                        <div className="input-group-prepend">
                                            <span className="input-group-text">Fachrichtung</span>
                                        </div>
                                        <input type="text" className="form-control"
                                               aria-label="Fachrichtung"
                                               value={this.state.specialisation}
                                               id={"specialisation"}
                                               name={"specialisation"}
                                               onChange={this.handleInputChange}
                                               aria-describedby="basic-addon1"
                                               disabled
                                        />

                                    </div>


                                    <div className="input-group mb-3">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text">Geburtsdatum</span>
                                        </div>
                                        <Calendar
                                            className="border flex-fill align-content-center"
                                            date={this.state.birthdate}
                                            onChange={this.saveDateIntoState}
                                        />
                                    </div>
                                    <div className="input-group mb-3">
                                        <div className="input-group-prepend">
                                    <span className="input-group-text"
                                    >Geburtsort</span>
                                        </div>
                                        <input type="text" className="form-control" placeholder="Geburtsort"
                                               aria-label="Geburtsort"
                                               name={"birthplace"}
                                               id={"birthplace"}
                                               aria-describedby="basic-addon1"
                                               onChange={this.handleInputChange}
                                        />
                                    </div>
                                </Col>
                            </Row>
                        </form>
                    </Row>
                    <Row>
                        <Col>
                            <Button className={'w-25 float-right'} onClick={() => {
                                this.props.setCompleted('personalinfo', this.state, 5)
                            }}>Weiter</Button>
                        </Col>
                    </Row>
                </Col>

            </div>
        );
    }
}

export default PersonalInfo;
