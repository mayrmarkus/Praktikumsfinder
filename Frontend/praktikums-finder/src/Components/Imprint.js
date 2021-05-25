import React, {Component} from 'react';
import {Card} from "react-bootstrap";


class Imprint extends Component {

    render() {
        return (
            <div>

                <Card>
                    <Card.Img>
                    </Card.Img>
                    <Card.Header>
                        <h4>Impressum</h4>
                    </Card.Header>
                    <Card.Body>
                        <h5 className="card-title">Product Owner:</h5>
                        <p className="card-text">Alex Larentis</p>
                        <h5 className="card-title">Logo-Design:</h5>
                        <p className="card-text">Gabriel Puff</p>
                        <h5 className="card-title">Frontend:</h5>
                        <p className="card-text">Christoph Weiss</p>
                        <p className="card-text">Maximilian Mauroner</p>
                        <p className="card-text"><ins>Markus Mayr</ins></p>
                        <h5 className="card-title">Backend:</h5>
                        <p className="card-text">Maximilian Mauroner</p>
                        <p className="card-text">Kai Schweigkofler</p>
                        <p className="card-text">Christian Tutzer</p>
                        <h5 className="card-title">Bug-Finder:</h5>
                        <p className="card-text"><ins>Simon Röggla</ins></p>
                        <p className="card-text"><ins>Simon Müller</ins></p>
                    </Card.Body>
                </Card>
            </div>
        );
    }

}

export default Imprint;
