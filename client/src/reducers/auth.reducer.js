import {
  USER_LOADING,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT_SUCCESS,
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  ADD_FOLLOW_FAIL,
  ADD_FOLLOW_SUCCESS,
  UN_FOLLOW_SUCCESS,
  UN_FOLLOW_FAIL
} from "../actions/types";

const initialState = {
  token: localStorage.getItem("token"),
  isAuth: null,
  isLoading: false,
  user: null,
  message: null
};

export default function(state = initialState, action) {
  switch (action.type) {
    case USER_LOADING:
      return {
        ...state, //returns current state
        isLoading: true
      };
    case USER_LOADED:
      return {
        ...state,
        isAuth: true,
        isLoading: false,
        user: action.payload
      };
    case LOGIN_SUCCESS:
      localStorage.setItem("token", action.payload.token);
      return {
        ...state,
        ...action.payload, //including entire payload, which has user and token
        isAuth: true,
        isLoading: false
      };
    case REGISTER_SUCCESS:
      localStorage.setItem("token", action.payload.token); //setting the token
      return {
        ...state,
        ...action.payload, //including entire payload, which has user and token
        isAuth: true,
        isLoading: false
      };
    case AUTH_ERROR:
      localStorage.removeItem("token");
      return {
        ...state,
        token: null,
        isLoading: false,
        isAuth: false,
        user: null
      };

    case LOGIN_FAIL:
      localStorage.removeItem("token");
      return {
        ...state,
        token: null,
        isLoading: false,
        isAuth: false,
        user: null
      };

    case LOGOUT_SUCCESS:
      localStorage.removeItem("token");
      return {
        ...state,
        token: null,
        isLoading: false,
        isAuth: false,
        user: null
      };

    case REGISTER_FAIL:
      localStorage.removeItem("token");
      return {
        ...state,
        token: null,
        isLoading: false,
        isAuth: false,
        user: null
      };
    case ADD_FOLLOW_SUCCESS:
      return {
        ...state,
        user: {
          ...state.user,
          followed: action.payload
        }
      };

    case ADD_FOLLOW_FAIL:
      return {
        ...state
      };
    case UN_FOLLOW_SUCCESS:
      return {
        ...state,
        user: {
          ...state.user,
          followed: action.payload
        },
        message: "User unfollowed successfully!"
      };
    //TODO SE MIINUS JUTTU
    case UN_FOLLOW_FAIL:
      return {
        ...state
      };
    default:
      return state;
  }
}
