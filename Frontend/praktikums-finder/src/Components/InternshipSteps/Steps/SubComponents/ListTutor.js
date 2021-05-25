import 'rc-steps/assets/index.css';
import 'rc-steps/assets/iconfont.css';
import React, {Component} from 'react';
import Card from "react-bootstrap/Card";
import Avatar from "@material-ui/core/Avatar";

class ListTutor extends Component {
    state = {
        data: [],
        selectionOpen: false,
        selectedTutorId: 0
    };


    componentDidMount() {
        console.log(this.props.default);
        if (this.props.default !== null) {
            this.setState({selectedTutorId: this.props.default});
        }
    }

    clickTutor = (key) => {
        console.log(key);
        this.setState({selectedTutorId: key});
        this.props.onClick(key)
    };


    render() {
        return (
            <div className="blockListWrapper">

                {
                    this.props.data.map((v, k) => {
                        return (
                            <div key={k} className={'internshipListItem'}>
                                <Card
                                    className={this.state.selectedTutorId === v.id && 'border border-primary'}
                                    onClick={() => {
                                        this.clickTutor(v.id)
                                    }}>
                                    <Card.Header className={"d-flex align-items-baseline justify-content-between"}>
                                        <Avatar>AC</Avatar>

                                        {v.firstname} {v.surname}
                                        <div/>
                                    </Card.Header>
                                    <Card.Body>
                                        {v.email}
                                    </Card.Body>
                                </Card>

                            </div>
                        )
                    })
                }
            </div>
        );
    }
}


export default ListTutor;
