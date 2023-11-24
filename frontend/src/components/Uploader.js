import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import hash from 'hash.js';

import actions from '../actions';

class Component extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hashing: false,
      hashed: false,
      sendingPercent: 0,
      hash: undefined,
      location: undefined,
      selectedUser: {
        firstName: '',
        lastName: '',
        emailAddress: 'Select a recipient',
        userChainMappings: [
          {
            chainIdentifier: 'Only registered blockchain users will appear',
          }
        ]
      },
      openSelect: false,
    };
    this.intervalId = undefined;
  }

  componentDidMount() {
  }

  async uploadDocument (sasURL, containerName, file, fileName) {
    console.log('hashed', {});
    return true;
  }

  readFile(event, fileName) {
    this.setState({
      hash: hash.sha256().update(event.target.result).digest('hex'),
      hashing: false,
      hashed: true,
      location: `/documents/${fileName}`,
    });
  }

  increment() {
    this.setState({
      sendingPercent: this.state.sendingPercent + 1,
    });
    if(this.state.sendingPercent >= 99) {
      clearInterval(this.intervalId);
      window.location.reload();
    }
  }

  send() {
    this.props.send(
      this.state.selectedUser.userChainMappings[0].chainIdentifier,
      this.state.hash,
      this.state.location,
    );
    this.intervalId = setInterval(() => this.increment(), 100);
  }

  async changeFile() {
    this.setState({
      hashing: true,
    });
    var input = document.querySelector('input[type=file]');
    var file = input.files[0];

    if(file && file instanceof Blob) {
      const containerName = 'documents';
      // const sasURL = '...';
      // const fileName = file.name;
      // await this.uploadDocument(sasURL, containerName, file, fileName);
    }

    var reader = new FileReader();
    reader.addEventListener('load', (e) => this.readFile(e, file.name));
    reader.readAsText(file);
  }

  render() {
    return (
      <StyledComponent>
        <UploadComponent>
          {this.state.hashing ?
            <div className="dashes">
              <img className="files" alt="docs" src="/images/analyze.svg" />
              <Title>Hashing...</Title>
            </div>
            :
            <div style = {{ height: '100%' }}>
              {this.state.hashed ?
                <div className="dashes">
                  <img className="files" alt="docs" src="/images/finalize.svg" />
                  <Title>Done hashing file!</Title>
                  <Center>
                    <Hash>
                      <img className="file-hash-img" alt="download" src="/icons/hash.svg" />
                      <div className="file-hash-text">File Hash : {this.state.hash || ''}</div>
                    </Hash>
                  </Center>
                </div>
                :
                <div className="dashes">
                  <img className="files" alt="docs" src="/images/upload.svg" />
                  <Title>Select a new file</Title>
                  <input className="input" type="file" onChange={(e) => this.changeFile(e)}/>
                </div>
              }
            </div>
          }
        </UploadComponent>
        {this.state.sendingPercent > 0 ?
          <Loader sendingPercent={this.state.sendingPercent}>
            <div className='loading-bar' />
          </Loader>
          :
          <div>
            {this.state.hash ?
              <Send activated onClick={() => this.send()}>SEND HASH ON-CHAIN</Send>
              :
              <Send>SEND HASH ON-CHAIN</Send>
            }
          </div>
        }

      </StyledComponent>
    );
  }
}

Component.propTypes = {
  users: PropTypes.array,
  send: PropTypes.func.isRequired,
};

Component.defaultProps = {
  users: [],
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      send: actions.send,
    },
    dispatch
  );
};

const mapStateToProps = state => ({
  users: state.users.users,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Component);

const StyledComponent = styled.div`
`;

const UploadComponent = styled.div`
  box-shadow: 0 0.75rem 1.5rem rgba(18,38,63,.03);
  margin-bottom: 5px;
  border: 1px solid #edf2f9;
  border-radius: 8px;
  background-color: #fff;
  background-clip: border-box;
  font-size: 20px;
  font-weight: 700;
  text-transform: none;
  padding: 10px;
  height: 160px;
  text-align: center;
  color: #003e9f;

  .input {
    width: 156px;
  }

  .dashes {
    border: 2px dashed #e0ebf7;
    height: 100%;
    border-radius: 7px;
    height: calc(100% - 3px);
  }

  .files {
    height: 70px;
    margin-top: 18px;
  }
`;

const Title = styled.div`
  font-size: 20px;
  font-weight: 600;
`;


const LoggedIn = styled.div`
  position: relative;
  cursor: pointer;

  .more {
    position: absolute;
    right: 10px;
    top: 10px;
  }
`;

const LoggedIn2 = styled.div`
  border-bottom: 1px solid #edf2f9;
  margin-bottom: 5px;
  padding-bottom: 5px;
  cursor: pointer;

`;

const EmailAddress = styled.div`
  font-size: 15px;
`;

const ChainIdentifier = styled.div`
  color: #95aac9;
  font-size: 10px;
`;

const Recipient  = styled.div`
  box-shadow: 0 0.75rem 1.5rem rgba(18,38,63,.03);
  margin-bottom: 5px;
  border: 1px solid #edf2f9;
  border-radius: 8px;
  background-color: #fff;
  background-clip: border-box;
  font-size: 20px;
  font-weight: 700;
  text-transform: none;
  padding: 10px;
  color: #003e9f;
  position: relative;
`;

const Hash = styled.div`
  text-align: left;
  margin: auto;
  display: grid;
  grid-template-columns: 12px 520px;
  grid-gap: 10px;
  width: 532px;
  font-size: 13px;
  color: #95AAC9;
  font-weight: 300;

  .file-hash-img {
    padding-top: 1px;
  }
`;

const Send = styled.div`
  box-shadow: 0 0.75rem 1.5rem rgba(18,38,63,.03);
  margin-bottom: 15px;
  border: 1px solid #edf2f9;
  border-radius: 8px;
  background-color: #fff;
  background-clip: border-box;
  font-size: 15px;
  font-weight: 700;
  text-transform: none;
  padding: 10px;
  text-align: center;
  color: ${props => props.activated ? '#003e9f' : '#95AAC9'};
  cursor: ${props => props.activated ? 'pointer' : 'initial'};
`;

const Center = styled.div`
  text-align: center;
`;

const Selector = styled.div`
  position: absolute;
  top: -1px;
  left: -1px;
  width: calc(100% - 20px);
  box-shadow: 0 0.75rem 1.5rem rgba(18,38,63,.03);
  margin-bottom: 5px;
  border: 1px solid #edf2f9;
  border-radius: 8px;
  background-color: #fff;
  background-clip: border-box;
  font-size: 20px;
  font-weight: 700;
  text-transform: none;
  padding: 10px;
`;

const Loader = styled.div`
  box-shadow: 0 0.75rem 1.5rem rgba(18,38,63,.03);
  margin-bottom: 15px;
  border: 1px solid #edf2f9;
  border-radius: 8px;
  background-color: #fff;
  background-clip: border-box;
  font-size: 15px;
  font-weight: 700;
  text-transform: none;
  padding: 10px;
  text-align: center;
  height: 18px;
  position: relative;

  .loading-bar {
    width: ${props => props.sendingPercent}%;
    background: #003e9f;
    position: absolute;
    top: 0px;
    left: 0px;
    height: 36px;
    border: 1px solid #edf2f9;
    border-radius: 8px 0 0 8px;
  }
`;
