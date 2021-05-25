import 'rc-steps/assets/index.css';
import 'rc-steps/assets/iconfont.css';
import React, {Component} from 'react';
import {Breadcrumb, BreadcrumbItem, Row, Col, Card, ListGroup, ProgressBar} from "react-bootstrap";
import {Redirect} from "react-router-dom";

class InternshipInformation extends Component {
    state = {
        redirect: "",
        redirectToLink: false,
        class_id: 0,
        internship: null,
        schooclass: null,
        student: null,
        schoolperson: null,
        tutorCompany: null
    };

    componentDidMount() {
        this.getInternshipById(this.props.match.params.id);
    }


    render() {

        if (!(this.state.internship && this.state.schooclass && this.state.student && this.state.schoolperson && this.state.tutorCompany)) {
            return <></>;
        }
            if (this.state.redirectToLink !== false) {
            return <Redirect to={this.state.redirectToLink}/>;
        }
        return (
            <div className={'classViewContent bg-light'}>
                <Breadcrumb>
                    <BreadcrumbItem href={'/loggedin/company/'}>Unternehmen</BreadcrumbItem>
                    <BreadcrumbItem href={'/loggedin/company/InternshipInformation'} active>Praktikums
                        Informationen</BreadcrumbItem>
                </Breadcrumb>

                <Row>
                    <Col className={'m-5'}>
                        <h4 className={"unimportant"}>Praktikums Informationen von</h4>
                        <h1>{this.state.student.firstname + " " + this.state.student.surname}</h1>
                    </Col>



                    <Col className={'col-auto '}>
                        {this.canRate()}
                        <button className={'btn btn-primary m-3'}
                                onClick={() => this.openInternshipWorkDays(this.state.internship.id)}>WorkDays
                        </button>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        {this.viewInternshipData()}
                    </Col>
                </Row>
            </div>
        );
    }


    viewInternshipData = () => {
           return (
                <div className={'m-2 p-2'}>
                    <Card.Header>Praktikumstutor: {this.state.tutorCompany.surname + " " + this.state.tutorCompany.firstname}</Card.Header>
                    <Card.Body>
                        <ListGroup.Item>
                            <Col>
                                <Row> Schüler: {this.state.student.surname + " " + this.state.student.firstname} </Row>
                                <Row>Klasse: {this.state.schooclass.name} </Row>
                            </Col>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            Schultutor: {this.state.schoolperson.surname + " " + this.state.schoolperson.firstname}
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <Col>
                                <Row> Von: {this.state.internship.from}</Row>
                                <Row> Bis: {this.state.internship.to} </Row>
                            </Col>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <ProgressBar now={(this.state.internship.state_id / 10) * 100}
                                         label={(this.state.internship.state_id / 10) * 100 + "%"}/>
                        </ListGroup.Item>
                    </Card.Body>
                </div>
            )

    }
    canRate = () => {
        if (this.state.internship) {
            if (this.state.internship.rating === null && this.state.internship.state_id === "8" && this.state.internship.tutor_company_id === this.state.userData.id) {
                return (
                    <button className={'btn btn-primary m-3'}
                            onClick={() => this.openInternshipRating(this.state.internship.id)}>Rating</button>
                )
            }
        }
    }
    openInternshipRating = (id) => {
        this.setState({redirectToLink: "./InternshipRating/" + id})
    }
    openInternshipWorkDays = (id) => {
        this.setState({redirectToLink: "./InternshipWorkDays/" + id})
    }

    getInternshipById = (id) => {
        const axios = require('axios');

        let url = localStorage.getItem('url');

        let userData = localStorage.getItem('user');
        userData = JSON.parse(userData);
        this.setState({userData: userData});
        const params = new URLSearchParams();
        url = url + '?action=getInternshipInformationById';
        params.append("id", id);
        axios({
            method: 'post',
            url: url,
            data: params
        }).then((res) => {
            if (res.data.error === undefined) {
                console.log(res.data)
                if (res.data.internship && res.data.schoolperson && res.data.student && res.data.schoolperson) {
                    this.setState({
                        internship: res.data.internship,
                        schooclass: res.data.schooclass,
                        student: res.data.student,
                        schoolperson: res.data.schoolperson,
                        tutorCompany: res.data.tutorCompany
                    });
                }
                console.log(res.data);
                this.setState({loadedData: true});
            } else {
                console.error("ERROR LOADING DATA")
            }

        })
    }
}


export default InternshipInformation;
