import 'rc-steps/assets/index.css';
import 'rc-steps/assets/iconfont.css';
import React, {Component} from 'react';
import {Breadcrumb, BreadcrumbItem, Button, Card, Form, Row} from "react-bootstrap";
import {Redirect} from "react-router-dom";
import Avatar from '@material-ui/core/Avatar';
import Col from "react-bootstrap/Col";
import NewCompanyTutor from "./NewCompanyTutor";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import {CardHeader, Divider, Snackbar} from "@material-ui/core";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Alert from "@material-ui/lab/Alert";
import DoneIcon from "@material-ui/icons/Done";
import BlockIcon from "@material-ui/icons/Block";
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import EditCompany from "./EditCompany";

class CompanyInformation extends Component {
    state = {
        redirect: "",
        redirectToLink: false,
        companyID: null,
        dialogIsOpen: false,
        firstname: "",
        surname: "",
        email: "",
        phonenumber: "",
        companyName: "",
        address: "",
        c_email: "",
        c_phonenumber: "",
        errorIsOpen: false,
        dialogEditIsOpen: false
    };


    componentDidMount() {
        console.log("hey")
        this.getCompanyById(this.props.match.params.id)
        this.getAllTutors(this.props.match.params.id)
        this.setState({
            companyID: this.props.match.params.id
        });

    }

    render() {
        if (this.state.redirectToLink !== false) {
            console.log(<Redirect to={this.state.redirect}/>)
            return <Redirect to={this.state.redirect}/>;
        }

        return (
            <div className={'adminViewContent bg-light'}>
                <Breadcrumb>
                    <BreadcrumbItem href={'/loggedin/Administration'}>Administration</BreadcrumbItem>
                    <BreadcrumbItem href={'/loggedin/Administration/CompanyInformation/'}
                                    active={'active'}>ClassInformation</BreadcrumbItem>
                </Breadcrumb>
                {
                    this.setDialogForEdit()
                }
                {
                    this.newTutor()
                }
                {
                    this.showCompanyInfo()
                }

                {
                    this.showAllCompanyTutors()
                }
            </div>
        );
    }

    showAllCompanyTutors = () => {

        if (this.state.data) {
            return (
                <div>
                    <Card>
                        <Card.Header>Tutoren:</Card.Header>
                        <Card.Body>
                            <div className={'d-flex flex-row'}>
                                {
                                    <Card className={"m-2  w-25 border-secondary"} key={"new"}
                                          onClick={() => this.handleDialogOpen()}>
                                        <div>
                                            <Card.Header>Neuer Tutor:</Card.Header>
                                            <Card.Body className={"align-items-center d-flex justify-content-center"}>
                                                <h2>+</h2>
                                            </Card.Body>
                                        </div>
                                    </Card>
                                }{
                                this.state.data.map((v, k) => {
                                    return (


                                        <Card className={"m-2 w-25 "} key={k}>
                                            <Card.Header>{v.firstname} {v.surname}</Card.Header>
                                            <Card.Body>
                                                <Card.Subtitle>
                                                    <Col className={"m-2"}>
                                                        <Row>
                                                            Tel: {v.phonenumber}
                                                        </Row>
                                                    </Col>
                                                    <Col className={"m-2"}>
                                                        <Row>
                                                            Email: {v.email}
                                                        </Row>
                                                    </Col>
                                                    <Col className={"m-2"} onClick={() => this.blockTutor(v.id)}>
                                                        <Row>
                                                            <div>
                                                                {this.deactive_activated(v.isVerified)}
                                                            </div>
                                                            <div className={"ml-2"}>
                                                                {this.block_unblockTutor(v.isVerified)}
                                                            </div>
                                                        </Row>
                                                    </Col>
                                                </Card.Subtitle>

                                            </Card.Body>
                                        </Card>
                                    )

                                })

                            }
                            </div>
                        </Card.Body>
                    </Card>

                </div>
            )
        }
    };


