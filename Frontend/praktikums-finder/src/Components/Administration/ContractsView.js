import 'rc-steps/assets/index.css';
import 'rc-steps/assets/iconfont.css';
import React, {Component} from 'react';
import {Breadcrumb, BreadcrumbItem, Button, Card} from "react-bootstrap";
import TreeView from "@material-ui/lab/TreeView";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import TreeItem from '@material-ui/lab/TreeItem';
import GetAppIcon from '@material-ui/icons/GetApp';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import DeleteIcon from '@material-ui/icons/Delete';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';


import './AdministrationCusomStyle.css'
import FileViewer from "./fileViewer";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import TextField from "@material-ui/core/TextField";
import DialogActions from "@material-ui/core/DialogActions";
import {Divider} from "@material-ui/core";

class ContractsView extends Component {
    state = {
        data: {},
        dataLoaded: false,
        currentContractPath: null,
        unmountFileViewer: false,
        showValidationModal: false,
        enableValidation: false,
        fileOpen: false,
        fileUrl: null,
        internshipId: null,
        reasonToDeny: [],
        contract_state_data: null,
        dialogIsOpen: false,
        stateValues: null,
        lengthContractState: null,
        isApproved: false
    };

    componentDidMount() {
        this.loadData();
        this.getContractStates();

    }

    loadData = () => {
        const axios = require('axios');
        let url = localStorage.getItem('url');
        url += '?action=getContractsFolderContent';
        axios({
            method: 'post',
            url: url,
        }).then((res) => {
            this.setState({data: res.data})
        });
    };


    getFile = (path) => {
        const axios = require('axios');
        let url = localStorage.getItem('url');
        url += '?action=getContract';

        let params = new URLSearchParams();
        params.append("path", path);

        axios({
            responseType: 'arraybuffer',
            method: 'POST',
            data: params,
            url
        }).then((res) => {
            let data = new Blob([res.data], {type: res.headers['content-type']});

            let url = window.URL.createObjectURL(data);

            this.setState({fileUrl: url});
            this.setState({currentContractPath: path})

            let fileViewer = document.getElementById('fileViewer');

            if (fileViewer !== null) {
                document.removeChild(fileViewer);
            }
            this.setState({
                url
            })
        });
    };


    getContractPath = (id) => {
        const axios = require('axios');
        let url = localStorage.getItem('url');
        url += '?action=getContractPath';

        let data = new URLSearchParams();
        data.append("id", id);

        let that = this;

        axios({
            method: "POST",
            data,
            url
        }).then((res) => {
            this.setState({currentContractPath: res.data.path})
            that.getFile(res.data.path)
        });
    };

    getContractStates = () => {
        const axios = require('axios');
        let url = localStorage.getItem('url');
        url += '?action=getAllContractStates';
        axios({
            method: "POST",
            url
        }).then((res) => {
            if (res.data) {

                this.setState({
                    contract_state_data: res.data,
                    lengthContractState: res.data.length
                })
                this.createStateArray();
                this.viewModalBody();
            }
        });
    }


    clickedNode = (id, path, isApproved) => {
        if (id) {
            this.setState({fileOpen: true})
            this.setState({internshipId: id});

            this.getContractPath(id);
            this.setState({enableValidation: true});
        } else if (path) {
            //For not signed contracts
            this.setState({fileOpen: true})

            this.getFile(path)
            this.setState({enableValidation: false});
        }
        this.setState({isApproved: isApproved});
    };

    displayTree = () => {
        const renderTree = nodes => (
            <TreeItem onClick={() => this.clickedNode(nodes.internshipId, nodes.path, nodes.isApproved)}
                      nodeId={"a" + nodes.id} label={nodes.text}>
                {Array.isArray(nodes.children) ? nodes.children.map(node => renderTree(node)) : null}
            </TreeItem>
        );
        return (
            <TreeView
                defaultCollapseIcon={<ExpandMoreIcon/>}
                defaultExpanded={['1']}
                defaultExpandIcon={<ChevronRightIcon/>}
            >
                {renderTree(this.state.data)}
            </TreeView>
        );
    };

