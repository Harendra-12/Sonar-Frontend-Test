// reducer.js
var account = JSON.parse(localStorage.getItem("account"));
var registerUser = [];
var loginUser = [];
var callState = [];
var channelHangupComplete = [];
var allCall = [];
var activeCall = [];
var tempAccount = JSON.parse(localStorage.getItem("tempAccount"));
var accountDetails = JSON.parse(localStorage.getItem("accountDetails"));
var accountDetailsRefresh = 0;
var acountDetailsUpdate = 0;
var cardListRefresh = 0;
var billingListRefresh = 0;
var cardList = JSON.parse(localStorage.getItem("cardList"));
var billingList = JSON.parse(localStorage.getItem("billingList"));
var callDetailsRefresh = 0;
var extension = [];
var extensionRefresh = 0;
var ringGroup = [];
var ringGroupRefresh = 0;
var callCenter = [];
var callCenterRefresh = 0;
var microPhonePermission = false;
var callProgress = false;

const initialState = {
  account,
  registerUser,
  loginUser,
  callState,
  channelHangupComplete,
  allCall,
  tempAccount,
  accountDetails,
  acountDetailsUpdate,
  cardListRefresh,
  billingListRefresh,
  cardList,
  billingList,
  accountDetailsRefresh,
  callDetailsRefresh,
  activeCall,
  microPhonePermission,
  extension,
  extensionRefresh,
  ringGroup,
  ringGroupRefresh,
  callCenter,
  callCenterRefresh,
  callProgress,
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
    case "SET_ACCOUNTDETAILSREFRESH":
      return { ...state, accountDetailsRefresh: action.accountDetailsRefresh };
    case "SET_CARDLISTREFRESH":
      return { ...state, cardListRefresh: action.cardListRefresh };
    case "SET_CARDLIST":
      return { ...state, cardList: action.cardList };
    case "SET_BILLINGLISTREFRESH":
      return { ...state, billingListRefresh: action.billingListRefresh };
    case "SET_BILLINGLIST":
      return { ...state, billingList: action.billingList };
    case "SET_CALLDETAILSREFRESH":
      return { ...state, callDetailsRefresh: action.callDetailsRefresh };
    case "SET_ACTIVECALL":
      return { ...state, activeCall: action.activeCall };
    case "SET_MICROPHONEPERMISSION":
      return { ...state, microPhonePermission: action.microPhonePermission };
    case "SET_EXTENSION":
      return { ...state, extension: action.extension };
    case "SET_EXTENSIONREFRESH":
      return { ...state, extensionRefresh: action.extensionRefresh };
    case "SET_RINGGROUP":
      return { ...state, ringGroup: action.ringGroup };
    case "SET_RINGGROUPREFRESH":
      return { ...state, ringGroupRefresh: action.ringGroupRefresh };
    case "SET_CALLCENTER":
      return { ...state, callCenter: action.callCenter };
    case "SET_CALLCENTERREFRESH":
      return { ...state, callCenterRefresh: action.callCenterRefresh };
    case "SET_CALLPROGRESS":
      return { ...state, callProgress: action.callProgress };
    default:
      return state;
  }
};

export default counterReducer;
