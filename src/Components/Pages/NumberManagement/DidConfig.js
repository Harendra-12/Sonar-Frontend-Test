/* eslint-disable eqeqeq */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import Header from "../../CommonComponents/Header";
import { useLocation, useNavigate } from "react-router-dom";
import {
  aiGeneralGetFunction,
  backToTop,
  generalGetFunction,
  generalPostFunction,
  generalPutFunction,
} from "../../GlobalFunction/globalFunction";
import ActionList from "../../CommonComponents/ActionList";
import { useForm } from "react-hook-form";
import ErrorMessage from "../../CommonComponents/ErrorMessage";
import {
  noSpecialCharactersValidator,
  rangeValidator,
  requiredValidator,
} from "../../validations/validation";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import Tippy from "@tippyjs/react";
import SkeletonFormLoader from "../../Loader/SkeletonFormLoader";
import AddMusic from "../../CommonComponents/AddMusic";

const DidConfig = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const locationData = location.state;
  // const [dataAvailable, setDataAvailable] = useState(true);
  const account = useSelector((state) => state.account);
  const newAddDid = useSelector((state) => state.newAddDid);
  const [holdMusic, setHoldMusic] = useState();
  const [loading, setLoading] = useState(true);
  const [showMusic, setShowMusic] = useState(false);
  const [uploadedMusic, setUploadedMusic] = useState();
  const [availableAgents, setAvailableAgents] = useState([]);
  const [musicRefresh, setMusicRefresh] = useState(0);
  const {
    register,
    setError: setErr,
    formState: { errors },
    handleSubmit,
    setValue,
    watch,
    reset
  } = useForm();

  useEffect(() => {
    if (locationData.configuration !== null) {
      console.log("Location Data: ", locationData.configuration);
      // setDataAvailable(false);

      setValue("usages", locationData.configuration.usages || "none");
      setValue("did_id_view", locationData.did || "");
      setValue("forward", locationData.configuration.forward || "");
      setValue("forward_action", locationData.configuration.forward_to || "");
      setValue("forward_to", locationData.configuration.forward_to || "");
      setValue("action", locationData.configuration.action || "");
      setValue("hold_music", locationData.configuration.hold_music || "");
      setValue(
        "stick_agent_expires",
        locationData.configuration.stick_agent_expires || null
      );
      setValue(
        "stick_agent_type",
        locationData.configuration.stick_agent_type || null
      );
      setValue(
        "sticky_agent_timeout",
        locationData.configuration.sticky_agent_timeout || null
      );
      setValue("tag", locationData.configuration.tag || "");
      setValue(
        "record",
        locationData.configuration.record === 0 ? false : true || ""
      );
      setValue(
        "status",
        locationData.configuration.status === 0 ? false : true || ""
      );
      setValue(
        "sticky_agent_enable",
        locationData.configuration.sticky_agent_enable === 0
          ? false
          : true || ""
      );
      setValue(
        "spam_filter_type",
        locationData.configuration.spam_filter_type || "1"
      );
      setValue(
        "missedcall_type",
        locationData.configuration.missedcall_type || "disable"
      );
      setValue("email", locationData.configuration.email || "");
      setValue("sms", Number(locationData.configuration.sms) || "");
      setValue(
        "dtmf_type",
        locationData.configuration.dtmf_type || "random_digit"
      );
      setValue("dtmf_length", locationData.configuration.dtmf_length || "3");
      setValue("dtmf_retries", locationData.configuration.dtmf_retries || "3");
      setValue(
        "dtmf_retry_file_sound",
        locationData.configuration.dtmf_retry_file_sound || ""
      );
    } else {
      setValue("usages", "extension" || []);
    }
  }, [locationData]);

  useEffect(() => {
    if (account && account.id) {
      async function getData() {
        setLoading(true);
        const holdMusic = await generalGetFunction("/sound/all?type=hold");
        setLoading(false);
        if (holdMusic?.status) {
          setHoldMusic(holdMusic.data);
          if (holdMusic.data.length > 0 && uploadedMusic) {
            setValue("hold_music", uploadedMusic.id);
          }
        } else {
          // navigate("/");
        }
      }
      getData();
    } else {
      setLoading(false);
      navigate("/");
    }
  }, [navigate, account, musicRefresh]);

  useEffect(() => {
    if (locationData) {
      setValue("did_id_view", locationData.did || "");
    } else {
      console.warn(
        "Location data is undefined or missing expected properties."
      );
    }

    // register("usages", {
    //   validate: usagesValidator.validate,
    //   ...requiredValidator,
    // });
    register("did_id_view", { required: true });
  }, [register, setValue]);

  useEffect(() => {
    if (watch("forward") === "disabled") {
      setValue("forward_to", "");
      setValue("forward_action", "");
    } else if (watch("forward") === "pstn") {
      setValue("forward_action", "");
    } else if (watch("forward") === "direct") {
      setValue("forward_to", "");
    }
  }, [watch("forward"), setValue]);

  /**
   * Sets the value of the "action" field in the form to the first element
   * of the given array (value[0]).
   * @param {Array} value An array with the selected value as the first element.
   */
  const actionListValue = (value) => {
    setValue("action", value[0]);
  };
  const actionListValueForForward = (value) => {
    setValue("forward_action", value[0]);
  };
  // const directListValue = (value) => {
  //   setValue("direct_extension", value[0]);
  // };

  const forwardStatus = watch("forward", "disabled");

  const handleFormSubmit = handleSubmit(async (data) => {
    if (data.usages === "" || data.usages === null) {
      data.action = null;
      data.usages = null;
    }
    data.record = data.record === true || data.record === "true";
    data.sticky_agent_enable =
      data.sticky_agent_enable === true || data.sticky_agent_enable === "true";
    data.status = data.status === true || data.status === "true";
    if (!data.sticky_agent_enable) {
      delete data.stick_agent_type;
      delete data.stick_agent_expires;
      delete data.sticky_agent_timeout;
    }
    if (data.forward === "pstn" && !data.forward_to) {
      setErr("forward_to", {
        type: "required",
        message: "This field is required when forwarding to PSTN.",
      });
    } else if (data.forward === "pstn" && data.forward_to.length < 10) {
      setErr("forward_to", {
        type: "minLength",
        message: "Number must be at least 10 digits.",
      });
    } else if (data.forward !== "pstn" && !data.forward_action) {
      setErr("forward_action", {
        type: "required",
        message: "This field is required when forwarding directly.",
      });
    }
    // Final data preparation
    if (data.forward === "pstn") {
      data.forward_to = data.forward_to || "";
    } else if (data.forward !== "pstn") {
      data.forward_to = data.forward_action || "";
    } else {
      data.forward_to = "";
    }
    if (data.forward === "disabled") {
      delete data.forward_to;
    }
    delete data.forward_action;
    delete data.did_id;
    const payload = { ...data, did_id: locationData.id };

    if (locationData.configuration === null) {
      setLoading(true);
      const apiData = await generalPostFunction("/did/configure", payload);
      if (apiData?.status) {
        setLoading(false);
        toast.success(apiData.message);
        reset();
        navigate(-1);
      } else {
        setLoading(false);
        toast.error(apiData?.errors[Object.keys(apiData?.errors)[0]][0]);
        // toast.error(apiData.message);
      }
    }
    if (locationData.configuration) {
      setLoading(true);
      if (payload.action == "") {
        delete payload.action;
        delete payload.usages;
      }

      const apiData = await generalPutFunction(
        `/did/configure/update/${locationData.configuration.id}`,
        payload
      );
      if (apiData.status) {
        setLoading(false);
        toast.success(apiData.message);
        reset();
      } else {
        setLoading(false);
        toast.error(apiData?.errors[Object.keys(apiData?.errors)[0]]);
        // toast.error(apiData.message);
      }
    }
  });

  /**
   * Function to open the add music popup and reset the value of hold_music in the form
   */
  const handleAddMusic = () => {
    setValue("hold_music", "");
    setShowMusic(true);
  };

  useEffect(() => {
    if (newAddDid) {
      dispatch({
        type: "SET_NEWADDDID",
        newAddDid: null,
      });
    }
  }, [newAddDid]);

  // const handleSelectChange = (e) => {
  //   const value = e.target.value;

  //   if (value === "add_new_agent") {
  //     navigate("/ai-all-agent");
  //   }
  // };

  // Getting all agents and ai number details from db
  useEffect(() => {
    async function getData() {
      const allAgents = await aiGeneralGetFunction("/agent/all");
      const aiNumber = await aiGeneralGetFunction("/phonenumber/all");

      if (allAgents && aiNumber && allAgents.status && aiNumber.status) {
        aiNumber.data.map((item) => {
          allAgents.data.map((agent) => {
            if (item.inbound_agent_id === agent.agent_id) {
              agent["number"] = item.phone_number.replace("+", "");
              setAvailableAgents((prev) => [...prev, agent]);
            }
          });
        });
      }
    }
    getData();
  }, []);
  return (
    <>
      <main className="mainContent">
        <section id="phonePage">
            <Header title="Number Configuration" />
          {/* <div className="container-fluid px-0">
          </div> */}
          <div className="col-xl-12" style={{ overflow: "auto" }}>
            {loading ? (
              <div colSpan={99}>
                <SkeletonFormLoader />
              </div>
            ) : (
              <div className="overviewTableWrapper">
                <div className="overviewTableChild">
                  <div className="d-flex flex-wrap">
                    <div className="col-12">
                      <div className="heading">
                        <div className="content">
                          <h4>Destination Config</h4>
                          <p>
                            Inbound destinations are the DID/DDI, DINS or Alias
                            for inbound calls.
                          </p>
                        </div>
                        <div className="buttonGroup">
                          <button
                            onClick={() => {
                              navigate(-1);
                              backToTop();
                            }}
                            type="button"
                            className="panelButton gray"
                          >
                            <span className="text">Back</span>
                            <span className="icon">
                              <i className="fa-solid fa-caret-left"></i>
                            </span>
                          </button>
                          <button
                            className="panelButton"
                            onClick={handleFormSubmit}
                          >
                            <span className="text">
                              {locationData.configuration ? "Update" : "Save"}
                            </span>
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
                      <form className="row" onSubmit={handleSubmit(handleFormSubmit)}>
                        <div className="formRow col-xl-3">
                          <div className="formLabel">
                            <label htmlFor="">Selected DID</label>
                            <label htmlFor="data" className="formItemDesc">
                              Selected DID.
                            </label>
                          </div>
                          <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-12">
                            <input
                              type="text"
                              name="did_id_view"
                              className="formItem"
                              value={locationData.did && locationData.did}
                              disabled
                              {...register("did_id", {
                                ...noSpecialCharactersValidator,
                              })}
                            />

                            {errors.did_id && (
                              <ErrorMessage text={errors.did_id.message} />
                            )}
                          </div>
                        </div>

                        <div className="formRow col-xl-3">
                          <div className="formLabel mw-sm-100">
                            <label htmlFor="">
                              Usage
                              {/* <span className="text-danger">*</span> */}
                            </label>
                            <label htmlFor="data" className="formItemDesc">
                              Set how the Destination will be used.
                            </label>
                          </div>
                          <div
                            className={`${
                              watch().usages === "none" ? "col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-12" : "col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-6"
                            } pe-2 ms-auto`}
                          >
                            <select
                              className="formItem"
                              name="forward"
                              id="selectFormRow"
                              // onChange={(e) => setForwardEnable(e.target.value)}
                              defaultValue={"extension"}
                              value={watch().usages}
                              {...register("usages")}
                              onChange={(e) => {
                                // if (e.target.value === "agent") {
                                //   featureUnderdevelopment()
                                // } else {
                                // Trigger react-hook-form's built-in handling
                                register("usages").onChange(e);

                                // Clear the "action" field when "usages" changes
                                setValue("action", "");
                                // }
                              }}
                            >
                              <option value="none">None</option>
                              <option value="extension">Extension</option>
                              <option value="call center">Call Center</option>
                              <option value="ring group">Ring Group</option>
                              <option value="ivr">IVR</option>
                              <option value="aiagent">AI Agents</option>
                            </select>
                          </div>
                          {watch().usages &&
                            watch().usages !== "none" &&
                            watch().usages !== "aiagent" && (
                              <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-6">
                                <ActionList
                                  category={watch().usages}
                                  title={null}
                                  label={null}
                                  getDropdownValue={actionListValue}
                                  value={watch().action}
                                  {...register("action")}
                                />
                                {/* {errors.action && (
                              <ErrorMessage text={errors.action.message} />
                            )} */}
                              </div>
                            )}
                          {watch().usages && watch().usages === "aiagent" && (
                            <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-6">
                              <select
                                className="formItem"
                                name="forward"
                                id="selectFormRow"
                                // onChange={handleSelectChange}
                                value={watch().action}
                                {...register("action")}
                              >
                                <option value="">Select Agent</option>
                                {availableAgents.map((agent, key) => {
                                  return (
                                    <option key={key} value={agent.number}>
                                      {agent.agent_name}
                                    </option>
                                  );
                                })}

                                {/* <option
                                  value="add_new_agent"
                                  className="bg-primary text-center text-white"
                                >
                                  Add New Agent
                                </option> */}
                              </select>
                            </div>
                          )}
                        </div>

                        <div className="formRow col-xl-3">
                          <div className="formLabel">
                            <label htmlFor="">Direct Forward</label>
                            <label htmlFor="data" className="formItemDesc">
                              Want to forword DID.
                            </label>
                          </div>
                          <div
                            className={`${
                              forwardStatus != "disabled"
                                ? "col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-6 pe-2 ms-auto"
                                : "6 col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-12"
                            }`}
                          >
                            {forwardStatus != "disabled" && (
                              <div className="formLabel">
                                <label>Type</label>
                              </div>
                            )}
                            <select
                              className="formItem"
                              name="forward"
                              id="selectFormRow"
                              {...register("forward")}
                              defaultValue={"disabled"}
                              value={watch().forward}
                              onChange={(e) => {
                                register("forward").onChange(e);
                                setValue("forward_action", "");
                              }}
                            >
                              <option value="disabled">Disable</option>
                              <option value="pstn">PSTN</option>
                              {/* <option value="direct">Direct</option> */}
                              <option value="extension">Extension</option>
                              <option value="ring group">Ring Group</option>
                              <option value="call center">Call Center</option>
                              <option value="ivr">IVR</option>
                            </select>
                          </div>
                          {forwardStatus === "pstn" &&
                            forwardStatus != "disabled" && (
                              <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-6">
                                <div className="formLabel">
                                  <label>PSTN</label>
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

                          {/* {forwardStatus === "direct" && (
                            <div className="col-3">
                              <div className="formLabel">
                                <label>Extension</label>
                              </div>
                              <ActionList
                                getDropdownValue={directListValue}
                                value={watch().direct_extension}
                                title={null}
                                label={null}
                                {...register("direct_extension", {
                                  requiredValidator,
                                })}
                              />
                              {errors.direct_extension && (
                                <ErrorMessage
                                  text={errors.direct_extension.message}
                                />
                              )}
                            </div>
                          )} */}

                          {forwardStatus !== "pstn" &&
                            forwardStatus != "disabled" && (
                              <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-6">
                                {watch().forward &&
                                  watch().forward?.length !== 0 && (
                                    <>
                                      <div className="formLabel">
                                        <label>Extension</label>
                                      </div>
                                      <ActionList
                                        category={watch().forward}
                                        title={null}
                                        label={null}
                                        getDropdownValue={
                                          actionListValueForForward
                                        }
                                        value={watch().forward_action}
                                        {...register("forward_action")}
                                      />
                                    </>
                                  )}
                              </div>
                              // <div className="col-3">
                              // <div className="formLabel">
                              //   <label>Extension</label>
                              // </div>
                              // <ActionList
                              //   getDropdownValue={directListValue}
                              //   value={watch().direct_extension}
                              //   title={null}
                              //   label={null}
                              //   {...register("direct_extension", {
                              //     requiredValidator,
                              //   })}
                              // />
                              // {errors.direct_extension && (
                              //   <ErrorMessage
                              //     text={errors.direct_extension.message}
                              //   />
                              // )}
                              // </div>
                            )}
                        </div>
                        <div className="formRow col-xl-3">
                          <div className="formLabel">
                            <label htmlFor="selectFormRow">Prefix Tag</label>
                            <label htmlFor="data" className="formItemDesc">
                              Set a prefix tag for the destination
                            </label>
                          </div>
                          <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-12">
                            <input
                              type="text"
                              name="forward_to"
                              className="formItem"
                              {...register("tag", {})}
                            />
                            {errors?.tag && (
                              <ErrorMessage text={errors.tag.message} />
                            )}
                          </div>
                        </div>

                        <div className="formRow col-xl-3">
                          <div className="formLabel">
                            <label htmlFor="selectFormRow">Record</label>
                            <label htmlFor="data" className="formItemDesc">
                              Save the recording.
                            </label>
                          </div>
                          <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-12">
                            <select
                              className="formItem"
                              name=""
                              id="selectFormRow"
                              {...register("record")}
                              defaultValue={"false"}
                            >
                              <option selected="" value="true">
                                True
                              </option>
                              <option value="false">False</option>
                            </select>
                          </div>
                        </div>

                        <div className="formRow col-xl-3">
                          <div className="formLabel">
                            <label htmlFor="selectFormRow">Hold Music</label>
                            <label htmlFor="data" className="formItemDesc">
                              Save the recording.
                            </label>
                          </div>
                          <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-12">
                            <select
                              className="formItem"
                              name=""
                              id="selectFormRow"
                              {...register("hold_music")}
                              // value={watch().hold_music}

                              onChange={(e) => {
                                const selectedValue = e.target.value;
                                if (selectedValue === "add-music") {
                                  handleAddMusic(); // Call your function here
                                }
                              }}
                            >
                              <option value="default">default</option>
                              {holdMusic &&
                                holdMusic.map((ring) => {
                                  return (
                                    <option key={ring.id} value={ring.id}>
                                      {ring.name}
                                    </option>
                                  );
                                })}
                              <option
                                className="bg-primary text-center text-white"
                                style={{ cursor: "pointer" }}
                                value="add-music"
                              >
                                Add music
                              </option>
                            </select>
                          </div>
                        </div>

                        <div className="formRow col-xl-3">
                          <div className="formLabel">
                            <label htmlFor="selectFormRow">Status</label>
                          </div>
                          <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-12">
                            <select
                              className="formItem"
                              name=""
                              id="selectFormRow"
                              {...register("status")}
                            >
                              <option selected="" value="true">
                                True
                              </option>
                              <option value="false">False</option>
                            </select>
                          </div>
                        </div>

                        <div className="formRow col-xl-3">
                          <div className="formLabel">
                            <label htmlFor="selectFormRow">Sticky Agent</label>
                            <label htmlFor="data" className="formItemDesc">
                              Select the status of Sticky Agent
                            </label>
                          </div>
                          <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-12">
                            <div className="row gx-2">
                              <div
                                className={`col-${watch().sticky_agent_enable == "true" ||
                                  watch().sticky_agent_enable == 1
                                  ? "3"
                                  : "12"
                                  }`}
                              >
                                {watch().sticky_agent_enable === "true" ||
                                  watch().sticky_agent_enable === 1 ? (
                                  <div className="formLabel">
                                    <label className="formItemDesc">
                                      Status
                                    </label>
                                  </div>
                                ) : (
                                  ""
                                )}
                                <select
                                  className="formItem"
                                  name=""
                                  defaultValue="false"
                                  id="selectFormRow"
                                  {...register("sticky_agent_enable")}
                                >
                                  <option value="true">True</option>
                                  <option value="false">False</option>
                                </select>
                              </div>

                              {(watch().sticky_agent_enable == true ||
                                watch().sticky_agent_enable == "true") && (
                                  <div className="col-3">
                                    <div className="formLabel">
                                      <Tippy content="Check the duration of sticky agent">
                                        <label className="formItemDesc">
                                          Duration{" "}
                                        </label>
                                      </Tippy>
                                    </div>
                                    <input
                                      type="number"
                                      name="forward_to"
                                      className="formItem"
                                      {...register(
                                        "stick_agent_expires",
                                        rangeValidator(1, 99),
                                        {
                                          requiredValidator,
                                        }
                                      )}
                                    />
                                    {errors.stick_agent_expires && (
                                      <ErrorMessage
                                        text={errors.stick_agent_expires.message}
                                      />
                                    )}
                                  </div>
                                )}
                              {(watch().sticky_agent_enable == true ||
                                watch().sticky_agent_enable == "true") && (
                                  <div className="col-3">
                                    <div className="formLabel">
                                      <label className="formItemDesc">
                                        Agent Type
                                      </label>
                                    </div>
                                    <select
                                      className="formItem"
                                      name=""
                                      id="selectFormRow"
                                      {...register("stick_agent_type")}
                                    >
                                      <option selected="" value="last_spoken">
                                        Last Spoken
                                      </option>
                                      <option value="longest_time">
                                        Longest Time
                                      </option>
                                    </select>
                                  </div>
                                )}
                              {(watch().sticky_agent_enable == true ||
                                watch().sticky_agent_enable == "true") && (
                                  <div className="col-3">
                                    <div className="formLabel">
                                      <Tippy content="Timout for the sticky agent and return to normal routing">
                                        <label className="formItemDesc">
                                          Timeout(Sec.){" "}
                                        </label>
                                      </Tippy>
                                    </div>
                                    <input
                                      type="number"
                                      name="forward_to"
                                      className="formItem"
                                      {...register(
                                        "sticky_agent_timeout",
                                        rangeValidator(1, 99),
                                        {
                                          requiredValidator,
                                        }
                                      )}
                                    />
                                    {errors.stick_agent_expires && (
                                      <ErrorMessage
                                        text={errors.stick_agent_expires.message}
                                      />
                                    )}
                                  </div>
                                )}
                            </div>
                          </div>
                        </div>

                        <div className="formRow col-xl-3">
                          <div className="formLabel">
                            <label htmlFor="selectFormRow">Spam Filter</label>
                            <label htmlFor="data" className="formItemDesc">
                              Select the type of Spam Filter
                            </label>
                          </div>
                          <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-12">
                            <div className="row">
                              <div
                                className={`col-${watch().spam_filter_type === "3"
                                  ? "4 pe-1 ms-auto"
                                  : "12"
                                  }`}
                              >
                                {watch().spam_filter_type != "1" && (
                                  <div className="formLabel">
                                    <label className="formItemDesc">Type</label>
                                  </div>
                                )}
                                <select
                                  className="formItem"
                                  name=""
                                  defaultValue="1"
                                  id="selectFormRow"
                                  {...register("spam_filter_type")}
                                >
                                  <option value="1">Disable</option>
                                  <option value="2">Call Screening</option>
                                  <option value="3">DTMF Input</option>
                                </select>
                              </div>
                              {watch().spam_filter_type === "3" && (
                                <>
                                  <div className="col-4 px-1">
                                    <div className="formLabel">
                                      <label className="formItemDesc">
                                        Retries
                                      </label>
                                    </div>
                                    <select
                                      className="formItem"
                                      name=""
                                      id="selectFormRow"
                                      {...register("dtmf_retries")}
                                    >
                                      <option value={1}>1</option>
                                      <option value={2}>2</option>
                                      <option value={3}>3</option>
                                    </select>
                                  </div>
                                  <div className="col-4 ps-1">
                                    <div className="formLabel">
                                      <Tippy content="Input in Days, Max 5">
                                        <label className="formItemDesc">
                                          Length{" "}
                                          <span
                                            style={{
                                              color: "var(--color-subtext)",
                                            }}
                                          ></span>
                                        </label>
                                      </Tippy>
                                    </div>
                                    <select
                                      className="formItem"
                                      name=""
                                      defaultValue="false"
                                      id="selectFormRow"
                                      {...register("dtmf_length")}
                                    >
                                      <option value={1}>1</option>
                                      <option value={2}>2</option>
                                      <option value={3}>3</option>
                                      <option value={4}>4</option>
                                      <option value={5}>5</option>
                                    </select>
                                  </div>
                                  <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-12 pe-1">
                                    <div className="formLabel">
                                      <label className="formItemDesc">
                                        DTMF type{" "}
                                        <span
                                          style={{
                                            color: "var(--color-subtext)",
                                          }}
                                        ></span>
                                      </label>
                                    </div>
                                    <select
                                      className="formItem"
                                      name=""
                                      defaultValue="false"
                                      id="selectFormRow"
                                      {...register("dtmf_type")}
                                    >
                                      <option value="random_digit">
                                        Random Digit
                                      </option>
                                      <option value="last_caller_id_digit">
                                        Caller last digit
                                      </option>
                                    </select>
                                  </div>
                                  <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-12 ps-1">
                                    <div className="formLabel">
                                      <label className="formItemDesc">
                                        Retry File
                                      </label>
                                    </div>
                                    <select
                                      className="formItem"
                                      name=""
                                      id="selectFormRow"
                                      {...register("dtmf_retry_file_sound")}
                                    >
                                      <option value={""}>None</option>
                                      {holdMusic &&
                                        holdMusic.map((ring) => {
                                          return (
                                            <option
                                              key={ring.id}
                                              value={ring.id}
                                            >
                                              {ring.name}
                                            </option>
                                          );
                                        })}
                                    </select>
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="formRow col-xl-3">
                          <div className="formLabel">
                            <label htmlFor="selectFormRow">Tag Priority</label>
                            <label htmlFor="data" className="formItemDesc">
                              Select the type of tag you want to display
                            </label>
                          </div>
                          <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-12">
                            <select
                              className="formItem"
                              name=""
                              defaultValue="1"
                              id="selectFormRow"
                              {...register("tag_priority")}
                            >
                              <option value="prefix">Prefix</option>
                              <option value="feature">Feature</option>
                            </select>
                          </div>
                        </div>

                        <div className="formRow col-xl-3">
                          <div className="formLabel">
                            <label htmlFor="selectFormRow">Missed Call</label>
                            <label htmlFor="data" className="formItemDesc">
                              Select in which medium you want to receive missed
                              call notification
                            </label>
                          </div>
                          <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-12">
                            <div className="row">
                              <div
                                className={`col-${watch().missedcall_type == "disable"
                                  ? "12"
                                  : "6"
                                  }`}
                              >
                                <select
                                  className="formItem"
                                  defaultValue="disable"
                                  id="selectFormRow"
                                  {...register("missedcall_type")}
                                >
                                  <option value="disable">Disable</option>
                                  <option value="email">Email</option>
                                  <option value="sms">SMS</option>
                                </select>
                              </div>
                              {watch().missedcall_type == "sms" && (
                                <div className={`col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-12`}>
                                  <input
                                    type="number"
                                    className="formItem"
                                    {...register("sms", {
                                      ...noSpecialCharactersValidator,
                                    })}
                                  />
                                </div>
                              )}
                              {watch().missedcall_type == "email" && (
                                <div className={`col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-12`}>
                                  <input
                                    type="email"
                                    className="formItem"
                                    {...register("email")}
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
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
    </>
  );
};

export default DidConfig;
