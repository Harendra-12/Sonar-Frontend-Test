import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  backToTop,
  generalGetFunction,
  generalPutFunction,
} from "../../GlobalFunction/globalFunction";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";

import { useLocation } from "react-router-dom";
import CircularLoader from "../../Loader/CircularLoader";
import Header from "../../CommonComponents/Header";
import { useForm } from "react-hook-form";
import {
  emailValidator,
  lengthValidator,
  noSpecialCharactersValidator,
  numberValidator,
  requiredValidator,
  restrictToAllowedChars,
  restrictToNumbers,
} from "../../validations/validation";
import ErrorMessage from "../../CommonComponents/ErrorMessage";
import Tippy from "@tippyjs/react";

const ExtensionsEdit = () => {
  const navigate = useNavigate();
  const acount = useSelector((state) => state.account);
  // const domain = useSelector((state) => state.domain);
  // const { id: domainId = "" } = domain;
  // const [domains, setDomains] = useState();
  const queryParams = new URLSearchParams(useLocation().search);
  const value = queryParams.get("id");
  const [users, setUsers] = useState();
  const [popUp, setPopUp] = useState(false);
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

  const {
    register,
    watch,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm();

  const account = useSelector((state) => state.account);
  useEffect(() => {
    setLoading(true);
    if (account === null) {
      navigate("/");
    } else {
      async function getDomain() {
        // const domain = await generalGetFunction(
        //   `/domain/search?account=${account.account_id}`
        // );
        const apidataUser = await generalGetFunction(
          `/user/search?account=${account.account_id}`
        );
        const musicData = await generalGetFunction("/sound/all?type=hold");
        if (musicData?.status) {
          setMusic(musicData.data);
        }
        // if (domain.status) {
        //   setDomains(
        //     domain.data.map((item) => {
        //       return [item.id, item.domain_name];
        //     })
        //   );
        // } else {
        //   navigate("/");
        // }

        if (apidataUser?.status) {
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
        if (apiData?.status) {
          setLoading(false);

          const resetInfo = {
            account_code: apiData.data.account_code,
            callgroup: apiData.data.callgroup,
            callScreen: apiData.data.callScreen,
            callTimeOut: apiData.data.callTimeOut,
            description: apiData.data.description,
            directoryExtensionVisible: apiData.data.directoryExtensionVisible,
            directoryFullname: apiData.data.directoryFullname,
            effectiveCallerIdName: apiData.data.effectiveCallerIdName,
            effectiveCallerIdNumber: apiData.data.effectiveCallerIdNumber,
            emergencyCallerIdName: apiData.data.emergencyCallerIdName,
            emergencyCallerIdNumber: apiData.data.emergencyCallerIdNumber,
            extension: apiData.data.extension,
            limitDestinations: apiData.data.limitDestinations,
            limitMax: apiData.data.limitMax,
            maxRegistration: apiData.data.maxRegistration,
            missedCall: apiData.data.missedCall,
            moh: apiData.data.moh_sound,
            outbundCallerIdName: apiData.data.outbundCallerIdName,
            outbundCallerIdNumber: apiData.data.outbundCallerIdNumber,
            password: apiData.data.password,
            record: apiData.data.record,
            tollAllowValue: apiData.data.tollAllowValue,
            user: apiData.data.user,
            voiceEmailTo: apiData.data.voiceEmailTo,
            voiceMailFile: apiData.data.voiceMailFile,
            voiceMailkeepFile: apiData.data.voiceMailkeepFile,
            voicemailEnabled: apiData.data.voicemailEnabled,
            voicemail_password: apiData.data.voicemail_password,
          };

          reset(resetInfo);

          setMusicHold(apiData.data.moh);
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

  const handleFormSubmit = handleSubmit(async (data, title) => {
    setLoading(true);
    try {
      if (title === "force") {
        var parsedData = {
          account_id: acount.account_id,
          voicemail_password: data.voicemail_password,
          account_code: data.account_code,
          effectiveCallerIdName: data.effectiveCallerIdName,
          effectiveCallerIdNumber: data.effectiveCallerIdNumber,
          outbundCallerIdName: data.outbundCallerIdName,
          outbundCallerIdNumber: data.outbundCallerIdNumber,
          emergencyCallerIdName: data.emergencyCallerIdName,
          emergencyCallerIdNumber: data.emergencyCallerIdNumber,
          directoryFullname: data.directoryFullname,
          directoryExtensionVisible: data.directoryExtensionVisible,
          maxRegistration: data.maxRegistration,
          limitMax: data.limitMax,
          limitDestinations: data.limitDestinations,
          voicemailEnabled: data.voicemailEnabled,
          voiceEmailTo: data.voiceEmailTo,
          voiceMailFile: data.voiceMailFile,
          voiceMailkeepFile: data.voiceMailkeepFile,
          missedCall: data.missedCall,
          tollAllowValue: data.tollAllowValue,
          callTimeOut: data.callTimeOut,
          callgroup: data.callgroup,
          callScreen: data.callScreen,
          record: data.record,
          // domain: `${domainId}`,
          description: data.description,
          // moh: data.moh,
          password: data.password,
          ...(data.user === "" || data.user === null
            ? {}
            : { user: data.user }),
          forceUpdate: true,
        };
      } else {
        // eslint-disable-next-line no-redeclare
        var parsedData = {
          account_id: acount.account_id,
          voicemail_password: data.voicemail_password,
          account_code: data.account_code,
          effectiveCallerIdName: data.effectiveCallerIdName,
          effectiveCallerIdNumber: data.effectiveCallerIdNumber,
          outbundCallerIdName: data.outbundCallerIdName,
          outbundCallerIdNumber: data.outbundCallerIdNumber,
          emergencyCallerIdName: data.emergencyCallerIdName,
          emergencyCallerIdNumber: data.emergencyCallerIdNumber,
          directoryFullname: data.directoryFullname,
          directoryExtensionVisible: data.directoryExtensionVisible,
          maxRegistration: data.maxRegistration,
          limitMax: data.limitMax,
          limitDestinations: data.limitDestinations,
          voicemailEnabled: data.voicemailEnabled,
          voiceEmailTo: data.voiceEmailTo,
          voiceMailFile: data.voiceMailFile,
          voiceMailkeepFile: data.voiceMailkeepFile,
          missedCall: data.missedCall,
          tollAllowValue: data.tollAllowValue,
          callTimeOut: data.callTimeOut,
          callgroup: data.callgroup,
          callScreen: data.callScreen,
          record: data.record,
          // domain: `${domainId}`,
          description: data.description,
          password: data.password,
          ...(data.user === "" || data.user === null
            ? {}
            : { user: data.user }),
        };
      }
      // const parsedData = {
      //   account_id: acount.account_id,
      //   voicemail_password: data.voicemail_password,
      //   account_code: data.account_code,
      //   effectiveCallerIdName: data.effectiveCallerIdName,
      //   effectiveCallerIdNumber: data.effectiveCallerIdNumber,
      //   outbundCallerIdName: data.outbundCallerIdName,
      //   outbundCallerIdNumber: data.outbundCallerIdNumber,
      //   emergencyCallerIdName: data.emergencyCallerIdName,
      //   emergencyCallerIdNumber: data.emergencyCallerIdNumber,
      //   directoryFullname: data.directoryFullname,
      //   directoryExtensionVisible: data.directoryExtensionVisible,
      //   maxRegistration: data.maxRegistration,
      //   limitMax: data.limitMax,
      //   limitDestinations: data.limitDestinations,
      //   voicemailEnabled: data.voicemailEnabled,
      //   voiceEmailTo: data.voiceEmailTo,
      //   voiceMailFile: data.voiceMailFile,
      //   voiceMailkeepFile: data.voiceMailkeepFile,
      //   missedCall: data.missedCall,
      //   tollAllowValue: data.tollAllowValue,
      //   callTimeOut: data.callTimeOut,
      //   callgroup: data.callgroup,
      //   callScreen: data.callScreen,
      //   record: data.record,
      //   domain: `${domainId}`,
      //   description: data.description,
      //   moh_sound: data.moh != "" ? Number(data.moh) : 0,
      //   password: data.password,
      //   ...(data.user ? { user: data.user } : {}),
      //   forceUpdate: title === "force",
      // };

      const apiData = await generalPutFunction(
        `/extension/${value}`,
        parsedData
      );
      if (apiData.status) {
        toast.success(apiData.message);
        await generalGetFunction(`/user/all`);
        navigate("/extensions");
      } else {
        if (apiData.message === "Already assigned to a different user") {
          setPopUp(true);
        }
        //  else {
        //   const errorMessage = Object.keys(apiData.errors);
        //   toast.error(apiData.errors[errorMessage[0]][0]);
        // }
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  });

  return (
    <main className="mainContent">
      <section id="phonePage">
        <div className="container-fluid px-0">
          <Header title="Update Extension" />
          {/* <div id="subPageHeader">
            <div className="col-xl-12 ps-2">
              <div className="d-flex justify-content-end">
                <button
                  effect="ripple"
                  className="panelButton"
                  onClick={() => {
                    navigate(-1);
                    backToTop();
                  }}
                >
                  <span className="text">Back</span>
                  <span className="icon"><i class="fa-solid fa-caret-left"></i></span>
                </button>
                <button
                  effect="ripple"
                  className="panelButton"
                  onClick={() => handleFormSubmit()}
                >
                  <span className="text">Save</span>
                  <span className="icon"><i class="fa-solid fa-floppy-disk"></i></span>
                </button>
              </div>
            </div>
          </div> */}
        </div>
        <div className="col-xl-12">
          {loading ? (
            <div colSpan={99}>
              <CircularLoader />
            </div>
          ) : (
            ""
          )}
          <div className="overviewTableWrapper">
            <div className="overviewTableChild">
              <div className="d-flex flex-wrap">
                <div className="col-12">
                  <div className="heading">
                    <div className="content">
                      <h4>Update Extension</h4>
                      <p>An extension is a destinations that can be called.</p>
                    </div>
                    <div className="buttonGroup">
                      <button
                        onClick={() => {
                          navigate(-1);
                          backToTop();
                        }}
                        type="button"
                        effect="ripple"
                        className="panelButton gray"
                      >
                        <span className="text">Back</span>
                        <span className="icon"><i class="fa-solid fa-caret-left"></i></span>
                      </button>
                      <button
                        type="button"
                        effect="ripple"
                        className="panelButton"
                        onClick={() => handleFormSubmit()}
                      >
                        <span className="text">Save</span>
                        <span className="icon"><i class="fa-solid fa-floppy-disk"></i></span>
                      </button>
                    </div>
                  </div>
                </div>
                <div className="col-12" style={{ padding: '25px 23px', borderBottom: '1px solid #ddd' }}>
                  <form action="#" className="tangoNavs">
                    <nav>
                      <div class="nav nav-tabs" id="nav-tab" role="tablist">
                        <button class="nav-link active" id="nav-gen-tab" data-bs-toggle="tab" data-bs-target="#nav-gen" type="button" role="tab" aria-controls="nav-gen" aria-selected="true">General</button>
                        <button class="nav-link" id="nav-voicemail-tab" data-bs-toggle="tab" data-bs-target="#nav-voicemail" type="button" role="tab" aria-controls="nav-voicemail" aria-selected="false">Voicemail</button>
                        <button class="nav-link" id="nav-adv-tab" data-bs-toggle="tab" data-bs-target="#nav-adv" type="button" role="tab" aria-controls="nav-adv" aria-selected="false">Advanced</button>
                      </div>
                    </nav>
                    <div class="tab-content" id="nav-tabContent">
                      <div class="tab-pane fade show active" id="nav-gen" role="tabpanel" aria-labelledby="nav-gen-tab" tabindex="0">
                        <form className="row col-12 mx-auto">
                          <div className="formRow col-xl-3">
                            <div className="formLabel">
                              <Tippy content=" Enter the alphanumeric extension. The default configuration
                          allows 2 - 15 digit extensions.">
                                <label htmlFor="">Extension</label>
                              </Tippy>
                            </div>
                            <div className="col-xl-6 col-12">
                              <input
                                type="text"
                                name="extension"
                                className="formItem"
                                {...register("extension", { ...requiredValidator })}
                                disabled
                              />
                              {errors.extension && (
                                <ErrorMessage text={errors.extension.message} />
                              )}
                            </div>
                          </div>
                          <div className="formRow col-xl-3">
                            <div className="formLabel">
                              <Tippy content="Password length must be atleast 4 character">
                                <label htmlFor="">Password</label>
                              </Tippy>
                            </div>
                            <div className="col-xl-6 col-12">
                              <input
                                type="text"
                                name="extension"
                                className="formItem"
                                {...register("password", {
                                  ...requiredValidator,
                                  ...lengthValidator(4, 50),
                                })}
                              />
                              {errors.password && (
                                <ErrorMessage text={errors.password.message} />
                              )}
                            </div>
                          </div>
                          <div className="formRow col-xl-3">
                            <div className="formLabel">
                              <Tippy content="Define users assigned to this Extension.">
                                <label htmlFor="">Select User</label>
                              </Tippy>
                            </div>
                            <div className="col-xl-6 col-12">
                              <select
                                className="formItem"
                                {...register("user")}
                                id="selectFormRow"
                              >
                                <option value="" disabled>
                                  Select User
                                </option>
                                <option value={""}>None</option>
                                {users &&
                                  users.map((item, key) => {
                                    return (
                                      <option key={key} value={item.id}>
                                        {item.username}
                                      </option>
                                    );
                                  })}
                              </select>
                            </div>
                          </div>
                          <div className="formRow col-xl-3">
                            <div className="formLabel">
                              <Tippy content="Select the desired hold music.">
                                <label htmlFor="">Music on Hold</label>
                              </Tippy>
                            </div>
                            <div className="col-xl-6 col-12">
                              <select {...register("moh")} className="formItem w-100">
                                <option disabled value="">
                                  Select
                                </option>
                                {music &&
                                  music.map((item, index) => {
                                    return (
                                      <option key={index} value={item.id}>
                                        {item.name}
                                      </option>
                                    );
                                  })}
                              </select>
                            </div>
                          </div>

                          <div className="formRow col-xl-3">
                            <div className="formLabel">
                              <Tippy content="Enter the account code here.">
                                <label htmlFor="">Account Code</label>
                              </Tippy>
                            </div>
                            <div className="col-xl-6 col-12">
                              <input
                                type="text"
                                name="extension"
                                className="formItem"
                                {...register("account_code", {
                                  ...noSpecialCharactersValidator,
                                })}
                                onKeyDown={restrictToAllowedChars}
                              />
                              {errors.account_code && (
                                <ErrorMessage text={errors.account_code.message} />
                              )}
                            </div>
                          </div>
                          <div className="formRow col-xl-3">
                            <div className="formLabel">
                              <Tippy content="Enter the internal caller ID name & number here.">
                                <label htmlFor="">Effective Caller ID</label>
                              </Tippy>
                            </div>
                            <div className="col-xl-6 col-12">
                              <div className="row">
                                <div className="col-4 pe-2">
                                  <input
                                    type="text"
                                    name="extension"
                                    placeholder="Name"
                                    className="formItem"
                                    {...register("effectiveCallerIdName", {
                                      ...noSpecialCharactersValidator,
                                    })}
                                    onKeyDown={restrictToAllowedChars}
                                  />
                                  {errors.effectiveCallerIdName && (
                                    <ErrorMessage text={errors.effectiveCallerIdName.message} />
                                  )}
                                </div>
                                <div className="col-8 ps-2">
                                  <input
                                    type="text"
                                    name="extension"
                                    placeholder="Number"
                                    className="formItem"
                                    {...register("effectiveCallerIdNumber", {
                                      ...numberValidator,
                                    })}
                                    onKeyDown={restrictToNumbers}
                                  />
                                  {errors.effectiveCallerIdNumber && (
                                    <ErrorMessage
                                      text={errors.effectiveCallerIdNumber.message}
                                    />
                                  )}
                                </div>
                              </div>

                            </div>
                          </div>
                          {/* <div className="formRow col-xl-3">
                      <div className="formLabel">
                        <label htmlFor="">Effective Caller ID Number</label>
                        <label htmlFor="data" className="formItemDesc">
                          Enter the internal caller ID number here.
                        </label>
                      </div>
                      <div className="col-xl-6 col-12">
                        <input
                          type="text"
                          name="extension"
                          className="formItem"
                          {...register("effectiveCallerIdNumber", {
                            ...numberValidator,
                          })}
                          onKeyDown={restrictToNumbers}
                        />
                        {errors.effectiveCallerIdNumber && (
                          <ErrorMessage
                            text={errors.effectiveCallerIdNumber.message}
                          />
                        )}
                      </div>
                    </div> */}
                          <div className="formRow col-xl-3">
                            <div className="formLabel">
                              <Tippy content="Choose whether to record local, inbound, outbound, or all.">
                                <label htmlFor="selectFormRow">Record</label>
                              </Tippy>
                            </div>
                            <div className="col-xl-6 col-12">
                              <select
                                className="formItem"
                                name=""
                                id="selectFormRow"
                                {...register("record", {})}
                              >
                                <option value="" disabled>
                                  Select Type
                                </option>
                                <option value="D">Disabled</option>
                                <option value="A">All</option>
                                <option value="L">Local</option>
                                <option value="I">Inbound</option>
                                <option value="O">Outbound</option>
                              </select>
                            </div>
                          </div>
                          {/* <div className="formRow col-xl-3">
                      <div className="formLabel">
                        <label htmlFor="">Outbound Caller ID Number</label>
                        <label htmlFor="data" className="formItemDesc">
                          Enter the external (public) caller ID number here.
                        </label>
                      </div>
                      <div className="col-xl-6 col-12">
                        <input
                          type="text"
                          name="extension"
                          className="formItem"
                          {...register("outbundCallerIdNumber", {
                            ...numberValidator,
                          })}
                          onKeyDown={restrictToNumbers}
                        />
                        {errors.outbundCallerIdNumber && (
                          <ErrorMessage text={errors.outbundCallerIdNumber.message} />
                        )}
                      </div>
                    </div> */}
                          <div className="formRow col-xl-3">
                            <div className="formLabel">
                              <Tippy content="Enter the emergency caller ID name & number here.">
                                <label htmlFor="">Emergency Caller ID</label>
                              </Tippy>
                            </div>
                            <div className="col-xl-6 col-12">
                              <div className="row">
                                <div className="col-4 pe-2">
                                  <input
                                    type="text"
                                    name="extension"
                                    placeholder="Name"
                                    className="formItem"
                                    {...register("emergencyCallerIdName", {
                                      ...noSpecialCharactersValidator,
                                    })}
                                    onKeyDown={restrictToAllowedChars}
                                  />
                                  {errors.emergencyCallerIdName && (
                                    <ErrorMessage text={errors.emergencyCallerIdName.message} />
                                  )}
                                </div>
                                <div className="col-8 ps-2">
                                  <input
                                    type="text"
                                    name="extension"
                                    placeholder="Number"
                                    className="formItem"
                                    {...register("emergencyCallerIdNumber", {
                                      ...numberValidator,
                                    })}
                                    onKeyDown={restrictToNumbers}
                                  />
                                  {errors.emergencyCallerIdNumber && (
                                    <ErrorMessage
                                      text={errors.emergencyCallerIdNumber.message}
                                    />
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                          {/* <div className="formRow col-xl-3">
                      <div className="formLabel">
                        <label htmlFor="">Emergency Caller ID Number</label>
                        <label htmlFor="data" className="formItemDesc">
                          Enter the emergency caller ID number here.
                        </label>
                      </div>
                      <div className="col-xl-6 col-12">
                        <input
                          type="text"
                          name="extension"
                          className="formItem"
                          {...register("emergencyCallerIdNumber", {
                            ...numberValidator,
                          })}
                          onKeyDown={restrictToNumbers}
                        />
                        {errors.emergencyCallerIdNumber && (
                          <ErrorMessage
                            text={errors.emergencyCallerIdNumber.message}
                          />
                        )}
                      </div>
                    </div> */}
                          <div className="formRow col-xl-3">
                            <div className="formLabel">
                              <Tippy content="Enter the description.">
                                <label htmlFor="selectFormRow">Description</label>
                              </Tippy>
                            </div>
                            <div className="col-xl-6 col-12">
                              <input
                                type="text"
                                name="extension"
                                className="formItem"
                                {...register("description", {
                                  ...noSpecialCharactersValidator,
                                })}
                                onKeyDown={restrictToAllowedChars}
                              />
                              {errors.description && (
                                <ErrorMessage text={errors.description.message} />
                              )}
                            </div>
                          </div>
                          <div className="formRow col-xl-3">
                            <div className="formLabel">
                              <Tippy content="Enter the external (public) caller ID name & number here.">
                                <label htmlFor="">Outbound Caller ID</label>
                              </Tippy>
                            </div>
                            <div className="col-xl-6 col-12">
                              <div className="row">
                                <div className="col-4 pe-2">
                                  <input
                                    type="text"
                                    name="extension"
                                    placeholder="Name"
                                    className="formItem"
                                    {...register("outbundCallerIdName", {
                                      ...noSpecialCharactersValidator,
                                    })}
                                    onKeyDown={restrictToAllowedChars}
                                  />
                                  {errors.outbundCallerIdName && (
                                    <ErrorMessage text={errors.outbundCallerIdName.message} />
                                  )}
                                </div>
                                <div className="col-8 ps-2">
                                  <input
                                    type="text"
                                    name="extension"
                                    placeholder="Number"
                                    className="formItem"
                                    {...register("outbundCallerIdNumber", {
                                      ...numberValidator,
                                    })}
                                    onKeyDown={restrictToNumbers}
                                  />
                                  {errors.outbundCallerIdNumber && (
                                    <ErrorMessage text={errors.outbundCallerIdNumber.message} />
                                  )}
                                </div>
                              </div>

                            </div>
                          </div>
                        </form>
                      </div>
                      <div class="tab-pane fade" id="nav-voicemail" role="tabpanel" aria-labelledby="nav-voicemail-tab" tabindex="0">
                        <form className="row col-12 mx-auto">
                          <div className="formRow col-xl-3">
                            <div className="formLabel">
                              <Tippy content="Enter the numeric voicemail password here.">
                                <label htmlFor="">Voicemail Password</label>
                              </Tippy>
                            </div>
                            <div className="col-xl-6 col-12">
                              <input
                                type="text"
                                name="extension"
                                className="formItem"
                                {...register("voicemail_password", {
                                  ...requiredValidator,
                                  ...lengthValidator(4, 50),
                                })}
                              />
                              {errors.voicemail_password && (
                                <ErrorMessage text={errors.voicemail_password.message} />
                              )}
                            </div>
                          </div>
                          <div className="formRow col-xl-3">
                            <div className="formLabel">
                              <Tippy content="Enable/disable voicemail for this extension.">
                                <label htmlFor="selectFormRow">Voicemail Enabled</label>
                              </Tippy>
                            </div>
                            <div className="col-xl-6 col-12">
                              <select
                                className="formItem"
                                name=""
                                id="selectFormRow"
                                {...register("voicemailEnabled", {})}
                              >
                                <option value="" disabled>
                                  Select Voicemail
                                </option>
                                <option value="Y">True</option>
                                <option value="N">False</option>
                              </select>
                              {errors.voicemailEnabled && (
                                <ErrorMessage text={errors.voicemailEnabled.message} />
                              )}
                            </div>
                          </div>
                          <div className="formRow col-xl-3">
                            <div className="formLabel">
                              <Tippy content="Enter the email address to send voicemail to (optional).">
                                <label htmlFor="selectFormRow">Voicemail Mail To</label>
                              </Tippy>
                            </div>
                            <div className="col-xl-6 col-12">
                              <input
                                type="text"
                                name="extension"
                                className="formItem"
                                {...register("voiceEmailTo", {
                                  ...emailValidator,
                                })}
                                onKeyDown={restrictToAllowedChars}
                              />
                              {errors.voiceEmailTo && (
                                <ErrorMessage text={errors.voiceEmailTo.message} />
                              )}
                            </div>
                          </div>
                          <div className="formRow col-xl-3">
                            <div className="formLabel">
                              <Tippy content="Select a listening option to include with the email notification.">
                                <label htmlFor="selectFormRow">Voicemail File</label>
                              </Tippy>
                            </div>
                            <div className="col-xl-6 col-12">
                              <select
                                className="formItem"
                                name=""
                                id="selectFormRow"
                                {...register("voiceMailFile", {})}
                              >
                                <option value="" disabled>
                                  Select Voicemail File
                                </option>
                                <option value="audio">Audio File Attachment</option>
                                <option value="listen">Listen Link (Login Required)</option>
                                <option value="download">
                                  Download Link (No Login Required)
                                </option>
                              </select>
                              {errors.voiceMailFile && (
                                <ErrorMessage text={errors.voiceMailFile.message} />
                              )}
                            </div>
                          </div>
                          <div className="formRow col-xl-3">
                            <div className="formLabel">
                              <Tippy content="Choose whether to keep the voicemail in the system after sending the email notification.">
                                <label htmlFor="selectFormRow">Voicemail Keep Local</label>
                              </Tippy>
                            </div>
                            <div className="col-xl-6 col-12">
                              <select
                                className="formItem"
                                name=""
                                id="selectFormRow"
                                {...register("voiceMailkeepFile", {})}
                              >
                                <option value="" disabled>
                                  Select User
                                </option>
                                <option value="true">True</option>
                                <option value="false">False</option>
                              </select>
                              {errors.voiceMailkeepFile && (
                                <ErrorMessage text={errors.voiceMailkeepFile.message} />
                              )}
                            </div>
                          </div>
                        </form>
                      </div>
                      <div class="tab-pane fade" id="nav-adv" role="tabpanel" aria-labelledby="nav-adv-tab" tabindex="0">
                        <form className="row col-12 mx-auto">
                          <div className="formRow col-xl-3">
                            <div className="formLabel">
                              <label htmlFor="">Directory Full Name</label>
                              <label htmlFor="data" className="formItemDesc">
                                Enter the first name followed by the last name.
                              </label>
                            </div>
                            <div className="col-xl-6 col-12">
                              <input
                                type="text"
                                name="extension"
                                className="formItem"
                                {...register("directoryFullname", {
                                  ...noSpecialCharactersValidator,
                                })}
                                onKeyDown={restrictToAllowedChars}
                              />
                              {errors.directoryFullname && (
                                <ErrorMessage text={errors.directoryFullname.message} />
                              )}
                            </div>
                          </div>
                          <div className="formRow col-xl-3">
                            <div className="formLabel">
                              <label htmlFor="selectFormRow">
                                Directory Extension Visible
                              </label>
                              <label htmlFor="data" className="formItemDesc">
                                Select whether announce the extension when calling the
                                directory.
                              </label>
                            </div>
                            <div className="col-xl-6 col-12">
                              <select
                                className="formItem"
                                name=""
                                id="selectFormRow"
                                {...register("directoryExtensionVisible", {})}
                              >
                                <option value="" disabled>
                                  Select Visibility
                                </option>
                                <option value="true">True</option>
                                <option value="false">False</option>
                              </select>
                              {errors.directoryExtensionVisible && (
                                <ErrorMessage
                                  text={errors.directoryExtensionVisible.message}
                                />
                              )}
                            </div>
                          </div>
                          <div className="formRow col-xl-3">
                            <div className="formLabel">
                              <label htmlFor="selectFormRow">Max Registrations</label>
                              <label htmlFor="data" className="formItemDesc">
                                Enter the maximum concurrent registrations allowed.
                              </label>
                            </div>
                            <div className="col-xl-6 col-12">
                              <input
                                type="text"
                                name="extension"
                                className="formItem"
                                {...register("maxRegistration", {
                                  ...numberValidator,
                                })}
                                onKeyDown={restrictToNumbers}
                              />
                              {errors.maxRegistration && (
                                <ErrorMessage text={errors.maxRegistration.message} />
                              )}
                            </div>
                          </div>
                          <div className="formRow col-xl-3">
                            <div className="formLabel">
                              <label htmlFor="selectFormRow">Limit Max</label>
                              <label htmlFor="data" className="formItemDesc">
                                Enter the maximum number of concurrent outbound calls
                                allowed.
                              </label>
                            </div>
                            <div className="col-xl-6 col-12">
                              <input
                                type="text"
                                name="extension"
                                className="formItem"
                                {...register("limitMax", {
                                  ...numberValidator,
                                })}
                                onKeyDown={restrictToNumbers}
                              />
                              {errors.limitMax && (
                                <ErrorMessage text={errors.limitMax.message} />
                              )}
                            </div>
                          </div>
                          <div className="formRow col-xl-3">
                            <div className="formLabel">
                              <label htmlFor="selectFormRow">Limit Destination</label>
                              <label htmlFor="data" className="formItemDesc">
                                Enter the destination to send the calls when the max number
                                of outgoing calls has been reached.
                              </label>
                            </div>
                            <div className="col-xl-6 col-12">
                              <input
                                type="text"
                                name="extension"
                                className="formItem"
                                {...register("limitDestinations", {
                                  ...numberValidator,
                                })}
                                onKeyDown={restrictToNumbers}
                              />
                            </div>
                          </div>
                          <div className="formRow col-xl-3">
                            <div className="formLabel">
                              <label htmlFor="selectFormRow">Missed Call</label>
                              <label htmlFor="data" className="formItemDesc">
                                Select the notification type, and enter the appropriate
                                destination.
                              </label>
                            </div>
                            <div className="col-xl-6 col-12">
                              <select
                                className="formItem"
                                name=""
                                id="selectFormRow"
                                {...register("missedCall", {})}
                              >
                                <option value="" disabled>
                                  Select Notification Type
                                </option>
                                <option value="email">Email</option>
                                <option value="none">None</option>
                              </select>
                              {errors.missedCall && (
                                <ErrorMessage text={errors.missedCall.message} />
                              )}
                            </div>
                          </div>
                          <div className="formRow col-xl-3">
                            <div className="formLabel">
                              <label htmlFor="selectFormRow">Toll Allow</label>
                              <label htmlFor="data" className="formItemDesc">
                                Enter the toll allow value here. (Examples:
                                domestic,international,local).
                              </label>
                            </div>
                            <div className="col-xl-6 col-12">
                              <input
                                type="text"
                                name="extension"
                                className="formItem"
                                {...register("tollAllowValue", {
                                  ...noSpecialCharactersValidator,
                                })}
                                onKeyDown={restrictToAllowedChars}
                              />
                              {errors.tollAllowValue && (
                                <ErrorMessage text={errors.tollAllowValue.message} />
                              )}
                            </div>
                          </div>
                          <div className="formRow col-xl-3">
                            <div className="formLabel">
                              <label htmlFor="selectFormRow">Call Timeout</label>
                              <label htmlFor="data" className="formItemDesc">
                                Enter the ring time (delay in seconds) before sending a call
                                to voicemail.
                              </label>
                            </div>
                            <div className="col-xl-6 col-12">
                              <input
                                type="number"
                                name="extension"
                                className="formItem"
                                {...register("callTimeOut", {
                                  ...numberValidator,
                                })}
                                onKeyDown={restrictToNumbers}
                              />
                            </div>
                          </div>
                          <div className="formRow col-xl-3">
                            <div className="formLabel">
                              <label htmlFor="selectFormRow">Call Group</label>
                              <label htmlFor="data" className="formItemDesc">
                                Enter the user call group here. Groups available by default:
                                sales, support, billing.
                              </label>
                            </div>
                            <div className="col-xl-6 col-12">
                              <input
                                type="text"
                                name="extension"
                                className="formItem"
                                {...register("callgroup", {
                                  ...noSpecialCharactersValidator,
                                })}
                                onKeyDown={restrictToAllowedChars}
                              />
                              {errors.callgroup && (
                                <ErrorMessage text={errors.callgroup.message} />
                              )}
                            </div>
                          </div>
                          <div className="formRow col-xl-3">
                            <div className="formLabel">
                              <label htmlFor="selectFormRow">Call Screen</label>
                              <label htmlFor="data" className="formItemDesc">
                                Choose whether to enable or disable call screening.
                              </label>
                            </div>
                            <div className="col-xl-6 col-12">
                              <select
                                className="formItem"
                                name=""
                                id="selectFormRow"
                                {...register("callScreen", {})}
                              >
                                <option value="" disabled>
                                  Select Notification Type
                                </option>
                                <option value="Enable">Enable</option>
                                <option value="Disable">Disable</option>
                              </select>
                              {errors.callScreen && (
                                <ErrorMessage text={errors.callScreen.message} />
                              )}
                            </div>
                          </div>
                        </form>
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

                    {/* <div className="formRow col-xl-3">
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
              </div> */}
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
                        // handleSubmit("force");
                        handleFormSubmit("force");
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
    </main>
  );
};

export default ExtensionsEdit;
