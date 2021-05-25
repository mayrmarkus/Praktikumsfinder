import 'rc-steps/assets/index.css';
import 'rc-steps/assets/iconfont.css';
import React, {Component} from 'react';
import {Breadcrumb, BreadcrumbItem, Button, Col, Form, Row} from "react-bootstrap";
import {Redirect} from "react-router-dom";
import {Snackbar} from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Select from "react-select";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import TextField from "@material-ui/core/TextField";
import DialogActions from "@material-ui/core/DialogActions";

class NewSchoolperson extends Component {
    state = {
        redirect: "",
        redirectToLink: false,
        class_id: 0,
        generateToken: "",
        errorIsOpen: false,
        selectedOptionRole: null,
        isAdministration: false,
        newRole: "",
        roles: [],
        newRoleDescription: "",
        errorRoleName: false,
        errorDescription: false,
        dialogIsOpen: false
    };
    componentDidMount() {
        this.getAllRoles();
        this.generateToken();
    }
    getAllRoles = () => {
        let url = localStorage.getItem('url');
        url += "?action=getAllRoles";

        const axios = require('axios');

        axios({
            method: 'post',
            url: url,
        }).then((res) => {
            const newroles = res.data.map(function (row) {
                return {value: row.id, label: row.name}
            });
            this.setState({roles: newroles});

        });
    };
    handleChangeRoles = selectedOption => {
        this.setState(
            {selectedOptionRole: selectedOption}
        );
    };

