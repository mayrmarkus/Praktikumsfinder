import React, {Component} from 'react';
import {Link, Redirect} from "react-router-dom";
import logo from "../../img/download.png";
import Spinner from "react-bootstrap/Spinner";
import background from "../../img/backgrounds/login.jpeg"

class Login extends Component {

    state = {
        email: '',
        password: '',
        loading: false,
        loggedIn: false
    };


    componentDidMount() {
        try {
            if (this.props.match.params.token) {
                this.login(this.props.match.params.token);
            }
        } catch (error) {
            //console.error(error);
        }
    }

    textChange = (e) => {
        this.setState({[e.target.name]: e.target.value})
    };

    render() {
        if (this.props.currentUser != null || this.state.loggedIn) {
            return <Redirect to='/'/>
        }

        if (this.state.loading) {
            return <Spinner animation="border"/>;
        }

        return (
            <div>
                <div style={{
                    height: "100vh",
                    width: "100vw",
                    backgroundImage: `url(${background})`,
                    backgroundSize: "cover"
                }}
                     className={"d-flex main-content flex-column align-items-center justify-content-around"}>


                    <div className={"w-25 bg-dark"}>

                        {//header
                        }
                        <div style={{height: 150}} className={"p-3 bg-white d-flex align-items-center justify-content-center"}>
                            <img className={"w-100"} src={logo}/>

                        </div>
                        {//body
                        }
                        <div style={{height: 400}} className={"p-3 d-flex flex-column align-items-center justify-content-around"}>

                            <h2 className={"text-white"}>Bitte melden Sie sich an</h2>


                            <div className={"mt-3 d-flex justify-content-center"}>
                                <form onSubmit={this.loginAjax} className="login"
                                      style={{display: 'flex', flexFlow: 'column'}}>


                                    <div className="form-group">
                                        <input
                                            id={'emailLogin'}
                                            type={'email'}
                                            placeholder={'E-Mail'}
                                            className={'form-control'}
                                            value={this.state.email}
                                            onChange={this.textChange}
                                            name={'email'}
                                        />
                                    </div>
                                    <div className="form-group">
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

                                    {
                                        this.state.errMsg ?? <p>{this.state.errMsg}</p>
                                    }


                                    <input type={'submit'} value={"Login"} className={'btn btn-primary'}/>
                                    <Link className={'text-white'} style={{textDecoration: "none"}} to="/register">Noch
                                        keinen Account? <b>Hier Registrieren</b></Link>
                                </form>
                            </div>
                        </div>

                    </div>

                </div>

            </div>
        );
    }

    loginAjax = (e) => {
        e.preventDefault();

        const axios = require('axios');

        const params = new URLSearchParams();
        params.append('email', this.state.email);
        params.append('password', this.state.password);

        let url = localStorage.getItem('url');
        this.setState({loading: true})
        axios({
            method: 'post',
            url: url + '?action=login',
            data: params
        }).then((res) => {
            console.log(res.data)
            if (!res.data.error && res.data) {
                this.login(res.data.token);
            } else {
                console.log()
                this.setState({errMsg: "Kontrollieren sie Ihre E-Mail und ihr Passwort"})
            }

            this.setState({loading: false})


        })

    }

    login = (token) => {
        let jwtDecode = require('jwt-decode');
        let decoded = jwtDecode(token);
        this.props.setUser(decoded.data, token)
        this.setState({loggedIn: true})

    }
}

export default Login;
