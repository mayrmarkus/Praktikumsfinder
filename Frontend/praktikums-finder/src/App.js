import React, {Component} from 'react';
import Login from "./Components/Login/Login";
import {BrowserRouter, Redirect, Route, Switch} from "react-router-dom";

import Register from "./Components/Login/Register";
import InternshipSteps from "./Components/InternshipSteps/InternshipSteps";
import Administration from "./Components/Administration/Administration";
import InsertNewClassAdministration from "./Components/Administration/InsertNewClass";
import ClassInformation from "./Components/Administration/ClassInformation";
import Footer from "./Components/Footer";
import NewCompany from "./Components/Administration/NewCompany"
import CompanyInformation from "./Components/Administration/CompanyInformation";
import ClassOverview from "./Components/ClassOverview/ClassOverview";
import StudentInformation from "./Components/Administration/StudentInformation";
import NewSchoolperson from "./Components/Administration/NewSchoolperson";
import StudentOverview from "./Components/Administration/StudentOverview";
import CompanyProfile from "./Components/Company/CompanyProfile";
import InternshipRating from "./Components/Company/InternshipRating";
import InternshipInformation from "./Components/Company/InternshipInformation";
import Company from "./Components/Company/Company";
import AllCompanies from "./Components/Administration/AllCompanies";
import AllSchoolpersons from "./Components/Administration/AllSchoolpersons";


import {Alert, AlertTitle} from '@material-ui/lab';
import Snackbar from '@material-ui/core/Snackbar';
import {Nav, Navbar} from "react-bootstrap";
import Imprint from "./Components/Imprint";
import {Offline} from "react-detect-offline";
import logo from './img/logos/13.01_finalLogo/final.png';


import './index.css'
import Sidebar from "./Components/Administration/Sidebar";
import ContractsView from "./Components/Administration/ContractsView";

import './custumBootstrap.scss';

import Search from "./Components/Administration/Search";
import InternshipTimeWorkDay from "./Components/Company/InternshipTimeWorkDay";
import RatingMail from "./Components/Administration/RatingMail";
import EmailCopmoser from "./Components/EmailComposer/EmailCopmoser";
import AllRoles from "./Components/Administration/AllRoles";
import AllSpecializations from "./Components/Administration/AllSpecializations";


if (localStorage.token) {
    loadApiKeyIntoHeaders();
}

function loadApiKeyIntoHeaders(token) {
    let localToken;
    if (token) {
        localToken = token;
    } else if (localStorage.token) {
        localToken = localStorage.token;
    }


    if (localToken) {
        const axios = require('axios');
        // Add a request interceptor
        axios.interceptors.request.use(function (config) {
            const token = localToken;
            config.headers["Auth-Token"] = token;

            return config;
        });
    }

}

//      HOW THIS WORKS: everyone changes the .env.development to its backend url and ADDS it to the .git-ignore file
const url = process.env.REACT_APP_API_URL;
//console.log(process.env);

const polling = {
    enabled: true,
    interval: 5000,
    url: url + 'index.php?action=login'
};

checkToken();

function checkToken() {
    let url = localStorage.getItem('url');
    url += "?action=checkToken";
    const axios = require('axios');
    axios({
        method: 'post',
        url: url
    }).then((res) => {
        if (res.data.error == "#708") {
            localStorage.setItem("token", null);
        }
    })
}

class App extends Component {
    state = {
        currentUser: JSON.parse(localStorage.getItem('user')),
        token: localStorage.getItem('token'),
        navOpen: true,
        logout: false
    };


    componentDidMount() {
        localStorage.setItem('url', url);


        if (localStorage.token && localStorage.token != "null") {
            let jwtDecode = require('jwt-decode');

            let expDate = jwtDecode(localStorage.token).exp;

            //Token check
            if (expDate < Date.now() / 1000) {
                //Token expired
                this.logout();
            } else {
                // Token Valid
                this.setState({token: localStorage.getItem('token')});
            }
        }


    }

    isCapable(role) {
        return role === this.state.currentUser.role;
    }

    closeNav = (open) => {
        if (open)
            this.setState({navOpen: true});
        else
            this.setState({navOpen: false});
    };

    setUser = (us, token) => {
        localStorage.setItem('user', JSON.stringify(us));
        this.setState({currentUser: us});

        localStorage.setItem('token', token);
        this.setState({token: token});

        loadApiKeyIntoHeaders(token);

        window.location.reload(false);
    };

