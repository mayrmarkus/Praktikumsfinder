import 'rc-steps/assets/index.css';
import 'rc-steps/assets/iconfont.css';
import React, {Component} from 'react';
import {Breadcrumb, BreadcrumbItem, Row, Col, Card, ButtonToolbar, DropdownButton, DropdownItem} from "react-bootstrap";
import Avatar from "@material-ui/core/Avatar";

class AllCompanies extends Component {
    state = {
        redirect: "",
        redirectToLink: false,
        class_id: 0,
        allSchoolpersonsData: null,
        selecteditem: 'Alle'
    };

    /**
     * calling get all Specializations and all Schoolpersons from API when component did mount
     */
    componentDidMount() {
        this.getAllSchoolperson();
        this.getAllSpecialization();
    }

    render() {
        return (
            <div className={'adminViewContent bg-light'}>
                <Breadcrumb>
                    <BreadcrumbItem href={'/loggedin/'}>Administration</BreadcrumbItem>
                </Breadcrumb>

                <Row>
                    <Col className={'m-5'}>
                        <h1>Alle Lehrer / Klassenlehrer</h1>
                    </Col>
                </Row>
                <Row>
                    <Col><label>Filtern nach: </label>
                        <ButtonToolbar>
                            {[DropdownButton].map((DropdownType, idx) => (
                                <DropdownType
                                    className="warning"
                                    title={"Fachrichtung: " + this.state.selecteditem}
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
                            <div id={"companies"} className={"noDividerList"}>
                                {this.displaySchoolpersons()}
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>
        );
    }

    /**
     * gets  Schoolpersons By specializations for dropdown
     * if -1
     *      gets All Schoolpersons
     *  else
     *      gets Schoolpersons By SpecializationID
     * @param key
     */
    getKeyFromSelected = (key) => {
        console.log(this.state)
        if (key === "-1") {
            this.getAllSchoolperson();
            this.setState({
                selecteditem: this.state.specializations[this.state.specializations.length - 1].description
            })
        } else {
            this.getSchoolpersonsByKey(key);
            for (let i = 0; i < this.state.specializations.length; i++) {
                if (key == this.state.specializations[i].id) {
                    this.setState({
                        selecteditem: this.state.specializations[i].description
                    })
                }
            }
        }

    };

    /**
     * gets Schoolpersons by SpecializationsID
     * @param id
     */
    getSchoolpersonsByKey = (id) => {

        let url = localStorage.getItem('url');
        url += "?action=getSchoolpersonBySpecializations";

        let params = new URLSearchParams();
        params.append('id', id);

        const axios = require('axios');

        axios({
            method: 'post',
            url: url,
            data: params
        }).then((res) => {
            this.setState({allSchoolpersonsData: res.data});
        })

    };

    /**
     * gets All Specializations from API
     */
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
                specializations: res.data
            });
        })

    };

    /**
     * gets all Schoolpersons from API
     */
    getAllSchoolperson = () => {

        let url = localStorage.getItem('url');

        url += "?action=getAllSchoolpersons";

        const axios = require('axios');

        axios({
            method: 'post',
            url: url,
        }).then((res) => {
            console.log(res.data)
            this.setState({allSchoolpersonsData: res.data});
        })

    };

    /**
     * creates card with avatars for each Schoolpersons
     * @returns {[]|*}
     */
    displaySchoolpersons = () => {
        if (this.state.allSchoolpersonsData != null) {

            /**
             * creates a hashnumber by a input String
             *  if  string != null
             *      returns a Hash for Mustermann
             *  else
             *      returns a Hash for provided String
             * @param str
             * @returns {number}
             */
            function hashCode(str) {
                var hash = 0;// java String#hashCode
                var i = 0;
                if (!str) {
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

            /**
             * converts a Integer into a RGB-Value(String)
             * @param i
             * @returns {string}
             */
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


            /**
             * gets first of firstname and FirstChar of lastname
             */
            function firstCharAndLastChar(firstname, lastname) {
                let firstChar = (firstname.substring(0, 1)).toUpperCase();
                let lastChar = (lastname.substring(0, 1)).toUpperCase();
                return firstChar + lastChar;
            }

            if (!this.state.allSchoolpersonsData) {
                return <div/>
            }

            let schoolpersons = [];

            this.state.allSchoolpersonsData.map(c => {
                console.log(c)
                schoolpersons.push(
                    <Card bg={"light"}
                          className={"m-3 w-25 text-center"} /*onClick={() => this.openClassInfo(classInfo.id)}*/>
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
            return schoolpersons
        }
    };

    /**
     * inserts specializations into the dropdown
     * @returns {*[]}
     */
    insertDataIntoDropdown = () => {
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

export default AllCompanies;