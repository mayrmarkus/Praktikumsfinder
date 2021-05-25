import 'rc-steps/assets/index.css';
import 'rc-steps/assets/iconfont.css';
import React, {Component} from 'react';
import {Button, Col, Collapse, Form, Row} from "react-bootstrap";
import '../InternshipStepsStyle.css';
import ListTutor from "./SubComponents/ListTutor";
import Alert from "@material-ui/lab/Alert";
import {Divider, Snackbar} from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import Select from "react-select";
import Card from "react-bootstrap/Card";
import Avatar from "@material-ui/core/Avatar";


class SelectTutorCompany extends Component {
    state = {
        data: [],
        selectionOpen: false,
        noTutorFound: false
    };


    componentDidMount() {
        this.loadData();

    }

    loadData = () => {
        const axios = require('axios');
        let url = localStorage.getItem('url')
        url += "?action=getTutorByCompanyId";
        let params = new URLSearchParams();
        params.append('id', this.props.companyId);
        axios({
            method: 'post',
            url,
            data: params
        }).then((res) => {
            if (res.data.length === 0) {
                this.setState({
                    data: res.data,
                    noTutorFound: true
                });
            } else {
                this.setState({
                    data: res.data,
                    noTutorFound: false
                });
            }
        })
    }


    onClick = (key) => {
        this.props.setCompleted('tutor_company_id', key, 4)

    };


    render() {
        return (
            <div className={'d-flex justify-content-center align-items-center bg-light'}>
                <Col className={'justify-content-md-center'}>
                    <Row className={'justify-content-md-center'}>
                        <h1>Firmentutor</h1>
                    </Row>
                    <Row className={'justify-content-md-center'}>
                        <Collapse in={this.state.selectionwOpen}>
                            <Col>
                                <div className={'row pt-2'}>
                                    <h5>Welchen Praktikumstutor hast du?</h5>
                                </div>
                            </Col>
                        </Collapse>
                    </Row>
                    <Row>
                        <ListTutor onClick={this.onClick} default={this.props.default} data={this.state.data}/>

                    </Row>
                </Col>
                <Snackbar open={this.state.noTutorFound} autoHideDuration={10000} onClose={() => {
                    this.setState({noTutorFound: false})
                }}>
                    <Alert severity="info" onClose={this.handleCloseSnackbar}>
                        Kein Tutor für diese Firma gefunden!
                    </Alert>
                </Snackbar>
            </div>
        );
    }

    handleCloseSnackbar = () => {
        this.setState({
            noTutorFound: false
        })
    };
}


export default SelectTutorCompany;
