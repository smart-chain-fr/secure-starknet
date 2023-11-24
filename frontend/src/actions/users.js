import axios from 'axios';

import { handleError } from '../services/errors';

export const GET_USERS_START = 'GET_USERS_START';
export const GET_USERS_SUCCESS = 'GET_USERS_SUCCESS';
export const GET_USERS_FAIL = 'GET_USERS_FAIL';

const getUsersStart = () => ({
  type: GET_USERS_START
});

const getUsersSuccess = users => ({
  type: GET_USERS_SUCCESS,
  users,
});

const getUsersFail = error => {
  return ({
    type: GET_USERS_FAIL,
    error
  });
};

export const getUsers = () => (dispatch, getState) => {
  dispatch(getUsersStart());
};
