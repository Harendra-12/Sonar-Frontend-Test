import axios from "axios";
import { handleNavigation, handleDispatch } from "./Navigation";
import { toast } from "react-toastify";
const baseName = process.env.REACT_APP_BACKEND_BASE_URL;

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

  return axios
    .post(`${baseName}/auth/login`, parsedData)
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
        return err
        ?.response?.data;
      }else if(err?.response?.status === 429){
       toast.error("Too many attempts. Please wait before trying again.")
      }
      else if (err.response?.status >= 500) {
        toast.error("Something went wrong. Please try again later.");
      } else {
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
        // const errorMessage = Object.keys(err.response.data.errors);
        // toast.error(err.response.data.errors[errorMessage[0]][0]);
      } else if (err.response.data.error) {
        // const errorMessage = Object.keys(err.response.data.error);
        // toast.error(err.response.data.error[errorMessage[0]][0]);
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

// File upload put function
export async function fileUploadPutFunction(endpoint, data) {
  return axiosInstance
    .put(endpoint, data, {
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

// Generate presigned url function
export async function generatePreSignedUrl(name) {
  return axiosInstance
    .post("/s3/presigned-url", {src: name})
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      if (err.response.status === 500) {
        toast.error("Something went wrong");
      } else if (err.response.data.errors) {
        // const errorMessage = Object.keys(err.response.data.errors);
        // toast.error(err.response.data.errors[errorMessage[0]][0]);
      } else if (err.response.data.error) {
        // const errorMessage = Object.keys(err.response.data.error);
        // toast.error(err.response.data.error[errorMessage[0]][0]);
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

// Back to top function
export const backToTop = () => {
  window.scrollTo(0, 0);
};

// show sidebar on the base of action
export function checkViewSidebar(slug,permissions,userPermissions,action=undefined) {
  const allPermission = [];
  for (let key in permissions) {
    if (Array.isArray(permissions[key])) {
      permissions[key].forEach((item) => {
        if(userPermissions?.includes(item.id)){
          allPermission.push({
            id: item?.id,
            action: item?.action,
            model: item?.model,
          });
        }
      });
    }
  }
  if (!action) {
    const actionPresent=allPermission.find((item)=>item.model===slug)
    if(actionPresent) return true;
  }else if(action){
    const actionPresent=allPermission.find((item)=>item.model===slug&& item.action===action)
    if(actionPresent) return true;
  }
  return false;
}


export function featureUnderdevelopment() {
  let popup = document.getElementById("globalPopup");

  if (!popup) {
    popup = document.createElement("div");
    popup.id = "globalPopup";
    popup.innerHTML = `
    <div class="popup">
      <div class="container h-100">
        <div class="row h-100 justify-content-center align-items-center">
          <div class="row content col-xxl-3 col-xl-4">
            <div class="col-2 px-0">
              <div class="iconWrapper">
                <i class="fa-duotone fa-clock  text-info"></i>
              </div>
            </div>
            <div class="col-10 ps-0">
              <h4>Sorry!</h4>
              <p>This feature is under development!</p>
              <div class="d-flex justify-content-start">
                <button
                  class="panelButton gray m-0"
                  onclick="document.getElementById('globalPopup').remove()"
                >
                  <span class="text">Ok</span>
                  <span class="icon">
                    <i class="fa-solid fa-xmark"></i>
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>`;
    document.body.appendChild(popup);
  }
}


// General logout Function
export async function logout(allCallCenterIds, dispatch, sessionManager) {
  if (allCallCenterIds.length > 0) {
    const parsedData = { status: "Logged Out" };
    try {
      const apiResponses = await Promise.allSettled(
        allCallCenterIds.map((id) =>
          generalPutFunction(`call-center-agent/update/${id}`, parsedData)
        )
      );
      const failedResponses = apiResponses.filter(
        (res) => res.status === "rejected"
      );
      if (failedResponses.length > 0) {
        console.error(
          `Error updating ${failedResponses.length} agents:`,
          failedResponses
        );
        // alert(
        //   `Failed to update ${failedResponses.length} agents. Please try again.`
        // );
      }
    } catch (error) {
      console.error("Unexpected error in logout:", error);
      // alert("Something went wrong. Please try again.");
    }
  }
  // Dispatch logout action and disconnect session
  dispatch({ type: "SET_LOGOUT", logout: 1 });
  setTimeout(() => {
    dispatch({type:"RESET_STATE"})
  }, 100);
  sessionManager.disconnect();
}