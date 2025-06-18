import axios from "axios";
import { handleNavigation, handleDispatch } from "./Navigation";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
const baseName = process.env.REACT_APP_BACKEND_BASE_URL;
let sessionExpiredToastShown = false
const token = localStorage.getItem("token");

// Creating instance of axios
const axiosInstance = axios.create({
  baseURL: baseName,
  headers: {
    "Content-Type": "application/json",
  },
});


if (token !== null) {
  axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}


/**
 * Sets or removes the Authorization header for the axios instance.
 * If a token is provided, it sets the Authorization header to use the Bearer token.
 * If no token is provided, it removes the Authorization header.
 *
 * @param {string|null} token - The token to be used for authorization, or null to remove the header.
 */

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
  // if(!token){
  //   return({
  //     status: false,

  //   })
  // }
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
        console.log("Session expired. Please login again.", err.response);

        if (!sessionExpiredToastShown) {
          sessionExpiredToastShown = true;
          toast.error(err?.response?.data?.message || "Session expired. Please login again.");
          // Optional: reset the flag after a delay (e.g., 5s)
          setTimeout(() => {
            sessionExpiredToastShown = false;
          }, 5000);
        }
        handleNavigation("/");
        localStorage.clear();
        setAuthToken(null);
        return err?.response?.data;
      } else if (err?.response?.status === 429) {
        toast.error("Too many attempts. Please wait before trying again.");
      } else if (err.response?.status >= 500) {
        toast.error("Something went wrong. Please try again later.");
      } else if (err?.response?.status == 422) {
        toast.error(err?.response?.data?.message)
      } else {
        return err;
      }
    });
}

// general get function with token
export async function generalGetFunctionWithToken(endpoint, token) {
  handleDispatch({
    type: "SET_LOADING",
    loading: true,
  });

  const headersWithToken = {
    ...axiosInstance.defaults.headers,
    Authorization: `Bearer ${token}`,
  };

  return axiosInstance
    .get(endpoint, { headers: headersWithToken })
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

      return err.response?.data;

    })
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
        toast.error(err?.response?.data?.message || "Session expired. Please login again.");
        localStorage.clear();
        setAuthToken(null);
        // handleNavigation("/");
        return err.response;
      } else {
        return err.response.data;
      }
    });
}

// General Post function with token
export async function generalPostFunctionWithToken(endpoint, data, token) {
  const headersWithToken = {
    ...axiosInstance.defaults.headers,
    Authorization: `Bearer ${token}`,
  };

  return axiosInstance
    .post(endpoint, data, { headers: headersWithToken })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {

      return err.response?.data;
    })

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
        toast.error(err?.response?.data?.message || "Session expired. Please login again.");
        localStorage.clear();
        setAuthToken(null);
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
        toast.error(err?.response?.data?.message || "Session expired. Please login again.");
        localStorage.clear();
        setAuthToken(null);
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
    .post("/s3/presigned-url", { src: name })
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
        toast.error(err?.response?.data?.message || "Session expired. Please login again.");
        localStorage.clear();
        setAuthToken(null);
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
// export function checkViewSidebar(
//   slug,
//   permissions,
//   userPermissions,
//   action = undefined
// ) {
//   const allPermission = [];
//   for (let key in permissions) {
//     if (Array.isArray(permissions[key])) {
//       permissions[key].forEach((item) => {
//         if (userPermissions?.includes(item.id)) {
//           allPermission.push({
//             id: item?.id,
//             action: item?.action,
//             model: item?.model,
//           });
//         }
//       });
//     }
//   }
//   if (!action) {
//     const actionPresent = allPermission.find((item) => item.model === slug);
//     if (actionPresent) return true;
//   } else if (action) {
//     const actionPresent = allPermission.find(
//       (item) => item.model === slug && item.action === action
//     );
//     if (actionPresent) return true;
//   }
//   return false;
// }

