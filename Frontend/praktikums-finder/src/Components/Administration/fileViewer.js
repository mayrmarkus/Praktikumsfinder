import 'rc-steps/assets/index.css';
import 'rc-steps/assets/iconfont.css';
import React, {Component} from 'react';
import './sidebar.css';

import ReactFileViewer from 'react-file-viewer';

let i = 0;
let path;

class FileViewer extends Component {

    state = {};

    render() {
        if (this.props.url && this.props.originalPath) {
            let fileType;

            if(path !== this.props.url){
                i++;
                path= this.props.url;
                if(this.props.originalPath){
                    let originalPath=this.props.originalPath + "";
                    let temp = originalPath.split(".");
                    //console.log(temp)
                    fileType = temp[temp.length-1];
                    if(fileType === 'doc'){
                        fileType = "docx"
                    }
                }
            }


            return (
                <div>
                    <ReactFileViewer key={i} filePath={this.props.url} fileType={fileType}/>
                </div>
            );
        } else {
            return <div>Keine datei Ausgewählt</div>
        }
    }

}

export default FileViewer;