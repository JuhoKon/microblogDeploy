import { combineReducers } from "redux";
import itemReducer from "./item.reducer";
import errorReducer from "./error.reducer";
import authReducer from "./auth.reducer";

export default combineReducers({
  //redux states
  item: itemReducer,
  error: errorReducer,
  auth: authReducer
});
