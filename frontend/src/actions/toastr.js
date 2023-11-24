export const SHOW_TOASTR = 'SHOW_TOASTR';
export const HIDE_TOASTER = 'HIDE_TOASTER';

export const showToastr = (category, message) => dispatch => {
  dispatch({
    type: SHOW_TOASTR,
    category,
    message
  });
  setTimeout(() => {
    dispatch(hideToastr());
  }, 4000);
  return;
};

export const hideToastr = () => dispatch => {
  return dispatch({
    type: HIDE_TOASTER,
  });
};
