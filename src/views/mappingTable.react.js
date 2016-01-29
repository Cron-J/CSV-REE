import React, { Component, PropTypes } from 'react';
import CustomTable from './customTable.react';
import {Button, Glyphicon} from 'react-bootstrap';
import TransformationModal from './transformationModal.react.js';

class MappingTable extends Component {
	constructor(props) {
		super(props);
		this.state = {transformations: [], showtransformations: false};
	}
	componentWillReceiveProps(nextProps) {
		this.props = nextProps;
	}
	removeRow = (rowid) => {
		if(this.props.onRemove) {
			this.props.onRemove(rowid);
		}
	}
	onTransformation = (transformations, transformationid) => {
		this.setState({showtransformations: true, transformations: transformations, transformationid: transformationid});
	}
	onTransformationSave = (rowid, transformations) => {
		if (this.props.onsaveTranformation) {
			this.props.onsaveTranformation(rowid, transformations);
			this.setState({showtransformations: false, transformations: []});
		}
	}
	onTransformationClose = () => {
		this.setState({showtransformations: false, transformations: []});
	}
	tabledataFormat = (data, row) => {
		if(row.ellipsis)
		  return row.actualTable+'('+row.ellipsis.toString()+').' + row.field;
		else
		  return row.actualTable+'.' + row.field;
	}
	transformationsFormat = (data, row) => {	
		return <Button class="btn btn-default btn-sm" onClick={this.onTransformation.bind(this, row.transformations, row.indx)}><Glyphicon glyph="pencil"/><span className="label label-default">{data.length} active</span></Button>;
	}
	actionFormat = (data, row) => {
		return <Button class="btn btn-default btn-sm" onClick={this.removeRow.bind(this, row.indx)}><Glyphicon glyph="trash"/></Button>;
	}
	render() {
		return (
			<div>
				<TransformationModal transformationid={this.state.transformationid} onTransformationSave={this.onTransformationSave} onTransformationClose={this.onTransformationClose}  show={this.state.showtransformations} transformations={this.state.transformations} />
				<CustomTable customFunctions={{
				 	table: this.tabledataFormat,
				 	transformations: this.transformationsFormat,
				 	action: this.actionFormat
				 }}
				 headers={[
		              {value: 'userFieldName', label: 'Imported Column'},
		              {value: 'transformations', label: 'Transformation'},
		              {value: 'table', label: 'Property Name'},
		              {value: 'field', label: 'Property Description'},
		              {value: 'indx', label: 'Index'},
		              {value: 'action', label: 'Actions'}
		              // 'instance',
		              // 'isRequired',
		            ]}  data={this.props.data} />
    	</div>
		)
	}
}

MappingTable.propTypes = {
  data: React.PropTypes.arrayOf(React.PropTypes.object),
  onRemove: React.PropTypes.func,
  onsaveTranformation: React.PropTypes.func
}

export default MappingTable;