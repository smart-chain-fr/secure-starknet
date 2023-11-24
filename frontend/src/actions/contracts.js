import axios from "axios";

import { handleError } from "../services/errors";

export const GET_CONTRACTS_START = "GET_CONTRACTS_START";
export const GET_CONTRACTS_SUCCESS = "GET_CONTRACTS_SUCCESS";
export const GET_CONTRACTS_FAIL = "GET_CONTRACTS_FAIL";

const getContractsStart = () => ({
  type: GET_CONTRACTS_START,
});

const getContractsSuccess = (contracts) => ({
  type: GET_CONTRACTS_SUCCESS,
  contracts,
});

const getContractsFail = (error) => {
  return {
    type: GET_CONTRACTS_FAIL,
    error,
  };
};

export const getContracts = () => (dispatch, getState) => {
  dispatch(getContractsStart());

  // return axios({
  //   method: 'get',
  //   url: '...',
  //   crossdomain: true,
  //   data: {},
  //   headers: {
  //     'Authorization': 'Bearer ' + getState().me.accessToken
  //   }
  // })
  //   .then(response => {
  //     const contracts = response.data && response.data.contracts ? response.data.contracts.reverse() : [];
  //     console.log(contracts);
  dispatch(getContractsSuccess({}));
  //   })
  //   .catch(error => {
  //     handleError(dispatch, error, getContractsFail);
  //   });
};
