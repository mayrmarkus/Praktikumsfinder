import 'rc-steps/assets/index.css';
import 'rc-steps/assets/iconfont.css';
import React, {Component} from 'react';
import Select from 'react-select';
import {Breadcrumb, BreadcrumbItem, Button, Col, Form, Row} from 'react-bootstrap';
import {Redirect} from "react-router-dom";
import Alert from "@material-ui/lab/Alert";
import {Snackbar} from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import TextField from "@material-ui/core/TextField";
import DialogActions from "@material-ui/core/DialogActions";


class InsertNewClass extends Component {
    state = {
        selectedTeacher: "",
        selectedSpecialization: "",
        generateToken: "",
        className: "",
        schoolyear: "",
        teachers: [],
        specializations: [],
        redirect: "",
        redirectToLink: false,
        errorIsOpen: false,
        dialogIsOpen: false,
        new_Specialization: "",
        errorMessage: 'Bitte kontrollieren sie ob alle Felder ausgefüllt sind!'
    };


    componentDidMount() {
        this.getAllTeachers();
        this.getAllSpecializations();
        this.generateToken();
    }

    handleChangeTeachers = (selectedTeacher) => {
        this.setState(
            {selectedTeacher})

    };

    handleChangeSpecialization = (selectedSpecialization) => {
        this.setState({selectedSpecialization});
    };

    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        });
    }
    validateForm = () => {
        var a = this.state.schoolyear;
        var b = this.state.className;
        var c = this.state.selectedSpecialization.value;
        var d = this.state.selectedTeacher.value;
        var e = this.state.generateToken;
        var temp = a.split("-");
        console.log(temp)
        if (!temp && temp.length !== 2 && temp[0].length !== 4 && temp[1].length !== 4) {
            this.setState({
                errorIsOpen: true
            })
            return false;
        }

        if (!a || !b || !c || !d || !e) {
            this.setState({
                errorIsOpen: true
            })
            return false;
        } else {
            return true;
        }
    };


    handleSubmit = (e) => {
        console.log("e")
        e.preventDefault();
        if (this.validateForm()) {

            const axios = require('axios');

            let url = localStorage.getItem('url');

            url += '?action=createClass';

           const params = new URLSearchParams();
            params.append("schoolyear", this.state.schoolyear);
            params.append("name", this.state.className);
            params.append("token", this.state.generateToken);
            params.append("specialization", this.state.selectedSpecialization.value);
            params.append("classteacher_id", this.state.selectedTeacher.value);

            axios({
                method: 'post',
                url: url,
                data: params
            }).then((res) => {
                console.log(res.data)
                if (res.data === "successful") {
                    this.toAdministration();
                } else {
                    this.setState({
                        errorMessage: "Etwas ist schiefgelaufen :/"
                    })
                }
            });
        }
    }
    toAdministration = () => {
        this.setState({
            redirect: "/loggedin/Administration/",
            redirectToLink: true
        })
    };
    toNewClassTeacher = () => {
        this.setState({
            redirect: "/loggedin/Administration/NewSchoolperson",
            redirectToLink: true
        })
    };
    handleClose = () => {
        this.setState({
            errorIsOpen: false
        })
    }


    render() {
        if (this.state.redirectToLink !== false) {
            return <Redirect to={this.state.redirect}/>;
        }
        return (

            <div className={'w-100 adminViewContent'}>
                <Breadcrumb>
                    <BreadcrumbItem href={'/loggedin/Administration'}>Administration</BreadcrumbItem>
                    <BreadcrumbItem href={'/loggedin/Administration/newClass'} active>Klasse erstellen</BreadcrumbItem>
                </Breadcrumb>

                <Row>
                    <Col className={'m-5'}>
                        <h1>Klasse Hinzufügen</h1>
                    </Col>
                </Row>

                <Snackbar open={this.state.errorIsOpen} autoHideDuration={10000} onClose={() => {
                    this.setState({errorIsOpen: false})
                }}>

                    <Alert severity={'error'} onClose={this.handleClose}>
                        {this.state.errorMessage}
                    </Alert>
                </Snackbar>

                <Dialog open={this.state.dialogIsOpen} onClose={this.handleDialogClose}
                        aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">Fachrichtung</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Geben sie im untenstehenden Textfeld die neue Fachrichtung ein!
                        </DialogContentText>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="specializations"
                            label="Fachrichtung"
                            type="text"
                            fullWidth
                            onChange={this.handleNewSpec}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleDialogClose} color="primary">
                            Abbrechen
                        </Button>
                        <Button onClick={this.handleDialogSave} color="primary">
                            Speichern
                        </Button>
                    </DialogActions>
                </Dialog>

                <form name={"newClass"} onSubmit={this.handleSubmit}>
                    <Col className={'justify-content-md-center classAddingInformation'}>
                        <Row className={'justify-content-md-center'}>
                            <input className={'w-50 form-control'} type="text" name={'className'} id={'className'}
                                   placeholder="Klasse" value={this.state.className} onChange={this.handleChange}/>
                        </Row>
                        <Row className={'justify-content-md-center'}>
                            <input className={'w-50 form-control'} type="text" name={'schoolyear'} id={'schoolyear'}
                                   placeholder="Schuljahr" value={this.state.schoolyear} onChange={this.handleChange}
                                   required pattern={"[0-9]{4}[-][0-9]{4}"} title={"2020-2021"}
                            />
                        </Row>
                        <Row className={'justify-content-md-center'}>
                            <div className={"w-50"}>
                                <Form.Label>Lehrer</Form.Label>
                                <div className={"d-flex justify-content-between"}>
                                    <div className={"w-75 mr-2"}>
                                        <Select
                                            options={this.state.teachers}
                                            value={this.state.selectedTeacher}
                                            onChange={this.handleChangeTeachers}
                                            placeholder={"Klassenlehrer"}
                                            name={"newClass"}
                                        />
                                    </div>
                                    <div className={"ml-2 w-25"}>
                                        <Button className={"btn btn-primary"} onClick={() => this.toNewClassTeacher()}>Neuer
                                            Lehrer</Button>
                                    </div>
                                </div>
                            </div>
                        </Row>
                        <Row className={'justify-content-md-center'}>
                            <div className={"w-50"}>
                                <Form.Label>Fachrichtung</Form.Label>
                                <div className={"d-flex justify-content-between"}>
                                    <div className={"w-75 mr-2"}>
                                        <Select
                                            options={this.state.specializations}
                                            value={this.state.selectedSpecialization}
                                            onChange={this.handleChangeSpecialization}
                                            placeholder={"Fachrichtung"}
                                            name={"selectedSpecialization"}
                                        />
                                    </div>
                                    <div className={"ml-2 w-25"}>
                                        <Button className={"btn btn-primary"} onClick={() => this.handleDialogOpen()}>Neuer
                                            Fachrichtung</Button>
                                    </div>
                                </div>
                            </div>
                        </Row>
                        <Row className={'justify-content-md-center'}>
                            <div className={'justify-content-md-center w-50'}>
                                <div className={"d-flex justify-content-between"}>
                                    <input className={'w-75 form-control'} type="text" name={"token"}
                                           placeholder="Token"
                                           value={this.state.generateToken} disabled/>
                                    <Button className={"btn btn-primary"} onClick={() => this.generateToken()}>Token
                                        generieren</Button>
                                </div>
                            </div>
                        </Row>
                        <Row className={'justify-content-md-center'}>
                            <button type="submit" className={'btn btn-primary'}>Klasse erstellen</button>
                        </Row>

                    </Col>
                </form>
            </div>
        );
    }

    handleDialogClose = () => {
        this.setState({
            dialogIsOpen: false
        })
    };


    handleDialogSave = () => {
        this.setState({
            dialogIsOpen: false
        });
        let arr_specializations = this.state.specializations;
        var newSpecArr = {value: this.state.new_Specialization, label: this.state.new_Specialization};
        arr_specializations.push({
            value: this.state.new_Specialization, label: this.state.new_Specialization
        });
        console.log(arr_specializations)
        this.setState({
            selectedSpecialization: newSpecArr,
            specializations: arr_specializations
        })
    };

    handleDialogOpen = () => {
        this.setState({
            dialogIsOpen: true
        })
    };
    handleNewSpec = (e) => {
        this.setState({
            new_Specialization: e.target.value
        });
    };


    generateToken = () => {
        const axios = require('axios');
        let url = localStorage.getItem('url');
        url += '?action=getCreatedToken';
        axios({
            method: 'post',
            url: url,
        }).then((res) => {
            this.setState({
                generateToken: res.data
            });
        });

    }


    getAllSpecializations = () => {
        const axios = require('axios');
        let url = localStorage.getItem('url');

        url += '?action=getAllSpecializations';

        axios({
            method: 'post',
            url: url,
        }).then((res) => {
            console.log(res.data)
            const newSpecializations = res.data.map(function (row) {
                return {value: row.id, label: row.description}
            });
            this.setState({specializations: newSpecializations});
        });

    }
    getAllTeachers = () => {
        const axios = require('axios');

        let url = localStorage.getItem('url');

        url += '?action=getAllTeachers';
        axios({
            method: 'post',
            url: url,
        }).then((res) => {
            console.log(res.data)
            const newteachers = res.data.map(function (row) {
                let fullname = row.firstname + " " + row.surname;
                return {value: row.id, label: fullname}
            });
            this.setState({teachers: newteachers});
        });
    }
}


export default InsertNewClass;
