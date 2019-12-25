import axios from "axios";
import {
  GET_ITEM,
  GET_ITEMS,
  ADD_ITEM,
  DELETE_ITEM,
  ITEMS_LOADING,
  //GET_AN_ITEM,
  UPDATE_ITEM,
  CLEAR_MESSAGES
} from "./types";
import { tokenConfig } from "./auth.actions";
import { returnErrors } from "./error.actions";
//return all items
export const getItems = () => dispatch => {
  dispatch(setItemsLoading());
  axios
    .get("/posts")
    .then(res =>
      dispatch({
        type: GET_ITEMS,
        payload: res.data.posts.reverse()
      })
    )
    .catch(err =>
      dispatch(
        returnErrors(err.response.data, err.response.status, "GET_ITEMS_FAIL")
      )
    )
    .catch(err => console.error(err));
};
export const getFollowed = followedIds => dispatch => {
  dispatch(setItemsLoading());
  axios
    .post("/posts/followedPosts", followedIds)
    .then(res =>
      dispatch({
        type: GET_ITEMS,
        payload: res.data.reverse()
      })
    )
    .catch(err =>
      dispatch(
        returnErrors(err.response.data, err.response.status, "GET_ITEMS_FAIL")
      )
    )
    .catch(err => console.error(err));
};
//get Post by postID
/*export const getItemByID = id => dispatch => {
  dispatch(setItemsLoading());
  axios
    .get(`/posts/find/${id}`)
    .then(res =>
      dispatch({
        type: GET_AN_ITEM,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch(
        returnErrors(err.response.data, err.response.status, "GET_ITEM_FAIL")
      )
    );
};
*/
//create a post
export const addItem = item => (dispatch, getState) => {
  axios
    .post("/posts/create", item, tokenConfig(getState))
    .then(res =>
      dispatch({
        type: ADD_ITEM,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch(
        returnErrors(err.response.data, err.response.status, "ADD_ITEM_FAIL")
      )
    );
};
//get posts by userID
export const getItemsByUserID = (owner, id) => dispatch => {
  dispatch(setItemsLoading());
  const config = {
    headers: {
      "Content-Type": "application/json"
    }
  };
  //requesting body
  const body = JSON.stringify({ owner, id }); //TODO: remove id and make it owrk without
  //console.log(body);
  axios
    .post("/posts/postsByID", body, config)
    .then(res =>
      dispatch({
        type: GET_ITEM,
        payload: res.data.posts.reverse()
      })
    )
    .catch(err =>
      dispatch(
        returnErrors(
          err.response.data,
          err.response.status,
          "GET_ITEMS_BYID_FAIL"
        )
      )
    );
};
//update post
export const updateItem = (item, id) => (dispatch, getState) => {
  const config = {
    headers: {
      "Content-Type": "application/json"
    }
  };
  const title = item.title;
  const text = item.text;
  const owner = item.owner;
  const username = item.username;

  const body = JSON.stringify({ title, text, id, owner, username });

  axios
    .put(`/posts/update/${id}`, body, tokenConfig(getState), config)
    .then(res =>
      dispatch({
        type: UPDATE_ITEM,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch(
        returnErrors(err.response.data, err.response.status, "POST_UPDATE_FAIL")
      )
    );
};
//get posts by username
export const getItemsByUsername = (owner, id) => (dispatch, getState) => {
  dispatch(setItemsLoading());
  const config = {
    headers: {
      "Content-Type": "application/json"
    }
  };
  //requesting body
  const body = JSON.stringify({ owner, id });
  //console.log(body);
  axios
    .post("/posts/postsByUsername", body, config)
    .then(res =>
      dispatch({
        type: GET_ITEM,
        payload: res.data.posts.reverse()
      })
    )
    .catch(err =>
      dispatch(
        returnErrors(
          err.response.data,
          err.response.status,
          "GET_ITEMS_BYNAME_FAIL"
        )
      )
    );
};
//delete item by postID
export const deleteItem = id => (dispatch, getState) => {
  axios
    //.delete(`/api/items/${id}`, tokenConfig(getState))
    .delete(`/posts/${id}`, tokenConfig(getState))
    .then(res =>
      dispatch({
        type: DELETE_ITEM,
        payload: id
      })
    )
    .catch(err =>
      dispatch(
        returnErrors(err.response.data, err.response.status, "DELETE_ITEM_FAIL")
      )
    );
};
//set loading props to true
export const setItemsLoading = () => {
  return {
    type: ITEMS_LOADING
  };
};
//clear messages prop
export const clearMessages = () => {
  return {
    type: CLEAR_MESSAGES
  };
};
