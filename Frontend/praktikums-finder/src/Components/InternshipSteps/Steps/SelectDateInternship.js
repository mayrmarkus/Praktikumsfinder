import 'rc-steps/assets/index.css';
import 'rc-steps/assets/iconfont.css';
import React, {Component} from 'react';
import {DateRange, registerLocale} from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css';
import {Button, Col, Row} from "react-bootstrap"; // theme css file
import MediaQuery from 'react-responsive'
import de from "date-fns/locale/de";

class SelectDateInternship extends Component {

    state = {
        range: {
            startDate: new Date(),
            endDate: new Date(),
            key: 'selection',
        }
    };


    componentDidMount() {
        console.log({loadedDates: this.props.default});

        //load default value
        if (this.props.default.from && this.props.default.to) {

            let ranges = {
                startDate: Date.parse(this.props.default.from),
                endDate: new Date(this.props.default.to),
                key: 'selection',
            };

            this.setState({range: ranges});
        }
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

        return (
            <div className={'d-flex justify-content-center align-items-center bg-light'}>

                <Col>
                    <Row className={'justify-content-md-center'}>
                        <h1>Dein Praktikumszeitraum</h1>
                    </Row>
                    <br/>
                    <Row className={'justify-content-md-center'}>
                        {/*Media Query for Desktop*/}
                        <MediaQuery minDeviceWidth={1224}>
                            <DateRange
                                locale={de}
                                ranges={[this.state.range]}
                                onChange={this.handleSelect}
                                months={2}
                                direction={'horizontal'}
                            />
                        </MediaQuery>
                        {/*Media Query for Mobile*/}
                        <MediaQuery maxWidth={1024} maxDeviceWidth={1024}>
                            <DateRange
                                locale={de}
                                minDate={this.state.range.minDate}
                                ranges={[this.state.range]}
                                onChange={this.handleSelect}
                                months={2}
                                direction={'vertical'}
                            />
                        </MediaQuery>
                    </Row>
                    <Row>
                        <Col>
                            <Button className={'w-25 float-right'} onClick={() => {
                                console.log(this.state.range);
                                this.props.setCompleted('from', this.state.range.startDate, null);
                                this.props.setCompleted('to', this.state.range.endDate, 2);
                            }}>Weiter</Button>
                        </Col>
                    </Row>
                </Col>

            </div>

        );
    }


}


export default SelectDateInternship;
