import React, {Component} from 'react';
import {Form, Row, Button} from "react-bootstrap";
import Select from "react-select";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import TextField from "@material-ui/core/TextField";
import DialogActions from "@material-ui/core/DialogActions";

class Step2 extends Component {
    state = {
        dialogDistrictIsOpen: false
    }

    render() {
        if (this.props.currentStep !== 2) { // Prop: The current step
            return null
        }
        var style = {
            height: "18vh"
        }
        // The markup for the Step 1 UI
        return (
            <div>
                {this.setDialogDistrict()}
                <Row className={'justify-content-md-center mt-2 ml-3 mr-3'}>
                    <div className={"w-75"}>
                        <Form.Label>Berzirke</Form.Label>
                        <div className={"d-flex justify-content-between"}>
                            <div className={"w-75 mr-2"}>
                                <Select
                                    className="basic-single"
                                    classNamePrefix="select"
                                    name={"selectedOptionDistrict"}
                                    isSearchable={true}
                                    isClearable={true}
                                    options={this.props.districts}
                                    value={this.props.selectedOptionDistrict}
                                    onChange={this.props.handleChangeDistricts}
                                    placeholder={"Wählen sie hier den Bezirk aus!"}
                                />
                            </div>
                            <div className={"ml-2 w-25"}>
                                <Button className={"btn btn-primary"}
                                        onClick={() => this.handleDialogOpenDistrict()}>Neuer
                                    Bezirk</Button>
                            </div>
                        </div>
                    </div>
                </Row>
                <Row className={'justify-content-md-center ml-3 mr-3'}>
                    <div className={"w-75"}>
                        <Form.Label>Spezialisierung</Form.Label>
                        <div className={"d-flex justify-content-between"}>
                            <div className={"w-100 mr-2"}>
                                <Select
                                    className="basic-single"
                                    classNamePrefix="select"
                                    name={"selectedOptionSpecializations"}
                                    isSearchable={true}
                                    options={this.props.specializations}
                                    value={this.props.selectedOptionSpecializations}
                                    isClearable={true}
                                    onChange={this.props.handleChangeSpecializations}
                                    placeholder={"Wählen sie hier die Fachrichtung aus!"}
                                />
                            </div>
                        </div>
                    </div>
                </Row>
                <div style={style}>
                </div>
            </div>
        )
    }

    setDialogDistrict = () => {
        return (
            <Dialog open={this.state.dialogDistrictIsOpen} onClose={this.handleDialogCloseDistrict}
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
                        onChange={this.props.new_District}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.handleDialogCloseDistrict} color="primary">
                        Abbrechen
                    </Button>
                    <Button onClick={this.handleDialogSaveDistrict} color="primary">
                        Speichern
                    </Button>
                </DialogActions>
            </Dialog>
        )
    }

    handleDialogOpenDistrict = () => {
        this.setState({
            dialogDistrictIsOpen: true
        })
    }
    handleDialogCloseDistrict = () => {
        this.setState({
            dialogDistrictIsOpen: false
        })
    }
    handleDialogSaveDistrict = () => {
        this.setState({
            dialogDistrictIsOpen: false
        });
        const newDistrictArr = {value: this.props.newDistrictName, label: this.props.newDistrictName};
        this.props.districts.push({
            value: this.props.newDistrictName, label: this.props.newDistrictName
        });
        this.props.saveDistrictstoOptions(newDistrictArr);

    }

}


export default Step2;