    render() {
        console.log(this.state);


        return (
            <div className={'w-100 adminViewContent bg-light'}>
                <Breadcrumb className={"flex-shrink-1"}>
                    <BreadcrumbItem href={'/loggedin/Administration'}>Administration</BreadcrumbItem>
                    <BreadcrumbItem href={'/loggedin/Administration/ClassInformation'}
                                    active={'active'}>ContractInformation</BreadcrumbItem>
                </Breadcrumb>
                <div>
                    <Dialog open={this.state.dialogIsOpen} onClose={this.handleDialogClose} fullWidth={true}
                            maxWidth={"xs"}
                            aria-labelledby="form-dialog-title">
                        <DialogTitle id="form-dialog-title">Zurückweisen</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                Was ist an diesem Vertrag falsch?
                            </DialogContentText>
                            {this.state.reasonToDeny}
                        </DialogContent>
                        <Divider/>
                        <DialogActions>
                            <Button onClick={this.handleDialogClose} color="primary">
                                Abbrechen
                            </Button>
                            <Button onClick={this.handleDialogSave} color="primary">
                                Speichern
                            </Button>
                        </DialogActions>
                    </Dialog>
                </div>

                <div className={"h-100 flex-grow-1 asideDesktopTopMobile fillChildrenOnMobile"}
                     style={{display: "flex", alignItems: "stretch", alignContent: "stretch", minHeight: "80vh", flex: 1}}>

                    <Card className={"treeItemContainer m-3"}
                          style={{float: 'left', maxHeight: "80vh", overflow: "visible"}}>
                        <Card.Header>Alle Verträge</Card.Header>
                        {this.displayTree()}
                    </Card>


                    <Card className={"m-3"}
                          style={{
                              float: 'right',
                              maxHeight: "80vh",
                              overflow: "auto",
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "stretch",
                              alignContent: "stretch",
                              flex:1
                          }}>

                        <Card.Header className={"d-flex justify-content-center py-3"}>
                            <Button disabled={!this.state.enableValidation || this.state.isApproved == "1"}
                                    className={"mx-2"}
                                    onClick={() => this.clickValidation(true)} variant={'success'}>Vertrag
                                Bestätigen <ThumbUpIcon/></Button>
                            <Button disabled={!this.state.fileOpen}
                                    onClick={() => this.downloadContract()}
                                    className={"mx-2"}>{this.state.link} <GetAppIcon/></Button>
                            <Button disabled={!this.state.enableValidation || this.state.isApproved == "1"}
                                    className={"mx-2"}
                                    variant={'danger'}
                                    onClick={() => this.clickValidation(false)}>Vertrag
                                Zurückweisen <ThumbDownIcon/></Button>
                        </Card.Header>


                        <Card.Body className={"overflow-auto"}>
                            <FileViewer originalPath={this.state.currentContractPath} url={this.state.url}/>
                        </Card.Body>

                    </Card>

                </div>

            </div>


        );
    }

    handleChange = (event) => {
        let arr = this.state.stateValues;
        if (!arr[event.target.value].isChecked) {
            arr[event.target.value].isChecked = true;
        } else {
            arr[event.target.value].isChecked = false;
        }
        this.setState({
            stateValues: arr
        })
        this.viewModalBody();
    };
    sendRateContract = (approved) => {
        let params = new URLSearchParams();
        var stateValues = [];
        if (!approved) {
            for (let i = 0; i < this.state.stateValues.length; i++) {
                var temp = [];
                temp.push("id", this.state.stateValues[i].id);
                temp.push("name", this.state.stateValues[i].name);
                temp.push("isChecked", this.state.stateValues[i].isChecked);
                stateValues.push(temp);
            }
            params.append('stateValues', JSON.stringify(stateValues));
        }

        params.append('approved', approved)
        params.append('internshipId', this.state.internshipId)
        const axios = require('axios');
        let url = localStorage.getItem('url');

        url += '?action=rateContract';
        axios({
            method: "POST",
            url,
            data: params
        }).then((res) => {
            console.log(res.data)
        });
    }
    createStateArray = () => {
        if (this.state.contract_state_data) {
            var arr = [];
            this.state.contract_state_data.map((v) => {
                arr.push({
                    name: v.name,
                    id: v.id,
                    isChecked: false,
                    isCreated: false
                })
            });
            this.setState({
                stateValues: arr
            })
        }
    }
    remove = (i) => {
        let ContractValue = this.state.contract_state_data;
        ContractValue.splice(i, 1)
        let Values = this.state.stateValues;
        Values.splice(i, 1);
        this.setState({
            contract_state_data: ContractValue,
            stateValues: Values
        })
        this.viewModalBody();
    }

