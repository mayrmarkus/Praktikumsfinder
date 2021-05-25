import React, {Component} from 'react';

import EmailEditor from 'react-email-editor'

class EmailCopmoser extends Component {

    render() {
        return <div>
            <div>
                <button onClick={this.exportHtml}>Export HTML</button>
                <button onClick={this.exportJson}>Export JSON</button>
            </div>

            <EmailEditor
                ref={editor => this.editor = editor}
            />
        </div>
    }

    exportHtml = () => {
        this.editor.exportHtml(data => {
            const { design, html } = data
            console.log('exportHtml', html)
        })
    }

    exportJson = () => {
        this.editor.saveDesign(function (design) {
            console.log(design);
        });
    }

}

export default EmailCopmoser;
