import React, { Component, PropTypes } from 'react';

class ListBox extends Component {
  constructor(props) {
      super(props);
  }
  componentWillReceiveProps(nextProps) {
    this.props = nextProps;
  }
  selectItem = (e) => {
    e.preventDefault();
  	if (this.props.onItemSelect) {
  		this.props.onItemSelect(e);
  	}
  }
  isSelectionValid = (level) => {
    if (this.props.selectionlevel) {
      if (this.props.selectionlevel.indexOf(level) > -1) {
        return true
      }
      return false;
    }
    return true;
  }
  getHiglightStyle = (value) => {
    if (this.props.highlightItems && this.props.highlightItems[value]) {
      return this.props.highlightItems[value];
    }
    return {};
  }
  renderChild = (data, value, level) => {
  	let children = [];
  	if (data) {
	  	for (let i = 0; i < data.length; i++) {
        const style = {};
        const isValidSelection = this.isSelectionValid(level);
        style.paddingLeft = level * 9;
        //to highlight selected
        /*if (data[i].value === value && isValidSelection) {
          style.fontSize = 17;
          style.color = 'red';
        }*/
        const highlightstyle = this.getHiglightStyle(data[i].value);
        const newstyle = {...style, ...highlightstyle}
        let v;
        let l;
        if(data[i].ellipsis){
          v= data[i].value+'('+data[i].ellipsis+')';
          l= data[i].label+'('+data[i].ellipsis+')';
        }else{
          v= data[i].value;
          l= data[i].label;
        }
        if (!isValidSelection) {
          children.push(<optgroup label={data[i].value}></optgroup>);
        } else {
          children.push(<option value={v} data-index={i} className="ellipsis" style={newstyle}>{l}</option>);
        }
        children = children.concat(this.renderChild(data[i].children, value, level+1));
	  	}
  	}
  	return children;
  }
  render() {
    return (
    	<select  className="mapping-select" size="20" onClick={this.selectItem}>
        {this.renderChild(this.props.data, this.props.value, 0)}
      </select>
   	);
  }
}

ListBox.propTypes = {
  data: React.PropTypes.arrayOf(React.PropTypes.string),
  value: React.PropTypes.string,
  onItemSelect: React.PropTypes.func,
  selectionlevel: React.PropTypes.arrayOf(React.PropTypes.number),
  highlightItems: React.PropTypes.arrayOf(React.PropTypes.object)
};

export default ListBox;