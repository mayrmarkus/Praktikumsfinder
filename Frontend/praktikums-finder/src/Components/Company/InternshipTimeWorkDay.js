import 'rc-steps/assets/index.css';
import 'rc-steps/assets/iconfont.css';
import React, {Component} from 'react';
import {Breadcrumb, BreadcrumbItem, Row, Col} from "react-bootstrap";
import {Redirect} from "react-router-dom";
import 'antd/es/date-picker/style/css'
import {DatePicker, TimePicker} from 'antd';
import moment from 'moment';

import Steps from 'rc-steps';
import {DateRange} from 'react-date-range';
import de from "date-fns/locale/de";
import TextField from "@material-ui/core/TextField";

const steps = [

        "<h1 className={'title'}></h1>" +
        "<input/>" +
        "<input/>" +
        "<input/>"
    ,
    {

    },
    {

    }
]

class InternshipTimeWorkDay extends Component {
    state = {
        redirect: "",
        redirectToLink: false,
        class_id: 0,
        standard_startValue: "08:00",
        standard_lunchbreakStartValue: "13:00",
        standard_lunchbreakEndValue: "14:00",
        standard_endValue: "17:00",
        from: "",
        to: "",
        internshipId: this.props.match.params.id,
        workdayData: null,
        workdayDisplay: [],
        workdayValues: null,


        calendarView: true,
        range: {
            startDate: new Date(),
            endDate: new Date(),
            key: 'selection',
        },

        step: 0,
        title: ""
    };

    /**
     * calling getInternshipData(getWorkdaysFromAPI) when component did mount
     */
    componentDidMount() {
        this.getInternshipData();
    }

    /**
     * saves state of date range in state(startDate & endDate)
     * @param ranges
     *
     */
    handleSelect = (ranges) => {
        console.log(ranges);
        this.setState(prevState => {
            let range = Object.assign({}, prevState.range);
            range.startDate = ranges['selection'].startDate;
            range.endDate = ranges['selection'].endDate;

            return {range};
        })
    };

    render() {
        if (this.state.redirectToLink !== false) {
            return <Redirect to={this.state.redirectToLink}/>;
        }

        function onChange() {

        }

        return (
            <div className={'classViewContent bg-light'}>
                <Breadcrumb>
                    <BreadcrumbItem href={'/loggedin/company/'}>Unternehmen</BreadcrumbItem>
                    <BreadcrumbItem href={'/loggedin/company/InternshipInformation'} active>Praktikums
                        Informationen</BreadcrumbItem>
                </Breadcrumb>

                <Steps style={{color: 'black'}} labelPlacement="vertical" current={0}>
                    {
                        steps.map((s,k) => {return <Steps.Step>{k}</Steps.Step>})
                    }
                </Steps>
                <h1>{this.state.title}</h1>

                {this.getStep(0)}

            </div>
        );
    }

    getStep = (step) => {
        if (steps.length + 1 < step){
            return steps[step];
        }
    }

    getInternshipData = () => {
        if (this.state.internshipId != null) {
            const axios = require('axios');

            let url = localStorage.getItem('url');

            let userData = localStorage.getItem('user');
            userData = JSON.parse(userData);
            this.setState({userData: userData});

            axios({
                url: url + '?action=getInternshipById&id=' + this.state.internshipId,
            }).then((res) => {

                if (res.data.error === undefined) {
                    console.log(res.data.from);
                    console.log(res.data.to);
                    this.setState({
                        from: res.data.from,
                        to: res.data.to
                    })
                    this.loadFromJson();

                } else {
                    console.error("ERROR LOADING DATA")
                }

            })
        }
    }


