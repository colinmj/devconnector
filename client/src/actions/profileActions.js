import axios from 'axios';
import {
  GET_PROFILE,
  PROFILE_LOADING,
  GET_ERRORS,
  CLEAR_CURRENT_PROFILE,
  SET_CURRENT_USER
} from './types';

// get current profile

export const getCurrentProfile = () => dispatch => {
  dispatch(setProfileLoading());
  axios
    .get('/api/profile')
    .then(res => {
      dispatch({
        type: GET_PROFILE,
        payload: res.data
      });
    })
    .catch(err => {
      dispatch({
        type: GET_PROFILE,
        payload: {}
      });
    });
};

//create profile

export const createProfile = (profileData, history) => dispatch => {
  axios
    .post('/api/profile', profileData)
    .then(result => {
      history.push('/dashboard');
    })
    .catch(e => {
      dispatch({
        type: GET_ERRORS,
        payload: e.response.data
      });
    });
};

//profile loading
export const setProfileLoading = () => {
  return {
    type: PROFILE_LOADING
  };
};

//clear profile
export const clearCurrentProfile = () => {
  return {
    type: CLEAR_CURRENT_PROFILE
  };
};

//delete account and profile
export const deleteAccount = () => dispatch => {
  if (
    window.confirm(
      'Are you sure you want to delete your account? This is irreversible'
    )
  ) {
    axios
      .delete('/api/profile')
      .then(res => {
        dispatch({
          type: SET_CURRENT_USER,
          payload: {}
        });
      })
      .catch(e => {
        dispatch({
          type: GET_ERRORS,
          payload: e.response.data
        });
      });
  }
};
