import React, {Component} from "react";
import {Breadcrumb, BreadcrumbItem, Button, Card, Modal} from "react-bootstrap";
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import {List, ListItem} from "@material-ui/core";
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ReactHtmlParser from 'react-html-parser';

import Typography from '@material-ui/core/Typography';

import SendIcon from '@material-ui/icons/Send';



class RatingMail extends Component {

    state = {
        finishedInternships: [],
        data: [],
        showWriteMail: false,
        mailContent: "Keine E-Mail ausgewählt"
    };

    componentDidMount() {
        this.loadEmail();
    }


    render() {
        return (
            <div className={'adminViewContent bg-light'}>
                <Breadcrumb>
                    <BreadcrumbItem href={'/loggedin/'}>Administration</BreadcrumbItem>
                    <BreadcrumbItem active={true} href={'/loggedin/'}>Praktikumsbewertung E-Mail</BreadcrumbItem>
                </Breadcrumb>

                <div className={"d-flex flex-row align-items-stretch"} style={{maxHeight: '80vh'}}>
                    <div className={"bg-white overflow-auto"}>
                        <List component="nav" aria-label="main mailbox folders">

                            <ListItem button divider onClick={() => this.sendToAll()}>
                                <ListItemText primary="Alle senden" />
                                <ListItemSecondaryAction>
                                    <IconButton onClick={() => this.sendToAll()}>
                                        <SendIcon/>
                                    </IconButton>
                                </ListItemSecondaryAction>
                            </ListItem>
                        </List>
                        <List component="nav" aria-label="secondary mailbox folders">
                            {this.displayMail()}
                        </List>
                    </div>
                    <Card className={"mx-2"} style={{flex: 1}}>
                        {ReactHtmlParser(this.state.mailContent)}
                    </Card>
                </div>

                <Modal show={this.state.showWriteMail} onHide={() => {
                    this.showComposeMail()
                }}>
                    <Modal.Header closeButton>
                        <Modal.Title>E-Mail schreiben</Modal.Title>
                    </Modal.Header>
                    <select>
                        <section></section>
                    </select>
                    <Modal.Body>

                    </Modal.Body>

                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => {
                            this.setState({showWriteMail: false})
                        }}>Abrechen</Button>
                        <Button variant="primary">Senden</Button>
                    </Modal.Footer>
                </Modal>

            </div>
        );
    }

    displayMail = () => {

        let ret = [];

        if (this.state.finishedInternships) {

            this.state.finishedInternships.map(value => {

                let chars = value.schoolpersonName.charAt(0) + value.schoolpersonName.split(' ')[1].charAt(0);
                chars = chars.toUpperCase();

                ret.push(
                    <ListItem style={{cursor: 'pointer'}} className={"bg-primary"}
                              onClick={() => this.openMail(value.id)} key={value.id}>
                        <ListItemAvatar>
                            <Avatar>
                                {chars}
                            </Avatar>
                        </ListItemAvatar>

                        <ListItemText
                            primary={value.studentName + " - " + value.companyName}
                            secondary={
                                <React.Fragment>
                                    <Typography
                                        component="span"
                                        variant="body2"
                                        className={"d-inline"}
                                        color="textPrimary"
                                    >
                                        {value.companyName}
                                    </Typography>
                                    {" nach: " + value.companyTutorName}
                                </React.Fragment>
                            }
                        />
                    </ListItem>);
            })
        }
        if(this.state.data){

            this.state.data.map(value => {

                let chars = value.schoolpersonName.charAt(0) + value.schoolpersonName.split(' ')[1].charAt(0);
                chars = chars.toUpperCase();

                ret.push(
                    <ListItem style={{cursor: 'pointer'}} onClick={() => this.openMail(value.id)} key={value.id}>
                        <ListItemAvatar>
                            <Avatar>
                                {chars}
                            </Avatar>
                        </ListItemAvatar>

                        <ListItemText
                            primary={value.studentName + " - " + value.companyName}
                            secondary={
                                <React.Fragment>
                                    <Typography
                                        component="span"
                                        variant="body2"
                                        className={"d-inline"}
                                        color="textPrimary"
                                    >
                                        {value.companyName}
                                    </Typography>
                                    {" nach: " + value.companyTutorName}
                                </React.Fragment>
                            }
                        />
                    </ListItem>);
            })


            return ret;
        }
    }

    showComposeMail = () => {
        window.open("/composeMail/", "", "width=1060,height=650");
    }


    loadEmail = () => {

        let url = localStorage.getItem('url');
        url += "?action=getAllEmailsSentAndNot";

        const axios = require('axios');

        axios({
            method: 'post',
            url: url,
        }).then((res) => {
            console.log(res.data)
            console.log(res.data.sent)
            this.setState({
                data: res.data.sent,
                finishedInternships: res.data.notSent
            });
        });
    }

    loadToSend = () => {


        let url = localStorage.getItem('url');
        url += "?action=getFinishedInternshipsToday";

        const axios = require('axios');

        axios({
            method: 'post',
            url: url,
        }).then((res) => {
            console.log(res.data)
            this.setState({finishedInternships: res.data});
        });
    }

    openMail = (id) => {


        let url = localStorage.getItem('url');
        url += "?action=getRatingEmailContent";

        let sp = new URLSearchParams();
        sp.append("id", id);

        const axios = require('axios');

        axios({
            method: 'post',
            url: url,
            data: sp
        }).then((res) => {
            let mailContent = res.data.content;
            console.log(mailContent)
            this.setState({mailContent});
        });

    }

    displayToSendMail() {
        if (this.state.finishedInternships != null) {
            let ret = [];

            this.state.finishedInternships.map(value => {

                ret.push(
                    <ListItem style={{cursor: 'pointer'}} className={"bg-primary"}
                              onClick={() => this.openMail(value.id)} key={value.id}>
                        <ListItemAvatar>
                            <Avatar>
                                TS
                            </Avatar>
                        </ListItemAvatar>

                        <ListItemText
                            primary={value.companyId}
                            secondary={
                                <React.Fragment>
                                    <Typography
                                        component="span"
                                        variant="body2"
                                        className={"d-inline"}
                                        color="textPrimary"
                                    >
                                        {value.id}
                                    </Typography>
                                </React.Fragment>
                            }
                        />
                    </ListItem>);
            })


            return ret;
        }
    }

    sendToAll= ()=> {
        let url = localStorage.getItem('url');
        url += "?action=sendAllDueRatingEmail";

        const axios = require('axios');

        axios({
            method: 'post',
            url: url,
        }).then((res) => {
            this.loadEmail();
        });
    }
}

export default RatingMail;