    getDelete = (isCreated, index) => {
        if (isCreated) {
            return (<DeleteIcon onClick={() => this.remove(index)}/>)
        }
    }
    viewModalBody = () => {
        var temp = [];
        if (this.state.contract_state_data || this.state.stateValues) {
            this.state.contract_state_data.map((v, index) => {
                temp.push(
                    <div>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={this.state.stateValues[index].isChecked}
                                    onChange={this.handleChange}
                                    value={index}
                                    name={v.name}
                                    className={"dark"}
                                />
                            }
                            label={v.name}
                        />
                        <div className={"float-right mr-3"}>
                            {this.getDelete(this.state.stateValues[index].isCreated, index)}
                        </div>
                    </div>
                )
            })
            temp.push(
                <div className={"d-flex justify-content-between"}>
                    <div className={"w-75 mr-2"}>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="district"
                            label="Neuer Grund"
                            type="text"
                            fullWidth
                            onChange={this.handleNewState}
                        />
                    </div>
                    <div className={"ml-2 mt-3 w-25"}>
                        <button className={"btn-primary btn"} onClick={this.addNewState}>Hinzufügen</button>
                    </div>
                </div>);

            this.setState({
                reasonToDeny: temp
            })
        }
    }
    handleNewState = (e) => {
        this.setState({
            new_State: e.target.value
        });
    };

    addNewState = () => {
        let contractStateData = this.state.contract_state_data;
        let stateValue = this.state.stateValues;
        let name = this.state.new_State;

        contractStateData.push({
            description: name,
            name: name,
            general: 0
        })
        stateValue.push({
            name: name,
            isChecked: true,
            isCreated: true,
            id: null
        })

        this.setState({
            contract_state_data: contractStateData,
            stateValues: stateValue
        })
        this.viewModalBody();
    };

    handleDialogClose = () => {
        let length = this.state.lengthContractState;
        let ContractValue = this.state.contract_state_data;
        ContractValue.splice(length, ContractValue.length - length)
        let Values = this.state.stateValues;
        Values.splice(length, ContractValue.length - length);
        this.setState({
            contract_state_data: ContractValue,
            stateValues: Values,
            dialogIsOpen: false,

        })
        this.getFile(this.state.currentContractPath)
        this.viewModalBody();
    };

    handleDialogSave = () => {
        this.sendRateContract(false);
        console.log(this.state.stateValues);
        this.handleDialogClose();
    };

    /**
     *
     * @param accept
     */
    clickValidation = (accept) => {
        if (accept && this.state.internshipId) {
            this.sendRateContract(true)
        } else {
            this.handleDialogOpen();
        }
        this.getFile(this.state.currentContractPath);
    }
    handleDialogOpen = () => {
        this.setState({
            dialogIsOpen: true
        })
    };

    downloadContract = () => {
        if (this.state.fileUrl != null) {
            let a = document.createElement("a");
            document.body.appendChild(a);
            a.style = "display: none";
            a.href = this.state.fileUrl;
            a.download = "ArbeitsVertrag.docx";
            a.click();
        }
    }
}

export default ContractsView;
