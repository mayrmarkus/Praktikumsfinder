import 'rc-steps/assets/index.css';
import 'rc-steps/assets/iconfont.css';
import React, {Component} from 'react';
import {Alert, Col, Row} from "react-bootstrap";
import '../InternshipStepsStyle.css';
import Select from 'react-select'
import CompanyList from "./SubComponents/companyList";
import {Snackbar} from "@material-ui/core";


class SelectInternship extends Component {
    state = {
        data: [],
        districts: [],
        selectionOpen: false,
        selectedOption: -1,
        noCompanyFound: false,
        specialization: {
            id: 1,
            description: "Informatiker"
        }


    };

    componentDidMount() {

        const axios = require('axios');
        axios.defaults.headers.common['Auth-Token'] = localStorage.getItem('token');
        var start = {value: -1, label: "Alle"}
        this.setState(
            {selectedOption: start}
        );
        this.getAllCompanies();
        this.getAllDistricts();
    }


    render() {
        return (
            <div className={'d-flex justify-content-center align-items-center bg-light'}>
                <Col className={'justify-content-md-center'}>
                    <Row className={'justify-content-md-center'}>
                        <h1>Praktikumsbetrieb</h1>
                    </Row>
                    <Row className={'justify-content-md-center'}>
                        <Col>
                            {/* Select District */}
                            <div className={'form-group'}>
                                <label>Bezirk</label>
                                <Select
                                    options={this.state.districts}
                                    value={this.state.selectedOption}
                                    onChange={this.handleChange}
                                    placeholder={"Wählen sie hier Ihren Bezirk aus!"}
                                />
                            </div>
                        </Col>
                    </Row>
                    <Row>

                        <CompanyList showIntofmation={true} onClick={this.onCompanyClick}
                                     default={this.props.default}
                                     isSelectable={true}
                                     filterBy={this.state.selectedOption} data={this.state.data}/>


                    </Row>
                </Col>
                <Snackbar open={this.state.noCompanyFound} autoHideDuration={10000} onClose={() => {
                    this.setState({noCompanyFound: false})
                }}>
                    <Alert severity="error" onClose={this.handleCloseSnackbar}>
                        Kein Unternehmen in diesem Bezirk gefunden!
                    </Alert>
                </Snackbar>

            </div>
        );
    }

    handleCloseSnackbar = () => {
        this.setState({
            noCompanyFound: false
        })
    };


    getAllDistricts = () => {
        let url = localStorage.getItem('url');
        url += "?action=getAllVerifiedDistricts";

        const axios = require('axios');

        axios({
            method: 'post',
            url: url,
        }).then((res) => {
            var newdistricts = [];
            newdistricts.push({
                value: -1, label: "Alle"
            })
            res.data.map((row) => {
                newdistricts.push({value: row.id, label: row.name});
            });

            this.setState({districts: newdistricts});
        })
    };
    getAllCompanies = () => {
        let url = localStorage.getItem('url');
        url += "?action=getAllVerifiedCompanies";

        const axios = require('axios');

        axios({
            method: 'post',
            url: url,
        }).then((res) => {
            this.setState({data: res.data});
        })
    };


    getCompanysByDistrict = (input) => {
        let url = localStorage.getItem('url');
        url += "?action=getCompanyByDistrict";

        const axios = require('axios');

        let params = new URLSearchParams();
        params.append("id", input);

        axios({
            method: 'post',
            url: url,
            data: params
        }).then((res) => {
            /*When no return then displays Kein Prakitkum*/
            if (res.data.length === 0) {
                this.setState({
                    data: res.data,
                    noCompanyFound: true
                });
            } else {
                this.setState({
                    data: res.data,
                    noCompanyFound: false
                });
            }
        });
    }

    /**
     * Saves selected option in state
     */
    handleChange = selectedOption => {
        if (selectedOption) {
            if (selectedOption.value !== -1) {
                this.getCompanysByDistrict(selectedOption.value);
            } else {
                this.getAllCompanies();
            }
            this.setState(
                {selectedOption}
            );
        }

    };

    /**
     * Sends data to parent Component
     * @param id companyId
     */
    onCompanyClick = (id) => {
        console.log(id)
        this.props.setCompleted("company_id", id, 1)
    };
}


export default SelectInternship;