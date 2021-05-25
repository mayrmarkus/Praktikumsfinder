import 'rc-steps/assets/index.css';
import 'rc-steps/assets/iconfont.css';
import React, {Component} from 'react';
import {Col, Row} from "react-bootstrap";

import logo from '../img/logos/Lbs/LogoVertical.png'
import {Link} from "react-router-dom";

class Footer extends Component {
    state = {
    };

    render() {
        return (
            <div className={"w-100 p-4 mt-2 d-flex justify-stretch bg-light  align-items-center "}>
                    <div className={"flex-fill"}>
                        <Row>

                            <Col className={" d-flex"}><img width={100} src={logo} alt="Logo"/></Col>
                        </Row>
                    </div>
                    <div className={"text-center flex-fill"}>
                        <p>Dies ist ein Projekt der 4. Fachrichtung Informatik der Landesberufsschule für Handwerk und
                            Industrie Bozen</p>
                        <a href={"http://www.bozen.berufsschule.it/"}>Zur Schulseite</a>
                    </div>
                    <div className={"text-right flex-fill"}>
                        <div className={"m-1"}>(C) Praktikumsfinder 2020</div>
                        <Link to={"/impressum"}>Zum Impressum </Link>
                    </div>
            </div>
        );
    }
}

export default Footer;
