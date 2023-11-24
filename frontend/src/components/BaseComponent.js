import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import actions from '../actions';

class Base extends React.Component {
  componentDidMount() {
  }

  render() {
    return (
      <StyledBase className="StyledBase">
        <div className="yo">
        </div>
      </StyledBase>
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

const StyledBase = styled.div`
  display: grid;
  grid-template-columns: auto;
`;
