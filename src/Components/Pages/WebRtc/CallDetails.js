/* eslint-disable eqeqeq */
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useSIPProvider } from "modify-react-sipjs";
import { toast } from "react-toastify";
import {
  featureUnderdevelopment,
  fileUploadFunction,
  generalGetFunction,
  generalPostFunction,
  generatePreSignedUrl,
} from "../../GlobalFunction/globalFunction";
import AudioWaveformCommon from "../../CommonComponents/AudioWaveformCommon";
import AudioTranscribe from "../../CommonComponents/AudioTranscribe";

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
  const thisAudioRef = useRef(null);
  const [currentPlaying, setCurrentPlaying] = useState("");
  const [audioURL, setAudioURL] = useState("");
  const [transcribeLink, setTranscribeLink] = useState("")

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

  async function handleTranscript(url) {
    const newUrl = url.split(".com/").pop();
    // const presignData = await generatePreSignedUrl(newUrl);
    // if (presignData?.status && presignData?.url) {
    // const trnascript = await generalPostFunction("/transcribe-audio", { src: presignData?.url });
    // const trnascript = await generalPostFunction("/transcribe-audio", { src:url });
    // }
    console.log({ url })
    const trnascript = await fileUploadFunction(`transcribe-audio`,
      { src: url },
    );
  }

  const handlePlaying = async (audio) => {
    // Reseting state before Playing
    setCurrentPlaying("");
    setAudioURL("");

    try {
      setCurrentPlaying(audio);
      const url = audio?.split(".com/").pop();
      // const res = await generatePreSignedUrl(url);

      // if (res?.status && res?.url) {
      // setAudioURL(res.url); // Update audio URL state
      setAudioURL(audio);
      // Wait for React state update before accessing ref
      setTimeout(() => {
        if (thisAudioRef.current) {
          thisAudioRef.current.load(); // Reload audio source
          thisAudioRef.current.play().catch((error) => {
            console.error("Audio play error:", error);
          });
        }
      }, 100); // Reduced timeout to minimize delay
      // }
    } catch (error) {
      console.error("Error in handlePlaying:", error);
    }
  };

  // const handleAudioDownload = (src) => {
  //   const link = document.createElement("a");
  //   link.href = src;
  //   link.download = "audio-file.wav";
  //   document.body.appendChild(link);
  //   link.click();
  //   document.body.removeChild(link);
  // };

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

  const handleSavedContactName = (callerName) => {
    if (!isCustomerAdmin) {
      const counterPartyExtension =
        callDetails && callDetails?.["Caller-Callee-ID-Number"] === extension
          ? callDetails?.["Caller-Caller-ID-Number"]
          : callDetails?.["Caller-Callee-ID-Number"];
      const matchingContact = allContact.find(
        (contact) => contact.did === counterPartyExtension
      );
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
            <div className="dropdown">
              <button
                className="clearButton2 xl"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <i className="fa-solid fa-ellipsis-vertical"></i>
              </button>
              <ul className="dropdown-menu">
                <li>
                  <a
                    className="dropdown-item"
                    href="/"
                    onClick={() => featureUnderdevelopment()}
                  >
                    Add to Contact
                  </a>
                </li>
                <li>
                  <a
                    className="dropdown-item"
                    href="/"
                    onClick={() => featureUnderdevelopment()}
                  >
                    Video Call
                  </a>
                </li>
                <li>
                  <a
                    className="dropdown-item"
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
                          <i className="fa-solid fa-angles-right"></i>
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
                  <div className="col-12">
                    <div className="heading">
                      <div className="content">
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
                            <th>Recordings</th>
                            <th></th>
                          </tr>
                        </thead>
                        <tbody>
                          {callHistory?.map((item) => {
                            const statusIcons = {
                              Missed: "fa-solid fa-phone-missed",
                              Cancelled: "fa-solid fa-phone-xmark",
                              Failed: "fa-solid fa-phone-slash",
                              transfer: "fa-solid fa-arrow-right-arrow-left",
                            };
                            const callIcons = {
                              inbound: {
                                icon: statusIcons[item.variable_DIALSTATUS] || "fa-phone-arrow-down-left",
                                color:
                                  item.variable_DIALSTATUS !==
                                    "Answered"
                                    ? "var(--funky-boy4)"
                                    : "var(--funky-boy3)",
                                label: "Inbound",
                              },
                              outbound: {
                                icon: statusIcons[item.variable_DIALSTATUS] || "fa-phone-arrow-up-right",
                                color:
                                  item.variable_DIALSTATUS !==
                                    "Answered"
                                    ? "var(--funky-boy4)"
                                    : "var(--color3)",
                                label: "Outbound",
                              },
                              internal: {
                                icon: statusIcons[item.variable_DIALSTATUS] || "fa-headset",
                                color:
                                  item.variable_DIALSTATUS !==
                                    "Answered"
                                    ? "var(--funky-boy4)"
                                    : "var(--color2)",
                                label: "Internal",
                              },
                            };

                            const callType =
                              callIcons[
                              item["Call-Direction"]
                              ] || callIcons.internal;

                            const getCallTypeIcon = () => {
                              return callType;
                              return (
                                <i className={`fa-solid ${callType.icon} me-1`} style={{ color: callType.color, }}        ></i>
                              );
                            }

                            return (
                              <>
                                <tr
                                  key={item.id}
                                  // data-bs-toggle="collapse"
                                  href={`#voiceMail${item.id}`}
                                  role="button"
                                  aria-expanded="false"
                                >
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
                                    <td>
                                      <i className={`fa-solid ${getCallTypeIcon().icon} me-2`} style={{ color: getCallTypeIcon().color }}></i>
                                      <span>
                                        {getCallTypeIcon().label}
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
                                            className="fa-solid fa-phone mx-2"
                                            style={{ color: "var(--ui-accent)" }}
                                          ></i>
                                        ) : (
                                          <i
                                            className="fa-solid fa-phone-xmark mx-2"
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

                                  <td>
                                    {item.variable_billsec > 0 && <button
                                      className="tableButton px-2 mx-0"
                                      onClick={() => {
                                        if (item?.recording_path === currentPlaying) {
                                          setCurrentPlaying("");
                                          setAudioURL("");
                                        } else {
                                          handlePlaying(item?.recording_path);
                                        }
                                      }}
                                    >
                                      {currentPlaying === item?.recording_path ? (
                                        <i className="fa-solid fa-chevron-up"></i>
                                      ) : (
                                        <i className="fa-solid fa-chevron-down"></i>
                                      )}
                                    </button>}
                                    {/* <div className="dropdown">
                                      <div
                                        className={`tableButton`}
                                        href="#"
                                        role="button"
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false"
                                      >
                                        <i className="fa-solid fa-ellipsis-vertical" />
                                      </div>
                                      <ul className="dropdown-menu actionBtnDropdowns">
                                        <>
                                          <li className="dropdown-item">
                                            <div
                                              className="clearButton text-align-start"
                                              onClick={() => {
                                                if (item?.recording_path) {
                                                  handlePlaying(
                                                    item?.recording_path
                                                  );
                                                }
                                              }}
                                            >
  
                                              <i
                                                className={`fa-solid fa-${item.configuration !== null
                                                  ? "play"
                                                  : "triangle-exclamation"
                                                  } me-2`}
                                              ></i>{" "}
                                              {item.configuration !== null
                                                ? "Play "
                                                : "Configure"}
                                            </div>
                                          </li>
  
                                          <li className="dropdown-item">
                                            <div
                                              className="clearButton text-align-start"
                                              onClick={() => {
                                                if (item?.recording_path) {
                                                  setTranscribeLink(item?.recording_path)
                                                }
                                              }
                                              }
                                            >
                                              <i className="fa-solid fa-bolt me-2"></i>
                                              Transcript
                                            </div>
                                          </li>
                                        </>
  
                                        <>
                                          <li className="dropdown-item">
                                            <div
                                              className="clearButton text-align-start"
                                              onClick={() =>
                                                handleAudioDownload(
                                                  item.recording_path
                                                )
                                              }
                                            >
                                              <i className="fa-regular fa-download"></i>{" "}
                                              Download
                                            </div>
                                          </li>
                                        </>
                                        <li className="dropdown-item"></li>
                                      </ul>
                                    </div> */}
                                  </td>
                                </tr>
                                {item?.recording_path &&
                                  currentPlaying === item?.recording_path && (
                                    <tr
                                      className="show"
                                      id={`voiceMail${item?.id}`}
                                    >
                                      <td colSpan={5}>
                                        <div className="audio-container">
                                          <AudioWaveformCommon audioUrl={audioURL} />
                                          {/* <audio
                                            controls={true}
                                            ref={thisAudioRef}
                                            autoPlay={true}
                                            onEnded={() => {
                                              setCurrentPlaying(null);
                                            }}
                                          >
                                            <source
                                              src={audioURL}
                                              type="audio/mpeg"
                                            />
                                          </audio> */}

                                          {/* <button
                                            className="audioCustomButton"
                                            onClick={() =>
                                              handleAudioDownload(
                                                item.recording_path
                                              )
                                            }
                                          >
                                            <i className="fa-sharp fa-solid fa-download"></i>
                                          </button> */}
                                          {/* <button className="audioCustomButton ms-1">
                                            <i className="fa-sharp fa-solid fa-box-archive"></i>
                                          </button> */}
                                        </div>
                                      </td>
                                    </tr>
                                  )}
                                {/* {
                                  transcribeLink === item?.recording_path ?
                                    <tr
                                      className="show"
                                      id={`voiceMail${item?.id}`}
                                    >
                                      <td colSpan={5}>
                                        <AudioTranscribe url={transcribeLink} />
                                      </td>
                                    </tr>
                                    : ""
                                } */}
                              </>
                            )
                          }

                          )}
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
