import * as constants from '../actions/me';

export default (state = {}, action) => {
  switch (action.type) {
  case constants.SET_ACCESS_TOKEN:
    return {
      ...state,
      accessToken: action.accessToken,
      expiresIn: action.expiresIn
    };
  case constants.GET_ME_START:
    return state;
  case constants.GET_ME_SUCCESS:
    return {
      ...state,
      emailAddress: action.emailAddress,
      chainIdentifier: action.chainIdentifier,
      firstName: action.firstName,
      lastName: action.lastName,
    };
  case constants.GET_ME_FAIL:
    return {
      ...state,
      error: action.error
    };
  default:
    return state;
  }
};
