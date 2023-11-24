import axios from 'axios';

import { handleError } from '../services/errors';

export const SEND_START = 'SEND_START';
export const SEND_SUCCESS = 'SEND_SUCCESS';
export const SEND_FAIL = 'SEND_FAIL';

const sendStart = () => ({
  type: SEND_START
});

const sendSuccess = () => ({
  type: SEND_SUCCESS,
});

const sendFail = error => {
  return ({
    type: SEND_FAIL,
    error
  });
};

export const send = (recipient, hash, location) => (dispatch, getState) => {
  dispatch(sendStart());
  console.log(recipient, hash, location);
  //TODO
};
