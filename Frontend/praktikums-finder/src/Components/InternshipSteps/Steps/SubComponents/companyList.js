import 'rc-steps/assets/index.css';
import 'rc-steps/assets/iconfont.css';
import React, {Component} from 'react';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css';
import Card from "react-bootstrap/Card";
import {Button, Form, Modal, ModalBody, Row, Col} from "react-bootstrap";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import {Divider, Snackbar} from "@material-ui/core";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import TextField from "@material-ui/core/TextField";

import Step1 from "./StepsForNewCompany/Step1";
import Step2 from "./StepsForNewCompany/Step2";
import Alert from "@material-ui/lab/Alert";

/**
 * @property onClick
 * @property isSelectable
 * @property data
 *
 */
class CompanyList extends Component {

    state = {
        selectedCompanyId: null,
        modalVisible: false,
        dialogDistrictIsOpen: false,
        dialogIsOpen: false,
        errorIsOpen: false,
        currentStep: 1,
        new_District: '',
        email: '',
        name: '',
        phonenumber: '',
        address: '',
        cap: '',
        districts: [],
        selectedOptionDistrict: "",
        specializations: [],
        selectedOptionSpecializations: "",
        createNewCompany: false
    };


    componentDidMount() {
        this.getAllDistricts();
        this.getAllSpecialization();
        if (this.props.default !== null) {
            this.setState({'selectedCompanyId': this.props.default})
        }
        ;

        this._next = this._next.bind(this)
        this._prev = this._prev.bind(this)
        this.handleChange = this.handleChange.bind(this);
    }


    getByDatabaseId = (id) => {

        let selectedCompany = undefined;

        this.props.data.map(v => {
            if (id === v.id) {
                selectedCompany = v;
            }
        })

        return selectedCompany;
    }
    handleNewDistrict = (e) => {
        this.setState({
            new_District: e.target.value
        });
    };
    handleChangeSpecializations = selectedOption => {
        this.setState(
            {selectedOptionSpecializations: selectedOption}
        );
    };
    handleChangeDistricts = selectedOption => {
        this.setState(
            {selectedOptionDistrict: selectedOption}
        );
    };
    _next = () => {
        let currentStep = this.state.currentStep
        if (this.checkifStepFilledOut()) {
            // If the current step is 1 or 2, then add one on "next" button click
            currentStep = currentStep >= 1 ? 2 : currentStep + 1
            this.setState({
                currentStep: currentStep
            })
        }
        console.log(currentStep)

    }

    _prev = () => {
        let currentStep = this.state.currentStep
            // If the current step is 2 or 3, then subtract one on "previous" button click
            currentStep = currentStep <= 1 ? 2 : currentStep - 1
            this.setState({
                currentStep: currentStep
            })
        
        console.log(currentStep)
    }


    render() {

        if (this.props.data === null)
            return null;


        let currentname = "";
        let currentaddress = "";
        let currentemail = "";
        let currentphonenumber = "";



        if (this.state.selectedCompanyId && this.props.data.length > 0  && this.getByDatabaseId(this.state.selectedCompanyId)) {


            let company = this.getByDatabaseId(this.state.selectedCompanyId);
            currentname = company.name;
            currentaddress = company.address;
            currentemail = company.email;
            currentphonenumber = company.phonenumber;
        }


        return (

            <div className="blockListWrapper" style={{height: "60vh", width: '95%', 'overflowY': 'auto'}}>
                {this.setNewCompany()}

                <div className={'internshipListItem'}>
                    <Card
                        className={'border border-primary '}
                        onClick={() => {
                            this.handleDialogOpen()
                        }}>
                        <h4 className={"m-1 mb-2"}>Neues Unternehmen</h4>
                        <div className={" d-flex align-items-center justify-content-center"}>
                            <h3>+</h3>
                        </div>
                    </Card>
                </div>
                {

                    this.props.data.map((v) => {

                        return (
                            <div key={v.id} className={'internshipListItem'}>
                                <Card
                                    className={this.state.selectedCompanyId === v.id && 'border border-primary'}
                                    onClick={() => {
                                        this.onClick(v.id)
                                            }}>
                                            <h1>{v.name}</h1>
                                        <br/>
                                        {v.address}
                                    </Card>
                                </div>
                            )
                        })
                    }



                <Modal onHide={() => {
                    this.setState({modalVisible: false})
                }} show={this.state.modalVisible}>
                    <Modal.Header closeButton>
                        <Modal.Title>Informationen über die Firma {currentname}</Modal.Title>
                    </Modal.Header>
                    <ModalBody>
                        <p>Adresse: <a href={"https://www.google.com/maps/search/" + currentaddress} target="_blank"
                                       rel="noopener noreferrer">{currentaddress}</a></p>
                        <p>E-Mail Adresse: <a href={"mailto:" + currentemail}>{currentemail}</a></p>
                        <p>Telefonnummer: <a href={"tel:" + currentphonenumber}>{currentphonenumber}</a></p>
                        <p></p>
                    </ModalBody>
                    <Modal.Footer>
                        <Button variant={"secondary"} onClick={() => {
                            this.setState({modalVisible: false})
                        }}>Schließen</Button>
                        <Button variant="primary" onClick={() => {
                            this.nextStep()
                        }}>Auswählen</Button>
                    </Modal.Footer>
                </Modal>
            </div>
            )
    }

