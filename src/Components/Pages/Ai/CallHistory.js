import React, { useEffect, useState } from "react";
import Header from "../../CommonComponents/Header";
import Transcription from "./Transcription";
import Data from "./Data";
import DetailLogs from "./DetailLogs";
import { Link } from "react-router-dom";
import {
  aiGeneralDeleteFunction,
  aiGeneralGetFunction,
} from "../../GlobalFunction/globalFunction";
import { toast } from "react-toastify";
import { setRef } from "@mui/material";
import ThreeDotedLoader from "../../Loader/ThreeDotedLoader";

const CallHistory = () => {
  const [endDateFlag, setEndDateFlag] = useState(
    new Date()?.toISOString()?.split("T")[0]
  );
  const fiveDaysAgo = new Date();
  fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);
  const formattedFiveDaysAgo = fiveDaysAgo.toISOString().split("T")[0];
  const [startDateFlag, setStartDateFlag] = useState(formattedFiveDaysAgo);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [refreshState, setRefreshState] = useState(false);
  const [calls, setCalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCall, setSelectedCall] = useState(null);
  const [refreshData, setRefreshData] = useState(0);
  useEffect(() => {
    async function getData() {
      setRefreshState(true);
      const apiData = await aiGeneralGetFunction("/call/all");
      if (apiData.status) {
        setRefreshState(false);
        setCalls(apiData.data);
        setLoading(false);
        setDeleteLoading(false);
        setShowDeleteDialog(false);
      } else {
        setRefreshState(false);
        setLoading(false);
      }
    }
    getData();
  }, [refreshData]);
  function formatTimestampToDateTime(timestamp) {
    const date = new Date(timestamp);

    return date.toLocaleString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  }

  function formatDurationToTime(durationMs) {
    const totalSeconds = Math.floor(durationMs / 1000);

    const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
    const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(
      2,
      "0"
    );
    const seconds = String(totalSeconds % 60).padStart(2, "0");

    return `${hours}:${minutes}:${seconds}`;
  }

  const filteredCalls = calls?.filter((call) => {
    if (!startDateFlag || !endDateFlag || !call?.start_timestamp) return false;

    const callDate = new Date(call.start_timestamp);

    const from = new Date(startDateFlag);
    from.setHours(0, 0, 0, 0);

    const to = new Date(endDateFlag);
    to.setHours(23, 59, 59, 999);

    return callDate >= from && callDate <= to;
  });

  const exportToCSV = () => {
    if (!filteredCalls || filteredCalls.length === 0) {
      return alert("No data available to export.");
    }

    // Dynamically get all unique keys from all objects
    const allKeys = Array.from(
      new Set(filteredCalls.flatMap((call) => Object.keys(call)))
    );

    // CSV headers
    const headers = allKeys;

    // Rows
    const rows = filteredCalls.map((call) =>
      allKeys.map((key) => {
        const value = call[key];

        // Format timestamp if it's the start_timestamp
        if (key === "start_timestamp") {
          return formatTimestampToDateTime(value);
        }

        return value !== undefined && value !== null ? value : "";
      })
    );

    // Combine headers and rows
    const csvContent = [headers, ...rows]
      .map((row) =>
        row.map((item) => `"${String(item).replace(/"/g, '""')}"`).join(",")
      )
      .join("\n");

    // Trigger download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "filtered_calls.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  async function handleDeleteKnowledgeBase() {
    setDeleteLoading(true);
    const apiData = await aiGeneralDeleteFunction(
      `/call/delete/${selectedCall?.call_id}`
    );
    if (apiData.status) {
      setRefreshData(refreshData + 1);
      toast.success("Call history deleted successfully.");
    } else {
      toast.error(apiData.error || "Failed to delete call history.");
      setShowDeleteDialog(false);
      setDeleteLoading(false);
    }
  }
  return (
    <>
      <main className="mainContent">
        <section id="phonePage">
          <div className="container-fluid">
            <div className="row">
              <Header title="Call History" />
              <div className="overviewTableWrapper">
                <div className="overviewTableChild">
                  <div className="d-flex flex-wrap">
                    <div className="col-12">
                      <div className="heading">
                        <div className="content">
                          <h4>
                            Call History{" "}
                            <button
                              className="clearButton"
                              //   onClick={handleRefreshBtnClicked}
                              disabled={refreshState}
                            >
                              <i
                                onClick={() => setRefreshData(refreshData + 1)}
                                className={
                                  refreshState
                                    ? "fa-regular fa-arrows-rotate fs-5 fa-spin"
                                    : "fa-regular fa-arrows-rotate fs-5"
                                }
                              ></i>
                            </button>
                          </h4>
                          <p>This is where you can view the call history </p>
                        </div>
                        <div className="buttonGroup ">
                          <button
                            onClick={exportToCSV}
                            className="panelButton static edit exportGroupBtn"
                          >
                            <span className="text">Export</span>
                          </button>
                        </div>
                      </div>
                    </div>
                    <div
                      className="col-12"
                      style={{ overflow: "auto", padding: "10px 20px 0" }}
                    >
                      <div className="tableHeader flex-column align-items-start">
                        <div className="d-flex justify-content-between w-100 gap-2 flex-wrap mb-2">
                          <div className="formRow border-0 p-0 gap-2">
                            <div className="d-flex justify-content-start flex-wrap gap-2">
                              <div className="formRow border-0 p-0 gap-2">
                                <label className="formLabel text-start mb-0 w-100">
                                  From
                                </label>
                                <div className="d-flex w-100">
                                  <input
                                    type="date"
                                    className="formItem"
                                    max={
                                      new Date()?.toISOString()?.split("T")[0]
                                    }
                                    value={startDateFlag}
                                    onChange={(e) => {
                                      setStartDateFlag(e.target.value);
                                    }}
                                  />
                                </div>
                              </div>
                              <div className="formRow border-0 p-0 gap-2">
                                <label className="formLabel text-start mb-0 w-100">
                                  To
                                </label>
                                <div className="d-flex w-100">
                                  <input
                                    type="date"
                                    className="formItem"
                                    max={
                                      new Date()?.toISOString()?.split("T")[0]
                                    }
                                    value={endDateFlag}
                                    onChange={(e) => {
                                      setEndDateFlag(e.target.value);
                                    }}
                                    min={startDateFlag} // Prevent selecting an end date before the start date
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="tableContainer">
                        <table>
                          <thead>
                            <tr>
                              <th>Time</th>
                              <th>Duration</th>
                              <th>Type</th>
                              <th>Cost</th>
                              <th>Call ID</th>
                              <th>Disconnect Reason</th>
                              <th>Call Status</th>
                              <th>User Sentiment</th>
                              <th>From</th>
                              <th>To</th>
                            </tr>
                          </thead>
                          <tbody className="">
                            {loading ? (
                              <ThreeDotedLoader />
                            ) : (
                              <>
                                {filteredCalls.length === 0 ? (
                                  <tr>
                                    <td colSpan="10" className="text-center">
                                      No data found
                                    </td>
                                  </tr>
                                ) : (
                                  filteredCalls.map((call, index) => (
                                    <tr
                                      onClick={() => {
                                        setSelectedCall(call);
                                      }}
                                      key={index}
                                      data-bs-toggle="offcanvas"
                                      data-bs-target="#offcanvasRight"
                                      aria-controls="offcanvasRight"
                                    >
                                      <td>
                                        {formatTimestampToDateTime(
                                          call?.start_timestamp
                                        )}
                                      </td>
                                      <td>
                                        {formatDurationToTime(
                                          call?.duration_ms
                                        )}
                                      </td>
                                      <td>{call?.call_type}</td>
                                      <td>
                                        {" "}
                                        {call?.call_cost?.combined_cost && "$"}
                                        {call?.call_cost?.combined_cost}
                                      </td>
                                      <td> {call?.call_id}</td>
                                      <td>
                                        {call?.disconnection_reason
                                          ?.split("_")
                                          .join(" ")}
                                      </td>
                                      <td>{call?.call_status}</td>
                                      <td>
                                        {call?.call_analysis?.user_sentiment}
                                      </td>
                                      <td>{call?.from_number}</td>
                                      <td>{call?.to_number}</td>
                                    </tr>
                                  ))
                                )}
                              </>
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
        </section>

        <div
          className="offcanvas offcanvas-end w-30"
          tabIndex="-1"
          id="offcanvasRight"
          aria-labelledby="offcanvasRightLabel"
        >
          <div
            className="offcanvas-header"
            style={{ borderBlockEnd: "1px solid var(--me-border1)" }}
          >
            <div>
              <h5 className="offcanvas-title" id="offcanvasRightLabel">
                Call History
              </h5>
              <p
                className="f-s-14 mb-0"
                style={{ color: "var(--color-subtext)" }}
              >
                See all the details of this Call History
              </p>
            </div>
            <button
              type="button"
              className="btn-close ms-auto"
              data-bs-dismiss="offcanvas"
              aria-label="Close"
            ></button>
          </div>
          <div className="offcanvas-body p-3">
            <div className="heading">
              <h5 className="offcanvas-title" id="offcanvasRightLabel">
                {formatTimestampToDateTime(selectedCall?.start_timestamp)}{" "}
                {selectedCall?.call_type}
              </h5>
              <button
                className=" bg-transparent border-0 text-danger"
                onClick={setShowDeleteDialog}
              >
                <i className="fa-solid fa-trash"></i>
              </button>
            </div>
            <div className="content">
              <p className="mb-0" style={{ color: "var(--color-subtext)" }}>
                <strong>Agent:</strong>{" "}
                <span className="fs-12"> {selectedCall?.agent_id}</span>
                <button
                  className="clearButton"
                  //   onClick={() => {
                  //     setIdCopy(!idCopy);
                  //   }}
                >
                  <i
                    className={
                      true //   idCopy
                        ? "fa-solid fa-check text_success"
                        : "fa-solid fa-clone"
                    }
                  ></i>
                </button>
              </p>
              <p className="mb-0" style={{ color: "var(--color-subtext)" }}>
                <strong>Duration:</strong>{" "}
                <span className="fs-12">
                  {formatDurationToTime(selectedCall?.duration_ms)}
                </span>
              </p>
              <p className="mb-0" style={{ color: "var(--color-subtext)" }}>
                <strong>Cost:</strong>{" "}
                <span className="fs-12">
                  ${selectedCall?.call_cost?.combined_cost}
                </span>
              </p>
            </div>
            <div
              className="d-flex justify-content-between align-items-center gap-3 my-3 rounded-3 p-2"
              style={{ border: "1px solid var(--me-border1)" }}
            >
              <audio
                src={selectedCall?.recording_url}
                controls
                className="w-[300px] h-10"
              >
                {/* <source  /> */}
              </audio>
            </div>
            <div
              className="rounded-3 p-2 table__details mb-2"
              style={{ border: "1px solid var(--me-border1)" }}
            >
              <h6 style={{ color: "var(--immortalBlack)" }}>
                Conversation Analysis
              </h6>
              <p className="f-s-14" style={{ color: "var(--color-subtext)" }}>
                Preset
              </p>

              <div className="d-flex justify-content-start align-items-center gap-2">
                <p className="status_text">
                  <i className="fa-solid fa-headphones"></i>{" "}
                  <span>Call Status</span>
                </p>
                <p className="status_text">
                  <i className="fa-solid fa-circle-small text-danger"></i>{" "}
                  <span className="endedTxt">{selectedCall?.call_status}</span>
                </p>
              </div>
              <div className="d-flex justify-content-start align-items-center gap-2">
                <p className="status_text">
                  <i className="fa-regular fa-user-vneck-hair"></i>{" "}
                  <span>User Sentiment</span>
                </p>
                <p className="status_text">
                  <i className="fa-solid fa-circle-small text-primary"></i>{" "}
                  <span className="endedTxt">
                    {selectedCall?.call_analysis?.user_sentiment}
                  </span>
                </p>
              </div>
              <div className="d-flex justify-content-start align-items-center gap-2">
                <p className="status_text">
                  <i className="fa-regular fa-phone"></i>{" "}
                  <span>Disconnection Reason</span>
                </p>
                <p className="status_text">
                  <i className="fa-solid fa-circle-small text-warning"></i>{" "}
                  <span className="endedTxt">
                    {selectedCall?.disconnection_reason?.split("_").join(" ")}
                  </span>
                </p>
              </div>
            </div>
            <div
              className="rounded-3 p-2 table__details mb-2"
              style={{ border: "1px solid var(--me-border1)" }}
            >
              <h6 className="f-s-14" style={{ color: "var(--immortalBlack)" }}>
                Summary
              </h6>
              <p className="f-s-14" style={{ color: "var(--color-subtext)" }}>
                {selectedCall?.call_analysis?.call_summary}
              </p>
            </div>
            <div
              className="rounded-3 p-2 table__details mb-2"
              style={{ border: "1px solid var(--me-border1)" }}
            >
              <p className="f-s-14" style={{ color: "var(--color-subtext)" }}>
                Transcription
              </p>
              {selectedCall?.transcript_object?.map((item, index) => {
                return (
                  <div className="d-flex justify-content-start align-items-start gap-2 mb-3">
                    <p className="status_text" style={{ maxWidth: "50px" }}>
                      {" "}
                      <span>{item.role}:</span>
                    </p>
                    <p className="status_text">
                      <span className="endedTxt"> {item.content}</span>
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>

      {showDeleteDialog && (
        <div className="popup">
          <div className="container h-100">
            <div className="row h-100 justify-content-center align-items-center">
              <div className="row content col-xl-4 col-md-5">
                <div className="col-12">
                  <div className="iconWrapper">
                    <i className="fa-duotone fa-circle-exclamation text-danger"></i>
                  </div>
                </div>
                <div className="col-12">
                  <h4 className="text-center text-danger">Confirmation!</h4>
                  <p className="text-center">
                    Are you sure! You want to delete this DID
                  </p>

                  <div className="d-flex justify-content-center gap-2 mt-4">
                    <button
                      className="panelButton m-0"
                      onClick={handleDeleteKnowledgeBase}
                    >
                      <span className="text">
                        {deleteLoading ? "Deleting..." : "Delete"}
                      </span>
                      <span className="icon">
                        <i className="fa-solid fa-check"></i>
                      </span>
                    </button>
                    <button
                      className="panelButton gray m-0 float-end"
                      onClick={() => {
                        setShowDeleteDialog(false);
                      }}
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
      )}
    </>
  );
};

export default CallHistory;
