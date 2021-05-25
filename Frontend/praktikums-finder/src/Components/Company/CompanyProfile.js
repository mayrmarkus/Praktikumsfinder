import 'rc-steps/assets/index.css';
import 'rc-steps/assets/iconfont.css';
import React, {Component} from 'react';

import {Breadcrumb, BreadcrumbItem, Form, Button, Tab, Tabs} from "react-bootstrap";

class CompanyProfile extends Component {

    state = {
        redirect: "",
        redirectToLink: false,
        class_id: 0,
        key: 'home'
    };


    componentDidMount() {
        this.getTutorCompanyInfo();
        this.getCompanyInformation();
    }

    render() {
        return (
            <div className={'classViewContent '}>
                <Breadcrumb>
                    <BreadcrumbItem href={'/loggedin/Company'}>Unternehmen</BreadcrumbItem>
                    <BreadcrumbItem href={'loggedin/Company/CompanyProfile'} active>Profil</BreadcrumbItem>
                </Breadcrumb>
                {this.displayCompanyInfo()}
            </div>
        );
    }

    onChangeCompany = (e) => {
        let company = this.state.companyData;
        company[([e.target.name])] = e.target.value;
        this.setState({
            companyData: company
        });
    }

    onChangeTutor = (e) => {
        let tutor = this.state.tutorData;
        tutor[([e.target.name])] = e.target.value;
        this.setState({
            tutorData: tutor
        });
    }

    handleSubmit = event => {
        event.preventDefault();
        let url = localStorage.getItem('url');
        url += "?action=updateTCInfo";
        let company = this.state.companyData;
        let tutor = this.state.tutorData;

        let params = new URLSearchParams();
        params.append('tutor_id', tutor.id);
        params.append('company_id', company.id);
        params.append('firstname', tutor.firstname);
        params.append('surname', tutor.surname);
        params.append('t_email', tutor.email);
        params.append('address', company.address);
        params.append('c_email', company.email);
        params.append('companyname', company.name);
        params.append('phonenumber', company.phonenumber);


        const axios = require('axios');

        axios({
            method: 'post',
            url: url,
            data: params
        }).then((res) => {
        })
        this.forceUpdate();
        this.handleSelect("home")
    }

    handleSelect = (input_key) => {
        this.setState({
            key: input_key
        });
    }

    displayCompanyInfo = () => {

        if (this.state.companyData !== undefined && this.state.tutorData !== undefined) {
            let company = this.state.companyData;
            let tutor = this.state.tutorData;
            return (<div className={"well"}>
                    <Tabs activeKey={this.state.key} onSelect={this.handleSelect}>
                        <Tab eventKey="home" title="Home">

                            <Form id={"tab"}>
                                <Form.Group controlId="Username" className={"mt-3"}>
                                    <Form.Label>Namen des Unternehmens</Form.Label>
                                    <Form.Control type={"text"} value={company.name} disabled/>
                                </Form.Group>
                                <Form.Group controlId="Firstname">
                                    <Form.Label>Vorname</Form.Label>
                                    <Form.Control type={"text"} value={tutor.firstname} disabled/>
                                </Form.Group>
                                <Form.Group controlId="Surname">
                                    <Form.Label>Nachname</Form.Label>
                                    <Form.Control type={"text"} value={tutor.surname} disabled/>
                                </Form.Group>
                                <Form.Group controlId="t_email">
                                    <Form.Label>Email des Tutors</Form.Label>
                                    <Form.Control type={"text"} value={tutor.email} disabled/>
                                </Form.Group>
                                <Form.Group controlId="c_email">
                                    <Form.Label>Email des Unternehmens</Form.Label>
                                    <Form.Control type={"email"} value={company.email} disabled/>
                                </Form.Group>
                                <Form.Group controlId="phonenumber">
                                    <Form.Label>Telefonnummer</Form.Label>
                                    <Form.Control type={"tel"} disabled value={company.phonenumber}>
                                    </Form.Control>
                                </Form.Group>
                                <Form.Group controlId="address">
                                    <Form.Label>Adresse</Form.Label>
                                    <Form.Control type={"text"} disabled value={company.address}>
                                    </Form.Control>
                                </Form.Group>
                            </Form>
                        </Tab>
                        <Tab eventKey={"edit"} title={"Edit"}>
                            <Form id={"tab"} onSubmit={this.handleSubmit} ref="form" >
                                <Form.Group controlId="formUsername" className={"mt-3"}>
                                    <Form.Label>Namen des Unternehmens</Form.Label>
                                    <Form.Control type={"text"} defaultValue={company.name} name={"name"}
                                                  onChange={this.onChangeCompany} required/>
                                </Form.Group>
                                <Form.Group controlId="formFirstname">
                                    <Form.Label>Vorname</Form.Label>
                                    <Form.Control type={"text"} defaultValue={tutor.firstname} name={"firstname"}
                                                  onChange={this.onChangeTutor} required/>
                                </Form.Group>
                                <Form.Group controlId="formSurname">
                                    <Form.Label>Nachname</Form.Label>
                                    <Form.Control type={"text"} defaultValue={tutor.surname} name={"surname"}
                                                  onChange={this.onChangeTutor} required/>
                                </Form.Group>
                                <Form.Group controlId="formSurname">
                                    <Form.Label>Email des Tutors</Form.Label>
                                    <Form.Control type={"text"} defaultValue={tutor.email} name={"email"}
                                                  onChange={this.onChangeTutor} required/>
                                </Form.Group>
                                <Form.Group controlId="formEmail">
                                    <Form.Label>Email des Unternehmens</Form.Label>
                                    <Form.Control type={"email"} defaultValue={company.email} name={"email"}
                                                  onChange={this.onChangeCompany} required/>
                                </Form.Group>
                                <Form.Group controlId="formPhonenumber">
                                    <Form.Label>Telefonnummer</Form.Label>
                                    <Form.Control type={"tel"} defaultValue={company.phonenumber} name={"phonenumber"}
                                                  onChange={this.onChangeCompany} pattern={"[- \s\./0-9]{9,12}"}
                                                  title={'z.B 0471 123456 oder 333 487 9809'} required>
                                    </Form.Control>
                                </Form.Group>
                                <Form.Group controlId="formAddress">
                                    <Form.Label>Adresse</Form.Label>
                                    <Form.Control type={"text"} defaultValue={company.address} name={"address"}
                                                  onChange={this.onChangeCompany} required>
                                    </Form.Control>
                                </Form.Group>
                                <Button className={"m-2"} variant="success" type="submit">
                                    Abschicken
                                </Button>
                            </Form>
                        </Tab>
                    </Tabs>
                </div>
            )
        }
    }

    getCompanyInformation = () => {

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

    getTutorCompanyInfo = () => {
        if (localStorage.getItem('user') != null) {
            let url = localStorage.getItem('url');
            url += "?action=getEncryptedTokenData";
            const axios = require('axios');
            axios({
                method: 'post',
                url: url
            }).then((res) => {
                this.setState({tutorData: res.data});
            })
        }
    }
}


export default CompanyProfile;