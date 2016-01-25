import React from 'react';
import {Button, Glyphicon} from 'react-bootstrap';

class CSVNavigation extends React.Component {
  constructor(props) {
    super(props);
    console.log('--CSV Navigation--', this.props);
  }
  componentWillReceiveProps(nextProps) {
    this.props = nextProps;
  }
  resetPreviewSetting = () => {
    this.props.previewSetting();
  }
  checkDisability = (buttontype) => {
    if (this.props.block.indexOf(buttontype) > -1 ){
      return true;
    }
    return false;
  }
  render() {
    return (
      <div className="form-submit text-right">
        { this.props.data.currentview == 'preview' ?
          <Button onClick={this.resetPreviewSetting.bind(this)}>Reset Preview</Button>
        : null
        }
        <span> </span>
        <Button disabled={this.checkDisability('prev')} onClick={this.props.onPrev}><Glyphicon glyph="chevron-left"/></Button><span> </span>
        <Button bsStyle="primary" disabled={this.checkDisability('next')} onClick={this.props.onNext}>Next <Glyphicon glyph="chevron-right" /></Button>
      </div>
    )
  }
}

CSVNavigation.propTypes = {
  onNext: React.PropTypes.func,
  onPrev: React.PropTypes.func,
  block: React.PropTypes.array,
};

export default CSVNavigation;
