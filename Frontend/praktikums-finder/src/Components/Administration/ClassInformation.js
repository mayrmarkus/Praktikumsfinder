import 'rc-steps/assets/index.css';
import 'rc-steps/assets/iconfont.css';
import React, {Component} from 'react';
import {Breadcrumb, BreadcrumbItem, Card, Row} from "react-bootstrap";
import {Redirect} from "react-router-dom";
import Avatar from '@material-ui/core/Avatar';
import Col from "react-bootstrap/Col";
import DeleteIcon from '@material-ui/icons/Delete';
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import se from "moment/locale/se";
import DoneIcon from "@material-ui/icons/Done";
import BlockIcon from "@material-ui/icons/Block";
import EditIcon from "@material-ui/icons/Edit";

class ClassInformation extends Component {
    state = {
        redirect: "",
        redirectToLink: false,
        class_id: null,
        confirmOpen: false
    };


    componentDidMount() {
        console.log("hey")
        this.getClassInfo(this.props.match.params.id)
        this.setState({
            class_id: this.props.match.params.id
        });
        this.getAllStudents(this.props.match.params.id);

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
                    <BreadcrumbItem href={'/loggedin/Administration/ClassInformation/'}
                                    active={'active'}>ClassInformation</BreadcrumbItem>
                </Breadcrumb>
                {
                    this.showClassInfo()
                }
                {
                    this.showAllStudents()
                }
                <Dialog
                    open={this.state.confirmOpen}
                    onClose={this.setClose}
                    aria-labelledby="confirm-dialog"
                >
                    <DialogTitle id="confirm-dialog">{"Klasse löschen?"}</DialogTitle>
                    <DialogContent>Sind Sie sich sicher, diese Klasse zu löschen? </DialogContent>
                    <DialogActions>
                        <Button
                            variant="contained"
                            onClick={this.setClose}
                            className={"bg-dark text-white"}
                        >
                            Nein
                        </Button>
                        <Button
                            variant="contained"
                            onClick={this.deleteClass}
                            className={"bg-primary"}
                        >
                            Ja
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }

