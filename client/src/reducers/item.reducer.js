import {
  GET_ITEMS,
  ADD_ITEM,
  DELETE_ITEM,
  ITEMS_LOADING,
  GET_ITEM,
  GET_USER,
  UPDATE_ITEM,
  CLEAR_MESSAGES
} from "../actions/types";

const initialState = {
  items: [],
  loading: false,
  item: [],
  message: null
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_ITEMS:
      return {
        ...state,
        items: action.payload,
        loading: false
      };
    case DELETE_ITEM:
      return {
        ...state,
        items: state.items.filter(item => item._id !== action.payload)
      };
    case ADD_ITEM:
      return {
        ...state,
        items: [action.payload, ...state.items],
        message: "Post added successfully"
      };
    case ITEMS_LOADING:
      return {
        ...state,
        loading: true
      };
    case GET_ITEM:
      return {
        ...state,
        items: action.payload,
        loading: false
      };
    case GET_USER:
      return {
        ...state,
        item: action.payload,
        loading: false
      };
    case UPDATE_ITEM:
      return {
        ...state,
        items: [
          action.payload, //updated item
          ...state.items.filter(item => item._id !== action.payload._id) //current items - updated one
        ],
        message: "Post updated successfully"
      };
    case CLEAR_MESSAGES:
      return {
        ...state,
        message: null
      };
    default:
      return state;
  }
}
