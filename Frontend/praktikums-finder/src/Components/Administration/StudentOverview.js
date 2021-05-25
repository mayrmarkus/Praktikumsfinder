import 'rc-steps/assets/index.css';
import 'rc-steps/assets/iconfont.css';
import React, {Component} from 'react';
import {Breadcrumb, BreadcrumbItem, Row, Col, Card, ButtonToolbar, DropdownButton, DropdownItem} from "react-bootstrap";
import Avatar from "@material-ui/core/Avatar";
import {Redirect} from "react-router-dom";

class StudentOverview extends Component {
    state = {
        redirect: "",
        redirectToLink: false,
        class_id: 0,
        allSchoolpersonsData: null,
    };
    componentDidMount() {
        this.getAllStudents();
        this.getAllSpecialization();
    }

    render() {
        if (this.state.redirectToLink !== false) {
            return <Redirect to={this.state.redirect}/>;
        }
        return(
            <div className={'adminViewContent bg-light'}>
                <Breadcrumb>
                    <BreadcrumbItem href={'/loggedin/'}>Administration</BreadcrumbItem>
                </Breadcrumb>

                <Row>
                    <Col className={'m-5'}>
                        <h1>Alle Schüler</h1>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <label>Filtern Nach: </label>
                        <ButtonToolbar>
                            {[DropdownButton].map((DropdownType, idx) => (
                                <DropdownType
                                    className="warning"
                                    title={"Fachrichtung"}
                                    id={`dropdown-button-drop-${idx}`}
                                    key={idx}
                                    onSelect={this.getKeyFromSelected}
                                >
                                    {this.displayData()}
                                </DropdownType>
                            ))}
                        </ButtonToolbar>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <div className={'p-1'}>
                            <div id={"students"} className={"noDividerList"}>
                                {this.displayStudents()}
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>
        );
    }
    getKeyFromSelected = (key) => {
        if(key === "-1"){
            this.getAllStudents();
        }else{
            this.getStudentByKey(key);
        }

    };
    getStudentByKey = (id) => {

            let url = localStorage.getItem('url');
            url += "?action=getStudentbySpecializations";

            let params = new URLSearchParams();
            params.append('id', id);

            const axios = require('axios');

            axios({
                method: 'post',
                url: url,
                data: params
            }).then((res) => {
                this.setState({allStudentsData: res.data});
            })

    };
    getAllSpecialization = () => {
        let url = localStorage.getItem('url');
        url += "?action=getAllSpecializations";

        const axios = require('axios');

        axios({
            method: 'post',
            url: url,
        }).then((res) => {
            res.data.push({
                id: "-1",
                description: "Alle"
            });
            this.setState({
                specializations: res.data});
        })

    };
    getAllStudents = () =>{

        let url = localStorage.getItem('url');

        url += "?action=getAllStudents";

        const axios = require('axios');

        axios({
            method: 'post',
            url: url,
        }).then((res) => {
            console.log(res.data)
            this.setState({allStudentsData: res.data});
        })

    };
    openStudentInfo = (id) => {
            this.setState({
                redirect: "./StudentInformation/" + id,
                redirectToLink: true
            })


    };
    displayStudents = () => {
        if(this.state.allStudentsData != null){

            function hashCode(str) {
                var hash = 0;// java String#hashCode
                var i;
                if (str != null) {
                    for (i = 0; i < str.length; i++) {
                        hash = str.charCodeAt(i) + ((hash << 5) - hash);
                    }
                    return hash;
                } else {
                    let str = "Mustermann";
                    for (i = 0; i < str.length; i++) {
                        hash = str.charCodeAt(i) + ((hash << 5) - hash);
                    }
                    return hash;
                }
            }

            function intToRGB(i) {
                var c = (i & 0x00FFFFFF)
                    .toString(16)
                    .toUpperCase();

                return "00000".substring(0, 6 - c.length) + c;
            }

            function rgbToHex(rgb) {
                var hex = Number(rgb).toString(16);
                if (hex.length < 2) {
                    hex = "0" + hex;
                }
                return hex
            }

            function getRandomColor() {
                var colors = []

                colors.push(rgbToHex(255) + "" + rgbToHex(203) + "" + rgbToHex(0))
                colors.push(rgbToHex(0) + "" + rgbToHex(48) + "" + rgbToHex(80))

                return colors[Math.floor(Math.random() * colors.length)];
            }


            //gets first of firstname and FirstChar of lastname
            function firstCharAndLastChar(firstname, lastname) {
                let firstChar = (firstname.substring(0, 1)).toUpperCase();
                let lastChar = (lastname.substring(0, 1)).toUpperCase();
                return firstChar + lastChar;
            }

            if (!this.state.allStudentsData) {
                return <div/>
            }

            let students = [];
            this.state.allStudentsData.map(c => {
                students.push(
                    <Card bg={"light"} className={"m-3 w-25 text-center"}  onClick={() => this.openStudentInfo(c.id)}>
                        <Card.Header>
                            <div className={"d-flex align-items-baseline"}>
                                <Avatar
                                    style={{backgroundColor: "#" + getRandomColor()}}>{firstCharAndLastChar(c.firstname, c.surname)}</Avatar>
                                <div className={"ml-2"}>{c.firstname + " " + c.surname}</div>
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <h6>{c.email}</h6>
                        </Card.Body>
                    </Card>)
            });
            return students
        }
    };

    displayData = () => {
        if (this.state.specializations != null) {
            let specializations = this.state.specializations;
            return (
                specializations.map((v) => {
                    return (
                        <DropdownItem eventKey={v.id}>{v.description}</DropdownItem>
                    )


                })
            )

        }
    };

}

export default StudentOverview;