import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useNavigate,
} from "react-router-dom";
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
import ExtensionsExport from "./Components/Pages/Extensions/ExtensionsExport";
import ExtensionsImport from "./Components/Pages/Extensions/ExtensionsImport";
import ExtensionsSettings from "./Components/Pages/Extensions/ExtensionsSettings";
import ExtensionSettingsEdit from "./Components/Pages/Extensions/ExtensionSettingsEdit";
import ExtensionSummary from "./Components/Pages/Extensions/ExtensionSummary";
import Dashboard from "./Components/Pages/Dashboard/Dashboard";
import Profile from "./Components/Pages/Profile/Profile";
import Gateway from "./Components/Pages/Gateway/Gateway";
import GatewayAdd from "./Components/Pages/Gateway/GatewayAdd";
import GatewayEdit from "./Components/Pages/Gateway/GatewayEdit";
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
import Call from "./Components/Pages/WebRtc/Call";
import OngoingCall from "./Components/Pages/WebRtc/OngoingCall";
import CdrReport from "./Components/Pages/WebRtc/CdrReport";
import InboundRoute from "./Components/Pages/Dialplan/InboundRouteAdd";
import CallSettings from "./Components/CommonComponents/CallSettings";
import ChangePassword from "./Components/CommonComponents/ChangePassword";
import PackageAdd from "./Components/Pages/Setting/PackageAdd";
import Package from "./Components/Pages/Setting/Package";
import PackageEdit from "./Components/Pages/Setting/PackageEdit";
import Feature from "./Components/Pages/Setting/Feature";
import PendingRequest from "./Components/Pages/Admin/PendingDocument";
import UserDetails from "./Components/Pages/Admin/UserDetails";
import PaymentVerification from "./Components/Pages/Admin/PendingPayment";
import ApprovedCustomer from "./Components/Pages/Admin/ApprovedCustomer";
import UserDocumentDetails from "./Components/Pages/Admin/UserDocumentDetails";
import RateChargeAdd from "./Components/Pages/NumberManagement/RateChargeAdd";
import AddVendors from "./Components/Pages/NumberManagement/AddVendors";
import Vendors from "./Components/Pages/NumberManagement/Vendors";
import EditVendor from "./Components/Pages/NumberManagement/EditVendor";
import RateCharge from "./Components/Pages/NumberManagement/RateCharge";
import RateChargeEdit from "./Components/Pages/NumberManagement/RateChargeEdit";
import GetDid from "./Components/Pages/NumberManagement/GetDid";
import { setNavigate } from "./Components/GlobalFunction/Navigation";
import { useEffect } from "react";
import PaymentGatewayAdd from "./Components/Pages/Payment/PaymentGatewayAdd";
import PaymentGateway from "./Components/Pages/Payment/PaymentGateway";
import PaymentGatewayEdit from "./Components/Pages/Payment/PaymentGatewayEdit";
import CallCenterQueue from "./Components/Pages/CallCenter/CallCenterQueue";
import CallCenterQueueAdd from "./Components/Pages/CallCenter/CallCenterQueueAdd";
import CallCenterQueueEdit from "./Components/Pages/CallCenter/CallCenterQueueEdit";
import Roles from "./Components/Pages/Setting/Roles";
import CustomerDetails from "./Components/Pages/Profile/CustomerDetails";
import DocumentUpload from "./Components/Pages/Profile/DocumentUpload";
import { useSelector } from "react-redux";

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

