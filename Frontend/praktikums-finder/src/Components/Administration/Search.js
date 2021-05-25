import React, {Component} from "react";
import {
    Row,
    Col, Button, Card
} from "react-bootstrap";
import Avatar from "@material-ui/core/Avatar";
import {Redirect} from "react-router-dom";


class Search extends Component {


    state = {
        redirect: "",
        redirectToLink: false,
        search_data: null,
        offset: 0,
        previous_disabled: true,
        next_disabled: false,
        search_input: "",
    };

    componentDidMount() {
        this.getSearch(0, "");
    }

    nextPage = () => {
        if (!this.check_array_empty()) {
            let offset = this.state.offset;
            offset++;
            this.setState({
                offset: offset
            })
            this.setState({
                previous_disabled: false
            });
            this.getSearch(offset, this.state.search_input);
        }

    };
    previousPage = () => {
        let offset = this.state.offset;
        console.log(offset);
        if (offset === 0) {
            this.setState({
                previous_disabled: true
            })

        } else {
            offset--;
            this.setState({
                offset: offset
            });
            this.setState({
                next_disabled: false
            })
            this.getSearch(offset, this.state.search_input);
        }
    };

    check_array_empty() {
        if (this.state.search_data) {
            let data = this.state.search_data;
            let keys = Object.keys(data);
            let size = 0;
            keys.map(value => {
                if (value !== "offset") {
                    size += data[value].size;
                }
            });
            if (size < 33) {
                this.setState({
                    next_disabled: true
                });
                return true;
            } else {
                this.setState({
                    next_disabled: false
                });
                return false;
            }
        }
    }

    log_input = (e) => {
        if (e.target.value === '') {
            this.setState({
                search_input: ""
            })
        } else {
            this.setState({
                search_input: e.target.value
            })
        }


        this.getSearch(0, e.target.value);
    }

    render() {
        if (this.state.redirectToLink !== false) {
            return <Redirect to={this.state.redirect}/>;
        }
        return (
            <div className={'adminViewContent bg-light'}>
                <Row>
                    <Col className={"w-25"}>
                        <Button disabled={this.state.previous_disabled} className="float-left m-3"
                                onClick={this.previousPage}>Vorherige</Button>
                    </Col>
                    <Col className={"w-50"}>
                        <input className={"m-3 form-control"} autoFocus={true} type={"text"} onChange={this.log_input}/>

                    </Col>
                    <Col className={"w-25"}>
                        <Button disabled={this.state.next_disabled} className="float-right m-3"
                                onClick={this.nextPage}>Nächste</Button>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <div className={'p-1'}>
                            <div>
                                {this.displayData()}
                            </div>
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col className={"w-25"}>
                        <Button disabled={this.state.previous_disabled} className="float-left m-3"
                                onClick={this.previousPage}>Vorherige</Button>
                    </Col>
                    <Col className={"w-50"}>

                    </Col>
                    <Col className={"w-25"}>
                        <Button disabled={this.state.next_disabled} className="float-right m-3"
                                onClick={this.nextPage}>Nächste</Button>
                    </Col>
                </Row>
            </div>
        );
    }

    getSearch = (offset, input) => {

        let url = localStorage.getItem('url');

        url += "?action=getEntityBySearchInput";

        const axios = require('axios');

        const params = new URLSearchParams();
        params.append("searchinput", input);
        params.append("offset", offset);

        axios({
            method: 'post',
            url: url,
            data: params
        }).then((res) => {
            //console.log(res.data);
            this.setState({
                search_data: res.data
            })
            this.check_array_empty()


        })
    };