    /**
     * for calculating Timedifference and then inserting it in params
     */
    submitWorkday = () => {
        let arr = this.state.workdayValues;
        const params = new URLSearchParams();
        for (let i = 0; i < arr.length; i++) {
            let workstartWithIndex = "workstart_" + i;
            let lunchstartWithIndex = "lunchstart_" + i;
            let lunchendWithIndex = "lunchend_" + i;
            let workendWithIndex = "workend_" + i

            var ms = moment(arr[i][lunchstartWithIndex], "HH:mm").diff(moment(arr[i][workstartWithIndex], "HH:mm"));
            var d = moment.duration(ms);
            let worktimebeforeLunch;
            if (d.minutes() !== 0) {
                worktimebeforeLunch = d.hours() + ":" + d.minutes();
            } else {
                worktimebeforeLunch = d.hours() + ":00"
            }

            ms = moment(arr[i][workendWithIndex], "HH:mm").diff(moment(arr[i][lunchendWithIndex], "HH:mm"));
            d = moment.duration(ms);
            let worktimeafterLunch;
            if (d.minutes() !== 0) {
                worktimeafterLunch = d.hours() + ":" + d.minutes();
            } else {
                worktimeafterLunch = d.hours() + ":00"
            }

            var temp = [];
            temp.push("date", this.state.workdayData.days[i]);
            temp.push("worktimebeforLunch", worktimebeforeLunch);
            temp.push("worktimeafterLunch", worktimeafterLunch);
            params.append(i, JSON.stringify(temp));
        }
        this.sendWorkDaysToAPI(params)
    };

    /**
     * sending the params(workdays+time) to the API
     * @param params
     */
    sendWorkDaysToAPI = (params) => {
        console.log(this.state.workdayValues)
        const axios = require('axios');

        let url = localStorage.getItem('url');

        url += "?action=insertWorkday&internship_id=" + this.state.internshipId;

        axios({
            method: 'post',
            url: url,
            data: params
        }).then((res) => {
            console.log(res.data);
        })


    }

    /**
     * for setting standard WordayStartValue
     * @param moment
     * @param timeString
     */
    setStandardValueWorkstart = (moment, timeString) => {
        let values = this.state.workdayValues;
        for (let i = 0; i < this.state.workdayValues.length; i++) {
            let workstartWithIndex = "workstart_" + i;
            values[i][workstartWithIndex] = timeString;
        }
        this.setState({
            workdayValues: values,
            standard_startValue: timeString
        });
    };

    /**
     * for setting standard WordayLunchStartValue
     * @param moment
     * @param timeString
     */
    setStandardValueStartLunch = (moment, timeString) => {
        let values = this.state.workdayValues;
        for (let i = 0; i < this.state.workdayValues.length; i++) {
            let lunchstartWithIndex = "lunchstart_" + i;
            values[i][lunchstartWithIndex] = timeString;
        }
        this.setState({
            workdayValues: values,
            standard_lunchbreakStartValue: timeString
        });
    };

    /**
     * for setting standard LunchEndValue
     * @param moment
     * @param timeString
     */
    setStandardValueEndLunch = (moment, timeString) => {
        let values = this.state.workdayValues;
        for (let i = 0; i < this.state.workdayValues.length; i++) {
            let lunchendWithIndex = "lunchend_" + i;
            values[i][lunchendWithIndex] = timeString;
        }
        this.setState({
            workdayValues: values,
            standard_lunchbreakEndValue: timeString
        });
    };

    /**
     * for setting standard WorkdayEndValue
     * @param moment
     * @param timeString
     */
    setStandardValueWorkend = (moment, timeString) => {
        let values = this.state.workdayValues;
        for (let i = 0; i < this.state.workdayValues.length; i++) {
            let workendWithIndex = "workend_" + i;
            values[i][workendWithIndex] = timeString;
        }
        this.setState({
            workdayValues: values,
            standard_endValue: timeString
        });
    };

    onChangeDate = (date, dateString) => {
        console.log(date, dateString);
    };

    /**
     * change WorkdayValue(WorkDayStart) and saving it for a specific day onchange for every timepicker
     * @param moment
     * @param timeString
     * @param name
     * @param id
     */
    onChangeTimeStart = (moment, timeString, name, id) => {
        let values = this.state.workdayValues;
        values[id][name] = timeString;
        this.setState({
            workdayValues: values
        });
    };

    /**
     * change WorkdayValue(TimeStartLunch) and saving it for a specific day onchange for every timepicker
     * @param moment
     * @param timeString
     * @param name
     * @param id
     */
    onChangeTimeStartLunch = (moment, timeString, name, id) => {
        let values = this.state.workdayValues;
        values[id][name] = timeString;
        this.setState({
            workdayValues: values
        });
    };

    /**
     * change WorkdayValue(TimeEndLunch) and saving it for a specific day onchange for every timepicker
     * @param moment
     * @param timeString
     * @param name
     * @param id
     */
    onChangeTimeEndLunch = (moment, timeString, name, id) => {
        let values = this.state.workdayValues;
        values[id][name] = timeString;
        this.setState({
            workdayValues: values
        });
    };

