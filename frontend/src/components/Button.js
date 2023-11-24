import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

class Button extends Component {
  render() {
    return (
      <StyledButton
        type="button"
        className="StyledButton"
        onClick={() => this.props.onClick()}
        isGrey={this.props.isGrey}
        margin={this.props.margin}
        right={this.props.right}
      >
        {this.props.text}
      </StyledButton>
    );
  }
}

Button.propTypes = {
  onClick: PropTypes.func.isRequired,
  text: PropTypes.string.isRequired,
  isGrey: PropTypes.bool,
  margin: PropTypes.string,
  right: PropTypes.bool,
};

Button.defaultProps = {
  isGrey: false,
  margin: '12px auto 0 auto',
};

export default Button;

const StyledButton = styled.div`
  height: 22px;
  background: ${(props) => props.isGrey ? '#989898' : '#003e9f' };
  color: #FFF;
  font-size: 13px;
  font-weight: 400;
  display: inline-block;
  line-height: 22px;
  text-align: center;
  margin-top: 12px;
  margin: ${(props) => props.margin}
  float: ${(props) => props.right ? 'right' : 'unset'}
  padding: 4px 8px;
  border-radius: 6px;
  cursor: pointer;
`;
