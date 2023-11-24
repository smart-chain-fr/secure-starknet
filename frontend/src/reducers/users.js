import * as constants from '../actions/users';

export default (state = {}, action) => {
  switch (action.type) {
  case constants.GET_USERS_START:
    return {
      ...state,
      loading: false,
    };
  case constants.GET_USERS_SUCCESS:
    return {
      ...state,
      loading: true,
      users: action.users,
    };
  case constants.GET_USERS_FAIL:
    return {
      ...state,
      loading: false,
      error: action.error
    };
  default:
    return state;
  }
};
