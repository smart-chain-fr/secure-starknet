import * as constants from '../actions/contracts';

export default (state = {}, action) => {
  switch (action.type) {
  case constants.GET_CONTRACTS_START:
    return {
      ...state,
      loading: false,
    };
  case constants.GET_CONTRACTS_SUCCESS:
    return {
      ...state,
      loading: true,
      contracts: action.contracts,
    };
  case constants.GET_CONTRACTS_FAIL:
    return {
      ...state,
      loading: false,
      error: action.error
    };
  default:
    return state;
  }
};
