import React, { Component, PropTypes } from 'react';
import {ButtonToolbar, Glyphicon, Modal, Input, Button} from 'react-bootstrap';
import CustomTable from './customTable.react';

class PreviewView extends Component {
  constructor(props) {
      super(props);
      this.show=true;
  }
  componentWillReceiveProps(nextProps) {
    this.props = nextProps;
  }

  changeHeader = (e) => {
    if (this.props.onChangeHeader) {
      this.props.onChangeHeader();
    }
  }
  changeDateFormat = (e) => {
    if (this.props.onChangeDate) {
      this.props.onChangeDate(e.target.value);
    }
  }
  changeNumberFormat =(e) => {
    if (this.props.onChangeNumber) {
      this.props.onChangeNumber(e.target.value);
    }
  }
  changeDelimiterFormat = (e) => {
    if (this.props.onChangeDelimiter) {
      this.props.onChangeDelimiter(e.target.value);
    }
  }
  resetPreviewSetting = (e) => {
    this.props.previewSetting();
  }
  _renderDateOptions = () => {
    const options = [];
    for (let i = 0; i < this.props.data.setters.dateformat.length; i++) {
      if (this.props.data.setters.dateformat[i].value === this.props.data.dateFormat) {
        options.push(<option value={this.props.data.setters.dateformat[i].value} selected>{this.props.data.setters.dateformat[i].label}</option>);
      } else {
        options.push(<option value={this.props.data.setters.dateformat[i].value}>{this.props.data.setters.dateformat[i].label}</option>);
      }
    }
    return options;
  }
  _renderNumberFormatOptions = () => {
    const options = [];
    for (let i = 0; i < this.props.data.setters.numberformat.length; i++) {
      if (this.props.data.setters.numberformat[i].value === this.props.data.numberFormat) {
        options.push(<option value={this.props.data.setters.numberformat[i].value} selected>{this.props.data.setters.numberformat[i].label}</option>);
      } else {
        options.push(<option value={this.props.data.setters.numberformat[i].value}>{this.props.data.setters.numberformat[i].label}</option>);
      }
    }
    return options;
  }
  _renderDelimiterOptions = () => {
    const options = [];
    for (let i = 0; i < this.props.data.setters.delimiterformat.length; i++) {
      if (this.props.data.setters.delimiterformat[i].value === this.props.data.delimiter) {
        options.push(<option value={this.props.data.setters.delimiterformat[i].value} selected>{this.props.data.setters.delimiterformat[i].label}</option>);
      } else {
        options.push(<option value={this.props.data.setters.delimiterformat[i].value}>{this.props.data.setters.delimiterformat[i].label}</option>);
      }
    }
    return options;
  }

  render() {
    return (
        <form className="form-horizontal">
        <div className="row">
          <div className="col-md-3">

            <div className="form-group">
              <label className="col-sm-5 control-label">Date Format</label>
              <div className="col-sm-7">
                <select name="type" className="form-control" id="type" onChange={this.changeDateFormat} required>
                  {this._renderDateOptions()}
                </select>
              </div>
            </div>

          </div>
          <div className="col-md-3">

            <div className="form-group">
              <label className="col-sm-6 control-label">Number Format</label>
              <div className="col-sm-6">
                <select name="type" className="form-control" id="type" onChange={this.changeNumberFormat} required>
                  {this._renderNumberFormatOptions()}
                </select>
              </div>
            </div>

          </div>
          <div className="col-md-4">

            <div className="form-group">
              <label className="col-sm-5 control-label">Delimiter Format</label>
              <div className="col-sm-7">
                <select name="type" className="form-control" id="type" onChange={this.changeDelimiterFormat} required>
                  {this._renderDelimiterOptions()}
                </select>
              </div>
            </div>

          </div>
          <div className="col-md-2">

            <div className="form-group">
              <div className="col-sm-12">
                <div className="btn-group" data-toggle="buttons">
                  <label className="btn btn-default active" onClick={this.changeHeader}>
                    <input type="checkbox" id="header" autocomplete="off"  onChange={this.changeHeader} />Use first line as header
                  </label>
                </div>
              </div>
            </div>

          </div>

        </div>
        <hr></hr>

        <div className="table-box">
        { this.props.data.resultdata.headers && this.props.data.resultdata.headers.length>0 ?
          <div className="table-responsive">
            <CustomTable headers={this.props.data.resultdata.headers} data={this.props.data.resultdata.data} />
          </div>
          : null
        }
          
        </div>
        </form>
    );
  }
}

PreviewView.propTypes = {
    data: React.PropTypes.object,
    onChangeHeader: React.PropTypes.func,
    onChangeDelimiter: React.PropTypes.func,
    onChangeDate: React.PropTypes.func,
    onChangeNumber: React.PropTypes.func,
    previewSetting: React.PropTypes.func
};


export default PreviewView;
