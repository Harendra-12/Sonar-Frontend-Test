import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useNavigate,
} from "react-router-dom";
import "./index.css";
import ProtectedRoute from "./Components/CommonComponents/ProtectedRoute";
import Navbar from "./Components/CommonComponents/Navbar";
import Login from "./Components/CommonComponents/Login";
import RingGroups from "./Components/Pages/RingGroups/RingGroups";
import RingGroupAdd from "./Components/Pages/RingGroups/RingGroupAdd";
import RingGroupEdit from "./Components/Pages/RingGroups/RingGroupEdit";
import Users from "./Components/Pages/Users/Users";
import UsersAdd from "./Components/Pages/Users/UsersAdd";
import UsersEdit from "./Components/Pages/Users/UsersEdit";
import Extensions from "./Components/Pages/Extensions/Extensions";
import ExtensionsAdd from "./Components/Pages/Extensions/ExtensionsAdd";
import ExtensionsEdit from "./Components/Pages/Extensions/ExtensionsEdit";
import Dashboard from "./Components/Pages/Dashboard/Dashboard";
import Profile from "./Components/Pages/Profile/Profile";
import Master from "./Components/Pages/Setting/Master";
import Destination from "./Components/Pages/Dialplan/Destination";
import DestinationAdd from "./Components/Pages/Dialplan/DestinationAdd";
import DestinationEdit from "./Components/Pages/Dialplan/DestinationEdit";
import Socket from "./Components/GlobalFunction/Socket";
import SofiaStatus from "./Components/Pages/Sofia/SofiaStatus";
import SipAdd from "./Components/Pages/SIP/SipAdd";
import SofiaSetting from "./Components/Pages/Sofia/SofiaSetting";
import SofiaAddSetting from "./Components/Pages/Sofia/SofiaAddSetting";
import SofiaEditSetting from "./Components/Pages/Sofia/SofiaEditSetting";
import CdrReport from "./Components/Pages/WebRtc/CdrReport";
import InboundRoute from "./Components/Pages/Dialplan/InboundRouteAdd";
import CallSettings from "./Components/CommonComponents/CallSettings";
import ChangePassword from "./Components/CommonComponents/ChangePassword";
import PackageAdd from "./Components/Pages/Setting/PackageAdd";
import Package from "./Components/Pages/Setting/Package";
import PackageEdit from "./Components/Pages/Setting/PackageEdit";
import Feature from "./Components/Pages/Setting/Feature";
import PendingRequest from "./Components/Pages/Admin/PendingDocument";
import ApprovedCustomer from "./Components/Pages/Admin/ApprovedCustomer";
import UserDocumentDetails from "./Components/Pages/Admin/UserDocumentDetails";
import RateChargeAdd from "./Components/Pages/NumberManagement/RateChargeAdd";
import AddVendors from "./Components/Pages/NumberManagement/AddVendors";
import Vendors from "./Components/Pages/NumberManagement/Vendors";
import EditVendor from "./Components/Pages/NumberManagement/EditVendor";
import RateChargeEdit from "./Components/Pages/NumberManagement/RateChargeEdit";
import GetDid from "./Components/Pages/NumberManagement/GetDid";
import { checkViewSidebar } from "./Components/GlobalFunction/globalFunction";
import {
  setNavigate,
  setDispatch,
} from "./Components/GlobalFunction/Navigation";
import { useEffect } from "react";
import PaymentGatewayAdd from "./Components/Pages/Payment/PaymentGatewayAdd";
import PaymentGateway from "./Components/Pages/Payment/PaymentGateway";
import PaymentGatewayEdit from "./Components/Pages/Payment/PaymentGatewayEdit";
import CallCenterQueue from "./Components/Pages/CallCenter/CallCenterQueue";
import CallCenterQueueAdd from "./Components/Pages/CallCenter/CallCenterQueueAdd";
import CallCenterQueueEdit from "./Components/Pages/CallCenter/CallCenterQueueEdit";
import Roles from "./Components/Pages/Setting/Roles";
import DocumentUpload from "./Components/Pages/Profile/DocumentUpload";
import UserRegistrationProcessOverview from "./Components/Pages/Admin/UserRegistrationProcessOverview";
import CardAndBilling from "./Components/Pages/Billing/CardAndBilling";
import TempDashboard from "./Components/Pages/Dashboard/TempDashboard";
import GlobalCalls from "./Components/GlobalFunction/GlobalCalls";
import InvoiceList from "./Components/Pages/Billing/InvoiceList";
import ExpenseList from "./Components/Pages/Billing/ExpenseList";
import CardTransactionsList from "./Components/Pages/Billing/CardTransactionsList";
import WalletTransactionsList from "./Components/Pages/Billing/WalletTransactionsList";
import PhoneDashboard from "./Components/Pages/PhoneDashboard/PhoneDashboard";
import DidListing from "./Components/Pages/NumberManagement/DidListing";
import Music from "./Components/Pages/Voice/Music";
import { ToastContainer } from "react-toastify";
import CallCenterSettings from "./Components/Pages/CallCenter/CallCenterSettings";
import DidConfig from "./Components/Pages/NumberManagement/DidConfig";
import { useDispatch, useSelector } from "react-redux";
import Variable from "./Components/Pages/Variable/Variable";
import PortNumber from "./Components/Pages/NumberManagement/PortNumber";
import PortNumberAdd from "./Components/Pages/NumberManagement/PortNumberAdd";
import PortNumberEdit from "./Components/Pages/NumberManagement/PortNumberEdit";
import WebrtcWrapper from "./Components/Pages/WebRtc/WebrtcWrapper";
import "react-toastify/dist/ReactToastify.css";
import Messages from "./Components/Pages/WebRtc/Messages";
import DidListingAdd from "./Components/Pages/NumberManagement/DidListingAdd";
import MailSettingsEdit from "./Components/Pages/MailSettings/MailSettingsEdit";
import IvrAdd from "./Components/Pages/IVR/IvrAdd";
import IvrListing from "./Components/Pages/IVR/IvrListing";
import IvrEdit from "./Components/Pages/IVR/IvrEdit";
import IvrOptions from "./Components/Pages/IVR/IvrOptions";
import DeviceProvisioningAdd from "./Components/Pages/DeviceProvisioning/DeviceProvisioningAdd";
import DeviceProvisioning from "./Components/Pages/DeviceProvisioning/DeviceProvisioning";
import DeviceProvisioningEdit from "./Components/Pages/DeviceProvisioning/DeviceProvisioningEdit";
import CallBlocking from "./Components/Pages/SpamFilter/CallBlocking";
import ConferenceConfig from "./Components/Pages/WebRtc/Conference/ConferenceConfig";
import ClickToCall from "./Components/Pages/ClickToCall/ClickToCall";
import CallBlockingAdd from "./Components/Pages/SpamFilter/CallBlockingAdd";
import Leads from "./Components/Pages/DialerModule/Leads/Leads";
import LeadEdit from "./Components/Pages/DialerModule/Leads/LeadEdit";
import Campaigns from "./Components/Pages/DialerModule/Campaigns/Campaigns";
import LeadAdd from "./Components/Pages/DialerModule/Leads/leadAdd";
import DeviceProvisioningNew from "./Components/Pages/DeviceProvisioning/DeviceProvisioningNew";
import ConferenceJoin from "./Components/Pages/WebRtc/Conference/ConferenceJoin";
import CallDashboardNew from "./Components/Pages/WebRtc/CallDashboardNew";
import DummyRegistration from "./Components/Pages/WebRtc/DummyRegistration";
import ClickToCallSetup from "./Components/Pages/ClickToCall/ClickToCallSetup";
import DialerDashboard from "./Components/Pages/DialerModule/DialerDashboard";
import AgentsEdits from "./Components/Pages/Agents/AgentsEdits";
import AgentsAdd from "./Components/Pages/Agents/AgentsAdd";
import MeetingReports from "./Components/Pages/Agents/MeetingReports";
import CallRecording from "./Components/Pages/Setting/CallRecording";
import FaxSettings from "./Components/Pages/Setting/FaxSettings";
import AddOns from "./Components/Pages/Stores/AddOns";
import Meeting from "./Components/Pages/Meeting/Meeting";
import MeetingAdd from "./Components/Pages/Meeting/MeetingAdd";
import ActiveCallsPage from "./Components/Pages/PhoneDashboard/ActiveCallsPage";
import CallDashboardProvider from "./Components/Pages/CallDashboardProvider/CallDashboardProvider";
import CallDesposition from "./Components/Pages/DialerModule/CallDesposition";
import KnowledgeBase from "./Components/Pages/Support/KnowledgeBase";
import AgentsPbx from "./Components/Pages/Agents/AgentsPbx";
import AgentsDialer from "./Components/Pages/Agents/AgentsDialer";
import VoiceMailReport from "./Components/Pages/Voice/VoiceMailReport";
import CampaignCreate from "./Components/Pages/DialerModule/Campaigns/CampaignCreate";
import CampaignEdit from "./Components/Pages/DialerModule/Campaigns/CampaignEdit";
import ClickToCallListing from "./Components/Pages/ClickToCall/ClickToCallListing";
import ClickToCallEdit from "./Components/Pages/ClickToCall/ClickToCallEdit";
import AgentDispositionManage from "./Components/Pages/DialerModule/Campaigns/AgentDispositionManage";
import AvailableDeviceList from "./Components/Pages/DeviceProvisioning/AvailableDeviceList";
import MailSettings from "./Components/Pages/MailSettings/MailSettings";
import TrackerDashboard from "./Components/Pages/CallTracker/TrackerDashboard";
import AgentReports from "./Components/Pages/Reports/AgentReports";
import UserConfiguration from "./Components/Pages/Users/UserConfiguration";
import UserProfile from "./Components/Pages/Users/UserProfile";
import Ticket from "./Components/Pages/Support/Ticket";
import ViewMessages from "./Components/Pages/Support/ViewMessages";
import CdrFilterReport from "./Components/Pages/WebRtc/CDRFilterReport";
import EFax from "./Components/Pages/WebRtc/EFax";
import CustomModule from "./Components/Pages/Setting/CustomModule";
import SubscriptionManagement from "./Components/Pages/Billing/SubscriptionManagement";
import GoogleTranslate from "./Components/CommonComponents/GoogleTranslate";
import Buyers from "./Components/Pages/CallTracker/Buyers";
import BuyersEdit from "./Components/Pages/CallTracker/BuyersEdit";
import BuyerAdd from "./Components/Pages/CallTracker/BuyerAdd";
import Source from "./Components/Pages/Source/Source";
import SourceEdit from "./Components/Pages/Source/SourceEdit";
import SourceAdd from "./Components/Pages/Source/SourceAdd";
import AgentDashboard from "./Components/Pages/AgentDashboard/AgentDashboard";
import MetaConfig from "./Components/Pages/ThirdPartyApps/Meta/MetaConfig";
import MicrosoftTeamsConfig from "./Components/Pages/ThirdPartyApps/MicrosoftTeams/MicrosoftTeamsConfig";
import WhatsAppConfig from "./Components/Pages/ThirdPartyApps/WhatsApp/WhatsAppConfig";
import AllThirdPartyConfig from "./Components/Pages/ThirdPartyApps/AllThirdPartyConfig";
import MetaConfigEdit from "./Components/Pages/ThirdPartyApps/Meta/MetaConfigEdit";
import WhatsAppConfigEdit from "./Components/Pages/ThirdPartyApps/WhatsApp/WhatsAppConfigEdit";
import AllAiAgent from "./Components/Pages/AIAgentConfig/AllAiAgent";
import AIAgentAdd from "./Components/Pages/AIAgentConfig/AIAgentAdd";
import AIAgentEdit from "./Components/Pages/AIAgentConfig/AIAgentEdit";
import AllAddons from "./Components/Pages/ThirdPartyApps/AllAddons";
import LiveChat from "./Components/Pages/Support/LiveChat";
import WhatsAppChatBox from "./Components/Pages/WebRtc/whatsappChatbox/WhatsAppChatBox";
import DialerCdrReport from "./Components/Pages/DialerModule/DialerCdrReport";
import AllAvailableAddons from "./Components/Pages/ThirdPartyApps/AllAvailableAddons";
import RateCardView from "./Components/Pages/RateCard/RateCardView";
import PermissionConfigForUser from "./Components/CommonComponents/PermissionConfigForUser";
import Reactflow from "./Components/Pages/ReactFlow/Reactflow";
import GroupsList from "./Components/Pages/Groups/GroupsList";
import AddGroupsList from "./Components/Pages/Groups/AddGroupsList";
import SmsChat from "./Components/Pages/WebRtc/SmsChat";
import AdminLogoutPopUp from "./Components/CommonComponents/AdminLogoutPopUp";
import EditGroupsList from "./Components/Pages/Groups/EditGroupsList";
import NewGetDid from "./Components/Pages/NumberManagement/NewGetDid";
import BillingCardAndWallet from "./Components/Pages/Billing/BillingCardAndWallet";
import FportalCampaign from "./Components/Pages/CallTracker/FportalCampaign";
import FportalCampaignCreate from "./Components/Pages/CallTracker/FportalCampaignCreate";
import AccessControl from "./Components/Pages/AccessControl/AccessControl";
import AccessControlAdd from "./Components/Pages/AccessControl/AccessControlAdd";
import AccessControlEdit from "./Components/Pages/AccessControl/AccessControlEdit";
import BillingDashboard from "./Components/Pages/Billing/BillingDashboard";
import OfflineNotice from "./Components/CommonComponents/OfflineNotice";
import CampaignCreateNEW from "./Components/Pages/DialerModule/Campaigns/CampaignCreateNEW";
import CampaignEditNEW from "./Components/Pages/DialerModule/Campaigns/CampaignEditNEW";
import GoSocket from "./Components/GlobalFunction/GoSocket";
import GoSocketActiveCall from "./Components/GlobalFunction/GoSocketActiveCall";
import PackageAndSubscriptionDetails from "./Components/Pages/Billing/PackageAndSubscriptionDetails";
import AIDashboard from "./Components/Pages/AIAgentConfig/AIDashboard";
import AICDRSearch from "./Components/Pages/AIAgentConfig/AICDRSearch";
import MissedCallPopup from "./Components/CommonComponents/MissedCallPopup";
import ElasticTrunk from "./Components/Pages/CallTracker/ElasticTrunk";
import ElasticTrunkEdit from "./Components/Pages/CallTracker/ElasticTrunkEdit";
import ElasticTrunkAdd from "./Components/Pages/CallTracker/ElasticTrunkAdd";
import FportalCampaignEdit from "./Components/Pages/CallTracker/FportalCampaignEdit";
import GoMessageSocket from "./Components/GlobalFunction/GoMessageSocket";
import AllAgent from "./Components/Pages/Ai/AllAgent";
import AiKnowledgeBase from "./Components/Pages/Ai/AiKnowledgeBase";
import AiPhoneNumber from "./Components/Pages/Ai/AiPhoneNumber";
import CallHistory from "./Components/Pages/Ai/CallHistory";
import Billing from "./Components/Pages/Ai/Billing";
import AiBatchCall from "./Components/Pages/Ai/AiBatchCall";
import CustomDashboardPage from "./Components/Pages/PhoneDashboard/CustomDashboardPage";
import CDRTracker from "./Components/Pages/CallTracker/CDRTracker";
import AllUser from "./Components/Pages/Ai/AllUser";
import AiDashboard from "./Components/Pages/Ai/AiDashboard";
import NumberCompliancesHome from "./Components/Pages/NumberManagement/NumberCompliances/NumberCompliancesHome";
import AlgeriaCompliance from "./Components/Pages/NumberManagement/NumberCompliances/CountryCompliances/AlgeriaCompliance";
import MeetingEdit from "./Components/Pages/Meeting/MeetingEdit";

