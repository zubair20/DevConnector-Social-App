import {GET_ERRORS , SET_CURRENT_USER} from './types';
import setAuthToken from '../utils/setAuthToken';
import jwt_decode from 'jwt-decode';

import axios from 'axios';

//Register User
export const registerUser = (userData, history) => dispatch =>{
  
  axios
      .post('/api/users/register', userData)
      .then(res=> history.push('/login'))
      .catch(err => dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      }));
}

//Login - Get User Token
export const loginUser = userData => dispatch =>{

  axios.post('/api/users/login', userData)
    .then(res=> {

      const {token} = res.data;

      //Save to local storage
      localStorage.setItem('jwtToken', token);

      //Set token to Auth Header
      setAuthToken(token);

      //Decode token to get user Data
      const decoded = jwt_decode(token);

      //set Current User
      dispatch(setCurrentUser(decoded));
    })
    .catch(err => dispatch({

      type: GET_ERRORS,
      payload: err.response.data
    }));
}

//Set Logged in user
export const setCurrentUser = (decoded)=>{
  return {
    type: SET_CURRENT_USER,
    payload: decoded
  }
}

// Logout User
export const logoutUser = () => dispatch => {

  //remove token from local storage
  localStorage.removeItem('jwtToken');

  //Remove Auth header for future requests
  setAuthToken(false);

  //set current user to {} which will set isAuthenticated to false
  dispatch(setCurrentUser({}));
}