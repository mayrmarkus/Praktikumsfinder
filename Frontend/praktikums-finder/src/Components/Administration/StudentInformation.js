import 'rc-steps/assets/index.css';
import 'rc-steps/assets/iconfont.css';
import React, {Component} from 'react';
import {Accordion, Breadcrumb, BreadcrumbItem, Card, Row} from "react-bootstrap";
import Avatar from "@material-ui/core/Avatar";
import Col from "react-bootstrap/Col";
import BlockIcon from '@material-ui/icons/Block';
import DoneIcon from '@material-ui/icons/Done';

class StudentInformation extends Component {
    state = {
        class_id: 1,
        internships: null,
        studentInfo: ""
    };

    componentDidMount() {
        if (this.props.match.params.class_id !== 0) {
            this.getStudent(this.props.match.params.id);
            this.setState({
                class_id: this.props.match.params.class_id
            });
        }

        this.getInternships(this.props.match.params.id)
    }

    checkClassID = (class_id) => {
        if (!this.props.match.params.class_id) {
            return (<BreadcrumbItem
                href={'/loggedin/Administration/ClassInformation/' + class_id}>ClassInformation</BreadcrumbItem>);
        } else {
            return (<BreadcrumbItem href={'/loggedin/Administration/StudentOverview'}>Alle Schüler</BreadcrumbItem>);
        }

    }


    render() {

        return (
            <div className={'adminViewContent bg-light'}>
                <Breadcrumb>
                    <BreadcrumbItem href={'/loggedin/Administration'}>Administration</BreadcrumbItem>
                    {this.checkClassID(this.state.class_id)}
                    <BreadcrumbItem href={'/loggedin/Administration'}
                                    active={'active'}>StudentInformation</BreadcrumbItem>
                </Breadcrumb>
                <h1>Hier finden Sie alle Infos zu diesem Schüler</h1>
                {this.state.studentInfo}
                <Card>
                    <Card.Header>
                        <div>Praktikas</div>
                    </Card.Header>
                    <Accordion defaultActiveKey="0">
                        {this.showInternships()}
                    </Accordion>
                </Card>

            </div>
        );
    }

    showStudent = () => {

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

        function isStudentUndefined(firstname, lastname) {
            if (!firstname || !lastname) {
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

        if (this.state.data) {
            let v = this.state.data
            let arr = [];
            arr.push(
                <div key={v.id}>
                    <Row className={"m-3"}>
                        <Col>
                            <Row>
                                <div style={{'margin': '0px'}} className={'text-secondary'}>Name</div>
                            </Row>
                            <Row>
                                {isStudentUndefined(v.firstname, v.surname)}
                            </Row>
                        </Col>
                        <Col>
                            <Row>
                                <div style={{'margin': '0px'}} className={'text-secondary'}>Email</div>
                            </Row>
                            <Row>
                                <div>{v.email}</div>
                            </Row>
                        </Col>
                        <Col>
                            <Row>
                                <div style={{'margin': '0px'}} className={'text-secondary'}>Verifikation</div>
                            </Row>
                            <Row>
                                <div>{this.verified(v)}</div>
                            </Row>
                        </Col>
                        <Col>
                            <Row>
                                <div style={{'margin': '0px'}}
                                     className={'text-secondary'}>{this.deactive_activated(v.is_enabled)}</div>
                            </Row>
                            <Row>
                                <div className={"ml-4"}>{this.block_unblock(v.is_enabled)}</div>
                            </Row>
                        </Col>
                    </Row>
                </div>
            )
            this.setState({
                studentInfo: arr
            })
        }


    };


    showInternships = () => {


        if (this.state.internships) {

            let objectnames = Object.keys(this.state.internships);

            let allinternships = [];
            for (var i = 0; i < objectnames.length; i++) {
                var temp = objectnames[i].split(",")[0].split("-")[0]
                if (allinternships[temp]) {
                    allinternships[temp].push(this.state.internships[objectnames[i]])
                } else {
                    allinternships[temp] = [];
                    allinternships[temp].push(this.state.internships[objectnames[i]])
                }

            }


            let toDisplay = [];


            let allObjectKeys = Object.keys(allinternships)
            for (let i = 0; i < allObjectKeys.length; i++) {
                let cardheader = [];
                let currentObject = allinternships[allObjectKeys[i]];
                currentObject.map((z) => {
                    let card_body = [];
                    z.internships.map((v, index) => {
                        if (z.internships.internshipcounter !== 0) {
                            card_body.push(
                                <Card key={index} style={{width: "200px"}} className={"d-inline-block"}>
                                    <Card.Header>{v.companyname}</Card.Header>
                                    <Card.Body>
                                        <div>Anfang: {v.startdate}</div>
                                        <div>Ende: {v.enddate}</div>
                                        <div>Bewertung: {v.rating}</div>
                                    </Card.Body>
                                </Card>)
                        } else {
                            card_body.push(<h4>Kein Praktikum</h4>)
                        }
                    })


                    cardheader.push(
                        <Card key={i + z.internships[0].classname}>
                            <Card.Header>
                                <Accordion.Toggle as={'div'} variant="text" className={'w-100 h-100'}
                                                  eventKey={z.internships[0].classname}>
                                    {z.internships[0].classname}
                                </Accordion.Toggle>
                            </Card.Header>
                            <Accordion.Collapse eventKey={z.internships[0].classname}>
                                <Card.Body>
                                    {card_body}
                                </Card.Body>
                                </Accordion.Collapse>
                            </Card>
                        )

                    }
                )

                toDisplay.push(
                    <div key={i + "key"} className={'w-100'}>
                        <Card className={"m-2"}>
                            <Card.Header>
                                {allObjectKeys[i]}
                            </Card.Header>
                            <Card.Body>
                                {cardheader}
                            </Card.Body>


                        </Card>
                    </div>
                )
            }
            return toDisplay
        }
    };

    getStudent = (id) => {
        const axios = require('axios');
        let url = localStorage.getItem('url');
        url += '?action=getStudentById';

        let params = new URLSearchParams();
        params.append("id", id);

        axios({
            method: 'post',
            url: url,
            data: params
        }).then((res) => {
            this.setState({data: res.data})
            this.showStudent();
        })
    };

    getInternships = (id) => {
        const axios = require('axios');

        let url = localStorage.getItem('url');
        url += '?action=getInternshipByStudent';

        let params = new URLSearchParams();
        params.append("id", id);

        let that = this;

        axios({
            method: 'post',
            url: url,
            data: params
        }).then((res) => {
            that.setState({internships: res.data})
        });

    }

    verified = (v) => {
        if (v.is_verified === "1") {
            return "Verifiziert";
        } else
            return "Nicht verifiziert";
    }
    block_unblock = (isEnabled) => {
        if (isEnabled !== 1) {
            return (<DoneIcon onClick={this.block}/>);
        } else {
            return (<BlockIcon onClick={this.block}/>);
        }
    }
    block = () => {
        const axios = require('axios');
        let url = localStorage.getItem('url');
        url += '?action=invertEnbaledStudent';

        let params = new URLSearchParams();
        params.append("id", this.state.data.id);

        axios({
            method: 'post',
            url: url,
            data: params
        }).then((res) => {
            this.setState({
                data: res.data
            })
            this.showStudent();
        })
    }
    deactive_activated = (isEnabled) => {
        if (isEnabled === 1) {
            return ("Deaktivieren");
        } else {
            return ("Aktivieren");
        }
    }
}


export default StudentInformation;