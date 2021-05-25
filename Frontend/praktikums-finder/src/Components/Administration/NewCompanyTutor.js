import React, {Component} from 'react';
import {Form, Row} from "react-bootstrap";

class NewCompanyTutor extends Component {

    render() {

        return (
            <div>
                <Row className={'justify-content-md-center ml-3 mr-3'}>
                    <Form.Group controlId="firstname" className={"mt-3 w-75"}>
                        <Form.Label>Vorname</Form.Label>
                        <Form.Control type={"text"} name={"firstname"} value={this.props.firstname}
                                      onChange={this.props.handleChange} required/>
                    </Form.Group>
                </Row>
                <Row className={'justify-content-md-center ml-3 mr-3'}>
                    <Form.Group controlId="surname" className={"mt-3 w-75"}>
                        <Form.Label>Nachname</Form.Label>
                        <Form.Control type={"text"} name={"surname"} value={this.props.surname}
                                      onChange={this.props.handleChange} required/>
                    </Form.Group>
                </Row>
                <Row className={'justify-content-md-center ml-3 mr-3'}>
                    <Form.Group controlId="email" className={"mt-3 w-75"}>
                        <Form.Label>Email</Form.Label>
                        <Form.Control type={"email"} name={"email"} value={this.props.email}
                                      title={''}
                                      onChange={this.props.handleChange} required/>
                    </Form.Group>
                </Row>
                <Row className={'justify-content-md-center ml-3 mr-3'}>
                    <Form.Group controlId="phonenumber" className={"mt-3 w-75"}>
                        <Form.Label>Phonenumber</Form.Label>
                        <Form.Control type="tel" name={"phonenumber"}
                                      value={this.props.phonenumber} pattern={"[- \s\./0-9]{9,12}"}
                                      title={'z.B 0471 123456 oder 333 487 9809'}
                                      onChange={this.props.handleChange} required/>
                    </Form.Group>
                </Row>

            </div>
        );
    }
}


export default NewCompanyTutor;