    handleChange = (event) => {
        const {name, value} = event.target
        this.setState({
            [name]: value
        })
    }
    handleDialogClose = () => {
        this.setState({
            firstname: "",
            surname: "",
            email: "",
            phonenumber: "",
            dialogIsOpen: false
        })
    };
    handleDialogOpen = () => {
        this.setState({
            dialogIsOpen: true
        })
    };

    checkifStepFilledOut = () => {
        var help = false;
        let a = this.state.firstname;
        let b = this.state.surname;
        let c = this.state.email;
        let d = this.state.phonenumber;
        help = !(!a || !b || !c || !d);

        if (!help) {
            this.setState({
                errorIsOpen: true
            });
        }
        return help;
    }
    handleClose = () => {
        this.setState({
            errorIsOpen: false
        })
    };
    checkifStepEditFilledOut = () => {
        var help = false;
        let a = this.state.companyName;
        let b = this.state.address;
        let c = this.state.c_email;
        let d = this.state.c_phonenumber;
        help = !(!a || !b || !c || !d);

        if (!help) {
            this.setState({
                errorIsOpen: true
            });
        }
        return help;
    }


    handleSubmit = event => {
        event.preventDefault();
        if (this.checkifStepFilledOut()) {

            let url = localStorage.getItem('url');

            let params = new URLSearchParams();

            params.append('firstname', this.state.firstname);
            params.append('surname', this.state.surname);
            params.append('email', this.state.email);
            params.append('phonenumber', this.state.phonenumber);
            params.append('company_id', this.state.companyID);
            params.append('isVerified', 1);
            params.append('isEmployed', 1);


            const axios = require('axios');
            url += '?action=createTutorCompany';

            axios({
                method: 'post',
                url: url,
                data: params
            }).then((res) => {
                console.log(res.data);
                this.handleDialogClose();
                this.getAllTutors(this.state.companyID);

            });
        }
    }


    newTutor = () => {
        return (
            <div>
                <Snackbar open={this.state.errorIsOpen} autoHideDuration={10000} onClose={() => {
                    this.setState({errorIsOpen: false});
                }}>

                    <Alert severity={'error'} onClose={this.handleClose}>
                        Bitte kontrollieren sie ob alle Felder ausgefüllt sind!
                    </Alert>
                </Snackbar>
                <Dialog open={this.state.dialogIsOpen}
                        classes={{paper: this.state.styles,}}
                        onClose={this.handleDialogClose} fullWidth={true}
                        maxWidth={"sm"}
                        aria-labelledby="form-dialog-title"
                >
                    <div>
                        <DialogTitle id="form-dialog-title">Neuen Tutor hinzufügen</DialogTitle>
                        <Divider/>
                        <DialogContent>
                            <Form id='my-form' onSubmit={this.handleSubmit}>
                                <NewCompanyTutor
                                    handleChange={this.handleChange}
                                    firstname={this.state.firstname}
                                    surname={this.state.surname}
                                    email={this.state.email}
                                    phonenumber={this.state.phonenumber}
                                />
                            </Form>
                        </DialogContent>
                        <Divider className={"mt-2"}/>
                        <DialogActions className={"float-right"}>
                            <Button onClick={this.handleDialogClose} color="primary">
                                Abbrechen
                            </Button>
                            <Button className={" mt-2 m-2"} form={"my-form"} color="primary"
                                    type="submit">
                                Erstellen
                            </Button>
                        </DialogActions>
                        <Divider/>
                    </div>
                </Dialog>
            </div>
        )
    }

