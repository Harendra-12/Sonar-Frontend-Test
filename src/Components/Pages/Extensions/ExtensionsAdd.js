import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  backToTop,
  generalGetFunction,
  generalPostFunction,
} from "../../GlobalFunction/globalFunction";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CircularLoader from "../Misc/CircularLoader";

const ExtensionsAdd = () => {
  const navigate = useNavigate();
  const acount = useSelector((state) => state.account);
  const [domains, setDomains] = useState();
  const [loading, setLoading] = useState(false);
  const [music, setMusic] = useState();
  const [musicHold, setMusicHold] = useState();
  const [extensionState, setExtensionState] = useState({
    extension: "",
    extensionMissing: false,
    voicePass: "",
    voicePassMissing: false,
    accountCode: "",
    accountCodeMissing: false,
    effCallerIdName: "",
    effCallerIdNameMissing: false,
    effCallerIdNumber: "",
    effCallerIdNumberMissing: false,
    outCallerIdName: "",
    outCallerIdNameMissing: false,
    outCallerIdNumber: "",
    outCallerIdNumberMissing: false,
    emeCallerIdName: "",
    emeCallerIdNameMissing: false,
    emeCallerIdNumber: "",
    emeCallerIdNumberMissing: false,
    dirFullName: "",
    dirFullNameMissing: false,
    dirVisible: "",
    dirVisibleMissing: false,
    dirExtensionVisible: "true",
    dirExtensionVisibleMissing: false,
    maxRegistration: "",
    maxRegistrationMissing: false,
    limitMax: "",
    limitMaxMissing: false,
    limitDest: "",
    limitDestMissing: false,
    voiceMailEnable: "N",
    voiceMailEnableMissing: false,
    voiceEmailTo: "",
    voiceEmailToMissing: false,
    voiceMialFile: "",
    voiceMialFileMissing: false,
    voiceMailKeepFile: "false",
    voiceMailKeepFileMissing: false,
    missedCall: "none",
    missedCallMissing: false,
    toAllowValue: "",
    toAllowValueMissing: false,
    callTimeOut: "",
    callTimeOutMissing: false,
    callGroup: "",
    callGroupMissing: false,
    callScreen: "Disable",
    callScreenMissing: false,
    record: "A",
    recordMissing: false,
    domain: "",
    domainMissing: false,
    desc: "",
    descMissing: false,
    password: "",
    passwordMising: false,
  });

  const account = useSelector((state) => state.account);
  useEffect(() => {
    if (account === null) {
      navigate("/");
    } else {
      async function getDomain() {
        const domain = await generalGetFunction(
          `/domain/search?account=${account.account_id}`
        );
        const musicData = await generalGetFunction("/sound/all?type=hold");
        if (domain.status) {
          setDomains(
            domain.data.map((item) => {
              return [item.id, item.domain_name];
            })
          );
        } else {
          navigate("/");
        }
        if (musicData.status) {
          setMusic(musicData.data);
        }
      }
      getDomain();
    }
  }, []);
  // Handle validation and create store
  async function handleSubmit() {
    if (extensionState.extension.trim().length > 2) {
      setExtensionState((prevState) => ({
        ...prevState,
        extensionMissing: false,
      }));
    } else {
      setExtensionState((prevState) => ({
        ...prevState,
        extensionMissing: true,
      }));
    }
    if (extensionState.voicePass.trim().length > 3) {
      setExtensionState((prevState) => ({
        ...prevState,
        voicePassMissing: false,
      }));
    } else {
      setExtensionState((prevState) => ({
        ...prevState,
        voicePassMissing: true,
      }));
    }
    if (extensionState.password === "" || extensionState.password.length < 4) {
      setExtensionState((prevState) => ({
        ...prevState,
        passwordMising: true,
      }));
    } else {
      setExtensionState((prevState) => ({
        ...prevState,
        passwordMising: false,
      }));
    }
    if (
      extensionState.domain === "" ||
      extensionState.domain === "Select Domain"
    ) {
      setExtensionState((prevState) => ({
        ...prevState,
        domainMissing: true,
      }));
    } else {
      setExtensionState((prevState) => ({
        ...prevState,
        domainMissing: false,
      }));
    }

    if (
      extensionState.extension.trim().length > 2 &&
      !(extensionState.password === "" || extensionState.password.length < 4) &&
      extensionState.voicePass.trim().length > 3 &&
      !(
        extensionState.domain === "" ||
        extensionState.domain === "Select Domain"
      )
    ) {
      setLoading(true);
      const parseddata = {
        account_id: acount.account_id,
        extension: extensionState.extension,
        voicemail_password: extensionState.voicePass,
        account_code: extensionState.accountCode,
        effectiveCallerIdName: extensionState.effCallerIdName,
        effectiveCallerIdNumber: extensionState.effCallerIdNumber,
        outbundCallerIdName: extensionState.outCallerIdName,
        outbundCallerIdNumber: extensionState.outCallerIdNumber,
        emergencyCallerIdName: extensionState.emeCallerIdName,
        emergencyCallerIdNumber: extensionState.emeCallerIdNumber,
        directoryFullname: extensionState.dirFullName,
        directoryExtensionVisible: extensionState.dirExtensionVisible,
        maxRegistration: extensionState.maxRegistration,
        limitMax: extensionState.limitMax,
        limitDestinations: extensionState.limitDest,
        voicemailEnabled: extensionState.voiceMailEnable,
        voiceEmailTo: extensionState.voiceEmailTo,
        voiceMailFile: extensionState.voiceMialFile,
        voiceMailkeepFile: extensionState.voiceMailKeepFile,
        missedCall: extensionState.missedCall,
        tollAllowValue: extensionState.toAllowValue,
        callTimeOut: extensionState.callTimeOut,
        callgroup: extensionState.callGroup,
        callScreen: extensionState.callScreen,
        record: extensionState.record,
        domain: extensionState.domain,
        description: extensionState.desc,
        password: extensionState.password,
        moh:musicHold,
      };
      const apiData = await generalPostFunction("/extension/store", parseddata);
      if (apiData.status) {
        setExtensionState({
          extension: "",
          extensionMissing: false,
          voicePass: "",
          voicePassMissing: false,
          accountCode: "",
          accountCodeMissing: false,
          effCallerIdName: "",
          effCallerIdNameMissing: false,
          effCallerIdNumber: "",
          effCallerIdNumberMissing: false,
          outCallerIdName: "",
          outCallerIdNameMissing: false,
          outCallerIdNumber: "",
          outCallerIdNumberMissing: false,
          emeCallerIdName: "",
          emeCallerIdNameMissing: false,
          emeCallerIdNumber: "",
          emeCallerIdNumberMissing: false,
          dirFullName: "",
          dirFullNameMissing: false,
          dirVisible: "",
          dirVisibleMissing: false,
          dirExtensionVisible: "true",
          dirExtensionVisibleMissing: false,
          maxRegistration: "",
          maxRegistrationMissing: false,
          limitMax: "",
          limitMaxMissing: false,
          limitDest: "",
          limitDestMissing: false,
          voiceMailEnable: "N",
          voiceMailEnableMissing: false,
          voiceEmailTo: "",
          voiceEmailToMissing: false,
          voiceMialFile: "",
          voiceMialFileMissing: false,
          voiceMailKeepFile: "false",
          voiceMailKeepFileMissing: false,
          missedCall: "none",
          missedCallMissing: false,
          toAllowValue: "",
          toAllowValueMissing: false,
          callTimeOut: "",
          callTimeOutMissing: false,
          callGroup: "",
          callGroupMissing: false,
          callScreen: "Disable",
          callScreenMissing: false,
          record: "A",
          recordMissing: false,
          domain: "",
          domainMissing: false,
          desc: "",
          descMissing: false,
          password: "",
          passwordMising: false,
        });
        setLoading(false);
        toast.success(apiData.message);
      } else {
        setLoading(false);
        const errorMessage = Object.keys(apiData.error);
        toast.error(apiData.error[errorMessage[0]][0]);
      }
    }
  }
  return (
    <main className="mainContent">
      <section id="phonePage">
        <div className="container-fluid px-0">
          <div className="row justify-content-center" id="subPageHeader">
            <div className="col-xl-6 my-auto">
              <h4 className="my-auto">Extension Add</h4>
            </div>
            <div className="col-xl-6 ps-2">
              <div className="d-flex justify-content-end">
                <button
                  effect="ripple"
                  className="panelButton"
                  onClick={() => {
                    navigate(-1);
                    backToTop();
                  }}
                >
                  Back
                </button>
                <button
                  effect="ripple"
                  className="panelButton"
                  onClick={handleSubmit}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-12">
          {loading ? (
            <div colSpan={99}>
              <CircularLoader />
            </div>
          ) : (
            ""
          )}
          <div className="mx-2" id="detailsContent">
            <form action="#" className="row">
              <div className="formRow col-xl-3">
                <div className="formLabel">
                  <label htmlFor="">Extension</label>
                  {!extensionState.extensionMissing ? (
                    ""
                  ) : (
                    <label className="status missing">Field missing</label>
                  )}
                </div>
                <div className="col-12">
                  <input
                    type="text"
                    name="extension"
                    className="formItem"
                    value={extensionState.extension}
                    required="required"
                    onChange={(e) => {
                      setExtensionState((prevState) => ({
                        ...prevState,
                        extension: e.target.value,
                      }));
                    }}
                  />
                  <br />
                  <label htmlFor="data" className="formItemDesc">
                    Enter the alphanumeric extension. The default configuration
                    allows 2 - 15 digit extensions.
                  </label>
                </div>
              </div>
              <div className="formRow col-xl-3">
                <div className="formLabel">
                  <label htmlFor="">Password</label>
                  {!extensionState.passwordMising ? (
                    ""
                  ) : (
                    <label className="status missing">Invalid Password</label>
                  )}
                </div>
                <div className="col-12">
                  <input
                    type="text"
                    name="extension"
                    className="formItem"
                    value={extensionState.password}
                    required="required"
                    onChange={(e) => {
                      setExtensionState((prevState) => ({
                        ...prevState,
                        password: e.target.value,
                      }));
                    }}
                  />
                  <br />
                  <label htmlFor="data" className="formItemDesc">
                    Password length must be atleast 4 character
                  </label>
                </div>
              </div>
              <div className="formRow col-xl-3">
                <div className="formLabel">
                  <label htmlFor="selectFormRow">Domain</label>
                  {!extensionState.domainMissing ? (
                    ""
                  ) : (
                    <label className="status missing">Field missing</label>
                  )}
                </div>
                <div className="col-12">
                  <select
                    className="formItem"
                    name=""
                    id="selectFormRow"
                    value={extensionState.domain}
                    onChange={(e) => {
                      setExtensionState((prevState) => ({
                        ...prevState,
                        domain: e.target.value,
                      }));
                    }}
                  >
                    <option>Select Domain</option>
                    {domains &&
                      domains.map((item, key) => {
                        return (
                          <option key={key} value={item[0]}>
                            {item[1]}
                          </option>
                        );
                      })}
                  </select>
                  <br />
                  <label htmlFor="data" className="formItemDesc">
                    Select the Domain.
                  </label>
                </div>
              </div>
              <div className="formRow col-xl-3">
                <div className="formLabel">
                  <label htmlFor="">Voicemail Password</label>
                  {!extensionState.voicePassMissing ? (
                    ""
                  ) : (
                    <label className="status missing">
                      Password length must be greater than 3
                    </label>
                  )}
                </div>
                <div className="col-12">
                  <input
                    type="text"
                    name="extension"
                    className="formItem"
                    value={extensionState.voicePass}
                    required="required"
                    onChange={(e) => {
                      setExtensionState((prevState) => ({
                        ...prevState,
                        voicePass: e.target.value,
                      }));
                    }}
                  />
                  <br />
                  <label htmlFor="data" className="formItemDesc">
                    Enter the numeric voicemail password here.
                  </label>
                </div>
              </div>

              <div className="formRow col-xl-3">
                <div className="formLabel">
                  <label htmlFor="">Music on Hold</label>
                </div>
                <div className="col-12">
                  <select
                    // value={callCenter.musicHold}
                    onChange={(e) => {
                      setMusicHold(e.target.value);
                    }}
                    className="formItem w-100"
                  >
                    <option></option>
                    {music &&
                      music.map((item, index) => {
                        return (
                          <option key={index} value={item.id}>
                            {item.name}
                          </option>
                        );
                      })}
                    {/* <option>test</option> */}
                  </select>
                  <br />
                  <label htmlFor="data" className="formItemDesc">
                    Select the desired hold music.
                  </label>
                </div>
              </div>
              <div className="formRow col-xl-3">
                <div className="formLabel">
                  <label htmlFor="">Account Code</label>
                  {!extensionState.accountCodeMissing ? (
                    ""
                  ) : (
                    <label className="status missing">Field missing</label>
                  )}
                </div>
                <div className="col-12">
                  <input
                    type="text"
                    name="extension"
                    className="formItem"
                    value={extensionState.accountCode}
                    required="required"
                    onChange={(e) => {
                      setExtensionState((prevState) => ({
                        ...prevState,
                        accountCode: e.target.value,
                      }));
                    }}
                  />
                  <br />
                  <label htmlFor="data" className="formItemDesc">
                    Enter the account code here.
                  </label>
                </div>
              </div>
              <div className="formRow col-xl-3">
                <div className="formLabel">
                  <label htmlFor="">Effective Caller ID Name</label>
                  {!extensionState.effCallerIdNameMissing ? (
                    ""
                  ) : (
                    <label className="status missing">Field missing</label>
                  )}
                </div>
                <div className="col-12">
                  <input
                    type="text"
                    name="extension"
                    className="formItem"
                    value={extensionState.effCallerIdName}
                    required="required"
                    onChange={(e) => {
                      setExtensionState((prevState) => ({
                        ...prevState,
                        effCallerIdName: e.target.value,
                      }));
                    }}
                  />
                  <br />
                  <label htmlFor="data" className="formItemDesc">
                    Enter the internal caller ID name here.
                  </label>
                </div>
              </div>
              <div className="formRow col-xl-3">
                <div className="formLabel">
                  <label htmlFor="">Effective Caller ID Number</label>
                  {!extensionState.effCallerIdNumberMissing ? (
                    ""
                  ) : (
                    <label className="status missing">Field missing</label>
                  )}
                </div>
                <div className="col-12">
                  <input
                    type="text"
                    name="extension"
                    className="formItem"
                    value={extensionState.effCallerIdNumber}
                    required="required"
                    onChange={(e) => {
                      setExtensionState((prevState) => ({
                        ...prevState,
                        effCallerIdNumber: e.target.value,
                      }));
                    }}
                  />
                  <br />
                  <label htmlFor="data" className="formItemDesc">
                    Enter the internal caller ID number here.
                  </label>
                </div>
              </div>
              <div className="formRow col-xl-3">
                <div className="formLabel">
                  <label htmlFor="">Outbound Caller ID Name</label>
                  {!extensionState.outCallerIdNameMissing ? (
                    ""
                  ) : (
                    <label className="status missing">Field missing</label>
                  )}
                </div>
                <div className="col-12">
                  <input
                    type="text"
                    name="extension"
                    className="formItem"
                    value={extensionState.outCallerIdName}
                    required="required"
                    onChange={(e) => {
                      setExtensionState((prevState) => ({
                        ...prevState,
                        outCallerIdName: e.target.value,
                      }));
                    }}
                  />
                  <br />
                  <label htmlFor="data" className="formItemDesc">
                    Enter the external (public) caller ID name here.
                  </label>
                </div>
              </div>
              <div className="formRow col-xl-3">
                <div className="formLabel">
                  <label htmlFor="">Outbound Caller ID Number</label>
                  {!extensionState.outCallerIdNumberMissing ? (
                    ""
                  ) : (
                    <label className="status missing">Field missing</label>
                  )}
                </div>
                <div className="col-12">
                  <input
                    type="text"
                    name="extension"
                    className="formItem"
                    value={extensionState.outCallerIdNumber}
                    required="required"
                    onChange={(e) => {
                      setExtensionState((prevState) => ({
                        ...prevState,
                        outCallerIdNumber: e.target.value,
                      }));
                    }}
                  />
                  <br />
                  <label htmlFor="data" className="formItemDesc">
                    Enter the external (public) caller ID number here.
                  </label>
                </div>
              </div>
              <div className="formRow col-xl-3">
                <div className="formLabel">
                  <label htmlFor="">Emergency Caller ID Name</label>
                  {!extensionState.emeCallerIdNameMissing ? (
                    ""
                  ) : (
                    <label className="status missing">Field missing</label>
                  )}
                </div>
                <div className="col-12">
                  <input
                    type="text"
                    name="extension"
                    className="formItem"
                    value={extensionState.emeCallerIdName}
                    required="required"
                    onChange={(e) => {
                      setExtensionState((prevState) => ({
                        ...prevState,
                        emeCallerIdName: e.target.value,
                      }));
                    }}
                  />
                  <br />
                  <label htmlFor="data" className="formItemDesc">
                    Enter the emergency caller ID name here.
                  </label>
                </div>
              </div>
              <div className="formRow col-xl-3">
                <div className="formLabel">
                  <label htmlFor="">Emergency Caller ID Number</label>
                  {!extensionState.emeCallerIdNumberMissing ? (
                    ""
                  ) : (
                    <label className="status missing">Field missing</label>
                  )}
                </div>
                <div className="col-12">
                  <input
                    type="text"
                    name="extension"
                    className="formItem"
                    value={extensionState.emeCallerIdNumber}
                    required="required"
                    onChange={(e) => {
                      setExtensionState((prevState) => ({
                        ...prevState,
                        emeCallerIdNumber: e.target.value,
                      }));
                    }}
                  />
                  <br />
                  <label htmlFor="data" className="formItemDesc">
                    Enter the emergency caller ID number here.
                  </label>
                </div>
              </div>
              <div className="formRow col-xl-3">
                <div className="formLabel">
                  <label htmlFor="">Directory Full Name</label>
                  {!extensionState.dirFullNameMissing ? (
                    ""
                  ) : (
                    <label className="status missing">Field missing</label>
                  )}
                </div>
                <div className="col-12">
                  <input
                    type="text"
                    name="extension"
                    className="formItem"
                    value={extensionState.dirFullName}
                    required="required"
                    onChange={(e) => {
                      setExtensionState((prevState) => ({
                        ...prevState,
                        dirFullName: e.target.value,
                      }));
                    }}
                  />

                  <br />
                  <label htmlFor="data" className="formItemDesc">
                    Enter the first name followed by the last name.
                  </label>
                </div>
              </div>
              <div className="formRow col-xl-3">
                <div className="formLabel">
                  <label htmlFor="selectFormRow">
                    Directory Extension Visible
                  </label>
                  {!extensionState.dirExtensionVisibleMissing ? (
                    ""
                  ) : (
                    <label className="status missing">Field missing</label>
                  )}
                </div>
                <div className="col-12">
                  <select
                    className="formItem"
                    name=""
                    id="selectFormRow"
                    value={extensionState.dirExtensionVisible}
                    required="required"
                    onChange={(e) => {
                      setExtensionState((prevState) => ({
                        ...prevState,
                        dirExtensionVisible: e.target.value,
                      }));
                    }}
                  >
                    <option value="true">True</option>
                    <option value="false">False</option>
                  </select>
                  <br />
                  <label htmlFor="data" className="formItemDesc">
                    Select whether announce the extension when calling the
                    directory.
                  </label>
                </div>
              </div>
              <div className="formRow col-xl-3">
                <div className="formLabel">
                  <label htmlFor="selectFormRow">Max Registrations</label>
                  {!extensionState.maxRegistrationMissing ? (
                    ""
                  ) : (
                    <label className="status missing">Field missing</label>
                  )}
                </div>
                <div className="col-12">
                  <input
                    type="number"
                    name="extension"
                    className="formItem"
                    value={extensionState.maxRegistration}
                    required="required"
                    onChange={(e) => {
                      setExtensionState((prevState) => ({
                        ...prevState,
                        maxRegistration: e.target.value,
                      }));
                    }}
                  />
                  <br />
                  <label htmlFor="data" className="formItemDesc">
                    Enter the maximum concurrent registrations allowed.
                  </label>
                </div>
              </div>
              <div className="formRow col-xl-3">
                <div className="formLabel">
                  <label htmlFor="selectFormRow">Limit Max</label>
                  {!extensionState.limitDestMissing ? (
                    ""
                  ) : (
                    <label className="status missing">Field missing</label>
                  )}
                </div>
                <div className="col-12">
                  <input
                    type="number"
                    name="extension"
                    className="formItem"
                    value={extensionState.limitMax}
                    required="required"
                    onChange={(e) => {
                      setExtensionState((prevState) => ({
                        ...prevState,
                        limitMax: e.target.value,
                      }));
                    }}
                  />
                  <br />
                  <label htmlFor="data" className="formItemDesc">
                    Enter the maximum number of concurrent outbound calls
                    allowed.
                  </label>
                </div>
              </div>
              <div className="formRow col-xl-3">
                <div className="formLabel">
                  <label htmlFor="selectFormRow">Limit Destination</label>
                  {!extensionState.limitDestMissing ? (
                    ""
                  ) : (
                    <label className="status missing">Field missing</label>
                  )}
                </div>
                <div className="col-12">
                  <input
                    type="number"
                    name="extension"
                    className="formItem"
                    value={extensionState.limitDest}
                    required="required"
                    onChange={(e) => {
                      setExtensionState((prevState) => ({
                        ...prevState,
                        limitDest: e.target.value,
                      }));
                    }}
                  />
                  <br />
                  <label htmlFor="data" className="formItemDesc">
                    Enter the destination to send the calls when the max number
                    of outgoing calls has been reached.
                  </label>
                </div>
              </div>
              <div className="formRow col-xl-3">
                <div className="formLabel">
                  <label htmlFor="selectFormRow">Voicemail Enabled</label>
                  {!extensionState.voiceMailEnableMissing ? (
                    ""
                  ) : (
                    <label className="status missing">Field missing</label>
                  )}
                </div>
                <div className="col-12">
                  <select
                    className="formItem"
                    name=""
                    id="selectFormRow"
                    value={extensionState.voiceMailEnable}
                    required="required"
                    onChange={(e) => {
                      setExtensionState((prevState) => ({
                        ...prevState,
                        voiceMailEnable: e.target.value,
                      }));
                    }}
                  >
                    <option value="Y">True</option>
                    <option value="N">False</option>
                  </select>
                  <br />
                  <label htmlFor="data" className="formItemDesc">
                    Enable/disable voicemail for this extension.
                  </label>
                </div>
              </div>
              <div className="formRow col-xl-3">
                <div className="formLabel">
                  <label htmlFor="selectFormRow">Voicemail Mail To</label>
                  {!extensionState.voiceEmailToMissing ? (
                    ""
                  ) : (
                    <label className="status missing">Field missing</label>
                  )}
                </div>
                <div className="col-12">
                  <input
                    type="text"
                    name="extension"
                    className="formItem"
                    value={extensionState.voiceEmailTo}
                    required="required"
                    onChange={(e) => {
                      setExtensionState((prevState) => ({
                        ...prevState,
                        voiceEmailTo: e.target.value,
                      }));
                    }}
                  />
                  <br />
                  <label htmlFor="data" className="formItemDesc">
                    Enter the email address to send voicemail to (optional).
                  </label>
                </div>
              </div>
              <div className="formRow col-xl-3">
                <div className="formLabel">
                  <label htmlFor="selectFormRow">Voicemail File</label>
                  {!extensionState.voiceMialFileMissing ? (
                    ""
                  ) : (
                    <label className="status missing">Field missing</label>
                  )}
                </div>
                <div className="col-12">
                  <select
                    className="formItem"
                    name=""
                    id="selectFormRow"
                    value={extensionState.voiceMialFile}
                    required="required"
                    onChange={(e) => {
                      setExtensionState((prevState) => ({
                        ...prevState,
                        voiceMialFile: e.target.value,
                      }));
                    }}
                  >
                    <option>Select Voicemail File</option>
                    <option value="audio">Audio File Attachment</option>
                    <option value="listen">Listen Link (Login Required)</option>
                    <option value="download">
                      Download Link (No Login Required)
                    </option>
                  </select>
                  <br />
                  <label htmlFor="data" className="formItemDesc">
                    Select a listening option to include with the email
                    notification.
                  </label>
                </div>
              </div>
              <div className="formRow col-xl-3">
                <div className="formLabel">
                  <label htmlFor="selectFormRow">Voicemail Keep Local</label>
                  {!extensionState.voiceMailKeepFileMissing ? (
                    ""
                  ) : (
                    <label className="status missing">Field missing</label>
                  )}
                </div>

                <div className="col-12">
                  <select
                    className="formItem"
                    name=""
                    id="selectFormRow"
                    value={extensionState.voiceMailKeepFile}
                    required="required"
                    onChange={(e) => {
                      setExtensionState((prevState) => ({
                        ...prevState,
                        voiceMailKeepFile: e.target.value,
                      }));
                    }}
                  >
                    <option value="true">True</option>
                    <option value="false">False</option>
                  </select>
                  <br />
                  <label htmlFor="data" className="formItemDesc">
                    Choose whether to keep the voicemail in the system after
                    sending the email notification.
                  </label>
                </div>
              </div>
              <div className="formRow col-xl-3">
                <div className="formLabel">
                  <label htmlFor="selectFormRow">Missed Call</label>
                  {!extensionState.missedCallMissing ? (
                    ""
                  ) : (
                    <label className="status missing">Field missing</label>
                  )}
                </div>
                <div className="col-12">
                  <select
                    className="formItem"
                    name=""
                    id="selectFormRow"
                    value={extensionState.missedCall}
                    required="required"
                    onChange={(e) => {
                      setExtensionState((prevState) => ({
                        ...prevState,
                        missedCall: e.target.value,
                      }));
                    }}
                  >
                    <option value="email">Email</option>
                    <option value="none">None</option>
                  </select>
                  <br />
                  <label htmlFor="data" className="formItemDesc">
                    Select the notification type, and enter the appropriate
                    destination.
                  </label>
                </div>
              </div>
              <div className="formRow col-xl-3">
                <div className="formLabel">
                  <label htmlFor="selectFormRow">Toll Allow</label>
                  {!extensionState.toAllowValueMissing ? (
                    ""
                  ) : (
                    <label className="status missing">Field missing</label>
                  )}
                </div>
                <div className="col-12">
                  <input
                    type="text"
                    name="extension"
                    className="formItem"
                    value={extensionState.toAllowValue}
                    required="required"
                    onChange={(e) => {
                      setExtensionState((prevState) => ({
                        ...prevState,
                        toAllowValue: e.target.value,
                      }));
                    }}
                  />
                  <br />
                  <label htmlFor="data" className="formItemDesc">
                    Enter the toll allow value here. (Examples:
                    domestic,international,local).
                  </label>
                </div>
              </div>
              <div className="formRow col-xl-3">
                <div className="formLabel">
                  <label htmlFor="selectFormRow">Call Timeout</label>
                  {!extensionState.callTimeOutMissing ? (
                    ""
                  ) : (
                    <label className="status missing">Field missing</label>
                  )}
                </div>
                <div className="col-12">
                  <input
                    type="number"
                    name="extension"
                    className="formItem"
                    value={extensionState.callTimeOut}
                    required="required"
                    onChange={(e) => {
                      setExtensionState((prevState) => ({
                        ...prevState,
                        callTimeOut: e.target.value,
                      }));
                    }}
                  />
                  <br />
                  <label htmlFor="data" className="formItemDesc">
                    Enter the ring time (delay in seconds) before sending a call
                    to voicemail.
                  </label>
                </div>
              </div>
              <div className="formRow col-xl-3">
                <div className="formLabel">
                  <label htmlFor="selectFormRow">Call Group</label>
                  {!extensionState.callGroupMissing ? (
                    ""
                  ) : (
                    <label className="status missing">Field missing</label>
                  )}
                </div>
                <div className="col-12">
                  <input
                    type="text"
                    name="extension"
                    className="formItem"
                    value={extensionState.callGroup}
                    required="required"
                    onChange={(e) => {
                      setExtensionState((prevState) => ({
                        ...prevState,
                        callGroup: e.target.value,
                      }));
                    }}
                  />
                  <br />
                  <label htmlFor="data" className="formItemDesc">
                    Enter the user call group here. Groups available by default:
                    sales, support, billing.
                  </label>
                </div>
              </div>
              <div className="formRow col-xl-3">
                <div className="formLabel">
                  <label htmlFor="selectFormRow">Call Screen</label>
                  {!extensionState.callScreenMissing ? (
                    ""
                  ) : (
                    <label className="status missing">Field missing</label>
                  )}
                </div>
                <div className="col-12">
                  <select
                    className="formItem"
                    name=""
                    id="selectFormRow"
                    value={extensionState.callScreen}
                    required="required"
                    onChange={(e) => {
                      setExtensionState((prevState) => ({
                        ...prevState,
                        callScreen: e.target.value,
                      }));
                    }}
                  >
                    <option value="Enable">Enable</option>
                    <option value="Disable">Disable</option>
                  </select>
                  <br />
                  <label htmlFor="data" className="formItemDesc">
                    Choose whether to enable or disable call screening.
                  </label>
                </div>
              </div>
              <div className="formRow col-xl-3">
                <div className="formLabel">
                  <label htmlFor="selectFormRow">Record</label>
                  {!extensionState.recordMissing ? (
                    ""
                  ) : (
                    <label className="status missing">Field missing</label>
                  )}
                </div>
                <div className="col-12">
                  <select
                    className="formItem"
                    name=""
                    id="selectFormRow"
                    value={extensionState.record}
                    required="required"
                    onChange={(e) => {
                      setExtensionState((prevState) => ({
                        ...prevState,
                        record: e.target.value,
                      }));
                    }}
                  >
                    <option value="D">Disabled</option>
                    <option value="A">All</option>
                    <option value="L">Local</option>
                    <option value="I">Inbound</option>
                    <option value="O">Outbound</option>
                  </select>
                  <br />
                  <label htmlFor="data" className="formItemDesc">
                    Choose whether to record local, inbound, outbound, or all.
                  </label>
                </div>
              </div>
              <div className="formRow col-xl-3">
                <div className="formLabel">
                  <label htmlFor="selectFormRow">Description</label>
                  {!extensionState.descMissing ? (
                    ""
                  ) : (
                    <label className="status missing">Field missing</label>
                  )}
                </div>
                <div className="col-12">
                  <input
                    type="text"
                    name="extension"
                    className="formItem"
                    value={extensionState.desc}
                    required="required"
                    onChange={(e) => {
                      setExtensionState((prevState) => ({
                        ...prevState,
                        desc: e.target.value,
                      }));
                    }}
                  />
                  <br />
                  <label htmlFor="data" className="formItemDesc">
                    Enter the description.
                  </label>
                </div>
              </div>
              <div />
            </form>
          </div>
        </div>
      </section>
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
    </main>
  );
};

export default ExtensionsAdd;
