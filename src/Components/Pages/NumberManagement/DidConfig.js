/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import Header from "../../CommonComponents/Header";
import { useLocation, useNavigate } from "react-router-dom";
import {
  backToTop,
  generalGetFunction,
  generalPostFunction,
  generalPutFunction,
} from "../../GlobalFunction/globalFunction";
import ActionList from "../../CommonComponents/ActionList";
import { useForm } from "react-hook-form";
import ErrorMessage from "../../CommonComponents/ErrorMessage";
import {
  minValidator,
  noSpecialCharactersValidator,
  rangeValidator,
  requiredValidator,
  usagesValidator,
} from "../../validations/validation";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import CircularLoader from "../../Loader/CircularLoader";
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
  const [musicRefresh, setMusicRefresh] = useState(0);
  const {
    register,
    setError: setErr,
    formState: { errors },
    handleSubmit,
    setValue,
    watch,
  } = useForm();

  useEffect(() => {
    if (locationData.configuration !== null) {
      // setDataAvailable(false);

      setValue("usages", locationData.configuration.usages || []);
      setValue("did_id_view", locationData.did || "");
      setValue("forward", locationData.configuration.forward || "");
      setValue("direct_extension", locationData.configuration.forward_to || "");
      setValue("forward_to", locationData.configuration.forward_to || "");
      setValue("action", locationData.configuration.action || "");
      setValue("hold_music", locationData.configuration.hold_music || "");
      setValue(
        "stick_agent_expires",
        locationData.configuration.stick_agent_expires || ""
      );
      setValue(
        "stick_agent_type",
        locationData.configuration.stick_agent_type || ""
      );

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
        "dtmf_type",
        locationData.configuration.dtmf_type || "random_digit"
      );
      setValue("dtmf_length", locationData.configuration.dtmf_length || "3");
      setValue("dtmf_retries", locationData.configuration.dtmf_retries || "3");
      setValue(
        "dtmf_retry_file_sound	",
        locationData.configuration.dtmf_retry_file_sound || "1"
      );
    } else {
      setValue("usages", "extension" || []);
      // setDataAvailable(true);
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
            console.log(holdMusic.data, uploadedMusic);
            setValue("hold_music", uploadedMusic.id);
          }
        } else {
          navigate("/");
        }
      }
      getData();
    } else {
      setLoading(false);
      navigate("/");
    }
  }, [navigate, account, musicRefresh]);
  console.log(watch());
  useEffect(() => {
    if (locationData) {
      setValue("did_id_view", locationData.did || "");
    } else {
      console.warn(
        "Location data is undefined or missing expected properties."
      );
    }

    register("usages", {
      validate: usagesValidator.validate,
      ...requiredValidator,
    });
    register("did_id_view", { required: true });
  }, [register, setValue]);

  useEffect(() => {
    if (watch("forward") === "disabled") {
      setValue("forward_to", "");
      setValue("direct_extension", "");
    } else if (watch("forward") === "pstn") {
      setValue("direct_extension", "");
    } else if (watch("forward") === "direct") {
      setValue("forward_to", "");
    }
  }, [watch("forward"), setValue]);

  const actionListValue = (value) => {
    setValue("action", value[0]);
  };
  const directListValue = (value) => {
    setValue("direct_extension", value[0]);
  };

  const forwardStatus = watch("forward", "disabled");
  const stickyAgentStatus = watch("sticky_agent", "0");

  const handleFormSubmit = handleSubmit(async (data) => {
    data.record = data.record === true || data.record === "true";
    data.sticky_agent_enable =
      data.sticky_agent_enable === true || data.sticky_agent_enable === "true";
    data.status = data.status === true || data.status === "true";

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
    } else if (data.forward === "direct" && !data.direct_extension) {
      setErr("direct_extension", {
        type: "required",
        message: "This field is required when forwarding directly.",
      });
    }

    // Final data preparation
    if (data.forward === "pstn") {
      data.forward_to = data.forward_to || "";
    } else if (data.forward === "direct") {
      data.forward_to = data.direct_extension || "";
    } else {
      data.forward_to = "";
    }
    delete data.direct_extension;
    delete data.did_id;
    const payload = { ...data, did_id: locationData.id };

    if (locationData.configuration === null) {
      setLoading(true);
      const apiData = await generalPostFunction("/did/configure", payload);
      if (apiData?.status) {
        setLoading(false);
        toast.success(apiData.message);
      } else {
        setLoading(false);
        // toast.error(apiData.message);
      }
    }
    if (locationData.configuration) {
      setLoading(true);
      const apiData = await generalPutFunction(
        `/did/configure/update/${locationData.configuration.id}`,
        payload
      );
      if (apiData.status) {
        setLoading(false);
        toast.success(apiData.message);
      } else {
        setLoading(false);
        // toast.error(apiData.message);
      }
    }
  });

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

  return (
    <>
      <main className="mainContent">
        <section id="phonePage">
          <div className="container-fluid px-0">
            <Header title="DID Management" />
            {/* <div id="subPageHeader">
              <div className="col-xl-9 my-auto">
                <p className="mb-0">
                  Inbound destinations are the DID/DDI, DNIS or Alias for
                  inbound calls.
                </p>
              </div>
              <div className="col-xl-3 ps-2">
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
                    onClick={handleFormSubmit}
                  >
                    <span className="text">{locationData.configuration ? "Update" : "Save"}</span>
                    <span className="icon"><i class="fa-solid fa-floppy-disk"></i></span>
                  </button>
                </div>
              </div>
            </div> */}
          </div>
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
                            Inbound destinations are the DID/DDI, DNIS or Alias
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
                            effect="ripple"
                            className="panelButton gray"
                          >
                            <span className="text">Back</span>
                            <span className="icon">
                              <i class="fa-solid fa-caret-left"></i>
                            </span>
                          </button>
                          <button
                            effect="ripple"
                            className="panelButton"
                            onClick={handleFormSubmit}
                          >
                            <span className="text">
                              {locationData.configuration ? "Update" : "Save"}
                            </span>
                            <span className="icon">
                              <i class="fa-solid fa-floppy-disk"></i>
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
                      <form className="row">
                        <div className="formRow col-xl-3">
                          <div className="formLabel">
                            <label htmlFor="">Selected DID</label>
                            <label htmlFor="data" className="formItemDesc">
                              Selected DID.
                            </label>
                          </div>
                          <div className="col-6">
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
                          <div className="formLabel">
                            <label htmlFor="">
                              Usage <span className="text-danger">*</span>
                            </label>
                            <label htmlFor="data" className="formItemDesc">
                              Set how the Destination will be used.
                            </label>
                          </div>
                          <div className="col-3 pe-2 ms-auto">
                            <select
                              className="formItem"
                              name="forward"
                              id="selectFormRow"
                              // onChange={(e) => setForwardEnable(e.target.value)}
                              {...register("usages")}
                              onChange={(e) => {
                                // Trigger react-hook-form's built-in handling
                                register("usages").onChange(e);

                                // Clear the "action" field when "usages" changes
                                setValue("action", "");
                              }}
                            >
                              <option value="extension">Extension</option>
                              <option value="call center">Call Center</option>
                              <option value="ring group">Ring Group</option>
                              <option value="ivr">IVR</option>
                            </select>
                          </div>
                          <div className="col-3">
                            <ActionList
                              category={watch().usages}
                              title={null}
                              label={null}
                              getDropdownValue={actionListValue}
                              value={watch().action}
                              {...register("action", requiredValidator)}
                            />
                            {errors.action && (
                              <ErrorMessage text={errors.action.message} />
                            )}
                          </div>
                        </div>

                        {/* <div className="formRow col-xl-3">
                        <div className="formLabel">
                          <label htmlFor="">Action</label>
                          <label htmlFor="data" className="formItemDesc">
                            Set the action to perform when the max wait time is
                            reached.
                          </label>
                        </div>
                        <div className="col-6">
                          <ActionList
                            category={watch().usages}
                            title={null}
                            label={null}
                            getDropdownValue={actionListValue}
                            value={watch().action}
                            {...register("action", requiredValidator)}
                          />
                          {errors.action && (
                            <ErrorMessage text={errors.action.message} />
                          )}
                        </div>
                      </div> */}

                        <div className="formRow col-xl-3">
                          <div className="formLabel">
                            <label htmlFor="">Forward DID</label>
                            <label htmlFor="data" className="formItemDesc">
                              Want to forword DID.
                            </label>
                          </div>
                          <div
                            className={`col-${
                              forwardStatus != "disabled"
                                ? "3 pe-2 ms-auto"
                                : "6"
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
                            >
                              <option value="disabled">Disable</option>
                              <option value="pstn">PSTN</option>
                              <option value="direct">Direct</option>
                            </select>
                          </div>
                          {forwardStatus === "pstn" && (
                            <div className="col-3">
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
                          {forwardStatus === "direct" && (
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
                          )}
                        </div>
                        {/* {forwardStatus === "pstn" && (
                        <div className="formRow col-xl-3">
                          <div className="formLabel">
                            <label htmlFor="forward_to">Select PSTN</label>
                            <label htmlFor="data" className="formItemDesc">
                              Select a PSTN.
                            </label>
                          </div>
                          <div className="col-6">
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
                              <ErrorMessage text={errors.forward_to.message} />
                            )}
                          </div>
                        </div>
                      )} */}
                        {/* {forwardStatus === "direct" && (
                        <div className="formRow col-xl-3">
                          <div className="formLabel">
                            <label htmlFor="selectFormRow">
                              Forward Extension
                            </label>
                            <label htmlFor="data" className="formItemDesc">
                              Select extension.
                            </label>
                          </div>
                          <div className="col-6">
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
                        </div>
                      )} */}

                        <div className="formRow col-xl-3">
                          <div className="formLabel">
                            <label htmlFor="selectFormRow">Prefix Tag</label>
                            <label htmlFor="data" className="formItemDesc">
                              Set a prefix tag for the destination
                            </label>
                          </div>
                          <div className="col-6">
                            <input
                              type="number"
                              name="forward_to"
                              className="formItem"
                            />
                          </div>
                        </div>

                        <div className="formRow col-xl-3">
                          <div className="formLabel">
                            <label htmlFor="selectFormRow">Record</label>
                            <label htmlFor="data" className="formItemDesc">
                              Save the recording.
                            </label>
                          </div>
                          <div className="col-6">
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
                          <div className="col-6">
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
                          <div className="col-6">
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
                          <div
                            className={`col-${
                              watch().sticky_agent_enable == "true" ||
                              watch().sticky_agent_enable == 1
                                ? "2 pe-2 ms-auto"
                                : "6"
                            }`}
                          >
                            {watch().sticky_agent_enable === "true" ||
                            watch().sticky_agent_enable === 1 ? (
                              <div class="formLabel">
                                <label>Status</label>
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
                            <div
                              className="col-2 pe-2"
                              style={{ width: "10%" }}
                            >
                              <div class="formLabel">
                                <Tippy content="Input in Days, Max 99">
                                  <label>
                                    Duration{" "}
                                    <span
                                      style={{ color: "var(--color-subtext)" }}
                                    ></span>
                                  </label>
                                </Tippy>
                              </div>
                              <input
                                type="number"
                                name="forward_to"
                                className="formItem"
                                {...register(
                                  "stick_agent_expires",
                                  rangeValidator(1, 99)
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
                            <div className="col-2" style={{ width: "23.3%" }}>
                              <div className="formLabel">
                                <label htmlFor="selectFormRow">
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
                        </div>

                        <div className="formRow col-xl-3">
                          <div className="formLabel">
                            <label htmlFor="selectFormRow">Spam Filter</label>
                            <label htmlFor="data" className="formItemDesc">
                              Select the type of Spam Filter
                            </label>
                          </div>
                          <div className="col-6">
                            <div className="row">
                              <div
                                className={`col-${
                                  watch().spam_filter_type == "1" ||
                                  watch().spam_filter_type == "2"
                                    ? "12"
                                    : "4"
                                } pe-2 ms-auto`}
                              >
                                {watch().spam_filter_type != "1" && (
                                  <div class="formLabel">
                                    <label>Type</label>
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
                                  <div className="col-4">
                                    <div className="formLabel">
                                      <label htmlFor="selectFormRow">
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
                                  <div className="col-4 pe-2">
                                    <div class="formLabel">
                                      <Tippy content="Input in Days, Max 5">
                                        <label>
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
                                  <div className="col-6 pe-2">
                                    <div class="formLabel">
                                      <label>
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
                                  <div className="col-6">
                                    <div className="formLabel">
                                      <label htmlFor="selectFormRow">
                                        Retry File
                                      </label>
                                    </div>
                                    <select
                                      className="formItem"
                                      name=""
                                      id="selectFormRow"
                                      {...register("dtmf_retry_file_sound")}
                                    >
                                      <option value={1}>
                                        Select Invalid music file
                                      </option>
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