export function checkViewSidebar(
  slug,
  permissions,
  sectionPermissions,
  userPermissions,
  action = undefined
) {
  const account = localStorage.getItem("account");
  // Return true immediately if user is a company
  if (JSON.parse(account)?.usertype == 'Company' || JSON.parse(account)?.user_role?.roles?.name === "Super Admin") return true;

  // Return false immediately if no permissions exist
  if (!permissions) return false;

  for (const moduleName in permissions) {
    const modulePermissions = permissions[moduleName];
    if (Array.isArray(modulePermissions)) {
      for (const item of modulePermissions) {
        // Check if item belongs to the current section
        if (!sectionPermissions?.includes(item.id)) continue;

        // If no action specified, check if model matches
        if (!action && item.model === slug[1] && item.module_section === slug[0]) {
          return true;
        }

        // If action specified, check user permissions
        if (action) {
          for (const subItem of item.permissions) {
            if (
              subItem.model == slug &&
              subItem.action == action &&
              userPermissions?.includes(subItem.id)
            ) {
              return true;
            }
          }
        }
      }
    }
  }
  return false;
}

export function checkModulePerm(slug, permissions, section) {
  const account = localStorage.getItem("account");
  // Return true immediately if user is a company
  if (JSON.parse(account)?.usertype == 'Company') return true;

  // Return false immediately if no permissions exist
  if (!permissions) return false;

  for (const moduleName in permissions) {
    const modulePermissions = permissions[moduleName];
    if (moduleName !== slug) continue;
    if (Array.isArray(modulePermissions)) {
      for (const item of modulePermissions) {
        // Check if item belongs to the module section or current section
        if (section?.includes(item.section_id)) {
          return true
        }
      }
    }
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
            <div class="col-12 px-0">
              <div class="iconWrapper mb-2">
                <i class="fa-duotone fa-clock  text-danger"></i>
              </div>
            </div>
            <div class="col-12 ps-0 pe-0 text-center">
              <h4 class="text-center text-danger">Sorry!</h4>
              <p class="text-center">This feature is under development!</p>
              <div class="d-flex justify-content-center mt-3">
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
    dispatch({ type: "RESET_STATE" });
  }, 100);
  sessionManager.disconnect();
}

// Function to Convert Date to current TimeZone
export function convertDateToCurrentTimeZone(dateString) {
  const account = localStorage.getItem("account");
  try {
    const timeZone = JSON.parse(account)?.timezone?.name;
    // Create a Date object from the input string (UTC midnight)
    const date = new Date(dateString + 'T00:00:00Z');

    if (isNaN(date.getTime())) {
      return "Invalid date format";
    }

    // Options for formatting
    const options = {
      timeZone: timeZone || 'UTC',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    };

    // Format the date according to the timezone
    const formatter = new Intl.DateTimeFormat('en-US', options);
    const parts = formatter.formatToParts(date);

    // Extract year, month, and day from the formatted parts
    const year = parts.find(p => p.type === 'year').value;
    const month = parts.find(p => p.type === 'month').value;
    const day = parts.find(p => p.type === 'day').value;

    // Reconstruct in original format but with timezone-adjusted values
    return `${year}-${month}-${day}`;
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Invalid date format";
  }
}

