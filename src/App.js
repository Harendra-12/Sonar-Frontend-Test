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
import UsersImport from "./Components/Pages/Users/UsersImport";
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
import RateCharge from "./Components/Pages/NumberManagement/RateCharge";
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
import CampaignAnalytics from "./Components/Pages/DialerModule/Campaigns/CampaignAnalytics";
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
import ExtensionStore from "./Components/Pages/Stores/ExtensionStore";
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
import CampaignScheduler from "./Components/Pages/DialerModule/Campaigns/CampaignScheduler";
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
import WhatsAppChatBox from "./Components/Pages/WebRtc/whatsappChatbox/WhatsAppChatBox";
import AllAvailableAddons from "./Components/Pages/ThirdPartyApps/AllAvailableAddons";
import RateCardView from "./Components/Pages/RateCard/RateCardView";
import PagePermissionForUser from "./Components/CommonComponents/PermissionConfigForUser";
import PermissionConfigForUser from "./Components/CommonComponents/PermissionConfigForUser";
import GroupsList from "./Components/Pages/Groups/GroupsList";

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
  // const dispatch = useDispatch();
  // const domainRefresh = useSelector((state) => state.domainRefresh);
  const account = useSelector((state) => state?.account);
  const slugPermissions = useSelector((state) => state?.permissions);
  Socket();

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
      <GoogleTranslate />
      <Router>
        <NavigationSetter />
        <DispatchSetter />
        <GlobalCalls />
        <Navbar />

        <Routes>
          <Route path="/click-to-call" element={<ClickToCall />} />

          <Route path="/" element={<Login />} />
          <Route path="/conference" element={<ConferenceJoin />} />
          <Route path="/conference-join" element={<DummyRegistration />} />

          <Route element={<ProtectedRoute />} />
          <Route path="/campaign-edit" element={<CampaignEdit />} />
          <Route path="/meeting-room" element={<Meeting />} />
          <Route path="/meeting-add" element={<MeetingAdd />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/temporary-dashboard" element={<TempDashboard />} />
          <Route
            path="/agent-disposition-manage"
            element={<AgentDispositionManage />}
          />

          <Route
            path="/my-profile"
            element={
              checkViewSidebar(
                "Account",
                slugPermissions,
                account?.permissions
              ) ? (
                <Profile />
              ) : (
                <Navigate to="/dashboard" replace />
              )
            }
          />
          <Route path="/master" element={<Master />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/phone-dashboard" element={<PhoneDashboard />} />
          <Route path="/active-calls" element={<ActiveCallsPage />} />
          <Route path="/custom-module" element={checkViewSidebar("Usage", slugPermissions, account?.permissions) ? (<CustomModule />) : (
            <Navigate to="/dashboard" replace />
          )} />
           {/* <Route path="/groups" element={<GroupsList/>}/> */}

          {/* <Route path="/active-calls" element={<ActiveCalls />} /> */}

          {/* Ring Groups Path Start */}
          <Route
            path="/ring-groups"
            element={
              checkViewSidebar(
                "Ringgroup",
                slugPermissions,
                account?.permissions,
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
              checkViewSidebar("User", slugPermissions, account?.permissions) ? (
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
                account?.permissions,
                "edit"
              ) ? (
                <UsersEdit />
              ) : (
                <Navigate to="/dashboard" replace />
              )
            }
          />
          <Route path="/users-import" element={<UsersImport />} />
          <Route path="/users-config" element={<UserConfiguration />} />
          {/* Users Path End */}

          {/* Extensions Path Start */}
          <Route
            path="/extensions"
            element={
              checkViewSidebar(
                "Extension",
                slugPermissions,
                account?.permissions
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
          <Route path="/agents" element={<AgentsPbx />} />
          <Route path="/agents-dialer" element={<AgentsDialer />} />
          <Route path="/agents-edit" element={<AgentsEdits />} />
          <Route path="/agents-edit-dialer" element={<AgentsEdits />} />
          <Route path="/agents-add" element={<AgentsAdd />} />
          <Route path="/meeting-reports" element={<MeetingReports />} />
          <Route path="/agent-dashboard" element={<AgentDashboard />} />
          {/*Agents path */}

          {/* Rate Card Path */}
          <Route path="/rate-card" element={<RateCardView />} />
          <Route path="/global-permission-config" element={<PermissionConfigForUser />} />
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
          <Route path="/voicemail-report" element={<VoiceMailReport />} />
          <Route path="/voice-music" element={<Music />} />
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

          {/* WebRtc path start */}
          <Route path="/webrtc" element={<WebrtcWrapper />} />
          <Route path="/message" element={<Messages />} />
          <Route path="/whatsapp-chatbox" element={<WhatsAppChatBox />} />
          {/* <Route path="/call" element={<CallPage />} />
          <Route path="/all-contacts" element={<AllContactPage />} />
          <Route path="/call-center" element={<CallCenterPage />} />
          <Route path="/all-voicemails" element={<AllVoiceMailsPage />} />
          <Route path="/ongoing-call" element={<OngoingCallPage />} /> */}
          <Route
            path="/cdr-report"
            element={
              checkViewSidebar("ChannelHangupComplete", slugPermissions, account?.permissions) ? (
                <CdrFilterReport page="all" />
              ) : (
                <Navigate to="/dashboard" replace />
              )
            }
          />
          <Route
            path="/ring-group-report"
            element={<CdrFilterReport page="ringgroup" />}
          />
          <Route
            path="/call-center-report"
            element={<CdrFilterReport page="callcenter" />}
          />
          <Route
            path="/billing-report"
            element={<CdrFilterReport page="billing" />}
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
          <Route path="/rate-card" element={<RateCharge />} />
          <Route path="/edit-rate-charge" element={<RateChargeEdit />} />
          <Route path="/get-did" element={<GetDid />} />
          <Route path="/did-listing-pbx" element={<DidListing page="pbx" />} />
          <Route path="/did-listing" element={<DidListing page="number" />} />
          <Route path="/did-config" element={<DidConfig />} />
          <Route
            path="/port-number"
            element={
              checkViewSidebar("Port", slugPermissions, account?.permissions) ? (
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
                account?.permissions, "add"
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
                account?.permissions, "edit"
              ) ? (
                <PortNumberEdit />
              ) : (
                <Navigate to="/dashboard" replace />
              )
            }
          />
          <Route path="/did-add" element={<DidListingAdd />} />
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
                account?.permissions
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
                account?.permissions, "edit"
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
                account?.permissions, "add"
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
              checkViewSidebar("Role", slugPermissions, account?.permissions) ? (
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
                account?.permissions
              ) &&
                checkViewSidebar(
                  "BillingAddress",
                  slugPermissions,
                  account?.permissions
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
            path="/card-transaction-list"
            element={
              checkViewSidebar(
                "CardDetail",
                slugPermissions,
                account?.permissions
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
                account?.permissions
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
          {/* Billing Pages End */}

          <Route path="/variable" element={<Variable />}></Route>

          <Route
            path="/mail-settings-edit"
            element={
              checkViewSidebar(
                "MailSetting",
                slugPermissions,
                account?.permissions, "edit"
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
                account?.permissions
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
                account?.permissions, "add"
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
                account?.permissions
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
                account?.permissions, "edit"
              ) ? (
                <IvrEdit />
              ) : (
                <Navigate to="/dashboard" replace />
              )
            }
          />
          <Route path="/ivr-options" element={<IvrOptions />} />
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
          <Route path="/call-blocking" element={<CallBlocking />} />
          <Route path="/call-blocking-add" element={<CallBlockingAdd />} />
          {/* Spam Filter end */}

          <Route path="click-to-call-edit" element={<ClickToCallEdit />} />
          <Route
            path="click-to-call-listing"
            element={<ClickToCallListing />}
          />
          <Route path="click-to-call-add" element={<ClickToCallSetup />} />

          {/* Dialer Modules */}

          {/* ------ Dashboard  */}
          <Route path="/dialer-dashboard" element={<DialerDashboard />} />
          <Route path="/call-desposition" element={<CallDesposition />} />
          {/* ------ Dashboard  */}

          {/* ------ Leads */}
          <Route path="/leads" element={<Leads />} />
          <Route path="/lead-edit" element={<LeadEdit />} />
          <Route path="/lead-add" element={<LeadAdd />} />
          {/* ------ Leads */}

          {/* ------ Support  */}
          <Route path="/knowledge-base" element={<KnowledgeBase />} />
          {/* <Route path="/ticket" element={<Ticket />} /> */}
          <Route path="/ticket" element={<Ticket />} />
          <Route path="/view-massage" element={<ViewMessages />} />

          {/* ------ Support  */}
          {/* ------ Campaigns */}
          <Route path="/campaigns" element={<Campaigns />} />
          <Route path="/campaign-analytics" element={<CampaignAnalytics />} />
          <Route path="/campaign-create" element={<CampaignCreate />} />
          <Route path="/campaign-scheduler" element={<CampaignScheduler />} />
          {/* ------ Campaigns */}

          {/* ------ Call Tracker */}
          <Route path="/tracker-dashboard" element={<TrackerDashboard />} />
          <Route
            path="/did-listing-tracker"
            element={<DidListing page="tracker" />}
          />
          <Route path="/buyers" element={<Buyers />} />
          <Route path="/buyer-edit" element={<BuyersEdit />} />
          <Route path="/buyer-add" element={<BuyerAdd />} />
          {/* ------ Call Tracker */}


          {/* ----------- Third Party Addons */}
          <Route path="/all-third-party-apps" element={<AllThirdPartyConfig />} />
          <Route path="/all-addons" element={<AllAddons />} />
          <Route path="/all-available-addons" element={<AllAvailableAddons />} />
          <Route path="/meta-config" element={<MetaConfig />} />
          <Route path="/meta-config-edit" element={<MetaConfigEdit />} />

          <Route path="/whatsapp-config" element={<WhatsAppConfig />} />
          <Route path="/whatsapp-config-edit" element={<WhatsAppConfigEdit />} />

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

          {/* ------ Reports */}
          <Route
            path="/call-recording"
            element={<CdrReport page="callrecording" />}
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
