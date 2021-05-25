import React, {Component} from 'react';
import {Link} from "react-router-dom";
import './login.css';
import logo from "../../img/download.png";
import {Button, Col, Modal, Row} from "react-bootstrap";
import {Snackbar} from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import background from "../../img/backgrounds/login.jpeg"



class Register extends Component {
    state = {
        firstname: '',
        surname: '',
        email: '',
        password: '',
        passwordRpt: '',
        token: '',
        phonenumber:'',
        show: false,
        isTutor: false,
        role:'student',
        errorIsOpen:false
    };

    textChange = (e) => {
        this.setState({[e.target.name]: e.target.value})

    };


    setShow = (input) => {
        this.setState({
            show: input
        });
        console.log(this.state)
    }


    handleClose = () => {
        this.setShow(false);
    };
    handleShow = () => {
        this.setShow(true);
    };
    handleTutor = () => {

        this.setState({
            isTutor: true,
            role :'company'
        })
    };
    handleStudent = () => {
        this.setState({
            isTutor: false,
            role :'student'
        })
    };
    handleClose = () => {
        this.setState({
            errorIsOpen: false
        })
    };

    render() {


        return (
            <div>
                <div style={{
                    height: "100vh",
                    width: "100vw",
                    backgroundImage: `url(${background})`,
                    backgroundSize: "cover"
                }}
                     className={"d-flex main-content flex-column align-items-center justify-content-around"}>

                    <div className={"bg-dark w-50 h-50 text-white"}>
                        {//header
                        }
                        <div className={"h-25 p-3 bg-white d-flex align-items-center justify-content-center"}>
                            <img className={"h-100"} src={logo}/>

                        </div>
                        <div className={"p-4 d-flex flex-wrap flex-row w-100 justify-content-around align-items-center"}>
                            <h2 className={"text-white"}>Registrieren</h2>
                            <Snackbar open={this.state.errorIsOpen} autoHideDuration={10000} onClose={() => {
                                this.setState({errorIsOpen: false});
                            }}>

                                <Alert severity={'error'} onClose={this.handleClose}>
                                    Passwörter stimmen nicht überein!
                                </Alert>
                            </Snackbar>
                            <div className={"w-100 register d-flex justify-content-center "}>

                                <form onSubmit={this.register} className={'d-flex flex-column'}>

                                    <Row>
                                        <Col>
                                            <div className={'button-group p-0'}>
                                                <input
                                                    name={'firstname'}
                                                    id={'firstname'}
                                                    placeholder={'Vorname'}
                                                    value={this.state.firstname}
                                                    className={'form-control'}
                                                    onChange={this.textChange}
                                                    required
                                                />
                                            </div>
                                    </Col>

                                    <Col>
                                        <div className={'button-group'}>
                                            <input
                                                name={'surname'}
                                                id={'surname'}
                                                placeholder={'Nachname'}
                                                value={this.state.surname}
                                                className={'form-control'}
                                                onChange={this.textChange}
                                                required
                                            />
                                        </div>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <div className={'button-group mt-2'}>
                                            <input name={'email'}
                                                   id={'email'}
                                                   placeholder={'E-Mail'}
                                                   type={'email'}
                                                   className={'form-control'}
                                                   value={this.state.email}
                                                   onChange={this.textChange}
                                                   required
                                            />
                                        </div>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <div className={"button-group mt-2"}>
                                            <input
                                                className={'form-control'}
                                                name={'password'}
                                                id={'password'}
                                                type={'password'}
                                                placeholder={'Passwort'}
                                                value={this.state.password}
                                                onChange={this.textChange}
                                                required
                                            />
                                        </div>
                                    </Col>
                                    <Col>

                                        <div className={"button-group mt-2"}>
                                            <input
                                                className={'form-control'}
                                                name={'passwordRpt'}
                                                id={'passwordRpt'}
                                                type={'password'}
                                                placeholder={'Passwort wiederholen'}
                                                value={this.state.passwordRpt}
                                                onChange={this.textChange}
                                                required
                                            />
                                        </div>
                                    </Col>

                                </Row>
                                <Row>
                                    <Col><p id={'errorMsg'}/></Col>
                                </Row>

                                <Row>
                                    <Col> <input className={"btn btn-primary"} type={'submit'} value={'Registrieren'}/></Col>
                                </Row>

                                    <p>Schon einen Account? Hier zum <Link style={{color: "white", textDecoration: 'none'}} to="/login">Login</Link>
                                    </p>

                            </form>
                            <Modal show={this.state.show} onHide={this.handleClose}>
                                <Modal.Header closeButton>
                                    <Modal.Title>Bitte verifiziere deine Email!</Modal.Title>
                                </Modal.Header>
                                <Modal.Body className={""}>
                                    <p id={'emailp'}></p>
                                    <a className={'btn btn-outline-primary'}
                                       href={"https://www." + this.state.email.split('@')[1]} target="_blank"
                                       rel="noopener noreferrer">Zur E-Mail</a>
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button variant="secondary" onClick={this.handleClose}>
                                        Schließen
                                    </Button>
                                </Modal.Footer>
                            </Modal>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        );
    }


    register = (e) => {

        e.preventDefault();
        if (this.state.password === this.state.passwordRpt) {


            const axios = require('axios');

            const params = new URLSearchParams();
            params.append('firstname', this.state.firstname);
            params.append('surname', this.state.surname);
            params.append('email', this.state.email);
            params.append('password', this.state.password);
            params.append('role', this.state.role);


            let url = localStorage.getItem('url');
            axios({
                method: 'post',
                url: url + '/?action=register',
                data: params
            }).then((res) => {
                if (res.data.error !== undefined) {
                    document.getElementById("errorMsg").innerText = res.data.message;
                } else {
                    this.handleShow();
                    document.getElementById("emailp").innerText = "Deine E-Mail: " + this.state.email;
                }

            })


        }else{
            this.setState({
                errorIsOpen:true
            })
        }
    }

}

export default Register;
