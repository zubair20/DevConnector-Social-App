import axios from 'axios';
import {GET_PROFILE ,GET_PROFILES , PROFILE_LOADING , CLEAR_CURRENT_PROFILE, GET_ERRORS, SET_CURRENT_USER} from './types';
import {clearErrors} from './postActions';

//Get current profile
export const getCurrentProfile = () => dispatch =>{
  dispatch(setProfileLoading());
  axios.get('/api/profile')
    .then(res => dispatch({
      type: GET_PROFILE,
      payload: res.data
    }))
    .catch(err => dispatch({
      type: GET_PROFILE,
      payload: {} // May be user created account but not fullfil profile , so {}
    }))
}

//Get Profile by Handle
export const getProfileByHandle = handle => dispatch =>{
  dispatch(setProfileLoading());
  axios.get(`/api/profile/handle/${handle}`)
    .then(res => dispatch({
      type: GET_PROFILE,
      payload: res.data
    }))
    .catch(err => dispatch({
      type: GET_PROFILE,
      payload: null
    }))
}


//Get all profile
export const getProfiles = () => dispatch =>{
  dispatch(setProfileLoading());
  axios.get('/api/profile/all')
    .then(res => dispatch({
      type: GET_PROFILES,
      payload: res.data
    }))
    .catch(err => dispatch({
      type: GET_PROFILES,
      payload: null
    }))
}

//Delete Account
export const deleteAccount = () => dispatch => {

  if(window.confirm('Are you Sure? This cannot be undone')){
    axios
      .delete('/api/profile')
      .then(res=> dispatch({

        type: SET_CURRENT_USER,
        payload: {}
      }))
      .catch(err => dispatch({
        
        type: GET_ERRORS,
        payload: err.response.data
      }));
  }
}

//Create Profile
export const createProfile = (profileData, history) => dispatch =>{
  dispatch(clearErrors());
  axios
    .post('/api/profile', profileData)
    .then(res=> history.push('/dashboard'))
    .catch(err=> dispatch({
      type:GET_ERRORS,
      payload: err.response.data
    }));
}

//add Experience
export const addExperience = (expData, history) => dispatch =>{

  axios
    .post('/api/profile/experience',  expData)
    .then(res => history.push('/dashboard'))
    .catch(err=> dispatch({
      type: GET_ERRORS,
      payload: err.response.data
    }));
}

//add Education
export const addEducation = (eduData, history) => dispatch =>{

  axios
    .post('/api/profile/education',  eduData)
    .then(res => history.push('/dashboard'))
    .catch(err=> dispatch({
      type: GET_ERRORS,
      payload: err.response.data
    }));
}

//Delete Experience
export const deleteExperience = (id) => dispatch =>{

  axios
    .delete(`/api/profile/experience/${id}`)
    .then(res => dispatch({
      type: GET_PROFILE,
      payload: res.data
    }))
    .catch(err=> dispatch({
      type: GET_ERRORS,
      payload: err.response.data
    }));
}

//Delete Education
export const deleteEducation = (id) => dispatch =>{

  axios
    .delete(`/api/profile/education/${id}`)
    .then(res => dispatch({
      type: GET_PROFILE,
      payload: res.data
    }))
    .catch(err=> dispatch({
      type: GET_ERRORS,
      payload: err.response.data
    }));
}

//Profile Loading
export const setProfileLoading = ()=>{
  return {
    type: PROFILE_LOADING
  }
}

//Clear Profile
export const clearCurrentProfile = ()=>{
  return {
    type: CLEAR_CURRENT_PROFILE
  }
}