/* eslint-disable array-callback-return */
/* eslint-disable eqeqeq */
/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import Header from "../../CommonComponents/Header";
import {
  backToTop,
  featureUnderdevelopment,
  generalDeleteFunction,
  generalGetFunction,
  generalPostFunction,
  generatePreSignedUrl,
} from "../../GlobalFunction/globalFunction";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import EmptyPrompt from "../../Loader/EmptyPrompt";
import PaginationComponent from "../../CommonComponents/PaginationComponent";
import SkeletonTableLoader from "../../Loader/SkeletonTableLoader";
import { toast } from "react-toastify";
import Tippy from "@tippyjs/react";
import Comments from "./Comments";
import PromptFunctionPopup from "../../CommonComponents/PromptFunctionPopup";
import AudioWaveformCommon from "../../CommonComponents/AudioWaveformCommon";
import DropdownForAudio from "../../DropdownForAudio";


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
  const [timeFlag, setTimeFlag] = useState({
    startTime: "",
    endTime: "",
  });
  const [timeFilter, setTimeFilter] = useState({
    startTime: "",
    endTime: "",
  });

  const [isRecordingFlag, setIsRecordingFlag] = useState("");

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
  const [storageInformation, setStorageInformation] = useState([]);
  const accountStorageInfo = useSelector((state) => state?.accountDetails?.package?.device_storage);
  const { confirm, ModalComponent } = PromptFunctionPopup();
  const [showDropDown, setShowDropdown] = useState(false)
  const [showAudio, setShowAudio] = useState(false)
  const [showCdrReport, setShowCdrReport] = useState(true)
  const [recordingSorting, setRecordingSorting] = useState("none");
  const [durationSorting, setDurationSorting] = useState("none")


  const thisAudioRef = useRef(null);
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
    if (/^\d*$/.test(newValue) && newValue.length <= 15) {
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
    if (/^\d*$/.test(newValue) && newValue.length <= 15) {
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
      setUpdatedQueryparams(queryParams);
      return queryParams ? `${baseApiUrl}&${queryParams}` : baseApiUrl;
    };
    const finalUrl = buildUrl(
      `/all-cdr-reports?account=${account.account_id}&page=${pageNumber}&row_per_page=${itemsPerPage}&recording=true`,
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
        variable_billsec: page == "callrecording" && durationSorting !== "none" ? durationSorting : "",
        recording_size: page == "callrecording" && recordingSorting !== "none" ? recordingSorting : ""
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
    timeFlag,
    hangupCause,
    hangupStatus,
    refresh,
    itemsPerPage,
    page,
    recordingSorting,
    durationSorting
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

  // Delete Call Recording Function
  const handleDeleteCallRecording = async (selectedCdr) => {
    const userConfirmed = await confirm();
    if (userConfirmed) {
      setLoading(true);
      try {
        const apiCall = await generalDeleteFunction(`/cdr-record-remove/${selectedCdr}`);
        if (apiCall.status) {
          setLoading(false);
          toast.success("Call Recording Deleted Successfully.");
          refreshCallData();
        }
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    }
  }

  // Fetch Storage Information
  const getStorageInformation = async () => {
    setLoading(true);
    try {
      const apiCall = await generalGetFunction(`/get-stoarge-details`);
      if (apiCall) {
        setStorageInformation(apiCall);
        setLoading(false);
      }
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  }

  useEffect(() => {
    getStorageInformation();
  }, [])

  function convertToGB(param) {
    const units = {
      KB: 1 / (1024 * 1024),
      MB: 1 / 1024,
      GB: 1,
      TB: 1024
    };

    let unit = param?.split(" ")[1]?.toUpperCase();
    let size = param?.split(" ")[0];

    if (units[unit] !== undefined) {
      return (size * units[unit]).toFixed(2);
    } else {
      return "Invalid unit";
    }
  }

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
    setTimeFlag({ startTime: "", endTime: "" });
    setTimeFilter({ startTime: "", endTime: "" });

    setTimeout(() => {
      refreshCallData();
    })
  };

  return (
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
                                ? "fa-regular fa-arrows-rotate fs-5 fa-spin"
                                : "fa-regular fa-arrows-rotate fs-5"
                            }
                          ></i>
                        </span>
                      </button>
                      <button
                        effect="ripple"
                        className="panelButton"
                        onClick={() => handleExport()}
                        disabled={loading}
                      >
                        <span className="text">Export</span>
                        <span className="icon">
                          <i className="fa-solid fa-file-export"></i>
                        </span>
                      </button>
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
                    {page === "callrecording" && (
                      <div style={{ width: '200px' }}>
                        <div className="showEntries">
                          <label>Storage</label><label>{storageInformation?.total_size} / {accountStorageInfo} GB</label>
                        </div>
                        <div class="progress">
                          <Tippy content={`Storage Used: ${storageInformation?.total_size || 'N/A'}`}>
                            <div class="progress-bar bg-warning progress-bar-striped progress-bar-animated" role="progressbar" aria-label="Segment one" style={{ width: `${(convertToGB(storageInformation?.total_size) / accountStorageInfo) * 100}%` }} aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div>
                          </Tippy>
                          <Tippy content={`Storage Left: ${accountStorageInfo - convertToGB(storageInformation?.total_size) + ' GB' || 'N/A'}`}>
                            <div class="progress-bar bg-info progress-bar-striped progress-bar-animated" role="progressbar" aria-label="Segment one" style={{ width: `${((accountStorageInfo - convertToGB(storageInformation?.total_size)) / accountStorageInfo) * 100}%` }} aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div>
                          </Tippy>
                        </div>
                      </div>
                    )}
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
                          <div className="formRow border-0">
                            <label className="formLabel text-start mb-0 w-100">
                              To
                            </label>
                            <div className="d-flex w-100">
                              <input
                                type="date"
                                className="formItem"
                                max={new Date()?.toISOString()?.split("T")[0]}
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
                              <option value={"transfer"}>Transfer Calls</option>
                            </select>
                          </div>
                          {/* <div className="formRow border-0">
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
                          </div> */}
                        </>
                      ) : (
                        ""
                      )}
                      {page === "callrecording" ? (
                        <>
                          <div className="formRow border-0 ps-xl-0">
                            <label className="formLabel text-start mb-0 w-100">
                              Recording Filter
                            </label>
                            <select
                              className="formItem"
                              value={recordingSorting}
                              onChange={(e) => {
                                setRecordingSorting(e.target.value)
                              }}
                            >
                              <option value={"asc"}>Ascending</option>
                              <option value={"desc"}>Descending</option>
                              <option value={"none"}>None</option>
                            </select>
                          </div>
                          <div className="formRow border-0 ps-xl-0">
                            <label className="formLabel text-start mb-0 w-100">
                              Duration Filter
                            </label>
                            <select
                              className="formItem"
                              value={durationSorting}
                              onChange={(e) => {
                                setDurationSorting(e.target.value)
                              }}
                            >
                              <option value={"asc"}>Ascending</option>
                              <option value={"desc"}>Descending</option>
                              <option value={"none"}>None</option>
                            </select>
                          </div>
                        </>
                      ) : (
                        <>
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
                              <option value={"NOT CONNECTED"}>
                                Not Connected
                              </option>
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
                              <option value={"MEDIA_TIMEOUT"}>
                                Media Timeout
                              </option>
                              <option value={"NORMAL_CLEARING"}>
                                Normal Clearing
                              </option>
                            </select>
                          </div>
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
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Direction</th>
                          {/* {page === "billing" ? "" : <th>Call Type</th>} */}
                          <th>Caller Name</th>
                          <th>Caller No.</th>
                          <th>Tag</th>
                          <th>Via/Route</th>
                          {page === "callrecording" ? (
                            ""
                          ) : (
                            <>
                              <th>Extension</th>
                              <th>User name</th>
                              <th>Date</th>
                              <th>Time</th>
                            </>
                          )}
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
                          {page === "billing" || page === "callrecording" ? (
                            ""
                          ) : (
                            <th>Block</th>
                          )}
                          <th>Notes</th>
                          <th>Delete</th>
                        </tr>
                      </thead>
                      <tbody>
                        {loading ? (
                          <SkeletonTableLoader
                            col={
                              page === "billing"
                                ? 13
                                : page === "callrecording"
                                  ? 10
                                  : 17
                            }
                            row={12}
                          />
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

                                // Map File Storage Sizes To CDR
                                const matchedStorage = storageInformation?.file_details?.find(
                                  (storage) => {
                                    if (item["recording_path"] && item["variable_billsec"] > 0) {
                                      if (storage.url === item["recording_path"].replace('s3.', '')) {
                                        return storage.size;
                                      }
                                    }
                                  }
                                );
                                const storageSize = matchedStorage?.size || "N/A";

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
                                              className="fa-solid fa-phone-arrow-down-left me-1"
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
                                              className="fa-solid fa-phone-arrow-up-right me-1"
                                              style={{ color: "var(--color3)" }}
                                            ></i>{" "}
                                            Outbound
                                          </span>
                                        ) : item["Call-Direction"] ===
                                          "missed" ? (
                                          <span>
                                            <i
                                              className="fa-solid fa-phone-missed me-1"
                                              style={{
                                                color: "var(--funky-boy3)",
                                              }}
                                            ></i>{" "}
                                            Missed
                                          </span>
                                        ) : item["Call-Direction"] ===
                                          "transfer" ? (
                                          <span>
                                            <i
                                              className="fa-solid fa-phone-missed me-1"
                                              style={{
                                                color: "var(--funky-boy3)",
                                              }}
                                            ></i>{" "}
                                            Transfer
                                          </span>
                                        ) : (
                                          <span>
                                            <i
                                              className="fa-solid fa-headset me-1"
                                              style={{ color: "var(--color2)" }}
                                            ></i>{" "}
                                            Internal
                                          </span>
                                        )}
                                      </td>
                                      {/* {page === "billing" ? (
                                        ""
                                      ) : (
                                        <td>{item["application_state"]}</td>
                                      )} */}
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
                                          "whisper" ||
                                          item["application_state"] === "barge"
                                          ? item["other_leg_destination_number"]
                                          : item[
                                          "Caller-Callee-ID-Number"
                                          ]}{" "}
                                        {item["application_state_name"] &&
                                          `(${item["application_state_name"]})`}
                                      </td>
                                      {page === "callrecording" ? (
                                        ""
                                      ) : (
                                        <>
                                          <td>
                                            {item["application_state_to_ext"]}
                                          </td>
                                          {/* time */}
                                          <td>{item["e_name"]}</td>
                                          <td>
                                            {
                                              item[
                                                "variable_start_stamp"
                                              ]?.split(" ")[0]
                                            }
                                          </td>
                                          <td>
                                            {
                                              item[
                                                "variable_start_stamp"
                                              ]?.split(" ")[1]
                                            }
                                          </td>
                                        </>
                                      )}
                                      <td>
                                        {item["recording_path"] &&
                                          item["variable_billsec"] > 0 && (
                                            <>
                                              <div className="d-flex justify-content-start align-items-center">
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
                                                <label className="ms-2">{item?.recording_size}</label>
                                              </div>
                                            </>

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
                                      {page === "billing" ||
                                        page === "callrecording" ? (
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
                                      {page === "callrecording" ? (
                                        ""
                                      ) : (
                                        <td>{item["call_cost"]}</td>
                                      )}
                                      {page === "billing" ||
                                        page === "callrecording" ? (
                                        ""
                                      ) : (
                                        <td>
                                          {" "}
                                          {
                                            (item["Call-Direction"] === "inbound" || item["Call-Direction"] === "outbound") ?
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
                                                  <i className="fa-solid fa-ban"></i>
                                                </Tippy>
                                                {/* </span> */}
                                              </button>
                                              : ""}
                                        </td>
                                      )}
                                      <td>
                                        <button className={`tableButton ms-0`} onClick={() => setSelectedCdr(item.id)}>
                                          <Tippy content={'View Note'}
                                          >
                                            <i className="fa-solid fa-comment-dots"></i>
                                          </Tippy>
                                        </button>
                                      </td>
                                      <td>
                                        {item["recording_path"] &&
                                          item["variable_billsec"] > 0 && (
                                            <button className={`tableButton delete ms-0`} onClick={() => handleDeleteCallRecording(item.id)}>
                                              <Tippy content={'Delete Recording'}
                                              >
                                                <i className="fa-solid fa-trash"></i>
                                              </Tippy>
                                            </button>
                                          )}
                                      </td>
                                    </tr>
                                    {/* {currentPlaying ===
                                      item["recording_path"] &&
                                      item["recording_path"] && (
                                        <tr>
                                          <td colSpan={99}>
                                            <div className="audio-container mx-2"> */}
                                    {/* <audio
                                                controls={true}
                                                ref={thisAudioRef}
                                                autoPlay={true}
                                                onEnded={() => {
                                                  setCurrentPlaying(null);
                                                  setAudioURL("");
                                                }}
                                              >
                                                <source
                                                  src={audioURL}
                                                  type="audio/mpeg"
                                                />
                                              </audio> */}
                                    {/* <AudioWaveformCommon audioUrl={audioURL} /> */}
                                    {/* <button
                                                className="audioCustomButton"
                                              // onClick={() =>
                                              //   handleAudioDownload(
                                              //     clickedVoiceMail.recording_path
                                              //   )
                                              // }
                                              >
                                                <i className="fa-sharp fa-solid fa-download" />
                                              </button> */}
                                    {/* <button className="audioCustomButton ms-1">
                              <i className="fa-sharp fa-solid fa-box-archive" />
                            </button> */}
                                    {/* </div>
                                          </td>
                                        </tr>
                                      )} */}
                                    {currentPlaying ===
                                      item["recording_path"] &&
                                      item["recording_path"] && (
                                        <tr>
                                          <td colSpan={99}>
                                            <div className="audio-container mx-2">
                                              <AudioWaveformCommon audioUrl={audioURL} />
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
      {selectedCdr !== "" &&
        <Comments
          id={selectedCdr}
          setId={setSelectedCdr}
          showCdrReport={showCdrReport}
        />
      }
      <ModalComponent task={"delete"} reference={"cdr recording"} />
    </main>
  );
}

export default CdrReport;
