import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { connect } from 'react-redux';

import get from '../services/get';

class Component extends React.Component {
  componentDidMount() {
  }

  render() {
    return (
      <StyledComponent className="StyledComponent" isOk={this.props.location}>
        <div className="filename">
          <img className="filename-img" alt="download" src={this.props.location ? '/icons/check.svg' : '/icons/error.svg'} />
          <div className="filename-text">{this.props.location || 'Error, file already exists'}</div>
        </div>
        {this.props.location ?
          <div>
            <div className="details">
              <div className="address">
                <img className="address-img" alt="download" src="/icons/eth.svg" />
                <div className="address-text">Contract Address : {this.props.address || ''}</div>
              </div>
              <div className="meta-hash">
                <img className="meta-to-img" alt="download" src="/icons/to.svg" />
                <div className="meta-hash-text">To :&nbsp;
                  {this.props.recipient ?
                    `${this.props.users.filter(user => get(user,'userChainMappings','0','chainIdentifier') === this.props.recipient).map(user => `${user.firstName} <${user.emailAddress}>`)} ${this.props.recipient}`
                    : ''
                  }
                </div>
              </div>
              <div className="meta-hash">
                <img className="meta-to-img" alt="download" src="/icons/from.svg" />
                <div className="meta-hash-text">From :&nbsp;
                  {this.props.from ?
                    `${this.props.users.filter(user => get(user,'userChainMappings','0','chainIdentifier') === this.props.from).map(user => `${user.firstName} <${user.emailAddress}>`)} ${this.props.from}`
                    : ''
                  }
                </div>
              </div>
              <div className="file-hash">
                <img className="file-hash-img" alt="download" src="/icons/hash.svg" />
                <div className="file-hash-text">File Hash : {this.props.hash || ''}</div>
              </div>
              <div className="date">
                <img className="date-img" alt="download" src="/icons/time.svg" />
                <div className="date-text">Uploaded Date : {this.props.date || ''}</div>
              </div>
            </div>
            <a className="download-link" target="_blank" rel="noopener noreferrer" href={`${this.props.location}`}>
              <div className="download">
                <img className="download-img" alt="download" src="/icons/download.svg" />
                <div className="download-text">Download</div>
              </div>
            </a>
          </div>
          :
          <div />
        }
      </StyledComponent>
    );
  }
}

Component.propTypes = {
  users: PropTypes.array,
  location: PropTypes.string,
  address: PropTypes.string,
  from: PropTypes.string,
  recipient: PropTypes.string,
  hash: PropTypes.string,
  date: PropTypes.string,
};

Component.defaultProps = {
  users: [],
};

const mapStateToProps = state => ({
  users: state.users.users,
});

export default connect(
  mapStateToProps,
  null
)(Component);


const StyledComponent = styled.div`
  box-shadow: 0 0.75rem 1.5rem rgba(18,38,63,.03);
  margin-bottom: 10px;
  border: 1px solid #edf2f9;
  border-radius: 4px;
  background-color: #fff;
  background-clip: border-box;
  font-size: 15px;
  font-weight: 700;
  text-transform: none;
  border-left: 4px solid ${props => props.isOk ? '#003e9f' : '#F90021'};
  padding: 10px 20px;
  position: relative;

  .details {
    font-size: 13px;
    color: #95AAC9;
    font-weight: 300;
  }

  .download {
    position: absolute;
    top: 12px;
    right: 10px;
    display: grid;
    grid-template-columns: 15px auto;
    grid-gap: 9px;
    font-size: 13px;
    color: #95AAC9;
    font-weight: 300;
    border: 1px solid #95AAC9;
    border-radius: 10px;
    line-height: 19px;
    padding: 1px 9px 0px 1px;
  }

  .filename {
    display: grid;
    grid-template-columns: 20px auto;
    grid-gap: 16px;
    margin-top: 2px;
    margin-bottom: ${props => props.isOk ? '16px' : '2px'};
    color: ${props => props.isOk ? '#003e9f' : '#F90021'};
  }

  .address, .file-hash, .meta-hash, .date {
    display: grid;
    grid-template-columns: 12px auto;
    grid-gap: 10px;
    margin-top: 5px;
  }

  .filename-text {
    line-height: 22px;
  }

  .date {
    margin-bottom: 8px;
  }

  .meta-to-img {
    padding-top: 2px;
  }
`;