    showAllStudents = () => {
        if (this.state.data) {
            return (
                <div>
                    <Card>
                        <Card.Header>Schüler:</Card.Header>
                        <Card.Body>
                            <div className={'d-flex flex-row'}>
                                {
                                    this.state.data.map((v, k) => {
                                        return (
                                            <Card className={"m-2 p-2 w-25 "} key={k}
                                                  onClick={() => this.openStudentInfo(v.id)}>
                                                <div>
                                                    <span className={'text-secondary'}>Name:</span>
                                                    <span className={'text-highlited'}> {v.firstname} {v.surname}</span>
                                                </div>
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

    showClassInfo = () => {

        function hashCode(str) {
            var hash = 0;
            for (var i = 0; i < str.length; i++) {
                hash = str.charCodeAt(i) + ((hash << 5) - hash);
            }
            return hash;
        }

        function intToRGB(i) {
            var c = (i & 0x00FFFFFF)
                .toString(16)
                .toUpperCase();

            return "00000".substring(0, 6 - c.length) + c;
        }

        //gets first of firstname and FirstChar of lastname
        function firstCharAndLastChar(firstname, lastname) {
            let firstChar = (firstname.substring(0, 1)).toUpperCase();
            let lastChar = (lastname.substring(0, 1)).toUpperCase();
            return firstChar + lastChar;
        }

        function isTeacherUndefined(firstname, lastname) {
            if (firstname === undefined || lastname === undefined) {
                return (<div className={"d-flex align-items-center"}>
                    <Avatar style={{backgroundColor: "#" + intToRGB(hashCode("Max muster"))}}>MM</Avatar>
                    <div className={"ml-2"}>Max Mustermann</div>
                </div>)
            } else {
                return (<div className={"d-flex align-items-center"}>
                    <Avatar
                        style={{backgroundColor: "#" + intToRGB(hashCode(firstname + " " + lastname))}}>{firstCharAndLastChar(firstname, lastname)}</Avatar>
                    <div className={"ml-2"}>{firstname + " " + lastname}</div>
                </div>)
            }
        }


        if (this.state.classInfo)
            return (
                <div>
                    <h1>Informationen über die Klasse: {this.state.classInfo.name}</h1>

                    <Row className={"m-3"}>
                        <Col>
                            <Row>
                                <div style={{'margin': '0px'}} className={'text-secondary'}>Klassenlehrer:</div>
                            </Row>
                            <Row>
                                {isTeacherUndefined(this.state.classInfo.TeacherFirstName, this.state.classInfo.TeacherSurname)}
                            </Row>
                        </Col>
                        <Col>
                            <Row>
                                <div style={{'margin': '0px'}} className={'text-secondary'}>Token</div>
                            </Row>
                            <Row>
                                <div className={'p-2 ml-2'}>{this.state.classInfo.token}</div>
                            </Row>
                        </Col>
                        <Col>
                            <Row>
                                <div style={{'margin': '0px'}} className={'text-secondary'}>Schuljahr</div>
                            </Row>
                            <Row>
                                <div>{this.state.classInfo.schoolyear}</div>
                            </Row>
                        </Col>
                        <Col>
                            <Row>
                                <div style={{'margin': '0px'}}
                                     className={'text-secondary'}>{this.deactive_activated(this.state.classInfo.active)}</div>
                            </Row>
                            <Row>
                                <div className={"ml-4"}>{this.block_unblock(this.state.classInfo.active)}</div>
                            </Row>
                        </Col>
                        <Col>
                            <Row>
                                <div style={{'margin': '0px'}} className={'text-secondary'}>Klasse löschen</div>
                            </Row>
                            <Row onClick={() => this.setConfirmation()}>
                                <div style={{'marginLeft': '2rem'}}><DeleteIcon/></div>
                            </Row>
                        </Col>
                    </Row>

                </div>
            )
    };

    setClose = () => {
        this.setState({
            confirmOpen: false
        })
    }
    block_unblock = (isEnabled) => {
        console.log(isEnabled)
        if (isEnabled == 0) {
            return (<DoneIcon onClick={this.blockClass}/>);
        } else {
            return (<BlockIcon onClick={this.blockClass}/>);
        }
    }
    blockClass = () => {

        const axios = require('axios');
        let url = localStorage.getItem('url');
        url += '?action=invertEnabledSchoolclass';

        let params = new URLSearchParams();
        params.append("id", this.state.class_id);

        axios({
            method: 'post',
            url: url,
            data: params
        }).then((res) => {
            console.log(res.data)
            this.setState({classInfo: res.data})
        })
    }

    deactive_activated = (isEnabled) => {
        if (isEnabled == 1) {
            return ("Deaktivieren");
        } else {
            return ("Aktivieren");
        }
    }

    deleteClass = () => {
        const axios = require('axios');

        let url = localStorage.getItem('url');
        url += '?action=deleteSchoolclass';

        let params = new URLSearchParams();
        params.append('schoolclass_id', this.state.class_id);

        axios({
            method: 'post',
            url: url,
            data: params
        }).then((res) => {
            this.toAdministration();
            console.log(res);
        })
        this.setClose();
    }
    toAdministration = () => {
        this.setState({
            redirect: "/loggedin/Administration/",
            redirectToLink: true
        })
    };
    setConfirmation = () => {
        this.setState({
            confirmOpen: true
        })
    }

    getAllStudents = (id) => {
        const axios = require('axios');

        let url = localStorage.getItem('url');

        url += '?action=getStudentByClass';

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


    getClassInfo = (id) => {
        console.log(id)
        const axios = require('axios');

        let url = localStorage.getItem('url');
        url += '?action=getClassById';

        let params = new URLSearchParams();
        params.append('id', id);

        axios({
            method: 'post',
            url: url,
            data: params
        }).then((res) => {

            console.log("res", res);
            this.setState({classInfo: res.data})
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


export default ClassInformation;
