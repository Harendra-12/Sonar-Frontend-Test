import axios from 'axios';
import { handleNavigation } from './Navigation';
const baseName = "http://192.168.1.88/ucaas-app/api"


// Creating instance of axios
const axiosInstance = axios.create({
    baseURL: baseName,
    headers: {
      'Content-Type': 'application/json',
    },
  });

const token = localStorage.getItem("token")
if(token!==null){
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`
}

  
const setAuthToken = (token) => {
    if (token) {
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete axiosInstance.defaults.headers.common['Authorization'];
    }
};

// Login function
export async function login(userName, password) {
  const parsedData = {
    email: userName,
    password: password
  };

  return axiosInstance.post(`/auth/login`, parsedData)
    .then(res => {
      const token = res.data.token;
      localStorage.setItem('token', token);
      setAuthToken(token);
      return res.data;
    })
    .catch(error => {
     return error.response.data;
    });
}

// General Get Function
export async function generalGetFunction (endpoint){
    return axiosInstance.get(endpoint).then(res=>{
        return res.data
    }).catch(err=>{
      if(err.response.status===401){
        handleNavigation("/")
        return err.response.data
      }else{
        return err.response.data
      }
      // console.log("This is error log",err.response.status);
       
        
    })
}

// General Post function
export async function generalPostFunction (endpoint,data){
  return axiosInstance.post(endpoint,data).then(res=>{
      return res.data
  }).catch(err=>{
    if(err.response.status===401){
      handleNavigation("/")
      return err.response.data
    }else{
      return err.response.data
    }
  })
}

// General Put function
export async function generalPutFunction (endpoint,data){
  return axiosInstance.put(endpoint,data).then(res=>{
      return res.data
  }).catch(err=>{
    if(err.response.status===401){
      handleNavigation("/")
      return err.response.data
    }else{
      return err.response.data
    }
  })
}

// General Delete Function
export async function generalDeleteFunction (endpoint){
  return axiosInstance.delete(endpoint).then(res=>{
      return res.data
  }).catch(err=>{
    if(err.response.status===401){
      handleNavigation("/")
      return err.response.data
    }else{
      return err.response.data
    }
  })
}

// ImageUpload function
export async function imageUploadFunction (endpoint,data){
  return  axiosInstance.post(endpoint,data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }).then(res=>{
      return res.data
  }).catch(err=>{
      return err.response.data
      
  })
}


// Back to top function
export const backToTop = () =>{
    window.scrollTo(0,0);
}

