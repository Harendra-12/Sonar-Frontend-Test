import { duration } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSIPProvider } from "react-sipjs";

function CallDetails({ clickedCall, callHistory }) {
  const [callDetails, setCallDetails] = useState();
  const dispatch = useDispatch();
  const globalSession = useSelector((state) => state.sessions);
  const { sessionManager } = useSIPProvider();

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
      `${hour ? hour + " hr" : ""}${min ? min + " min" : ""}${
        sec ? sec + " sec" : ""
      }` || "0 sec"
    );
  };

  const renderCallHistory = (item) => {
    <tr key={item.id}>
      <td style={{ color: "#444444" }}>
        {formatDate(item.variable_start_stamp)}
      </td>
      <td>{formatTime(item.variable_start_stamp)}</td>
      <td
        className={`${
          item["Call-Direction"] === "inbound"
            ? "incoming"
            : item["Call-Direction"] === "outbound"
            ? "outgoing"
            : item["Call-Direction"] === "missed"
            ? "missed"
            : item["Call-Direction"] === "voicemail"
            ? "voicemail"
            : ""
        }`}
      >
        <span>
          {item["Call-Direction"].charAt(0).toUpperCase() +
            item["Call-Direction"].slice(1).toLowerCase()}
        </span>
      </td>
      <td>{item["Caller-Caller-ID-Number"]}</td>
      <td style={{ color: "#444444" }}>
        {formatDuration(item.variable_duration)}
      </td>
    </tr>;
  };

  async function onCall(e) {
    e.preventDefault();
    const apiData = await sessionManager?.call(
      `sip:${Number(callDetails.variable_sip_from_user)}@192.168.2.225`,
      {}
    );

    dispatch({
      type: "SET_SESSIONS",
      sessions: [
        ...globalSession,
        {
          id: apiData._id,
          destination: Number(callDetails.variable_sip_from_user),
        },
      ],
    });
    dispatch({
      type: "SET_CALLPROGRESSID",
      callProgressId: apiData._id,
    });
    dispatch({
      type: "SET_CALLPROGRESSDESTINATION",
      callProgressDestination: Number(callDetails.variable_sip_from_user),
    });
    dispatch({
      type: "SET_CALLPROGRESS",
      callProgress: true,
    });
  }

  return (
    <>
      <div className="profileInfoHolder">
        <div className="profileHolder">
          <i className="fa-light fa-user fs-3" />
        </div>
        {/* <h4>1 (999) 999-9999</h4> */}
        <h4>{callDetails && callDetails["Caller-Callee-ID-Number"]}</h4>
        {/* <h5>USER XYZ</h5> */}
        <h5>
          {(callDetails && callDetails.caller_user?.username) || "USER XYZ"}
        </h5>
        <div className="d-flex justify-content-center align-items-center mt-3">
          <button className="appPanelButton" effect="ripple">
            <i className="fa-light fa-message-dots" />
          </button>
          <button className="appPanelButton" effect="ripple" onClick={onCall}>
            <i className="fa-light fa-phone" />
          </button>
          <button className="appPanelButton" effect="ripple">
            <i className="fa-light fa-video" />
          </button>
        </div>
      </div>
      <div className="mt-2">
        <nav>
          <div className="nav nav-tabs" id="nav-tab" role="tablist">
            <button
              className="tabLink active"
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
              className="tabLink"
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
            className="tab-pane fade show active"
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
                    <td
                      className={`${
                        callDetails?.["Call-Direction"] === "inbound"
                          ? "incoming"
                          : callDetails?.["Call-Direction"] === "outbound"
                          ? "outgoing"
                          : callDetails?.["Call-Direction"] === "missed"
                          ? "missed"
                          : callDetails?.["Call-Direction"] === "voicemail"
                          ? "voicemail"
                          : ""
                      }`}
                    >
                      <span>
                        {callDetails &&
                          callDetails["Call-Direction"]
                            .charAt(0)
                            .toUpperCase() +
                            callDetails["Call-Direction"]
                              .slice(1)
                              .toLowerCase()}
                      </span>
                    </td>
                    {/* <td>1 (999) 999-9999</td> */}
                    <td>{callDetails && callDetails.id}</td>
                    {/* <td style={{ color: "#444444" }}>16 sec</td> */}
                    <td style={{ color: "#444444" }}>
                      {formatDuration(
                        callDetails && callDetails.variable_duration
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div
            className="tab-pane fade"
            id="nav-profile"
            role="tabpanel"
            aria-labelledby="nav-profile-tab"
            tabindex="0"
          >
            <div className="callDetailsList">
              <table className="mt-3">
                <tbody>
                  {callHistory.map((item) => (
                    <tr key={item.id}>
                      <td style={{ color: "#444444" }}>
                        {formatDate(item.variable_start_stamp)}
                      </td>
                      <td>{formatTime(item.variable_start_stamp)}</td>
                      <td
                        className={`${
                          item["Call-Direction"] === "inbound"
                            ? "incoming"
                            : item["Call-Direction"] === "outbound"
                            ? "outgoing"
                            : item["Call-Direction"] === "missed"
                            ? "missed"
                            : item["Call-Direction"] === "voicemail"
                            ? "voicemail"
                            : ""
                        }`}
                      >
                        <span>
                          {item["Call-Direction"].charAt(0).toUpperCase() +
                            item["Call-Direction"].slice(1).toLowerCase()}
                        </span>
                      </td>
                      <td>{item["Caller-Caller-ID-Number"]}</td>
                      <td style={{ color: "#444444" }}>
                        {formatDuration(item.variable_duration)}
                      </td>
                    </tr>
                  ))}
                  {/* <tr>
                    <td style={{ color: "#444444" }}>Jan 16, 2022</td>
                    <td>12:46 PM</td>
                    <td className="missed">
                      <span>Missed</span>
                    </td>
                    <td>1 (999) 999-9999</td>
                    <td style={{ color: "#444444" }}>24 sec</td>
                  </tr>
                  <tr>
                    <td style={{ color: "#444444" }}>Jan 16, 2022</td>
                    <td>12:46 PM</td>
                    <td className="incoming">
                      <span>Incoming</span>
                    </td>
                    <td>1 (999) 999-9999</td>
                    <td style={{ color: "#444444" }}>10 sec</td>
                  </tr>
                  <tr>
                    <td style={{ color: "#444444" }}>Jan 16, 2022</td>
                    <td>12:46 PM</td>
                    <td className="outgoing">
                      <span>Outgoing</span>
                    </td>
                    <td>1 (999) 999-9999</td>
                    <td style={{ color: "#444444" }}>1 min 10 sec</td>
                  </tr>
                  <tr>
                    <td style={{ color: "#444444" }}>Jan 16, 2022</td>
                    <td>12:46 PM</td>
                    <td className="outgoing">
                      <span>Outgoing</span>
                    </td>
                    <td>1 (999) 999-9999</td>
                    <td style={{ color: "#444444" }}>35 sec</td>
                  </tr> */}
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
