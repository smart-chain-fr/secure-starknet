import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import styled from "styled-components";

import actions from "../actions";
import get from "../services/get";
import Card from "./Card";
import Uploader from "./Uploader";

class Home extends React.Component {
  componentDidMount() {}

  render() {
    return (
      <StyledHome>
        <Grid>
          <div className="uploads">
            <Surtitle>HASH A NEW DOCUMENT</Surtitle>
            <Uploader />
            <Surtitle>YOUR HASHS</Surtitle>
            {this.props.contracts && this.props.contracts.length > 0 ? (
              <div>
                {this.props.contracts
                  .filter(
                    (contract) =>
                      get(contract, "transactions", "0", "from") ===
                      this.props.chainIdentifier
                  )
                  .map((contract) => (
                    <Card
                      key={contract.id}
                      location={get(
                        contract,
                        "contractProperties",
                        "4",
                        "value"
                      )}
                      address={get(contract, "ledgerIdentifier")}
                      from={get(contract, "transactions", "0", "from")}
                      recipient={get(
                        contract,
                        "contractProperties",
                        "2",
                        "value"
                      )}
                      hash={get(contract, "contractProperties", "3", "value")}
                      date={get(contract, "contractProperties", "5", "value")}
                    />
                  ))}
              </div>
            ) : (
              <Center>
                <Title>No file available</Title>
              </Center>
            )}
          </div>
          <div className="chatbot">
            <Surtitle>AI CHATBOT</Surtitle>
            Coming soon...
          </div>
        </Grid>
      </StyledHome>
    );
  }
}

Home.propTypes = {
  getContracts: PropTypes.func.isRequired,
  accessToken: PropTypes.string,
  loading: PropTypes.bool,
  contracts: PropTypes.array,
  chainIdentifier: PropTypes.string,
};

Home.defaultProps = {
  loading: false,
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      getContracts: actions.getContracts,
    },
    dispatch
  );
};

const mapStateToProps = (state) => ({
  accessToken: state.me.accessToken,
  loading: state.contracts.loading,
  contracts: state.contracts.contracts,
  chainIdentifier: state.me.chainIdentifier,
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);

const StyledHome = styled.div`
  background: #f9fbfd;
  padding: 20px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: auto auto;
  grid-gap: 20px;
`;

const Center = styled.div`
  margin: calc(50vh - 200px) auto;
  text-align: center;
`;

const Title = styled.div`
  font-size: 20px;
  font-weight: 600;
  margin-top: 20px;
`;

const Surtitle = styled.div`
  color: #95aac9;
  font-size: 10px;
  font-weight: 500;
  padding-bottom: 10px;
  margin-bottom: 13px;
  border-bottom: 1px solid #e3ebf6;
`;