// Unlock this if want push notification
// import { generateToken, messaging } from "./Components/GlobalFunction/PushNotification";
// import { getToken, onMessage } from "@firebase/messaging";
// import { useSelector } from "react-redux";

const NavigationSetter = () => {
  const navigate = useNavigate();
  useEffect(() => {
    setNavigate(navigate);
  }, [navigate]);
  return null; // This component doesn't render anything
};

const DispatchSetter = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    setDispatch(dispatch);
  }, [dispatch]);
  return null; // This component doesn't render anything
};

function App() {
  const adminLogout = useSelector((state) => state?.adminLogout);
  const dispatch = useDispatch();
  // const domainRefresh = useSelector((state) => state.domainRefresh);
  const account = useSelector((state) => state?.account);
  const accountDetails = useSelector((state) => state?.accountDetails);
  const slugPermissions = useSelector((state) => state?.permissions);
  // const { sendMessage } = Socket();
  Socket();
  const { sendMessage } = GoMessageSocket()
  GoSocket();
  GoSocketActiveCall();
  useEffect(() => {
    dispatch({ type: "SET_SOCKETSENDMESSAGE", socketSendMessage: sendMessage });
  }, [GoMessageSocket]);

  // Unlock this if want push notification add account edit here if id is available
  // useEffect(()=>{
  //   const token = generateToken().then((res)=>console.log("This is from response",res))
  //   if(token){
  //   }

  //   onMessage(messaging,(payload)=>{
  //   })
  // },[account])
  // useEffect(() => {
  //   if (localStorage.getItem("token") !== null) {
  //     dispatch({
  //       type: "SET_DOMAINREFRESH",
  //       domainRefresh: domainRefresh + 1,
  //     });
  //   }
  // }, []);
  window.dynamicId = 10;

  return (
    <>
      <Router>
        {adminLogout && <AdminLogoutPopUp />}
        <GoogleTranslate />
        <NavigationSetter />
        <DispatchSetter />
        <GlobalCalls />
        <Navbar />
        <OfflineNotice />
        {/* <MissedCallPopup /> */}
        <Routes>

          <Route path="/click-to-call" element={<ClickToCall />} />
          <Route path="/call-flow" element={<Reactflow />} />
          <Route path="/" element={<Login />} />
          <Route path="/conference" element={<ConferenceJoin />} />
          <Route path="/conference-join" element={<DummyRegistration />} />

          <Route element={<ProtectedRoute />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/ai-dashboard" element={<AIDashboard />} />
          <Route path="/ai-search-cdr" element={<AICDRSearch />} />
          <Route path="/meeting-room" element={
            checkViewSidebar(
              "Conference",
              slugPermissions,
              account?.sectionPermissions,
              account?.permissions,
              "browse"
            ) ?
              <Meeting /> :
              <Navigate to="/dashboard" replace />
          } />
          <Route path="/meeting-add" element={
            checkViewSidebar(
              "Conference",
              slugPermissions,
              account?.sectionPermissions,
              account?.permissions,
              "add"
            ) ?
              <MeetingAdd /> :
              <Navigate to="/dashboard" replace />
          } />
          <Route path="/meeting-edit" element={
            checkViewSidebar(
              "Conference",
              slugPermissions,
              account?.sectionPermissions,
              account?.permissions,
              "edit"
            ) ?
              <MeetingEdit /> :
              <Navigate to="/dashboard" replace />
          } />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/temporary-dashboard" element={<TempDashboard />} />
          <Route
            path="/agent-disposition-manage"
            element={
              checkViewSidebar(
                "Disposition",
                slugPermissions,
                account?.sectionPermissions,
                account?.permissions,
                "browse"
              ) ?
                <AgentDispositionManage />
                : <Navigate to="/dashboard" replace />
            }
          />

          <Route
            path="/my-profile"
            element={
              checkViewSidebar(
                "User",
                slugPermissions,
                account?.sectionPermissions,
                account?.permissions,
                "browse"
              ) ? (
                <Profile />
              ) : (
                <Navigate to="/dashboard" replace />
              )
            }
          />
          <Route path="/master" element={<Master />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/phone-dashboard" element={
            checkViewSidebar(
              "phoneDashboard",
              slugPermissions,
              account?.sectionPermissions,
              account?.permissions,
              "browse"
            ) ?
              <PhoneDashboard /> :
              <Navigate to="/dashboard" replace />
          } />
          <Route path="/active-calls" element={
            checkViewSidebar(
              "ActiveCall",
              slugPermissions,
              account?.sectionPermissions,
              account?.permissions,
              "browse"
            ) ?
              <ActiveCallsPage /> :
              <Navigate to="/dashboard" replace />
          } />
          <Route path="/custom-dashboard" element={
            checkViewSidebar(
              "CustomDashboard",
              slugPermissions,
              account?.sectionPermissions,
              account?.permissions,
              "browse"
            ) ?
              <CustomDashboardPage /> :
              <Navigate to="/dashboard" replace />
          } />
          <Route
            path="/custom-module"
            element={
              checkViewSidebar(
                "Usage",
                slugPermissions,
                account?.sectionPermissions,
                account?.permissions,
                "browse"
              ) ? (
                <CustomModule />
              ) : (
                <Navigate to="/dashboard" replace />
              )
            }
          />
          {/* Groups path start */}
          <Route
            path="/groups"
            element={
              checkViewSidebar(
                "Group",
                slugPermissions,
                account?.sectionPermissions,
                account?.permissions,
                "browse"
              ) ? (
                <GroupsList />
              ) : (
                <Navigate to="/dashboard" replace />
              )
            }
          />
          <Route
            path="/groups-add"
            element={
              checkViewSidebar(
                "Group",
                slugPermissions,
                account?.sectionPermissions,
                account?.permissions,
                "add"
              ) ? (
                <AddGroupsList />
              ) : (
                <Navigate to="/dashboard" replace />
              )
            }
          />
          <Route
            path="/groups-edit"
            element={
              checkViewSidebar(
                "Group",
                slugPermissions,
                account?.sectionPermissions,
                account?.permissions,
                "edit"
              ) ? (
                <EditGroupsList />
              ) : (
                <Navigate to="/dashboard" replace />
              )
            }
          />
          {/* <Route path="/groups" element={<GroupsList/>}/> */}

          {/* <Route path="/groups" element={<GroupsList/>}/> */}
          <Route
            path="/access-control-list"
            element={
              accountDetails?.add_on_subscription.find(
                (item) => item?.addon_id == 7
              ) &&
                (checkViewSidebar(
                  "AccessControl",
                  slugPermissions,
                  account?.sectionPermissions,
                  account?.permissions,
                  "browse"
                ) ||
                  checkViewSidebar(
                    "AccessControlNode",
                    slugPermissions,
                    account?.sectionPermissions,
                    account?.permissions,
                    "browse"
                  )) ? (
                <AccessControl />
              ) : (
                <Navigate to="/dashboard" replace />
              )
            }
          />
          <Route
            path="/access-control-list-add"
            element={
              accountDetails?.add_on_subscription.find(
                (item) => item?.addon_id == 7
              ) &&
                (checkViewSidebar(
                  "AccessControl",
                  slugPermissions,
                  account?.sectionPermissions,
                  account?.permissions,
                  "add"
                ) ||
                  checkViewSidebar(
                    "AccessControlNode",
                    slugPermissions,
                    account?.sectionPermissions,
                    account?.permissions,
                    "add"
                  )) ? (
                <AccessControlAdd />
              ) : (
                <Navigate to="/dashboard" replace />
              )
            }
          />
          <Route
            path="/access-control-list-edit"
            element={
              accountDetails?.add_on_subscription.find(
                (item) => item?.addon_id == 7
              ) &&
                (checkViewSidebar(
                  "AccessControl",
                  slugPermissions,
                  account?.sectionPermissions,
                  account?.permissions,
                  "edit"
                ) ||
                  checkViewSidebar(
                    "AccessControlNode",
                    slugPermissions,
                    account?.sectionPermissions,
                    account?.permissions,
                    "edit"
                  )) ? (
                <AccessControlEdit />
              ) : (
                <Navigate to="/dashboard" replace />
              )
            }
          />

          {/* <Route path="/active-calls" element={<ActiveCalls />} /> */}

          {/* Ring Groups Path Start */}
          <Route
            path="/ring-groups"
            element={
              checkViewSidebar(
                "Ringgroup",
                slugPermissions,
                account?.sectionPermissions,
                account?.permissions,
                "browse"
              ) ? (
                <RingGroups />
              ) : (
                <Navigate to="/dashboard" replace />
              )
            }
          />
          <Route
            path="/ring-groups-add"
            element={
              checkViewSidebar(
                "Ringgroup",
                slugPermissions,
                account?.sectionPermissions,
                account?.permissions,
                "add"
              ) ? (
                <RingGroupAdd />
              ) : (
                <Navigate to="/dashboard" replace />
              )
            }
          />
          <Route
            path="/ring-groups-edit"
            element={
              checkViewSidebar(
                "Ringgroup",
                slugPermissions,
                account?.sectionPermissions,
                account?.permissions,
                "edit"
              ) ? (
                <RingGroupEdit />
              ) : (
                <Navigate to="/dashboard" replace />
              )
            }
          />
          {/* Ring Groups Path End */}

          {/* Users Path Start */}
          <Route
            path="/users"
            element={
              checkViewSidebar(
                "User",
                slugPermissions,
                account?.sectionPermissions,
                account?.permissions,
                "browse"
              ) ? (
                <Users />
              ) : (
                <Navigate to="/dashboard" replace />
              )
            }
          />
          <Route
            path="/users-add"
            element={
              checkViewSidebar(
                "User",
                slugPermissions,
                account?.sectionPermissions,
                account?.permissions,
                "add"
              ) ? (
                <UsersAdd />
              ) : (
                <Navigate to="/dashboard" replace />
              )
            }
          />
          <Route
            path="/agents-pbx-add"
            element={
              checkViewSidebar(
                "User",
                slugPermissions,
                account?.sectionPermissions,
                account?.permissions,
                "add"
              ) ? (
                <UsersAdd />
              ) : (
                <Navigate to="/dashboard" replace />
              )
            }
          />
          <Route path="/users-profile" element={<UserProfile />} />
          <Route
            path="/users-edit"
            element={
              checkViewSidebar(
                "User",
                slugPermissions,
                account?.sectionPermissions,
                account?.permissions,
                "edit"
              ) ? (
                <UsersEdit />
              ) : (
                <Navigate to="/dashboard" replace />
              )
            }
          />
          <Route path="/users-config" element={
            checkViewSidebar(
              "User",
              slugPermissions,
              account?.sectionPermissions,
              account?.permissions,
              "edit"
            ) ?
              <UserConfiguration /> :
              <Navigate to="/dashboard" replace />
          } />
          {/* Users Path End */}

          {/* Extensions Path Start */}
          <Route
            path="/extensions"
            element={
              checkViewSidebar(
                "Extension",
                slugPermissions,
                account?.sectionPermissions,
                account?.permissions,
                "browse"
              ) ? (
                <Extensions />
              ) : (
                <Navigate to="/dashboard" replace />
              )
            }
          />
          <Route
            path="/extensions-add"
            element={
              checkViewSidebar(
                "Extension",
                slugPermissions,
                account?.sectionPermissions,
                account?.permissions,
                "add"
              ) ? (
                <ExtensionsAdd />
              ) : (
                <Navigate to="/dashboard" replace />
              )
            }
          />
          <Route
            path="/extensions-edit"
            element={
              checkViewSidebar(
                "Extension",
                slugPermissions,
                account?.sectionPermissions,
                account?.permissions,
                "edit"
              ) ? (
                <ExtensionsEdit />
              ) : (
                <Navigate to="/dashboard" replace />
              )
            }
          />
          <Route path="/call-settings" element={<CallSettings />} />
          {/* Extensions Path End */}

          {/*Agents path */}
          <Route path="/agents" element={
            checkViewSidebar(
              "User",
              slugPermissions,
              account?.sectionPermissions,
              account?.permissions,
              "browse"
            ) ?
              <AgentsPbx /> :
              <Navigate to="/dashboard" replace />
          } />
          <Route path="/agents-dialer" element={
            checkViewSidebar(
              "User",
              slugPermissions,
              account?.sectionPermissions,
              account?.permissions,
              "browse"
            ) ?
              <AgentsDialer /> :
              <Navigate to="/dashboard" replace />
          } />
          <Route path="/agents-edit" element={
            checkViewSidebar(
              "User",
              slugPermissions,
              account?.sectionPermissions,
              account?.permissions,
              "edit"
            ) ?
              <AgentsEdits /> :
              <Navigate to="/dashboard" replace />
          } />
          <Route path="/agents-edit-dialer" element={
            checkViewSidebar(
              "User",
              slugPermissions,
              account?.sectionPermissions,
              account?.permissions,
              "edit"
            ) ?
              <AgentsEdits /> :
              <Navigate to="/dashboard" replace />
          } />
          <Route path="/agents-add" element={
            checkViewSidebar(
              "User",
              slugPermissions,
              account?.sectionPermissions,
              account?.permissions,
              "add"
            ) ?
              <AgentsAdd /> :
              <Navigate to="/dashboard" replace />
          } />
          <Route path="/meeting-reports" element={<MeetingReports />} />
          <Route path="/agent-dashboard" element={<AgentDashboard />} />
          {/*Agents path */}

          {/* Rate Card Path */}
          <Route path="/rate-card" element={
            checkViewSidebar(
              "Ratecard",
              slugPermissions,
              account?.sectionPermissions,
              account?.permissions,
              "browse"
            ) ?
              <RateCardView /> :
              <Navigate to="/dashboard" replace />
          } />
          <Route
            path="/global-permission-config"
            element={<PermissionConfigForUser />}
          />
          {/* Rate Card Path */}

          {/*Store path */}
          <Route path="/add-ons" element={<AddOns />} />
          {/*Store path */}

          {/*CallDashboardProvider */}
          <Route
            path="/call-dashboard-provider"
            element={<CallDashboardProvider />}
          />

          {/* Settings Path */}
          <Route path="/fax-settings" element={<FaxSettings />} />
          <Route path="/call-recording-settings" element={<CallRecording />} />
          {/* Settings Path */}

          {/* Voice path start */}
          <Route path="/voicemail-report" element={
            checkViewSidebar(
              "VoicemailRecording",
              slugPermissions,
              account?.sectionPermissions,
              account?.permissions,
              "browse"
            ) ?
              <VoiceMailReport /> :
              <Navigate to="/dashboard" replace />
          } />
          <Route path="/voice-music" element={
            checkViewSidebar(
              "Sound",
              slugPermissions,
              account?.sectionPermissions,
              account?.permissions,
              "browse"
            ) ?
              <Music /> :
              <Navigate to="/dashboard" replace />
          } />
          {/* Voice path End */}

          {/* Dialplan path start */}
          <Route path="/destination" element={<Destination />} />
          <Route path="/inbound-route" element={<InboundRoute />} />
          <Route path="/destination-add" element={<DestinationAdd />} />
          <Route path="/destination-edit" element={<DestinationEdit />} />
          {/* Dialplan path end */}

          {/* Sip path start */}
          <Route path="/sip-add" element={<SipAdd />} />
          {/* Sip path End */}

          {/* Sofia path start */}
          <Route path="/sofia-setting" element={<SofiaSetting />} />
          <Route path="/sofia-status" element={<SofiaStatus />} />
          <Route path="/sofia-add-setting" element={<SofiaAddSetting />} />
          <Route path="/sofia-edit-setting" element={<SofiaEditSetting />} />
          {/* Sofia path end */}

          {/* --------------- ai path start */}

          {/* <Route path="/ai-all-agent" element={<AllAgent />} /> */}
          {/* <Route path="/ai-knowledge-base" element={<AiKnowledgeBase />} /> */}
          {/* <Route path="/ai-phone-number" element={<AiPhoneNumber />} /> */}
          <Route path="/ai-call-history" element={<CallHistory />} />
          <Route path="/ai-billing" element={<Billing />} />
          <Route path="/ai-batch-call" element={<AiBatchCall />} />
          <Route path="/ai-agent-dashboard" element={<AiDashboard />} />

          <Route path="/ai-all-agent" element={<AllAgent />} />
          <Route path="/all-users" element={<AllUser />} />
          <Route path="/ai-knowledge-base" element={<AiKnowledgeBase />} />
          <Route path="/ai-phone-number" element={<AiPhoneNumber />} />
          {/* --------------- ai path end */}

          {/* WebRtc path start */}
          <Route path="/webrtc" element={<WebrtcWrapper />} />
          <Route path="/message" element={<Messages />} />
          <Route path="/whatsapp-chatbox" element={<WhatsAppChatBox />} />
          <Route path="/sms-chat" element={<SmsChat />} />

          {/* <Route path="/call" element={<CallPage />} />
          <Route path="/all-contacts" element={<AllContactPage />} />
          <Route path="/call-center" element={<CallCenterPage />} />
          <Route path="/all-voicemails" element={<AllVoiceMailsPage />} />
          <Route path="/ongoing-call" element={<OngoingCallPage />} /> */}
          <Route
            path="/cdr-report"
            element={
              checkViewSidebar(
                "ChannelHangupComplete",
                slugPermissions,
                account?.sectionPermissions,
                account?.permissions,
                "browse"
              ) ? (
                <CdrFilterReport page="all" />
              ) : (
                <Navigate to="/dashboard" replace />
              )
            }
          />
          <Route
            path="/ring-group-report"
            element={
              checkViewSidebar(
                "Ringgroup",
                slugPermissions,
                account?.sectionPermissions,
                account?.permissions,
                "browse"
              ) ?
                <CdrFilterReport page="ringgroup" /> :
                <Navigate to="/dashboard" replace />
            }
          />
          <Route
            path="/call-center-report"
            element={
              checkViewSidebar(
                "CallCenterQueue",
                slugPermissions,
                account?.sectionPermissions,
                account?.permissions,
                "browse"
              ) ?
                <CdrFilterReport page="callcenter" /> :
                <Navigate to="/dashboard" replace />
            }
          />
          <Route
            path="/billing-report"
            element={
              checkViewSidebar(
                "ChannelHangupComplete",
                slugPermissions,
                account?.sectionPermissions,
                account?.permissions,
                "browse"
              ) ?
                <CdrFilterReport page="billing" /> :
                <Navigate to="/dashboard" replace />
            }
          />
          <Route
            path="/billing-dashboard"
            element={<BillingDashboard page="billing" />}
          />
          <Route path="/efax" element={<EFax />} />

          {/*<Route path="/call-dashboard" element={<CallDashboardPage />} /> */}
          {/* <Route path="/video-call" element={<VideoCall />} />
          <Route path="/conference-call" element={<ConferenceCall />} /> */}
          <Route path="/conference-config" element={<ConferenceConfig />} />
          <Route path="/call-dasbboard-new" element={<CallDashboardNew />} />
          {/* WebRtc path end */}

          {/* Admin Packages path start */}
          <Route path="/document-verification" element={<PendingRequest />} />
          <Route path="/document-details" element={<UserDocumentDetails />} />
          <Route path="/approved-customer" element={<ApprovedCustomer />} />
          <Route
            path="/new-user-verify"
            element={<UserRegistrationProcessOverview />}
          />
          {/* Admin Packages path end */}

          {/* Number Management Path Start */}
          <Route path="/did-add-rate" element={<RateChargeAdd />} />
          <Route path="/add-vendor" element={<AddVendors />} />
          <Route path="/vendors" element={<Vendors />} />
          <Route path="/edit-vendor" element={<EditVendor />} />
          {/* <Route path="/rate-card" element={<RateCharge />} /> */}
          <Route path="/edit-rate-charge" element={<RateChargeEdit />} />
          <Route path="/get-did" element={<GetDid />} />
          <Route path="/did-listing-pbx" element={
            checkViewSidebar(
              "DidDetail",
              slugPermissions,
              account?.sectionPermissions,
              account?.permissions,
              "browse"
            ) ?
              <DidListing page="pbx" /> :
              <Navigate to="/dashboard" replace />
          } />
          <Route path="/did-listing" element={
            checkViewSidebar(
              "DidDetail",
              slugPermissions,
              account?.sectionPermissions,
              account?.permissions,
              "browse"
            ) ?
              <DidListing page="number" /> :
              <Navigate to="/dashboard" replace />
          } />
          <Route path="/did-listing-dialer" element={
            checkViewSidebar(
              "DidDetail",
              slugPermissions,
              account?.sectionPermissions,
              account?.permissions,
              "browse"
            ) ?
              <DidListing page="dialer" /> :
              <Navigate to="/dashboard" replace />
          } />

          <Route path="/did-config" element={
            checkViewSidebar(
              "DidConfigure",
              slugPermissions,
              account?.sectionPermissions,
              account?.permissions,
              "browse"
            ) ?
              <DidConfig /> :
              <Navigate to="/dashboard" replace />
          } />
          <Route path="/management-get-did" element={
            checkViewSidebar(
              "DidDetail",
              slugPermissions,
              account?.sectionPermissions,
              account?.permissions,
              "add"
            ) ?
              <NewGetDid /> :
              <Navigate to="/dashboard" replace />
          } />
          {/* <Route path="/add-number" element={<AddNumber />} /> */}
          <Route
            path="/port-number"
            element={
              checkViewSidebar(
                "Port",
                slugPermissions,
                account?.sectionPermissions,
                account?.permissions,
                "browse"
              ) ? (
                <PortNumber />
              ) : (
                <Navigate to="/dashboard" replace />
              )
            }
          />
          <Route
            path="/port-number-add"
            element={
              checkViewSidebar(
                "Port",
                slugPermissions,
                account?.sectionPermissions,
                account?.permissions,
                "add"
              ) ? (
                <PortNumberAdd />
              ) : (
                <Navigate to="/dashboard" replace />
              )
            }
          />
          <Route
            path="/port-number-edit"
            element={
              checkViewSidebar(
                "Port",
                slugPermissions,
                account?.sectionPermissions,
                account?.permissions,
                "edit"
              ) ? (
                <PortNumberEdit />
              ) : (
                <Navigate to="/dashboard" replace />
              )
            }
          />
          <Route path="/did-add" element={
            checkViewSidebar(
              "DidDetail",
              slugPermissions,
              account?.sectionPermissions,
              account?.permissions,
              "add"
            ) ?
              <DidListingAdd /> :
              <Navigate to="/dashboard" replace />
          } />

          <Route path="/number-compliances" element={<NumberCompliancesHome />} />
          <Route path="/number-compliances/:country" element={<AlgeriaCompliance />} />

          {/* Number Management Path End */}

          {/* Payment path start */}
          <Route path="/add-payment-gateway" element={<PaymentGatewayAdd />} />
          <Route path="/payment-gateway" element={<PaymentGateway />} />
          <Route
            path="/payment-gateway-edit"
            element={<PaymentGatewayEdit />}
          />
          {/* Payment path end */}

          {/* Call Center queue path start */}
          <Route
            path="/cal-center-queue"
            element={
              checkViewSidebar(
                "CallCenterQueue",
                slugPermissions,
                account?.sectionPermissions,
                account?.permissions,
                "browse"
              ) ? (
                <CallCenterQueue />
              ) : (
                <Navigate to="/dashboard" replace />
              )
            }
          />
          <Route
            path="/cal-center-queue-edit"
            element={
              checkViewSidebar(
                "CallCenterQueue",
                slugPermissions,
                account?.sectionPermissions,
                account?.permissions,
                "edit"
              ) ? (
                <CallCenterQueueEdit />
              ) : (
                <Navigate to="/dashboard" replace />
              )
            }
          />
          <Route
            path="/cal-center-queue-add"
            element={
              checkViewSidebar(
                "CallCenterQueue",
                slugPermissions,
                account?.sectionPermissions,
                account?.permissions,
                "add"
              ) ? (
                <CallCenterQueueAdd />
              ) : (
                <Navigate to="/dashboard" replace />
              )
            }
          />
          <Route
            path="/call-center-settings"
            element={<CallCenterSettings />}
          />
          {/* Call Center queue path End */}

          {/* Settings path start */}
          <Route path="/admin/package" element={<Package />} />
          <Route path="/admin/package-add" element={<PackageAdd />} />
          <Route path="/admin/package-edit" element={<PackageEdit />} />
          <Route path="/admin/feature" element={<Feature />} />
          <Route
            path="/roles"
            element={
              checkViewSidebar(
                "Role",
                slugPermissions,
                account?.sectionPermissions,
                account?.permissions,
                "browse"
              ) ? (
                <Roles />
              ) : (
                <Navigate to="/dashboard" replace />
              )
            }
          />
          <Route path="/upload-document" element={<DocumentUpload />} />
          {/* Settings path end */}

          {/* Billing Pages Start */}
          <Route
            path="/card-details"
            element={
              checkViewSidebar(
                "CardDetail",
                slugPermissions,
                account?.sectionPermissions,
                account?.permissions,
                "browse"
              ) &&
                checkViewSidebar(
                  "BillingAddress",
                  slugPermissions,
                  account?.sectionPermissions,
                  account?.permissions,
                  "browse"
                ) ? (
                <CardAndBilling />
              ) : (
                <Navigate to="/dashboard" replace />
              )
            }
          />
          <Route path="/invoice-list" element={<InvoiceList />} />
          <Route path="/expense-list" element={<ExpenseList />} />
          <Route
            path="/billing-card-and-wallet"
            element={
              checkViewSidebar(
                "WalletTransaction",
                slugPermissions,
                account?.sectionPermissions,
                account?.permissions,
                "browse"
              ) && checkViewSidebar(
                "Payment",
                slugPermissions,
                account?.sectionPermissions,
                account?.permissions,
                "browse"
              ) ?
                <BillingCardAndWallet /> :
                <Navigate to="/dashboard" replace />
            }
          />
          <Route
            path="/card-transaction-list"
            element={
              checkViewSidebar(
                "CardDetail",
                slugPermissions,
                account?.sectionPermissions,
                account?.permissions,
                "browse"
              ) ? (
                <CardTransactionsList />
              ) : (
                <Navigate to="/dashboard" replace />
              )
            }
          />
          <Route
            path="/wallet-transaction-list"
            element={
              checkViewSidebar(
                "WalletTransaction",
                slugPermissions,
                account?.sectionPermissions,
                account?.permissions,
                "browse"
              ) ? (
                <WalletTransactionsList />
              ) : (
                <Navigate to="/dashboard" replace />
              )
            }
          />
          <Route
            path="/subscription-management"
            element={<SubscriptionManagement />}
          />
          <Route
            path="/package-details"
            element={
              checkViewSidebar(
                "Package",
                slugPermissions,
                account?.sectionPermissions,
                account?.permissions,
                "browse"
              ) ?
                <PackageAndSubscriptionDetails /> :
                <Navigate to="/dashboard" replace />
            }
          />
          {/* Billing Pages End */}

          <Route path="/variable" element={<Variable />}></Route>

          <Route
            path="/mail-settings-edit"
            element={
              checkViewSidebar(
                "MailSetting",
                slugPermissions,
                account?.sectionPermissions,
                account?.permissions,
                "edit"
              ) ? (
                <MailSettingsEdit />
              ) : (
                <Navigate to="/dashboard" replace />
              )
            }
          />
          <Route
            path="/mail-settings"
            element={
              checkViewSidebar(
                "MailSetting",
                slugPermissions,
                account?.sectionPermissions,
                account?.permissions,
                "browse"
              ) ? (
                <MailSettings />
              ) : (
                <Navigate to="/dashboard" replace />
              )
            }
          />
          {/* Mail Setting Page End */}

          {/* Ivr Page Start */}
          <Route
            path="/ivr-add"
            element={
              checkViewSidebar(
                "IvrMaster",
                slugPermissions,
                account?.sectionPermissions,
                account?.permissions,
                "add"
              ) ? (
                <IvrAdd />
              ) : (
                <Navigate to="/dashboard" replace />
              )
            }
          />
          <Route
            path="/ivr"
            element={
              checkViewSidebar(
                "IvrMaster",
                slugPermissions,
                account?.sectionPermissions,
                account?.permissions,
                "browse"
              ) ? (
                <IvrListing />
              ) : (
                <Navigate to="/dashboard" replace />
              )
            }
          />
          <Route
            path="/ivr-edit"
            element={
              checkViewSidebar(
                "IvrMaster",
                slugPermissions,
                account?.sectionPermissions,
                account?.permissions,
                "edit"
              ) ? (
                <IvrEdit />
              ) : (
                <Navigate to="/dashboard" replace />
              )
            }
          />
          <Route path="/ivr-options" element={
            checkViewSidebar(
              "IvrOptions",
              slugPermissions,
              account?.sectionPermissions,
              account?.permissions,
              "browse"
            ) ?
              <IvrOptions /> :
              <Navigate to="/dashboard" replace />
          } />
          {/* Ivr Page End */}

          {/* Device Provisioning Start */}
          <Route path="/device-provisioning" element={<DeviceProvisioning />} />
          <Route
            path="/device-provisioning-add"
            element={<DeviceProvisioningAdd />}
          />
          <Route
            path="/device-provisioning-edit"
            element={<DeviceProvisioningEdit />}
          />
          <Route
            path="/device-provisioning-new"
            element={<DeviceProvisioningNew />}
          />
          <Route path="/all-devices" element={<AvailableDeviceList />} />
          {/* Device Profisioning End  */}
          {/* Spam Filter start */}
          <Route path="/call-blocking" element={
            checkViewSidebar(
              "Spam",
              slugPermissions,
              account?.sectionPermissions,
              account?.permissions,
              "browse"
            ) ?
              <CallBlocking /> :
              <Navigate to="/dashboard" replace />
          } />
          <Route path="/call-blocking-add" element={
            checkViewSidebar(
              "Spam",
              slugPermissions,
              account?.sectionPermissions,
              account?.permissions,
              "add"
            ) ?
              <CallBlockingAdd /> :
              <Navigate to="/dashboard" replace />
          } />
          {/* Spam Filter end */}

          <Route path="click-to-call-edit" element={
            accountDetails?.add_on_subscription.find(
              (item) => item?.addon_id == 2
            ) &&
              checkViewSidebar(
                "Clicktocall",
                slugPermissions,
                account?.sectionPermissions,
                account?.permissions,
                "edit"
              ) ?
              <ClickToCallEdit /> :
              <Navigate to="/dashboard" replace />
          } />

          <Route
            path="click-to-call-listing"
            element={
              accountDetails?.add_on_subscription.find(
                (item) => item?.addon_id == 2
              ) &&
                checkViewSidebar(
                  "Clicktocall",
                  slugPermissions,
                  account?.sectionPermissions,
                  account?.permissions,
                  "browse"
                ) ?
                <ClickToCallListing /> :
                <Navigate to="/dashboard" replace />
            }
          />
          <Route path="click-to-call-add" element={
            accountDetails?.add_on_subscription.find(
              (item) => item?.addon_id == 2
            ) &&
              checkViewSidebar(
                "Clicktocall",
                slugPermissions,
                account?.sectionPermissions,
                account?.permissions,
                "add"
              ) ?
              <ClickToCallSetup /> :
              <Navigate to="/dashboard" replace />
          } />

          {/* Dialer Modules */}

          <Route path="/dialer-dashboard" element={
            checkViewSidebar(
              "Dashboard",
              slugPermissions,
              account?.sectionPermissions,
              account?.permissions,
              "browse"
            ) ?
              <DialerDashboard /> :
              <Navigate to="/dashboard" replace />
          } />
          <Route path="/call-desposition" element={<CallDesposition />} />

          {/* ------ Leads */}
          <Route path="/leads" element={
            checkViewSidebar(
              "Lead",
              slugPermissions,
              account?.sectionPermissions,
              account?.permissions,
              "browse"
            ) ?
              <Leads /> :
              <Navigate to="/dashboard" replace />
          } />
          <Route path="/lead-view" element={
            checkViewSidebar(
              "Lead",
              slugPermissions,
              account?.sectionPermissions,
              account?.permissions,
              "read"
            ) ?
              <LeadEdit /> :
              <Navigate to="/dashboard" replace />
          } />
          <Route path="/lead-add" element={
            checkViewSidebar(
              "Lead",
              slugPermissions,
              account?.sectionPermissions,
              account?.permissions,
              "add"
            ) ?
              <LeadAdd /> :
              <Navigate to="/dashboard" replace />
          } />
          {/* ------ Leads */}

          {/* ------ Support  */}
          <Route path="/knowledge-base" element={<KnowledgeBase />} />
          <Route path="/live-chat" element={<LiveChat />} />
          <Route path="/ticket" element={<Ticket />} />
          <Route path="/view-massage" element={<ViewMessages />} />

          {/* ------ Support  */}
          {/* ------ Campaigns */}
          <Route path="/campaigns" element={
            checkViewSidebar(
              "Campaign",
              slugPermissions,
              account?.sectionPermissions,
              account?.permissions,
              "browse"
            ) ?
              <Campaigns /> :
              <Navigate to="/dashboard" replace />
          } />
          {/* <Route path="/campaign-create" element={<CampaignCreate />} /> */}
          {/* <Route path="/campaign-edit" element={<CampaignEdit />} /> */}
          <Route path="/dialer-cdr-report" element={
            checkViewSidebar(
              "Campaignlead",
              slugPermissions,
              account?.sectionPermissions,
              account?.permissions,
              "browse"
            ) ?
              <DialerCdrReport /> :
              <Navigate to="/dashboard" replace />
          } />

          <Route path="/campaign-create" element={
            checkViewSidebar(
              "Campaign",
              slugPermissions,
              account?.sectionPermissions,
              account?.permissions,
              "add"
            ) ?
              <CampaignCreateNEW /> :
              <Navigate to="/dashboard" replace />
          } />
          <Route path="/campaign-edit" element={
            checkViewSidebar(
              "Campaign",
              slugPermissions,
              account?.sectionPermissions,
              account?.permissions,
              "edit"
            ) ?
              <CampaignEditNEW /> :
              <Navigate to="/dashboard" replace />
          } />
          {/* ------ Campaigns */}

          {/* ------ Call Tracker */}
          <Route path="/tracker-dashboard" element={<TrackerDashboard />} />
          <Route path="/cdr-tracker" element={<CDRTracker />} />

          <Route
            path="/did-listing-tracker"
            element={<DidListing page="tracker" />}
          />
          <Route path="/buyers" element={<Buyers />} />
          <Route path="/buyer-edit" element={<BuyersEdit />} />
          <Route path="/buyer-add" element={<BuyerAdd />} />
          {/* ------ Call Tracker */}

          {/* ----------- Third Party Addons */}
          <Route
            path="/all-third-party-apps"
            element={<AllThirdPartyConfig />}
          />
          <Route path="/all-addons" element={<AllAddons />} />
          <Route
            path="/all-available-addons"
            element={<AllAvailableAddons />}
          />
          <Route path="/meta-config" element={<MetaConfig />} />
          <Route path="/meta-config-edit" element={<MetaConfigEdit />} />

          <Route path="/whatsapp-config" element={<WhatsAppConfig />} />
          <Route
            path="/whatsapp-config-edit"
            element={<WhatsAppConfigEdit />}
          />

          <Route path="/teams-config" element={<MicrosoftTeamsConfig />} />

          {/* ----------- Third Party Addons */}

          {/* AI Routes */}
          <Route path="/all-ai-agent" element={<AllAiAgent />} />
          <Route path="/ai-agent-add" element={<AIAgentAdd />} />
          <Route path="/ai-agent-edit" element={<AIAgentEdit />} />
          {/* AI Routes */}

          {/* ---------------- source */}
          <Route path="source" element={<Source />} />
          <Route path="source-edit" element={<SourceEdit />} />
          <Route path="source-add" element={<SourceAdd />} />
          {/* ---------------- source */}
          {/* ---------------- source */}
          <Route
            path="call-forwarding-campaign"
            element={<FportalCampaign />}
          />
          <Route
            path="call-forwarding-campaign-create"
            element={<FportalCampaignCreate />}
          />
          <Route
            path="call-forwarding-campaign-edit"
            element={<FportalCampaignEdit />}
          />
          <Route
            path="elastic-trunk"
            element={<ElasticTrunk />}
          />
          <Route
            path="elastic-trunk-edit"
            element={<ElasticTrunkEdit />}
          />
          <Route
            path="elastic-trunk-add"
            element={<ElasticTrunkAdd />}
          />
          <Route path="source-add" element={<SourceAdd />} />
          {/* ---------------- source */}

          {/* ------ Reports */}
          <Route
            path="/call-recording"
            element={
              checkViewSidebar(
                "VoicemailRecording",
                slugPermissions,
                account?.sectionPermissions,
                account?.permissions,
                "browse"
              ) ?
                <CdrReport page="callrecording" /> :
                <Navigate to="/dashboard" replace />
            }
          />
          <Route path="/agent-report" element={<AgentReports />} />
          {/* ------ Reports */}

          {/* 404 Redirection */}
          <Route path="*" element={<Navigate to="/" />} />
          {/* 404 Redirection */}
        </Routes>
        <ToastContainer
          position="bottom-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
      </Router>
    </>
  );
}

export default App;
