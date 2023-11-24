import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import queryString from "query-string";

import Button from "./Button";
import actions from "../actions";

class NavBar extends React.Component {
  componentDidMount() {
    const parsedHash = queryString.parse(window.location.hash);
    if (parsedHash && parsedHash.access_token && parsedHash.expires_in) {
      this.props.login(parsedHash);
    }
  }

  render() {
    return (
      <StyledNavBar className="StyledNavBar">
        <Title>SECURE</Title>
        <div>
          <Button
            onClick={() => {}}
            text="CONNECT WALLET"
            margin="6px 0"
            right
          />
        </div>
      </StyledNavBar>
    );
  }
}

NavBar.propTypes = {
  login: PropTypes.func.isRequired,
  accessToken: PropTypes.string,
  expiresIn: PropTypes.number,
  emailAddress: PropTypes.string,
  chainIdentifier: PropTypes.string,
  firstName: PropTypes.string,
  lastName: PropTypes.string,
};

NavBar.defaultProps = {};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      login: actions.login,
    },
    dispatch
  );
};

const mapStateToProps = (state) => ({
  accessToken: state.me.accessToken,
  expiresIn: state.me.expiresIn,
  emailAddress: state.me.emailAddress,
  chainIdentifier: state.me.chainIdentifier,
  firstName: state.me.firstName,
  lastName: state.me.lastName,
});

export default connect(mapStateToProps, mapDispatchToProps)(NavBar);

const StyledNavBar = styled.div`
  background: #fff;
  padding: 12px 16px;
  border-bottom: 1px solid #e3ebf6;
  display: grid;
  grid-template-columns: auto auto;

  .logo {
    height: 40px;
  }
`;

const Title = styled.div`
  font-size: 28px;
  font-weight: bold;
  line-height: 40px;
`;
