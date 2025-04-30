/* eslint-disable array-callback-return */
/* eslint-disable eqeqeq */
/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import Header from "../../CommonComponents/Header";



import {
  backToTop,
  featureUnderdevelopment,
  generalGetFunction,
  generalPostFunction,
  generatePreSignedUrl,
} from "../../GlobalFunction/globalFunction";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import EmptyPrompt from "../../Loader/EmptyPrompt";
import PaginationComponent from "../../CommonComponents/PaginationComponent";
import SkeletonTableLoader from "../../Loader/SkeletonTableLoader";
import { toast } from "react-toastify";
import Tippy from "@tippyjs/react";
import CircularLoader from "../../Loader/CircularLoader";
import Comments from "./Comments";
import Duplicates from "./Duplicates";
import ExportPopUp from "./ExportPopUp";
import AudioWaveformCommon from "../../CommonComponents/AudioWaveformCommon";
import DropdownForAudio from "../../DropdownForAudio";
import AudioTranscribe from "../../CommonComponents/AudioTranscribe";


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

function CdrFilterReport({ page }) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [circularLoader, setCircularLoader] = useState(true);
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
  const [timeFlag, setTimeFlag] = useState({
    startTime: "",
    endTime: "",
  });
  const [timeFilter, setTimeFilter] = useState({
    startTime: "",
    endTime: "",
  });
  const [startDate, setStartDate] = useState("");
  const [createdAt, setCreatedAt] = useState("");
  const [endDateFlag, setEndDateFlag] = useState("");
  const [endDate, setEndDate] = useState("");
  const [contentLoader, setContentLoader] = useState(false);
  const [refresh, setRefrehsh] = useState(1);
  const [callBlock, setCallBlock] = useState([]);
  const [callBlockRefresh, setCallBlockRefresh] = useState(0);
  const [selectedNumberToBlock, setSelectedNumberToBlock] = useState(null);
  const [popUp, setPopUp] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [updatedQueryparams, setUpdatedQueryparams] = useState("");
  const [audioURL, setAudioURL] = useState("");
  const [comment, setComment] = useState("");
  const [selectedCdr, setSelectedCdr] = useState("");
  const [exportPopup, setExportPopup] = useState(false);
  const [calendarStartDate, setCalendarStartDate] = useState(new Date());
  const [filteredKeys, setFilteredKeys] = useState([]);
  const [showDuplicatePopUp, setShowDuplicatePopUp] = useState(false)
  const [duplicatePopUpData, setDuplicatePopUpData] = useState({})
  const [error, setError] = useState('');
  const [showAudio, setShowAudio] = useState(false)
  // const [transcribeLink, setTranscribeLink] = useState()
  const [showDropDown, setShowDropdown] = useState(false)
  const [showComment, setShowComment] = useState(false)
  const [advanceSearchPopup, setAdvanceSearchPopup] = useState(true);

  const [showKeys, setShowKeys] = useState([
    "Call-Direction",
    "Caller-Orig-Caller-ID-Name",
    "variable_sip_from_user",
    "tag",
    "variable_sip_to_user",
    "application_state",
    "application_state_to_ext",
    "e_name",
    "Date",
    "Time",
    "recording_path",
    "variable_billsec",
    // "variable_sip_to_user",
    "Hangup-Cause",
    "variable_DIALSTATUS",
    "start_date",
    "end_date",
    "call_cost",
    "id",
  ]);

  useEffect(() => {
    if (page === "billing") {
      setShowKeys([
        "Call-Direction",
        // "Caller-Orig-Caller-ID-Name",
        "variable_sip_from_user",
        "tag",
        "application_state",
        "application_state_to_ext",
        "e_name",
        "Date",
        "Time",
        "variable_billsec",
        "variable_sip_to_user",
        "call_cost",
        "id",
      ])
    }
  }, [page])

  const locationState = useLocation();

  const thisAudioRef = useRef(null);
  useEffect(() => {
    if (selectedCdrFilter == "missed-calls") {
      setCallDirection("local");
    }
  }, [selectedCdrFilter]);

  useEffect(() => {
    if (filterBy === "date" && startDateFlag !== "") {
      setCreatedAt(startDateFlag);
      setStartDate("");
      setEndDate("");
    } else if (
      filterBy === "date_range" &&
      endDateFlag !== "" &&
      startDateFlag !== ""
    ) {
      setStartDate(startDateFlag);
      setEndDate(endDateFlag);
      setCreatedAt("");
    }
  }, [startDateFlag, endDateFlag, filterBy]);

  useEffect(() => {
    if (filterBy === "date" && timeFlag.startTime !== "") {
      setTimeFilter((prev) => ({
        ...prev,
        startTime: timeFlag.startTime,
      }))

    } else if (filterBy === "date_range") {
      if (timeFlag.startTime !== "" && timeFlag.endTime !== "") {
        setTimeFilter((prev) => ({
          ...prev,
          startTime: timeFlag.startTime,
          endTime: timeFlag.endTime,
        }));
      }
    }
  }, [timeFlag])

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
    if (/^\d*$/.test(newValue) && newValue.length <= 12) {
      setDebounceCallOriginFlag(newValue);
      if (newValue.length >= 3) {
        setDebounceCallOrigin(newValue);
        setPageNumber(1);
      } else {
        setDebounceCallOrigin("");
      }
    }
  };

  function formatTimeWithAMPM(timeString) {
    const [hours, minutes, seconds] = timeString.split(':').map(Number);

    if (isNaN(hours) || isNaN(minutes) || isNaN(seconds)) {
      return "Invalid time format";
    }

    let period = 'AM';
    let formattedHours = hours;

    if (hours >= 12) {
      period = 'PM';
      if (hours > 12) {
        formattedHours -= 12;
      }
    }

    if (formattedHours === 0) {
      formattedHours = 12; // Midnight is 12 AM
    }

    const formattedMinutes = minutes.toString().padStart(2, '0');
    const formattedSeconds = seconds.toString().padStart(2, '0');

    return `${formattedHours}:${formattedMinutes}:${formattedSeconds} ${period}`;
  }


  const handleCallDestinationChange = (e) => {
    const newValue = e.target.value;
    if (/^\d*$/.test(newValue) && newValue.length <= 12) {
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
        if (apidata?.status) {
          setCallBlock(apidata?.data);
          setLoading(false);
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
      setUpdatedQueryparams(queryParams);
      return queryParams ? `${baseApiUrl}&${queryParams}` : baseApiUrl;
    };
    const finalUrl = buildUrl(
      `/cdr?account=${account.account_id}&page=${pageNumber}&row_per_page=${itemsPerPage}`,
      {
        "Call-Direction": callDirection,
        application_state:
          page === "all"
            ? callType
            : page === "billing"
              ? "pstn"
              : page === "callrecording"
                ? callType
                : page,
        variable_sip_from_user: callOrigin,
        variable_sip_to_user: callDestination,
        start_date: startDate,
        end_date: endDate,
        start_time: timeFilter.startTime,
        end_time: timeFilter.endTime,
        variable_DIALSTATUS: hangupCause,
        "Hangup-Cause": hangupStatus,
        call_cost: page === "billing" ? "give" : "",
        created_at: createdAt,
      }
    );

    // function to filter object
    function filterObjectKeys(obj, keys) {
      let filteredObj = {};

      keys.forEach((key) => {
        if (
          key === "variable_start_stamp" &&
          obj.hasOwnProperty("variable_start_stamp")
        ) {
          filteredObj["Date"] = obj["variable_start_stamp"]?.split(" ")[0];
          filteredObj["Time"] = formatTimeWithAMPM(obj["variable_start_stamp"]?.split(" ")[1])
        }
        if (obj.hasOwnProperty(key)) {

          filteredObj[key] = obj[key];
        }
      });

      return filteredObj;
    }

    async function getData() {
      setLoading(true);
      if (account && account.account_id) {
        const apiData = await generalGetFunction(finalUrl);
        if (apiData?.response?.status == 403) {
          toast.error("You don't have permission to access this page.");
          setLoading(false);
          setContentLoader(false);
          setCircularLoader(false);
        }
        if (apiData?.status === true) {
          setCircularLoader(false);
          setLoading(false);
          setContentLoader(false);
          const filteredData = apiData?.data?.data?.map((item) =>
            filterObjectKeys(item, [...apiData.filteredKeys, "id"])
          );
          setFilteredKeys([...apiData.filteredKeys, "id"]);
          // setCdr(apiData.data);
          setCdr({
            ...apiData?.data,
            data: filteredData,
          });
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
    timeFlag,
    hangupCause,
    hangupStatus,
    refresh,
    itemsPerPage,
    page,
    createdAt,
    locationState
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
    setCurrentPlaying("");
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
        setCallBlock([...callBlock, apidata?.data]);
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

  const duplicateColumn = async (item) => {
    setShowDuplicatePopUp(true)
    setDuplicatePopUpData(item);

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

  // function to handle export
  const handleExport = async () => {
    setLoading(true);
    try {
      const res = await generalGetFunction(
        `cdr?${updatedQueryparams}&export=true`
      );
      if (res.status) {
        exportToCSV(res.data);
        setLoading(false);
      }
      toast.success("Data Successfully Exported.");
    } catch (error) {
      toast.error("Error during export:", error?.message);
    }
  };

  // Filter To Set when Navigating from PBX Dashboard
  useEffect(() => {
    if (locationState.state !== null) {
      setLoading(true);
      const { filter, direction } = locationState.state;

      setHagupCause(filter === "missed" ? "Missed" : filter === "completed" ? "Answered" : "");
      setCallDirection(direction === "all" ? "" : direction);

      setTimeout(() => {
        refreshCallData();
      }, 100)
    }
  }, [locationState])

  // Reset All Filters
  const resetAllFilters = () => {
    setHagupCause("");
    setHangupStatus("");
    setCallDirection("");
    setCallType("");
    setDebounceCallOriginFlag("");
    setCallOrigin("");
    setDebounceCallDestinationFlag("");
    setCallDestination("");
    setFilterBy("date");
    setStartDateFlag("");
    setEndDateFlag("");
    setCreatedAt("");
    setTimeFlag({ startTime: "", endTime: "" });
    setTimeFilter({ startTime: "", endTime: "" });

    setTimeout(() => {
      refreshCallData();
    })
  };
  return (
    <>
      {circularLoader && <CircularLoader />}
      <main className="mainContent">
        <section id="phonePage">
          <div className="container-fluid px-0 position-relative">
            <Header
              title={`${page === "billing"
                ? "Billing Reports"
                : page === "callcenter"
                  ? "Call Center Reports"
                  : page === "ringgroup"
                    ? "Ring Group Reports"
                    : page === "callrecording"
                      ? "Call Recordings"
                      : "CDR Reports"
                }`}
            />
            <div className="overviewTableWrapper">
              <div className="overviewTableChild">
                <div className="d-flex flex-wrap">
                  <div className="col-12">
                    <div className="heading">
                      <div className="content">
                        <h4>
                          {page === "billing"
                            ? "Billing"
                            : page === "callcenter"
                              ? "Call Center Reports"
                              : page === "ringgroup"
                                ? "Ring Group Reports"
                                : page === "callrecording"
                                  ? "Call Recordings"
                                  : "CDR Reports"}
                        </h4>
                        <p>
                          Here are all the{" "}
                          {page === "billing"
                            ? "Billing Reports"
                            : page === "callcenter"
                              ? "Call Center Reports"
                              : page === "ringgroup"
                                ? "Ring Group Reports"
                                : page === "callrecording"
                                  ? "Call Recordings"
                                  : "CDR Reports"}
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
                        <button
                          onClick={resetAllFilters}
                          className="panelButton delete"
                          disabled={loading}
                        >
                          <span className="text">Reset</span>
                          <span className="icon">
                            <i className="fa-solid fa-trash" />
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
                              className={
                                contentLoader
                                  ? "fa-regular fa-arrows-rotate fa-spin"
                                  : "fa-regular fa-arrows-rotate"
                              }
                            ></i>
                          </span>
                        </button>
                        <div className="dropdown">
                          <button
                            effect="ripple"
                            className="panelButton"
                            disabled={loading}
                            onClick={() => setExportPopup(true)}
                          // type="button" data-bs-toggle="dropdown" aria-expanded="true"
                          >
                            <span className="text">Export</span>
                            <span className="icon">
                              <i className="fa-solid fa-file-export"></i>
                            </span>
                          </button>
                          {/* <ul
                            className="dropdown-menu actionBtnDropdowns"
                          >
                            <li className="dropdown-item">
                              <button className="clearButton text-align-start" onClick={() => handleExport()}>
                                <i className="fa-regular fa-file-csv me-2" /> Export To CSV
                              </button>
                            </li>
                            <li className="dropdown-item">
                              <button className="clearButton text-align-start">
                                <i className="fa-regular fa-envelope-open-text me-2" /> Send To Email
                              </button>
                            </li>
                          </ul> */}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className="col-12"
                    style={{ overflow: "auto", padding: "10px 20px 0" }}
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
                      <div>
                        <button className="ms-2 btn btn-success-light btn-wave new_buttonStyle"
                          style={{ maxWidth: 'initial' }}
                          onClick={() => setAdvanceSearchPopup(true)}
                        >
                          <span>Advanced Search</span>
                          <i class="fa-solid fa-magnifying-glass" />
                        </button>
                      </div>
                    </div>
                    <div className="tableHeader">
                      <div className="d-flex justify-content-xl-end">
                        {filteredKeys.includes("variable_start_stamp") && (
                          <>
                            {" "}
                            <div className="formRow border-0">
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
                                  Choose Date And / Or Time
                                </label>
                                <div className="d-flex w-100">
                                  <input
                                    type="date"
                                    className="formItem"
                                    max={new Date()?.toISOString()?.split("T")[0]}
                                    value={startDateFlag}
                                    onChange={(e) => {
                                      setStartDateFlag(e.target.value);
                                      setPageNumber(1);
                                    }}
                                  />
                                  <input
                                    type="time"
                                    className="formItem ms-2"
                                    value={timeFlag.startTime}
                                    onChange={(e) => {
                                      setTimeFlag((prev) => ({ ...prev, startTime: `${e.target.value}:00` }));
                                      setPageNumber(1);
                                    }}
                                  />
                                </div>
                              </div>
                            )}
                            {filterBy === "date_range" && (
                              <>
                                <div className="formRow border-0">
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
                                        setPageNumber(1);
                                      }}
                                    />
                                    <input
                                      type="time"
                                      className="formItem ms-2"
                                      value={timeFlag.startTime}
                                      onChange={(e) => {
                                        setTimeFlag((prev) => ({ ...prev, startTime: `${e.target.value}:00` }));
                                        setPageNumber(1);
                                      }}
                                    />
                                  </div>
                                </div>
                                <div className="formRow border-0">
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
                                        setPageNumber(1);
                                      }}
                                      min={startDateFlag} // Prevent selecting an end date before the start date
                                    />
                                    <input
                                      type="time"
                                      className="formItem ms-2"
                                      value={timeFlag.endTime}
                                      onChange={(e) => {
                                        setTimeFlag((prev) => ({ ...prev, endTime: `${e.target.value}:00` }));
                                        setPageNumber(1);
                                      }}
                                    />
                                  </div>
                                </div>
                              </>
                            )}
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
                        {filteredKeys.includes("variable_sip_from_user") && (
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
                        )}
                        {filteredKeys.includes("variable_sip_to_user") && (
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
                        )}

                        {page === "all" &&
                          filteredKeys.includes("variable_sip_to_user") ? (
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
                                <option value={"outbound"}>
                                  Outbound Calls
                                </option>
                                {/* <option value={"missed"}>Missed Calls</option> */}
                                <option value={"internal"}>
                                  Internal Calls
                                </option>
                                {/* <option value={"transfer"}>
                                  Transfer Calls
                                </option> */}
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
                                value={callType}
                              >
                                <option value={""}>All Calls</option>
                                <option value={"extension"}>Extension</option>
                                <option value={"voicemail"}>Voice Mail</option>
                                <option value={"callcenter"}>
                                  Call Center
                                </option>
                                <option value={"ringgroup"}>Ring Group</option>
                              </select>
                            </div>
                          </>
                        ) : (
                          ""
                        )}
                        {page === "billing" ||
                          !filteredKeys.includes("Hangup-Cause") ? (
                          ""
                        ) : (
                          <>
                            <div className="formRow border-0 ">
                              <label className="formLabel text-start mb-0 w-100">
                                Hangup Status
                              </label>
                              <select
                                className="formItem"
                                onChange={(e) => {
                                  setHagupCause(e.target.value);
                                  setPageNumber(1);
                                }}
                                value={hangupCause}
                              >
                                <option value={""}>All</option>
                                <option value={"Answered"}>Answer</option>
                                <option value={"Missed"}>Missed</option>
                                <option value={"Voicemail"}>Voicemail</option>
                                <option value={"Cancelled"}>Cancelled</option>
                                <option value={"Failed"}>Failed</option>
                              </select>
                            </div>
                            {filteredKeys.includes("Hangup-Cause") && (
                              <div className="formRow border-0 pe-xl-0">
                                <label className="formLabel text-start mb-0 w-100">
                                  Hangup Cause
                                </label>
                                <select
                                  className="formItem"
                                  onChange={(e) => {
                                    setHangupStatus(e.target.value);
                                    setPageNumber(1);
                                  }}
                                  value={hangupStatus}
                                >
                                  <option value={""}>All</option>
                                  <option value={"NORMAL_CLEARING"}>
                                    Normal Clearing
                                  </option>
                                  <option value={"ORIGINATOR_CANCEL"}>
                                    Originator Cancel
                                  </option>
                                  <option value={"MANAGER_REQUEST"}>
                                    Manager Request
                                  </option>
                                  <option value={"NO_ANSWER"}>No Answer</option>
                                  <option value={"INVALID_GATEWAY"}>
                                    Invalid Gateway
                                  </option>
                                  <option value={"SERVICE_UNAVAILABLE"}>
                                    Service Unavailable
                                  </option>
                                  <option value={"INCOMPATIBLE_DESTINATION"}>
                                    Incompatible Destination
                                  </option>
                                  <option value={"NO_USER_RESPONSE"}>
                                    No User Response
                                  </option>
                                  <option value={"MEDIA_TIMEOUT"}>
                                    Media Timeout
                                  </option>
                                  <option value={"LOSE_RACE"}>Lose Race</option>
                                  <option value={"NORMAL_UNSPECIFIED"}>
                                    Normal Unspecified
                                  </option>
                                  <option value={"USER_BUSY"}>User Busy</option>
                                  <option value={"RECOVERY_ON_TIMER_EXPIRE"}>
                                    Recovery On Timer Expire
                                  </option>
                                  <option value={"USER_NOT_REGISTERED"}>
                                    User Not Registered
                                  </option>
                                  <option value={"CALL_REJECTED"}>
                                    Call Rejected
                                  </option>
                                  <option value={"SUBSCRIBER_ABSENT"}>
                                    Subscriber Absent
                                  </option>
                                  <option value={"CHAN_NOT_IMPLEMENTED"}>
                                    Chan Not Implemented
                                  </option>
                                  <option value={"DESTINATION_OUT_OF_ORDER"}>
                                    Destination Out Of Order
                                  </option>
                                  <option value={"NORMAL_TEMPORARY_FAILURE"}>
                                    Normal Temporary Failure
                                  </option>
                                  <option value={"NO_ROUTE_DESTINATION"}>
                                    No Route Destination
                                  </option>
                                  <option value={"ALLOTTED_TIMEOUT"}>
                                    Allotted Timeout
                                  </option>
                                  <option value={"INVALID_NUMBER_FORMAT"}>
                                    Invalid Number Format
                                  </option>
                                </select>
                              </div>
                            )}
                          </>
                        )}
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
                        {cdr?.data?.length > 0 ? (
                          <>
                            <thead>
                              <tr style={{ whiteSpace: "nowrap" }}>
                                <th>#</th>
                                {showKeys.map((key) => {
                                  if (
                                    cdr?.data[0]?.hasOwnProperty(key) &&
                                    key !== "id"
                                  ) {
                                    let formattedKey = "";
                                    if (key === "variable_sip_from_user") {
                                      formattedKey = "Caller No.";
                                    } else if (key === "variable_sip_to_user") {
                                      formattedKey = "Destination";
                                    } else if (
                                      key === "Caller-Orig-Caller-ID-Name"
                                    ) {
                                      formattedKey = "Caller Name";
                                    } else if (key === "recording_path") {
                                      formattedKey = "Recording";
                                    } else if (key === "variable_billsec") {
                                      formattedKey = "Duration";
                                    } else if (key === "application_state") {
                                      formattedKey = "Via/Route";
                                    } else if (
                                      key === "application_state_to_ext"
                                    ) {
                                      formattedKey = "Ext";
                                    } else if (key === "e_name") {
                                      formattedKey = "User Name";
                                    } else if (key === "variable_DIALSTATUS") {
                                      formattedKey = "Hangup Status";
                                    } else if (key === "Hangup-Cause") {
                                      formattedKey = "Hangup Cause";
                                    } else if (key === "call_cost") {
                                      formattedKey = "Charge";
                                    } else {
                                      formattedKey = key
                                        .replace(/[-_]/g, " ")
                                        .toLowerCase()
                                        .replace(/\b\w/g, (char) =>
                                          char.toUpperCase()
                                        );
                                    }
                                    return <th key={key}>{formattedKey}</th>;
                                  }
                                  return null;
                                })}
                                {page !== "billing" &&
                                  <>
                                    <th>Block</th>
                                    <th>Note</th>
                                    <th>Duplicate</th>
                                  </>
                                }
                              </tr>
                            </thead>

                            <tbody>
                              {loading ? (
                                <SkeletonTableLoader
                                  col={page === "billing" ? showKeys.length : showKeys.length + 1}
                                  row={12}
                                />
                              ) : (
                                <>
                                  {cdr?.data?.map((item, index) => {
                                    const isBlocked = callBlock?.some(
                                      (block) => {
                                        if (
                                          item["Call-Direction"] === "inbound"
                                        ) {
                                          return (
                                            item["Caller-Caller-ID-Number"] ===
                                            block.number
                                          );
                                        } else if (
                                          item["Call-Direction"] === "outbound"
                                        ) {
                                          return (
                                            item["Caller-Callee-ID-Number"] ===
                                            block.number
                                          );
                                        }
                                      }
                                    );

                                    return (
                                      <React.Fragment key={index}>
                                        <tr className="cdrTableRow">
                                          <td>
                                            {(pageNumber - 1) *
                                              Number(itemsPerPage) +
                                              (index + 1)}
                                          </td>

                                          {showKeys.map((key) => {
                                            if (
                                              item.hasOwnProperty(key) &&
                                              key !== "id"
                                            ) {
                                              if (key === "recording_path") {
                                                return (
                                                  <td key={key}>
                                                    {item["recording_path"] && item["variable_billsec"] > 0 &&
                                                      <button
                                                        className="tableButton px-2 mx-0"
                                                        onClick={() => {
                                                          if (
                                                            item[
                                                            "recording_path"
                                                            ] ===
                                                            currentPlaying
                                                          ) {
                                                            setCurrentPlaying(
                                                              ""
                                                            );
                                                            setAudioURL("");
                                                          } else {
                                                            handlePlaying(
                                                              item[
                                                              "recording_path"
                                                              ]
                                                            );
                                                          }
                                                        }}
                                                      >
                                                        {currentPlaying ===
                                                          item[
                                                          "recording_path"
                                                          ] ? (
                                                          <i className="fa-solid fa-chevron-up"></i>
                                                        ) : (
                                                          <i className="fa-solid fa-chevron-down"></i>
                                                        )}
                                                      </button>
                                                    }
                                                  </td>
                                                );
                                              } else if (
                                                key === "Call-Direction"
                                              ) {
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

                                                return (
                                                  <td key={key}>
                                                    <i
                                                      className={`fa-solid ${callType.icon} me-1`}
                                                      style={{
                                                        color: callType.color,
                                                      }}
                                                    ></i>
                                                    {callType.label}
                                                  </td>
                                                );
                                              } else if (
                                                key === "application_state"
                                              ) {
                                                return (
                                                  <td key={key}>
                                                    {[
                                                      "intercept",
                                                      "eavesdrop",
                                                      "whisper",
                                                      "barge",
                                                    ].includes(
                                                      item["application_state"]
                                                    )
                                                      ? item[
                                                      "other_leg_destination_number"
                                                      ]
                                                      : item[
                                                      "Caller-Callee-ID-Number"
                                                      ]}{" "}
                                                    {item[
                                                      "application_state_name"
                                                    ] &&
                                                      `(${item["application_state_name"]})`}
                                                  </td>
                                                );
                                              } else if (
                                                key === "variable_billsec"
                                              ) {
                                                return (
                                                  <td key={key}>
                                                    {formatTime(
                                                      item["variable_billsec"]
                                                    )}
                                                  </td>
                                                );
                                              } else if (key === "call_cost" && item[key]) {
                                                return (
                                                  <td>${item[key]}</td>
                                                )
                                              } else {
                                                return (
                                                  <td key={key}>{item[key]}</td>
                                                );
                                              }
                                            }
                                            return null;
                                          })}
                                          {page !== "billing" &&
                                            <>
                                              <td>
                                                {
                                                  (item["Call-Direction"] === "inbound" || item["Call-Direction"] === "outbound") ?
                                                    <button
                                                      disabled={isBlocked}
                                                      effect="ripple"
                                                      className={`tableButton delete ${isBlocked ? "bg-danger text-white" : ""
                                                        } ms-0`}
                                                      style={{
                                                        height: "34px",
                                                        width: "34px",
                                                      }}
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
                                                      <Tippy
                                                        content={
                                                          isBlocked
                                                            ? "Blocked"
                                                            : "Block"
                                                        }
                                                      >
                                                        <i className="fa-solid fa-ban"></i>
                                                      </Tippy>
                                                    </button>
                                                    : ""}
                                              </td>
                                              <td>
                                                <button
                                                  effect="ripple"
                                                  className={`tableButton ms-0`}
                                                  style={{
                                                    height: "34px",
                                                    width: "34px",
                                                  }}
                                                  onClick={() => {
                                                    setSelectedCdr(item.id);
                                                  }}
                                                >
                                                  <Tippy content={"View Note"}>
                                                    <i className="fa-solid fa-comment-dots"></i>
                                                  </Tippy>
                                                </button>
                                              </td>
                                              <td>
                                                {item?.duplicated == 1 && <button
                                                  className={`tableButton edit ms-0`}
                                                  onClick={
                                                    () => duplicateColumn(item)
                                                  }
                                                >
                                                  <Tippy content={"View Duplicate"}>
                                                    <i className="fa-solid fa-clone"></i>
                                                  </Tippy>
                                                </button>}
                                              </td>
                                            </>
                                          }

                                        </tr>
                                        {currentPlaying ===
                                          item["recording_path"] &&
                                          item["recording_path"] && (
                                            <tr>
                                              <td colSpan="17">
                                                <div className="audio-container mx-2">
                                                  <AudioWaveformCommon audioUrl={audioURL} />
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
                                              <td colspan="18">
                                                <AudioTranscribe url={transcribeLink} />
                                              </td>
                                            </tr>
                                            : ""
                                        } */}
                                      </React.Fragment>
                                    );
                                  })}
                                </>
                              )}
                            </tbody>
                          </>
                        ) : cdr?.data?.length === 0 && !loading ? (
                          <div>
                            <EmptyPrompt
                              type="generic"
                            />
                          </div>
                        ) : ''}
                      </table>
                    </div>
                    <div className="tableHeader mb-3">
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
                          <i className="fa-solid fa-check"></i>
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
                          <i className="fa-solid fa-xmark"></i>
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
        {exportPopup && (<ExportPopUp filteredKeys={filteredKeys} page={page} setExportPopup={setExportPopup} setLoading={setLoading} exportToCSV={exportToCSV} itemsPerPage={itemsPerPage} account={account} setCircularLoader={setCircularLoader} />
        )}
      </main>
      {/* Note Popup */}
      {selectedCdr !== "" && (
        <Comments id={selectedCdr} setId={setSelectedCdr} setShowComment={setShowComment} />
      )}
      {showDuplicatePopUp && <Duplicates duplicatePopUpData={duplicatePopUpData} setShowDuplicatePopUp={setShowDuplicatePopUp} id={selectedCdr} setId={setSelectedCdr} />}
      {advanceSearchPopup &&
        <div className="backdropContact">
          <div className="addNewContactPopup">
            <button className="clearButton2 xl" onClick={() => setAdvanceSearchPopup(false)} style={{ position: "absolute", top: "10px", right: "10px" }}>
              <i class="fa-light fa-xmark" />
            </button>
            <div className="row">
              <div class="col-12 heading mb-0">
                <i class="fa-light fa-magnifying-glass"></i>
                <h5>Advance Search</h5>
              </div>
              <div>
                <div class="searchBoxWrapper"><input class="searchBar formItem" type="text" value="" onChange={() => featureUnderdevelopment()} /></div>
              </div>
              <div className="row mx-auto">
                <div class="formRow border-0">
                  <label class="formLabel text-start mb-0 w-100">From</label>
                  <div class="d-flex w-100">
                    <input type="date" class="formItem" max="2025-04-30" value="" onChange={() => featureUnderdevelopment()} />
                    <input type="time" class="formItem ms-2" value="" onChange={() => featureUnderdevelopment()} />
                  </div>
                </div>
                <div class="formRow border-0">
                  <label class="formLabel text-start mb-0 w-100">To</label>
                  <div class="d-flex w-100">
                    <input type="date" class="formItem" max="2025-04-30" value="" onChange={() => featureUnderdevelopment()} />
                    <input type="time" class="formItem ms-2" value="" onChange={() => featureUnderdevelopment()} />
                  </div>
                </div>
              </div>
              <div class="col-xl-12 mt-3">
                <button class="panelButton mx-auto" onClick={() => featureUnderdevelopment()}>
                  <span class="text">Search</span>
                  <span class="icon"><i class="fa-solid fa-magnifying-glass"></i></span>
                </button>
              </div>
            </div>
          </div>
        </div>
      }
    </>
  );
}

export default CdrFilterReport;
