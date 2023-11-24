import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled, { keyframes } from 'styled-components';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import actions from '../actions';
import { SUCCESS, ERROR, INFO } from '../model/constants';
import { explicitError } from '../services/errors';

class Toastr extends Component {
  render() {

    let image = '/icons/toastr-error.svg';
    let text = 'Error';

    switch(this.props.category) {
    case SUCCESS:
      image = '/icons/toastr-success.svg';
      text = 'Success';
      break;
    case INFO:
      image = '/icons/toastr-success.svg';
      text = 'Info';
      break;
    case ERROR:
      image = '/icons/toastr-error.svg';
      text = 'Error';
      break;
    default:
    }

    return (
      <div>
        {this.props.toastrIsShowing &&
          <StyledToastr category={this.props.category}>
            <img className="status-img" alt='toastr' src={image} />
            <img className="separator-img" alt='toastr' src='/icons/toastr-separator.svg' />
            <div className="category-txt" >{text}</div>
            <div className="message-txt" >{explicitError(this.props.message)}</div>
            <div
              onClick={() => this.props.hideToastr()}
              onKeyPress={() => {}}
              role="button"
              tabIndex={0}
            >
              <img className="close-img" alt='toastr' src='/icons/close.svg' />
            </div>
          </StyledToastr>
        }
      </div>
    );
  }
}

Toastr.propTypes = {
  toastrIsShowing: PropTypes.bool.isRequired,
  category: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  hideToastr: PropTypes.func.isRequired,
};

Toastr.defaultProps = {
  toastrIsShowing: false,
  category: ERROR,
  message: 'No message',
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      hideToastr: actions.hideToastr,
    },
    dispatch
  );
};

const mapStateToProps = state => ({
  toastrIsShowing: state.toastr.toastrIsShowing,
  category: state.toastr.category,
  message: state.toastr.message,
});


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Toastr);

const rotate = keyframes`
  0%   {
    transform: translateY(0px);
  }
  10%  {
    transform: translateY(50px);
  }
  90%  {
    transform: translateY(50px);
  }
  100% {
    transform: translateY(0px);
  }
`;

const StyledToastr = styled.div`
  background: ${props => props.category === ERROR ? '#E27055' : 'linear-gradient(90deg, #1E7A9B, #154F64)' };
  border-radius: 0 0 17px 17px;
  position: absolute;
  top: -50px;
  left: calc(50% - 260px);
  width: 520px;
  height: 40px;
  display: grid;
  grid-template-columns: 40px 1px 69px calc(100% - 149px) 40px;
  color: #FFF;
  animation: ${rotate} 4s linear infinite;
  z-index: 1;

  .status-img {
    margin: 8px;
  }

  .separator-img {
    margin: 14px 0;
  }

  .category-txt {
    margin-left: 10px;
    font-size: 14px;
    font-weight: 700;
    line-height: 40px;
  }

  .message-txt {
    margin-left: 10px;
    font-size: 14px;
    font-weight: 300;
    line-height: 40px;
  }

  .close-img {
    margin: 12px;
    cursor: pointer;
  }
`;