function App() {
  const account = useSelector((state)=>state.account)
  Socket();

  // Unlock this if want push notification add account edit here if id is available
  // useEffect(()=>{
  //   const token = generateToken().then((res)=>console.log("This is from response",res))
  //   if(token){
  //     console.log(account,"This is token from app",token);
  //   }

  //   onMessage(messaging,(payload)=>{
  //     console.log(payload);
  //   })
  // },[account])
  return (
    <>
      <Router>
        <NavigationSetter />
        <Navbar />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/my-profile" element={<Profile />} />
            <Route path="/master" element={<Master />} />
            <Route path="/change-password" element={<ChangePassword />} />

            {/* Ring Groups Path Start */}
            <Route path="/ring-groups" element={<RingGroups />} />
            <Route path="/ring-groups-add" element={<RingGroupAdd />} />
            <Route path="/ring-groups-edit" element={<RingGroupEdit />} />
            {/* Ring Groups Path End */}

            {/* Users Path Start */}
            <Route path="/users" element={<Users />} />
            <Route path="/users-add" element={<UsersAdd />} />
            <Route path="/users-edit" element={<UsersEdit />} />
            <Route path="/users-import" element={<UsersImport />} />
            {/* Users Path End */}

            {/* Extensions Path Start */}
            <Route path="/extensions" element={<Extensions />} />
            <Route path="/extensions-add" element={<ExtensionsAdd />} />
            <Route path="/extensions-edit" element={<ExtensionsEdit />} />
            <Route path="/extensions-export" element={<ExtensionsExport />} />
            <Route path="/extensions-import" element={<ExtensionsImport />} />
            <Route path="/extension-summary" element={<ExtensionSummary />} />
            <Route
              path="/extension-settings"
              element={<ExtensionsSettings />}
            />
            <Route
              path="/extension-settings-edit"
              element={<ExtensionSettingsEdit />}
            />
            <Route path="/call-settings" element={<CallSettings />} />
            {/* Extensions Path End */}

            {/* Gateway path start */}
            <Route path="/gateway" element={<Gateway />} />
            <Route path="/gateway-add" element={<GatewayAdd />} />
            <Route path="/gateway-edit" element={<GatewayEdit />} />
            {/* Gateway path end */}

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
            <Route path="/call" element={<Call />} />
            <Route path="/ongoing-call" element={<OngoingCall />} />
            <Route path="/cdr-report" element={<CdrReport />} />
            {/* WebRtc path end */}

            {/* Admin Packages path start */}
            <Route path="/document-verification" element={<PendingRequest />} />
            <Route
              path="/payment-verification"
              element={<PaymentVerification />}
            />
            <Route path="/document-details" element={<UserDocumentDetails />} />
            <Route path="/user-details" element={<UserDetails />} />
            <Route path="/approved-customer" element={<ApprovedCustomer />} />
            {/* Admin Packages path end */}

            {/* Number Management Path Start */}
            <Route path="/did-add-rate" element={<RateChargeAdd />} />
            <Route path="/add-vendor" element={<AddVendors />} />
            <Route path="/vendors" element={<Vendors />} />
            <Route path="/edit-vendor" element={<EditVendor />} />
            <Route path="/rate-card" element={<RateCharge />} />
            <Route path="/edit-rate-charge" element={<RateChargeEdit />} />
            <Route path="/get-did" element={<GetDid />} />
            {/* Number Management Path End */}

            {/* Payment path start */}
            <Route
              path="/add-payment-gateway"
              element={<PaymentGatewayAdd />}
            />
            <Route path="/payment-gateway" element={<PaymentGateway />} />
            <Route
              path="/payment-gateway-edit"
              element={<PaymentGatewayEdit />}
            />
            {/* Payment path end */}

            {/* Call Center queue path start */}
            <Route path="/cal-center-queue" element={<CallCenterQueue />} />
            <Route
              path="/cal-center-queue-edit"
              element={<CallCenterQueueEdit />}
            />
            <Route
              path="/cal-center-queue-add"
              element={<CallCenterQueueAdd />}
            />
            {/* Call Center queue path End */}

            {/* Setting path start */}
            <Route path="/admin/package" element={<Package />} />
            <Route path="/admin/package-add" element={<PackageAdd />} />
            <Route path="/admin/package-edit" element={<PackageEdit />} />
            <Route path="/admin/feature" element={<Feature />} />
            <Route path="/roles" element={<Roles />} />
            <Route path="/customer-details" element={<CustomerDetails />} />
            <Route path="/upload-document" element={<DocumentUpload />} />
            {/* Setting path end */}
          </Route>
          {/* 404 Redirection */}
          <Route path="*" element={<Navigate to="/dashboard" />} />
          {/* 404 Redirection */}
        </Routes>
      </Router>
    </>
  );
}

export default App;
