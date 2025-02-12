/* eslint-disable array-callback-return */
/* eslint-disable eqeqeq */
/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import Header from "../../CommonComponents/Header";
import {
  backToTop,
  generalGetFunction,
  generalPostFunction,
} from "../../GlobalFunction/globalFunction";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import EmptyPrompt from "../../Loader/EmptyPrompt";
import PaginationComponent from "../../CommonComponents/PaginationComponent";
import SkeletonTableLoader from "../../Loader/SkeletonTableLoader";
import { toast } from "react-toastify";
import Tippy from "@tippyjs/react";

function CdrReport({ page }) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [cdr, setCdr] = useState();
  const [pageNumber, setPageNumber] = useState(1);
  const navigate = useNavigate();
  const account = useSelector((state) => state.account);
  const selectedCdrFilter = useSelector((state) => state.selectedCdrFilter);
  const [currentPlaying, setCurrentPlaying] = useState(""); // For tracking the currently playing audio
  const [callDirection, setCallDirection] = useState("");
  const [callType, setCallType] = useState("");
  const [callOrigin, setCallOrigin] = useState("");
  const [debounceCallOrigin, setDebounceCallOrigin] = useState("");
  const [debounceCallOriginFlag, setDebounceCallOriginFlag] = useState("");
  const [callDestination, setCallDestination] = useState("");
  const [debounceCallDestination, setDebounceCallDestination] = useState("");
  const [debounceCallDestinationFlag, setDebounceCallDestinationFlag] =
    useState("");
  const [hangupCause, setHagupCause] = useState("");
  const [hangupStatus, setHangupStatus] = useState("");
  const [filterBy, setFilterBy] = useState("date");
  const [startDateFlag, setStartDateFlag] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDateFlag, setEndDateFlag] = useState("");
  const [endDate, setEndDate] = useState("");
  const [contentLoader, setContentLoader] = useState(false);
  const [refresh, setRefrehsh] = useState(1);
  const [callBlock, setCallBlock] = useState([]);
  const [callBlockRefresh, setCallBlockRefresh] = useState(0);
  const [selectedNumberToBlock, setSelectedNumberToBlock] = useState(null);
  const [popUp, setPopUp] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  const thisAudioRef = useRef(null);
  console.log(cdr, callBlock);
  useEffect(() => {
    if (selectedCdrFilter == "missed-calls") {
      setCallDirection("local");
    }
  }, [selectedCdrFilter]);

  useEffect(() => {
    if (filterBy === "date" && startDateFlag !== "") {
      setStartDate(startDateFlag);
      setEndDate(startDateFlag);
    } else if (
      filterBy === "date_range" &&
      endDateFlag !== "" &&
      startDateFlag !== ""
    ) {
      setStartDate(startDateFlag);
      setEndDate(endDateFlag);
    }
  }, [startDateFlag, endDateFlag, filterBy]);

  useEffect(() => {
    let timer = setTimeout(() => {
      if (debounceCallOrigin.length >= 3) {
        setCallOrigin(debounceCallOrigin);
      } else if (
        debounceCallOrigin.length >= 0 &&
        debounceCallOrigin.length < 3
      ) {
        setCallOrigin("");
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [debounceCallOrigin]);

  useEffect(() => {
    let timer = setTimeout(() => {
      if (debounceCallDestination.length >= 3) {
        setCallDestination(debounceCallDestination);
      } else if (
        debounceCallDestination.length >= 0 &&
        debounceCallDestination.length < 3
      ) {
        setCallDestination("");
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [debounceCallDestination]);

  const handleCallOriginChange = (e) => {
    const newValue = e.target.value;
    // Allow only digits and validate length
    if (/^\d*$/.test(newValue) && newValue.length <= 5) {
      setDebounceCallOriginFlag(newValue);
      if (newValue.length >= 3) {
        setDebounceCallOrigin(newValue);
        setPageNumber(1);
      } else {
        setDebounceCallOrigin("");
      }
    }
  };

  const handleCallDestinationChange = (e) => {
    const newValue = e.target.value;
    if (/^\d*$/.test(newValue) && newValue.length <= 5) {
      setDebounceCallDestinationFlag(newValue);
      if (newValue.length >= 3) {
        setDebounceCallDestination(newValue);
        setPageNumber(1);
      } else {
        setDebounceCallDestination("");
      }
    }
  };
  useEffect(() => {
    const getRingGroupDashboardData = async () => {
      if (account && account.id) {
        const apidata = await generalGetFunction(`/spam/all?all`);
        // console.log(apidata);
        if (apidata?.status) {
          setCallBlock(apidata.data);
          // setLoading(false);
        } else {
          navigate("/");
        }
      } else {
        navigate("/");
      }
    };
    getRingGroupDashboardData();
  }, [callBlockRefresh]);
  useEffect(() => {
    setLoading(true);
    // build a dynamic url which include only the available params to make API call easy
    const buildUrl = (baseApiUrl, params) => {
      const queryParams = Object.entries(params)
        .filter(([key, value]) => value.length > 0)
        .map(
          ([key, value]) =>
            `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
        )
        .join("&");
      return queryParams ? `${baseApiUrl}&${queryParams}` : baseApiUrl;
    };
    const finalUrl = buildUrl(
      `/cdr?account=${account.account_id}&page=${pageNumber}&row_per_page=${itemsPerPage}`,
      {
        callDirection: callDirection,
        application_state: page === "all" ? callType : page === "billing" ? "pstn" : page === "callrecording" ? callType : page,
        origin: callOrigin,
        destination: callDestination,
        start_date: startDate,
        end_date: endDate,
        variable_DIALSTATUS: hangupCause,
        hangupCause: hangupStatus,
        charges: page === "billing" ? "give" : "",
      }
    );

    async function getData() {
      if (account && account.account_id) {
        const apiData = await generalGetFunction(finalUrl);
        if (apiData?.status) {
          setLoading(false);
          setContentLoader(false);
          setCdr(apiData.data);
          if (selectedCdrFilter != "") {
            dispatch({
              type: "SET_SELECTEDCDRFILTER",
              selectedCdrFilter: "",
            });
          }
        } else {
          setLoading(false);
          setContentLoader(false);
        }
      } else {
        setLoading(false);
        setContentLoader(false);
        navigate("/");
      }
    }
    getData();
  }, [
    account,
    navigate,
    pageNumber,
    callDirection,
    callType,
    callOrigin,
    callDestination,
    startDate,
    endDate,
    hangupCause,
    hangupStatus,
    refresh,
    itemsPerPage,
    page,
  ]);

  const getDateRange = (period) => {
    const currentDate = new Date();
    const formattedCurrentDate = formatDate(currentDate);

    let startDate = new Date();

    switch (period) {
      case "7_days":
        startDate.setDate(currentDate.getDate() - 7);
        break;

      case "1_month":
        startDate.setMonth(currentDate.getMonth() - 1);
        break;

      case "3_month":
        startDate.setMonth(currentDate.getMonth() - 3);
        break;

      default:
        throw new Error(
          "Invalid period. Use 'last7days', 'last1month', or 'last3months'."
        );
    }

    const formattedStartDate = formatDate(startDate);
    setStartDate(formattedStartDate);

    setEndDate(formattedCurrentDate);

    // return { currentDate: formattedCurrentDate, startDate: formattedStartDate };
  };

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  function refreshCallData() {
    setContentLoader(true);
    setRefrehsh(refresh + 1);
  }

  useEffect(() => {
    if (
      filterBy === "7_days" ||
      filterBy === "1_month" ||
      filterBy === "3_month"
    ) {
      // featureUnderdevelopment();
      getDateRange(filterBy);
    }
  }, [filterBy]);

  const handlePlaying = (audio) => {
    setCurrentPlaying(audio);
    setTimeout(() => {
      if (currentPlaying) {
        thisAudioRef.current.play();
      }
    }, 200);
  };

  const handleBlockNumber = async (blockNumber) => {
    if (!blockNumber) {
      toast.error("Please enter number");
    } else if (
      blockNumber < 99999999 ||
      blockNumber > 99999999999999 ||
      isNaN(blockNumber)
    ) {
      toast.error("Please enter valid number");
    } else {
      setPopUp(false);
      setLoading(true);
      const parsedData = {
        type: "DID",
        number: blockNumber,
      };
      const apidata = await generalPostFunction(`/spam/store`, parsedData);
      if (apidata.status) {
        setLoading(false);

        setSelectedNumberToBlock(null);
        setCallBlock([...callBlock, apidata.data]);
        toast.success("Number added to block list");
      } else {
        setLoading(false);
      }
    }
  };
  function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600)
      .toString()
      .padStart(2, "0");
    const minutes = Math.floor((seconds % 3600) / 60)
      .toString()
      .padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${hours}:${minutes}:${secs}`;
  }
  function exportToCSV(data, filename = "data.csv") {
    if (!data || !data.length) {
      console.error("No data to export.");
      return;
    }

    // Extract headers from the keys of the first object
    const headers = Object.keys(data[0]);

    // Map data rows into CSV format
    const rows = data.map((obj) =>
      headers.map((header) => JSON.stringify(obj[header] || "")).join(",")
    );

    // Combine headers and rows into a single string
    const csvContent = [headers.join(","), ...rows].join("\n");

    // Create a blob and trigger download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.href = url;
    link.download = filename;
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();

    // Cleanup
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
  return (
    <main className="mainContent">
      <section id="phonePage">
        <div className="container-fluid px-0 position-relative">
          <Header title={`${page === "billing" ? "Billing Reports" : page === "callcenter" ? "Call Center Reports" : page === "ringgroup" ? "Ring Group Reports" : page === "callrecording" ? "Call Recordings" : "CDR Reports"}`} />
          <div className="overviewTableWrapper">
            <div className="overviewTableChild">
              <div className="d-flex flex-wrap">
                <div className="col-12">
                  <div className="heading">
                    <div className="content">
                      <h4>{page === "billing" ? "Billing" : page === "callcenter" ? "Call Center Reports" : page === "ringgroup" ? "Ring Group Reports" : page === "callrecording" ? "Call Recordings" : "CDR Reports"}</h4>
                      <p>Here are all the {page === "billing" ? "Billing Reports" : page === "callcenter" ? "Call Center Reports" : page === "ringgroup" ? "Ring Group Reports" : page === "callrecording" ? "Call Recordings" : "CDR Reports"}</p>
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
                          <i class="fa-solid fa-caret-left"></i>
                        </span>
                      </button>
                      <button
                        effect="ripple"
                        className="panelButton"
                        onClick={refreshCallData}
                        disabled={loading}
                      >
                        <span className="text">Refresh</span>
                        <span className="icon">
                          <i
                            class={
                              contentLoader
                                ? "fa-regular fa-arrows-rotate fs-5 fa-spin"
                                : "fa-regular fa-arrows-rotate fs-5"
                            }
                          ></i>
                        </span>
                      </button>
                      <button
                        effect="ripple"
                        className="panelButton"
                        onClick={() => exportToCSV(cdr?.data)}
                        disabled={loading}
                      >
                        <span className="text">Export</span>
                        <span className="icon">
                          <i class="fa-solid fa-file-export"></i>
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
                <div
                  className="col-12"
                  style={{ overflow: "auto", padding: "25px 20px 0" }}
                >
                  <div className="tableHeader">
                    <div className="showEntries">
                      <label>Show</label>
                      <select
                        className="formItem"
                        value={itemsPerPage}
                        onChange={(e) => setItemsPerPage(e.target.value)}
                      >
                        <option value={20}>20</option>
                        <option value={30}>30</option>
                        <option value={40}>40</option>
                        <option value={50}>50</option>
                        <option value={60}>60</option>
                        <option value={70}>70</option>
                        <option value={80}>80</option>
                      </select>
                      <label>entries</label>
                    </div>
                  </div>
                  <div className="tableHeader">
                    <div className="d-flex justify-content-xl-end">
                      <div className="formRow border-0 ps-xl-0">
                        <label className="formLabel text-start mb-0 w-100">
                          Date Filter
                        </label>
                        <select
                          className="formItem"
                          value={filterBy}
                          onChange={(e) => {
                            setFilterBy(e.target.value);
                            setStartDateFlag("");
                            setEndDateFlag("");
                          }}
                        >
                          <option value={"date"}>Single Date</option>
                          <option value={"date_range"}>Date Range</option>
                          <option value={"7_days"}>Last 7 Days</option>
                          <option value={"1_month"}>Last 1 Month</option>
                          <option value={"3_month"}>Last 3 Months</option>
                        </select>
                      </div>
                      {filterBy === "date" && (
                        <div className="formRow border-0">
                          <label className="formLabel text-start mb-0 w-100">
                            Choose Date
                          </label>
                          <input
                            type="date"
                            className="formItem"
                            max={new Date().toISOString().split("T")[0]}
                            value={startDateFlag}
                            onChange={(e) => {
                              setStartDateFlag(e.target.value);
                              setPageNumber(1);
                            }}
                          />
                        </div>
                      )}
                      {filterBy === "date_range" && (
                        <>
                          <div className="formRow border-0">
                            <label className="formLabel text-start mb-0 w-100">
                              From
                            </label>
                            <input
                              type="date"
                              className="formItem"
                              max={new Date().toISOString().split("T")[0]}
                              value={startDateFlag}
                              onChange={(e) => {
                                setStartDateFlag(e.target.value);
                                setPageNumber(1);
                              }}
                            />
                          </div>
                          <div className="formRow border-0">
                            <label className="formLabel text-start mb-0 w-100">
                              To
                            </label>
                            <input
                              type="date"
                              className="formItem"
                              max={new Date().toISOString().split("T")[0]}
                              value={endDateFlag}
                              onChange={(e) => {
                                setEndDateFlag(e.target.value);
                                setPageNumber(1);
                              }}
                              min={startDateFlag} // Prevent selecting an end date before the start date
                            />
                          </div>
                        </>
                      )}
                      {/* {filterBy === "date_range" && (
                  <div className="formRow border-0  ms-3">
                    <label className="title text-start mb-2 w-100">
                      Date Range Filter
                    </label>
                    <DatePicker
                      selectsRange={true}
                      startDate={startDate}
                      endDate={endDate}
                      onChange={(update) => {
                        setDateRange(update);
                        setPageNumber(1);
                      }}
                      customInput={
                        <ExampleCustomInput className="formItem mb-0" />
                      }
                      isClearable={true}
                      maxDate={new Date()}
                    />
                  </div>
                )} */}
                      <div className="formRow border-0">
                        <label className="formLabel text-start mb-0 w-100">
                          Call Origin
                        </label>
                        <input
                          type="text"
                          className="formItem"
                          // value={debounceCallOrigin}
                          value={debounceCallOriginFlag}
                          // onChange={(e) => {
                          //   setDebounceCallOrigin(e.target.value);
                          //   setPageNumber(1);
                          // }}
                          // min={100}
                          // max={99999}
                          onChange={handleCallOriginChange}
                        />
                      </div>
                      <div className="formRow border-0">
                        <label className="formLabel text-start mb-0 w-100">
                          Call Destination
                        </label>
                        <input
                          type="text"
                          className="formItem"
                          value={debounceCallDestinationFlag}
                          // value={debounceCallDestination}
                          // onChange={(e) => {
                          //   setDebounceCallDestination(e.target.value);
                          //   setPageNumber(1);
                          // }}
                          onChange={handleCallDestinationChange}
                        />
                      </div>
                      {page === "all" ? (
                        <>
                          <div className="formRow border-0">
                            <label className="formLabel text-start mb-0 w-100">
                              Call Direction
                            </label>
                            <select
                              className="formItem"
                              onChange={(e) => {
                                setCallDirection(e.target.value);
                                setPageNumber(1);
                              }}
                              value={callDirection}
                            // onChange={(e) => setCallDirection(e.target.value), setPageNumber(1)}
                            >
                              <option value={""}>All Calls</option>
                              <option value={"inbound"}>Inbound Calls</option>
                              <option value={"outbound"}>Outbound Calls</option>
                              <option value={"missed"}>Missed Calls</option>
                              <option value={"internal"}>Internal Calls</option>
                            </select>
                          </div>
                          <div className="formRow border-0">
                            <label className="formLabel text-start mb-0 w-100">
                              Call Type
                            </label>
                            <select
                              className="formItem"
                              onChange={(e) => {
                                setCallType(e.target.value);
                                setPageNumber(1);
                              }}
                            >
                              <option value={""}>All Calls</option>
                              <option value={"extension"}>Extension</option>
                              <option value={"voicemail"}>Voice Mail</option>
                              <option value={"callcenter"}>Call Center</option>
                              <option value={"ringgroup"}>Ring Group</option>
                            </select>
                          </div>
                        </>
                      ) : (
                        ""
                      )}
                      {page === "callrecording" ? "" : <>
                        <div className="formRow border-0 ">
                          <label className="formLabel text-start mb-0 w-100">
                            Hangup Cause
                          </label>
                          <select
                            className="formItem"
                            onChange={(e) => {
                              setHagupCause(e.target.value);
                              setPageNumber(1);
                            }}
                          >
                            <option value={""}>All</option>
                            <option value={"SUCCESS"}>Success</option>
                            <option value={"BUSY"}>Busy</option>
                            <option value={"NOANSWER"}>No Answer</option>
                            <option value={"NOT CONNECTED"}>Not Connected</option>
                            <option value={"USER_NOT_REGISTERED"}>
                              User Not Registered
                            </option>
                            <option value={"SUBSCRIBER_ABSENT"}>
                              Subscriber Absent
                            </option>
                            <option value={"CANCEL"}>Cancelled</option>
                          </select>
                        </div>
                        <div className="formRow border-0 pe-xl-0">
                          <label className="formLabel text-start mb-0 w-100">
                            Hangup status
                          </label>
                          <select
                            className="formItem"
                            onChange={(e) => {
                              setHangupStatus(e.target.value);
                              setPageNumber(1);
                            }}
                          >
                            <option value={""}>All</option>
                            <option value={"MEDIA_TIMEOUT"}>Media Timeout</option>
                            <option value={"NORMAL_CLEARING"}>
                              Normal Clearing
                            </option>
                          </select>
                        </div>
                      </>}
                      {/* <Link
                  to="#"
                  onClick={() => {
                    setAll(!all);
                    backToTop();
                  }}
                  effect="ripple"
                  className={all ? "toggleButton active" : "toggleButton"}
                >
                  All
                </Link>
                <Link
                  to="#"
                  onClick={() => {
                    setExtensions(!extensions);
                    backToTop();
                  }}
                  effect="ripple"
                  className={
                    extensions ? "toggleButton active" : "toggleButton"
                  }
                >
                  Extension
                </Link>
                <Link
                  to="#"
                  onClick={() => {
                    setCallCenter(!callCenter);
                    backToTop();
                  }}
                  effect="ripple"
                  className={
                    callCenter ? "toggleButton active" : "toggleButton"
                  }
                >
                  Call Center
                </Link>
                <Link
                  to="#"
                  onClick={() => {
                    setRingGroup(!ringGroup);
                    backToTop();
                  }}
                  effect="ripple"
                  className={ringGroup ? "toggleButton active" : "toggleButton"}
                >
                  Ring Group
                </Link> */}
                    </div>
                  </div>

                  <div className="tableContainer">
                    <table>
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Direction</th>
                          {page === "billing" ? "" : <th>Call Type</th>}
                          <th>Caller Name</th>
                          <th>Caller No.</th>
                          <th>Tag</th>
                          <th>Via/Route</th>
                          {page === "callrecording" ? "" :
                            <>
                              <th>Extension</th>
                              <th>User name</th>
                              <th>Date</th>
                              <th>Time</th>
                            </>}
                          <th>Recording</th>
                          <th>Duration</th>
                          {page === "billing" || page === "callrecording" ? (
                            ""
                          ) : (
                            <>
                              <th>Hangup Status</th>
                              <th>hangup Cause</th>
                            </>
                          )}
                          {page === "callrecording" ? "" : <th>Charge</th>}
                          {page === "billing" || page === "callrecording" ? "" : <th>Block</th>}
                        </tr>
                      </thead>
                      <tbody>
                        {loading ? (
                          <SkeletonTableLoader col={page === "billing" ? 13 : page === "callrecording" ? 9 : 17} row={12} />
                        ) : (
                          <>
                            {cdr?.data &&
                              cdr?.data?.map((item, index) => {
                                const isBlocked = callBlock?.some((block) => {
                                  if (item["Call-Direction"] == "inbound") {
                                    return (
                                      item["Caller-Caller-ID-Number"] ==
                                      block.number
                                    );
                                  } else if (
                                    item["Call-Direction"] == "outbound"
                                  ) {
                                    return (
                                      item["Caller-Callee-ID-Number"] ==
                                      block.number
                                    );
                                  }
                                });
                                return (
                                  <>
                                    <tr key={index} className="cdrTableRow">
                                      <td>
                                        {(pageNumber - 1) *
                                          Number(itemsPerPage) +
                                          (index + 1)}
                                      </td>
                                      <td>
                                        {item["Call-Direction"] ===
                                          "inbound" ? (
                                          <span>
                                            <i
                                              class="fa-solid fa-phone-arrow-down-left me-1"
                                              style={{
                                                color: "var(--funky-boy3)",
                                              }}
                                            ></i>{" "}
                                            Inbound
                                          </span>
                                        ) : item["Call-Direction"] ===
                                          "outbound" ? (
                                          <span>
                                            <i
                                              class="fa-solid fa-phone-arrow-up-right me-1"
                                              style={{ color: "var(--color3)" }}
                                            ></i>{" "}
                                            Outbound
                                          </span>
                                        ) : item["Call-Direction"] ===
                                          "missed" ? (
                                          <span>
                                            <i
                                              class="fa-solid fa-phone-missed me-1"
                                              style={{
                                                color: "var(--funky-boy3)",
                                              }}
                                            ></i>{" "}
                                            Missed
                                          </span>
                                        ) : (
                                          <span>
                                            <i
                                              class="fa-solid fa-headset me-1"
                                              style={{ color: "var(--color2)" }}
                                            ></i>{" "}
                                            Internal
                                          </span>
                                        )}
                                      </td>
                                      {page === "billing" ? (
                                        ""
                                      ) : (
                                        <td>{item["application_state"]}</td>
                                      )}
                                      <td>
                                        {item["Caller-Orig-Caller-ID-Name"]}
                                      </td>
                                      <td>{item["variable_sip_from_user"]}</td>
                                      <td>{item["tag"]}</td>

                                      <td>
                                        {item["application_state"] ===
                                          "intercept" ||
                                          item["application_state"] ===
                                          "eavesdrop" ||
                                          item["application_state"] ===
                                          "whisper" || item["application_state"] ===
                                          "barge"
                                          ? item["other_leg_destination_number"]
                                          : item["Caller-Callee-ID-Number"]}{" "}
                                        {item["application_state_name"] &&
                                          `(${item["application_state_name"]})`}
                                      </td>
                                      {page === "callrecording" ? "" :
                                        <>
                                          <td>
                                            {item["application_state_to_ext"]}
                                          </td>
                                          <td>
                                            {item["e_name"]}
                                          </td>
                                          <td>
                                            {
                                              item["variable_start_stamp"].split(
                                                " "
                                              )[0]
                                            }
                                          </td>
                                          <td>
                                            {
                                              item["variable_start_stamp"].split(
                                                " "
                                              )[1]
                                            }
                                          </td>
                                        </>
                                      }
                                      <td>
                                        {item["recording_path"] &&
                                          item["variable_billsec"] > 0 && (
                                            <button
                                              className="tableButton px-2 mx-0"
                                              onClick={() => {
                                                if (
                                                  item["recording_path"] ==
                                                  currentPlaying
                                                ) {
                                                  setCurrentPlaying("");
                                                } else {
                                                  handlePlaying(
                                                    item["recording_path"]
                                                  );
                                                }
                                              }}
                                            >
                                              {currentPlaying === item["recording_path"] ? (
                                                <i className="fa-solid fa-stop"></i>
                                              ) : (
                                                <i className="fa-solid fa-play"></i>
                                              )}
                                            </button>

                                            // <MusicPlayer
                                            //   audioSrc={item["recording_path"]}
                                            //   isPlaying={
                                            //     currentPlaying ===
                                            //     item["recording_path"]
                                            //   }
                                            //   onPlay={() => setCurrentPlaying(item["recording_path"])}
                                            //   onStop={() => setCurrentPlaying(null)}
                                            // />
                                          )}
                                      </td>
                                      <td>
                                        {formatTime(item["variable_billsec"])}
                                      </td>
                                      {page === "billing" || page === "callrecording" ? (
                                        ""
                                      ) : (
                                        <>
                                          <td>
                                            {item["Hangup-Cause"]}
                                            {/* {item["variable_DIALSTATUS"] === null
                                          ? item["Hangup-Cause"]
                                          : item["variable_DIALSTATUS"] ===
                                            "NO_USER_RESPONSE"
                                          ? "BUSY"
                                          : item["variable_DIALSTATUS"]} */}
                                          </td>
                                          <td>{item["variable_DIALSTATUS"]}</td>
                                        </>
                                      )}
                                      {page === "callrecording" ? "" : <td>{item["call_cost"]}</td>}
                                      {page === "billing" || page === "callrecording" ? (
                                        ""
                                      ) : (
                                        <td>
                                          {" "}
                                          <button
                                            disabled={isBlocked}
                                            effect="ripple"
                                            className={`tableButton ${isBlocked ? "delete" : "warning"
                                              } ms-0`}
                                            // style={{ height: "34px" }}
                                            onClick={() => {
                                              setSelectedNumberToBlock(
                                                item["Call-Direction"] ===
                                                  "inbound"
                                                  ? item[
                                                  "Caller-Caller-ID-Number"
                                                  ]
                                                  : item["Call-Direction"] ===
                                                    "outbound"
                                                    ? item[
                                                    "Caller-Callee-ID-Number"
                                                    ]
                                                    : "N/A"
                                              );
                                              setPopUp(true);
                                            }}
                                          >
                                            {/* <span className="text">
                                            {isBlocked ? "Blocked" : "Block"}
                                          </span> */}
                                            {/* <span className="icon"> */}
                                            <Tippy
                                              content={
                                                isBlocked ? "Blocked" : "Block"
                                              }
                                            >
                                              <i class="fa-solid fa-ban"></i>
                                            </Tippy>
                                            {/* </span> */}
                                          </button>
                                        </td>
                                      )}
                                    </tr>
                                    {currentPlaying ===
                                      item["recording_path"] && item["recording_path"] && (
                                        <tr>
                                          <td colSpan={99}>
                                            <div className="audio-container mx-2">
                                              <audio
                                                controls={true}
                                                ref={thisAudioRef}
                                                autoPlay={true}
                                                onEnded={() => {
                                                  setCurrentPlaying(null);
                                                }}
                                              >
                                                <source
                                                  src={item["recording_path"]}
                                                  type="audio/mpeg"
                                                />
                                              </audio>

                                              <button
                                                className="audioCustomButton"
                                              // onClick={() =>
                                              //   handleAudioDownload(
                                              //     clickedVoiceMail.recording_path
                                              //   )
                                              // }
                                              >
                                                <i className="fa-sharp fa-solid fa-download" />
                                              </button>
                                              {/* <button className="audioCustomButton ms-1">
                              <i className="fa-sharp fa-solid fa-box-archive" />
                            </button> */}
                                            </div>
                                          </td>
                                        </tr>
                                      )}
                                  </>
                                );
                              })}
                          </>
                        )}

                        {!loading && cdr && cdr.data.length === 0 ? (
                          <td colSpan={99}>
                            <EmptyPrompt name="Call" link="dashboard" />
                          </td>
                        ) : (
                          ""
                        )}
                      </tbody>
                    </table>
                  </div>
                  <div className="tableHeader mb-3">
                    {!loading && cdr && cdr.data.length > 0 ? (
                      <PaginationComponent
                        pageNumber={(e) => setPageNumber(e)}
                        totalPage={cdr.last_page}
                        from={(pageNumber - 1) * cdr.per_page + 1}
                        to={cdr.to}
                        total={cdr.total}
                        defaultPage={pageNumber}
                      />
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
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
                    Are you sure, you want to block this number (
                    {selectedNumberToBlock})?
                  </p>
                  <div className="mt-2 d-flex justify-content-between">
                    <button
                      disabled={loading}
                      className="panelButton m-0"
                      onClick={() => handleBlockNumber(selectedNumberToBlock)}
                    >
                      <span className="text">Confirm</span>
                      <span className="icon">
                        <i class="fa-solid fa-check"></i>
                      </span>
                    </button>
                    {/* ) : ( */}

                    {/* )} */}

                    <button
                      className="panelButton gray m-0 float-end"
                      onClick={() => {
                        setPopUp(false);
                        setSelectedNumberToBlock(null);
                      }}
                    >
                      <span className="text">Cancel</span>
                      <span className="icon">
                        <i class="fa-solid fa-xmark"></i>
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
    </main>
  );
}

export default CdrReport;
