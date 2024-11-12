import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useSIPProvider } from "react-sipjs";
import { toast } from "react-toastify";

function CallDetails({
  clickedCall,
  callHistory,
  isCustomerAdmin,
  setSelectedModule,
  isMicOn,
  isVideoOn,
  onCall,
}) {
  const [callDetails, setCallDetails] = useState();
  const { connectStatus } = useSIPProvider();
  const account = useSelector((state) => state.account);
  const extension = account?.extension?.extension || "";
  useEffect(() => {
    setCallDetails(clickedCall);
  }, [clickedCall]);

  const formatDate = (dateString) => {
    if (dateString) {
      const date = new Date(dateString.replace(" ", "T") + "Z");
      const formattedTimestamp = date.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
      return formattedTimestamp;
    } else {
      return null;
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12;
    const minutesString = minutes < 10 ? `0${minutes}` : minutes;
    return `${hours}:${minutesString} ${ampm}`;
  };

  const formatDuration = (duration) => {
    const sec = Math.floor(duration % 60);
    const min = Math.floor((duration / 60) % 60);
    const hour = Math.floor(duration / 3600);
    return (
      `${hour ? hour + " hr" : ""}${min ? min + " min" : ""} ${sec ? sec + " sec" : ""
      }` || "0 sec"
    );
  };

  const handleVoiceCall = (mode) => {
    if (connectStatus !== "CONNECTED") {
      toast.error("You are not connected with server");
      return;
    }
    if (!isMicOn) {
      toast.warn("Please turn on microphone");
    }
    if (mode === "video") {
      if (!isVideoOn) {
        toast.warn("Please turn on camera");
        return;
      }
    }
    onCall(callDetails, mode);
  };
  return (
    <>
      <div className="profileInfoHolder">
        <div className="primeWrapper">
          <div className="d-flex align-items-center">
            <div className="profileHolder">
              <i className="fa-light fa-user fs-4" />
            </div>
            <div>
              <h4>
                {(callDetails && callDetails.caller_user?.username) || "USER XYZ"}
              </h4>
              <h5>
                {!isCustomerAdmin
                  ? callDetails &&
                    callDetails?.["Caller-Callee-ID-Number"] === extension
                    ? callDetails?.["Caller-Caller-ID-Number"]
                    : callDetails?.["Caller-Callee-ID-Number"]
                  : callDetails?.["Caller-Callee-ID-Number"]}
              </h5>
            </div>
          </div>
          <div className="callDeetBtnGrp">
            <button className="appPanelButtonCallerRect" effect="ripple">
              <i className="fa-light fa-message-dots" />
            </button>
            <button
              className="appPanelButtonCallerRect"
              effect="ripple"
              // onClick={() => onCall(callDetails)}
              onClick={() => handleVoiceCall("audio")}
            >
              <i className="fa-light fa-phone" />
            </button>
            {isVideoOn && (
              <button className="appPanelButtonCallerRect" effect="ripple" onClick={() => handleVoiceCall("video")}>
                <i className="fa-light fa-video" />
              </button>
            )}

          </div>
        </div>
      </div>
      <div className="mt-2">
        <nav>
          <div className="nav nav-tabs" id="nav-tab" role="tablist">
            <button
              className="tabLink"
              effect="ripple"
              data-bs-toggle="tab"
              data-bs-target="#nav-home"
              type="button"
              role="tab"
              aria-controls="nav-home"
              aria-selected="true"
            >
              <i className="fa-regular fa-circle-info" />
            </button>
            <button
              className="tabLink active"
              effect="ripple"
              data-bs-toggle="tab"
              data-bs-target="#nav-profile"
              type="button"
              role="tab"
              aria-controls="nav-profile"
              aria-selected="false"
            >
              <i className="fa-regular fa-clock-rotate-left" />
            </button>
          </div>
        </nav>
        <div className="tab-content" id="nav-tabContent">
          <div
            className="tab-pane fade"
            id="nav-home"
            role="tabpanel"
            aria-labelledby="nav-home-tab"
            tabIndex={0}
          >
            <div className="callDetailsList">
              <table className="mt-3">
                <tbody>
                  <tr>
                    {/* <td style={{ color: "#444444" }}>Jan 16, 2022</td> */}
                    <td style={{ color: "#444444" }}>
                      {formatDate(
                        callDetails && callDetails.variable_start_stamp
                      )}
                    </td>
                    {/* <td>12:46 PM</td> */}
                    <td>
                      {formatTime(
                        callDetails && callDetails.variable_start_stamp
                      )}
                    </td>
                    {!isCustomerAdmin ? (
                      <td
                        className={`${callDetails?.["Caller-Callee-ID-Number"] ===
                          extension && callDetails?.["variable_billsec"] > 0
                          ? "incoming"
                          : callDetails?.["Caller-Caller-ID-Number"] ===
                            extension
                            ? "outgoing"
                            : callDetails?.["Caller-Callee-ID-Number"] ===
                              extension &&
                              callDetails?.["variable_billsec"] === 0
                              ? "missed"
                              : callDetails?.["Call-Direction"] === "voicemail"
                                ? "voicemail"
                                : ""
                          }`}
                      >
                        <span>
                          {callDetails &&
                            callDetails?.["Caller-Callee-ID-Number"] ===
                            extension &&
                            callDetails?.["variable_billsec"] > 0
                            ? "Incoming"
                            : callDetails?.["Caller-Caller-ID-Number"] ===
                              extension
                              ? "Outgoing"
                              : callDetails?.["Caller-Callee-ID-Number"] ===
                                extension &&
                                callDetails?.["variable_billsec"] === 0
                                ? "Missed"
                                : callDetails?.["Call-Direction"] === "voicemail"
                                  ? "voicemail"
                                  : ""}
                        </span>
                      </td>
                    ) : (
                      <td
                        className={`${callDetails?.["variable_billsec"] === 0
                          ? "missed"
                          : callDetails?.["Call-Direction"] === "voicemail"
                            ? "voicemail"
                            : ""
                          }`}
                      >
                        <span>
                          {callDetails?.["Caller-Callee-ID-Number"]}==
                          <i class="fa-solid fa-angles-right"></i>
                          {callDetails?.["Caller-Caller-ID-Number"]}
                        </span>
                      </td>
                    )}

                    {/* <td>1 (999) 999-9999</td> */}
                    <td>{callDetails && callDetails.id}</td>
                    {/* <td style={{ color: "#444444" }}>16 sec</td> */}
                    <td style={{ color: "#444444" }}>
                      {formatDuration(
                        callDetails && callDetails.variable_billsec
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div
            className="tab-pane fade show active"
            id="nav-profile"
            role="tabpanel"
            aria-labelledby="nav-profile-tab"
            tabindex="0"
          >
            <div className="callDetailsList">
              <table className="mt-3">
                <tbody>
                  {callHistory?.map((item) => (
                    <tr key={item.id}>
                      <td style={{ color: "#444444" }}>
                        {formatDate(item.variable_start_stamp)}
                      </td>
                      <td>{formatTime(item.variable_start_stamp)}</td>
                      {/* <td
                        className={`${
                          item["Caller-Callee-ID-Number"] === extension &&
                          item["variable_billsec"] > 0
                            ? "incoming"
                            : item["Caller-Caller-ID-Number"] === extension
                            ? "outgoing"
                            : item["Caller-Callee-ID-Number"] === extension &&
                              item["variable_billsec"] === 0
                            ? "missed"
                            : item["Call-Direction"] === "voicemail"
                            ? "voicemail"
                            : ""
                        }`}
                      >
                        <span>
                          {item &&
                          item?.["Caller-Callee-ID-Number"] === extension &&
                          item?.["variable_billsec"] > 0
                            ? "Incoming"
                            : item?.["Caller-Caller-ID-Number"] === extension
                            ? "Outgoing"
                            : item?.["Caller-Callee-ID-Number"] === extension &&
                              item?.["variable_billsec"] === 0
                            ? "Missed"
                            : item?.["Call-Direction"] === "voicemail"
                            ? "Voicemail"
                            : ""}
                        </span>
                      </td> */}
                      {!isCustomerAdmin ? (
                        <td
                          className={`${item?.["Caller-Callee-ID-Number"] === extension &&
                            item?.["variable_billsec"] > 0
                            ? "incoming"
                            : item?.["Caller-Caller-ID-Number"] === extension
                              ? "outgoing"
                              : item?.["Caller-Callee-ID-Number"] ===
                                extension && item?.["variable_billsec"] === 0
                                ? "missed"
                                : item?.["Call-Direction"] === "voicemail"
                                  ? "voicemail"
                                  : ""
                            }`}
                        >
                          <span>
                            {item &&
                              item?.["Caller-Callee-ID-Number"] === extension &&
                              item?.["variable_billsec"] > 0
                              ? "Incoming"
                              : item?.["Caller-Caller-ID-Number"] === extension
                                ? "Outgoing"
                                : item?.["Caller-Callee-ID-Number"] ===
                                  extension && item?.["variable_billsec"] === 0
                                  ? "Missed"
                                  : item?.["Call-Direction"] === "voicemail"
                                    ? "voicemail"
                                    : ""}
                          </span>
                        </td>
                      ) : (
                        <td
                          className={`${item?.["variable_billsec"] === 0
                            ? "missed"
                            : item?.["Call-Direction"] === "voicemail"
                              ? "voicemail"
                              : ""
                            }`}
                        >
                          <span>
                            {item?.["Caller-Callee-ID-Number"]}==
                            <i class="fa-solid fa-angles-right"></i>
                            {item?.["Caller-Caller-ID-Number"]}
                          </span>
                        </td>
                      )}
                      {/* <td>{item["Caller-Caller-ID-Number"]}</td> */}
                      {/* <td>
                        {item["Caller-Caller-ID-Number"] ===
                        extension
                          ? item["Caller-Caller-ID-Number"]
                          : item["Caller-Callee-ID-Number"]}
                      </td> */}
                      <td style={{ color: "#444444" }}>
                        {formatDuration(item.variable_billsec)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CallDetails;