// Function to Format Time to AM/PM in Current TimeZone
export function formatTimeWithAMPM(timeString) {
  const account = localStorage.getItem("account");
  try {
    const timeZone = JSON.parse(account)?.timezone?.name;

    // Create a date object with the input time (using today's date)
    const now = new Date();
    const [hours, minutes, seconds] = timeString.split(':').map(Number);

    if (isNaN(hours) || isNaN(minutes) || isNaN(seconds)) {
      return "Invalid time format";
    }

    // Set the time components
    const date = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes, seconds);

    // Format the time according to the timezone
    const options = {
      timeZone: timeZone || 'UTC', // Use provided timezone or default to UTC
      hour12: true,
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit'
    };

    let formattedTime = date.toLocaleTimeString('en-US', options);

    // Ensure AM/PM is uppercase and format is consistent
    formattedTime = formattedTime.replace(/(am|pm)/i, match => match.toUpperCase());

    return formattedTime;
  } catch (error) {
    console.error("Error formatting time:", error);
    return "Invalid time format";
  }
}
// Formate date for time stamp to get time when message arrives
export function formatRelativeTime(dateString) {
  const account = localStorage.getItem("account");
  try {
    const timeZone = JSON.parse(account)?.timezone?.name;
    // Parse input date (UTC) and current time
    const date = new Date(dateString);
    const now = new Date();

    // Convert both dates to the target timezone for accurate comparison
    const dateInTz = new Date(date.toLocaleString('en-US', { timeZone }));
    const nowInTz = new Date(now.toLocaleString('en-US', { timeZone }));

    // Calculate differences in timezone-adjusted time
    const diffMs = nowInTz - dateInTz;
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    // Handle timezone-adjusted relative time
    if (diffDays >= 1) {
      if (diffDays === 1) return "Yesterday";

      // Format full date in target timezone
      return dateInTz.toLocaleDateString('en-US', {
        timeZone,
        month: 'short',
        day: 'numeric',
        year: diffDays >= 365 ? 'numeric' : undefined
      });
    } else if (diffHours >= 1) {
      return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`;
    } else if (diffMinutes >= 1) {
      return `${diffMinutes} minute${diffMinutes !== 1 ? "s" : ""} ago`;
    } else {
      return `${diffSeconds} second${diffSeconds !== 1 ? "s" : ""} ago`;
    }
  } catch (error) {
    console.error("Error formatting time:", error);
    // Fallback to UTC formatting if timezone fails
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US');
  }
}

// Format date to get today date OR YYYY-MM-DD H:M:I in YYYY-MM-DD H:M:I according to timezone 
export function formatDateTime(dateInput) {
  // Parse account timezone
  const account = localStorage.getItem("account");
  const timeZone = JSON.parse(account)?.timezone?.name || 'UTC';

  // Convert input to Date object if it's a string
  let date;
  if (typeof dateInput === 'string') {
    // Handle both "2025-06-13 13:37:55" and ISO format
    const isoString = dateInput.includes('T') ? dateInput : dateInput.replace(' ', 'T');
    date = new Date(isoString);
    if (isNaN(date.getTime())) {
      console.error('Invalid date string:', dateInput);
      return 'Invalid Date';
    }
  } else if (dateInput instanceof Date) {
    date = dateInput;
  } else {
    console.error('Invalid date input type:', typeof dateInput);
    return 'Invalid Date';
  }

  // Timezone-aware formatting
  const options = {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  };

  const formatter = new Intl.DateTimeFormat('en-US', options);
  const parts = formatter.formatToParts(date);

  // Extract components
  const getPart = (type) => parts.find(p => p.type === type)?.value || '00';

  return [
    getPart('year'),
    getPart('month'),
    getPart('day'),
  ].join('-') + ' ' + [
    getPart('hour'),
    getPart('minute'),
    getPart('second')
  ].join(':');
}

// Function to format Time Duration
export function formatTime(seconds) {
  const hours = Math.floor(seconds / 3600)
    .toString()
    .padStart(2, "0");
  const minutes = Math.floor((seconds % 3600) / 60)
    .toString()
    .padStart(2, "0");
  const secs = (seconds % 60).toString().padStart(2, "0");
  return `${hours}:${minutes}:${secs}`;
}

export function formatTimeInHHMMSS(time) {
  const [hours, minutes] = time.split(':');
  const dateObj = new Date();
  dateObj.setHours(parseInt(hours));
  dateObj.setMinutes(parseInt(minutes));
  dateObj.setSeconds(0);
  dateObj.setMilliseconds(0);

  return dateObj.toTimeString().slice(0, 8);
}

export const useDebounce = (value, delay) => {
  const afterTrimVal = value.trim();
  const [debouncedValue, setDebouncedValue] = useState(afterTrimVal);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(afterTrimVal);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}


export const handleCsvDownload = (data) => {
  const headers = Object.keys(data[0]);
  const rows = data.map((obj) =>
    headers.map((header) => JSON.stringify(obj[header] || "")).join(",")
  );
  const csvContent = [headers.join(","), ...rows].join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.href = url;
  link.download = "sample.csv";
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export const isoToYYMMDDFormat = (isoString) => {
  const date = new Date(isoString);
  return date.toISOString().split('T')[0]; // e.g., "2025-06-17"
}

export const isoToTimeFormat = (isoString) => {
  const date = new Date(isoString);
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  }); // e.g., "3:23:16 PM"
}

export const formatTimeSecondsToHHMMSS = (seconds) => {
  const hours = Math.floor(seconds / 3600)
    .toString()
    .padStart(2, "0");
  const minutes = Math.floor((seconds % 3600) / 60)
    .toString()
    .padStart(2, "0");
  const secs = (seconds % 60).toString().padStart(2, "0");
  return `${hours}:${minutes}:${secs}`;
}