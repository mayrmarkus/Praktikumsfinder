import React, {Component} from 'react';
import {Form, Row} from "react-bootstrap";

class Step1 extends Component {
    render() {
        if (this.props.currentStep !== 1) { // Prop: The current step
            return null
        }
        // The markup for the Step 1 UI
        return (
            <div>
                <Row className={'justify-content-md-center ml-3 mr-3'}>
                    <Form.Group controlId="formUsername" className={"mt-3 w-75"}>
                        <Form.Label>Namen des Unternehmens</Form.Label>
                        <Form.Control type={"text"} name={"name"} value={this.props.name}
                                      onChange={this.props.handleChange} required/>
                    </Form.Group>
                </Row>

                <Row className={'justify-content-md-center ml-3 mr-3'}>
                    <Form.Group controlId="formCompanyEmail" className={"w-75"}>
                        <Form.Label>Email des Unternehmens</Form.Label>
                        <Form.Control type={"email"} name={"email"} value={this.props.email}
                                      onChange={this.props.handleChange} required/>
                    </Form.Group>
                </Row>
                <Row className={'justify-content-md-center ml-3 mr-3'}>
                    <Form.Group controlId="formPhonenumber" className={"w-75"}>
                        <Form.Label>Telefonnummer des Unternehmens</Form.Label>
                        <Form.Control type={"text"} name={"phonenumber"}
                                      value={this.props.phonenumber}
                                      onChange={this.props.handleChange} required>
                        </Form.Control>
                    </Form.Group>
                </Row>
                <Row className={'justify-content-md-center ml-3 mr-3'}>
                    <div className={"w-75"}>
                        <div className={"d-flex justify-content-between"}>
                            <div className={"w-75 mr-2"}>
                                <Form.Group controlId="formAddress">
                                    <Form.Label>Adresse</Form.Label>
                                    <Form.Control type={"text"} name={"address"}
                                                  value={this.props.address}
                                                  onChange={this.props.handleChange} required>
                                    </Form.Control>
                                </Form.Group>
                            </div>
                            <div className={"w-25"}>
                                <Form.Group controlId="formCap">
                                    <Form.Label>PLZ</Form.Label>
                                    <Form.Control type={"text"} name={"cap"}
                                                  value={this.props.cap}
                                                  onChange={this.props.handleChange} required
                                                  pattern={"[0-9]{5,6}"}
                                    >
                                    </Form.Control>
                                </Form.Group>
                            </div>
                        </div>
                    </div>
                </Row>
            </div>
        )
    }
}

export default Step1;