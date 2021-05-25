import 'rc-steps/assets/index.css';
import 'rc-steps/assets/iconfont.css';
import React, {Component} from 'react';
import {Breadcrumb, BreadcrumbItem, Button, Col, Form, Row} from "react-bootstrap";
import Alert from "@material-ui/lab/Alert";
import {Snackbar} from "@material-ui/core";
import {Redirect} from "react-router-dom";
import Select from "react-select";
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

class NewCompany extends Component {
    state = {
        redirect: "",
        redirectToLink: false,
        errorIsOpen: false,
        generateToken: "",
        dialogIsOpen: false,
        selectedOptionDistrict: null,
        selectedOptionSpecializations: null
    };

    componentDidMount() {
        this.generateToken();
        this.getAllDistricts();
        this.getAllSpecialization();
    }


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
    getAllSpecialization = () => {
        let url = localStorage.getItem('url');
        url += "?action=getAllRoles";

        const axios = require('axios');

        axios({
            method: 'post',
            url: url,
        }).then((res) => {
            const newspecializations = res.data.map(function (row) {
                return {value: row.id, label: row.description}
            });
            this.setState({

                specializations: newspecializations
            });
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
            const newdistricts = res.data.map(function (row) {
                return {value: row.id, label: row.name}
            });
            this.setState({districts: newdistricts});

        });
    };
    validateForm = () => {
        console.log(this.state)
        let a = this.state.address;
        let b = this.state.email;
        let c = this.state.name;
        let d = this.state.phonenumber;
        let e = this.state.cap;
        let f = this.state.selectedOptionDistrict;
        let g = this.state.selectedOptionSpecializations;


        if (!a || !b || !c || !d || !e || !f || !g) {
            this.setState({
                errorIsOpen: true
            });
            return false;
        } else {
            return true;
        }
    };
    handleChangeDistricts = selectedOption => {
        this.setState(
            {selectedOptionDistrict: selectedOption}
        );
    };
    handleChangeSpecializations = selectedOption => {
        this.setState(
            {selectedOptionSpecializations: selectedOption}
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
                    <BreadcrumbItem href={'/loggedin/Administration/newCompany'} active>Unternehmen
                        erstellen</BreadcrumbItem>
                </Breadcrumb>
                <Row>
                    <Col className={'m-5'}>
                        <h1>Unternehmen erstellen</h1>
                    </Col>
                </Row>


                <Snackbar open={this.state.errorIsOpen} autoHideDuration={10000} onClose={() => {
                    this.setState({errorIsOpen: false});
                }}>

                    <Alert severity={'error'} onClose={this.handleClose}>
                        Bitte kontrollieren sie ob alle Felder ausgefüllt sind!
                    </Alert>
                </Snackbar>
                <div>
                    <Dialog open={this.state.dialogIsOpen} onClose={this.handleDialogClose}
                            aria-labelledby="form-dialog-title">
                        <DialogTitle id="form-dialog-title">Neuer Bezirk</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                Geben sie im untenstehenden Textfeld den neuen Bezirk ein!
                            </DialogContentText>
                            <TextField
                                autoFocus
                                margin="dense"
                                id="district"
                                label="Bezirk"
                                type="text"
                                fullWidth
                                onChange={this.handleNewDistrict}
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
                    <Dialog open={this.state.dialogNewSpecIsOpen} onClose={this.handleDialogCloseSpec}
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
                            <Button onClick={this.handleDialogCloseSpec} color="primary">
                                Abbrechen
                            </Button>
                            <Button onClick={this.handleDialogSaveSpec} color="primary">
                                Speichern
                            </Button>
                        </DialogActions>
                    </Dialog>

                </div>
                <Form onSubmit={this.handleSubmit}>
                    <Row className={'justify-content-md-center'}>
                        <Form.Group controlId="formUsername" className={"mt-3 w-50"}>
                            <Form.Label>Namen des Unternehmens</Form.Label>
                            <Form.Control type={"text"} name={"name"}
                                          onChange={this.onChange} required/>
                        </Form.Group>
                    </Row>
                    <Row className={'justify-content-md-center'}>
                        <Form.Group controlId="formCompanyEmail" className={"w-50"}>
                            <Form.Label>Email des Unternehmens</Form.Label>
                            <Form.Control type={"email"} name={"email"}
                                          onChange={this.onChange} required/>
                        </Form.Group>
                    </Row>
                    <Row className={'justify-content-md-center'}>
                        <Form.Group controlId="formPhonenumber" className={"w-50"}>
                            <Form.Label>Telefonnummer des Unternehmens</Form.Label>
                            <Form.Control type={"text"} name={"phonenumber"}
                                          onChange={this.onChange} required>
                            </Form.Control>
                        </Form.Group>
                    </Row>
                    <Row className={'justify-content-md-center'}>
                        <Form.Group controlId="formAddress" className={"w-50"}>
                            <Form.Label>Adresse</Form.Label>
                            <Form.Control type={"text"} name={"address"}
                                          onChange={this.onChange} required>
                            </Form.Control>
                        </Form.Group>
                    </Row>
                    <Row className={'justify-content-md-center'}>
                        <Form.Group controlId="formCap" className={"w-50"}>
                            <Form.Label>PLZ</Form.Label>
                            <Form.Control type={"text"} name={"cap"}
                                          onChange={this.onChange} required
                                          pattern={"[0-9]{5,6}"}
                            >
                            </Form.Control>
                        </Form.Group>
                    </Row>
                    <Row className={'justify-content-md-center'}>
                        <div className={"w-50"}>
                            <Form.Label>Fachrichtung</Form.Label>
                            <div className={"d-flex justify-content-between"}>
                                <div className={"w-75 mr-2"}>
                                    <Select
                                        options={this.state.specializations}
                                        value={this.state.selectedOptionSpecializations}
                                        onChange={this.handleChangeSpecializations}
                                        placeholder={"Fachrichtung"}
                                        name={"selectedSpecialization"}
                                    />
                                </div>
                                <div className={"ml-2 w-25"}>
                                    <Button className={"btn btn-primary"} onClick={() => this.handleDialogOpenSpec()}>Neuer
                                        Fachrichtung</Button>
                                </div>
                            </div>
                        </div>
                    </Row>
                    <Row className={'justify-content-md-center'}>
                        <div className={"w-50"}>
                            <Form.Label>Berzirke</Form.Label>
                            <div className={"d-flex justify-content-between"}>
                                <div className={"w-75 mr-2"}>
                                    <Select
                                        options={this.state.districts}
                                        value={this.state.selectedOptionDistrict}
                                        onChange={this.handleChangeDistricts}
                                        placeholder={"Wählen sie hier den Bezirk aus!"}
                                    />
                                </div>
                                <div className={"ml-2 w-25"}>
                                    <Button className={"btn btn-primary"} onClick={() => this.handleDialogOpen()}>Neuer
                                        Bezirk</Button>
                                </div>
                            </div>

                        </div>
                    </Row>
                    <Row className={'justify-content-md-center'}>
                        <Form.Group controlId="formToken" className={"w-50"}>

                            <Form.Label>Token</Form.Label>
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
                        <Button className={"m-2"} variant="success" type="submit">
                            Erstellen
                        </Button>
                    </Row>
                </Form>
            </div>
        );
    }

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

    };
    toAdministration = () => {
        this.setState({
            redirect: "/loggedin/Administration",
            redirectToLink: true
        });
    };
    handleDialogClose = () => {
        this.setState({
            dialogIsOpen: false
        })
    };

    handleDialogSave = () => {
        this.setState({
            dialogIsOpen: false
        });
        const newDistrictArr = {value: this.state.new_District, label: this.state.new_District};
        this.state.districts.push({
            value: this.state.new_District, label: this.state.new_District
        });
        this.setState({
            selectedOptionDistrict: newDistrictArr
        })
    };

    handleDialogOpen = () => {
        this.setState({
            dialogIsOpen: true
        })
    };

    handleDialogOpenSpec = () => {
        this.setState({
            dialogNewSpecIsOpen: true
        })
    };

    handleDialogCloseSpec = () => {
        this.setState({
            dialogNewSpecIsOpen: false
        })
    };

    handleDialogSaveSpec = () => {
        this.setState({
            dialogNewSpecIsOpen: false
        });
        let arr_specializations = this.state.specializations;
        var newSpecArr = {value: this.state.new_Specialization, label: this.state.new_Specialization};
        arr_specializations.push({
            value: this.state.new_Specialization, label: this.state.new_Specialization
        });
        console.log(arr_specializations)
        this.setState({
            selectedOptionSpecializations: newSpecArr,
            specializations: arr_specializations
        })
    };
    handleNewSpec = (e) => {
        this.setState({
            new_Specialization: e.target.value
        });
    };


    handleNewDistrict = (e) => {
        this.setState({
            new_District: e.target.value
        });
    };

    handleSubmit = event => {
        event.preventDefault();
        if (this.validateForm()) {
            let url = localStorage.getItem('url');
            let params = new URLSearchParams();

            params.append('address', this.state.address);
            params.append('email', this.state.email);
            params.append('companyname', this.state.name);
            params.append('phonenumber', this.state.phonenumber);
            params.append('token', this.state.generateToken);
            params.append('cap', this.state.cap);
            params.append('districtname', this.state.selectedOptionDistrict.label);
            params.append('specialization', this.state.selectedOptionSpecializations.value);


            const axios = require('axios');
            url += '?action=createCompany';

            axios({
                method: 'post',
                url: url,
                data: params
            }).then((res) => {
                console.log(res.data);
                this.toAdministration();
            });
        }
    }

}

export default NewCompany;