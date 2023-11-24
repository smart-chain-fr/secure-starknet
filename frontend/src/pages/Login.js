/* eslint-disable react/no-find-dom-node */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import styled from 'styled-components';

import actions from '../actions';
// import { ERROR } from '../model/constants';
import Button from '../components/Button';

class Login extends Component {
  login() {
  }

  render() {
    return (
      <StyledLogin>
        <Button margin={'12px 10px 0 0'} text="Login" onClick={() => this.login()} />
        <Button isGrey margin={'12px 10px 0 0'} text="Logout" onClick={() => this.props.logout()} />
        {JSON.stringify(this.props.accessToken)}
      </StyledLogin>
    );
  }
}

Login.propTypes = {
  accessToken: PropTypes.string,
  login: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired,
  showToastr: PropTypes.func.isRequired,
};

Login.defaultProps = {
  accessToken: undefined,
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      login: actions.login,
      logout: actions.logout,
      showToastr: actions.showToastr,
    },
    dispatch
  );
};

const mapStateToProps = state => ({
  accessToken: state.user.accessToken,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Login);

const StyledLogin = styled.div`

`;
