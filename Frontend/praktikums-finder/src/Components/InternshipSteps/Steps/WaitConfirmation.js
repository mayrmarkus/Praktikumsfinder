import 'rc-steps/assets/index.css';
import 'rc-steps/assets/iconfont.css';
import React, {Component} from 'react';
import ParticlesBg from "particles-bg";

class WaitConfirmation extends Component {
    state = {
        internshipStatus: "unknown",
        internshipStatusDescr: ""
    };
    /**
     * wählt anhand der id den Confirmationstatus aus
     * */
    getConfirmationStatus = () => {
        const axios = require('axios');
        let url = localStorage.getItem('url');

        let params = new URLSearchParams();
        params.append("id", this.props.values.id);

        axios({
            method: 'post',
            url: url + '?action=getStateByInternship',
            data: params
        }).then((res) => {
            this.setState({internshipStatus: res.data.name});
            this.setState({internshipStatusDescr: res.data.description});
            console.log(res.data.description)
        })
    };


    componentDidMount() {
        console.log(this.getConfirmationStatus());
    }

    render() {

        let config = {
            num: [4, 7],
            rps: 0.9,
            radius: [4, 90],
            life: [1.5, 3],
            v: [2, 3],
            tha: [-40, 40],
            alpha: [0.6, 0],
            scale: [.1, 0.4],
            position: "all",
            color: [["#AAABBF", "#023059", "#F2C335", "#F2D06B"]],
            cross: "dead",
            //emitter: "follow",
            random: 10
        };

        if (Math.random() > 0.85) {
            config = Object.assign(config, {
                onParticleUpdate: (ctx, particle) => {
                    ctx.beginPath();
                    ctx.rect(
                        particle.p.x,
                        particle.p.y,
                        particle.radius * 2,
                        particle.radius * 2
                    );
                    ctx.fillStyle = particle.color;
                    ctx.fill();
                    ctx.closePath();
                }
            });
        }
        return (
            <div style={{height: "65vh", backgroundColor: "#fff", "position": "relative"}} className={'d-flex rounded'}>
                {/**<ParticlesBg type="custom" config={config} style={{position: "absolute", top: 0, left: 0, zIndex: -99}}/>    ---      with errors **/}
                <div style={{"position": "absolute"}} className={"h-100 d-flex justify-content-center align-items-center"}>
                    <div className={" w-50"}>
                        <h1 className={'m-4'}>{this.state.internshipStatus}</h1>
                        <h3 className={'text-center m-2 border-top p-4'}>{this.state.internshipStatusDescr}</h3>
                    </div>
                </div>
            </div>
        );
    }
}

export default WaitConfirmation;