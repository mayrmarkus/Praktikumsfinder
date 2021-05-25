import 'rc-steps/assets/index.css';
import 'rc-steps/assets/iconfont.css';
import React, {Component} from 'react';
import {Snackbar} from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import {IoMdDownload} from "react-icons/io";
import contract from "../../../img/strps/contract.jpg";

class FillDownloadInternship extends Component {
    state = {
        errorIsOpen: false
    };

    handleClose = () => {
        this.setState({
            errorIsOpen: false,
            errorMsg: "Es ist ein Fehler aufgetreten"
        })

    };

    render() {


        return (
            <div className={'d-flex rounded'}
                 style={{
                     backgroundImage: `url(${contract})`, height: "65vh", backgroundSize: "50vh",
                     backgroundRepeat: 'no-repeat', backgroundPosition: ' bottom right', backgroundColor: 'white'
                 }}>
                <div
                    className={'justify-content-md-center m-3 '}>
                    <div className={'justify-content-md-center'}>
                        <h1 style={{fontSize: 80}}>Download des Praktikumsvertrages</h1>
                    </div>
                    <div style={{fontSize: 20}}>Hier findest du deinen schon ausgefüllten Praktikumsvertrage</div>
                    <div className={'justify-content-md-center'}>
                        <div style={{fontSize: 20}} className={'btn btn-outline-primary px-4 m-auto'}
                             onClick={this.generatePdf}>Download<IoMdDownload/></div>
                    </div>
                </div>


                <Snackbar open={this.state.errorIsOpen} autoHideDuration={10000} onClose={() => {
                    this.setState({errorIsOpen: false})
                }}>

                    <Alert severity={'error'} onClose={this.handleClose}>
                        {this.state.errorMsg}
                    </Alert>
                </Snackbar>

            </div>
        );
    }

    generatePdf = () => {

        try {
            const axios = require('axios');
            let url = localStorage.getItem('url');
            const params = new URLSearchParams();
            //console.log(this.props.values.personalinfo.birthdate.toISOString().slice(0, 10));
            params.append('name', this.props.values.personalinfo.surname + " " + this.props.values.personalinfo.firstname);
            params.append('birthdate', this.props.values.personalinfo.birthdate.toISOString().slice(0, 10));
            params.append('specialisation', this.props.values.personalinfo.specialisation);
            params.append('schoolclass_id', this.props.values.schoolclass_id);
            params.append('company_id', this.props.values.company_id);
            params.append('tax_number', this.props.values.personalinfo.tax_number);
            params.append('street', this.props.values.personalinfo.street);
            params.append('residence', this.props.values.personalinfo.residence);
            params.append('postcode', this.props.values.personalinfo.postcode);
            params.append('birthplace', this.props.values.personalinfo.birthplace);
            params.append('internship_id', this.props.values.id);
            params.append('student_id', this.props.values.student_id);
            params.append('tutor_id', this.props.values.tutor);
            params.append('school', this.props.values.personalinfo.school);
            params.append('schoolclass', this.props.values.personalinfo.schoolclass);
            params.append('specialisation', this.props.values.personalinfo.specialisation);
            //console.log(this.props.values);
            axios({
                method: 'post',
                url: url + '/?action=generateContract',
                data: params
            }).then((res) => {
                if (res.data.error) {
                    this.setState({
                        errorIsOpen: true,
                        errorMsg: "Bitte kontrollieren Sie ob ihr Unternehmen und deren Mitarbeiter verifiziert sind, wenden Sie sich an Ihren Klassenlehrer oder das Sekreteriat!"
                    })

                } else {
                    this.getBlobData(params, axios, url)
                    this.props.setCompleted(null, null, 6)
                }

            })
        } catch (e) {
            if (e.name === 'TypeError')
                this.setState({
                    errorIsOpen: true,
                    errorMsg: "Bitte kontrollieren Sie ob alle Felder im vorherigen Schritt ausgefüllt sind!"
                })
        }
    }

    getBlobData = (params, axios, url) => {
        axios({
            responseType: 'arraybuffer',
            method: 'POST',
            data: params,
            url: url + '/?action=generateContract'
        }).then((res) => {

            let data = new Blob([res.data], {type: res.headers['content-type']});

            //let data = new Blob([res.data], {type: res.headers['content-type']});

            let url = window.URL.createObjectURL(data);

            // let a = document.createElement("a");
            // document.body.appendChild(a);
            // a.style = "display: none";
            // a.href = this.state.fileUrl;
            // a.download = "ArbeitsVertrag.docx";
            // a.click();
            let a = document.createElement("a");
            document.body.appendChild(a);
            a.style = "display: none";
            a.href = url;
            a.download = "ArbeitsVertrag.docx";
            a.click();
            window.URL.revokeObjectURL(url);
        });
    }

}

export default FillDownloadInternship;