/* eslint-disable array-callback-return */
/* eslint-disable eqeqeq */
/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import Header from "../../CommonComponents/Header";

import {
  awsGeneralPostFunction,
  backToTop,
} from "../../GlobalFunction/globalFunction";
import { useNavigate } from "react-router-dom";
import EmptyPrompt from "../../Loader/EmptyPrompt";
import PaginationComponent from "../../CommonComponents/PaginationComponent";
import { toast } from "react-toastify";
import ThreeDotedLoader from "../../Loader/ThreeDotedLoader";
import { api_url } from "../../../urls";
import { useSelector } from "react-redux";

/**
 * CdrFilterReport is a React component that manages and displays Call Detail Records (CDR)
 * reports based on various filters and parameters. It fetches data from an API and allows
 * users to filter, block numbers, and export data. The component handles different types
 * of reports like billing, call center, ring group, and call recordings and provides
 * pagination, data filtering by date and time, and the ability to view and manage comments
 * and duplicate records.
 *
 * @param {Object} props - The component props.
 * @param {string} props.page - The current page type to determine which keys to display
 * in the report table.
 */

function AICDRSearch({ page }) {
  const account = useSelector((state) => state.account);
  const [loading, setLoading] = useState(false);
  const [cdr, setCdr] = useState();
  const navigate = useNavigate();
  const [advanceSearch, setAdvanceSearch] = useState();
  const [selectedCall, setSelectedCall] = useState();
  const [selectedAudioPath, setSelectedAudioPath] = useState("");
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [agentName, setAgentName] = useState();

  async function getAdvanceSearch() {
    if (!advanceSearch || advanceSearch?.trim() === "") {
      toast.error("Please enter some data to search");
      return;
    }
    if (advanceSearch) {
      setLoading(true);
      const res = await awsGeneralPostFunction(api_url?.AI_SEARCH, {
        query: advanceSearch,
        ...(startDate && {
          date_range: endDate ? `${startDate}:${endDate}` : startDate,
        }),
        ...(agentName?.trim() && { agent_name: agentName }),
      });
      if (res?.status) {
        setLoading(false);
        setCdr(res?.data);
        console.log(res);
      } else {
        toast.error(res?.err);
        setLoading(false);
      }
    } else {
      toast.error("Please enter some data to search");
      setLoading(false);
    }
  }
  console.log(cdr);
  const formatDuration = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const padded = (num) => String(num).padStart(2, "0");

    return `${padded(hours)}:${padded(minutes)}:${padded(seconds)}`;
  };
  function parseTranscript(rawText) {
    const lines = rawText.split("\n");
    const entries = [];

    const regex = /^(Agent|Customer) \[(\d+\.\d+)-(\d+\.\d+)s\]: (.+)$/;

    for (let line of lines) {
      const match = line.match(regex);
      if (match) {
        const [, speaker, start, end, text] = match;
        entries.push({
          speaker,
          start: parseFloat(start),
          end: parseFloat(end),
          text,
        });
      }
    }

    return entries;
  }

  const today = new Date().toISOString().split("T")[0]; // "2025-07-03"

  function formatTimestampToDateTime(timestamp) {
    const date = new Date(timestamp);
    const timeZone = account?.timezone?.name || "UTC"; // Use user's time zone or default to UTC

    return date.toLocaleString("en-GB", {
      timeZone,
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  }

  return (
    <>
      <main className="mainContent">
        <section id="phonePage">
          <Header title="AI CDR Search" />
          <div className="container-fluid px-0 position-relative">
            <div className="overviewTableWrapper">
              <div className="overviewTableChild">
                <div className="d-flex flex-wrap">
                  <div className="col-12">
                    <div className="heading">
                      <div className="content">
                        <h4>AI CDR Search</h4>
                        <p>
                          Search for a specific call detail record with the
                          power of AI
                        </p>
                      </div>
                      <div className="buttonGroup">
                        <button
                          effect="ripple"
                          className="panelButton gray"
                          onClick={() => {
                            navigate(-1);
                            backToTop();
                          }}
                        >
                          <span className="text">Back</span>
                          <span className="icon">
                            <i className="fa-solid fa-caret-left"></i>
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                  <div
                    className="col-12"
                    style={{ overflow: "auto", padding: "10px 20px 0" }}
                  >
                    <div className="tableHeader align-items-end justify-content-start">
                      <div className="formRow border-0 pb-0">
                        <label className="formLabel text-start mb-0 w-100">
                          Query*
                        </label>
                        <div className="d-flex w-100">
                          <input
                            type="text"
                            className="formItem"
                            value={advanceSearch}
                            onChange={(e) => setAdvanceSearch(e.target.value)}
                          // max={new Date()?.toISOString()?.split("T")[0]}
                          // value={startDateFlag}

                          // onKeyDown={(e) => e.preventDefault()}
                          />
                        </div>
                      </div>
                      <div className="formRow border-0 pb-0 col-xxl-1 col-xl-2">
                        <label className="formLabel text-start mb-0 w-100">
                          From
                        </label>
                        <div className="d-flex w-100">
                          <input
                            type="date"
                            className="formItem"
                            value={startDate}
                            max={endDate || today} // Don't let 'From' exceed 'To' or today
                            onChange={(e) => setStartDate(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="formRow border-0 pb-0 col-xxl-1 col-xl-2">
                        <label className="formLabel text-start mb-0 w-100">
                          To
                        </label>
                        <div className="d-flex w-100">
                          <input
                            type="date"
                            className="formItem"
                            value={endDate}
                            min={startDate} // Don't let 'To' go before 'From'
                            max={today} // Don't let 'To' exceed today
                            onChange={(e) => setEndDate(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="formRow border-0 pb-0">
                        <label className="formLabel text-start mb-0 w-100">
                          Agent Name
                        </label>
                        <div className="d-flex w-100">
                          <input
                            type="text"
                            className="formItem"
                            value={agentName}
                            onChange={(e) => setAgentName(e.target.value)}
                          />
                        </div>
                      </div>
                      <button
                        className="panelButton"
                        onClick={getAdvanceSearch}
                      >
                        <span className="text">Search</span>
                        <span className="icon">
                          <i className="fa-solid fa-magnifying-glass" />
                        </span>
                      </button>
                    </div>
                    <div className="tableContainer">
                      <table>
                        {
                          loading ? <ThreeDotedLoader /> :
                            !loading && cdr?.records?.length == 0 ?
                              <div>
                                <EmptyPrompt type="generic" />
                              </div> :
                              !loading && cdr?.records?.length > 0 ?
                                <>
                                  <thead>
                                    <tr
                                      style={{ whiteSpace: "nowrap" }}
                                      data-bs-toggle="offcanvas"
                                      data-bs-target="#offcanvasRight"
                                      aria-controls="offcanvasRight"
                                    >
                                      <th>Customer</th>
                                      <th>Agent</th>
                                      <th>Date</th>
                                      <th>Time</th>
                                      <th>Duration</th>
                                      <th>Cost</th>
                                      <th>Customer Sentiment</th>
                                      <th>Sentiment Score</th>
                                      <th>Efficiency Score</th>
                                      <th>View</th>
                                    </tr>
                                  </thead>

                                  <tbody>
                                    {cdr?.records?.map((internalItem, index) => {
                                      const item = internalItem.metadata;
                                      return (
                                        <tr
                                          key={index}
                                          style={{ whiteSpace: "nowrap" }}
                                          data-bs-toggle="offcanvas"
                                          data-bs-target="#offcanvasRight"
                                          aria-controls="offcanvasRight"
                                          onClick={() => { setSelectedCall(item); setSelectedAudioPath(internalItem.audio_url) }}
                                        >
                                          <td>{item.caller_number}</td>
                                          <td>{item.agent_name}</td>
                                          <td>{item.call_date}{formatTimestampToDateTime(item.timestamp).split("")[0]}</td>
                                          <td>{item.call_time}{formatTimestampToDateTime(item.timestamp).split("")[1]}</td>
                                          <td>
                                            {formatDuration(item.duration_sec)}
                                          </td>
                                          <td>${item.charge}</td>
                                          <td>{item.customer_sentiment}</td>
                                          <td>{item.customer_sentiment_score}</td>
                                          <td>{item.efficiency_score}</td>
                                          <td>
                                            <button className="tableButton edit mx-auto"><i className="fa-regular fa-eye"></i></button>
                                          </td>
                                        </tr>
                                      );
                                    })}
                                  </tbody>
                                </> :
                                <div>
                                  <div className="mt-5">
                                    <div
                                      className="imgWrapper loader position-static"
                                      style={{
                                        width: "150px",
                                        height: "150px",
                                        transform: "none",
                                      }}
                                    >
                                      <img
                                        src={require(`../../assets/images/ai.png`)}
                                        alt="Empty"
                                        className="w-100"
                                      />
                                    </div>
                                    <div className="text-center mt-3">
                                      <h5
                                        style={{
                                          color: "var(--color-subtext)",
                                          fontWeight: 400,
                                        }}
                                      >
                                        Please search for a <b>call detail record</b>{" "}
                                        to display{" "}
                                        <span style={{ color: "var(--ui-accent)" }}>
                                          <b>results</b>
                                        </span>
                                        .
                                      </h5>
                                    </div>
                                  </div>
                                </div>
                        }
                      </table>
                    </div>
                    {/* <div className="tableHeader mb-3">
                      {!loading && cdr && cdr?.data?.length > 0 ? (
                        <PaginationComponent
                          pageNumber={(e) => setPageNumber(e)}
                          totalPage={cdr?.last_page}
                          from={(pageNumber - 1) * cdr?.per_page + 1}
                          to={cdr?.to}
                          total={cdr?.total}
                          defaultPage={pageNumber}
                        />
                      ) : (
                        ""
                      )}
                    </div> */}
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
                {formatTimestampToDateTime(selectedCall?.timestamp)}{" "}
                {/* {selectedCall?.call_date},{" "}
                {selectedCall?.call_time.replace(/Z$/, "")}{" "} */}
                {selectedCall?.direction}
              </h5>
              <button className=" bg-transparent border-0 text-danger">
                <i className="fa-solid fa-trash" />
              </button>
            </div>
            <div className="content mb-2">
              <p className="mb-0" style={{ color: "var(--color-subtext)" }}>
                <strong>Agent:</strong>{" "}
                <span className="fs-12">
                  {" "}
                  {selectedCall?.agent_name} ({selectedCall?.extension})
                </span>
                {/* <button className="clearButton">
                  <i className="fa-solid fa-clone" />
                </button> */}
              </p>
              <p className="mb-0" style={{ color: "var(--color-subtext)" }}>
                <strong>Duration:</strong>{" "}
                <span className="fs-12">
                  {formatDuration(selectedCall?.duration_sec)}
                </span>
              </p>
              <p className="mb-0" style={{ color: "var(--color-subtext)" }}>
                <strong>Cost:</strong>{" "}
                <span className="fs-12">$ {selectedCall?.charge}</span>
              </p>
            </div>
            <div
              className="d-flex justify-content-between align-items-center gap-3 my-3 rounded-3 p-2"
              style={{ border: "1px solid var(--me-border1)" }}
            >
              <audio
                controls={true}
                className="w-[300px] h-10"
                src={selectedAudioPath}
              />
            </div>
            <div
              className="rounded-3 p-2 table__details mb-2"
              style={{ border: "1px solid var(--me-border1)" }}
            >
              <h6 className="f-s-14" style={{ color: "var(--immortalBlack)" }}>
                Summary
              </h6>
              <p className="f-s-14" style={{ color: "var(--color-subtext)" }}>
                {selectedCall?.call_summary}
              </p>
            </div>
            <div
              className="rounded-3 p-2 table__details mb-2"
              style={{ border: "1px solid var(--me-border1)" }}
            >
              <h6 className="mb-3" style={{ color: "var(--immortalBlack)" }}>
                Conversation Analysis
              </h6>
              <p className="f-s-14" style={{ color: "var(--color-subtext)" }}>
                Preset
              </p>
              <div className="d-flex justify-content-start align-items-center gap-2">
                <p className="status_text">
                  <i className="fa-solid fa-headphones" />{" "}
                  <span>Hangup Cause</span>
                </p>
                <p className="status_text">
                  <i className="fa-solid fa-circle-small text-danger" />{" "}
                  <span className="endedTxt">{selectedCall?.hangup_cause}</span>
                </p>
              </div>
              <div className="d-flex justify-content-start align-items-center gap-2">
                <p className="status_text">
                  <i className="fa-regular fa-user-vneck-hair" />{" "}
                  <span>Hangup Status</span>
                </p>
                <p className="status_text">
                  <i className="fa-solid fa-circle-small text-primary" />{" "}
                  <span className="endedTxt">
                    {selectedCall?.hangup_status}
                  </span>
                </p>
              </div>
              <div className="d-flex justify-content-start align-items-center gap-2">
                <p className="status_text">
                  <i className="fa-regular fa-phone" />{" "}
                  <span>Efficiency Score</span>
                </p>
                <p className="status_text">
                  <i className="fa-solid fa-circle-small text-warning" />{" "}
                  <span className="endedTxt">
                    {selectedCall?.efficiency_score}
                  </span>
                </p>
              </div>
              <div className="d-flex justify-content-start align-items-center gap-2">
                <p className="status_text">
                  <i className="fa-regular fa-phone" />{" "}
                  <span>Problem Resolution Score</span>
                </p>
                <p className="status_text">
                  <i className="fa-solid fa-circle-small text-warning" />{" "}
                  <span className="endedTxt">
                    {selectedCall?.problem_resolution_score}
                  </span>
                </p>
              </div>
              <div className="d-flex justify-content-start align-items-center gap-2">
                <p className="status_text">
                  <i className="fa-regular fa-phone" />{" "}
                  <span>Professionalism Score</span>
                </p>
                <p className="status_text">
                  <i className="fa-solid fa-circle-small text-warning" />{" "}
                  <span className="endedTxt">
                    {selectedCall?.professionalism_score}
                  </span>
                </p>
              </div>
              <div className="d-flex justify-content-start align-items-center gap-2">
                <p className="status_text">
                  <i className="fa-regular fa-phone" />{" "}
                  <span>Profanity Events</span>
                </p>
                <ul className="ps-3">
                  {selectedCall?.profanity_events?.map((item, index) => {
                    return (
                      <li key={index}>
                        <span className="endedTxt">{item}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>

            <div
              className="rounded-3 p-2 table__details mb-2"
              style={{ border: "1px solid var(--me-border1)" }}
            >
              <h6 className="mb-3" style={{ color: "var(--immortalBlack)" }}>
                Customer Analysis
              </h6>
              <div className="d-flex justify-content-start align-items-start gap-2 mb-3">
                <p className="status_text">
                  {" "}
                  <span>Customer Sentiment</span>
                </p>
                <p className="status_text">
                  <span className="endedTxt">
                    {selectedCall?.customer_sentiment}
                  </span>
                </p>
              </div>
              <div className="d-flex justify-content-start align-items-start gap-2 mb-3">
                <p className="status_text">
                  {" "}
                  <span>Customer Sentiment Score</span>
                </p>
                <p className="status_text">
                  <span className="endedTxt">
                    {selectedCall?.customer_sentiment_score}
                  </span>
                </p>
              </div>
              <div className="d-flex justify-content-start align-items-start gap-2 mb-3">
                <p className="status_text">
                  {" "}
                  <span>Customer Satisfaction</span>
                </p>
                <p className="status_text">
                  <span className="endedTxt">{selectedCall?.csat_score}</span>
                </p>
              </div>
              <div className="d-flex justify-content-start align-items-start gap-2 mb-3">
                <p className="status_text">
                  {" "}
                  <span>Customer Sentiment Reason</span>
                </p>
                <p className="status_text">
                  <span className="endedTxt">
                    {selectedCall?.customer_sentiment_reason}
                  </span>
                </p>
              </div>
            </div>

            <div
              className="rounded-3 p-2 table__details mb-2"
              style={{ border: "1px solid var(--me-border1)" }}
            >
              <h6 className="mb-3" style={{ color: "var(--immortalBlack)" }}>
                Agent Analysis
              </h6>
              <div className="d-flex justify-content-start align-items-start gap-2 mb-3">
                <p className="status_text">
                  {" "}
                  <span>Agent Name</span>
                </p>
                <p className="status_text">
                  <span className="endedTxt">{selectedCall?.agent_name}</span>
                </p>
              </div>
              <div className="d-flex justify-content-start align-items-start gap-2 mb-3">
                <p className="status_text">
                  {" "}
                  <span>Agent Sentiment</span>
                </p>
                <p className="status_text">
                  <span className="endedTxt">
                    {selectedCall?.agent_sentiment}
                  </span>
                </p>
              </div>
              <div className="d-flex justify-content-start align-items-start gap-2 mb-3">
                <p className="status_text">
                  {" "}
                  <span>Agent Sentiment Score</span>
                </p>
                <p className="status_text">
                  <span className="endedTxt">
                    {selectedCall?.agent_sentiment_score}
                  </span>
                </p>
              </div>
              <div className="d-flex justify-content-start align-items-start gap-2 mb-3">
                <p className="status_text">
                  {" "}
                  <span>Agent Sentiment Reason</span>
                </p>
                <p className="status_text">
                  <span className="endedTxt">
                    {selectedCall?.agent_sentiment_reason}
                  </span>
                </p>
              </div>
            </div>

            <div
              className="rounded-3 p-2 table__details mb-2"
              style={{ border: "1px solid var(--me-border1)" }}
            >
              <h6 className="mb-3" style={{ color: "var(--immortalBlack)" }}>
                Key Points
              </h6>
              <div className="d-flex justify-content-start align-items-start gap-2 mb-3">
                <p className="status_text">
                  {" "}
                  <span>Key Moment Description</span>
                </p>
                <p className="status_text">
                  <span className="endedTxt">
                    {selectedCall?.key_moment_description}
                  </span>
                </p>
              </div>
              <div className="d-flex justify-content-start align-items-start gap-2 mb-3">
                <p className="status_text">
                  {" "}
                  <span>Problem Resolution Reason</span>
                </p>
                <p className="status_text">
                  <span className="endedTxt">
                    {selectedCall?.problem_resolution_reason}
                  </span>
                </p>
              </div>
              <div className="d-flex justify-content-start align-items-start gap-2 mb-3">
                <p className="status_text">
                  {" "}
                  <span>Key Improvement Areas</span>
                </p>
                <p className="status_text">
                  <ul className="ps-3">
                    {selectedCall?.key_improvement_areas?.map((item, index) => {
                      return (
                        <li key={index}>
                          <span className="endedTxt">{item}</span>
                        </li>
                      );
                    })}
                  </ul>
                </p>
              </div>
            </div>

            <div
              className="rounded-3 p-2 table__details mb-2"
              style={{ border: "1px solid var(--me-border1)" }}
            >
              <h6 className="mb-3" style={{ color: "var(--immortalBlack)" }}>
                Transcript
              </h6>
              <div className="d-flex justify-content-start align-items-start gap-2 mb-3">
                <p className="status_text">
                  {" "}
                  <span>agent:</span>
                </p>
                <p className="status_text">
                  <span className="endedTxt"> Dummy data as of now?</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default AICDRSearch;
