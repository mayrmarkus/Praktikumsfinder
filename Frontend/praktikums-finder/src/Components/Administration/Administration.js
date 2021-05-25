import 'rc-steps/assets/index.css';
import 'rc-steps/assets/iconfont.css';
import React, {Component} from 'react';
import './AdministrationStyle.css'
import Avatar from '@material-ui/core/Avatar';
import Axios from "axios";

import {Breadcrumb, BreadcrumbItem, ButtonToolbar, Card, Col, DropdownButton, DropdownItem, Row} from "react-bootstrap";
import {Redirect} from "react-router-dom";

class Administration extends Component {

    state = {
        show: false,
        token: "",
        data: null,
        schoolClassData: null,
        submitted: false,
        redirect: "",
        redirectToLink: false,
        selecteditem: "Alle"
    };


    /**
     * calling get all Specializations and all Classes from API when component did mount
     */
    componentDidMount() {
        this.getAllSpecialization();
        this.getAllClasses()
    }

    render() {
        if (!this.state.data) {
            return <div/>;
        }

        if (this.state.redirectToLink !== false) {
            console.log(<Redirect to={this.state.redirect}/>)
            return <Redirect to={this.state.redirect}/>;
        }
        return (
            <div className={'w-100 adminViewContent'}>

                <Breadcrumb>
                    <BreadcrumbItem href={'/loggedin/Administration'} active>Administration</BreadcrumbItem>
                </Breadcrumb>

                <Row>
                    <Col className={'m-5'}>
                        <h1>Alle Klassen</h1>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <label>Filtern Nach: </label>
                        <ButtonToolbar>
                            {[DropdownButton].map((DropdownType, idx) => (
                                <DropdownType
                                    className="warning"
                                    title={this.state.selecteditem}
                                    id={`dropdown-button-drop-${idx}`}
                                    key={idx}
                                    onSelect={this.getKeyFromSelected}
                                >
                                    {this.insertDataIntoDropdown()}
                                </DropdownType>
                            ))}
                        </ButtonToolbar>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <div className={'p-1'}>
                            <div id={"classes"}>
                                {this.displayClasses()}
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>
        );
    }

    /**
     * gets classes by school year
     * @param schoolyear
     * @param data
     * @returns {[]}
     */
    getClassesInSchoolYear = (schoolyear, data) => {
        let arr = [];

        data.map((v) => {
            if (v.schoolyear === schoolyear)
                arr.push(v)
        });

        return arr;
    };

    /**
     * creates card with avatars for each Class
     * @returns {[]|*}
     */
    displayClasses = () => {
        function hashCode(str) { // java String#hashCode
            var hash = 0;
            for (var i = 0; i < str.length; i++) {
                hash = str.charCodeAt(i) + ((hash << 5) - hash);
            }
            return hash;
        }

        function rgbToHex(rgb) {
            var hex = Number(rgb).toString(16);
            if (hex.length < 2) {
                hex = "0" + hex;
            }
            return hex
        }

        function intToRGB(i) {
            var c = (i & 0x00FFFFFF)
                .toString(16)
                .toUpperCase();

            return "00000".substring(0, 6 - c.length) + c;
        }

        function getRandomColor() {
            var colors = []

            colors.push(rgbToHex(255) + "" + rgbToHex(203) + "" + rgbToHex(0))
            colors.push(rgbToHex(0) + "" + rgbToHex(48) + "" + rgbToHex(80))

            return colors[Math.floor(Math.random() * colors.length)];
        }

        /**
         * gets first of firstname and FirstChar of lastname
         */
        function firstCharAndLastChar(firstname, lastname) {
            let firstChar = (firstname.substring(0, 1)).toUpperCase();
            let lastChar = (lastname.substring(0, 1)).toUpperCase();
            return firstChar + lastChar;
        }

        if (!this.state.schoolClassData) {
            return <div/>
        }

        /**
         * checks if firstname and lastname of teacher is undefinied
         *
         * if true
         *      return a div with a Avatar with Max Muster(failsafe)
         *  false
         *      return a div with a Avatar with the firstname and lastname
         *
         *
         * @param firstname
         * @param lastname
         * @returns {*}
         */
        function isTeacherUndefined(firstname, lastname) {
            if (firstname === undefined || lastname === undefined) {
                return (<div className={"d-flex align-items-baseline"}>
                    <Avatar style={{backgroundColor: "#" + getRandomColor()}}>MM</Avatar>
                    <div className={"ml-2"}>Max Muster</div>
                </div>)
            } else {
                return (<div className={"d-flex align-items-baseline"}>
                    <Avatar
                        style={{backgroundColor: "#" + getRandomColor()}}>{firstCharAndLastChar(firstname, lastname)}</Avatar>
                    <div className={"ml-2"}>{firstname + " " + lastname}</div>
                </div>)
            }
        }

        let toDisplay = [];

        let classes = this.getSchoolYears(this.state.schoolClassData);

        classes.map((value, key) => {
            let classesInScoolyear = [];

            this.getClassesInSchoolYear(value, this.state.schoolClassData).map(classInfo => {
                classesInScoolyear.push(
                    <Card bg={"light"} key={classInfo.id} className={"m-2 w-25 text-center"}
                          onClick={() => this.openClassInfo(classInfo.id)}>
                        <Card.Header>
                            {isTeacherUndefined(classInfo.TeacherFirstName, classInfo.TeacherSurname)}
                        </Card.Header>
                        <Card.Body>
                            <h3>{classInfo.name}</h3>
                        </Card.Body>
                    </Card>)
            });

            toDisplay.push(<Card key={key} className={"my-2"}> <Card.Header className={"text-center"}><h2>{value}</h2>
            </Card.Header><Card.Body className={"dividerList"}>{classesInScoolyear}</Card.Body></Card>)


        });

        return toDisplay

    };

