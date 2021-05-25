import 'rc-steps/assets/index.css';
import 'rc-steps/assets/iconfont.css';
import React, {Component} from 'react';
import {Button, Col, Collapse, Row} from "react-bootstrap";
import '../InternshipStepsStyle.css';
import ListTutor from "./SubComponents/ListTutor";
import Alert from "@material-ui/lab/Alert";
import {Snackbar} from "@material-ui/core";



class SelectTutor extends Component {
    state = {
        data: [],
        selectionOpen: false,
        noTutorFound: false
    };


    JsonToList = (id, searchInput) => {
        let url = localStorage.getItem('url');

        url += "?action=";
        let search = "";
        let url_search = "";
        switch (id) {
            case 1:
                search = "getAllSchoolpersons";
                url_search = url + search;
                break;
            case 2:
                search = "getSchoolpersonsByName&name=";
                url_search = url + search;
                break;

            default:
                search = "getAllSchoolpersons";
                url_search = url + search;
                break;
        }
        if (searchInput != null) {
            url_search = url_search + searchInput;
        }

        const axios = require('axios');
        axios({
            method: 'post',
            url: url_search,
        }).then((res) => {
            switch (id) {
                case 1:
                    this.setState({
                        data: res.data
                    });
                    break;
                case 2:
                    console.log(res.data);

                    if(res.data.length === 0){
                        this.setState({
                            data: res.data,
                            noTutorFound: true
                        });
                    }else{
                        this.setState({
                            data: res.data,
                            noTutorFound: false
                        });
                    }
                    break;
                default:
                    this.setState({
                        data: res.data
                    });
                    break;
            }

        })

    };

    componentDidMount() {
        window.addEventListener('load', this.JsonToList(1, null));

    }


    searchTutorByName = () => {
        let nameOfTutor = document.getElementById("search").value;
        if (nameOfTutor !== null || nameOfTutor !== "") {
            this.JsonToList(2, nameOfTutor);
        }
    };


    selectionOptions = () => {
        let invertedState = !this.state.selectionOpen;
        if (invertedState === true) {
            document.getElementById("selectOption").innerHTML = "Suchen";
        } else {
            this.searchTutorByName(document.getElementById("search").value);
            document.getElementById("selectOption").innerHTML = "Öffnen";
        }
        this.setState({selectionOpen: invertedState})
    };

    onClick = (key) => {
        this.props.setCompleted('tutor', key, 3)
    };

    render() {
        return (
            <div className={'d-flex justify-content-center align-items-center bg-light'}>
                <Col className={'justify-content-md-center'}>
                    <Row className={'justify-content-md-center'}>
                        <h1>Praktikumstutor</h1>
                    </Row>
                    <Row className={'justify-content-md-center'}>
                        <Collapse in={this.state.selectionOpen}>
                            <Col>
                                <div className={'row pt-2'}>
                                    <h5>Welchen Praktikumstutor hast du?</h5>
                                </div>
                                <div className={'row mb-4'}>
                                    <input className={'form-control col '} id={"search"}/>
                                </div>
                            </Col>
                        </Collapse>
                    </Row>
                    <Row className={' d-flex flex-wrap justify-content-around w-100 overflow-auto'}>
                        <Button className={'w-50'} variant={"outline-primary"} id={"selectOption"}
                                onClick={this.selectionOptions}>Suchen</Button> {/* searches for Tutor */}
                    </Row>
                    <Row>
                        <ListTutor onClick={this.onClick} default={this.props.default} data={this.state.data}/>
                    </Row>
                </Col>
                <Snackbar open={this.state.noTutorFound} autoHideDuration={10000} onClose={() => {
                    this.setState({noTutorFound: false})
                }}>
                    <Alert severity="info" onClose={this.handleCloseSnackbar}>
                        Kein Tutor gefunden!
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


export default SelectTutor;