    onClick = (key) => {

        this.setState({selectedCompanyId: key});
        if (this.props.showIntofmation !== null) {
            if (this.props.showIntofmation === true) {
                this.setState({modalVisible: true})
            }
        }
    };

    nextStep = () => {
        this.props.onClick(this.state.selectedCompanyId);
    }
    nextStepWithID = (companyID) => {
        this.props.onClick(companyID);
    }
    handleDialogClose = () => {
        this.setState({
            dialogIsOpen: false
        })
    };


    previousButton = () => {
        let currentStep = this.state.currentStep;
        if (currentStep !== 1) {
            return (
                <button
                    className="btn btn-secondary"
                    type="button" onClick={this._prev}>
                    Previous
                </button>
            )
        }
        // ...else return nothing
        return null;
    }

    nextButton = () => {
        let currentStep = this.state.currentStep;
        if (currentStep < 2) {
            return (
                <button
                    className="btn btn-primary float-right"
                    type="button" onClick={this._next}>
                    Next
                </button>
            )
        }
        return null;
    }
    handleClose = () => {
        this.setState({
            errorIsOpen: false
        })
    };

    handleChange(event) {
        const {name, value} = event.target
        this.setState({
            [name]: value
        })
    }

    checkifStepFilledOut = () => {
        var help = false;
        if (this.state.currentStep === 1) {
            let a = this.state.email;
            let b = this.state.name;
            let c = this.state.phonenumber;
            let d = this.state.address;
            let e = this.state.cap;
            help = !(!a || !b || !c || !d || !e);
        } else {
            let a = this.state.selectedOptionSpecializations;
            let b = this.state.selectedOptionDistrict;
            help = !(!a || !b);
        }
        if (!help) {
            this.setState({
                errorIsOpen: true
            });
        }
        return help;
    }


    setNewCompany = () => {

        return (<div>
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
                        <DialogTitle id="form-dialog-title">Neues Unternehmen hinzufügen</DialogTitle>
                        <Divider/>
                        <DialogContent>
                            <Form id='my-form' onSubmit={this.handleSubmit}>
                                <Step1
                                    currentStep={this.state.currentStep}
                                    handleChange={this.handleChange}
                                    email={this.state.email}
                                    name={this.state.name}
                                    phonenumber={this.state.phonenumber}
                                    address={this.state.address}
                                    cap={this.state.cap}
                                />
                                <Step2
                                    currentStep={this.state.currentStep}
                                    districts={this.state.districts}
                                    handleChangeDistricts={this.handleChangeDistricts}
                                    selectedOptionDistrict={this.state.selectedOptionDistrict}
                                    specializations={this.state.specializations}
                                    new_District={this.handleNewDistrict}
                                    newDistrictName={this.state.new_District}
                                    saveDistrictstoOptions={this.saveDistrictsOptions}
                                    handleChangeSpecializations={this.handleChangeSpecializations}
                                    selectedOptionSpecializations={this.state.selectedOptionSpecializations}
                                />
                            </Form>
                            {this.nextButton()}
                            {this.previousButton()}
                        </DialogContent>
                        <Divider className={"mt-2"}/>
                    <DialogActions className={"float-right"}>
                        <Button onClick={this.handleDialogClose} color="primary">
                            Abbrechen
                        </Button>
                        <Button className={" mt-2 m-2"} form={"my-form"} color="primary"
                                disabled={this.state.createNewCompany} type="submit">
                            Erstellen
                        </Button>
                    </DialogActions>
                        <Divider/>
                    </div>
                </Dialog>
            </div>
        )
    }
    saveDistrictsOptions = (arr) => {
        this.setState({
            selectedOptionDistrict: arr
        })
    }
    handleSubmit = event => {
        event.preventDefault();
        if (this.checkifStepFilledOut()) {
            console.log("alles ausgefüllt");


            let url = localStorage.getItem('url');
            let params = new URLSearchParams();

            params.append('address', this.state.address);
            params.append('email', this.state.email);
            params.append('companyname', this.state.name);
            params.append('phonenumber', this.state.phonenumber);
            params.append('cap', this.state.cap);
            params.append('districtname', this.state.selectedOptionDistrict.label);
            params.append('specializationsid', this.state.selectedOptionSpecializations.value);


            const axios = require('axios');
            url += '?action=createCompany';

            axios({
                method: 'post',
                url: url,
                data: params
            }).then((res) => {
                console.log(res.data);
                this.nextStepWithID(res.data.id);
            });

        }
    }

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

            console.log(newspecializations[0])
            this.setState({

                specializations: newspecializations
            });
        })

    };


    handleDialogOpen = () => {
        this.setState({
            dialogIsOpen: true
        })
    };


}


export default CompanyList;
