import React, { Component, PropTypes } from 'react';
import {Button, ButtonToolbar, Glyphicon, Input} from 'react-bootstrap';
import ListBox from './listBox.react';
import MapSelection from './mapSelection.react';
import MappingTable from './mappingTable.react';
import _ from 'underscore';

class MappingView extends Component {
  constructor(props) {
      super(props);
      //this.props.onAutoMapping();
  }
  componentWillReceiveProps(nextProps) {
    this.props = nextProps;
  }
  onMappingNameChange = (e) => {
    this.props.onChnageMappingName(e.currentTarget.value);
  }
  removeActiveClasses = () => {
    $('.default-value').removeClass('active');
    $("a[data-list='column'").removeClass('active');
    $("a[data-list='table'").removeClass('active');
    $("a[data-list='property'").removeClass('active');
  }
  onMap = () => {
    this.removeActiveClasses();
    this.props.onMappData();
  }
  onMapAttribute = () => {
    this.props.onMapAttribute();
  }
  onColumnChange = (column,index) => {
    $("a[data-list='column'").removeClass('active');
    $("a[data-select='"+column+"-column'").addClass('active');
    if (this.props.onColumnChange) {
      this.props.onColumnChange(column);
    }
  }
  onTableSelect = (table, index) => {
    $("a[data-list='table'").removeClass('active');
    $("a[data-list='property'").removeClass('active');
    $("a[data-select='"+table+"-table'").addClass('active');
    if (this.props.onTableSelect) {
      this.props.onTableSelect(table, index);
    }
  }
  onPropertyChange = (property, index) => {
    $("a[data-list='property'").removeClass('active');
    $("a[data-select='"+property+"-property'").addClass('active');
    if (this.props.onPropertyChange) {
      this.props.onPropertyChange(property);
    }
  }
  onMapSelect = (value) => {
    if (this.props.onTableChange) {
      this.props.onTableChange(value);
    }
  }
  onAdd = () => {
    this.props.onMappingAdd();
  }
  onRemove = () => {
    this.props.onMappingRemove();
  }
  onsaveTranformation = (row, transformation) => {
    if (this.props.onsaveTranformation) {
      this.props.onsaveTranformation(row, transformation);
    }
  }
  isMapValid = () => {
    const map = this.props.data.map;
    if (map.currentColumn.length > 0 && map.tableObject.length > 0  && map.currentProperty.length > 0) {
      return false;
    }
    return true;
  }
  isAutoAttributeMapValid = () => {
    const map = this.props.data.map;
    if (map.currentColumn.length > 0) {
      return false;
    }
    return true;
  }
  onDefaultValueChange = (e) => {
    if(e.currentTarget.value.length>0)
      $('.default-value').addClass('active');
    else
      $('.default-value').removeClass('active');
    if (this.props.onDefaultValueChange) {
      this.props.onDefaultValueChange(e.currentTarget.value);
    }
  }
  onMapdataRemove = (rowid) => {
    if (this.props.onMapDataRemove) {
      this.props.onMapDataRemove(rowid);
    }
  }
  onSave = () => {
    if(this.props.onSaveMappingData) {
      this.props.onSaveMappingData(this.props.data);
    }
  }
  renderColumnHiglight = () => {
    let object = {};
    _.each(this.props.data.map.mappedColumn, function(val, index){
      object[val] = {color: '#3c763d', mapped: true};
    });
    return object;
  }
  selectDefaultValue = () => {
     if(!$('.default-value').hasClass('active')){
      this.props.ignoreDefaultValue();
    }
  }
  renderPropertyHighlight = () => {
    let object = {};
    const selectedChildTableIndex = this.props.data.map.selectedChildTableIndex;
    const mappedProperty = this.props.data.map.mappedProperty;
    const selectedTable = this.props.data.map.selectedTable.split('(');
    _.each(this.props.data.map.requiredProperty, function(val, index){
      if (!mappedProperty[val]) {
        object[val] = {color: '#31708f', required:true};
      }
    });
    _.each(this.props.data.map.mappedProperty, function(val, index){
      for(let i in val){
        if(selectedTable[0] == i && val[i]['index'] == selectedChildTableIndex){
          console.log('---pp---', val[i]['property']);
          console.log('check object', object[val[i]['property']]);
          if(!object[val[i]['property']])
            object[val[i]['property']] = {};
          object[val[i]['property']]['mapped']= true;
        }
      }
    });
    return object;
      }
  render() {
    return (
          <div className="container">
      <form className="form-horizontal">
        <div className="row">
          <div className="col-md-4">

            <div className="form-group">
              <label className="col-sm-4 control-label">Mapping Name</label>
              <div className="col-sm-8">
                <input type="text" className="form-control" value={this.props.data.map.mappingName}
                onChange={this.onMappingNameChange} required disabled={this.props.data.viewOnly}></input>
              </div>
            </div>

          </div>


        </div>
        <hr></hr>


        <div className="row">
          <div className="col-md-4">

            <h4>Input File Columns
              <div className="pull-right">
                <button className="btn btn-default btn-xs"><span className="glyphicon glyphicon-question-sign"></span></button>
              </div>
            </h4>

            <div className="input-group">
              <span className="input-group-btn">
                <Button className="btn btn-default default-value" onClick={this.selectDefaultValue} data-toggle="button">Default Value</Button>
              </span>
              <input type="text" className="form-control" value={this.props.data.map.defaultValue} onChange={this.onDefaultValueChange} placeholder=""></input>
              <span className="input-group-btn">
                <button className="btn btn-default"><span className="glyphicon glyphicon-pencil"></span></button>
              </span>
            </div>
            <hr></hr>

            
              <ListBox type="column" highlightItems={this.renderColumnHiglight()} value={this.props.data.map.currentColumn} data={this.props.data.map.columns} onItemSelect={this.onColumnChange}/>

          </div>
          <div className="col-md-1">
            <h4>&nbsp;</h4>
            <div className="form-group">
              <div className="col-sm-12 ext-height">
              </div>
            </div>
            <hr></hr>

            <button type="button"  disabled={this.isMapValid()} onClick={this.onMap} className="btn btn-primary btn-block">Map <span className="glyphicon glyphicon-chevron-right"></span></button>
            <button type="button" disabled={this.isAutoAttributeMapValid()} onClick={this.onMapAttribute} className="btn btn-default btn-block">Auto<br/>Add</button>

          </div>
          <div className="col-md-3">

            <h4>Tables
              <div className="pull-right">
                <button className="btn btn-default btn-xs"><span className="glyphicon glyphicon-question-sign"></span></button>
              </div>
            </h4>
            <div className="form-group">
              <div className="col-sm-12">
              <MapSelection remove={this.props.data.map.remove} tableobject={this.props.data.map.tableObject} onAdd={this.onAdd} onRemove={this.onRemove} onSelect={this.onMapSelect} value={this.props.data.map.currentTable} data={this.props.data.map.childTables} />
              </div>
            </div>
            <hr></hr>

             <ListBox type="table" selectionlevel={[0, 2]} value={this.props.data.map.tableObject} data={this.props.data.map.tables} onItemSelect={this.onTableSelect}/>
          </div>
          <div className="col-md-4">


            <h4>Properties
              <div className="pull-right">
                <button className="btn btn-default btn-xs"><span className="glyphicon glyphicon-question-sign"></span></button>
              </div>
            </h4>
            <div className="form-group">
              <div className="col-sm-12 ext-height">
              </div>
            </div>
            <hr></hr>
              <ListBox type="property" highlightItems={this.renderPropertyHighlight()} value={this.props.data.map.currentProperty} data={this.props.data.map.properties} onItemSelect={this.onPropertyChange}/>
          </div>

        </div>
        <hr></hr>
        <div className="table-box">
          <div className="table-responsive">
           <MappingTable onsaveTranformation={this.onsaveTranformation} onRemove={this.onMapdataRemove} data={this.props.data.map.mappingData} />
          </div>
        </div>


</form>

    </div>
    );
  }
}

MappingView.propTypes = {
  data: React.PropTypes.object,
  onColumnChange: React.PropTypes.func,
  onTableSelect: React.PropTypes.func,
  onPropertyChange: React.PropTypes.func,
  onTableChange: React.PropTypes.func,
  onMappingAdd: React.PropTypes.func,
  onMappingRemove: React.PropTypes.func,
  onMappData: React.PropTypes.func,
  onMapDataRemove: React.PropTypes.func,
  onMapAttribute: React.PropTypes.func,
  onDefaultValueChange: React.PropTypes.func,
  onSaveMappingData: React.PropTypes.func,
  onChnageMappingName: React.PropTypes.func,
  onsaveTranformation: React.PropTypes.func,
  ignoreDefaultValue: React.PropTypes.ignoreDefaultValue
};

export default MappingView;
