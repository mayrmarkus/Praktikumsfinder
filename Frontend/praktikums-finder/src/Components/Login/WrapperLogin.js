import React, {Component} from 'react';
import {Link, Redirect} from "react-router-dom";
import logo from "../../img/logos/13.01_finalLogo/finalOld.png";
import Register from "./Register";

class WrapperLogin extends Component {

    state = {
        email: '',
        password: ''
    };

    textChange = (e) => {
        this.setState({[e.target.name]: e.target.value})
    };

    render() {
        console.log(this.props.currentUser);
        if(this.props.currentUser != null){
            return <Redirect to='/loggedin/'/>
        }
        return (
            <div>

                <div className={"blue d-flex main-content flex-column align-items-center justify-content-around"}>
                    <h1 style={{fontSize: 50}}>Login</h1>
                    <div className={"d-flex flex-wrap flex-row w-100 justify-content-around align-items-center"}>
                        <div>
                            <img alt={'logo'} width={400} src={logo}/>
                        </div>
                        <div className={"w-25 register d-flex justify-content-center"}>
                            <form onSubmit={this.loginAjax} className="login" style={{display: 'flex', flexFlow: 'column'}}>

                                <div className="form-group">
                                    <label htmlFor="emailLogin">E-Mail: </label>
                                    <input
                                        id={'emailLogin'}
                                        type={'email'}
                                        placeholder={'Name'}
                                        className={'form-control'}
                                        value={this.state.email}
                                        onChange={this.textChange}
                                        name={'email'}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="passwordLogin">Password: </label>
                                    <input
                                        id={'passwordLogin'}
                                        className={'form-control'}
                                        type={'password'}
                                        placeholder={'Password'}
                                        value={this.state.password}
                                        onChange={this.textChange}
                                        name={'password'}
                                    />

                                </div>
                                <p id={'infoLogin'}></p>

                                <input type={'submit'} value={'Login'} className={'btn btn-primary'}/>
                                <Link to="/register">Register</Link>

                            </form>
                        </div>
                    </div>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
                    <path fill="#0099ff" fillOpacity="1"
                          d="M0,256L48,224C96,192,192,128,288,90.7C384,53,480,43,576,80C672,117,768,203,864,197.3C960,192,1056,96,1152,53.3C1248,11,1344,21,1392,26.7L1440,32L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"></path>
                </svg>
                <Register></Register>
            </div>
        );
    }

    loginAjax = (e) => {
        e.preventDefault();

        const axios = require('axios');

        const params = new URLSearchParams();
        params.append('email', this.state.email);
        params.append('password', this.state.password);


        axios({
            method: 'post',
            url: 'https://api.praktikumsfinder.tk/?action=login',
            data: params
        }).then((res) => {
            if (res.data.error === undefined) {
                document.getElementById("infoLogin").innerText = "Login Erfolgreich";
                this.props.setUser(res.data);
            } else {
                document.getElementById("infoLogin").innerText = res.data.error;
                console.log("hi")
            }

        })
    }
}

export default WrapperLogin;
