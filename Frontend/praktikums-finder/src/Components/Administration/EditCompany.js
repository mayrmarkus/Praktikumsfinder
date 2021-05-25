import React, {Component} from 'react';
import {Form, Row} from "react-bootstrap";

class EditCompany extends Component {
    render() {
        return (
            <div>
                <Row className={'justify-content-md-center ml-3 mr-3'}>
                    <Form.Group controlId="companyName" className={"mt-3 w-75"}>
                        <Form.Label>Name</Form.Label>
                        <Form.Control type={"text"} name={"companyName"} value={this.props.companyName}
                                      onChange={this.props.handleChange} required/>
                    </Form.Group>
                </Row>
                <Row className={'justify-content-md-center ml-3 mr-3'}>
                    <Form.Group controlId="c_email" className={"mt-3 w-75"}>
                        <Form.Label>Email</Form.Label>
                        <Form.Control type={"email"} name={"c_email"} value={this.props.c_email}
                                      onChange={this.props.handleChange} required/>
                    </Form.Group>
                </Row>
                <Row className={'justify-content-md-center ml-3 mr-3'}>
                    <Form.Group controlId="c_phonenumber" className={"mt-3 w-75"}>
                        <Form.Label>Telefonnummer</Form.Label>
                        <Form.Control type="tel" name={"c_phonenumber"}
                                      value={this.props.c_phonenumber} pattern={"[- \s\./0-9]{9,12}"}
                                      title={'z.B 0471 123456 oder 333 487 9809'}
                                      onChange={this.props.handleChange} required/>
                    </Form.Group>
                </Row>
                <Row className={'justify-content-md-center ml-3 mr-3'}>
                    <Form.Group controlId="address" className={"mt-3 w-75"}>
                        <Form.Label>Adresse</Form.Label>
                        <Form.Control type={"text"} name={"address"} value={this.props.address}
                                      onChange={this.props.handleChange} required/>
                    </Form.Group>
                </Row>
            </div>
        );
    }
}

export default EditCompany;
