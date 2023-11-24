import * as constants from '../actions/toastr';

export default (state = {}, action) => {
  switch (action.type) {
  case constants.SHOW_TOASTR:
    return {
      ...state,
      toastrIsShowing: true,
      category: action.category,
      message: typeof action.message === 'string' ? action.message : JSON.stringify(action.message),
    };
  case constants.HIDE_TOASTER:
    return {
      ...state,
      toastrIsShowing: false,
    };
  default:
    return state;
  }
};