    showCompanyInfo = () => {

        function hashCode(str) {
            var hash = 0;
            for (var i = 0; i < str.length; i++) {
                hash = str.charCodeAt(i) + ((hash << 5) - hash);
            }
            return hash;
        }

        function rgbToHex(rgb) {
            var hex = Number(rgb).toString(16);
            if (hex.length < 2) {
                hex = "0" + hex;
            }
            return hex
        }

        function intToRGB(i) {
            var c = (i & 0x00FFFFFF)
                .toString(16)
                .toUpperCase();

            return "00000".substring(0, 6 - c.length) + c;
        }

        function getRandomColor() {
            var colors = []
            var d = Math.random();
            if (d < 0.666) {
                colors.push(rgbToHex(0) + "" + rgbToHex(48) + "" + rgbToHex(80))

            } else {
                colors.push(rgbToHex(255) + "" + rgbToHex(203) + "" + rgbToHex(0))
            }
            return colors[0];
        }

        function firstChar(name) {
            let firstChar = (name.substring(0, 1)).toUpperCase();
            return firstChar;
        }


        function isUndefined(name) {
            if (name === undefined) {
                return (<div className={"d-flex align-items-center"}>
                    <Avatar style={{backgroundColor: "#" + getRandomColor()}}>MM</Avatar>
                    <div className={"ml-2"}>Max Mustermann</div>
                </div>)
            } else {
                return (<div className={"d-flex align-items-center"}>
                    <Avatar
                        style={{backgroundColor: "#" + getRandomColor()}}>{firstChar(name)}</Avatar>
                    <div className={"ml-2"}>{name}</div>
                </div>)
            }
        }

        if (this.state.company)

            return (
                <div>
                    <h1>Informationen über das Unternehmen: {this.state.company.name} </h1>
                    <Row className={"m-3"}>
                        <Col>
                            <Row>
                                <div style={{'margin': '0px'}} className={'text-secondary'}>Email:</div>
                            </Row>
                            <Row className={"mr-1"}>
                                <div>{this.state.company.email}</div>
                            </Row>
                        </Col>
                        <Col>
                            <Row>
                                <div style={{'margin': '0px'}} className={'text-secondary'}>Phonenumber:</div>
                            </Row>
                            <Row className={"mr-1"}>
                                <div>{this.state.company.phonenumber}</div>
                            </Row>
                        </Col>
                        <Col>
                            <Row>
                                <div style={{'margin': '0px'}} className={'text-secondary'}>Adresse:</div>
                            </Row>
                            <Row className={"mr-1"}>
                                <div>{this.state.company.address}</div>
                            </Row>
                        </Col>
                        <Col>
                            <Row>
                                <div style={{'margin': '0px'}} className={'text-secondary'}>Cap:</div>
                            </Row>
                            <Row className={"mr-1"}>
                                <div>{this.state.company.cap}</div>
                            </Row>
                        </Col>
                        <Col>
                            <Row>
                                <div style={{'margin': '0px'}} className={'text-secondary'}>Verifiziert:</div>
                            </Row>
                            <Row className={"mr-1"}>
                                <div
                                    style={{'marginLeft': '1rem'}}>{this.getVerified(this.state.company.isVerified)}</div>
                            </Row>
                        </Col>
                        <Col>
                            <Row>
                                <div style={{'margin': '0px'}}
                                     className={'text-secondary'}>{this.deactive_activated(this.state.company.isVerified)}</div>
                            </Row>
                            <Row>
                                <div className={"ml-4"}>{this.block_unblock(this.state.company.isVerified)}</div>
                            </Row>
                        </Col>
                        <Col onClick={() => this.handleEditOpen()}>
                            <Row>
                                <div style={{'margin': '0px'}}
                                     className={'text-secondary'}>Editieren
                                </div>
                            </Row>
                            <Row>
                                <div className={"ml-3"}><EditIcon/></div>
                            </Row>
                        </Col>
                    </Row>
                </div>
            )
    };

    block_unblockTutor = (isEnabled) => {
        if (isEnabled == 0) {
            return (<DoneIcon/>);
        } else {
            return (<BlockIcon/>);
        }
    }

    block_unblock = (isEnabled) => {
        console.log(isEnabled)
        if (isEnabled == 0) {
            return (<DoneIcon onClick={this.blockCompany}/>);
        } else {
            return (<BlockIcon onClick={this.blockCompany}/>);
        }
    }
    blockTutor = (id) => {

        const axios = require('axios');
        let url = localStorage.getItem('url');
        url += '?action=invertIsVerifiedTutorCompanyReturnsAll';

        let params = new URLSearchParams();
        params.append("id", id);

        axios({
            method: 'post',
            url: url,
            data: params
        }).then((res) => {
            console.log(res.data)
            this.setState({
                data: res.data
            })
        })

    }

