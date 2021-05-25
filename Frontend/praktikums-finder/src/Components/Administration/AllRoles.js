import React, {Component} from 'react';
import {Redirect} from "react-router-dom";
import {Breadcrumb, BreadcrumbItem, Button, ButtonToolbar, Card, Col, DropdownButton, Form, Row} from "react-bootstrap";
import Avatar from "@material-ui/core/Avatar";
import EditIcon from '@material-ui/icons/Edit';
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import TextField from "@material-ui/core/TextField";
import DialogActions from "@material-ui/core/DialogActions";
import {Snackbar} from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";

class AllRoles extends Component {
    state = {
        roles: null,
        error: false,
        redirectToLink: false,
        redirect: "",
        roleName: "",
        roleDescription: "",
        dialogIsOpen: false,
        currentRole: null,
        roleID: "",
        dialogNewRoleIsOpen: false,
        NewRoleDescription: "",
        NewRoleName: "",
        errorIsOpen: false,
        errorMessage: ""
    }


    componentDidMount() {
        this.getAllRoles();
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
                        <h1>Alle Rollen</h1>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <div className={'p-1'}>
                            <div className={"noDividerList"}>
                                {this.displayAllRoles()}
                            </div>
                        </div>
                    </Col>
                </Row>
                <Snackbar open={this.state.errorIsOpen} autoHideDuration={10000} onClose={() => {
                    this.setState({errorIsOpen: false})
                }}>

                    <Alert severity={'error'} onClose={() => this.setState({errorIsOpen: false})}>
                        {this.state.errorMessage}
                    </Alert>
                </Snackbar>
                <Dialog open={this.state.dialogIsOpen} onClose={this.handleDialogClose}
                        aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">Fachrichtung</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Bearbeiten sie in den untenstehenden Textfeld die Rolle ein!
                        </DialogContentText>
                        <Form id={"editRole"} onSubmit={this.handleSubmit}>
                            <TextField
                                margin="dense"
                                required
                                value={this.state.roleName}
                                id="roleName"
                                label="Name der Rolle"
                                type="text"
                                name={"roleName"}
                                fullWidth
                                onChange={this.handleChange}
                            />
                            <TextField
                                margin="dense"
                                required
                                value={this.state.roleDescription}
                                id="roleDescription"
                                label="Beschreibung der Rolle"
                                type="text"
                                name={"roleDescription"}
                                fullWidth
                                onChange={this.handleChange}
                            />
                        </Form>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleDialogClose} color="primary">
                            Abbrechen
                        </Button>
                        <Button type={"submit"} form={"editRole"} color="primary">
                            Speichern
                        </Button>
                    </DialogActions>
                </Dialog>
                <Dialog open={this.state.dialogNewRoleIsOpen} onClose={this.handleDialogRoleClose}
                        aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">Neue Rolle</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Geben sie in den untenstehenden Textfeldern die neue Rolle ein!
                        </DialogContentText>
                        <Form id={"editRole"} onSubmit={this.handleSubmitNewRole}>
                            <TextField
                                margin="dense"
                                required
                                value={this.state.NewRoleName}
                                id="roleName"
                                label="Name der Rolle"
                                type="text"
                                name={"NewRoleName"}
                                fullWidth
                                onChange={this.handleChange}
                            />
                            <TextField
                                margin="dense"
                                required
                                value={this.state.NewRoleDescription}
                                id="roleDescription"
                                label="Beschreibung der Rolle"
                                type="text"
                                name={"NewRoleDescription"}
                                fullWidth
                                onChange={this.handleChange}
                            />
                        </Form>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleDialogRoleClose} color="primary">
                            Abbrechen
                        </Button>
                        <Button type={"submit"} form={"editRole"} color="primary">
                            Speichern
                        </Button>
                    </DialogActions>
                </Dialog>

            </div>
        );
    }

    handleSubmit = (e) => {
        e.preventDefault();

        let url = localStorage.getItem('url');

        let params = new URLSearchParams();

        params.append('role_id', this.state.roleID);
        params.append('description', this.state.roleDescription);
        params.append('name', this.state.roleName);


        const axios = require('axios');
        url += '?action=editRole';

        axios({
            method: 'post',
            url: url,
            data: params
        }).then((res) => {
            console.log(res.data)
            if (!res.data.error) {
                this.setState({
                    roles: res.data
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
    handleSubmitNewRole = (e) => {
        e.preventDefault();
        console.log("name", this.state.NewRoleName, "desc", this.state.NewRoleDescription)

        let url = localStorage.getItem('url');

        let params = new URLSearchParams();

        params.append('description', this.state.NewRoleDescription);
        params.append('name', this.state.NewRoleName);


        const axios = require('axios');
        url += '?action=createRole';

        axios({
            method: 'post',
            url: url,
            data: params
        }).then((res) => {
            console.log(res.data)
            if (!res.data.error) {
                this.setState({
                    roles: res.data
                })
                this.handleDialogRoleClose();
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

    handleDialogClose = () => {
        this.setState({
            dialogIsOpen: false
        })
    };
    handleDialogRoleClose = () => {
        this.setState({
            dialogNewRoleIsOpen: false
        })
    };

    getAllRoles = () => {
        let url = localStorage.getItem('url');
        url += "?action=getAllRoles";
        const axios = require('axios');
        axios({
            method: 'post',
            url: url,
        }).then((res) => {
            console.log(res.data)
            this.setState({
                roles: res.data
            });
        })
    };

    displayAllRoles = () => {
        if (this.state.roles != null && this.state.error !== true) {


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

            if (!this.state.roles) {
                return <div/>
            }

            let roles = [];

            roles.push(
                <Card bg={"light border border-secondary"} key={-1}
                      className={"m-3 w-25 text-center"} onClick={() => this.setState({dialogNewRoleIsOpen: true})}>
                    <Card.Header>
                        <Row>
                            <Col className={"d-flex align-items-baseline"}>
                                <Avatar
                                    style={{backgroundColor: "#" + getRandomColor()}}>{firstChar("Neue Rolle")}</Avatar>
                                <div className={"ml-2"}>Neue Rolle</div>
                            </Col>
                            <Col>
                                <div className={"float-right mt-2"}>

                                </div>
                            </Col>
                        </Row>
                    </Card.Header>
                    <Card.Body className={"d-flex justify-content-around"}>
                        <h2>+</h2>
                    </Card.Body>
                </Card>)

            this.state.roles.map(c => {
                roles.push(
                    <Card bg={"light"} key={c.id}
                          className={"m-3 w-25 text-center"}>
                        <Card.Header>
                            <Row>
                                <Col className={"d-flex align-items-baseline"}>
                                    <Avatar
                                        style={{backgroundColor: "#" + getRandomColor()}}>{firstChar(c.name)}</Avatar>
                                    <div className={"ml-2"}>{c.name}</div>
                                </Col>
                                <Col>
                                    <div className={"float-right mt-2"} onClick={() => this.openDialog(c.id)}>
                                        <EditIcon/>
                                    </div>
                                </Col>
                            </Row>
                        </Card.Header>
                        <Card.Body>
                            <h5>Beschreibung:</h5>
                            <h6>{c.description}</h6>
                        </Card.Body>
                    </Card>)
            });
            return roles;
        }
    };

    getRoleByID = (id) => {
        let data = this.state.roles;
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
        let data = this.getRoleByID(id);
        if (data != null) {
            this.setState({
                dialogIsOpen: true,
                roleID: data.id,
                roleName: data.name,
                roleDescription: data.description
            })
        }

    }


}

export default AllRoles;