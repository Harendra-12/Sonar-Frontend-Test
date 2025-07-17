/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  backToTop,
  generalGetFunction,
  generalPutFunction,
} from "../../GlobalFunction/globalFunction";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";
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
import ActionList from "../../CommonComponents/ActionList";
import SkeletonFormLoader from "../../Loader/SkeletonFormLoader";
import AddMusic from "../../CommonComponents/AddMusic";

const ExtensionsEdit = ({ page, extensionData }) => {
  const navigate = useNavigate();
  const acount = useSelector((state) => state.account);
  const location = useLocation();
  const showHeader = location.pathname == "/extensions-edit";
  const queryParams = new URLSearchParams(useLocation().search);
  const navValue = queryParams.get("id");
  const [users, setUsers] = useState();
  const [popUp, setPopUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [music, setMusic] = useState();
  const [showMusic, setShowMusic] = useState(false);
  const [uploadedMusic, setUploadedMusic] = useState();
  const [musicRefresh, setMusicRefresh] = useState(0);
  const account = useSelector((state) => state.account);
  const [callSetting, setCallSetting] = useState({
    followMeDestinationType: "extension",
    followMeDestinationError: false,
    followMeDestination: "",
    followMeDelay: 0,
    followMeTimeOut: 20,
    followMePrompt: "Prompt",
    followMeId: "",
  });
  const [value, setValuee] = useState("");

  // React Hook Form for handling form in efficient way
  const {
    register,
    unregister,
    watch,
    formState: { errors },
    handleSubmit,
    reset,
    setError,
    setValue,
    clearErrors,
  } = useForm({
    defaultValues: {
      callTimeOut: `${160}`,
    },
  });

  useEffect(() => {
    // Guard clause to prevent destructuring undefined
    if (!extensionData?.extension) {
      setValuee(navValue);
      return;
    }

    const { id } = extensionData.extension;
    setValuee(id || navValue);
  }, [extensionData, navValue]);

  // Getting extension data and manage its state locally
  useEffect(() => {
    setLoading(true);
    if (account === null) {
      navigate("/");
    } else {
      async function getDomain() {
        setMusicRefresh(musicRefresh + 1);
        const apidataUser = await generalGetFunction(
          `/user/search?account=${account.account_id}${account.usertype !== "Company" || account.usertype !== "SupreAdmin"
            ? "&section=Accounts"
            : ""
          }`
        );
        if (apidataUser?.status) {
          setUsers(apidataUser.data);
        }
      }
      getDomain();
    }

    if (value) {
      async function getData() {
        const apiData = await generalGetFunction(
          `/extension/${value}${account.usertype !== "Company" || account.usertype !== "SupreAdmin"
            ? "?section=Accounts"
            : ""
          }`
        );
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
            onbusy: apiData.data.onbusy,
            onbusyTo: apiData.data.onbusyTo,
            noanswer: apiData.data.noanswer,
            // noanswerTo: apiData.data.noanswerTo,
            forward: apiData.data.forward,
            forward_to: apiData.data.forward_to,
            notregistered: apiData.data.notregistered,
            notregisteredTo: apiData.data.notregisteredTo,
            followme: apiData.data.followme,
            followmes: apiData.data.followmes,
            dnd: apiData.data.dnd,
            blockIncomingStatus: apiData.data.blockIncomingStatus,
            blockOutGoingStatus: apiData.data.blockOutGoingStatus,
          };

          reset(resetInfo);
          if (
            apiData.data.blockIncomingStatus === 1 &&
            apiData.data.blockOutGoingStatus === 1
          ) {
            setValue("callblocking", "All");
          } else if (
            apiData.data.blockIncomingStatus === 1 &&
            apiData.data.blockOutGoingStatus === 0
          ) {
            setValue("callblocking", "Incoming");
          } else if (
            apiData.data.blockIncomingStatus === 0 &&
            apiData.data.blockOutGoingStatus === 1
          ) {
            setValue("callblocking", "Outgoing");
          } else {
            setValue("callblocking", "Disabled");
          }

          if (apiData.data.callforward == 1) {
            setValue("noanswer", "Forward");
            setValue("noanswerTo", apiData.data.callforwardTo);
          } else if (
            apiData.data.callforward == 0 &&
            apiData.data.noanswer == 1
          ) {
            setValue("noanswer", "Voicemail");
            // setValue("noanswerTo", apiData.data.voiceEmailTo);
          } else {
            setValue("noanswer", "Disabled");
          }

          if (apiData.data.followmes.length > 0) {
            setCallSetting((prevState) => ({
              ...prevState,
              followMeDestinationError: false,
              followMeDestinationType:
                apiData.data.followmes[0].destination_type,
              followMeDestination: apiData.data.followmes[0].destination,
              followMeDelay: apiData.data.followmes[0].delay,
              followMeTimeOut: apiData.data.followmes[0].timeout,
              followMePrompt: apiData.data.followmes[0].prompt,
              followMeId: apiData.data.followmes[0].id,
            }));
          }
        } else {
          setLoading(false);
        }
      }
      getData();
    }
  }, [account, navigate, value]);

  // Getting all music data whose type is hold
  useEffect(() => {
    if (musicRefresh > 0) {
      if (account === null) {
        navigate("/");
      } else {
        async function getDomain() {
          const musicData = await generalGetFunction("/sound/all?type=hold");
          if (musicData?.status) {
            setMusic(musicData.data);

            if (musicData.data.length > 0 && uploadedMusic) {
              setValue("moh", uploadedMusic.id);
            }
          }
        }
        getDomain();
      }
    }
  }, [musicRefresh]);

  // Manualy handle state of onbusyto if on busy then where to route call
  const actionListValue = (value) => {
    setValue("onbusyTo", value[0]);
    clearErrors("onbusyTo", null);
  };

  // Manualy handle state of noanswerto if no answer then where to route call
  const actionListValue1 = (value) => {
    setValue("noanswerTo", value[0]);
    clearErrors("noanswerTo", null);
  };
  // Manualy handle state of notregisterto if not registered then where to route call
  const actionListValue2 = (value) => {
    setValue("notregisteredTo", value[0]);
    clearErrors("notregisteredTo", null);
  };

  // Handle edit form submit by checking all validation with the help of react hook form and also manually check if onbusyto, noanswerto, notregisterto is selected then its destination should not be empty apart from this there is two type of submit one is normal means if no extension assign then we can assign any extension other one is force if the extension is already assign then by using force option we can assign any extension

  const handleFormSubmit = handleSubmit(async (data, title) => {
    if (data.onbusy == 1 && !data.onbusyTo) {
      setError("onbusyTo", {
        type: "manual",
        message: "Please select a destination",
      });
      // return;
    }
    if (data.noanswer == "Forward" && !data.noanswerTo) {
      setError("noanswerTo", {
        type: "manual",
        message: "Please select a destination",
      });
      // return;
    }
    if (data.notregistered == 1 && !data.notregisteredTo) {
      setError("notregisteredTo", {
        type: "manual",
        message: "Please select a destination",
      });
      // return;
    }
    // if (data.followme == 1 && !callSetting.followMeDestination) {
    //   setCallSetting((prevState) => ({
    //     ...prevState,
    //     followMeDestinationError: true,
    //   }));
    //   return;
    // }
    if (
      (data.onbusy == 1 && !data.onbusyTo) ||
      (data.noanswer == "Forward" && !data.noanswerTo) ||
      (data.notregistered == 1 && !data.notregisteredTo) ||
      (data.followme == 1 && !data?.destination_forward_to)
    ) {
      return;
    }
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
          description: data.description,
          moh_sound: data.moh,
          notregisteredTo: data.notregisteredTo,
          noanswer: data.noanswer == "Disabled" ? 0 : 1,
          forward: data.forward,
          forward_to: data.forward_to,
          callforward: data.noanswer == "Forward" ? 1 : 0,
          callforwardTo: data.noanswer === "Forward" ? data.noanswerTo : "",
          onbusy: data.onbusy,
          onbusyTo: data.onbusyTo,
          blockIncomingStatus:
            data.callblocking === "Incoming"
              ? 1
              : data.callblocking === "All"
                ? 1
                : 0,
          blockOutGoingStatus:
            data.callblocking === "Outgoing"
              ? 1
              : data.callblocking === "All"
                ? 1
                : 0,
          dnd: data.dnd,
          notregistered: data.notregistered,
          followme: data.followme,
          ...(data.followme == 1
            ? {
              data: [
                {
                  destination_type: callSetting.followMeDestinationType,
                  destination: data?.destination_forward_to,
                  delay: callSetting.followMeDelay,
                  timeout: callSetting.followMeTimeOut,
                  extension_id: value,
                  id: callSetting.followMeId,
                  prompt: callSetting.followMePrompt,
                },
              ],
            }
            : {}),
          password: data.password,
          user: data.user,
          // ...(data.user === "" || data.user === null
          //   ? {user : null}
          //   : { user: data.user }),
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
          forward: data.forward,
          forward_to: data.forward_to,
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
          notregistered: data.notregistered,
          notregisteredTo: data.notregisteredTo,
          noanswer: data.noanswer == "Disabled" ? 0 : 1,
          moh_sound: data.moh,
          callforward: data.noanswer == "Forward" ? 1 : 0,
          callforwardTo: data.noanswer === "Forward" ? data.noanswerTo : "",
          // voicemailEnabled: data.noanswer === "Voicemail" ? "Y" : "N",
          // voiceEmailTo: data.noanswer === "Voicemail" ? data.noanswerTo : "",
          onbusy: data.onbusy,
          onbusyTo: data.onbusyTo,
          followme: data.followme,
          dnd: data.dnd,
          ...(data.followme == 1
            ? {
              data: [
                {
                  destination_type: callSetting.followMeDestinationType,
                  destination: data?.destination_forward_to,
                  delay: callSetting.followMeDelay,
                  timeout: callSetting.followMeTimeOut,
                  extension_id: value,
                  id: callSetting.followMeId,
                  prompt: callSetting.followMePrompt,
                },
              ],
            }
            : {}),
          blockIncomingStatus:
            data.callblocking === "Incoming"
              ? 1
              : data.callblocking === "All"
                ? 1
                : 0,
          blockOutGoingStatus:
            data.callblocking === "Outgoing"
              ? 1
              : data.callblocking === "All"
                ? 1
                : 0,
          description: data.description,
          password: data.password,
          user: data.user,
          // ...(data.user === "" || data.user === null
          //   ? {user : null}
          //   : { user: data.user }),
        };
      }
      const apiData = await generalPutFunction(
        `/extension/${value}`,
        parsedData
      );
      if (apiData.status) {
        toast.success(apiData.message);
        await generalGetFunction(
          `/user/all${account.usertype !== "Company" || account.usertype !== "SupreAdmin"
            ? "?section=Accounts"
            : ""
          }`
        );
        // navigate(-1);
      } else {
        if (apiData.message === "Already assigned to a different user") {
          setPopUp(true);
        }
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  });
  const forwardStatus = watch("forward", "disabled");

  // If no moh found then we manually add new one
  const handleAddMusic = () => {
    setValue("moh", "");
    setShowMusic(true);
  };

  // Manually manage forward to state
  const forwardToValue = (value) => {
    setValue("forward_to", value[0]);
  };
  const forwardToValueDestination = (value) => {
    setValue("destination_forward_to", value[0]);
  };
  const actionForNotRegistered = (value) => {
    setValue("notregisteredTo", value[0]);
  };
  const actionForOnBusy = (value) => {
    setValue("onbusyTo", value[0]);
  };

  useEffect(() => {
    if (watch().followme == "0") {
      if (Object.keys(watch()).includes("destination_forward_to")) {
        unregister("destination_forward_to");
      }
    }
  }, [watch()]);

  return (
    <main
      className={page === "agents" ? "mainContentAgents ms-0" : "mainContent"}
    >
      <section id="phonePage">
        {showHeader && (
          // <div className="container-fluid px-0">
          <Header title="Extensions" />
          // </div>
        )}

        <div className="col-xl-12">
          {loading ? (
            <div>
              <SkeletonFormLoader />
            </div>
          ) : (
            <div className="overviewTableWrapper">
              <div className="overviewTableChild">
                <div
                  className="d-flex flex-wrap"
                  style={{ position: "sticky", top: "0", zIndex: "9" }}
                >
                  <div className="col-12">
                    <div className="heading">
                      <div className="content">
                        <h4>Update Extension</h4>
                        <p>
                          An extension is a destinations that can be called.
                        </p>
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
                          <span className="icon">
                            <i className="fa-solid fa-caret-left"></i>
                          </span>
                        </button>
                        <button
                          type="button"
                          effect="ripple"
                          className="panelButton"
                          onClick={() => handleFormSubmit()}
                        >
                          <span className="text">Save</span>
                          <span className="icon">
                            <i className="fa-solid fa-floppy-disk"></i>
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                  <div
                    className="col-12 formScroller"
                    style={{
                      padding: "25px 23px",
                    }}
                  >
                    <form action="#" className="tangoNavs">
                      <nav>
                        <div
                          className="nav nav-tabs"
                          id="nav-tab"
                          role="tablist"
                        >
                          <button
                            className="nav-link active"
                            id="nav-gen-tab"
                            data-bs-toggle="tab"
                            data-bs-target="#nav-gen"
                            type="button"
                            role="tab"
                            aria-controls="nav-gen"
                            aria-selected="true"
                          >
                            General{" "}
                            {(errors?.password?.message ||
                              errors?.extension?.message) && (
                                <i
                                  className="fa fa-exclamation-circle text-danger"
                                  aria-hidden="true"
                                ></i>
                              )}
                          </button>
                          <button
                            className="nav-link"
                            id="nav-voicemail-tab"
                            data-bs-toggle="tab"
                            data-bs-target="#nav-voicemail"
                            type="button"
                            role="tab"
                            aria-controls="nav-voicemail"
                            aria-selected="false"
                          >
                            Voicemail
                          </button>
                          <button
                            className="nav-link"
                            id="nav-adv-tab"
                            data-bs-toggle="tab"
                            data-bs-target="#nav-adv"
                            type="button"
                            role="tab"
                            aria-controls="nav-adv"
                            aria-selected="false"
                          >
                            Advanced
                          </button>
                          <button
                            className="nav-link"
                            id="nav-call-setting-tab"
                            data-bs-toggle="tab"
                            data-bs-target="#nav-call-setting"
                            type="button"
                            role="tab"
                            aria-controls="nav-call-setting"
                            aria-selected="false"
                          >
                            Call Settings
                          </button>
                        </div>
                      </nav>
                      <div className="tab-content" id="nav-tabContent">
                        <div
                          className="tab-pane fade show active"
                          id="nav-gen"
                          role="tabpanel"
                          aria-labelledby="nav-gen-tab"
                          tabIndex="0"
                        >
                          <form className="row col-12 mx-auto">
                            <div className="formRow col-xl-3 col-md-12 col-12">
                              <div className="formLabel">
                                <label htmlFor="">Extension</label>
                                <label htmlFor="data" className="formItemDesc">
                                  Enter the alphanumeric extension. The default
                                  configuration allows 2 - 15 digit extensions.
                                </label>
                              </div>
                              <div className="col-xl-6 col-12">
                                <input
                                  type="text"
                                  name="extension"
                                  className="formItem"
                                  {...register("extension", {
                                    ...requiredValidator,
                                  })}
                                  disabled
                                />
                                {errors.extension && (
                                  <ErrorMessage
                                    text={errors.extension.message}
                                  />
                                )}
                              </div>
                            </div>
                            {/* <div className="formRow col-xl-3">
                              <div className="formLabel">
                                <label htmlFor="">
                                  Password{" "}
                                  <span className="text-danger">*</span>
                                </label>
                                <label htmlFor="data" className="formItemDesc">
                                  Password length must be atleast 4 character
                                </label>
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
                                  <ErrorMessage
                                    text={errors.password.message}
                                  />
                                )}
                              </div>
                            </div> */}
                            <div className="formRow col-xl-3 col-md-12 col-12">
                              <div className="formLabel">
                                <label htmlFor="">Select User</label>
                                <label htmlFor="data" className="formItemDesc">
                                  Define users assigned to this Extension.
                                </label>
                              </div>
                              <div className="col-xl-6 col-12">
                                <select
                                  className="formItem"
                                  value={watch().user}
                                  {...register("user")}
                                >
                                  <option value="" disabled>
                                    Select User
                                  </option>
                                  <option value={""}>None</option>
                                  {users &&
                                    users.map((item, key) => {
                                      return (
                                        <option key={key} value={item.id}>
                                          {item?.username}
                                        </option>
                                      );
                                    })}
                                </select>
                              </div>
                            </div>
                            {/* <div className="formRow col-xl-3">
                              <div className="formLabel">
                                <label htmlFor="">Music on Hold</label>
                                <label htmlFor="data" className="formItemDesc">
                                  Select the desired hold music.
                                </label>
                              </div>
                              <div className="col-xl-6 col-12">
                                <select
                                  {...register("moh")}
                                  className="formItem w-100"
                                  onChange={(e) => {
                                    const selectedValue = e.target.value;
                                    if (selectedValue === "add-music") {
                                      handleAddMusic(); // Call your function here
                                    }
                                  }}
                                >
                                  <option disabled value="">
                                    Select
                                  </option>
                                  {music &&
                                    music.map((item, index) => (
                                      <option key={index} value={item.id}>
                                        {item.name}
                                      </option>
                                    ))}
                                  <option
                                    className="bg-primary text-center text-white"
                                    style={{ cursor: "pointer" }}
                                    value="add-music"
                                  >
                                    Add music
                                  </option>
                                </select>
                              </div>
                            </div> */}
                            {/* <div className="formRow col-xl-3">
                              <div className="formLabel">
                                <label htmlFor="">Effective Caller ID</label>
                                <label htmlFor="data" className="formItemDesc">
                                  Enter the internal caller ID name & number
                                  here.
                                </label>
                              </div>
                              <div className="col-xl-6 col-12">
                                <div className="row">
                                  <div className="col-5 pe-2">
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
                                      <ErrorMessage
                                        text={
                                          errors.effectiveCallerIdName.message
                                        }
                                      />
                                    )}
                                  </div>
                                  <div className="col-7 ps-2">
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
                                        text={
                                          errors.effectiveCallerIdNumber.message
                                        }
                                      />
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div> */}
                            <div className=" formRow col-xl-3 col-md-12 col-12">
                              <div className="formLabel">
                                <label htmlFor="selectFormRow">Record</label>
                                <label htmlFor="data" className="formItemDesc">
                                  Choose whether to record local, inbound,
                                  outbound, or all.
                                </label>
                              </div>
                              <div className="col-xl-6 col-12">
                                <select
                                  className="formItem"
                                  name=""
                                  {...register("record")}
                                  defaultValue={"D"}
                                >
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
                                <label htmlFor="">Emergency Caller ID</label>
                                <label htmlFor="data" className="formItemDesc">
                                  Enter the emergency caller ID name & number
                                  here.
                                </label>
                              </div>
                              <div className="col-xl-6 col-12">
                                <div className="row">
                                  <div className="col-5 pe-2">
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
                                      <ErrorMessage
                                        text={
                                          errors.emergencyCallerIdName.message
                                        }
                                      />
                                    )}
                                  </div>
                                  <div className="col-7 ps-2">
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
                                        text={
                                          errors.emergencyCallerIdNumber.message
                                        }
                                      />
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div> */}
                            <div className="formRow col-xl-3 col-md-12 col-12">
                              <div className="formLabel">
                                <label htmlFor="selectFormRow">
                                  Description
                                </label>
                                <label htmlFor="data" className="formItemDesc">
                                  Enter the description.
                                </label>
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
                                  <ErrorMessage
                                    text={errors.description.message}
                                  />
                                )}
                              </div>
                            </div>
                            <div className="formRow col-xl-3 col-md-12 col-12">
                              <div className="formLabel">
                                <label htmlFor="">Outbound Caller ID</label>
                                <label htmlFor="data" className="formItemDesc">
                                  Enter the external (public) caller ID name &
                                  number here.
                                </label>
                              </div>
                              <div className="col-xl-6 col-12">
                                <div className="row">
                                  <div className="col-5 pe-2">
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
                                      <ErrorMessage
                                        text={
                                          errors.outbundCallerIdName.message
                                        }
                                      />
                                    )}
                                  </div>
                                  <div className="col-7 ps-2">
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
                                      <ErrorMessage
                                        text={
                                          errors.outbundCallerIdNumber.message
                                        }
                                      />
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </form>
                        </div>
                        <div
                          className="tab-pane fade"
                          id="nav-voicemail"
                          role="tabpanel"
                          aria-labelledby="nav-voicemail-tab"
                          tabIndex="0"
                        >
                          <form className="row col-12 mx-auto">
                            <div className="formRow col-xl-3 col-md-12 col-12">
                              <div className="formLabel">
                                <label htmlFor="">
                                  Voicemail Password{" "}
                                  <span className="text-danger">*</span>
                                </label>
                                <label htmlFor="data" className="formItemDesc">
                                  Enter the numeric voicemail password here.
                                </label>
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
                                  <ErrorMessage
                                    text={errors.voicemail_password.message}
                                  />
                                )}
                              </div>
                            </div>
                            <div className="formRow col-xl-3 col-md-12 col-12">
                              <div className="formLabel">
                                <label htmlFor="selectFormRow">
                                  Voicemail Enabled
                                </label>
                                <label htmlFor="data" className="formItemDesc">
                                  Enable/disable voicemail for this extension.
                                </label>
                              </div>
                              <div className="col-xl-6 col-12">
                                <select
                                  className="formItem"
                                  name=""
                                  {...register("voicemailEnabled")}
                                  defaultValue={"N"}
                                >
                                  <option value="" disabled>
                                    Select Voicemail
                                  </option>
                                  <option value="Y">True</option>
                                  <option value="N">False</option>
                                </select>
                                {errors.voicemailEnabled && (
                                  <ErrorMessage
                                    text={errors.voicemailEnabled.message}
                                  />
                                )}
                              </div>
                            </div>
                            <div className="formRow col-xl-3 col-md-12 col-12 ">
                              <div className="formLabel">
                                <label htmlFor="selectFormRow">
                                  Voicemail Mail To
                                </label>
                                <label htmlFor="data" className="formItemDesc">
                                  Enter the email address to send voicemail to
                                  (optional).
                                </label>
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
                                  <ErrorMessage
                                    text={errors.voiceEmailTo.message}
                                  />
                                )}
                              </div>
                            </div>
                            <div className="formRow col-xl-3 col-md-12 col-12">
                              <div className="formLabel">
                                <label htmlFor="selectFormRow">
                                  Voicemail File
                                </label>
                                <label htmlFor="data" className="formItemDesc">
                                  Select a listening option to include with the
                                  email notification.
                                </label>
                              </div>
                              <div className="col-xl-6 col-12">
                                <select
                                  className="formItem"
                                  name=""
                                  {...register("voiceMailFile", {})}
                                >
                                  <option value="" disabled>
                                    Select Voicemail File
                                  </option>
                                  <option value="audio">
                                    Audio File Attachment
                                  </option>
                                  <option value="listen">
                                    Listen Link (Login Required)
                                  </option>
                                  <option value="download">
                                    Download Link (No Login Required)
                                  </option>
                                </select>
                                {errors.voiceMailFile && (
                                  <ErrorMessage
                                    text={errors.voiceMailFile.message}
                                  />
                                )}
                              </div>
                            </div>
                            <div className="formRow col-xl-3 col-md-12 col-12">
                              <div className="formLabel">
                                <label htmlFor="selectFormRow">
                                  Voicemail Keep Local
                                </label>
                                <label htmlFor="data" className="formItemDesc">
                                  Choose whether to keep the voicemail in the
                                  system after sending the email notification.
                                </label>
                              </div>
                              <div className="col-xl-6 col-12">
                                <select
                                  className="formItem"
                                  name=""
                                  {...register("voiceMailkeepFile")}
                                  defaultValue={"false"}
                                >
                                  <option value="" disabled>
                                    Select Status
                                  </option>
                                  <option value="true">True</option>
                                  <option value="false">False</option>
                                </select>
                                {errors.voiceMailkeepFile && (
                                  <ErrorMessage
                                    text={errors.voiceMailkeepFile.message}
                                  />
                                )}
                              </div>
                            </div>
                          </form>
                        </div>
                        <div
                          className="tab-pane fade"
                          id="nav-device"
                          role="tabpanel"
                          aria-labelledby="nav-device-tab"
                          tabIndex="0"
                        >
                          <form className="col-12 mx-auto">
                            <div className="formRow col-xl-3 col-md-12 col-12">
                              <div className="formLabel">
                                <label htmlFor="">Address</label>
                                <label htmlFor="data" className="formItemDesc">
                                  Enter the address.
                                </label>
                              </div>
                              <div className="col-xl-6 col-12">
                                <input
                                  type="text"
                                  name="extension"
                                  className="formItem"
                                />
                              </div>
                            </div>
                            <div className="formRow col-xl-3 col-md-12 col-12">
                              <div className="formLabel">
                                <label htmlFor="">Transport</label>
                                <label htmlFor="data" className="formItemDesc">
                                  Select a transport
                                </label>
                              </div>
                              <div className="col-xl-6 col-12">
                                <input
                                  type="text"
                                  name="extension"
                                  className="formItem"
                                />
                              </div>
                            </div>
                          </form>
                        </div>
                        <div
                          className="tab-pane fade"
                          id="nav-adv"
                          role="tabpanel"
                          aria-labelledby="nav-adv-tab"
                          tabIndex="0"
                        >
                          <form className="row col-12 mx-auto">
                            <div className="formRow col-xl-3 col-md-12 col-12">
                              <div className="formLabel">
                                <label htmlFor="">Directory Full Name</label>
                                <label htmlFor="data" className="formItemDesc">
                                  Enter the first name followed by the last
                                  name.
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
                                  <ErrorMessage
                                    text={errors.directoryFullname.message}
                                  />
                                )}
                              </div>
                            </div>
                            <div className="formRow col-xl-3 col-md-12 col-12">
                              <div className="formLabel">
                                <label htmlFor="selectFormRow">
                                  Directory Extension Visible
                                </label>
                                <label htmlFor="data" className="formItemDesc">
                                  Select whether to announce the extension when
                                  calling the directory.
                                </label>
                              </div>
                              <div className="col-xl-6 col-12">
                                <select
                                  className="formItem"
                                  name=""
                                  {...register("directoryExtensionVisible")}
                                  defaultValue={"false"}
                                >
                                  <option value="" disabled>
                                    Select Visibility
                                  </option>
                                  <option value="true">True</option>
                                  <option value="false">False</option>
                                </select>
                                {errors.directoryExtensionVisible && (
                                  <ErrorMessage
                                    text={
                                      errors.directoryExtensionVisible.message
                                    }
                                  />
                                )}
                              </div>
                            </div>
                            <div className="formRow col-xl-3 col-md-12 col-12">
                              <div className="formLabel">
                                <label htmlFor="selectFormRow">
                                  Max Registrations
                                </label>
                                <label htmlFor="data" className="formItemDesc">
                                  Enter the maximum concurrent registrations
                                  allowed.
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
                                  <ErrorMessage
                                    text={errors.maxRegistration.message}
                                  />
                                )}
                              </div>
                            </div>
                            <div className="formRow col-xl-3 col-md-12 col-12">
                              <div className="formLabel">
                                <label htmlFor="selectFormRow">Limit Max</label>
                                <label htmlFor="data" className="formItemDesc">
                                  Enter the maximum number of concurrent
                                  outbound calls allowed.
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
                                  <ErrorMessage
                                    text={errors.limitMax.message}
                                  />
                                )}
                              </div>
                            </div>
                            <div className="formRow col-xl-3 col-md-12 col-12">
                              <div className="formLabel">
                                <label htmlFor="selectFormRow">
                                  Limit Destination
                                </label>
                                <label htmlFor="data" className="formItemDesc">
                                  Enter the destination to send the calls when
                                  the max number of outgoing calls has been
                                  reached.
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
                            <div className="formRow col-xl-3 col-md-12 col-12 ">
                              <div className="formLabel">
                                <label htmlFor="selectFormRow">
                                  Missed Call
                                </label>
                                <label htmlFor="data" className="formItemDesc">
                                  Select the notification type, and enter the
                                  appropriate destination.
                                </label>
                              </div>
                              <div className="col-xl-6 col-12">
                                <select
                                  className="formItem"
                                  name=""
                                  {...register("missedCall")}
                                  defaultValue={"none"}
                                >
                                  <option value="" disabled>
                                    Select Notification Type
                                  </option>
                                  <option value="email">Email</option>
                                  <option value="none">None</option>
                                </select>
                                {errors.missedCall && (
                                  <ErrorMessage
                                    text={errors.missedCall.message}
                                  />
                                )}
                              </div>
                            </div>
                            <div className="formRow col-xl-3 col-md-12 col-12">
                              <div className="formLabel">
                                <label htmlFor="selectFormRow">
                                  Toll Allow
                                </label>
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
                                  <ErrorMessage
                                    text={errors.tollAllowValue.message}
                                  />
                                )}
                              </div>
                            </div>
                            <div className="formRow col-xl-3 col-md-12 col-12">
                              <div className="formLabel">
                                <label htmlFor="selectFormRow">
                                  Call Timeout
                                </label>
                                <label htmlFor="data" className="formItemDesc">
                                  Enter the ring time (delay in seconds) before
                                  sending a call to voicemail.
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
                          </form>
                        </div>
                        <div
                          className="tab-pane fade show "
                          id="nav-call-setting"
                          role="tabpanel"
                          aria-labelledby="nav-call-setting-tab"
                          tabIndex="0"
                        >
                          <div
                            className="col-12"
                            style={{ padding: "25px 23px" }}
                          >
                            <form className="row">
                              <div className="formRow col-xl-3 col-md-12 col-12">
                                <div className="formLabel">
                                  <label className="text-dark">On Busy</label>
                                  <label
                                    htmlFor="data"
                                    className="formItemDesc"
                                  >
                                    If enabled, it overrides the value of
                                    voicemail enabling in extension
                                  </label>
                                </div>
                                <div
                                  className={
                                    watch().onbusy == "disabled"
                                      ? "col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12"
                                      : "col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-3 col-12 pe-2 ms-auto"
                                  }
                                >
                                  {watch().onbusy != "disabled" && (
                                    <div className="formLabel">
                                      <label className="formItemDesc">
                                        Type
                                      </label>
                                    </div>
                                  )}
                                  <select
                                    className="formItem"
                                    style={{ width: "100%" }}
                                    name="onbusy"
                                    defaultValue={"disabled"}
                                    value={watch().onbusy}
                                    {...register("onbusy")}
                                    onChange={(e) => {
                                      register("onbusy").onChange(e);
                                      setValue("onbusyTo", "");
                                    }}
                                  >
                                    <option value={"disabled"}>Disabled</option>
                                    <option value={"pstn"}>PSTN</option>
                                    <option value={"extension"}>
                                      Extension
                                    </option>
                                    <option value={"ring group"}>
                                      Ring Group
                                    </option>
                                    <option value={"call center"}>
                                      Call Center
                                    </option>
                                    <option value={"ivr"}>IVR</option>
                                  </select>
                                </div>
                                {watch().onbusy == "disabled" ||
                                  watch().onbusy == "1" ? (
                                  ""
                                ) : (
                                  <>
                                    {watch("onbusy") !== "pstn" && (
                                      <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-3 col-12">
                                        {watch().onbusy &&
                                          watch().onbusy?.length !== 0 && (
                                            <>
                                              <div className="formLabel">
                                                <label className="formItemDesc">
                                                  Extension
                                                </label>
                                              </div>
                                              <ActionList
                                                category={watch().onbusy}
                                                title={null}
                                                label={null}
                                                getDropdownValue={
                                                  actionForOnBusy
                                                }
                                                value={watch().onbusyTo}
                                                {...register("onbusyTo")}
                                              />
                                            </>
                                          )}
                                        {errors.onbusyTo && (
                                          <ErrorMessage
                                            text={errors.onbusyTo.message}
                                          />
                                        )}
                                      </div>
                                    )}
                                    {watch("onbusy") === "pstn" && (
                                      <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-3 col-12">
                                        <div className="formLabel">
                                          <label className="formItemDesc">
                                            PSTN
                                          </label>
                                        </div>
                                        <input
                                          type="number"
                                          name="onbusyTo"
                                          className="formItem"
                                          {...register("onbusyTo", {
                                            required: "PSTN is required",
                                            pattern: {
                                              value: /^[0-9]*$/,
                                              message:
                                                "Only digits are allowed",
                                            },
                                            minLength: {
                                              value: 10,
                                              message:
                                                "Must be at least 10 digits",
                                            },

                                            ...noSpecialCharactersValidator,
                                          })}
                                        />
                                        {errors.onbusyTo && (
                                          <ErrorMessage
                                            text={errors.onbusyTo.message}
                                          />
                                        )}
                                      </div>
                                    )}
                                  </>
                                )}
                              </div>
                              <div className="formRow col-xl-3 col-md-12 col-12">
                                <div className="formLabel">
                                  <label className="text-dark">No Answer</label>
                                  <label
                                    htmlFor="data"
                                    className="formItemDesc"
                                  >
                                    If enabled, it overrides the value of
                                    voicemail enabling in extension
                                  </label>
                                </div>
                                <div
                                  className={
                                    watch().noanswer === "Forward"
                                      ? "col-xxl-3 col-xl-3 col-lg-6 col-md-6 col-sm-6 col-12 pe-2 ms-auto"
                                      : "col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12"
                                  }
                                >
                                  <div className="formLabel">
                                    <label className="formItemDesc">
                                      Status
                                    </label>
                                  </div>
                                  <select
                                    className="formItem me-0"
                                    style={{ width: "100%" }}
                                    name="delay"
                                    {...register("noanswer")}
                                    defaultValue={"Disabled"}
                                  >
                                    <option>Disabled</option>
                                    <option>Voicemail</option>
                                    <option>Forward</option>
                                  </select>
                                </div>
                                {watch().noanswer === "Forward" ? (
                                  <>
                                    <div className="col-xxl-3 col-xl-3 col-lg-6 col-md-6 col-sm-6 col-12">
                                      <div className="formLabel">
                                        <label className="formItemDesc">
                                          Destinations
                                        </label>

                                        {errors.noanswerTo ? (
                                          <ErrorMessage
                                            text={errors.noanswerTo.message}
                                          />
                                        ) : (
                                          ""
                                        )}
                                      </div>
                                      <div className="col-12">
                                        <ActionList
                                          title={null}
                                          getDropdownValue={actionListValue1}
                                          value={watch().noanswerTo}
                                        />
                                      </div>
                                    </div>
                                  </>
                                ) : (
                                  ""
                                )}
                              </div>
                              <div className="formRow col-xl-3 col-md-12 col-12">
                                <div className="formLabel">
                                  <label className="text-dark">
                                    Not Registered
                                  </label>
                                  <label
                                    htmlFor="data"
                                    className="formItemDesc"
                                  >
                                    If endpoint is not reachable, forward to
                                    this destination before going to voicemail
                                  </label>
                                </div>
                                <div
                                  className={
                                    watch().notregistered == "disabled"
                                      ? "col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12"
                                      : "col-xxl-3 col-xl-3 col-lg-6 col-md-6 col-sm-6 col-12 pe-2 ms-auto"
                                  }
                                >
                                  {watch().notregistered != "disabled" && (
                                    <div className="formLabel">
                                      <label className="formItemDesc">
                                        Type
                                      </label>
                                    </div>
                                  )}
                                  <select
                                    className="formItem"
                                    name="notregistered"
                                    defaultValue={"disabled"}
                                    value={watch().notregistered}
                                    {...register("notregistered")}
                                    onChange={(e) => {
                                      register("notregistered").onChange(e);
                                      setValue("notregisteredTo", "");
                                    }}
                                  >
                                    <option value={"disabled"}>Disabled</option>
                                    <option value={"pstn"}>PSTN</option>
                                    <option value={"extension"}>
                                      Extension
                                    </option>
                                    <option value={"ring group"}>
                                      Ring Group
                                    </option>
                                    <option value={"call center"}>
                                      Call Center
                                    </option>
                                    <option value={"ivr"}>IVR</option>
                                  </select>
                                </div>
                                {watch().notregistered == "disabled" ? (
                                  ""
                                ) : (
                                  <>
                                    {watch("notregistered") !== "pstn" && (
                                      <div className="col-xxl-3 col-xl-3 col-lg-6 col-md-6 col-sm-6 col-12">
                                        {watch().notregistered &&
                                          watch().notregistered?.length !==
                                          0 && (
                                            <>
                                              <div className="formLabel">
                                                <label className="formItemDesc">
                                                  Extension
                                                </label>
                                              </div>
                                              <ActionList
                                                category={watch().notregistered}
                                                title={null}
                                                label={null}
                                                getDropdownValue={
                                                  actionForNotRegistered
                                                }
                                                value={watch().notregisteredTo}
                                                {...register("notregisteredTo")}
                                              />
                                            </>
                                          )}
                                        {errors.notregisteredTo && (
                                          <ErrorMessage
                                            text={
                                              errors.notregisteredTo.message
                                            }
                                          />
                                        )}
                                      </div>
                                    )}
                                    {watch("notregistered") === "pstn" && (
                                      <div className="col-xxl-3 col-xl-3 col-lg-6 col-md-6 col-sm-6 col-12">
                                        <div className="formLabel">
                                          <label className="formItemDesc">
                                            PSTN
                                          </label>
                                        </div>
                                        <input
                                          type="number"
                                          name="notregisteredTo"
                                          className="formItem"
                                          {...register("notregisteredTo", {
                                            required: "PSTN is required",
                                            pattern: {
                                              value: /^[0-9]*$/,
                                              message:
                                                "Only digits are allowed",
                                            },
                                            minLength: {
                                              value: 10,
                                              message:
                                                "Must be at least 10 digits",
                                            },

                                            ...noSpecialCharactersValidator,
                                          })}
                                        />
                                        {errors.notregisteredTo && (
                                          <ErrorMessage
                                            text={
                                              errors.notregisteredTo.message
                                            }
                                          />
                                        )}
                                      </div>
                                    )}
                                  </>
                                )}
                              </div>
                              <div className="formRow col-xl-3 col-md-12 col-12">
                                <div className="formLabel">
                                  <label className="text-dark">Follow Me</label>
                                  <label
                                    htmlFor="data"
                                    className="formItemDesc"
                                  >
                                    Select and configure the Follow Me Status
                                  </label>
                                </div>
                                <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                                  <div className="formLabel">
                                    <label className="formItemDesc">
                                      Status
                                    </label>
                                  </div>
                                  <select
                                    className="formItem me-0"
                                    style={{ width: "100%" }}
                                    name="delay"
                                    {...register("followme")}
                                    defaultValue={"0"}
                                  >
                                    <option value={"1"}>Enabled</option>
                                    <option value={"0"}>Disabled</option>
                                  </select>
                                </div>
                                {watch().followme === "0" ||
                                  watch().followme === 0 ? (
                                  ""
                                ) : (
                                  <div className="col-xl-12 px-0 border-0 col-12">
                                    <div className="row">
                                      <div className="col-xxl-3 col-xl-3 col-lg-6 col-md-6 col-sm-6 col-12 ">
                                        <div className="formLabel">
                                          <label className="formItemDesc">
                                            Destinations Type
                                          </label>
                                        </div>
                                        <div className="position-relative">
                                          <select
                                            className="formItem"
                                            name="destinationType"
                                            id="destinationType"
                                            onChange={(e) => {
                                              setCallSetting((prevData) => ({
                                                ...prevData,
                                                followMeDestinationType:
                                                  e.target.value,
                                                followMeDestination: "",
                                              }));
                                            }}
                                            defaultValue={
                                              callSetting.followMeDestinationType
                                            }
                                          >
                                            <option value="pstn">PSTN</option>
                                            <option value="extension">
                                              Extension
                                            </option>
                                            <option value="call center">
                                              Call Center
                                            </option>
                                            <option value="ring group">
                                              Ring Group
                                            </option>
                                            <option value="ivr">IVR</option>
                                          </select>
                                        </div>
                                      </div>
                                      <div className="col-xxl-3 col-xl-3 col-lg-6 col-md-6 col-sm-6 col-12 ">
                                        <div className="formLabel">
                                          <label className="formItemDesc">
                                            Destination
                                          </label>
                                        </div>
                                        {callSetting.followMeDestinationType ? (
                                          <>
                                            {callSetting.followMeDestinationType !==
                                              "pstn" ? (
                                              <div className="w-full">
                                                <ActionList
                                                  category={
                                                    callSetting.followMeDestinationType
                                                  }
                                                  title={null}
                                                  label={null}
                                                  getDropdownValue={
                                                    forwardToValueDestination
                                                  }
                                                  value={
                                                    callSetting.followMeDestination
                                                  }
                                                  {...register(
                                                    "destination_forward_to",
                                                    {
                                                      required:
                                                        "This field is required",
                                                      ...(callSetting.followMeDestinationType !==
                                                        "pstn"
                                                        ? {
                                                          minLength: {
                                                            value: 4,
                                                            message:
                                                              "Must be at least 4 digits",
                                                          },
                                                        }
                                                        : {}),
                                                    }
                                                  )}
                                                />
                                                {errors?.destination_forward_to && (
                                                  <ErrorMessage
                                                    text={
                                                      errors
                                                        .destination_forward_to
                                                        .message
                                                    }
                                                  />
                                                )}
                                              </div>
                                            ) : (
                                              <div className="w-full">
                                                <input
                                                  type="number"
                                                  name="destination_forward_to"
                                                  value={
                                                    callSetting.followMeDestination
                                                  }
                                                  className="formItem"
                                                  {...register(
                                                    "destination_forward_to",
                                                    {
                                                      required:
                                                        "PSTN is required",
                                                      pattern: {
                                                        value: /^[0-9]*$/,
                                                        message:
                                                          "Only digits are allowed",
                                                      },
                                                      ...(callSetting.followMeDestinationType ===
                                                        "pstn"
                                                        ? {
                                                          minLength: {
                                                            value: 10,
                                                            message:
                                                              "Must be at least 10 digits",
                                                          },
                                                        }
                                                        : {}),
                                                    }
                                                  )}
                                                  onChange={(e) => {
                                                    const newValue =
                                                      e.target.value;
                                                    setCallSetting((prev) => ({
                                                      ...prev,
                                                      followMeDestination:
                                                        newValue,
                                                    }));
                                                  }}
                                                />
                                                {errors?.destination_forward_to && (
                                                  <ErrorMessage
                                                    text={
                                                      errors
                                                        .destination_forward_to
                                                        .message
                                                    }
                                                  />
                                                )}
                                              </div>
                                            )}
                                          </>
                                        ) : (
                                          <>
                                            {watch("destinationType") !==
                                              "pstn" ? (
                                              <div className="w-full">
                                                <ActionList
                                                  category={watch(
                                                    "destinationType"
                                                  )}
                                                  title={null}
                                                  label={null}
                                                  getDropdownValue={
                                                    forwardToValueDestination
                                                  }
                                                  value={
                                                    watch().destination_forward_to
                                                  }
                                                  {...register(
                                                    "destination_forward_to",
                                                    {
                                                      required:
                                                        "This field is required",
                                                      minLength: {
                                                        value: 4,
                                                        message:
                                                          "Must be at least 4 digits",
                                                      },
                                                    }
                                                  )}
                                                />
                                                {errors.destination_forward_to && (
                                                  <ErrorMessage
                                                    text={
                                                      errors
                                                        .destination_forward_to
                                                        .message
                                                    }
                                                  />
                                                )}
                                              </div>
                                            ) : (
                                              <div className="w-full">
                                                <input
                                                  type="number"
                                                  name="destination_forward_to"
                                                  className="formItem"
                                                  {...register(
                                                    "destination_forward_to",
                                                    {
                                                      required:
                                                        "PSTN is required",
                                                      pattern: {
                                                        value: /^[0-9]*$/,
                                                        message:
                                                          "Only digits are allowed",
                                                      },
                                                      minLength: {
                                                        value: 10,
                                                        message:
                                                          "Must be at least 10 digits",
                                                      },
                                                    }
                                                  )}
                                                />
                                                {errors.destination_forward_to && (
                                                  <ErrorMessage
                                                    text={
                                                      errors
                                                        .destination_forward_to
                                                        .message
                                                    }
                                                  />
                                                )}
                                              </div>
                                            )}
                                          </>
                                        )}
                                      </div>
                                      <div className="col-xxl-3 col-xl-3 col-lg-6 col-md-6 col-sm-6 col-12">
                                        <div className="formLabel">
                                          <label className="formItemDesc">
                                            Timeout
                                          </label>
                                        </div>
                                        <select
                                          className="formItem me-0"
                                          style={{ width: "100%" }}
                                          name="timeOut"
                                          value={callSetting.followMeTimeOut}
                                          onChange={(e) =>
                                            setCallSetting((prevState) => ({
                                              ...prevState,
                                              followMeTimeOut: parseInt(
                                                e.target.value
                                              ),
                                            }))
                                          }
                                        >
                                          {(() => {
                                            const numbers = [];
                                            for (let i = 0; i <= 100; i++) {
                                              if (i % 5 === 0) {
                                                numbers.push(
                                                  <span key={i}>{i}</span>
                                                );
                                              }
                                            }
                                            return numbers.map((item) => {
                                              return <option>{item}</option>;
                                            });
                                          })()}
                                        </select>
                                      </div>
                                      <div className="col-xxl-3 col-xl-3 col-lg-6 col-md-6 col-sm-6 col-12 ">
                                        <div className="formLabel">
                                          <label className="formItemDesc">
                                            Prompt
                                          </label>
                                        </div>

                                        <select
                                          className="formItem me-0"
                                          style={{ width: "100%" }}
                                          value={callSetting.followMePrompt}
                                          onChange={(e) =>
                                            setCallSetting((prevState) => ({
                                              ...prevState,
                                              followMePrompt: e.target.value,
                                            }))
                                          }
                                          name="prompt"
                                        >
                                          <option className="status">
                                            Prompt
                                          </option>
                                          <option value="confirm">Confirm</option>
                                        </select>
                                      </div>
                                    </div>
                                    <label
                                      htmlFor="data"
                                      className="formItemDesc"
                                    >
                                      Add destinations and parameters for follow
                                      me.
                                    </label>
                                  </div>
                                )}
                              </div>
                              <div className="formRow col-xl-3 col-md-12 col-12">
                                <div className="formLabel">
                                  <label className="text-dark">
                                    Do Not Disturb Status
                                  </label>
                                </div>
                                <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                                  <select
                                    className="formItem me-0"
                                    style={{ width: "100%" }}
                                    name="delay"
                                    {...register("dnd")}
                                    defaultValue={0}
                                  >
                                    <option value={1}>Enabled</option>
                                    <option value={0}>Disabled</option>
                                  </select>
                                </div>
                              </div>
                              <div className="formRow col-xl-3 col-md-12 col-12">
                                <div className="formLabel">
                                  <label className="text-dark">
                                    Call Blocking Status
                                  </label>
                                </div>
                                <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                                  <select
                                    className="formItem me-0"
                                    style={{ width: "100%" }}
                                    name="delay"
                                    {...register("callblocking")}
                                  >
                                    <option>Disabled</option>
                                    <option>All</option>
                                    <option>Incoming</option>
                                    <option>Outgoing</option>
                                  </select>
                                </div>
                              </div>

                              <div className="formRow col-xl-3 col-md-12 col-12">
                                <div className="formLabel">
                                  <label htmlFor="">Forward Extension</label>
                                  <label
                                    htmlFor="data"
                                    className="formItemDesc"
                                  >
                                    Want to forward Number.
                                  </label>
                                </div>
                                <div
                                  className={`col-${forwardStatus != "disabled"
                                    ? "col-xxl-3 col-xl-3 col-lg-6 col-md-6 col-sm-6 col-12  pe-2 ms-auto"
                                    : "col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12"
                                    }`}
                                >
                                  {forwardStatus != "disabled" && (
                                    <div className="formLabel">
                                      <label className="formItemDesc">
                                        Type
                                      </label>
                                    </div>
                                  )}
                                  <select
                                    className="formItem"
                                    name="forward"
                                    {...register("forward")}
                                    defaultValue={"disabled"}
                                  >
                                    <option value="disabled">Disable</option>
                                    <option value="pstn">PSTN</option>
                                    {/* <option value="direct">Direct</option> */}
                                    <option value="extension">Extension</option>
                                    <option value="call center">
                                      Call Center
                                    </option>
                                    <option value="ring group">
                                      Ring Group
                                    </option>
                                    <option value="ivr">IVR</option>
                                  </select>
                                </div>

                                {watch("forward") !== "pstn" &&
                                  watch("forward") !== "disabled" && (
                                    <div className="col-xxl-3 col-xl-3 col-lg-6 col-md-6 col-sm-6 col-12">
                                      <div className="formLabel">
                                        <label className="formItemDesc">
                                          Extension
                                        </label>
                                      </div>
                                      <ActionList
                                        category={watch().forward}
                                        title={null}
                                        label={null}
                                        getDropdownValue={forwardToValue}
                                        value={watch().forward_to}
                                        {...register("forward_to")}
                                      />
                                      {errors.forward_to && (
                                        <ErrorMessage
                                          text={errors.forward_to.message}
                                        />
                                      )}
                                    </div>
                                  )}
                                {watch("forward") === "pstn" && (
                                  <div className="col-xxl-3 col-xl-3 col-lg-6 col-md-6 col-sm-6 col-12">
                                    <div className="formLabel">
                                      <label className="formItemDesc">
                                        PSTN
                                      </label>
                                    </div>
                                    <input
                                      type="number"
                                      name="forward_to"
                                      className="formItem"
                                      {...register("forward_to", {
                                        required: "PSTN is required",
                                        pattern: {
                                          value: /^[0-9]*$/,
                                          message: "Only digits are allowed",
                                        },
                                        minLength: {
                                          value: 10,
                                          message: "Must be at least 10 digits",
                                        },

                                        ...noSpecialCharactersValidator,
                                      })}
                                    />
                                    {errors.forward_to && (
                                      <ErrorMessage
                                        text={errors.forward_to.message}
                                      />
                                    )}
                                  </div>
                                )}
                              </div>
                            </form>
                          </div>
                        </div>
                      </div>
                      <div />
                    </form>
                  </div>
                </div>
              </div>
            </div>
          )}
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
                          if (item.id == "") {
                            return item.username;
                          }
                        })}
                      ?
                    </p>
                    <div className="d-flex justify-content-between">
                      <button
                        className="panelButton m-0"
                        onClick={() => {
                          // setForce(true);
                          setPopUp(false);
                          // handleSubmit("force");
                          handleFormSubmit("force");
                        }}
                      >
                        <span className="text">Confirm</span>
                        <span className="icon">
                          <i className="fa-solid fa-check"></i>
                        </span>
                      </button>
                      <button
                        className="panelButton gray m-0 float-end"
                        onClick={() => setPopUp(false)}
                      >
                        <span className="text">Cancel</span>
                        <span className="icon">
                          <i className="fa-solid fa-xmark"></i>
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          ""
        )}
        {showMusic && (
          <AddMusic
            show={showMusic}
            setShow={setShowMusic}
            setUploadedMusic={setUploadedMusic}
            setMusicRefresh={setMusicRefresh}
            musicRefresh={musicRefresh}
            listArray={["hold"]}
          />
        )}
      </section>
    </main>
  );
};

export default ExtensionsEdit;
