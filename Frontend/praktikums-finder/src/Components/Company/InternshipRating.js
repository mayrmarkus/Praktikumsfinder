import 'rc-steps/assets/index.css';
import 'rc-steps/assets/iconfont.css';
import React, {Component} from 'react';
import {Breadcrumb, BreadcrumbItem, Button, ProgressBar} from "react-bootstrap";
import {Redirect} from "react-router-dom";
import {Radio} from 'antd';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';


class InternshipRating extends Component {
    state = {
        redirect: "",
        currentRatingIndex: 1,
        criteria: [
            {
                label: 'ungenügend',
                rating: "1"
            },
            {
                label: 'genügend',
                rating: "2"
            },
            {
                label: 'befriedigend',
                rating: "3"
            },
            {
                label: 'gut',
                rating: "4"
            },
            {
                label: 'sehr gut',
                rating: "5"
            }
        ],
        redirectToLink: false,
        ratingcriteria: [],
        internshipId: this.props.match.params.id,
        dialogIsOpen: false
    };

    componentDidMount() {
        this.getInternshipData();
    }

    changeRating = (e) => {
        this.setState({currentRatingIndex: this.state.currentRatingIndex + 1})

        let id = e.target.name;
        let value = e.target.value;
        let currentValues = this.state.ratingcriteria;
        currentValues[id - 1].rating = value;

        this.setState({
            ratingcriteria: currentValues
        })
    }
    getInternshipData = () => {
        if (this.state.internshipId) {
            let url = localStorage.getItem('url');
            let user = JSON.parse(localStorage.getItem('user'));
            url += "?action=getEvaluationPointsByInternship";
            const axios = require('axios');
            const params = new URLSearchParams();
            params.append("id", this.state.internshipId);
            params.append('tutor_id', user.id)
            axios({
                method: 'post',
                url: url,
                data: params
            }).then((res) => {
                if (res.data !== 'NotTutorForInternship') {
                    this.setState({
                        ratingcriteria: res.data
                    });
                }
            })
        }
    }

    getRatingcriteria = () => {

        if (this.state.ratingcriteria !== null) {
            if (true) {
                let toDisplay = [];
                let criteria = [];

                this.state.criteria.map((s, k) => {
                    criteria.push(<Radio.Button className={"m-2"} key={k} value={s.rating}
                                                name={k}>{s.label}</Radio.Button>)
                });
                toDisplay.push(
                    this.state.ratingcriteria.map((s, k) => {
                        let rating = this.state.ratingcriteria[k].rating;
                        return (
                            <div key={k} hidden={k != this.state.currentRatingIndex}>
                                <h1 className={'mt-2'} id={s.name}> {s.name}</h1>
                                <Radio.Group name={s.id} onChange={this.changeRating} defaultValue={"" + rating + ""}>
                                    {criteria}
                                </Radio.Group>
                            </div>)

                    })
                )
                {
                    this.isAllowed(toDisplay)
                }
                return toDisplay;
            }
        }
    }

    getEvaluationofInternship = () => {
        let evaluationsPoints = this.state.ratingcriteria;
        let url = localStorage.getItem('url');
        url += "?action=insertInternshipRating&internship_id=" + this.state.internshipId;
        const axios = require('axios');
        const params = new URLSearchParams();
        console.log(evaluationsPoints)
        for (let i = 0; i < evaluationsPoints.length; i++) {
            var temp = [];
            temp.push("id", evaluationsPoints[i].id);
            temp.push("name", evaluationsPoints[i].name);
            temp.push("description", evaluationsPoints[i].description);
            temp.push("rating", evaluationsPoints[i].rating);
            params.append(i, JSON.stringify(temp))
        }
        axios({
            method: 'post',
            url: url,
            data: params
        }).then((res) => {
            this.setState({companyData: res.data});
            let worked = true;
            if (res.data === false) {
                worked = false;
            }
            for (let i = 0; i < evaluationsPoints.length && worked === true; i++) {
                if (res.data[i] === 'false') {
                    worked = false;
                }
            }
            if (worked === false) {
                console.log("error", res.data);
            } else {
                console.log("worked", res.data);
                this.openInternshipData(this.state.internshipId)
            }
        })
        this.setState({
            dialogIsOpen: false
        })

    };

    isAllowed = (toDisplay) => {
        if (this.state.ratingcriteria.length !== 0 && this.state.currentRatingIndex == this.state.ratingcriteria.length) {
            toDisplay.push(
                <button className={"btn btn-primary w-25 mt-1"} key={'button'} onClick={this.handleClickOpen}>Bewertung
                    abschicken</button>);
        }
    };
    handleClickOpen = () => {
        this.setState({
            dialogIsOpen: true
        })
    };

    handleClose = () => {
        this.setState({
            dialogIsOpen: false
        })
    };
    prevStep = () => {
        this.setState({currentRatingIndex: this.state.currentRatingIndex - 1})
    }

    nextStep = () => {
        this.setState({currentRatingIndex: this.state.currentRatingIndex + 1})
    }

    render() {


        if (this.state.redirectToLink !== false) {
            return <Redirect to={this.state.redirectToLink}/>;
        }
        return (
            <div className={'classViewContent bg-light'}>
                <Breadcrumb>
                    <BreadcrumbItem href={'/loggedin/company'}>Unternehmen</BreadcrumbItem>
                    <BreadcrumbItem onClick={() => this.openInternshipData(this.state.internshipId)}>Praktikums
                        Status</BreadcrumbItem>
                    <BreadcrumbItem href={'/loggedin/company/InternshipRating'} active>Rating</BreadcrumbItem>
                </Breadcrumb>

                <div>
                    <div>
                        <ProgressBar
                            label={this.state.currentRatingIndex + "/" +this.state.ratingcriteria.length}
                            now={this.state.currentRatingIndex / this.state.ratingcriteria.length * 100}></ProgressBar>
                    </div>

                    <div className={"w-50 m-auto text-center"}>
                        {
                            this.getRatingcriteria()
                        }
                        <div className={"w-100 d-flex justify-content-between"}>
                            <Button onClick={() => this.prevStep()}>Zurück</Button>
                            <Button onClick={() => this.nextStep()}>Weiter</Button>
                        </div>
                    </div>
                </div>
                <Dialog
                    open={this.state.dialogIsOpen}
                    onClose={this.handleClose}
                >
                    <DialogTitle>
                        Confirmation
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Sind sie sicher die Bewertung abzuschicken?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button autoFocus onClick={this.handleClose} className={"btn btn-primary"}>
                            Abbrechen
                        </Button>

                        <Button onClick={this.getEvaluationofInternship} className={"btn btn-primary"}>
                            Absenden
                        </Button>


                    </DialogActions>
                </Dialog>

            </div>

        );
    }

    openInternshipData = (id) => {
        this.setState({redirectToLink: "/loggedin/company/InternshipInformation/" + id})
    }


}

export default InternshipRating;

