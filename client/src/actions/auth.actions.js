import axios from "axios";
import { returnErrors } from "./error.actions";
import {
  USER_LOADED,
  USER_LOADING,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT_SUCCESS,
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  ADD_FOLLOW_FAIL,
  ADD_FOLLOW_SUCCESS,
  UN_FOLLOW_FAIL,
  UN_FOLLOW_SUCCESS,
  GET_USER
} from "./types";

//Checking token & loading the user
export const loadUser = () => (dispatch, getState) => {
  //Load user
  dispatch({ type: USER_LOADING });
  axios
    .get("/auth/user", tokenConfig(getState))
    .then(res =>
      dispatch({
        type: USER_LOADED,
        payload: res.data //send res.data as payload
      })
    )
    .catch(err => {
      dispatch(returnErrors(err.response.data, err.response.status));
      dispatch({
        type: AUTH_ERROR
      });
    });
};

export const register = ({ name, email, password, age }) => dispatch => {
  const config = {
    headers: {
      "Content-Type": "application/json"
    }
  };
  //requesting body
  const body = JSON.stringify({ name, email, password, age });

  axios
    .post("/users/create", body, config)
    .then(res =>
      dispatch({
        type: REGISTER_SUCCESS, //to reducer
        payload: res.data
      })
    )
    .catch(err => {
      dispatch(
        returnErrors(err.response.data, err.response.status, "REGISTER_FAIL")
      );
      dispatch({
        type: REGISTER_FAIL
      });
    });
};
export const login = ({ email, password }) => dispatch => {
  //HANDLE LOGIN
  const config = {
    headers: {
      "Content-Type": "application/json"
    }
  };
  //requesting body
  const body = JSON.stringify({ email, password });

  axios
    .post("/auth", body, config)
    .then(res =>
      dispatch({
        type: LOGIN_SUCCESS,
        payload: res.data
      })
    )
    .catch(err => {
      dispatch(
        returnErrors(err.response.data, err.response.status, "LOGIN_FAIL")
      );
      dispatch({
        type: LOGIN_FAIL
      });
    });
};
export const logout = () => {
  return {
    type: LOGOUT_SUCCESS
  };
};
export const getUser = id => (dispatch, getState) => {
  console.log(id);
  const config = tokenConfig(getState);
  console.log(config);
  config.headers["id"] = id;
  axios
    .get("/users/getUserInfo", config)
    .then(res =>
      dispatch({
        type: GET_USER,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch(
        returnErrors(err.response.data, err.response.status, "GET_ITEMS_FAIL")
      )
    )
    .catch(err => console.error(err));
};
export const follow = (ownId, followId) => (dispatch, getState) => {
  const body = JSON.stringify({ followId, ownId });

  const config = tokenConfig(getState);
  axios
    .put("/users/update", body, config)
    .then(res =>
      dispatch({
        type: ADD_FOLLOW_SUCCESS, //to reducer
        payload: res.data
      })
    )
    .catch(err => {
      dispatch(
        returnErrors(err.response.data, err.response.status, "ADD_FOLLOW_FAIL")
      );
      dispatch({
        type: ADD_FOLLOW_FAIL
      });
    });
};
export const unfollow = (ownId, followId) => (dispatch, getState) => {
  const config = tokenConfig(getState);
  config.headers["ownId"] = ownId;
  config.headers["followId"] = followId;

  axios
    .delete("/users/unfollow", config)
    .then(res =>
      dispatch({
        type: UN_FOLLOW_SUCCESS, //to reducer
        payload: res.data
      })
    )
    .catch(err => {
      dispatch(
        returnErrors(err.response.data, err.response.status, "ADD_FOLLOW_FAIL")
      );
      dispatch({
        type: UN_FOLLOW_FAIL
      });
    });
};
// Setup config/headers and token, helper function
export const tokenConfig = getState => {
  // Get token from localstorage
  const token = getState().auth.token;

  // Headers
  const config = {
    headers: {
      "Content-type": "application/json"
    }
  };

  // If token, add to headers
  if (token) {
    config.headers["x-auth-token"] = token;
  }

  return config;
};
