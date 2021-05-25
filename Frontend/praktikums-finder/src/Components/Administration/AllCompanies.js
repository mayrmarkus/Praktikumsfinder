import 'rc-steps/assets/index.css';
import 'rc-steps/assets/iconfont.css';
import React, {Component} from 'react';
import {
    Breadcrumb,
    BreadcrumbItem,
    Row,
    Col,
    Card,
    ButtonToolbar,
    DropdownButton,
    DropdownItem
} from "react-bootstrap";
import Avatar from "@material-ui/core/Avatar";
import {Redirect} from "react-router-dom";

class AllCompanies extends Component {
    state = {
        redirect: "",
        redirectToLink: false,
        class_id: 0,
        allCompaniesData: null,
        selecteditem: 'Alle',
        selectedItemId: '-1',
        selectedSpecialization: 'Alle',
        selectedSpecializationId: '-1',
        error: false
    };

    componentDidMount() {
        this.getAllCompanies();
        this.getAllDistricts();
        this.getAllSpecializations();

    }

    render() {
        if (this.state.redirectToLink !== false) {
            return <Redirect to={this.state.redirect}/>;
        }
        return (
            <div className={'w-100 adminViewContent'}>

                <Breadcrumb>
                    <BreadcrumbItem href={'/loggedin/Administration'} active>Administration</BreadcrumbItem>
                </Breadcrumb>

                <Row>
                    <Col className={'m-5'}>
                        <h1>Alle Unternehmen</h1>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <label>Filtern Nach</label>
                        <ButtonToolbar>
                            {[DropdownButton].map((DropdownType, idx) => (
                                <DropdownType className="warning" title={"Bezirk: " + this.state.selecteditem}
                                              id={`dropdown-button-drop-${idx + "district"}`} key={idx + "district"}
                                              onSelect={this.getKeyFromSelected}>
                                    {this.displayData()}
                                </DropdownType>
                            ))}
                        </ButtonToolbar>

                        <ButtonToolbar>
                            {[DropdownButton].map((DropdownType, idx) => (
                                <DropdownType className="warning"
                                              title={"Fachrichtung: " + this.state.selectedSpecialization}
                                              id={`dropdown-button-drop-${idx + "spec"}`} key={idx + "spec"}
                                              onSelect={this.getKeyFromSelectedSpecialization}>
                                    {this.displaySpecialization()}
                                </DropdownType>
                            ))}
                        </ButtonToolbar>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <div className={'p-1'}>
                            <div className={"noDividerList"}>
                                {this.displayCompanies()}
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>
        );
    }

    getAllCompanies = () => {

        let url = localStorage.getItem('url');

        url += "?action=getAllCompanies";

        const axios = require('axios');

        axios({
            method: 'post',
            url: url,
        }).then((res) => {
            this.setState({allCompaniesData: res.data});
        })

    };
    getKeyFromSelected = (key) => {
        //console.log(key)
        if (key === "-1") {
            this.getAllCompanies();
            this.setState({
                selecteditem: this.state.districts[this.state.districts.length - 1].name,
                selectedItemId: -1
            })
        } else {

            for (let i = 0; i < this.state.districts.length; i++) {
                if (key == this.state.districts[i].id) {
                    this.setState({
                        selecteditem: this.state.districts[i].name,
                        selectedItemId: this.state.districts[i].id
                    })
                    this.getCompanyByKey(this.state.districts[i].id, this.state.selectedSpecializationId);
                }
            }
        }
    };

    getKeyFromSelectedSpecialization = (key) => {
        //console.log(key)
        if (key === "-1") {
            this.getAllCompanies();
            this.setState({
                selectedSpecialization: this.state.specializations[this.state.specializations.length - 1].description,
                selectedSpecializationId: -1
            })
        } else {
            for (let i = 0; i < this.state.specializations.length; i++) {
                if (key == this.state.specializations[i].id) {
                    this.setState({
                        selectedSpecialization: this.state.specializations[i].description,
                        selectedSpecializationId: this.state.specializations[i].id
                    })
                    this.getCompanyByKey(this.state.selectedItemId, this.state.specializations[i].id);
                }
            }


        }


    };
    getCompanyByKey = (districtId, specializationsId) => {
        //console.log("District:" + districtId, "SPEC: " + specializationsId);
        let url = localStorage.getItem('url');
        url += "?action=getCompanyByDistrictAndSpecialization";
        let params = new URLSearchParams();
        if (districtId != -1) {
            console.log("District: ", districtId)
            params.append('districtId', districtId);
        }
        if (specializationsId != -1) {
            console.log("specializations_id: ", specializationsId)
            params.append('specializations_id', specializationsId);
        }


        const axios = require('axios');

        axios({
            method: 'post',
            url: url,
            data: params
        }).then((res) => {
            if (res.data.error) {
                this.setState({error: true})
            } else {
                this.setState({allCompaniesData: res.data});
            }
        })

    };


    getAllDistricts = () => {
        let url = localStorage.getItem('url');
        url += "?action=getAllDistricts";
        const axios = require('axios');
        axios({
            method: 'post',
            url: url,
        }).then((res) => {
            console.log(res.data)
            res.data.push({
                id: "-1",
                name: "Alle"
            });
            this.setState({
                districts: res.data
            });
        })

    };

    getAllSpecializations = () => {
        let url = localStorage.getItem('url');
        url += "?action=getAllSpecializations";
        const axios = require('axios');
        axios({
            method: 'post',
            url: url,
        }).then((res) => {
            console.log(res.data)
            res.data.push({
                id: "-1",
                description: "Alle"
            });
            this.setState({
                specializations: res.data
            });
        })
    };
    displayCompanies = () => {
        if (this.state.allCompaniesData != null && this.state.error != true) {

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
            function firstChar(companyname) {
                if (companyname != null) {
                    let firstChar = (companyname.substring(0, 1)).toUpperCase();
                    return firstChar;
                } else {
                    return "M";
                }

            }

            if (!this.state.allCompaniesData) {
                return <div/>
            }

            let company = [];

            this.state.allCompaniesData.map(c => {
                company.push(
                    <Card bg={"light"} key={c.id}
                          className={"m-3 w-25 text-center"} onClick={() => this.openCompanyInfo(c.id)}>
                        <Card.Header>
                            <div className={"d-flex align-items-baseline"}>
                                <Avatar
                                    style={{backgroundColor: "#" + getRandomColor()}}>{firstChar(c.name)}</Avatar>
                                <div className={"ml-2"}>{c.name}</div>
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <h6>{c.email}</h6>
                        </Card.Body>
                    </Card>)
            });
            return company
        }
    };

    openCompanyInfo = (id) => {
        this.setState({
            redirect: "./CompanyInformation/" + id,
            redirectToLink: true
        })


    };

    displayData = () => {
        if (this.state.districts) {
            let districts = this.state.districts;
            return (
                districts.map((v) => {
                    return (
                        <DropdownItem key={v.id} eventKey={v.id}>{v.name}</DropdownItem>
                    )
                })
            )

        }
    };

    displaySpecialization = () => {
        if (this.state.specializations) {
            let specializations = this.state.specializations;
            return (
                specializations.map((v) => {
                    return (
                        <DropdownItem key={v.id} eventKey={v.id}>{v.description}</DropdownItem>
                    )
                })
            )
        }
    };

}

export default AllCompanies;
