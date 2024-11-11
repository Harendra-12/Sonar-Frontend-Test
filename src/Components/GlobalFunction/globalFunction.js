import axios from "axios";
import { handleNavigation, handleDispatch } from "./Navigation";
import { toast } from "react-toastify";
// const baseName = "http://127.0.0.1:8000/api"
const baseName = "https://192.168.1.88/UcaasS-Backend/api";

// Creating instance of axios
const axiosInstance = axios.create({
  baseURL: baseName,
  headers: {
    "Content-Type": "application/json",
  },
});

const token = localStorage.getItem("token");
if (token !== null) {
  axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

const setAuthToken = (token) => {
  if (token) {
    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete axiosInstance.defaults.headers.common["Authorization"];
  }
};

// Login function
export async function login(userName, password) {
  const parsedData = {
    email: userName,
    password: password,
  };

  return axiosInstance
    .post(`/auth/login`, parsedData)
    .then((res) => {
      const token = res.data.token;
      localStorage.setItem("token", token);
      setAuthToken(token);
      return res.data;
    })
    .catch((error) => {
      return error;
    });
}

// General Get Function
export async function generalGetFunction(endpoint) {
  handleDispatch({
    type: "SET_LOADING",
    loading: true,
  });
  return axiosInstance
    .get(endpoint)
    .then((res) => {
      handleDispatch({
        type: "SET_LOADING",
        loading: false,
      });
      return res.data;
    })
    .catch((err) => {
      handleDispatch({
        type: "SET_LOADING",
        loading: false,
      });
      if (err.response?.status === 401) {
        handleNavigation("/");
        return err.response.data;
      } else {
        // return null;
        return err;
      }
      // console.log("This is error log",err.response.status);
    });
}

// General Post function
export async function generalPostFunction(endpoint, data) {
  return axiosInstance
    .post(endpoint, data)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      if (err.response.status === 500) {
        toast.error("Something went wrong");
      } else if (err.response.data.errors) {
        const errorMessage = Object.keys(err.response.data.errors);
        toast.error(err.response.data.errors[errorMessage[0]][0]);
      } else if (err.response.data.error) {
        const errorMessage = Object.keys(err.response.data.error);
        toast.error(err.response.data.error[errorMessage[0]][0]);
      } else {
        toast.error(
          err.response.data.message
            ? err.response.data.message
            : "Something went wrong"
        );
      }
      if (err.response.status === 401) {
        // handleNavigation("/");
        return err.response.data;
      } else {
        return err.response.data;
      }
    });
}

// General Put function
export async function generalPutFunction(endpoint, data) {
  return axiosInstance
    .put(endpoint, data)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      if (err.response.status === 500) {
        toast.error("Something went wrong");
      } else if (err.response.data.errors) {
        // toast.error(err.response.data.errors.callScreen[0]);
        const errorMessage = Object.keys(err.response.data.errors);
        toast.error(err.response.data.errors[errorMessage[0]][0]);
      } else if (err.response.data.error) {
        const errorMessage = Object.keys(err.response.data.error);
        toast.error(err.response.data.error[errorMessage[0]][0]);
      } else {
        toast.error(err.response.data.message);
      }
      if (err.response.status === 401) {
        handleNavigation("/");
        return err.response.data;
      } else {
        return err.response.data;
      }
    });
}

// General Delete Function
export async function generalDeleteFunction(endpoint) {
  return axiosInstance
    .delete(endpoint)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      console.log("delete error:", err);
      if (err.response.status === 500) {
        toast.error("Something went wrong");
      } else if (err.response.data.errors) {
        const errorMessage = Object.keys(err.response.data.errors);
        toast.error(err.response.data.errors[errorMessage[0]][0]);
      } else if (err.response.data.error) {
        const errorMessage = Object.keys(err.response.data.error);
        toast.error(err.response.data.error);
      } else {
        toast.error(
          err.response.data.message
            ? err.response.data.message
            : "Something went wrong"
        );
      }
      if (err.response.status === 401) {
        handleNavigation("/");
        return err.response.data;
      } else {
        return err.response.data;
      }
    });
}

// DileUpload function
export async function fileUploadFunction(endpoint, data) {
  return axiosInstance
    .post(endpoint, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err.response.data;
    });
}

// Back to top function
export const backToTop = () => {
  window.scrollTo(0, 0);
};
