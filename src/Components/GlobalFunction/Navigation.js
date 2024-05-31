// navigation.js
let navigateFunction = null;

export const setNavigate = (nav) => {
  navigateFunction = nav;
};

export const handleNavigation = (path) => {
  if (navigateFunction) {
    navigateFunction(path);
  } else {
    console.error("Navigation function is not set",path);
  }
};
