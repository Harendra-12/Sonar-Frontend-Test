import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  backToTop,
  generalGetFunction,
  generalPutFunction,
} from "../../GlobalFunction/globalFunction";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useLocation } from "react-router-dom";
import CircularLoader from "../Misc/CircularLoader";

const ExtensionsEdit = () => {
  const navigate = useNavigate();
  const acount = useSelector((state) => state.account);
  const [domains, setDomains] = useState();
  const queryParams = new URLSearchParams(useLocation().search);
  const value = queryParams.get("id");
  const [users, setUsers] = useState();
  const [popUp, setPopUp] = useState(false);
  const [loading, setLoading] = useState(false);
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
    dirExtensionVisible: "",
    dirExtensionVisibleMissing: false,
    maxRegistration: "",
    maxRegistrationMissing: false,
    limitMax: "",
    limitMaxMissing: false,
    limitDest: "",
    limitDestMissing: false,
    voiceMailEnable: "",
    voiceMailEnableMissing: false,
    voiceEmailTo: "",
    voiceEmailToMissing: false,
    voiceMialFile: "",
    voiceMialFileMissing: false,
    voiceMailKeepFile: "",
    voiceMailKeepFileMissing: false,
    missedCall: "",
    missedCallMissing: false,
    toAllowValue: "",
    toAllowValueMissing: false,
    callTimeOut: "",
    callTimeOutMissing: false,
    callGroup: "",
    callGroupMissing: false,
    callScreen: "",
    callScreenMissing: false,
    record: "",
    recordMissing: false,
    domain: "",
    domainMissing: false,
    desc: "",
    descMissing: false,
    password: "",
    passwordMissing: false,
    user: "",
  });

  const account = useSelector((state) => state.account);
  useEffect(() => {
    setLoading(true);
    if (account === null) {
      navigate("/");
    } else {
      async function getDomain() {
        const domain = await generalGetFunction(
          `/domain/search?account=${account.account_id}`
        );
        const apidataUser = await generalGetFunction(
          `/user/search?account=${account.account_id}`
        );
        if (domain.status) {
          setDomains(
            domain.data.map((item) => {
              return [item.id, item.domain_name];
            })
          );
        } else {
          navigate("/");
        }

        if (apidataUser.status) {
          setUsers(apidataUser.data);
        } else {
          navigate("/");
        }
      }
      getDomain();
    }

    if (value) {
      async function getData() {
        const apiData = await generalGetFunction(`/extension/${value}`);
        if (apiData.status) {
          setLoading(false);
          setExtensionState((prevState) => ({
            ...prevState,
            extension: apiData.data.extension,
            voicePass: apiData.data.voicemail_password,
            accountCode: apiData.data.account_code,
            effCallerIdName: apiData.data.effectiveCallerIdName,
            effCallerIdNumber: apiData.data.effectiveCallerIdNumber,
            outCallerIdName: apiData.data.outbundCallerIdName,
            outCallerIdNumber: apiData.data.outbundCallerIdNumber,
            emeCallerIdName: apiData.data.emergencyCallerIdName,
            emeCallerIdNumber: apiData.data.emergencyCallerIdNumber,
            dirFullName: apiData.data.directoryFullname,
            dirExtensionVisible: apiData.data.directoryExtensionVisible,
            maxRegistration: apiData.data.maxRegistration,
            limitMax: apiData.data.limitMax,
            limitDest: apiData.data.limitDestinations,
            voiceMailEnable: apiData.data.voicemailEnabled,
            voiceEmailTo: apiData.data.voiceEmailTo,
            voiceMialFile: apiData.data.voiceMailFile,
            voiceMailKeepFile: apiData.data.voiceMailkeepFile,
            missedCall: apiData.data.missedCall,
            toAllowValue: apiData.data.tollAllowValue,
            callTimeOut: apiData.data.callTimeOut,
            callGroup: apiData.data.callgroup,
            callScreen: apiData.data.callScreen,
            record: apiData.data.record,
            domain: apiData.data.domain,
            desc: apiData.data.description,
            password: apiData.data.password,
            user: apiData.data.user,
          }));
        } else {
          setLoading(false);
          navigate("/");
        }
      }
      getData();
    } else {
      navigate("/");
    }
  }, [account, navigate, value]);
  // Handle validation and create store
  async function handleSubmit(title) {
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
      if (title === "force") {
        var parseddata = {
          account_id: acount.account_id,
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
          ...(extensionState.user === "" || extensionState.user === null
            ? {}
            : { user: extensionState.user }),
          forceUpdate: true,
        };
      } else {
        // eslint-disable-next-line no-redeclare
        var parseddata = {
          account_id: acount.account_id,
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
          ...(extensionState.user === "" || extensionState.user === null
            ? {}
            : { user: extensionState.user }),
        };
      }

      const apiData = await generalPutFunction(
        `/extension/${value}`,
        parseddata
      );
      if (apiData.status) {
        setLoading(false);

        toast.success(apiData.message);
      } else {
        setLoading(false);
        if (apiData.message === "Already assigned to a different user") {
          setPopUp(true);
        } else {
          toast.error(apiData.message);
        }
      }
    }
  }
  return (
    <main className="mainContent">
      <section id="phonePage">
        <div className="container-fluid">
          <div className="row justify-content-center">
            <div className="col-12" id="subPageHeader">
              <div className="row px-xl-3">
                <div className="col-xl-6 my-auto">
                  <h4 className="my-auto">Update Extension</h4>
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
                        disabled
                      />
                      <br />
                      <label htmlFor="data" className="formItemDesc">
                        Enter the alphanumeric extension. The default
                        configuration allows 2 - 15 digit extensions.
                      </label>
                    </div>
                  </div>
                  {/* <div className="formRow col-xl-3">
                    <div className="formLabel">
                      <label htmlFor="selectFormRow">Range</label>
                    </div>
                    <div className="col-12">
                      <select className="formItem" name="" id="selectFormRow">
                        <option>Select Range</option>
                        <option value={1}>1</option>
                        <option value={2}>2</option>
                        <option value={3}>3</option>
                      </select>
                      <br />
                      <label htmlFor="data" className="formItemDesc">
                        Enter the number of extensions to create. Increments
                        each extension by 1.
                      </label>
                    </div>
                  </div> */}
                  {/* <div className="formRow col-xl-3">
                    <div className="formLabel">
                      <label htmlFor="selectFormRow">User</label>
                    </div>
                    <div className="col-12">
                      <select className="formItem" name="" id="selectFormRow">
                        <option>Select User</option>
                        <option value="admin">Admin</option>
                        <option value='""' />
                      </select>
                      <br />
                      <label htmlFor="data" className="formItemDesc">
                        Assign users to this extension.
                      </label>
                    </div>
                  </div> */}
                  <div className="formRow col-xl-3">
                    <div className="formLabel">
                      <label htmlFor="">Password</label>
                      {!extensionState.passwordMising ? (
                        ""
                      ) : (
                        <label className="status missing">
                          Invalid Password
                        </label>
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
                        <option value="">Select Domain</option>
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
                          Password length must be greter than 3
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
                      <label htmlFor="">Select User</label>
                    </div>
                    <select
                      className="formItem"
                      value={extensionState.user}
                      onChange={(e) => {
                        setExtensionState((prevState) => ({
                          ...prevState,
                          user: e.target.value,
                        }));
                      }}
                      id="selectFormRow"
                    >
                      <option value="">Select User</option>
                      {users &&
                        users.map((item, key) => {
                          return (
                            <option key={key} value={item.id}>
                              {item.username}
                            </option>
                          );
                        })}
                    </select>
                    {/* <button className="panelButton" effect="ripple" type="button">
                                                Add
                                            </button> */}
                    <br />
                    <label htmlFor="data" className="formItemDesc">
                      Define users assigned to this Extension.
                    </label>
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
                  {/* <div className="formRow col-xl-3">
                    <div className="formLabel">
                      <label htmlFor="">Device Provisioning</label>
                    </div>
                    <div className="col-12">
                      <select
                        className="formItem w-auto"
                        name=""
                        id="selectFormRow"
                      >
                        <option />
                        <option value={1}>1</option>
                        <option value={2}>2</option>
                        <option value={3}>3</option>
                      </select>
                      <select className="formItem" name="" id="selectFormRow">
                        <option />
                        <option value="" />
                        <option value="" />
                      </select>
                      <select className="formItem" name="" id="selectFormRow">
                        <option />
                        <option value="aastra480i">aastra/480i</option>
                        <option value="aastra673x">aastra/673x</option>
                        <option value="aastra675x">aastra/675x</option>
                        <option value="aastra686x">aastra/686x</option>
                      </select>
                      <br />
                      <label htmlFor="data" className="formItemDesc">
                        Select a device and line number to assign to this
                        extension.
                      </label>
                    </div>
                  </div> */}
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
                        <option value="">Select Visibility</option>
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
                        Enter the destination to send the calls when the max
                        number of outgoing calls has been reached.
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
                        <option value="">Select Voicemail</option>
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
                  {/* <div className="formRow col-xl-3">
                    <div className="formLabel">
                      <label htmlFor="selectFormRow">
                        Transcription Enabled
                      </label>
                    </div>
                    <div className="col-12">
                      <select className="formItem" name="" id="selectFormRow">
                        <option>Select User</option>
                        <option value="true">True</option>
                        <option value="false">False</option>
                      </select>
                      <br />
                      <label htmlFor="data" className="formItemDesc">
                        Choose if voicemail transcription is enabled for this
                        extension.
                      </label>
                    </div>
                  </div> */}
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
                        <option value="">Select Voicemail File</option>
                        <option value="audio">Audio File Attachment</option>
                        <option value="listen">
                          Listen Link (Login Required)
                        </option>
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
                      <label htmlFor="selectFormRow">
                        Voicemail Keep Local
                      </label>
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
                        <option value="">Select User</option>
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
                        <option value="">Select Notification Type</option>
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
                        Enter the ring time (delay in seconds) before sending a
                        call to voicemail.
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
                        Enter the user call group here. Groups available by
                        default: sales, support, billing.
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
                        <option value="">Select Notification Type</option>
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
                        <option value="">Select Type</option>
                        <option value="D">Disabled</option>
                        <option value="A">All</option>
                        <option value="L">Local</option>
                        <option value="I">Inbound</option>
                        <option value="O">Outbound</option>
                      </select>
                      <br />
                      <label htmlFor="data" className="formItemDesc">
                        Choose whether to record local, inbound, outbound, or
                        all.
                      </label>
                    </div>
                  </div>
                  {/* <div className="formRow col-xl-3">
                    <div className="formLabel">
                      <label htmlFor="selectFormRow">Hold Music</label>
                    </div>
                    <div className="col-12">
                      <select className="formItem" name="" id="selectFormRow">
                        <option>Select MOH</option>
                        <option value="all">default</option>
                        <option value="local">none</option>
                      </select>
                      <br />
                      <label htmlFor="data" className="formItemDesc">
                        Select the MOH Category here.
                      </label>
                    </div>
                  </div>
                  <div className="formRow col-xl-3">
                    <div className="formLabel">
                      <label htmlFor="selectFormRow">Type</label>
                    </div>
                    <div className="col-12">
                      <select className="formItem" name="" id="selectFormRow">
                        <option>Select Type</option>
                        <option value="default">Default</option>
                        <option value="virtual">Virtual</option>
                      </select>
                      <br />
                      <label htmlFor="data" className="formItemDesc">
                        Select Default to enable registration or to disable
                        registration select Virtual.
                      </label>
                    </div>
                  </div> */}

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
                  {/* <div className="formRow col-xl-3">
                    <div className="formLabel">
                      <label htmlFor="selectFormRow">Context</label>
                    </div>
                    <div className="col-12">
                      <input
                        type="text"
                        name="extension"
                        id=""
                        className="formItem"
                        defaultValue="0.0.0.0"
                        required="required"
                      />
                      <br />
                      <label htmlFor="data" className="formItemDesc">
                        Enter the user context here.
                      </label>
                    </div>
                  </div> */}
                  {/* <div id="advancedOptions">
                                        <div className="formRow col-xl-3">
                                            <div className="formLabel">
                                                <label htmlFor="selectFormRow">Auth ACL</label>
                                            </div>
                                            <div className="col-12">
                                                <input
                                                    type="text"
                                                    name="extension"
                                                    id=""
                                                    className="formItem"
                                                    defaultValue=""
                                                    required="required"
                                                />
                                                <br />
                                                <label htmlFor="data" className="formItemDesc">
                                                    Enter the Auth ACL here.
                                                </label>
                                            </div>
                                        </div>
                                        <div className="formRow col-xl-3">
                                            <div className="formLabel">
                                                <label htmlFor="selectFormRow">CIDR</label>
                                            </div>
                                            <div className="col-12">
                                                <input
                                                    type="text"
                                                    name="extension"
                                                    id=""
                                                    className="formItem"
                                                    defaultValue=""
                                                    required="required"
                                                />
                                                <br />
                                                <label htmlFor="data" className="formItemDesc">
                                                    Enter allowed address/ranges in CIDR notation (comma
                                                    separated).
                                                </label>
                                            </div>
                                        </div>
                                        <div className="formRow col-xl-3">
                                            <div className="formLabel">
                                                <label htmlFor="selectFormRow">SIP Force Contact</label>
                                            </div>
                                            <div className="col-12">
                                                <select className="formItem" name="" id="selectFormRow">
                                                    <option >Choose to rewrite</option>
                                                    <option value="NDLB-connectile-dysfunction">
                                                        Rewrite Contact IP and Port
                                                    </option>
                                                    <option value="NDLB-connectile-dysfunction-2.0">
                                                        Rewrite Contact IP and Port 2.0
                                                    </option>
                                                    <option value="NDLB-tls-connectile-dysfunction">
                                                        Rewrite TLS and Port
                                                    </option>
                                                </select>
                                                <br />
                                                <label htmlFor="data" className="formItemDesc">
                                                    Choose whether to rewrite the contact port, or rewrite
                                                    both the contact IP and port.
                                                </label>
                                            </div>
                                        </div>
                                        <div className="formRow col-xl-3">
                                            <div className="formLabel">
                                                <label htmlFor="selectFormRow">SIP Force Expires</label>
                                            </div>
                                            <div className="col-12">
                                                <input
                                                    type="text"
                                                    name="extension"
                                                    id=""
                                                    className="formItem"
                                                    defaultValue=""
                                                    required="required"
                                                />
                                                <br />
                                                <label htmlFor="data" className="formItemDesc">
                                                    To prevent stale registrations SIP Force expires can
                                                    override the client expire.
                                                </label>
                                            </div>
                                        </div>
                                        <div className="formRow col-xl-3">
                                            <div className="formLabel">
                                                <label htmlFor="selectFormRow">MWI Account</label>
                                            </div>
                                            <div className="col-12">
                                                <input
                                                    type="text"
                                                    name="extension"
                                                    id=""
                                                    className="formItem"
                                                    defaultValue=""
                                                    required="required"
                                                />
                                                <br />
                                                <label htmlFor="data" className="formItemDesc">
                                                    MWI Account with user@domain of the voicemail to monitor.
                                                </label>
                                            </div>
                                        </div>
                                        <div className="formRow col-xl-3">
                                            <div className="formLabel">
                                                <label htmlFor="selectFormRow">SIP Bypass Media</label>
                                            </div>
                                            <div className="col-12">
                                                <select className="formItem" name="" id="selectFormRow">
                                                    <option >Choose Media Stream</option>
                                                    <option value="NDLB-connectile-dysfunction">
                                                        Bypass Media
                                                    </option>
                                                    <option value="NDLB-connectile-dysfunction-2.0">
                                                        Bypass Media After Bridge
                                                    </option>
                                                    <option value="NDLB-tls-connectile-dysfunction">
                                                        Proxy Media
                                                    </option>
                                                </select>
                                                <br />
                                                <label htmlFor="data" className="formItemDesc">
                                                    Choose whether to send the media stream point to point or
                                                    in transparent proxy mode.
                                                </label>
                                            </div>
                                        </div>
                                        <div className="formRow col-xl-3">
                                            <div className="formLabel">
                                                <label htmlFor="selectFormRow">Absolute Codec String</label>
                                            </div>
                                            <div className="col-12">
                                                <input
                                                    type="text"
                                                    name="extension"
                                                    id=""
                                                    className="formItem"
                                                    defaultValue=""
                                                    required="required"
                                                />
                                                <br />
                                                <label htmlFor="data" className="formItemDesc">
                                                    Absolute Codec String for the extension.
                                                </label>
                                            </div>
                                        </div>
                                        <div className="formRow col-xl-3">
                                            <div className="formLabel">
                                                <label htmlFor="selectFormRow">Force ping</label>
                                            </div>
                                            <div className="col-12">
                                                <select className="formItem" name="" id="selectFormRow">
                                                    <option >Choose Media Stream</option>
                                                    <option value="true">True</option>
                                                    <option value="false">False</option>
                                                </select>
                                                <br />
                                                <label htmlFor="data" className="formItemDesc">
                                                    Use OPTIONS to detect if extension is reacheable.
                                                </label>
                                            </div>
                                        </div>
                                        <div className="formRow col-xl-3">
                                            <div className="formLabel">
                                                <label htmlFor="selectFormRow">Dial String</label>
                                            </div>
                                            <div className="col-12">
                                                <input
                                                    type="text"
                                                    name="extension"
                                                    id=""
                                                    className="formItem"
                                                    defaultValue=""
                                                    required="required"
                                                />
                                                <br />
                                                <label htmlFor="data" className="formItemDesc">
                                                    Location of the endpoint.
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="formRow flex-row-reverse col-xl-3">
                                        <div className="col-12">
                                            <div className="formLabel">
                                                <button
                                                    className="panelButton"
                                                    type="button"
                                                    effect="ripple"
                                                    id="advancedOptionsButton"
                                                >
                                                    <i className="fa-duotone fa-screwdriver-wrench" />{" "}
                                                    Advanced
                                                </button>
                                            </div>
                                        </div>
                                    </div> */}
                  {/* <div className="formRow d-flex align-items-center col-xl-3">
                    <div className="formLabel">
                      <label htmlFor="selectFormRow">Enabled</label>
                    </div>
                    <div className="col-2 ms-2">
                      <div className="my-auto position-relative mx-1">
                        <label className="switch">
                          <input type="checkbox" id="showAllCheck" />
                          <span className="slider round" />
                        </label>
                      </div>
                    </div>
                  </div> */}
                  <div />
                </form>
              </div>
            </div>
          </div>
        </div>

        {popUp ? (
          <div className="popup">
            <div className="container h-100">
              <div className="row h-100 justify-content-center align-items-center">
                <div className="row content col-xl-4">
                  <div className="col-2 px-0">
                    <div className="iconWrapper">
                      <i className="fa-duotone fa-triangle-exclamation"></i>
                    </div>
                  </div>
                  <div className="col-10 ps-0">
                    <h4>Warning!</h4>
                    <p>
                      Are you sure you want to assign this extension to user{" "}
                      {users &&
                        // eslint-disable-next-line array-callback-return
                        users.map((item) => {
                          // eslint-disable-next-line eqeqeq
                          if (item.id == extensionState.user) {
                            return item.username;
                          }
                        })}
                      ?
                    </p>
                    <button
                      className="panelButton m-0"
                      onClick={() => {
                        // setForce(true);
                        setPopUp(false);
                        handleSubmit("force");
                      }}
                    >
                      Confirm
                    </button>
                    <button
                      className="panelButtonWhite m-0 float-end"
                      onClick={() => setPopUp(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          ""
        )}
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

export default ExtensionsEdit;
