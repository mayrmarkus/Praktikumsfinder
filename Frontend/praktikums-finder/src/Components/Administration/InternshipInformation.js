import 'rc-steps/assets/index.css';
import 'rc-steps/assets/iconfont.css';
import React, {Component} from 'react';
import Link from "@material-ui/core/Link";
import logo from "../img/logos/Lbs/logoLbs.png";

class Footer extends Component {
    state = {
    };

    render() {
        return (
            <div className={''}>
                <div className={"m-1"}>(C) Praktikumsfinder 2020 </div>
                <img url={logo} height={300} alt={"LOGO"}/>


            </div>
        );
    }
}

export default Footer;