    displayData = () => {
        function hashCode(str) { // java String#hashCode
            var hash = 0;
            for (var i = 0; i < str.length; i++) {
                hash = str.charCodeAt(i) + ((hash << 5) - hash);
            }
            return hash;
        }

        function rgbToHex(rgb) {
            var hex = Number(rgb).toString(16);
            if (hex.length < 2) {
                hex = "0" + hex;
            }
            return hex
        }

        function intToRGB(i) {
            var c = (i & 0x00FFFFFF)
                .toString(16)
                .toUpperCase();

            return "00000".substring(0, 6 - c.length) + c;
        }

        function getRandomColor() {
            var colors = []
            var d = Math.random();
            if (d < 0.666) {
                colors.push(rgbToHex(0) + "" + rgbToHex(48) + "" + rgbToHex(80))

            } else {
                colors.push(rgbToHex(255) + "" + rgbToHex(203) + "" + rgbToHex(0))
            }
            return colors[0];
        }

        function firstCharAndLastChar(firstname, lastname) {
            let firstChar = (firstname.substring(0, 1)).toUpperCase();
            let lastChar = (lastname.substring(0, 1)).toUpperCase();
            return firstChar + lastChar;
        }

        function firstChar(name) {
            let firstChar = (name.substring(0, 1)).toUpperCase();
            return firstChar;
        }


        function isFirstname_Lastname_Undefined(firstname, lastname) {
            if (!firstname) {
                return (<div className={"d-flex align-items-baseline"}>
                    <Avatar style={{backgroundColor: "#" + getRandomColor()}}>MM</Avatar>
                    <div className={"ml-2"}>Max Muster</div>
                </div>)
            } else {
                return (<div className={"d-flex align-items-baseline"}>
                    <Avatar
                        style={{backgroundColor: "#" + getRandomColor()}}>{firstCharAndLastChar(firstname, lastname)}</Avatar>
                    <div className={"ml-2"}>{firstname + " " + lastname}</div>
                </div>)
            }
        }

        //{backgroundColor: "#" + intToRGB(hashCode(firstname + " " + lastname))}

        function isNameUndefined(name) {
            if (!name) {
                return (<div className={"d-flex align-items-baseline"}>
                    <Avatar style={{backgroundColor: "#" + getRandomColor()}}>MM</Avatar>
                    <div className={"ml-2"}>Max Muster</div>
                </div>)
            } else {
                return (<div className={"d-flex align-items-baseline"}>
                    <Avatar
                        style={{backgroundColor: "#" + getRandomColor()}}>{firstChar(name)}</Avatar>
                    <div className={"ml-2"}>{name}</div>
                </div>)
            }
        }

        if (this.state.search_data !== null) {
            let toDisplay = [];
            let data = this.state.search_data;
            var keys = Object.keys(data);

            let key = 0;

            keys.map((value) => {
                let arr = [];
                if (value !== "offset") {
                    data[value].items.map(data_value => {
                        if (value === "Unternehmen") {
                            arr.push(
                                <Card key={key++} bg={"light"} className={"m-2 w-25 text-center"}
                                      onClick={() => this.openCompanyInfo(data_value.id)}>
                                    <Card.Header>
                                        {isNameUndefined(data_value.name)}
                                    </Card.Header>
                                    <Card.Body>
                                        <h3>{data_value.name}</h3>
                                    </Card.Body>
                                </Card>
                            )
                        } else if (value === "Schüler") {
                            arr.push(
                                <Card key={key++} bg={"light"} className={"m-2 w-25 text-center"}
                                      onClick={() => this.openStudentInfo(data_value.id)}>
                                    <Card.Header>
                                        {isFirstname_Lastname_Undefined(data_value.firstname, data_value.surname)}
                                    </Card.Header>
                                    <Card.Body>
                                        <h3>{data_value.firstname + " " + data_value.surname}</h3>
                                    </Card.Body>
                                </Card>
                            )
                        } else {
                            arr.push(
                                <Card key={key++} bg={"light"} className={"m-2 w-25 text-center"}>
                                    <Card.Header>
                                        {isFirstname_Lastname_Undefined(data_value.firstname, data_value.surname)}
                                    </Card.Header>
                                    <Card.Body>
                                        <h3>{data_value.firstname + " " + data_value.surname}</h3>
                                    </Card.Body>
                                </Card>
                            )
                        }
                    });

                    toDisplay.push(<Card key={key++} className={"my-2"}> <Card.Header className={"text-center"}>
                        <h2>{value}</h2>
                    </Card.Header><Card.Body className={"d-flex flex-wrap flex-row"}>{arr}</Card.Body></Card>)

                }
            });


            return toDisplay
        }

    };
    openStudentInfo = (id) => {
        this.setState({
            redirect: "./StudentInformation/" + id,
            redirectToLink: true
        })


    };
    openCompanyInfo = (id) => {
        this.setState({
            redirect: "./CompanyInformation/" + id,
            redirectToLink: true
        })


    };

}

export default Search;