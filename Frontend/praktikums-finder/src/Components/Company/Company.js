import 'rc-steps/assets/index.css';
import 'rc-steps/assets/iconfont.css';
import React, {Component} from 'react';
import {Breadcrumb, BreadcrumbItem, Card, Col, Row} from "react-bootstrap";
import {Redirect} from "react-router-dom";


import {FaUserEdit} from 'react-icons/fa';


class company extends Component {
    state = {
        show: false,
        token: "",
        data: null,
        internshipData: null,
        submitted: false,

        redirect: "",
        redirectToLink: false,
        class_id: 0
    };

    componentDidMount() {
        this.getCompanyInformation();
        this.getAllInternshipsbyCompany();
    }

    render() {
        if (this.state.redirectToLink != false) {
            return <Redirect to={this.state.redirectToLink}/>;
        }

        return (
            <div className={'classViewContent bg-light'}>
                <Breadcrumb>
                    <BreadcrumbItem href={'/loggedin/Company/'} active> Unternehmen</BreadcrumbItem>
                </Breadcrumb>

                <Row>
                    <Col className={'m-5'}>
                        Willkommen {this.getCompanyName()}
                    </Col>

                    <Col className={'col-auto m-5'}>
                        <a className={'btn btn-primary'} href={"./CompanyProfile/"}><FaUserEdit/></a>
                    </Col>
                </Row>
                <hr/>
                <Row>
                    <Col>
                        <span>Klassen: </span>

                        <div id={"classes"} className={"d-flex flex-wrap justify-content-center"}>
                            {this.displayInternships()}
                        </div>
                    </Col>
                </Row>
            </div>
        );
    }

    getCompanyName = () => {
        if (this.state.companyData != null) {
            return (
                <h1>{this.state.companyData.name}</h1>
            )
        }
    }

    displayInternships = () => {
        function evaluateState(state) {
            //console.log(state)
            if (state.state_id) {
                //console.log(state.state_id)
                return state.state_id / 6 * 100;
            }
            return 100
        }

        function rateNow(rating, state) {
            if (rating === null && state === "10") {
                return (<span className="badge badge-danger float-right">Rate Now</span>);
            }
        }

        //console.log(this.state.internshipData);
        if (this.state.internshipData != null) {
            let classes = this.state.internshipData;
            //console.log(classes);
            let schoolClassNames = Object.keys(this.state.internshipData);
            return (

                schoolClassNames.map((v) => {
                    //console.log(v)
                    let classname = v.split(",")[1];
                    let schoolyear = v.split(",")[0];
                    let classActive = this.state.internshipData[v].active;
                    return (
                        <Card key={v} className={" w-25  m-4 p-2"}>
                            <h1>
                                <div className="d-flex bd-highlight mb-3 align-items-baseline">
                                    <div className="p-2 bd-highlight"><h1>{classname}</h1></div>
                                    <div className="p-2 bd-highlight text-secondary"><h3>{schoolyear}</h3></div>
                                </div>
                            </h1>
                            {

                                this.state.internshipData[v].internships.map((k, a) => {
                                    if (k.length === 0) {
                                        return null;
                                    } else if (k.tutor_company_id == this.state.userData.id) {
                                        return <div>
                                            <Card className={" m-2 p-2"}
                                                  onClick={() => this.openInternshipStatus(k.internship_id)} key={a}>
                                                <div>
                                                    {k.studentFirstName + " " + k.studentSurname}
                                                    {rateNow(k.rating, k.state_id)}
                                                </div>
                                            </Card>
                                        </div>
                                    }
                                })
                            }
                        </Card>
                    )

                })
            )
        }
    };

    openInternshipStatus = (id) => {
        this.setState({redirectToLink: "./InternshipInformation/" + id})
    }

    getCompanyInformation = () => {
        if (localStorage.getItem('user') != null) {
            let url = localStorage.getItem('url');
            url += "?action=getOwnCompany";
            const axios = require('axios');
            axios({
                method: 'post',
                url: url
            }).then((res) => {
                this.setState({companyData: res.data});
            })
        }
    }

    getAllInternshipsbyCompany = () => {
        if (localStorage.getItem('user') != null) {
            let url = localStorage.getItem('url');
            url += "?action=getInternshipByCompany";

            const axios = require('axios');
            let userData = localStorage.getItem('user');
            userData = JSON.parse(userData);
            this.setState({userData: userData});
            const params = new URLSearchParams();
            params.append("id", userData.companyID);
            axios({
                method: 'post',
                url: url,
                data: params
            }).then((res) => {
                this.setState({
                    internshipData: res.data
                });
            })
        }
    }
}

export default company;
