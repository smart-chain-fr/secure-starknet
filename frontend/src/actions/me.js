import axios from "axios";

import { handleError } from "../services/errors";
import get from "../services/get";
import { getContracts } from "./contracts";
import { getUsers } from "./users";

export const SET_ACCESS_TOKEN = "SET_ACCESS_TOKEN";
export const GET_ME_START = "GET_ME_START";
export const GET_ME_SUCCESS = "GET_ME_SUCCESS";
export const GET_ME_FAIL = "GET_ME_FAIL";

export const login = (hash) => (dispatch) => {
  dispatch(setAccessToken(hash));
  dispatch(getMe());
  dispatch(getContracts());
  dispatch(getUsers());
};

export const setAccessToken = (hash) => ({
  type: SET_ACCESS_TOKEN,
  accessToken: hash.access_token,
  expiresIn: parseInt(hash.expires_in),
});

const getMeStart = () => ({
  type: GET_ME_START,
});

const getMeSuccess = (response) => ({
  type: GET_ME_SUCCESS,
  emailAddress: get(response, "currentUser", "emailAddress"),
  chainIdentifier: get(
    response,
    "currentUser",
    "userChainMappings",
    "0",
    "chainIdentifier"
  ),
  firstName: get(response, "currentUser", "firstName"),
  lastName: get(response, "currentUser", "lastName"),
});

const getMeFail = (error) => {
  return {
    type: GET_ME_FAIL,
    error,
  };
};

export const getMe = () => (dispatch, getState) => {
  dispatch(getMeStart());

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
  dispatch(getMeSuccess({}));
  //   })
  //   .catch(error => {
  //     handleError(dispatch, error, getMeFail);
  //   });
};
