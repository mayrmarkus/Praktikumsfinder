import 'rc-steps/assets/index.css';
import 'rc-steps/assets/iconfont.css';
import React, {Component} from 'react';
import './ClassOverview.css'
import {Breadcrumb, BreadcrumbItem, Button, Card, Col, Modal, ProgressBar, Row} from "react-bootstrap";
import {Redirect} from "react-router-dom";
import Alert from "@material-ui/lab/Alert";
import {Snackbar} from "@material-ui/core";


class ClassOverview extends Component {
    state = {
        show: false,
        token: "",
        data: null,
        submitted: false,
        redirect: false,
        redirectToLink: "",
        newPraktikum: "",
        errorIsOpen: false,
        message: "",
        message_color: ""
    };

    constructor(props, context) {
        super(props, context);

        if (this.props.currentUser != null)
            this.getAllInternshipsByStudent()
    }

    /**
     * sends token to api when true then gives back class when false error;
     * @param id
     */
    joinClassAjax = (classId) => {
        let url = localStorage.getItem('url');

        url += "?action=joinClass&classId=" + classId;
        const axios = require('axios');

        axios({
            method: 'post',
            url
        }).then((res) => {
            if (res.data.message !== "Token valid") {
                this.setState({
                    errorIsOpen: true,
                    message: res.data.message,
                    message_color: "error"
                })
            } else {
                this.setState({
                    errorIsOpen: true,
                    message: res.data.message,
                    message_color: "success"
                })
                this.getAllInternshipsByStudent();

            }
        })

    };

    getAllInternshipsByStudent = () => {
        let url = localStorage.getItem('url');
        url += "?action=getOwnInternship";

        const axios = require('axios');

        axios({
            method: 'post',
            url: url,
        }).then((res) => {
            this.setState({data: res.data});
        })

    };
    handleCloseSnackbar = () => {
        this.setState({
            errorIsOpen: false
        })
    };

    render() {
        if (this.state.redirect !== false) {
            return <Redirect to={this.state.redirectToLink}/>;
        }

        //------- Modal ---------
        const setShow = (input) => {
            this.setState({
                show: input
            });
        };
        const handleClose = () => {
            setShow(false);
            let entrytoken = document.getElementById("token").value;
            if (entrytoken !== "") {
                this.setState({
                    token: entrytoken
                });
                this.joinClassAjax(entrytoken);
            }
        };
        const handleShow = () => {
            setShow(true);
        };


        return (
            <div className={'classViewContent bg-light'}>

                <Breadcrumb>
                    <BreadcrumbItem href={'/loggedin/'} active>Klassenansicht</BreadcrumbItem>
                </Breadcrumb>
                <Row>
                    <Col className={'m-5'}>
                        <h1>Klassenübersicht</h1>
                    </Col>
                    <Col className={'col-auto'}>
                        <Button onClick={handleShow}>Klasse hinzufügen</Button>
                    </Col>
                </Row>
                <Snackbar open={this.state.errorIsOpen} autoHideDuration={10000} onClose={() => {
                    this.setState({errorIsOpen: false})
                }}>
                    <Alert severity={this.state.message_color} onClose={this.handleCloseSnackbar}>
                        {this.state.message}
                    </Alert>
                </Snackbar>
                <Row>
                    <Col>
                        <div className={'p-1'}>
                            <Modal show={this.state.show} onHide={handleClose}>
                                <Modal.Header closeButton>
                                    <Modal.Title>Bitte geben Sie den Klassencode ein</Modal.Title>
                                </Modal.Header>
                                <Modal.Body className={""}>
                                    <input placeholder={'Token'} id={"token"} name={"token"}
                                           className={" form-control d-flex justify-content-center align-items-center"}/>
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button className="secondary" onClick={handleClose}>
                                        Schließen
                                    </Button>
                                    <Button className="primary" onClick={handleClose}>
                                        Speichern und Schließen
                                    </Button>
                                </Modal.Footer>
                            </Modal>
                            <div id={"internships"}>
                                {
                                    this.displayData()
                                }
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>
        );
    }


    displayData = () => {
        let that = this;

        //adds a button when passed 1
        function addInternship(a, schoolclass) {
            if (a === "1") {
                return <Button title={"Praktikum hinzufügen"}
                               onClick={() => that.createNewInternship(schoolclass)}>+</Button>
            }
        }

        function evaluateState(state) {
            if (state.state_id) {
                return state.state_id / 6 * 100;
            }
            return 100
        }

        if (this.state.data != null) {

            let schoolClassNames = Object.keys(this.state.data);

            return (

                schoolClassNames.map((v) => {

                    let classname = v.split(",")[1];
                    let schoolyear = v.split(",")[0];
                    let classActive = this.state.data[v].active;
                    return (
                        <Card key={v} className={"m-4 p-2"}>
                            <h1>
                                <div className="d-flex bd-highlight mb-3 align-items-baseline">
                                    <div className="p-2 bd-highlight"><h1>{classname}</h1></div>
                                    <div className="p-2 bd-highlight text-secondary"><h3>{schoolyear}</h3></div>
                                    <div className="ml-auto p-2 bd-highlight">
                                        {addInternship(classActive, this.state.data[v])}
                                    </div>
                                </div>
                            </h1>

                            {

                                this.state.data[v].internships.map((k, a) => {
                                    if (k.length === 0) {
                                        return null;
                                    } else {
                                        return <Card onClick={() => this.openInternshipSteps(k.internship_id)} key={a}
                                                     className={'m-2 p-2'}>{k.companyname}
                                            <ProgressBar className={'m-3'} style={{color: "black"}} animated={false}
                                                         variant={k.state_color}
                                                         now={evaluateState(k)}
                                                         label={k.state_name}>
                                            </ProgressBar>
                                        </Card>
                                    }

                                })
                            }
                        </Card>
                    )

                })
            )

        }
    };


    openInternshipSteps = (id) => {
        this.setState({
            redirectToLink: "./internshipSteps/" + id,
            redirect: true
        })
        console.log(this.state)
    }

    createNewInternship = (currentClass) => {
        let url = localStorage.getItem('url');


        url += "?action=makeInternship";

        let params = new URLSearchParams();
        console.log(currentClass.id);
        params.append('schoolclass_id', currentClass.id);

        const axios = require('axios');

        axios({
            method: 'post',
            url: url,
            data: params
        }).then((res) => {
            console.log(res)
            this.setState({newPraktikum: res.data.id});
            console.log(res.data)
            this.setState({
                redirectToLink: "./internshipSteps/" + this.state.newPraktikum,
                redirect: true
            })
        })


    }


}


export default ClassOverview;