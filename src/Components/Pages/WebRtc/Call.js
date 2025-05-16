/* eslint-disable no-unused-vars */
/* eslint-disable eqeqeq */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import Dialpad from "./Dialpad";
import CallDetails from "./CallDetails";
import { useDispatch, useSelector } from "react-redux";
import AddNewContactPopup from "./AddNewContactPopup";
import { useNavigate } from "react-router-dom";
import ContentLoader from "../../Loader/ContentLoader";
import { toast } from "react-toastify";
import { useSIPProvider } from "modify-react-sipjs";
import {
  featureUnderdevelopment,
  generalGetFunction,
  generalPostFunction,
  generalPutFunction,
  logout,
} from "../../GlobalFunction/globalFunction";
import DarkModeToggle from "../../CommonComponents/DarkModeToggle";
import LogOutPopUp from "./LogOutPopUp";
import Comments from "./Comments";
import Tippy from "@tippyjs/react";
import HeaderApp from "./HeaderApp";

/**
 * Component to handle and display call functionalities, including call history, 
 * filtering, searching, and initiating calls. Manages states for call sessions, 
 * dialpad visibility, and various UI elements. Integrates with Redux store for 
 * session and account data.
 *
 * @param {string} selectedModule - The currently selected module.
 * @param {function} setSelectedModule - Function to update the selected module.
 * @param {boolean} isCustomerAdmin - Indicates if the current user is a customer admin.
 * @param {boolean} isMicOn - Indicates if the microphone is enabled.
 * @param {boolean} isVideoOn - Indicates if the video is enabled.
 * @param {function} setactivePage - Function to set the active page.
 * @param {Array} allContact - List of all contacts.
 * @param {function} setExtensionFromCdrMessage - Function to set the extension from CDR message.
 * @param {Array} data - Array of call data.
 * @param {string} filterBy - The filter criteria for calls.
 * @param {number} currentPage - The current page number for pagination.
 * @param {Date} startDate - The start date for filtering calls.
 * @param {Date} endDate - The end date for filtering calls.
 * @param {string} searchQuery - The search query for filtering calls.
 * @param {string} clickStatus - The current click status for call filtering.
 * @param {number} refreshCalls - Counter to trigger call data refresh.
 * @param {Array} allApiData - Array of all API data.
 * @param {Object} rawData - Raw data object for calls.
 * @param {function} setCurrentPage - Function to set the current page.
 * @param {function} setStartDate - Function to set the start date.
 * @param {function} setEndDate - Function to set the end date.
 * @param {function} setSearchQuery - Function to set the search query.
 * @param {function} setFilterBy - Function to set the filter criteria.
 * @param {function} setIsLoading - Function to set the loading state.
 * @param {function} setLoading - Function to set the loading state.
 * @param {boolean} loading - Indicates if data is currently loading.
 * @param {boolean} isLoading - Indicates if data is currently loading.
 */