    render() {
        if (this.state.redirectToLink !== false) {
            return <Redirect to={this.state.redirect}/>;
        }
        return (
            <div className={'adminViewContent bg-light'}>
                <Breadcrumb>
                    <BreadcrumbItem href={'/loggedin/Administration'}>Administration</BreadcrumbItem>
                    <BreadcrumbItem href={'/loggedin/Administration/newCompany'} active>Klassenlehrer/Lehrer
                        erstellen</BreadcrumbItem>
                </Breadcrumb>

                <Row>
                    <Col className={'m-5'}>
                        <h1>Klassenlehrer/Lehrer erstellen</h1>
                    </Col>
                </Row>


                <Snackbar open={this.state.errorIsOpen} autoHideDuration={10000} onClose={() => {
                    this.setState({errorIsOpen: false});
                }}>

                    <Alert severity={'error'} onClose={this.handleClose}>
                        Bitte kontrollieren sie ob alle Felder ausgefüllt sind!
                    </Alert>
                </Snackbar>
                <Dialog open={this.state.dialogIsOpen} onClose={this.handleDialogClose}
                        aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">Rolle</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Geben sie in den untenstehenden Textfelder die neue Rolle ein!
                        </DialogContentText>
                        <Form id={"newRole"} onSubmit={this.handleDialogSave}>
                            <TextField
                                autoFocus
                                error={this.state.errorRoleName}
                                margin="dense"
                                id="role"
                                label="Role"
                                type="text"
                                fullWidth
                                onChange={this.handleNewRole}
                            />
                            <TextField
                                error={this.state.errorDescription}
                                margin="dense"
                                id="role"
                                label="Beschreibung der Role"
                                type="text"
                                fullWidth
                                onChange={this.handleNewRoleDescription}
                            />
                        </Form>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleDialogClose} color="primary">
                            Abbrechen
                        </Button>
                        <Button type="submit" form="newRole" color="primary">
                            Speichern
                        </Button>
                    </DialogActions>
                </Dialog>
                <Form onSubmit={this.handleSubmit}>
                    <Row className={'justify-content-md-center'}>
                        <Form.Group controlId="formFirstname" className={"mt-3 w-50"}>
                            <Form.Label>Vorname</Form.Label>
                            <Form.Control type={"text"} name={"firstname"}
                                          onChange={this.onChange} required/>
                        </Form.Group>
                    </Row>
                    <Row className={'justify-content-md-center'}>
                        <Form.Group controlId="formSurname" className={"w-50"}>
                            <Form.Label>Nachname</Form.Label>
                            <Form.Control type={"text"} name={"surname"}
                                          onChange={this.onChange} required/>
                        </Form.Group>
                    </Row>
                    <Row className={'justify-content-md-center'}>
                        <Form.Group controlId="formEmail" className={"w-50"}>
                            <Form.Label>Email</Form.Label>
                            <Form.Control type={"email"} name={"email"}
                                          onChange={this.onChange} required>
                            </Form.Control>
                        </Form.Group>
                    </Row>
                    <Row className={'justify-content-md-center'}>
                        <Form.Group controlId="formPhonenumber" className={"w-50"}>
                            <Form.Label>Telefonnummer</Form.Label>
                            <Form.Control type={"text"} name={"phonenumber"}
                                          onChange={this.onChange}
                            >
                            </Form.Control>
                        </Form.Group>
                    </Row>
                    <Row className={'justify-content-md-center'}>
                        <div className={"w-50"}>
                            <Form.Label>Rolle</Form.Label>
                            <div className={"d-flex justify-content-between"}>
                                <div className={"w-100 mr-2"}>
                                    <Select
                                        options={this.state.roles}
                                        value={this.state.selectedOptionRole}
                                        onChange={this.handleChangeRoles}
                                        placeholder={"Wählen sie die Role aus!"}
                                    />
                                </div>
                                <div className={"ml-2 w-25"}>
                                    <Button className={"btn btn-primary"} onClick={() => this.handleDialogOpen()}>Neue
                                        Rolle</Button>
                                </div>
                                <div className={"ml-2 w-25"}>
                                    <FormControlLabel
                                        value="isAdministration"
                                        control={<Switch color="primary" checked={this.state.isAdministration}
                                                         onChange={this.handleisAdministration}/>}
                                        label="Administration"
                                        labelPlacement="start"
                                        required
                                    />
                                </div>
                            </div>

                        </div>
                    </Row>
                    <Row className={'justify-content-md-center'}>
                        <Form.Group controlId="formToken" className={"w-50"}>

                            <Form.Label>Passwort</Form.Label>
                            <div className={"d-flex justify-content-between"}>
                                <div className={"w-75 mr-2"}>
                                    <Form.Control type={"text"} name={"password"}
                                                  disabled required defaultValue={this.state.generateToken}
                                    >
                                    </Form.Control>
                                </div>
                                <div className={"ml-2 w-25"}>
                                    <Button className={"btn btn-primary"} onClick={() => this.generateToken()}>Token
                                        generieren</Button>
                                </div>
                            </div>

                        </Form.Group>
                    </Row>



                    <Row className={'justify-content-md-center'}>
                        <Button className={"m-2 w-25"} variant="success" type="submit">
                            Erstellen
                        </Button>
                    </Row>
                </Form>
            </div>
        );
    }

    handleisAdministration = (event) => {
        this.setState({
            isAdministration: event.target.checked
        })
    };

    handleDialogClose = () => {
        this.setState({
            dialogIsOpen: false
        })
    };

    handleDialogSave = (e) => {
        e.preventDefault();
        console.log("hexy")
        if (this.validateFormNewRole()) {
            this.setState({
                dialogIsOpen: false
            });
            let arr_roles = this.state.roles;
            var newRoleArr = {value: this.state.newRole, label: this.state.newRole};
            arr_roles.push({
                value: this.state.newRole, label: this.state.newRole
            });
            this.setState({
                selectedOptionRole: newRoleArr,
                specializations: arr_roles
            })
        }
    };

    handleDialogOpen = () => {
        this.setState({
            dialogIsOpen: true
        })
    };
    handleNewRole = (e) => {
        this.setState({
            newRole: e.target.value
        });
    };
    handleNewRoleDescription = (e) => {
        this.setState({
            newRoleDescription: e.target.value
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
    validateFormNewRole = () => {
        let a = this.state.newRole;
        let b = this.state.newRoleDescription;

        var errorOpenRole = false;
        var errorOpenDescription = false;

        if (!a && !b) {
            errorOpenRole = true;
            errorOpenDescription = true;
        } else if (!a) {
            errorOpenRole = true;
        } else if (!b) {
            errorOpenDescription = true;
        } else {
            errorOpenRole = false;
            errorOpenDescription = false;
            this.setState({
                errorDescription: false,
                errorRoleName: false
            })
            return true;
        }

        if (errorOpenRole && errorOpenDescription) {
            this.setState({
                errorDescription: true,
                errorRoleName: true
            })
            return false;
        } else if (errorOpenRole) {
            this.setState({
                errorRoleName: true,
                errorDescription: false
            })
            return false;
        } else if (errorOpenDescription) {
            this.setState({
                errorDescription: true,
                errorRoleName: false
            })
            return false;
        }
    };

    validateForm = () => {
        let a = this.state.firstname;
        let b = this.state.email;
        let c = this.state.surname;
        let d = this.state.selectedOptionRole;

        if (!a || !b || !c || !d) {
            this.setState({
                errorIsOpen: true
            });
            return false;
        } else {
            return true;
        }
    };
    toAdministration = () => {
        this.setState({
            redirect: "/loggedin/Administration",
            redirectToLink: true
        });
    };

    onChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
    };
    handleClose = () => {
        this.setState({
            errorIsOpen: false
        })
    };
    handleSubmit = event => {
        event.preventDefault();
        if(this.validateForm()) {
            let url = localStorage.getItem('url');

            let params = new URLSearchParams();

            params.append('email', this.state.email);
            params.append('firstname', this.state.firstname);
            params.append('surname', this.state.surname);
            params.append('password', this.state.generateToken);
            params.append('phonenumber', this.state.phonenumber);
            params.append('role', this.state.selectedOptionRole.value);
            params.append('role_description', this.state.newRoleDescription);
            params.append('isAdministration', this.state.isAdministration);

            const axios = require('axios');
            url += '?action=addSchoolperson';

            axios({
                method: 'post',
                url: url,
                data: params
            }).then((res) => {
                console.log(res.data);
                this.toAdministration();
            })


        }
        console.log(this.state);
    }

}

export default NewSchoolperson;