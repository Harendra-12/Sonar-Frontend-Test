/* eslint-disable eqeqeq */
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  backToTop,
  generalGetFunction,
  generalPostFunction,
} from "../GlobalFunction/globalFunction";
import CircularLoader from "../Pages/Misc/CircularLoader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";

const CallSettings = (props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const locationData = location.state;
  const [loading, setLoading] = useState(true);
  const account = useSelector((state) => state.account)
  const [callSetting, setCallSetting] = useState({
    onBusyState: 0,
    onBusyForward: "",
    onBusyError: false,
    noAnswerStatus: 0,
    noAnswerForward: "",
    noAnswerError: false,
    notRegisterStatus: 0,
    notRegisterForward: "",
    notRegisterError: false,
    followMe: 0,
    dnd: 0,
    followMeDestinationError: false,
    callRecording: "D",
    callBlocking: 0,
    followMeDestination: "",
    followMeDelay: 0,
    followMeTimeOut: 20,
    followMePrompt: "Prompt",
    followMeStatus: "True",
    callTimeOut: 30,
    followMeId: ""
  });

  // Check weather anything is present inside location or not if not then redirect it to the previous page
  useEffect(() => {
    if (locationData?.id === null || locationData?.id === undefined) {
      setLoading(false);
      navigate(-1);
    } else {
      async function getData() {
        const apiData = await generalGetFunction(
          `/extension/${locationData.id}`
        );
        if (apiData.status) {
          setLoading(false);
          setCallSetting((prevState) => ({
            ...prevState,
            noAnswerStatus:
              apiData.data.voicemailEnabled === "Y"
                ? "Voicemail"
                : apiData.data.callforward === 1
                  ? "Forward"
                  : "Disabled",
            noAnswerForward:
              apiData.data.voicemailEnabled === "Y"
                ? apiData.data.voiceEmailTo
                : apiData.data.callforward === 1
                  ? apiData.data.callforwardTo
                  : "",
            callRecording: apiData.data.record,
            onBusyState: apiData.data.onbusy,
            onBusyForward: apiData.data.onbusyTo,
            notRegisterStatus: apiData.data.notregistered,
            notRegisterForward: apiData.data.notregisteredTo,
            dnd: apiData.data.dnd,
            followMe: apiData.data.followme,
            callTimeOut: apiData.data.callTimeOut,
            callBlocking:
              (apiData.data.blockIncomingStatus === 1 && apiData.data.blockOutGoingStatus === 1) ? "All" : (apiData.data.blockIncomingStatus === 0 && apiData.data.blockOutGoingStatus === 0) ? "Disabled" :
                apiData.data.blockIncomingStatus === 1
                  ? "Incoming"
                  : apiData.data.blockOutGoingStatus === 1
                    ? "Outgoing"
                    : "Disabled",
          }));
          if (apiData.data.followmes.length > 0) {
            setCallSetting(prevData => ({
              ...prevData,
              followMeId: apiData.data.followmes[0].id,
              followMeDestination: apiData.data.followmes[0].destination,
              followMeDelay: apiData.data.followmes[0].delay,
              followMeTimeOut: apiData.data.followmes[0].timeout,
              followMePrompt: apiData.data.followmes[0].prompt,
            }))
          }
        }

      }
      getData();
    }
  }, [location, locationData, navigate]);

  async function handleSubmit() {
    if (callSetting.onBusyState !== 0) {
      if (callSetting.onBusyForward === "") {
        setCallSetting((prevState) => ({
          ...prevState,
          onBusyError: true,
        }));
      } else {
        setCallSetting((prevState) => ({
          ...prevState,
          onBusyError: false,
        }));
      }
    } else {
      setCallSetting((prevState) => ({
        ...prevState,
        onBusyForward: "",
      }));
    }

    if (callSetting.noAnswerStatus !== "Disabled") {
      if (callSetting.noAnswerForward === "") {
        setCallSetting((prevState) => ({
          ...prevState,
          noAnswerError: true,
        }));
      } else {
        setCallSetting((prevState) => ({
          ...prevState,
          noAnswerError: false,
        }));
      }
    } else {
      setCallSetting((prevState) => ({
        ...prevState,
        noAnswerForward: "",
      }));
    }

    if (callSetting.notRegisterStatus !== 0) {
      if (callSetting.notRegisterForward === "") {
        setCallSetting((prevState) => ({
          ...prevState,
          notRegisterError: true,
        }));
      } else {
        setCallSetting((prevState) => ({
          ...prevState,
          notRegisterError: false,
        }));
      }
    } else {
      setCallSetting((prevState) => ({
        ...prevState,
        notRegisterForward: "",
      }));
    }

    if (callSetting.followMe == 1) {
      if (callSetting.followMeDestination === "") {
        setCallSetting((prevState) => ({
          ...prevState,
          followMeDestinationError: true,
        }));
      } else {
        setCallSetting((prevState) => ({
          ...prevState,
          followMeDestinationError: false,
        }));
      }
    }

    if (
      (callSetting.onBusyState === 0 || callSetting.onBusyForward !== "") &&
      (callSetting.followMe == 0 || callSetting.followMeDestination !== "") &&
      (callSetting.notRegisterStatus === 0 ||
        callSetting.notRegisterForward !== "") &&
      !(callSetting.noAnswerStatus === "Forward" &&
        callSetting.noAnswerForward === "")
    ) {
      setLoading(true);
      const parsedData = {
        extension_id: locationData.id,
        account_id: account.account_id,
        voicemailEnabled: callSetting.noAnswerStatus === "Voicemail" ? "Y" : "N",
        voiceEmailTo:
          callSetting.noAnswerStatus === "Voicemail"
            ? callSetting.noAnswerForward
            : "",
        record: callSetting.callRecording,
        callforward: callSetting.noAnswerStatus === "Forward" ? 1 : 0,
        callforwardTo:
          callSetting.noAnswerStatus === "Forward" ? callSetting.noAnswerForward : "",
        onbusy: callSetting.onBusyState,
        onbusyTo: callSetting.onBusyForward,
        notregistered: callSetting.notRegisterStatus,
        notregisteredTo: callSetting.notRegisterForward,
        dnd: callSetting.dnd,
        noanswer: 0,
        ignorebusy: 0,
        callTimeOut: callSetting.callTimeOut,
        followme: callSetting.followMe,
        blockIncomingStatus: callSetting.callBlocking === "Incoming" ? 1 : callSetting.callBlocking === "All" ? 1 : 0,
        blockOutGoingStatus: callSetting.callBlocking === "Outgoing" ? 1 : callSetting.callBlocking === "All" ? 1 : 0,
      };

      // Conditionally add the 'data' field if followMe is equal to 1
      if (callSetting.followMe === 1) {
        if (callSetting.followMeId === "") {
          parsedData.data = [{
            destination: callSetting.followMeDestination,
            delay: callSetting.followMeDelay,
            timeout: callSetting.followMeTimeOut,
            extension_id: locationData.id,
            prompt: callSetting.followMePrompt
          }];
        } else {
          parsedData.data = [{
            id: callSetting.followMeId,
            destination: callSetting.followMeDestination,
            delay: callSetting.followMeDelay,
            timeout: callSetting.followMeTimeOut,
            extension_id: locationData.id,
            prompt: callSetting.followMePrompt
          }];
        }
      }

      const apiData = await generalPostFunction(
        `/extension/details/store`,
        parsedData
      );
      if (apiData.status) {
        setLoading(false);
        toast.success(apiData.message);
      } else {
        setLoading(false);
        toast.error(apiData.message);
      }
    }
  }

  return (
    <>
      <main className="mainContent">
        <section id="phonePage">
          <div className="container-fluid">
            <div className="row justify-content-center">
              <div className="col-12" id="subPageHeader">
                <div className="row px-xl-3">
                  <div className="col-xl-9 my-auto">
                    <h4 className="my-auto">Call Settings</h4>
                    <p className="pt-2 mt-1 mb-0">
                      Direct incoming calls to extension:{" "}
                      {locationData?.extension}
                    </p>
                  </div>
                  <div className="col-xl-3 ps-2">
                    <div className="d-flex justify-content-end">
                      <button
                        onClick={() => {
                          navigate(-1);
                          backToTop();
                        }}
                        type="button"
                        effect="ripple"
                        className="panelButton"
                      >
                        Back
                      </button>
                      <button
                        type="button"
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
              {loading ? (
                <div colSpan={99}>
                  <CircularLoader />
                </div>
              ) : (
                ""
              )}
              <div className="mx-2" id="detailsContent">
                <form className="row">
                  <div className="formRow col-xl-12 px-xl-4">
                    <div className="col-12 d-flex justify-content-start">
                      <div className="formLabel pe-2 col-2">
                        <label className="text-dark">On Busy</label>
                        <label
                          htmlFor="data"
                          className="formItemDesc"
                          style={{
                            fontSize: 12,
                            lineHeight: "18px",
                            marginTop: 5,
                          }}
                        >
                          If enabled, it overrides the value of voicemail
                          enabling in extension
                        </label>
                      </div>
                      <div className="col-2 pe-2">
                        <div className="formLabel">
                          <label htmlFor="">Status</label>
                        </div>

                        <select
                          className="formItem me-0"
                          style={{ width: "100%" }}
                          name="delay"
                          id="selectFormRow"
                          value={callSetting.onBusyState}
                          onChange={(e) => {
                            setCallSetting((prevState) => ({
                              ...prevState,
                              onBusyState: parseInt(e.target.value),
                            }));
                          }}
                        >
                          <option value={1}>Enabled</option>
                          <option value={0}>Disabled</option>
                        </select>
                      </div>
                      {callSetting.onBusyState == 0 ? (
                        ""
                      ) : (
                        <div className="col-3 pe-2">
                          <div className="formLabel">
                            <label htmlFor="">Destinations</label>

                            {callSetting.onBusyError ? (
                              <label className="status missing">
                                field missing
                              </label>
                            ) : (
                              ""
                            )}
                          </div>
                          <div className="col-12">
                            <input
                              type="text"
                              name="extension"
                              className="formItem"
                              value={callSetting.onBusyForward}
                              onChange={(e) => {
                                setCallSetting((prevState) => ({
                                  ...prevState,
                                  onBusyForward: e.target.value,
                                }));
                              }}
                              disabled={
                                callSetting.onBusyState == 0 ? true : false
                              }
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="formRow col-xl-12 px-xl-4">
                    <div className="col-12 d-flex justify-content-start">
                      <div className="formLabel pe-2 col-2">
                        <label className="text-dark">No Answer</label>
                        <label
                          htmlFor="data"
                          className="formItemDesc"
                          style={{
                            fontSize: 12,
                            lineHeight: "18px",
                            marginTop: 5,
                          }}
                        >
                          If enabled, it overrides the value of voicemail
                          enabling in extension
                        </label>
                      </div>
                      <div className="col-2 pe-2">
                        <div className="formLabel">
                          <label htmlFor="">Status</label>
                        </div>

                        <select
                          className="formItem me-0"
                          style={{ width: "100%" }}
                          name="delay"
                          id="selectFormRow"
                          value={callSetting.noAnswerStatus}
                          onChange={(e) => {
                            setCallSetting((prevState) => ({
                              ...prevState,
                              noAnswerStatus: e.target.value,
                            }));
                          }}
                        >
                          <option>Disabled</option>
                          <option>Voicemail</option>
                          <option>Forward</option>
                        </select>
                      </div>
                      {callSetting.noAnswerStatus === "Forward" ? (
                        <>
                          <div className="col-3 pe-2">
                            <div className="formLabel">
                              <label htmlFor="">Destinations</label>

                              {callSetting.noAnswerError ? (
                                <label className="status missing">
                                  field missing
                                </label>
                              ) : (
                                ""
                              )}
                            </div>
                            <div className="col-12">
                              <input
                                type="text"
                                name="extension"
                                className="formItem"
                                required="required"
                                value={callSetting.noAnswerForward}
                                onChange={(e) => {
                                  setCallSetting((prevState) => ({
                                    ...prevState,
                                    noAnswerForward: e.target.value,
                                  }));
                                }}
                                disabled={
                                  callSetting.noAnswerStatus !== "Disabled"
                                    ? false
                                    : true
                                }
                              />
                            </div>
                          </div>


                          <div className="col-3 pe-2">
                            <div className="formLabel">
                              <label htmlFor="">Call TimeOut</label>
                            </div>
                            <div className="col-12">
                              <input
                                type="text"
                                name="extension"
                                className="formItem"
                                required="required"
                                placeholder="Enter call timeout value in second"
                                value={callSetting.callTimeOut}
                                onChange={(e) => {
                                  setCallSetting((prevState) => ({
                                    ...prevState,
                                    callTimeOut: e.target.value,
                                  }));
                                }}
                              />
                            </div>
                          </div>
                        </>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                  <div className="formRow col-xl-12 px-xl-4">
                    <div className="col-12 d-flex justify-content-start">
                      <div className="formLabel pe-2 col-2">
                        <label className="text-dark">Not Registered</label>
                        <label
                          htmlFor="data"
                          className="formItemDesc"
                          style={{
                            fontSize: 12,
                            lineHeight: "18px",
                            marginTop: 5,
                          }}
                        >
                          If endpoint is not reachable, forward to this
                          destination before going to voicemail
                        </label>
                      </div>
                      <div className="col-2 pe-2">
                        <div className="formLabel">
                          <label htmlFor="">Status</label>
                        </div>

                        <select
                          className="formItem me-0"
                          style={{ width: "100%" }}
                          name="delay"
                          id="selectFormRow"
                          value={callSetting.notRegisterStatus}
                          onChange={(e) => {
                            setCallSetting((prevState) => ({
                              ...prevState,
                              notRegisterStatus: parseInt(e.target.value),
                            }));
                          }}
                        >
                          <option value={1}>Enabled</option>
                          <option value={0}>Disabled</option>
                        </select>
                      </div>
                      {callSetting.notRegisterStatus == 0 ? (
                        ""
                      ) : (
                        <div className="col-3 pe-2">
                          <div className="formLabel">
                            <label htmlFor="">Destinations</label>
                            {callSetting.notRegisterError ? (
                              <label className="status missing">
                                field missing
                              </label>
                            ) : (
                              ""
                            )}
                          </div>
                          <div className="col-12">
                            <input
                              type="text"
                              name="extension"
                              className="formItem"
                              value={callSetting.notRegisterForward}
                              onChange={(e) => {
                                setCallSetting((prevState) => ({
                                  ...prevState,
                                  notRegisterForward: e.target.value,
                                }));
                              }}
                              disabled={
                                callSetting.notRegisterStatus == 0
                                  ? true
                                  : false
                              }
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="formRow col-xl-12 px-xl-4">
                    <div className="col-12 d-flex justify-content-start">
                      <div className="formLabel pe-2 col-2">
                        <label className="text-dark">Follow Me</label>
                      </div>
                      <div className="col-2 pe-2">
                        <div className="formLabel">
                          <label htmlFor="">Status</label>
                        </div>

                        <select
                          className="formItem me-0"
                          style={{ width: "100%" }}
                          name="delay"
                          id="selectFormRow"
                          value={callSetting.followMe}
                          onChange={(e) => {
                            setCallSetting((prevState) => ({
                              ...prevState,
                              followMe: parseInt(e.target.value),
                            }));
                          }}
                        >
                          <option value={1}>Enabled</option>
                          <option value={0}>Disabled</option>
                        </select>
                      </div>
                    </div>
                    {callSetting.followMe == 0 ? (
                      ""
                    ) : (
                      <div className="formRow col-xl-10 px-0 border-0">
                        <div className="d-flex justify-content-start">
                          <div className="col-4 pe-2">
                            <div className="formLabel">
                              <label htmlFor="">Destinations</label>
                              {callSetting.followMeDestinationError ? (
                                <label className="status missing">
                                  field missing
                                </label>
                              ) : (
                                ""
                              )}
                            </div>
                            <div className="position-relative">
                              <input
                                type="text"
                                name="destination"
                                className="formItem"
                                value={callSetting.followMeDestination}
                                onChange={(e) => {
                                  setCallSetting((prevState) => ({
                                    ...prevState,
                                    followMeDestination: e.target.value,
                                  }));
                                }}
                                placeholder="Destination"
                              />
                            </div>
                          </div>
                          <div className="col-2 pe-2">
                            <div className="formLabel">
                              <label htmlFor="">Delay</label>
                            </div>

                            <select
                              className="formItem me-0"
                              style={{ width: "100%" }}
                              name="delay"
                              id="selectFormRow"
                              value={callSetting.followMeDelay}
                              onChange={(e) => {
                                setCallSetting((prevState) => ({
                                  ...prevState,
                                  followMeDelay: parseInt(e.target.value),
                                }));
                              }}
                            >
                              {(() => {
                                const numbers = [];
                                for (let i = 0; i <= 100; i++) {
                                  if (i % 5 === 0) {
                                    numbers.push(<span key={i}>{i}</span>);
                                  }
                                }
                                return numbers.map((item) => {
                                  return <option>{item}</option>;
                                });
                              })()}
                            </select>
                          </div>
                          <div className="col-2 pe-2">
                            <div className="formLabel">
                              <label htmlFor="">Timeout</label>
                            </div>
                            <select
                              className="formItem me-0"
                              style={{ width: "100%" }}
                              name="timeOut"
                              value={callSetting.followMeTimeOut}
                              onChange={(e) =>
                                setCallSetting((prevState) => ({
                                  ...prevState,
                                  followMeTimeOut: parseInt(e.target.value),
                                }))
                              }
                              id="selectFormRow"
                            >
                              {(() => {
                                const numbers = [];
                                for (let i = 0; i <= 100; i++) {
                                  if (i % 5 === 0) {
                                    numbers.push(<span key={i}>{i}</span>);
                                  }
                                }
                                return numbers.map((item) => {
                                  return <option>{item}</option>;
                                });
                              })()}
                            </select>
                          </div>
                          <div className="col-2 pe-2">
                            <div className="formLabel">
                              <label htmlFor="">Prompt</label>
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
                              id="selectFormRow"
                              name="prompt"
                            >
                              <option className="status">Prompt</option>
                              <option value="confirm">Confirm</option>
                            </select>
                          </div>
                          {/* <div className="col-2 pe-2">
                            <div className="formLabel">
                              <label htmlFor="">Status</label>
                            </div>

                            <select
                              className="formItem me-0"
                              style={{ width: "100%" }}
                              value={callSetting.followMeStatus}
                              onChange={(e) =>
                                setCallSetting((prevState) => ({
                                  ...prevState,
                                  followMeStatus: e.target.value,
                                }))
                              }
                              id="selectFormRow"
                              name="status"
                            >
                              <option className="status" value="active">
                                True
                              </option>
                              <option value="inactive">False</option>
                            </select>
                          </div> */}
                        </div>
                        <label htmlFor="data" className="formItemDesc">
                          Add destinations and parameters for follow me.
                        </label>
                      </div>
                    )}
                  </div>
                  <div className="formRow col-xl-12 px-xl-4">
                    <div className="col-12 d-flex justify-content-start">
                      <div className="formLabel pe-2 col-2">
                        <label className="text-dark">Do Not Disturb</label>
                      </div>
                      <div className="col-2 pe-2">
                        <div className="formLabel">
                          <label htmlFor="">Status</label>
                        </div>

                        <select
                          className="formItem me-0"
                          style={{ width: "100%" }}
                          name="delay"
                          id="selectFormRow"
                          value={callSetting.dnd}
                          onChange={(e) => {
                            setCallSetting((prevState) => ({
                              ...prevState,
                              dnd: parseInt(e.target.value),
                            }));
                          }}
                        >
                          <option value={1}>Enabled</option>
                          <option value={0}>Disabled</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="formRow col-xl-12 px-xl-4">
                    <div className="col-12 d-flex justify-content-start">
                      <div className="formLabel pe-2 col-2">
                        <label className="text-dark">Call Recording</label>
                      </div>
                      <div className="col-2 pe-2">
                        <div className="formLabel">
                          <label htmlFor="">Status</label>
                        </div>

                        <select
                          className="formItem me-0"
                          style={{ width: "100%" }}
                          name="delay"
                          id="selectFormRow"
                          value={callSetting.callRecording}
                          onChange={(e) => {
                            setCallSetting((prevState) => ({
                              ...prevState,
                              callRecording: e.target.value,
                            }));
                          }}
                        >
                          <option value="D">Disabled</option>
                          <option value="A">All</option>
                          <option value="L">Local</option>
                          <option value="I">Inbound</option>
                          <option value="O">Outbound</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="formRow col-xl-12 px-xl-4">
                    <div className="col-12 d-flex justify-content-start">
                      <div className="formLabel pe-2 col-2">
                        <label className="text-dark">Call Blocking</label>
                      </div>
                      <div className="col-2 pe-2">
                        <div className="formLabel">
                          <label htmlFor="">Status</label>
                        </div>

                        <select
                          className="formItem me-0"
                          style={{ width: "100%" }}
                          name="delay"
                          id="selectFormRow"
                          value={callSetting.callBlocking}
                          onChange={(e) => {
                            setCallSetting((prevState) => ({
                              ...prevState,
                              callBlocking: e.target.value,
                            }));
                          }}
                        >
                          <option>Disabled</option>
                          <option>All</option>
                          <option>Incoming</option>
                          <option>Outgoing</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>
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
    </>
  );
};

export default CallSettings;
