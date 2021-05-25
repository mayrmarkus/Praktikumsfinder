import './InternshipStepsStyle.css'

import React, {Component} from 'react';
import Steps from 'rc-steps';
import SelectInternship from "./Steps/SelectInternship";
import SelectDateInternship from "./Steps/SelectDateInternship";
import SelectTutor from "./Steps/SelectTutor";
import PersonalInfo from "./Steps/PersonalInfo";
import FillDownloadInternship from "./Steps/FillDownloadInternship";
import UploadInternship from "./Steps/UploadInternship";
import WaitConfirmation from "./Steps/WaitConfirmation";
import BreadcrumbItem from "react-bootstrap/BreadcrumbItem";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import SelectTutorCompany from "./Steps/SelectTutorCompany";


//icons
import {MdDone, MdLocationOn} from "react-icons/md";


class InternshipSteps extends Component {


    state = {
        currentStep: 0,
        loadedData: false,

        values: [],

        steps: [
            {
                id: 0,
                title: "Praktikumsstelle Aussuchen",
                completed: true
            },
            {
                id: 1,
                title: "Zeitraum angeben",
                object: null,
                completed: false
            },
            {
                id: 2,
                title: "Tutoren Schulen",
                object: null,
                completed: false
            },
            {
                id: 3,
                title: "Tutoren Firma",
                object: null,
                completed: false
            },
            {
                id: 4,
                title: "Persönliche Informationen",
                object: null,
                completed: false
            }, {
                id: 5,
                title: "Praktikumsvertrag Download und Ausfüllen",
                object: null,
                completed: false
            }, {
                id: 6,
                title: "Praktikumsvertrag Upload",
                object: null,
                completed: false
            }, {
                id: 7,
                title: "Auf Bestätigung warten",
                object: null,
                completed: false
            }
        ]
    };

    componentDidMount() {
        this.loadFromJson(this.props.match.params.id);
    }

    /**
     *
     * @param key -> value to save object
     * @param object -> value of selection
     * @param step -> current step
     */
    setCompleted = (key, object, step) => {
        let newValues = this.state.values;

        newValues[key] = object;
        newValues['state_id'] = this.state.currentStep + 1;

        this.setState({values: newValues});

        this.dataUpload(newValues);

        if(step === "forceNext"){
            this.onChange(this.state.currentStep + 1)
            return;
        }

        if (step !== null) {
            let steps = this.state.steps;
            steps[step].completed = true;
            this.setState({steps});
            this.onChange(this.state.currentStep + 1)
        }


    };

    loadFromJson(id) {
        console.log(id)
        const axios = require('axios');

        let url = localStorage.getItem('url');

        axios({
            url: url + '?action=getInternshipById&id=' + id,
        }).then((res) => {
            console.log(url);
            if (res.data.error === undefined) {
                console.log(res)
                this.setState({values: res.data});

                let steps = this.state.steps;

                steps.map(value => {
                    if(res.data.state_id >= value.id){
                        value.completed = true;
                    }
                });

                this.setState({steps});
                if(res.data.state_id == null){
                    this.setState({currentStep: 0});
                }else if (res.data.state_id < 7) {
                    this.setState({currentStep: parseInt(res.data.state_id)});
                } else if (res.data.state_id >= 7) {
                    this.setState({currentStep: 6});
                }

                this.setState({loadedData: true});

            } else {
                console.error("ERROR LOADING DATA")
            }

        })
    }

    setValues(k, v) {
        this.setState(k, v);
    }

    onChange = currentStep => {
        let lastStep = 0;

        this.state.steps.map((k) => {
            if (k.completed) {
                lastStep = k;
            }
            return false;
        });

        if (lastStep.id + 1 > currentStep) {
            this.setState({currentStep})
        }


    };

    render() {
        //stepper docs http://react-component.github.io/steps/examples/custom-svg-icon.html
        return (
            <div className="classViewContent bg-light" style={{minWidth: 100}}>

                <Breadcrumb className={'mb-3'}>
                    <BreadcrumbItem href={'/loggedin'}>Klassenansicht</BreadcrumbItem>
                    <BreadcrumbItem
                        href={'/loggedin/Student/ClassOverview/internshipSteps'}
                        active>Praktikumsschritte</BreadcrumbItem>
                </Breadcrumb>

                <div className={'overflow-auto'}>
                    <Steps style={{color: 'black'}} labelPlacement="vertical" onChange={this.onChange} current={this.state.currentStep}>
                        {
                            this.state.steps.map((s, k) => {
                                if (k > this.state.currentStep) {
                                    // eslint-disable-next-line eqeqeq
                                }
                                if (k === this.state.currentStep) {
                                    return <Steps.Step style={{color: 'black'}}
                                                       icon={<div style={{textAlign: 'center'}}>{k + 1}</div>} key={k}
                                                       title={s.title}/>
                                    return <Steps.Step icon={<MdLocationOn/>} key={k} title={s.title}/>
                                } else {
                                    return <Steps.Step key={k} icon={<MdDone/>} title={s.title}/>
                                }
                            })
                        }
                    </Steps>
                </div>
                {
                    this.getStepComponent()
                }
            </div>
        );
    }

    dataUpload = (obj) => {
        const axios = require('axios');

        let isoFromDate = null;
        let isoToDate = null;

        try {
            isoFromDate = obj.from.getFullYear() + '-' + (obj.from.getMonth() + 1) + '-' + obj.from.getDate();
            isoToDate = obj.to.getFullYear() + '-' + (obj.to.getMonth() + 1) + '-' + obj.to.getDate();
        } catch (e) {

        }

        const params = new URLSearchParams();
        params.append("company_id", obj.company_id);
        params.append("from", isoFromDate);
        params.append("id", obj.id);
        params.append("rating", obj.rating);
        params.append("schoolclass_id", obj.schoolclass_id);
        params.append("state_id", obj.state_id);
        params.append("student_id", obj.student_id);
        params.append("to", isoToDate);
        params.append("tutor", obj.tutor);
        params.append("tutor_company_id", obj.tutor_company_id);


        let url = localStorage.getItem('url');

        axios({
            method: 'post',
            url: url + '?action=internshipDataUpload',
            data: params
        }).then((res) => {
            console.log(res)

        })
    };

    /**
     * returns the component for the current step
     * @returns {null|*}
     */
    getStepComponent = () => {
        if (this.state.loadedData) {
            switch (this.state.currentStep) {
                case 0: {
                    return <SelectInternship default={this.state.values.company_id} setCompleted={this.setCompleted}/>
                }
                case 1: {
                    return <SelectDateInternship default={{from: this.state.values.from, to: this.state.values.to}}
                                                 setCompleted={this.setCompleted}/>
                }
                case 2: {
                    return <SelectTutor default={this.state.values.tutor}  setCompleted={this.setCompleted}/>
                }
                case 3: {
                    return <SelectTutorCompany default={this.state.values.tutor} companyId={this.state.values.company_id} setCompleted={this.setCompleted}/>
                }
                case 4: {
                    return <PersonalInfo currentUser={this.props.currentUser} setCompleted={this.setCompleted}/>
                }
                case 5: {
                    return <FillDownloadInternship values={this.state.values} setCompleted={this.setCompleted}/>
                }
                case 6: {
                    return <UploadInternship setCompleted={this.setCompleted} values={this.state.values}/>
                }
                case 7: {
                    return <WaitConfirmation setCompleted={this.setCompleted} values={this.state.values}/>
                }
                default: {
                    return null
                }
            }
        }

    }
}


export default InternshipSteps;
