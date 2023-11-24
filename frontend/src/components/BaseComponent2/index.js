import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import actions from '../actions';
import './style.scss';

class Base extends React.Component {
  componentDidMount() {
  }

  render() {
    return (
      <div className="Base">
        <div className="yo">
        </div>
      </div>
    );
  }
}

Base.propTypes = {
  reduxVal: PropTypes.string,
  reduxAction: PropTypes.func.isRequired,
};

Base.defaultProps = {
  reduxVal: undefined,
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      reduxAction: actions.reduxAction,
    },
    dispatch
  );
};

const mapStateToProps = state => ({
  reduxVal: state.toastr.reduxVal,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Base);
