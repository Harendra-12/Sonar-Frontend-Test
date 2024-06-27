// reducer.js
var account = JSON.parse(localStorage.getItem("account"));
var registerUser = [];
var loginUser = [];
var callState = [];
var channelHangupComplete = [];
var allCall = [];
var tempAccount = JSON.parse(localStorage.getItem("tempAccount"));
var accountDetails = JSON.parse(localStorage.getItem("accountDetails"));

const initialState = {
  account,
  registerUser,
  loginUser,
  callState,
  channelHangupComplete,
  allCall,
  tempAccount,
  accountDetails,
};

const counterReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_ACCOUNT":
      return { ...state, account: action.account };
    case "SET_REGISTERUSER":
      return { ...state, registerUser: action.registerUser };
    case "SET_LOGINUSER":
      return { ...state, loginUser: action.loginUser };
    case "SET_CALLSTATE":
      return { ...state, callState: action.callState };
    case "SET_CHANNELHANGUP":
      return { ...state, channelHangupComplete: action.channelHangupComplete };
    case "SET_ALLCALL":
      return { ...state, allCall: action.allCall };
    case "SET_TEMPACCOUNT":
      return { ...state, tempAccount: action.tempAccount };
    case "SET_ACCOUNTDETAILS":
      return { ...state, accountDetails: action.accountDetails };
    default:
      return state;
  }
};

export default counterReducer;