function Call({
  selectedModule,
  setSelectedModule,
  isCustomerAdmin,
  isMicOn,
  isVideoOn,
  setactivePage,
  allContact,
  setExtensionFromCdrMessage,
  data,
  filterBy,
  currentPage,
  startDate,
  endDate,
  searchQuery,
  clickStatus,
  refreshCalls,
  allApiData,
  rawData,
  setCurrentPage,
  setStartDate,
  setEndDate,
  setSearchQuery,
  setFilterBy,
  setIsLoading,
  setIsCallLoading,
  loading,
  isCallLoading


}) {
  const dispatch = useDispatch();
  const sessions = useSelector((state) => state.sessions);
  const [dialpadShow, setDialpadShow] = useState(false);
  const videoCall = useSelector((state) => state.videoCall);
  const navigate = useNavigate();
  const account = useSelector((state) => state.account);
  const [allCalls, setAllCalls] = useState([]);
  const extension = account?.extension?.extension || "";
  const [previewCalls, setPreviewCalls] = useState([]);
  const [addContactToggle, setAddContactToggle] = useState(false);
  const [clickedCall, setClickedCall] = useState(null);
  const [mode, setMode] = useState("audio");
  const [callHistory, setCallHistory] = useState([]);
  const { sessionManager, connectStatus } = useSIPProvider();
  // const [refreshCalls, setRefreshCalls] = useState(0);
  const [clickedExtension, setClickedExtension] = useState(null);
  const targetRef = useRef(null); // Reference to the target div
  const [startDateFlag, setStartDateFlag] = useState("");
  const [endDateFlag, setEndDateFlag] = useState("");
  const [filterState, setfilterState] = useState("all");
  const [comment, setComment] = useState("");
  const [selectedCdr, setSelectedCdr] = useState("");
  const [commentData, setCommentData] = useState([]);
  const [firstTimeClickedExtension, setFirstTimeClickedExtension] =
    useState(false);
  const allCallCenterIds = useSelector((state) => state.allCallCenterIds);
  const [allLogOut, setAllLogOut] = useState(false);
  const callListRef = useRef(null);
  const [showComments, setShowComment] = useState(false);
  const handleScroll = () => {
    const div = callListRef.current;
    if (div?.scrollTop + div?.clientHeight >= div?.scrollHeight) {
      if (!isCallLoading && rawData.current_page !== rawData?.last_page) {
        setCurrentPage(currentPage + 1);
      }
    }
  };
  // Function to handle logout
  const handleLogOut = async () => {
    setIsCallLoading(true);
    try {
      const apiResponses = await logout(
        allCallCenterIds,
        dispatch,
        sessionManager
      );
    } catch (error) {
      console.error("Unexpected error in handleLogOut:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsCallLoading(false);
    }
  };
  function handleHideDialpad(value) {
    setDialpadShow(value);
  }

  useEffect(() => {
    if (filterBy === "date") {
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
    let filteredCalls = [];
    switch (clickStatus) {
      case "incoming":
        filteredCalls = allCalls.filter(
          (e) =>
            e["Caller-Callee-ID-Number"] === extension &&
            e["variable_billsec"] > 0
        );
        break;
      case "outgoing":
        filteredCalls = allCalls.filter(
          (e) => e["Caller-Caller-ID-Number"] === extension
        );
        break;
      case "missed":
        filteredCalls = allCalls.filter(
          (e) =>
            e["Caller-Callee-ID-Number"] === extension &&
            e["variable_billsec"] === 0
        );
        break;
      case "voicemail":
        filteredCalls = allCalls.filter(
          (e) => e["Call-Direction"] === "voicemail"
        );
        break;
      case "all":
      default:
        filteredCalls = data;
        break;
    }
    // search functionality
    // if (searchQuery) {
    //   const lowerCaseSearchQuery = searchQuery.toLowerCase();
    //   filteredCalls = filteredCalls.filter((call) => {
    //     return (
    //       call.caller_user?.username
    //         ?.toLowerCase()
    //         .includes(lowerCaseSearchQuery) ||
    //       call["Caller-Callee-ID-Number"]
    //         .toString()
    //         .toLowerCase()
    //         .includes(lowerCaseSearchQuery)
    //     );
    //   });
    // }
    setPreviewCalls(filteredCalls);
    if (clickedCall == null) {
      setClickedCall(filteredCalls[0]);
    }

    if (filteredCalls[0] && !firstTimeClickedExtension) {
      setClickedExtension(
        filteredCalls[0]["Caller-Callee-ID-Number"] === extension
          ? filteredCalls[0]["Caller-Caller-ID-Number"]
          : filteredCalls[0]["Caller-Callee-ID-Number"]
      );
      setFirstTimeClickedExtension(true);
    }

    setCallHistory(
      filteredCalls?.[0] &&
      allApiData?.filter((item) => {
        if (!isCustomerAdmin) {
          return (
            (item["Caller-Callee-ID-Number"] === extension &&
              item["Caller-Caller-ID-Number"] === clickedExtension) ||
            (item["Caller-Caller-ID-Number"] === extension &&
              item["Caller-Callee-ID-Number"] === clickedExtension)
          );
        }
        return true;
      })
    );
  }, [data, clickStatus]);
  const formatTime = (duration) => {
    const sec = Math.floor(duration % 60);
    const min = Math.floor((duration / 60) % 60);
    const hour = Math.floor(duration / 3600);
    return (
      `${hour ? hour + " hr" : ""}${min ? min + " min" : ""} ${sec ? sec + " sec" : ""
      }` || "0 sec"
    );
  };

  const handleCallItemClick = (item) => {
    setClickedCall(item);
    setClickedExtension(
      item["Caller-Callee-ID-Number"] === extension
        ? item["Caller-Caller-ID-Number"]
        : item["Caller-Callee-ID-Number"]
    );
  };

  const handleDoubleClickCall = (item) => {
    setMode("audio");
    if (connectStatus !== "CONNECTED") {
      toast.error("You are not connected with server");
      return;
    }
    onCall(item, mode);
  };

  const renderCallItem = (item) => {
    const matchingContact = allContact.find(
      (contact) =>
        contact.did === item["Caller-Caller-ID-Number"] ||
        contact.did === item["Caller-Callee-ID-Number"]
    );

    // Use the matching contact's name if found, otherwise default to the extension
    const displayName = matchingContact
      ? matchingContact.name
      : item["Call-Direction"] === "outbound" ? item["variable_sip_to_user"]
        : item["Caller-Callee-ID-Number"] === extension
          ? item["Caller-Caller-ID-Number"]
          : item["Caller-Callee-ID-Number"];

    const matchingCalleeContactForAdmin = allContact.find(
      (contact) => contact.did === item["Caller-Callee-ID-Number"]
    )?.name;

    const matchingCallerContactForAdmin = allContact.find(
      (contact) => contact.did === item["Caller-Caller-ID-Number"]
    )?.name;


    // Call Type Icon Selector
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
          item.variable_DIALSTATUS ==
            "Missed" || item.variable_DIALSTATUS ==
            "Failed"
            ? "var(--funky-boy4)"
            : "var(--funky-boy3)",
        label: "Inbound",
      },
      outbound: {
        icon: statusIcons[item.variable_DIALSTATUS] || "fa-phone-arrow-up-right",
        color:
          item.variable_DIALSTATUS ==
            "Missed" || item.variable_DIALSTATUS ==
            "Failed"
            ? "var(--funky-boy4)"
            : "var(--color3)",
        label: "Outbound",
      },
      internal: {
        icon: statusIcons[item.variable_DIALSTATUS] || "fa-headset",
        color:
          item.variable_DIALSTATUS ==
            "Missed" || item.variable_DIALSTATUS ==
            "Failed"
            ? "var(--funky-boy4)"
            : "var(--color2)",
        label: "Internal",
      },
    };

    const callType =
      callIcons[
      item["Call-Direction"]
      ] || callIcons.internal;

    const getCallTypeIcon = (admin) => {
      return (
        <i className={`fa-solid ${callType.icon} me-2 ${admin && 'bg-white'}`} style={{ color: callType.color, }}></i>
      );
    }


    return (
      <>
        <div
          key={item.id}
          onClick={() => handleCallItemClick(item)}
          onDoubleClick={() => handleDoubleClickCall(item)}
          className={`callListItem wertc_iconBox border-bottom-0 ${clickedCall && clickedCall.id === item.id ? "selected" : ""}`}
        >
          <div className="row justify-content-between align-items-center">
            <div className="col-xl-12 d-flex align-items-center">
              <div
                className="profileHolder"
              // id={"profileOfflineNav"}
              >
                <i className="fa-light fa-user fs-5"></i>
              </div>
              {!isCustomerAdmin ? (
                <div
                  className="col-5 ms-xl-3"
                  style={{ cursor: "pointer" }}
                >
                  {/* <h4>
                    {item["Call-Direction"] === "outbound" ? item["variable_sip_to_user"]
                      : item["Caller-Callee-ID-Number"] === extension
                        ? item["Caller-Caller-ID-Number"]
                        : item["Caller-Callee-ID-Number"]
                    }
                  </h4> */}
                  <div className="d-flex align-items-center">
                    {<Tippy content={`${callType.label} - ${item.variable_DIALSTATUS}` || 'N/A'}>{getCallTypeIcon()}</Tippy>}
                    <div>
                      <h4 className="mb-0">
                        {displayName
                          ? displayName
                          : item.caller_user
                            ? item.caller_user.username
                            : "USER XYZ"}
                      </h4>
                      {item.tag && <h5>({item.tag})</h5>}
                    </div>
                  </div>
                  {/* <div className="contactTags">
                  <span data-id="2">Call, {formatTime(item["variable_billsec"])}</span>
                </div> */}
                </div>
              ) : (
                <div
                  className="col my-auto ms-2 ms-xl-3"
                  style={{ cursor: "pointer" }}
                >
                  <div className="d-flex align-items-center">
                    <div className="source">
                      <h4>
                        {matchingCallerContactForAdmin
                          ? `${matchingCallerContactForAdmin} (${item["Caller-Caller-ID-Number"]})`
                          : item["Caller-Caller-ID-Number"]}

                      </h4>
                      {item.tag && <h5>({item.tag})</h5>}
                    </div>
                    <div className="callIconAdmin">
                      {<Tippy content={`${callType.label} - ${item.variable_DIALSTATUS}` || 'N/A'}>{getCallTypeIcon(1)}</Tippy>}
                    </div>
                    <div className="destination">
                      <h4>
                        {matchingCalleeContactForAdmin
                          ? `${matchingCalleeContactForAdmin} (${item["Caller-Callee-ID-Number"]})`
                          : item["Caller-Callee-ID-Number"]}
                      </h4>
                      {/* <h5>Destination</h5> */}
                    </div>
                  </div>
                  {item["variable_billsec"] > 0 && (
                    <div
                      className={`col-12 mx-auto mt-2`}
                    >
                      <div className="contactTags">
                        <span data-id="2" className="duration">
                          Duration: {formatTime(item["variable_billsec"])}
                        </span>
                      </div>
                    </div>
                  )}
                  {/* <div className="contactTags">
                  <span data-id="2">Call, {formatTime(item["variable_billsec"])}</span>
                </div> */}
                </div>
              )}

              {/* {item["variable_billsec"] > 0 && (
                <div
                  className={`col-3 mx-auto ${isCustomerAdmin ? "my-auto" : ""}`}
                >
                  <div className="contactTags">
                    <span data-id="2" className="duration">
                      Duration: {formatTime(item["variable_billsec"])}
                    </span>
                  </div>
                </div>
              )} */}

              <div className="col-auto text-end ms-auto">
                <p className="timeAgo mb-0">
                  {new Date(item.variable_start_stamp)
                    .toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })
                    .replace(" AM", "am")
                    .replace(" PM", "pm")}
                </p>
                <button className="clearButton2 xl" type="button" onClick={() => { setSelectedCdr(item?.id); }}>
                  <i className="fa-light fa-comment-dots" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

  useEffect(() => {
    if (clickedExtension) {
      const filteredHistory = data.filter((item) => {
        if (!isCustomerAdmin) {
          return (
            (item["Caller-Callee-ID-Number"] === extension &&
              item["Caller-Caller-ID-Number"] === clickedExtension) ||
            (item["Caller-Caller-ID-Number"] === extension &&
              item["Caller-Callee-ID-Number"] === clickedExtension)
          );
        }
        return item["Caller-Callee-ID-Number"] === clickedExtension;
      });
      setCallHistory(filteredHistory);
    }
  }, [clickedExtension, allApiData, extension]);

  const groupCallsByDate = (calls) => {
    return calls.reduce((acc, call) => {
      // Parse the date as UTC and handle different formats
      const callDate = new Date(call.variable_start_stamp);
      const today = new Date();

      // Ensure `today` is at midnight UTC
      const todayDate = new Date(
        Date.UTC(today.getFullYear(), today.getMonth(), today.getDate())
      );
      const yesterday = new Date(todayDate);
      yesterday.setUTCDate(todayDate.getUTCDate() - 1);

      let dateLabel = callDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });

      // Compare only the date parts
      if (callDate.toDateString() === todayDate.toDateString()) {
        dateLabel = "Today";
      } else if (callDate.toDateString() === yesterday.toDateString()) {
        dateLabel = "Yesterday";
      }

      if (!acc[dateLabel]) {
        acc[dateLabel] = [];
      }

      acc[dateLabel].push(call);
      return acc;
    }, {});
  };
  const sortKeys = (keys) => {
    return keys.sort((a, b) => {
      if (a === "Today") return -1;
      if (b === "Today") return 1;
      if (a === "Yesterday") return -1;
      if (b === "Yesterday") return 1;
      return new Date(b) - new Date(a);
    });
  };

  const groupedCalls = groupCallsByDate(data);

  const sortedGroupedCalls = sortKeys(Object.keys(groupedCalls)).reduce(
    (acc, date) => {
      acc[date] = groupedCalls[date].sort(
        (a, b) =>
          new Date(b.variable_start_stamp) - new Date(a.variable_start_stamp)
      );
      return acc;
    },
    {}
  );

  async function onCall(callDetails, mode) {
    // e.preventDefault();

    if (!isMicOn) {
      toast.warn("Please turn on microphone");
      return;
    }
    if (mode === "video") {
      if (!isVideoOn) {
        toast.warn("Please turn on video");
        return;
      }
    }
    // setCallNow(false);
    if (extension == "") {
      toast.error("No extension assigned to your account");
      return;
    }
    const otherPartyExtension =
      callDetails?.["Caller-Callee-ID-Number"] == extension
        ? callDetails?.["Caller-Caller-ID-Number"]
        : callDetails?.["Caller-Callee-ID-Number"];

    if (otherPartyExtension === extension) {
      toast.error("You can't call yourself");
      return;
    }
    const apiData = await sessionManager?.call(
      // `sip:${otherPartyExtension}@ucaas.webvio.in`,
      `sip:${otherPartyExtension}@${process.env.REACT_APP_BACKEND_IP}`,
      {
        earlyMedia: true,
        inviteWithSdp: true,
        sessionDescriptionHandlerOptions: {
          constraints: {
            audio: true,
            video: mode === "video" ? true : false,
          },
        },
      },
      {
        media: {
          audio: true,
          video:
            mode === "audio"
              ? true
              : {
                mandatory: {
                  minWidth: 1280,
                  minHeight: 720,
                  minFrameRate: 30,
                },
                optional: [{ facingMode: "user" }],
              },
        },
      }
    );

    const sdh = apiData.sessionDescriptionHandler;

    // Check if remoteMediaStream is available
    if (sdh && sdh._remoteMediaStream) {
      const remoteStream = sdh._remoteMediaStream;

      // Listen for tracks being added to the remote stream
      remoteStream.onaddtrack = () => {
        playRemoteStream(remoteStream);
      };

      // If tracks are already present, attach immediately
      if (remoteStream.getTracks().length > 0) {
        playRemoteStream(remoteStream);
      }
    }

    // Function to play the remote stream
    function playRemoteStream(stream) {
      const audioElement = document.createElement("audio");
      audioElement.srcObject = stream;
      audioElement.autoplay = true;

      audioElement.play().catch((e) => {
        console.error("Error playing early media stream:", e);
      });
    }
    setSelectedModule("onGoingCall");

    dispatch({
      type: "SET_SESSIONS",
      sessions: [
        ...sessions,
        {
          id: apiData._id,
          destination: Number(otherPartyExtension),
          state: "Established",
          mode: mode,
        },
      ],
    });
    dispatch({
      type: "SET_VIDEOCALL",
      videoCall: mode === "video" ? true : false,
    });
    dispatch({
      type: "SET_CALLPROGRESSID",
      callProgressId: apiData._id,
    });
    dispatch({
      type: "SET_CALLPROGRESSDESTINATION",
      callProgressDestination: Number(otherPartyExtension),
    });
    dispatch({
      type: "SET_CALLPROGRESS",
      callProgress: mode === "video" ? false : true,
    });
  }

  useEffect(() => {
    if (selectedModule === "onGoingCall") {
      if (videoCall) {
        dispatch({
          type: "SET_MINIMIZE",
          minimize: false,
        });
      } else {
        dispatch({
          type: "SET_MINIMIZE",
          minimize: true,
        });
      }
    } else {
      dispatch({
        type: "SET_MINIMIZE",
        minimize: true,
      });
    }
  }, [selectedModule, videoCall]);

  const handleRefresh = () => {
    setIsCallLoading(true)
    dispatch({ type: "SET_CALLREFRESH", refreshCalls: refreshCalls + 1 })
  }
  return (
    <>
      {/* <SideNavbarApp /> */}
      {allLogOut && (
        <LogOutPopUp setAllLogOut={setAllLogOut} handleLogOut={handleLogOut} />
      )}
      <main
        className="mainContentApp"
        style={{
          marginRight:
            sessions.length > 0 && Object.keys(sessions).length > 0
              ? "250px"
              : "0",
        }}
      >
        <section className="callPage">
          <div className=" ps-xl-0 stickyHeader">
            <HeaderApp
              title={"Calls"}
              loading={isCallLoading}
              setLoading={setIsCallLoading}
              refreshApi={handleRefresh}
            />
          </div>
          <div className="container-fluid">
            <div className="row webrtc_newMessageUi">

              <div className="allCallHistory pb-0 col-12 col-xl-4 col-lg-5 col-xxl-3 py-3 px-0 rounded-3 calcsHeight" style={{ overflow: "hidden" }}>
                <div className="col-auto" style={{ padding: "0 10px" }}>
                  <h5 className="viewingAs">
                    Viewing As:
                    {account && extension ? (
                      <span>
                        {account?.username} - {account && extension}
                      </span>
                    ) : (
                      <span className="text-danger">No Extension Assigned</span>
                    )}
                  </h5>
                </div>
                <div className="col-auto" style={{ padding: "0 10px" }}>
                  <button
                    className="clearColorButton dark"
                    onClick={() => setDialpadShow(!dialpadShow)}
                  >
                    <i className="fa-light fa-mobile-retro" /> Dial Number
                  </button>
                </div>
                <div className="col-12" style={{ padding: "0 10px" }}>
                  <div className="row">
                    <div className="col-12 mb-2">
                      <div className="d-flex justify-content-between">
                        <div className="w-100">
                          <label className="formLabel text-start mb-0 w-100">
                            Date Filter
                          </label>
                          <select
                            className="formItem "
                            value={filterBy}
                            onChange={(e) => {
                              setFilterBy(e.target.value);
                              setStartDateFlag("");
                              setEndDateFlag("");
                            }}
                            style={{
                              background: "var(--searchBg)",
                              borderColor: "var(--me-border1)",
                              borderRadius: "5px",
                            }}
                          >
                            <option value={"date"}>Only Date</option>
                            <option value={"date_range"}>Date Range</option>
                          </select>
                        </div>
                        <div className="d-flex w-100">
                          {filterBy === "date" && (
                            <div className="ms-2 w-100">
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
                                  // setPageNumber(1);
                                }}
                                style={{
                                  background: "var(--searchBg)",
                                  borderColor: "var(--me-border1)",
                                  borderRadius: "5px",
                                }}
                              />
                            </div>
                          )}
                          {filterBy === "date_range" && (
                            <>
                              <div className="mx-2 w-100">
                                <label className="formLabel text-start mb-0 w-100">
                                  From
                                </label>
                                <input
                                  type="date"
                                  className="formItem searchStyle"
                                  max={new Date().toISOString().split("T")[0]}
                                  value={startDateFlag}
                                  onChange={(e) => {
                                    setStartDateFlag(e.target.value);
                                    // setPageNumber(1);
                                  }}
                                  style={{
                                    background: "var(--searchBg)",
                                    // borderColor: "var(--border-color)",
                                    borderRadius: "5px",
                                  }}
                                />
                              </div>
                              <div className="w-100">
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
                                    // setPageNumber(1);
                                  }}
                                  min={startDateFlag} // Prevent selecting an end date before the start date
                                  style={{
                                    background: "var(--searchBg)",
                                    borderColor: "var(--border-color)",
                                    borderRadius: "5px",
                                  }}
                                />
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="col-12 pe-2 mt-auto">
                      <input
                        type="search"
                        name="Search"
                        id="headerSearch"
                        className="searchStyle"
                        placeholder="Search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="col-12">
                  {/* <nav className="mt-3">
                    <div
                      className="nav nav-tabs"
                      style={{ borderBottom: "1px solid var(--border-color)" }}
                    >
                    </div>
                  </nav> */}
                  <div className="tab-content">
                    <div
                      className="callList"
                      ref={callListRef}
                      onScroll={handleScroll}
                      onClick={() => setSelectedModule("callDetails")}
                    >
                      {loading ? (
                        <ContentLoader />
                      ) : Object.keys(groupedCalls).length > 0 ? (
                        sortKeys(Object.keys(groupedCalls)).map((date, key) => (
                          <div key={key}>
                            <div key={date} className="dateHeader" >
                              <p>{date}</p>
                            </div>
                            {sortedGroupedCalls[date].map(renderCallItem)}
                          </div>
                        ))
                      ) : (
                        <div className="startAJob">
                          <div className="text-center mt-3">
                            <img
                              src={require("../../assets/images/empty-box.png")}
                              alt="Empty"
                            ></img>
                            <div>
                              <h5>
                                No{" "}
                                <span>
                                  <b>
                                    {clickStatus === "all"
                                      ? "calls"
                                      : clickStatus}
                                  </b>
                                </span>{" "}
                                {clickStatus != "all" ? "calls" : ""} available.
                              </h5>
                              <h5>
                                Please start a <b>call</b> to see them here.
                              </h5>
                            </div>
                          </div>
                        </div>
                      )}
                      {isCallLoading ? (
                        <>
                          {/* <div className="text-center">
                            <i
                              className={
                                isCallLoading
                                  ? "fa-regular fa-arrows-rotate fs-5 fa-spin"
                                  : "fa-regular fa-arrows-rotate fs-5 "
                              }
                              style={{ color: "var(--webUtilGray)" }}
                            ></i>
                          </div> */}
                        </>
                      ) : (
                        <div ref={targetRef}></div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="callDetails col-12 col-xl-8 col-lg-7 col-xxl-9 callDetails newVoicemailBoxUi pe-0 eFaxCompose"
                style={{ height: "calc(100vh - 100px)" }}
                id="callDetails"
              >
                <CallDetails
                  clickedCall={clickedCall}
                  callHistory={callHistory}
                  isCustomerAdmin={isCustomerAdmin}
                  setSelectedModule={setSelectedModule}
                  isMicOn={isMicOn}
                  isVideoOn={isVideoOn}
                  onCall={onCall}
                  setactivePage={setactivePage}
                  setExtensionFromCdrMessage={setExtensionFromCdrMessage}
                  allContact={allContact}
                />
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Comment section start */}
      {selectedCdr !== "" &&
        <Comments
          id={selectedCdr}
          setId={setSelectedCdr}
          setShowComment={setShowComment}
        />
      }
      {/* Comment section end */}
      {dialpadShow ? (
        <Dialpad
          hideDialpad={handleHideDialpad}
          setSelectedModule={setSelectedModule}
          isMicOn={isMicOn}
          isVideoOn={isVideoOn}
          allContact={allContact}
        />
      ) : (
        ""
      )}
      {addContactToggle && (
        <AddNewContactPopup setAddContactToggle={setAddContactToggle} />
      )}
    </>
  );
}

export default Call;
