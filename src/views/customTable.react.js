import React from 'react';
import { BootstrapTable, TableHeaderColumn, TableDataSet } from 'react-bootstrap-table';

class Customtable extends React.Component {
  constructor(props) {
    super(props);
  }
  componentWillReceiveProps(nextProps) {
    this.props = nextProps;
  }
  getHeader = (header, isKey) => {
    if (header.value && header.label) {
      return <TableHeaderColumn dataSort  dataFormat={this.callback.bind(this, header.value)} isKey={isKey} dataField={header.value} className="ellipsis">{header.label}</TableHeaderColumn>;
    }
    return <TableHeaderColumn dataSort dataFormat={this.callback.bind(this, header)} isKey={isKey} dataField={header} className="ellipsis">{header}</TableHeaderColumn>;
  }
  callback = (header, data, row) => {
    if (this.props.customFunctions && this.props.customFunctions[header]) {
      return this.props.customFunctions[header](data, row);
    }
    return data;
  }
  _renderColumn = () => {
    const tableheaders = [];
    let keyCount = 0;
    for (let i = 0; i < 6; i++) {
      tableheaders.push(this.getHeader(this.props.headers[i], keyCount === 0));
      keyCount++;
    }
    return tableheaders;
  }
  render() {
    return (
      <BootstrapTable data={this.props.data}>
        {this._renderColumn()}
      </BootstrapTable>
    )
  }
}

Customtable.propTypes = {
  headers: React.PropTypes.oneOfType([
    React.PropTypes.arrayOf[React.PropTypes.object],
    React.PropTypes.arrayOf[React.PropTypes.string],
  ]),
  data: React.PropTypes.arrayOf[React.PropTypes.object],
  customFunctions: React.PropTypes.object
};

export default Customtable;
