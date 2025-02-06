/* eslint-disable eqeqeq */
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useSIPProvider } from "modify-react-sipjs";
import { toast } from "react-toastify";
import { featureUnderdevelopment } from "../../GlobalFunction/globalFunction";

function CallDetails({
  clickedCall,
  callHistory,
  isCustomerAdmin,
  setSelectedModule,
  isMicOn,
  isVideoOn,
  onCall,
  setactivePage,
  setExtensionFromCdrMessage,
  allContact,
}) {
  const [callDetails, setCallDetails] = useState();
  const { connectStatus } = useSIPProvider();
  const account = useSelector((state) => state.account);
  const extension = account?.extension?.extension || "";
  const [isMessageingAvailable, setIsMessageingAvailable] = useState(false);
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
      `${hour ? hour + " hr" : ""}${min ? min + " min" : ""} ${
        sec ? sec + " sec" : ""
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

  const handleSendSMS = () => {
    if (!isCustomerAdmin) {
      const selectedExtension =
        callDetails["Caller-Callee-ID-Number"] === extension
          ? callDetails["Caller-Caller-ID-Number"]
          : callDetails["Caller-Callee-ID-Number"];

      setExtensionFromCdrMessage(selectedExtension);
      setactivePage("messages");
    } else {
      const selectedCallee = callDetails["Caller-Callee-ID-Number"];
      setExtensionFromCdrMessage(selectedCallee);
      setactivePage("messages");
    }
  };
  console.log(callDetails);

  useEffect(() => {
    if (callDetails) {
      if (
        callDetails.application_state == "voicemail" ||
        callDetails.application_state == "extension"
      ) {
        setIsMessageingAvailable(true);
      } else {
        setIsMessageingAvailable(false);
      }
    }
  }, [callDetails]);
  // console.log(callDetails);

  const handleSavedContactName = (callerName) => {
    if (!isCustomerAdmin) {
      const counterPartyExtension =
        callDetails && callDetails?.["Caller-Callee-ID-Number"] === extension
          ? callDetails?.["Caller-Caller-ID-Number"]
          : callDetails?.["Caller-Callee-ID-Number"];
      const matchingContact = allContact.find(
        (contact) => contact.did === counterPartyExtension
      );

      // console.log(matchingContact);
      if (matchingContact) {
        return `${matchingContact.title} - ${matchingContact.name}`;
      } else {
        return callerName;
      }
    } else {
      const counterPartyExtension = callDetails?.["Caller-Callee-ID-Number"];

      const matchingContact = allContact.find(
        (contact) => contact.did === counterPartyExtension
      );

      // console.log(matchingContact);
      if (matchingContact) {
        return `${matchingContact.title} - ${matchingContact.name}`;
      } else {
        return callerName;
      }
    }
  };
  return (
    <>
      <div className="messageOverlay">
        <div className="contactHeader">
          <div>
            <h4 className="mb-0">
              {handleSavedContactName(callDetails?.caller_user?.username)}
            </h4>
            <p className="gray14 mb-0 mt-1">
              Extension -{" "}
              {!isCustomerAdmin
                ? callDetails &&
                  callDetails?.["Caller-Callee-ID-Number"] === extension
                  ? callDetails?.["Caller-Caller-ID-Number"]
                  : callDetails?.["Caller-Callee-ID-Number"]
                : callDetails?.["Caller-Callee-ID-Number"]}
            </p>
          </div>
          <div className="d-flex my-auto">
            {/* <div className="d-flex align-items-center me-2">
              <label className="gray14 me-2">Assigned to:</label>
              <select className="ovalSelect">
                <option>
                  {callDetails?.caller_user?.username}
                </option>
              </select>
            </div> */}
            {isMessageingAvailable && (
              <button
                className="clearButton2 xl"
                effect="ripple"
                // onClick={() => setactivePage("messages")}
                onClick={() => handleSendSMS()}
              >
                <i className="fa-regular fa-message-dots" />
              </button>
            )}

            <button
              className="clearButton2 xl"
              effect="ripple"
              onClick={() => handleVoiceCall("audio")}
            >
              <i className="fa-regular fa-phone" />
            </button>
            {isVideoOn && (
              <button
                className="clearButton2 xl"
                effect="ripple"
                onClick={() => handleVoiceCall("video")}
              >
                <i className="fa-regular fa-video" />
              </button>
            )}
            <div class="dropdown">
              <button
                class="clearButton2 xl"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <i class="fa-solid fa-ellipsis-vertical"></i>
              </button>
              <ul class="dropdown-menu">
                <li>
                  <a
                    class="dropdown-item"
                    href="/"
                    onClick={() => featureUnderdevelopment()}
                  >
                    Add to Contact
                  </a>
                </li>
                <li>
                  <a
                    class="dropdown-item"
                    href="/"
                    onClick={() => featureUnderdevelopment()}
                  >
                    Video Call
                  </a>
                </li>
                <li>
                  <a
                    class="dropdown-item"
                    href="/"
                    onClick={() => featureUnderdevelopment()}
                  >
                    Delete Contact
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      {/* <div className="profileInfoHolder">
        <div className="profileHolder">
          <i className="fa-light fa-user fs-4" />
        </div>
        <div>
          <h4>
            {(callDetails && callDetails.caller_user?.username) || "USER XYZ"}
          </h4>
          <h5>
            Extension - {!isCustomerAdmin
              ? callDetails &&
                callDetails?.["Caller-Callee-ID-Number"] === extension
                ? callDetails?.["Caller-Caller-ID-Number"]
                : callDetails?.["Caller-Callee-ID-Number"]
              : callDetails?.["Caller-Callee-ID-Number"]}
          </h5>
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
      </div> */}
      <div className="mt-2">
        {/* <nav>
          <div className="nav nav-tabs" id="nav-tab" role="tablist" style={{ borderBottom: '1px solid #ddd' }}>
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
              Call Info
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
              Call Logs
            </button>
          </div>
        </nav> */}
        <div className="tab-content" id="nav-tabContent">
          <div
            className="tab-pane fade"
            id="nav-home"
            role="tabpanel"
            aria-labelledby="nav-home-tab"
            tabIndex={0}
          >
            <div className="callDetailsList tableContainer">
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Call Type</th>
                    <th>Call ID</th>
                    <th>Duration</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ color: "#444444" }}>
                      {formatDate(
                        callDetails && callDetails.variable_start_stamp
                      )}
                    </td>
                    <td>
                      {formatTime(
                        callDetails && callDetails.variable_start_stamp
                      )}
                    </td>
                    {!isCustomerAdmin ? (
                      <td
                        style={{ paddingLeft: "32px" }}
                        className={`${
                          callDetails?.["Caller-Callee-ID-Number"] ===
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
                        className={`${
                          callDetails?.["variable_billsec"] === 0
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
                    <td>{callDetails && callDetails.id}</td>
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
            <div className="overviewTableWrapper p-2">
              <div className="overviewTableChild">
                <div className="d-flex flex-wrap">
                  <div class="col-12">
                    <div class="heading">
                      <div class="content">
                        <h4>Call Logs</h4>
                        <p>You can see all of the call logs here</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-12" style={{ padding: "25px 20px 0px" }}>
                    <div className="callDetailsList tableContainer mt-0">
                      <table>
                        <thead>
                          <tr>
                            <th>Date</th>
                            <th>Time</th>
                            <th>Call Type</th>
                            <th>Duration</th>
                          </tr>
                        </thead>
                        <tbody>
                          {callHistory?.map((item) => (
                            <tr key={item.id}>
                              <td>{formatDate(item.variable_start_stamp)}</td>
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
                                  style={{ paddingLeft: "32px" }}
                                  className={`${
                                    item?.["Caller-Callee-ID-Number"] ===
                                      extension &&
                                    item?.["variable_billsec"] > 0
                                      ? "incoming"
                                      : item?.["Caller-Caller-ID-Number"] ===
                                        extension
                                      ? "outgoing"
                                      : item?.["Caller-Callee-ID-Number"] ===
                                          extension &&
                                        item?.["variable_billsec"] === 0
                                      ? "missed"
                                      : item?.["Call-Direction"] === "voicemail"
                                      ? "voicemail"
                                      : ""
                                  }`}
                                >
                                  <span>
                                    {item &&
                                    item?.["Caller-Callee-ID-Number"] ===
                                      extension &&
                                    item?.["variable_billsec"] > 0
                                      ? "Incoming"
                                      : item?.["Caller-Caller-ID-Number"] ===
                                        extension
                                      ? "Outgoing"
                                      : item?.["Caller-Callee-ID-Number"] ===
                                          extension &&
                                        item?.["variable_billsec"] === 0
                                      ? "Missed"
                                      : item?.["Call-Direction"] === "voicemail"
                                      ? "voicemail"
                                      : ""}
                                  </span>
                                </td>
                              ) : (
                                <td
                                // className={`${item?.["variable_billsec"] === 0
                                //   ? "missed"
                                //   : item?.["Call-Direction"] === "voicemail"
                                //     ? "voicemail"
                                //     : ""
                                //   }`}
                                >
                                  <span>
                                    {item?.["Caller-Callee-ID-Number"]}
                                    {item?.["variable_billsec"] > 0 ? (
                                      <i
                                        class="fa-solid fa-phone mx-2"
                                        style={{ color: "var(--ui-accent)" }}
                                      ></i>
                                    ) : (
                                      <i
                                        class="fa-solid fa-phone-xmark mx-2"
                                        style={{ color: "red" }}
                                      ></i>
                                    )}
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
                              <td style={{ color: "var(--color-subtext)" }}>
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
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CallDetails;