    /**
     * change WorkdayValue(WorkDayEnd) and saving it for a specific day onchange for every timepicker
     * @param moment
     * @param timeString
     * @param name
     * @param id
     */
    onChangeTimeEnd = (moment, timeString, name, id) => {
        let values = this.state.workdayValues;
        values[id][name] = timeString;
        this.setState({
            workdayValues: values
        });
    };

    /**
     * creating timepickers based on Days
     * @returns {[]}
     */
    createWorkDay = () => {
        if (this.state.workdayData != null && this.state.workdayValues != null) {
            let arr = [];
            this.state.workdayData.days.map((value, index) => {
                var workstartWithIndex = "workstart_" + index;
                var lunchstartWithIndex = "lunchstart_" + index;
                var lunchEndWithIndex = "lunchend_" + index;
                var workendWithIndex = "workend_" + index;
                arr.push(
                    <Row className={"m-3"} key={index}>
                        <DatePicker defaultValue={moment(value, 'DD.MM.YYYY')}
                                    onChange={this.onChangeDate} format={'DD.MM.YYYY'}/>
                        <TimePicker
                            onChange={(date, dateString) => this.onChangeTimeStart(date, dateString, "workstart_" + index, index)}
                            minuteStep={15}
                            name={"workstart_" + index} id={"workstart_" + index}
                            value={moment(this.state.workdayValues[index][workstartWithIndex], 'HH:mm')}
                            format={'HH:mm'}/>
                        <TimePicker
                            onChange={(date, dateString) => this.onChangeTimeStartLunch(date, dateString, "lunchstart_" + index, index)}
                            minuteStep={15}
                            name={"lunchstart_" + index} id={"lunchstart_" + index}
                            value={moment(this.state.workdayValues[index][lunchstartWithIndex], 'HH:mm')}
                            format={'HH:mm'}/>
                        <TimePicker
                            onChange={(date, dateString) => this.onChangeTimeEndLunch(date, dateString, "lunchend_" + index, index)}
                            minuteStep={15}
                            name={"lunchend_" + index} id={"lunchend_" + index}
                            value={moment(this.state.workdayValues[index][lunchEndWithIndex], 'HH:mm')}
                            format={'HH:mm'}/>
                        <TimePicker
                            onChange={(date, dateString) => this.onChangeTimeEnd(date, dateString, "workend_" + index, index)}
                            minuteStep={15}
                            name={"workend_" + index} id={"workend_" + index}
                            value={moment(this.state.workdayValues[index][workendWithIndex], 'HH:mm')}
                            format={'HH:mm'}/>
                    </Row>
                )
            });
            return arr;
        }

    };

    /**
     * set workdaysValues into Array
     */
    setWorkDayValues = () => {
        if (this.state.workdayData != null) {
            let values = [];
            this.state.workdayData.days.map((value, index) => {
                let workstart = this.state.standard_startValue;
                let lunchstart = this.state.standard_lunchbreakStartValue;
                let lunchend = this.state.standard_lunchbreakEndValue;
                let workend = this.state.standard_endValue;
                var workstartWithIndex = "workstart_" + index;
                var lunchstartWithIndex = "lunchstart_" + index;
                var lunchEndWithIndex = "lunchend_" + index;
                var workendWithIndex = "workend_" + index;
                values.push(
                    {
                        [workstartWithIndex]: workstart,
                        [lunchstartWithIndex]: lunchstart,
                        [lunchEndWithIndex]: lunchend,
                        [workendWithIndex]: workend
                    }
                )
            });
            this.setState({
                workdayValues: values
            })
        }
    }

    /**
     * get Workdays from API
     */
    loadFromJson() {
        const axios = require('axios');

        let url = localStorage.getItem('url');

        url += "?action=getWorkdays";

        const params = new URLSearchParams();
        params.append("from", this.state.from);
        params.append("to", this.state.to);

        axios({
            method: 'post',
            url: url,
            data: params
        }).then((res) => {

            console.log(res.data)
            this.setState({
                workdayData: res.data
            });
            this.setWorkDayValues();
        })
    }
}


export default InternshipTimeWorkDay;
