import { GET_ERRORS, CLEAR_ERRORS } from "./types";

//return the errors
export const returnErrors = (msg, status, id = null) => {
  return {
    type: GET_ERRORS,
    payload: { msg, status, id }
  };
};
//clearing the error prop
export const clearErrors = () => {
  return {
    type: CLEAR_ERRORS
  };
};
