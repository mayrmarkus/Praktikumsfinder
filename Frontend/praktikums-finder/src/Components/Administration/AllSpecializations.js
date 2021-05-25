import React, {Component} from 'react';
import {Breadcrumb, BreadcrumbItem, Button, Card, Col, Form, Row} from "react-bootstrap";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import TextField from "@material-ui/core/TextField";
import DialogActions from "@material-ui/core/DialogActions";
import Avatar from "@material-ui/core/Avatar";
import EditIcon from "@material-ui/icons/Edit";
import AddIcon from '@material-ui/icons/Add';
import Alert from "@material-ui/lab/Alert";
import {Snackbar} from "@material-ui/core";

class AllSpecializations extends Component {
    state = {
        specialization: null,
        error: false,
        specializationName: "",
        NewSpecDescription: "",
        dialogNewSpecIsOpen: false,
        dialogIsOpen: false,
        errorIsOpen: false,
        errorMessage: "Fehler"
    }

    componentDidMount() {
        this.getAllSpecializations();
    }

    render() {
        return (
            <div className={'w-100 adminViewContent'}>

                <Breadcrumb>
                    <BreadcrumbItem href={'/loggedin/Administration'} active>Administration</BreadcrumbItem>
                </Breadcrumb>

                <Row>
                    <Col className={'m-5'}>
                        <h1>Alle Fachrichtungen</h1>
                    </Col>
                </Row>
                <Snackbar open={this.state.errorIsOpen} autoHideDuration={10000} onClose={() => {
                    this.setState({errorIsOpen: false})
                }}>

                    <Alert severity={'error'} onClose={() => this.setState({errorIsOpen: false})}>
                        {this.state.errorMessage}
                    </Alert>
                </Snackbar>
                <Row>
                    <Col>
                        <div className={'p-1'}>
                            <div className={"noDividerList"}>
                                {this.displaySpecializations()}
                            </div>
                        </div>
                    </Col>
                </Row>
                <Dialog open={this.state.dialogIsOpen} onClose={this.handleDialogClose}
                        aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">Fachrichtung</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Bearbeiten sie in den untenstehenden Textfeld die Fachrichtung ein!
                        </DialogContentText>
                        <Form id={"editSpec"} onSubmit={this.handleSubmit}>
                            <TextField
                                margin="dense"
                                required
                                autoFocus
                                value={this.state.specializationName}
                                id="roleDescription"
                                label="Name der Fachrichtung"
                                type="text"
                                name={"specializationName"}
                                fullWidth
                                onChange={this.handleChange}
                            />
                        </Form>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleDialogClose} color="primary">
                            Abbrechen
                        </Button>
                        <Button type={"submit"} form={"editSpec"} color="primary">
                            Speichern
                        </Button>
                    </DialogActions>
                </Dialog>
                <Dialog open={this.state.dialogNewSpecIsOpen} onClose={this.handleDialogRoleClose}
                        aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">Neue Fachrichtung</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Geben sie im untenstehenden Textfeld die neue Fachrichtung ein!
                        </DialogContentText>
                        <Form id={"editSpec"} onSubmit={this.handleSubmitNewSpec}>
                            <TextField
                                margin="dense"
                                required
                                autoFocus
                                value={this.state.NewSpecDescription}
                                id="roleDescription"
                                label="Name der Fachrichtung"
                                type="text"
                                name={"NewSpecDescription"}
                                fullWidth
                                onChange={this.handleChange}
                            />
                        </Form>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleDialogCloseSpec} color="primary">
                            Abbrechen
                        </Button>
                        <Button type={"submit"} form={"editSpec"} color="primary">
                            Speichern
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }

    handleSubmitNewSpec = (e) => {
        e.preventDefault();

        console.log("spec_description", this.state.NewSpecDescription);

        let url = localStorage.getItem('url');

        let params = new URLSearchParams();

        params.append('specialization_description', this.state.NewSpecDescription);


        const axios = require('axios');
        url += '?action=createSpecialization';

        axios({
            method: 'post',
            url: url,
            data: params
        }).then((res) => {
            console.log(res.data)
            if (!res.data.error) {
                this.setState({
                    specialization: res.data
                })
                this.handleDialogCloseSpec();
            } else {
                console.log(res.message)
                this.setState({
                    errorIsOpen: true,
                    errorMessage: res.data.message
                })
            }
        });


    }


    handleDialogClose = () => {
        this.setState({
            dialogIsOpen: false
        })
    };
    handleDialogCloseSpec = () => {
        this.setState({
            dialogNewSpecIsOpen: false
        })
    };


    handleSubmit = (e) => {
        e.preventDefault();

        let url = localStorage.getItem('url');

        let params = new URLSearchParams();

        params.append('specializations_id', this.state.specializations_id);
        params.append('description', this.state.specializationName);


        const axios = require('axios');

        url += '?action=editSpecialization';

        axios({
            method: 'post',
            url: url,
            data: params
        }).then((res) => {
            console.log(res.data)
            if (!res.data.error) {
                this.setState({
                    specialization: res.data
                })
                this.handleDialogClose();
            } else {
                console.log(res.message)
                this.setState({
                    errorIsOpen: true,
                    errorMessage: res.data.message
                })
            }

        });
    }

    handleChange = (e) => {
        this.setState({
            [e.target.name]: [e.target.value]
        })
    }

    getSpecByID = (id) => {
        let data = this.state.specialization;
        var i = 0;
        var length = data.length;

        var out = null;

        for (i; i < length; i++) {
            if (id === data[i].id) {
                out = data[i];
            }
        }
        return out;
    }

    openDialog = (id) => {
        let data = this.getSpecByID(id);
        if (data != null) {
            this.setState({
                dialogIsOpen: true,
                specializations_id: data.id,
                specializationName: data.description
            })
        }

    }

    getAllSpecializations = () => {
        let url = localStorage.getItem('url');
        url += "?action=getAllSpecializations";
        const axios = require('axios');
        axios({
            method: 'post',
            url: url,
        }).then((res) => {
            console.log(res.data)
            this.setState({
                specialization: res.data
            });
        })
    };

    displaySpecializations = () => {
        if (this.state.specialization != null && this.state.error !== true) {


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
            function firstChar(roleName) {
                if (roleName != null) {
                    let firstChar = (roleName.substring(0, 1)).toUpperCase();
                    return firstChar;
                } else {
                    return "M";
                }

            }

            if (!this.state.specialization) {
                return <div/>
            }

            let spec = [];

            spec.push(
                <Card bg={"light border border-secondary"} key={-1}
                      className={"m-3 w-25 text-center"}
                      onClick={() => this.setState({dialogNewSpecIsOpen: true})}
                >
                    <Card.Header>
                        <Row>
                            <Col className={"d-flex align-items-baseline"}>
                                <Avatar
                                    style={{backgroundColor: "#" + getRandomColor()}}>{firstChar("+")}</Avatar>
                                <div className={"ml-2"}>Neue Fachrichtung</div>
                            </Col>
                        </Row>
                    </Card.Header>
                </Card>)


            this.state.specialization.map((c) => {
                spec.push(
                    <Card bg={"light"} key={c.id}
                          className={"m-3 w-25 text-center"}>
                        <Card.Header>
                            <Row>
                                <Col className={"d-flex align-items-baseline"}>
                                    <Avatar
                                        style={{backgroundColor: "#" + getRandomColor()}}>{firstChar(c.description)}</Avatar>
                                    <div className={"ml-2"}>{c.description}</div>
                                </Col>
                                <Col>

                                </Col>
                                <Col>
                                    <div className={"float-right mt-2"} onClick={() => this.openDialog(c.id)}>
                                        <EditIcon/>
                                    </div>
                                </Col>
                            </Row>


                        </Card.Header>
                    </Card>)
            });
            return spec;
        }
    };
}

export default AllSpecializations;