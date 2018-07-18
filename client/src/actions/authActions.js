import axios from 'axios';
import jwt_decode from 'jwt-decode';
import setAuthToken from '../utils/setAuthToken';

//types
import { GET_ERRORS, SET_CURRENT_USER } from './types';

//Register User
export const registerUser = (userData, history) => dispatch => {
  axios
    .post('api/users/register', userData)
    .then(result => {
      history.push('/login');
    })
    .catch(e =>
      dispatch({
        type: GET_ERRORS,
        payload: e.response.data
      })
    );
};

// login user
export const loginUser = userData => dispatch => {
  axios
    .post('/api/users/login', userData)
    .then(result => {
      //save to localstorage
      const { token } = result.data;
      // set token to localstorage
      localStorage.setItem('jwtToken', token);
      // set token to auth header
      setAuthToken(token);
      //decode token to get user data
      const decoded = jwt_decode(token);
      // set current user
      dispatch(setCurrentUser(decoded));
    })
    .catch(e => {
      dispatch({
        type: GET_ERRORS,
        payload: e.response.data
      });
    });
};

// set logged in user
export const setCurrentUser = decoded => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded
  };
};
