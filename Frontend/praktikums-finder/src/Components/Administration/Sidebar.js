import 'rc-steps/assets/index.css';
import 'rc-steps/assets/iconfont.css';
import React, {Component} from 'react';
import './sidebar.css';
import MenuIcon from '@material-ui/icons/Menu';
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';
import {Link} from "react-router-dom";


class Sidebar extends Component {
    state = {
        redirect: "",
        redirectToLink: false,
        class_id: 0,
        media_title: (<h3 className={"m-5 text-white text-center"}>Verwaltung</h3>),
        small: false
    };

    componentDidMount() {
        this.checkifMobile();
        window.addEventListener('resize', this.checkifMobile);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.checkifMobile);
    }

    checkifMobile = () => {
        let mql = window.matchMedia('(min-width: 1000px)');
        let data;
        if (mql.matches) {
            data = (<h3 className={"m-4 mt-5 text-white text-center"}><SupervisorAccountIcon/>Verwaltung</h3>);
            this.setState({
                media_title: data
            })
        } else {
            data = (<h3 className={"m-2 mt-5 text-white  text-center"}><SupervisorAccountIcon/></h3>);
            this.setState({
                media_title: data
            })
        }
    }

    closeNav = (bool) => {
        this.setState({small: bool});
    }

    closeAll = () => {
        for (let elementsByTagNameElement of document.getElementsByTagName("details")) {
            elementsByTagNameElement.removeAttribute("open");
        }
    };

    clickSingle = (elemnt) => {

        if (elemnt.target.tagName === "SUMMARY") {
            this.closeAll();

            console.log(elemnt.open);
            elemnt.open = !elemnt.open;
        }
    };

    render() {
        if (this.state.small) {
            return <div className={"bg-dark text-white p-4 rounded"}><MenuIcon onClick={() => {
                this.closeNav(!this.state.small)
            }}/></div>
        }

        return (
            <div className={'rounded w-100 h-100 p-4 float-left bg-dark text-light'}>
                <div className={"float-left bg-subNav"}><MenuIcon onClick={() => {
                    this.closeNav(!this.state.small)
                }}/></div>
                <div>
                    {this.state.media_title}
                    <div className={"mt-5 menuPointsSidebarWrapper"}>
                        <details className={"detailsDark"} onClick={this.clickSingle} open>
                            <summary className={" w-100 text-white text-left "}>Suchen</summary>
                            <div>
                                <Link className={"text-left"} to={"/loggedin/Administration/Search"}>Alles
                                    Durchsuchen</Link>
                            </div>
                        </details>
                        <details className={"detailsDark"} onClick={this.clickSingle}>
                            <summary className={"w-100 text-white text-left "}>Klassen</summary>
                            <div>
                                <Link className={"text-left"} to={"/loggedin/Administration/"}> Alle Klassen</Link>
                            </div>
                            <div>
                                <Link className={"text-left"} to={"/loggedin/Administration/NewClass"}> Klasse
                                    hinzufügen</Link>
                            </div>
                        </details>
                        <details className={"detailsDark"} onClick={this.clickSingle}>
                            <summary className={"w-100 text-white text-left"}>Unternehmen</summary>
                            <div>
                                <Link className={"text-left"} to={"/loggedin/Administration/AllCompanies"}> Alle
                                    Unternehmen</Link>
                            </div>
                            <div>
                                <Link className={"text-left"} to={"/loggedin/Administration/NewCompany"}> Unternehmen
                                    hinzufügen</Link>
                            </div>
                        </details>
                        <details className={"detailsDark bg-subNav"} onClick={this.clickSingle}>
                            <summary className={"w-100 text-white text-left"}>Verträge</summary>
                            <div>
                                <Link className={"text-left"} to={"/loggedin/Administration/ContractsView"}> Alle
                                    Verträge</Link>
                            </div>
                            <div>
                                <Link className={"text-left"} to={"/loggedin/Administration/notCheckedContracts"}> Nicht kontrollierte Verträge</Link>
                            </div>
                        </details>
                        <details className={"detailsDark bg-subNav"} onClick={this.clickSingle}>
                            <summary className={"w-100 text-white text-left "}>Schüler</summary>
                            <div>
                                <Link className={"text-left"} to={"/loggedin/Administration/StudentOverview"}> Alle
                                    Schüler</Link>
                            </div>
                        </details>
                        <details className={"detailsDark "} onClick={this.clickSingle}>
                            <summary className={"w-100 text-white bg-subNav text-left"}>Lehrer</summary>
                            <div>
                                <Link className={"text-left"} to={"/loggedin/Administration/AllSchoolpersons"}>Alle
                                    Lehrer/Klassenlehrer</Link>
                            </div>
                            <div>
                                <Link className={"text-left"} to={"/loggedin/Administration/NewSchoolperson"}>Lehrer
                                    hinzufügen</Link>
                            </div>
                        </details>
                        <details className={"detailsDark "} onClick={this.clickSingle}>
                            <summary className={"w-100 text-white bg-subNav text-left"}>Email</summary>
                            <div>
                                <Link className={"text-left"} to={"/loggedin/Administration/RatingMail"}>Emails
                                    senden</Link>
                            </div>
                        </details>
                        <details className={"detailsDark "} onClick={this.clickSingle}>
                            <summary className={"w-100 text-white bg-subNav text-left"}>Verwaltung</summary>
                            <div>
                                <Link className={"text-left"} to={"/loggedin/Administration/AllRoles"}>Rollen</Link>
                            </div>
                            <div>
                                <Link className={"text-left"}
                                      to={"/loggedin/Administration/AllSpecializations"}>Fachrichtungen</Link>
                            </div>
                        </details>

                    </div>
                </div>
            </div>
        );
    }
}

export default Sidebar;
