import * as constants from '../actions/send';

export default (state = {}, action) => {
  switch (action.type) {
  case constants.SEND_START:
    return {
      ...state,
      loading: false,
    };
  case constants.SEND_SUCCESS:
    return {
      ...state,
      loading: true,
    };
  case constants.SEND_FAIL:
    return {
      ...state,
      loading: false,
      error: action.error
    };
  default:
    return state;
  }
};