    /**
     * returns the schoosyears of the handled object
     * @param data
     * @returns {[]}
     */
    getSchoolYears = (data) => {
        let arr = [];

        data.map((v) => {
            if (!arr.includes(v.schoolyear))
                arr.push(v.schoolyear)
        });

        return arr;

    };

    /**
     * getAllClasses from the API
     */
    getAllClasses = () => {
        const axios = require('axios');
        let url = localStorage.getItem('url');
        url += "?action=getAllClasses";

        axios({
            method: 'post',
            url: url,
        }).then((res) => {
            this.setState({schoolClassData: res.data});
        })
    };

    /**
     * get All Specializations from the API
     */
    getAllSpecialization = () => {
        let url = localStorage.getItem('url');
        url += "?action=getAllSpecializations";


        Axios({
            method: 'post',
            url: url,
        }).then((res) => {
            res.data.push({
                id: "-1",
                description: "Alle"
            });
            this.setState({
                data: res.data
            });
        })
    };

    /**
     * getClass by the if
     * @param id
     */
    getClassesByKey = (id) => {

        let url = localStorage.getItem('url');
        url += "?action=getClassBySpecializationsId";

        let params = new URLSearchParams();
        params.append('id', id);

        const axios = require('axios');

        axios({
            method: 'post',
            url: url,
            data: params
        }).then((res) => {
            this.setState({schoolClassData: res.data});
        })
    };

    /**
     * gets  Classes By Specialization for dropdown
     * if -1
     *      gets All Classes
     *  else
     *      gets Classes By SpecializationID
     * @param key
     */
    getKeyFromSelected = (key) => {
        if (key === "-1") {
            this.getAllClasses();
            this.setState({
                selecteditem: this.state.data[this.state.data.length - 1].description
            })
        } else {
            for (let i = 0; i < this.state.data.length; i++) {
                if (key == this.state.data[i].id) {
                    this.setState({
                        selecteditem: this.state.data[i].description
                    })
                }
            }
            this.getClassesByKey(key);
        }

    };

    /**
     * inserts specilization into the dropdown
     * @returns {*}
     */
    insertDataIntoDropdown = () => {
        if (this.state.data != null) {
            let specializations = this.state.data;
            return (
                specializations.map((v) => {
                    return (
                        <DropdownItem key={v.id} eventKey={v.id}>{v.description}</DropdownItem>
                    )
                })
            )
        }
    };

    /**
     * opens the Class that got clicked
     * @param id
     */
    openClassInfo = (id) => {
        this.setState({
            redirect: "./ClassInformation/" + id,
            redirectToLink: true
        })
    };
}


export default Administration;
