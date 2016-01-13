import React, { Component, PropTypes } from 'react';
import JSONTree from 'react-json-tree';

class ImportView extends Component {
  constructor(props) {
      super(props);
      this.jsonpreview = {};
  }
  componentWillReceiveProps(nextProps) {
    this.props = nextProps;
  }

  render() {
    console.log('Import---->', this.props.data);
    return (
            <div className="container">
                <div className="row">
                    <div className="upload-container">
                        <legend>Json Preview</legend>
                    </div>
                    <div className="col-lg-6">
                        <div className="row">
                            <div ng-hide="mappedJson">
                                <i className="fa fa-spinner fa-pulse"></i>
                            Processing Json</div>
                       
                           <div>
                             <pre>{<JSONTree data={ this.props.data.importer.convertedJSON }/>}</pre>                                                   
                           </div>
                        
                        </div>
                    </div>
                </div>
            </div>
        )
  }
}

ImportView.propTypes = {
  data: React.PropTypes.object
};

export default ImportView;
