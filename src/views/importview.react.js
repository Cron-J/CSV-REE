import React, { Component, PropTypes } from 'react';
import JSONTree from 'react-json-tree';
import {Button} from 'react-bootstrap';

class ImportView extends Component {
  constructor(props) {
      super(props);
      this.jsonpreview = {};
  }
  componentWillReceiveProps(nextProps) {
    this.props = nextProps;
  }
  
  onDownload(){
    this.props.downloadMappedData();
  }

  render() {
    return (
            <div className="container">
                <div className="row">
                    <div className="upload-container">
                        <legend>Json Preview</legend>
                    </div>
                    <div className="col-lg-6">
                        <div className="row">
                          { this.props.data.importer.convertedJSON.length === 0 ?
                            <div>
                                <i className="fa fa-spinner fa-pulse"></i>
                            Processing Json</div>
                            :null
                          }
                           <div>
                             <pre>{<JSONTree data={ this.props.data.importer.convertedJSON }/>}</pre>
                             <Button bsStyle="primary" onClick={this.onDownload.bind(this)}>Download</Button>                                                   
                           </div>
                        
                        </div>
                    </div>
                </div>
            </div>
        )
  }
}

ImportView.propTypes = {
  data: React.PropTypes.object,
  downloadMappedData: React.PropTypes.func
};

export default ImportView;
