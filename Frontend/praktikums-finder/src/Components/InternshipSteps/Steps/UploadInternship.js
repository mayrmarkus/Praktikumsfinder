import 'rc-steps/assets/index.css';
import 'rc-steps/assets/iconfont.css';
import React, {Component} from 'react';
import contract from "../../../img/strps/contract.jpg";
import {Snackbar} from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import {IoMdCloudUpload} from "react-icons/io";
import axios from 'axios';
import {Button} from "react-bootstrap";

class UploadInternship extends Component {
    state = {
        currentFile: "Wähle deinen Vertrag aus!"
    };

    uploadData = (e) => {
        let url = localStorage.getItem('url');

        e.preventDefault();
        let formData = new FormData();
        let imagefile = document.querySelector('#file');
        formData.append("internshipId", this.props.values.id);
        formData.append("contract", imagefile.files[0]);
        axios({
            method: 'post',
            url: url + '?action=uploadContract',
            data: formData,
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then((res) => {
            console.log(res)
            console.log(res.data.message);
            this.setState({message: res.data.message})
            this.showMessage(res.data.message);
        });


        //Snack Messages
    };

    onFileSelect = () => {
        let imagefile = document.querySelector('#file');
        console.log(imagefile.files[0]);
        if (imagefile.files[0])
            this.setState({currentFile: imagefile.files[0].name});
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
                        <h1 style={{fontSize: 80}}>Upload des Praktikumsvertrages</h1>
                    </div>
                    <div style={{fontSize: 20}}>Bitte Lade deinen ausgefüllten und unterschriebenen Vertrag hoch</div>
                    <div className={'justify-content-md-center w-25'}>
                        <form onSubmit={this.uploadData}>
                            <div className="input-group w-100 m-2">
                                <div className="custom-file">
                                    <input type="file" id="file" ref="fileUploader" onChange={() => {
                                        this.onFileSelect()
                                    }}/>
                                    <label className="custom-file-label" htmlFor="file">{this.state.currentFile}</label>
                                </div>
                            </div>
                            <Button variant={'light'} className={"btn-outline-primary px-4 m-2 w-100"} type="submit">Upload<IoMdCloudUpload
                                className={"ml-2"}/></Button>
                        </form>

                    </div>
                </div>


                <Snackbar open={this.state.showSnack}
                          autoHideDuration={5000}
                          onClose={() => {
                              this.setState({showSnack: false})
                          }}
                >
                    <Alert severity={this.state.snackErrLevel}>
                        {this.state.snackMessage}
                    </Alert>
                </Snackbar>

            </div>
        );
    }

    showMessage = async (message) => {
        //console.log(this.state.message);
        if (message === "success") {
            console.log("success")
            this.setState({
                'snackErrLevel': 'success',
                'showSnack': true,
                'snackMessage': 'Jeeee ... alles abgespeichert. Sie werden gleich weitergeleitet!'
            });
            await new Promise(r => setTimeout(r, 2000));
            this.props.setCompleted(null, null, 7);
        } else {
            this.setState({
                'snackErrLevel': 'error',
                'showSnack': true,
                'snackMessage': 'WOW ... da ist was schief gelaufen'
            })
        }

    }
}


export default UploadInternship;