    blockCompany = () => {

        const axios = require('axios');
        let url = localStorage.getItem('url');
        url += '?action=invertIsVerifiedCompany';

        let params = new URLSearchParams();
        params.append("id", this.state.companyID);

        axios({
            method: 'post',
            url: url,
            data: params
        }).then((res) => {
            console.log(res.data)
            this.setState({
                company: res.data
            })
        })

    }


    deactive_activated = (isEnabled) => {
        if (isEnabled == 1) {
            return ("Deaktivieren");
        } else {
            return ("Aktivieren");
        }
    }


    getVerified = (verified) => {
        if (verified === 0) {
            return "Nein"
        } else {
            return "Ja"
        }
    }

    getAllTutors = (id) => {
        const axios = require('axios');

        let url = localStorage.getItem('url');

        url += '?action=getTutorByCompanyId';


        let params = new URLSearchParams();
        params.append('id', id);


        axios({
            method: 'post',
            url: url,
            data: params
        }).then((res) => {
            console.log(res);
            this.setState({data: res.data})
        })
    };

    setDialogForEdit = () => {
        return (
            <Dialog open={this.state.dialogEditIsOpen}
                    classes={{paper: this.state.styles,}}
                    onClose={this.handleEditClose} fullWidth={true}
                    maxWidth={"sm"}
                    aria-labelledby="form-dialog-title"
            >
                <div>
                    <DialogTitle id="form-dialog-title">Unternehmen editieren</DialogTitle>
                    <Divider/>
                    <DialogContent>
                        <Form id='my-form' onSubmit={this.handleSubmitEdit}>
                            <EditCompany
                                handleChange={this.handleChange}
                                companyName={this.state.companyName}
                                address={this.state.address}
                                c_email={this.state.c_email}
                                c_phonenumber={this.state.c_phonenumber}
                            />
                        </Form>
                    </DialogContent>
                    <Divider className={"mt-2"}/>
                    <DialogActions className={"float-right"}>
                        <Button onClick={this.handleEditClose} color="primary">
                            Abbrechen
                        </Button>
                        <Button className={" mt-2 m-2"} form={"my-form"} color="primary"
                                type="submit">
                            Bearbeiten
                        </Button>
                    </DialogActions>
                    <Divider/>
                </div>
            </Dialog>
        )
    }
    handleSubmitEdit = event => {

        event.preventDefault();
        if (this.checkifStepEditFilledOut()) {

            let url = localStorage.getItem('url');

            let params = new URLSearchParams();

            params.append('companyname', this.state.companyName);
            params.append('address', this.state.address);
            params.append('c_email', this.state.c_email);
            params.append('phonenumber', this.state.c_phonenumber);
            params.append('company_id', this.state.companyID);


            const axios = require('axios');
            url += '?action=editCompany';

            axios({
                method: 'post',
                url: url,
                data: params
            }).then((res) => {
                console.log(res.data);
                this.handleEditClose();
                this.getCompanyById(this.state.companyID);

            });
        }

    }
    handleEditClose = () => {
        this.setState({
            dialogEditIsOpen: false
        })
    }
    handleEditOpen = () => {
        console.log("hey")
        this.setState({
            dialogEditIsOpen: true
        })
    }


    getCompanyById = (id) => {
        console.log(id)
        const axios = require('axios');

        let url = localStorage.getItem('url');
        url += '?action=getCompanyById';


        let params = new URLSearchParams();
        params.append('id', id);


        axios({
            method: 'post',
            url: url,
            data: params
        }).then((res) => {

            console.log("res", res);
            this.setState({
                company: res.data,
                companyName: res.data.name,
                address: res.data.address,
                c_email: res.data.email,
                c_phonenumber: res.data.phonenumber
            })
        })
    };

    openStudentInfo = (id) => {

        this.setState({
            redirect: null
        })

        this.setState({
            redirect: "/loggedin/Administration/ClassInformation/" + this.state.class_id + "/StudentInformation/" + id,
            redirectToLink: true
        })

        // this.setState({
        //     redirect: "./StudentInformation/" + id,
        //     redirectToLink: true
        // })
    };

}


export default CompanyInformation;
