// navigation.js
let navigateFunction = null;
let dispatchFunction = null;

export const setNavigate = (nav) => {
  navigateFunction = nav;
};

export const setDispatch = (dispatch) => {
  dispatchFunction = dispatch;
};

export const handleNavigation = (path) => {
  if (navigateFunction) {
    navigateFunction(path);
  } else {
    console.error("Navigation function is not set",path);
  }
};

export const handleDispatch = (data) => {
  if (dispatchFunction) {
    dispatchFunction(data);
  } else {
    console.error("Dispatch function is not set",data);
  }
};