    logout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        this.setState({currentUser: null, token: null, logout: true});
    };

    addSlashIfNotExisting = () => {
        if (window.location.pathname.charAt(window.location.pathname.length - 1) !== '/') {
            console.log(window.location.pathname.charAt(window.location.pathname.length - 1));

            return <Redirect to={window.location.pathname + "/"}/>
        }
        return <div/>
    };

    render() {

        if (this.state.logout) {
            this.setState({logout: false})
            return (<BrowserRouter><Redirect to={"/"}/></BrowserRouter>)
        }

        let currentAction;

        let forceLogin = "";

        if (this.state.currentUser == null) {
            currentAction = <Redirect to='/login/'/>
        } else if (this.state.currentUser.role === 'Student') {
            currentAction = <Redirect to='/loggedin/Student/ClassOverview/'/>
        } else if (this.state.currentUser.role === 'Administration') {
            currentAction = <Redirect to='/loggedin/Administration/'/>
        } else if (this.state.currentUser.role === 'Teacher') {
            currentAction = <Redirect to='/loggedin/Administration/'/>
        } else if (this.state.currentUser.role === 'Company') {
            currentAction = <Redirect to='/loggedin/Company/'/>
        } else {
            currentAction = <Redirect to='/loggedin/'/>
        }
        return (
            <div>
                <div>
                    <BrowserRouter>
                        <div>
                            {forceLogin}
                            <Route path={'/loggedin/'} component={() =>
                                <Navbar bg={'transparent'}>
                                    <Navbar.Brand><a href={"/loggedin/"}><img height={70} src={logo}
                                                                              alt={'Logo'}/></a></Navbar.Brand>
                                    <Nav className="justify-content-end" style={{width: "100%"}}>

                                        <div className={'btn btn-primary'} onClick={this.logout}>
                                            Logout
                                        </div>
                                    </Nav>
                                </Navbar>
                            }/>

                        </div>

                        <Offline polling={polling}>
                            <Snackbar open={true}>
                                <Alert variant={"filled"} severity="error">
                                    <AlertTitle>Error</AlertTitle>
                                    Verbindung zum Server fehlgeschlagen!
                                </Alert>
                            </Snackbar>
                        </Offline>
                        <Route exact path='/' component={() =>
                            currentAction
                        }/>
                        <Route exact path='/loggedin/' component={() =>
                            currentAction
                        }/>


                        <Route exact path='/login/jwt/:token'
                               render={(props) => (
                                   <Login currentUser={this.state.currentUser} {...props} setUser={this.setUser}/>
                               )
                               }/>

                        <Route path='/register' component={() =>
                            <Register setUser={this.setUser}/>
                        }/>


                        <Route exact
                               path='/Administration/:id'
                               render={(props) =>
                                   <Redirect to={"/loggedin/Administration/" + props["id"]}/>
                               }/>

                        <div className={'asideDesktopTopMobile'}>
                            <Route path='/loggedin/Administration/' component={() =>
                                <div className={"sideNav"}>{
                                    <Sidebar/>
                                }
                                </div>
                            }/>

                            <div className={"w-100 mr-2"}>
                                <Route path={'/loggedin/Student/ClassOverview/internshipSteps/:id'} render={(props) =>
                                    <InternshipSteps {...props} currentUser={this.state.currentUser}/>
                                }/>
                                <Route exact path={'/loggedin/Student/ClassOverview'} component={() =>
                                    <ClassOverview currentUser={this.state.currentUser}/>
                                }/>

                                {/*<Route exact path='/loggedin/internship/' render={(props) =>*/}
                                {/*    <InternshipInformation {...props}/>*/}
                                {/*}/>*/}

                                <Route exact path='/loggedin/Administration' component={() =>
                                    <Administration/>
                                }/>

                                <Route exact path='/loggedin/Administration/ContractsView' component={() =>
                                    <ContractsView/>
                                }/>

                                <Route exact path='/loggedin/Administration/notCheckedContracts' component={() =>
                                    <ContractsView viewJustNotCheckedContracts="no"/>
                                }/>


                                <Route path='/Administration/' component={() =>
                                    <Administration/>
                                }/>
                                <Route path='/loggedin/Administration/NewClass' component={() =>
                                    <InsertNewClassAdministration/>
                                }/>
                                <Route exact path='/loggedin/Administration/CompanyInformation/:id' render={(props) =>
                                    <CompanyInformation {...props} />
                                }/>
                                <Route exact path='/loggedin/Administration/Search/CompanyInformation/:id'
                                       render={(props) =>
                                           <CompanyInformation {...props}/>
                                       }/>
                                <Route exact path='/loggedin/Administration/AllCompanies/CompanyInformation/:id'
                                       render={(props) =>
                                           <CompanyInformation {...props}/>
                                       }/>
                                <Route exact
                                       path='/loggedin/Administration/ClassInformation/:class_id/StudentInformation/:id'
                                       render={(props) =>
                                           < StudentInformation {...props}/>
                                       }/>
                                <Route exact path='/loggedin/Administration/StudentOverview/StudentInformation/:id'
                                       render={(props) =>
                                           <StudentInformation {...props}/>
                                       }/>
                                <Route exact path='/loggedin/Administration/StudentInformation/:id' render={(props) =>
                                    <StudentInformation {...props}/>
                                }/>
                                <Route exact path='/loggedin/Administration/Search/StudentInformation/:id'
                                       render={(props) =>
                                           <StudentInformation {...props}/>
                                       }/>
                                <Route exact path='/loggedin/Administration/ClassInformation/:id' render={(props) =>
                                    <ClassInformation {...props} />
                                }/>


                                <Route exact path={'/login'} component={() =>
                                    <Login currentUser={this.state.currentUser} setUser={this.setUser}/>
                                }/>

                                <Route exact path={'/loggedin/Administration/AllRoles'} component={() =>
                                    <AllRoles/>
                                }/>
                                <Route exact path={'/loggedin/Administration/AllSpecializations'} component={() =>
                                    <AllSpecializations/>
                                }/>

                                <Route exact path={'/loggedin/Administration/NewSchoolperson'} component={() =>
                                    <NewSchoolperson/>
                                }/>

                                <Route exact path={'/loggedin/Administration/StudentOverview'} component={() =>
                                    <StudentOverview/>
                                }/>

                                <Route exact path={'/loggedin/Administration/NewCompany'} component={() =>
                                    <NewCompany/>
                                }/>
                                <Route exact path={'/loggedin/Administration/AllCompanies'} component={() =>
                                    <AllCompanies/>
                                }/>
                                <Route exact path={'/loggedin/Administration/AllSchoolpersons'} component={() =>
                                    <AllSchoolpersons/>
                                }/>
                                <Route exact path={'/loggedin/Administration/Search'} component={() =>
                                    <Search/>
                                }/>
                                <Route exact path={'/loggedin/Administration/RatingMail'} component={() =>
                                    <RatingMail/>
                                }/>
                            </div>


                        </div>

                        <Route exact path={'/composeMail/'} component={() =>
                            <EmailCopmoser currentUser={this.state.currentUser}/>
                        }/>
                        <Route exact path={'/loggedin/Company/'} component={() =>
                            <Company/>
                        }/>
                        <Route exact path={'/loggedin/Company/CompanyProfile'} component={() =>
                            <CompanyProfile/>
                        }/>
                        <Route exact path={'/loggedin/Company/InternshipRating'} component={() =>
                            <InternshipRating/>
                        }/>
                        <Route exact path={'/loggedin/Company/InternshipTimeWorkDay'} component={() =>
                            <InternshipTimeWorkDay/>
                        }/>
                        <Route exact path={'/loggedin/Company/InternshipInformation/:id'} render={(props) =>
                            <InternshipInformation  {...props}/>
                        }/>
                        <Route exact path={'/loggedin/Company/InternshipInformation/InternshipRating/:id'}
                               render={(props) =>
                                   <InternshipRating {...props}/>
                               }/>
                        <Route exact path={'/loggedin/Company/InternshipInformation/InternshipWorkDays/:id'}
                               render={(props) =>
                                   <InternshipTimeWorkDay {...props}/>
                               }/>
                        <Route exact={true} path={'/impressum'} component={() =>
                            <Imprint/>
                        }/>

                        <Footer/>
                        {this.addSlashIfNotExisting()}
                        <Switch>
                            {currentAction}
                        </Switch>
                    </BrowserRouter>
                </div>
            </div>
        );
    }
}


export default App;
