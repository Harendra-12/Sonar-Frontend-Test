import { ActionType } from "./reduxActionType";

// reducer.js
var account = JSON.parse(localStorage.getItem("account"));
var accountRefresh = 0;
var registerUser = [];
var loginUser = [];
var callState = [];
var channelHangupComplete = [];
var allCall = [];
// var allcallDetails=[];
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
var allUser = [];
var allUserRefresh = 0;
var microPhonePermission = false;
var callProgress = false;
var videoCall = false;
var sessions = [];
var callProgressId = "";
var callProgressDestination = "";
var addContactRefresh = 0;
var roles = [];
var permissions = JSON.parse(localStorage.getItem("permissions"));
var rolesAndPermissionRefresh = 0;
var domain = {};
var domainRefresh = 0;
var loading = false;
var balance = "";
var extensionByAccount = [];
var usersByAccount = [];
var musicAll = [];
var didAll = [];
var portsAll = [];
var allCardTransactions;
var allWaletTransactions;
var extensionAll = [];
var extensionAllRefresh = 0;
var timeZone = [];
var timeZoneRefresh = 0;
var ivr = [];
var ivrRefresh = 0;
var whatsappContact = [];
var whatsappContactRefresh = 0;
var whatsappMessage = [];
var whatsappMessageRefresh = 0;
var deviceProvisioning = [];
var aiAgents = [];
var aiAgentsRefresh = 0;
var deviceProvisioningRefresh = 0;
var minimize = false;
var updateBalance = 0;
var selectedCdrFilter = "";
var conference = [];
var dummySession = "";
var rolesRefresh = 0;
var permissionRefresh = 0;
var memberId = null;
var newAddedDid = null;
var conferenceScreenShareStatus = null;
var conferenceMessage = [];
var RoomID = "";
var groupMessage = [];
var previewDialer = [];
var agentDeposition = false;
var desposiTionOptions = [];
var allCallCenterIds = [];
var callCenterPopUp = localStorage.getItem("callCenterPopUp");
var openCallCenterPopUp = false;
var logout = 0;
var dummyExtension = "";
var dummyPassword = "";
var accountBalance = 0;
var refreshCalls = 0;
var adminLogout = false; // Flag to track admin logout
var incomingMessage = null;
var deletedNotificationId = null; // State to track deleted notification ID
var incomingCall = [];
var internalCallAction = null;
var socketSendMessage = null;
var campaignDetails = [];
var recipient_to_remove_notification = null;
var allLeadList = []
var allLeadFileList = []
var leadDataRefresh = 0
var handRaises = []

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
  openCallCenterPopUp,
  callCenter,
  callCenterRefresh,
  allUser,
  allUserRefresh,
  callProgress,
  videoCall,
  sessions,
  callProgressId,
  callProgressDestination,
  addContactRefresh,
  roles,
  permissions,
  rolesAndPermissionRefresh,
  domain,
  domainRefresh,
  loading,
  balance,
  extensionByAccount,
  usersByAccount,
  musicAll,
  didAll,
  portsAll,
  allCardTransactions,
  allWaletTransactions,
  extensionAll,
  extensionAllRefresh,
  timeZone,
  timeZoneRefresh,
  ivr,
  ivrRefresh,
  whatsappContact,
  whatsappContactRefresh,
  whatsappMessage,
  whatsappMessageRefresh,
  aiAgents,
  aiAgentsRefresh,
  deviceProvisioning,
  deviceProvisioningRefresh,
  minimize,
  updateBalance,
  selectedCdrFilter,
  conference,
  dummySession,
  rolesRefresh,
  permissionRefresh,
  memberId,
  newAddedDid,
  conferenceScreenShareStatus,
  conferenceMessage,
  RoomID,
  groupMessage,
  previewDialer,
  agentDeposition,
  desposiTionOptions,
  allCallCenterIds,
  callCenterPopUp,
  logout,
  accountRefresh,
  dummyExtension,
  dummyPassword,
  accountBalance,
  refreshCalls,
  adminLogout,
  incomingMessage,
  deletedNotificationId,
  incomingCall,
  internalCallAction,
  socketSendMessage,
  campaignDetails,
  recipient_to_remove_notification,
  allLeadList,
  allLeadFileList,
  leadDataRefresh,
  handRaises
};

const counterReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_ACCOUNT":
      return { ...state, account: action.account };
    case "SET_ACCOUNTREFRESH":
      return { ...state, accountRefresh: action.accountRefresh };
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
    case "SET_ALLCALLDETAILS":
      return { ...state, allCallDetails: action.allCallDetails };
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
    case "SET_ACCOUNTBALANCE":
      return { ...state, accountBalance: action.accountBalance };
    case "SET_OPEN_CALLCENTER_POPUP":
      return { ...state, openCallCenterPopUp: action.openCallCenterPopUp };
    case "SET_RINGGROUPREFRESH":
      return { ...state, ringGroupRefresh: action.ringGroupRefresh };
    case "SET_CALLCENTER":
      return { ...state, callCenter: action.callCenter };
    case "SET_CALLCENTERREFRESH":
      return { ...state, callCenterRefresh: action.callCenterRefresh };
    case "SET_CALLREFRESH":
      return { ...state, refreshCalls: action.refreshCalls };
    case "SET_ALLUSER":
      return { ...state, allUser: action.allUser };
    case "SET_ALLUSERREFRESH":
      return { ...state, allUserRefresh: action.allUserRefresh };
    case "SET_CALLPROGRESS":
      return { ...state, callProgress: action.callProgress };
    case "SET_SESSIONS":
      return { ...state, sessions: action.sessions };
    case "SET_CALLPROGRESSID":
      return { ...state, callProgressId: action.callProgressId };
    case "SET_CALLPROGRESSDESTINATION":
      return {
        ...state,
        callProgressDestination: action.callProgressDestination,
      };
    case "SET_VIDEOCALL":
      return { ...state, videoCall: action.videoCall };
    case "SET_ADDCONTACTREFRESH":
      return { ...state, addContactRefresh: action.addContactRefresh };
    case "SET_ROLES":
      return { ...state, roles: action.roles };
    case "SET_PERMISSIONS":
      return { ...state, permissions: action.permissions };
    case "SET_ROLES_PERMISSIONREFRESH":
      return {
        ...state,
        rolesAndPermissionRefresh: action.rolesAndPermissionRefresh,
      };
    case "SET_ROLES_REFRESH":
      return { ...state, rolesRefresh: action.rolesRefresh };
    case "SET_PERMISSION_REFRESH":
      return { ...state, permissionRefresh: action.permissionRefresh };
    case "SET_DOMAIN":
      return { ...state, domain: action.domain };
    case "SET_DOMAINREFRESH":
      return { ...state, domainRefresh: action.domainRefresh };
    case "SET_EXTENSIONBYACCOUNT":
      return { ...state, extensionByAccount: action.extensionByAccount };
    case "SET_USERSBYACCOUNT":
      return { ...state, usersByAccount: action.usersByAccount };
    case "SET_MUSICALL":
      return { ...state, musicAll: action.musicAll };
    case "SET_DIDALL":
      return { ...state, didAll: action.didAll };
    case "SET_PORTSALL":
      return { ...state, portsAll: action.portsAll };
    case "SET_ALLCARDTRANSACTIONS":
      return { ...state, allCardTransactions: action.allCardTransactions };
    case "SET_ALLWALLETTRANSACTIONS":
      return { ...state, allWaletTransactions: action.allWaletTransactions };
    case "SET_LOADING":
      return { ...state, loading: action.loading };
    case "SET_BALANCE":
      return { ...state, balance: action.balance };
    case "SET_EXTENSIONALL":
      return { ...state, extensionAll: action.extensionAll };
    case "SET_EXTENSIONALLREFRESH":
      return { ...state, extensionAllRefresh: action.extensionAllRefresh };
    case "SET_TIMEZONE":
      return { ...state, timeZone: action.timeZone };
    case "SET_TIMEZONEREFRESH":
      return { ...state, timeZoneRefresh: action.timeZoneRefresh };
    case "SET_IVR":
      return { ...state, ivr: action.ivr };
    case "SET_IVRREFRESH":
      return { ...state, ivrRefresh: action.ivrRefresh };
    case "SET_WHATSAPPCONTACT":
      return { ...state, whatsappContact: action.whatsappContact };
    case "SET_WHATSAPPCONTACTREFRESH":
      return {
        ...state,
        whatsappContactRefresh: action.whatsappContactRefresh,
      };
    case "SET_WHATSAPPMESSAGE":
      return { ...state, whatsappMessage: action.whatsappMessage };
    case "SET_WHATSAPPMESSAGEREFRESH":
      return {
        ...state,
        whatsappMessageRefresh: action.whatsappMessageRefresh,
      };
    case "SET_AIAGENTS":
      return { ...state, aiAgents: action.aiAgents };
    case "SET_AIAGENTSREFRESH":
      return { ...state, aiAgentsRefresh: action.aiAgentsRefresh };
    case "SET_DEVICE_PROVISIONING":
      return { ...state, deviceProvisioning: action.deviceProvisioning };
    case "SET_ALL_CALL_CENTER_IDS":
      return {
        ...state,
        allCallCenterIds: [...state.allCallCenterIds, action.CallerId],
      };
    case "DELETE_CALLER_ID":
      return {
        ...state,
        allCallCenterIds: state.allCallCenterIds.filter(
          (id) => id !== action.CallerId
        ),
      };
    case "SET_DEVICE_PROVISIONINGREFRESH":
      return {
        ...state,
        deviceProvisioningRefresh: action.deviceProvisioningRefresh,
      };
    case "SET_MINIMIZE":
      return { ...state, minimize: action.minimize };
    case "SET_UPDATEBALANCE":
      return { ...state, updateBalance: action.updateBalance };
    case "SET_SELECTEDCDRFILTER":
      return { ...state, selectedCdrFilter: action.selectedCdrFilter };
    case "SET_CONFERENCE":
      return { ...state, conference: action.conference };
    case "SET_DUMMYSION":
      return { ...state, dummySession: action.dummySession };
    case "SET_MEMBERID":
      return { ...state, memberId: action.memberId };
    case "SET_NEWADDDID":
      return { ...state, newAddDid: action.newAddDid };
    case "SET_CONFERENCESCREENSHARESTATUS":
      return {
        ...state,
        conferenceScreenShareStatus: action.conferenceScreenShareStatus,
      };
    case "SET_CONFERENCEMESSAGE":
      return {
        ...state,
        conferenceMessage: [
          ...state.conferenceMessage,
          action.conferenceMessage,
        ],
      };
    case "SET_ROOMID":
      return { ...state, RoomID: action.RoomID };
    case "SET_GROUPMESSAGE":
      return { ...state, groupMessage: action.groupMessage };
    case "SET_PREVIEWDIALER":
      return {
        ...state,
        previewDialer: [...state.previewDialer, action.previewDialer],
      };
    case "REMOVE_PREVIEWDIALER":
      return {
        ...state,
        previewDialer: state.previewDialer.filter(
          (item) => item.phone_number !== action.phone_number
        ),
      };
    case "SET_AGENT_DEPOSITION":
      return { ...state, agentDeposition: action.agentDeposition };
    case "SET_DEPOSIT_OPTIONS":
      return { ...state, desposiTionOptions: action.desposiTionOptions };
    case "SET_CALL_CENTER_POPUP":
      return { ...state, callCenterPopUp: action.callCenterPopUp };
    case "SET_DUMMYEXTENSION":
      return { ...state, dummyExtension: action.dummyExtension };
    case "SET_DUMMYPASSWORD":
      return { ...state, dummyPassword: action.dummyPassword };
    case "SET_ADMIN_LOGOUT":
      return { ...state, adminLogout: action.adminLogout };
    case "SET_INCOMING_MESSAGE":
      return { ...state, incomingMessage: action.incomingMessage };
    case "RESET_STATE":
      return { ...initialState, logout: 0 };
    case "SET_LOGOUT":
      return { ...state, logout: action.logout };
    case "SET_DELETEDNOTIFFID":
      return { ...state, deletedNotificationId: action.deletedNotificationId };
    case "SET_INCOMINGCALL":
      return {
        ...state,
        incomingCall: [...state.incomingCall, action.incomingCall],
      };
    case "REMOVE_INCOMINGCALL":
      return {
        ...state,
        incomingCall: state.incomingCall.filter(
          (item) => item.room_id !== action.room_id
        ),
      };

    case "SET_INTERNALCALLACTION":
      return { ...state, internalCallAction: action.internalCallAction };
    case "SET_SOCKETSENDMESSAGE":
      return { ...state, socketSendMessage: action.socketSendMessage };
    case "REMOVE_INTERNALCALLACTION":
      return {
        ...state,
        internalCallAction: state.internalCallAction.filter(
          (item) => item.room_id !== action.room_id
        ),
      };
    case ActionType?.SET_VOLUME:
      return {
        ...state,
        volume: action?.payload,
      };
    case "SET_CAMPAIGN_DETAILS":
      return { ...state, campaignDetails: action.campaignDetails };
    case ActionType?.REMOVE_NOTIFICATION_FOR_MESSAGE:
      return { ...state, recipient_to_remove_notification: action?.recipient }
    case ActionType?.SET_ALL_LEADS_LIST:
      return { ...state, allLeadList: action.payload };
    case "SET_ALL_LEADS_FILE_LIST":
      return { ...state, allLeadFileList: action.allLeadFileList };
    case "SET_LEADS_REFRESH":
      return { ...state, leadDataRefresh: action.leadDataRefresh };
    case "SET_HAND_RAISE": {
      const { room_id, username, hand_raised } = action.payload;

      // Remove existing entry for same room_id & username
      const updatedHandRaises = state.handRaises.filter(
        (item) => !(item.room_id === room_id && item.username === username)
      );

      // Add new entry at the end
      return {
        ...state,
        handRaises: [...updatedHandRaises, action.payload],
      };
    }
    case "RESET_HAND_RAISES":
      return {
        ...state,
        handRaises: [],
      };
    default:
      return state;
  }
};

export default counterReducer;
