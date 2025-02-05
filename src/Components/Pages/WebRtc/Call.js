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
import { useSIPProvider } from "react-sipjs";
import {
  featureUnderdevelopment,
  generalGetFunction,
} from "../../GlobalFunction/globalFunction";
import DarkModeToggle from "../../CommonComponents/DarkModeToggle";

function Call({
  selectedModule,
  setSelectedModule,
  isCustomerAdmin,
  isMicOn,
  isVideoOn,
  setactivePage,
  allContact,
  setExtensionFromCdrMessage,
}) {
  const dispatch = useDispatch();
  const sessions = useSelector((state) => state.sessions);
  const [dialpadShow, setDialpadShow] = useState(false);
  const [clickStatus, setClickStatus] = useState("all");
  const videoCall = useSelector((state) => state.videoCall);
  const navigate = useNavigate();
  const account = useSelector((state) => state.account);
  const [allCalls, setAllCalls] = useState([]);
  const extension = account?.extension?.extension || "";
  const [previewCalls, setPreviewCalls] = useState([]);
  const [addContactToggle, setAddContactToggle] = useState(false);
  const [clickedCall, setClickedCall] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [allApiData, setAllApiData] = useState([]);
  const [mode, setMode] = useState("audio");
  const [callHistory, setCallHistory] = useState([]);
  const { sessionManager, connectStatus } = useSIPProvider();
  const [refreshCalls, setRefreshCalls] = useState(0);
  const [clickedExtension, setClickedExtension] = useState(null);
  const targetRef = useRef(null); // Reference to the target div
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [rawData, setRawData] = useState([]);
  const [filterBy, setFilterBy] = useState("date");
  const [startDateFlag, setStartDateFlag] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDateFlag, setEndDateFlag] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filterState, setfilterState] = useState("all");
  const [firstTimeClickedExtension, setFirstTimeClickedExtension] =
    useState(false);

  console.log(startDate, endDate);
  useEffect(() => {
    async function fetchData() {
      if (currentPage === 1) {
        setLoading(true);
      } else {
        setIsLoading(true);
      }
      const basePaths = {
        all: "/call-details-phone",
        incoming: "/cdr/inbound",
        outgoing: "/cdr/outbound",
        missed: "/cdr/missed",
      };
      const basePath = basePaths[clickStatus] || "";
      if (basePath) {
        const dateParam =
          filterBy === "date"
            ? `date=${startDate}`
            : `date_range=${startDate},${endDate}`;
        const url = `${basePath}?page=${currentPage}&${dateParam}&search=${searchQuery}`;
        const apiData = await generalGetFunction(url);

        if (apiData.status) {
          console.log(apiData);
          setAllApiData(apiData.data.data?.reverse());
          const result = apiData.data.data?.reverse() || [];
          setRawData(apiData.data);
          setData([...data, ...result]);
          setLoading(false);
          setIsLoading(false);
        } else {
          setLoading(false);
          setIsLoading(false);
        }
      }
    }
    fetchData();
  }, [currentPage, startDate, endDate, searchQuery, clickStatus, filterBy,refreshCalls]);

  const callListRef = useRef(null);
  const handleScroll = () => {
    const div = callListRef.current;
    if (div.scrollTop + div.clientHeight >= div.scrollHeight) {

      console.log(rawData.current_page, rawData?.last_page, rawData);
      if (!isLoading && rawData.current_page !== rawData?.last_page) {
        setCurrentPage(currentPage + 1);
      }
    }
  };

  function handleHideDialpad(value) {
    setDialpadShow(value);
  }
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
      filteredCalls[0] &&
      allApiData.filter((item) => {
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
  console.log(clickedExtension);
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
      : item["Caller-Callee-ID-Number"] === extension
        ? item["Caller-Caller-ID-Number"]
        : item["Caller-Callee-ID-Number"];

    const matchingCalleeContactForAdmin = allContact.find(
      (contact) => contact.did === item["Caller-Callee-ID-Number"]
    )?.name;

    const matchingCallerContactForAdmin = allContact.find(
      (contact) => contact.did === item["Caller-Caller-ID-Number"]
    )?.name;
    return (
      <div
        key={item.id}
        onClick={() => handleCallItemClick(item)}
        onDoubleClick={() => handleDoubleClickCall(item)}
        className={`callListItem ${item["Caller-Callee-ID-Number"] === extension &&
            item["variable_billsec"] > 0 &&
            !isCustomerAdmin
            ? "incoming"
            : item["Caller-Caller-ID-Number"] === extension && !isCustomerAdmin
              ? "outgoing"
              : item["Caller-Callee-ID-Number"] === extension &&
                item["variable_billsec"] === 0 &&
                !isCustomerAdmin
                ? "missed"
                : item["Call-Direction"] === "voicemail" && !isCustomerAdmin
                  ? "voicemail"
                  : ""
          } ${clickedCall && clickedCall.id === item.id ? "selected" : ""}`}
      >
        <div className="row justify-content-between">
          <div className="col-xl-12 d-flex">
            <div
              className="profileHolder"
            // id={"profileOfflineNav"}
            >
              <i className="fa-light fa-user fs-5"></i>
            </div>
            {!isCustomerAdmin ? (
              <div
                className="col-4 my-auto ms-2 ms-xl-3"
                style={{ cursor: "pointer" }}
              >
                <h4>
                  {displayName
                    ? displayName
                    : item.caller_user
                      ? item.caller_user.username
                      : "USER XYZ"}
                </h4>
                <h5 style={{ paddingLeft: 20 }}>
                  {item["Caller-Callee-ID-Number"] === extension
                    ? item["Caller-Caller-ID-Number"]
                    : item["Caller-Callee-ID-Number"]}
                </h5>
                {/* <div className="contactTags">
                  <span data-id="2">Call, {formatTime(item["variable_billsec"])}</span>
                </div> */}
              </div>
            ) : (
              <div
                className="col-5 my-auto ms-2 ms-xl-5"
                style={{ cursor: "pointer" }}
              >
                <h4>
                  {matchingCalleeContactForAdmin
                    ? `${matchingCalleeContactForAdmin} (${item["Caller-Callee-ID-Number"]})`
                    : item["Caller-Callee-ID-Number"]}
                  {item["variable_billsec"] > 0 ? (
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
                  {matchingCallerContactForAdmin
                    ? `${matchingCallerContactForAdmin} (${item["Caller-Caller-ID-Number"]})`
                    : item["Caller-Caller-ID-Number"]}
                </h4>
                {/* <div className="contactTags">
                  <span data-id="2">Call, {formatTime(item["variable_billsec"])}</span>
                </div> */}
              </div>
            )}

            {item["variable_billsec"] > 0 && (
              <div
                className={`col-3 mx-auto ${isCustomerAdmin ? "my-auto" : ""}`}
              >
                <div className="contactTags">
                  <span data-id="2" className="duration">
                    Duration: {formatTime(item["variable_billsec"])}
                  </span>
                </div>
              </div>
            )}

            <div className="col-auto text-end ms-auto">
              <p className="timeAgo">
                {new Date(item.variable_start_stamp)
                  .toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })
                  .replace(" AM", "am")
                  .replace(" PM", "pm")}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  useEffect(() => {
    if (clickedExtension) {
      const filteredHistory = data.filter((item) => {
        if (!isCustomerAdmin) {
          console.log(
            extension,
            clickedExtension,
            item["Caller-Callee-ID-Number"],
            item["Caller-Caller-ID-Number"]
          );
          return (
            (item["Caller-Callee-ID-Number"] === extension &&
              item["Caller-Caller-ID-Number"] === clickedExtension) ||
            (item["Caller-Caller-ID-Number"] === extension &&
              item["Caller-Callee-ID-Number"] === clickedExtension)
          );
        }
        return item["Caller-Callee-ID-Number"] === clickedExtension;
      });

      console.log("filteredHistory", filteredHistory);
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
        console.log("Remote track added:", remoteStream);
        playRemoteStream(remoteStream);
      };

      // If tracks are already present, attach immediately
      if (remoteStream.getTracks().length > 0) {
        console.log(
          "Remote stream tracks available immediately:",
          remoteStream
        );
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
  console.log("clickStatus", clickStatus);
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


  return (
    <>
      {/* <SideNavbarApp /> */}
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
          <div className="container-fluid">
            <div className="row">
              <div className="col-12 ps-xl-0">
                <div className="newHeader">
                  <div className="col-auto" style={{ padding: "0 10px" }}>
                    <h3 style={{ fontFamily: "Outfit", marginBottom: "0" }}>
                      Calls{" "}
                      <button
                        class="clearButton2"
                        onClick={() => {
                          if (!loading) {
                            setRefreshCalls(refreshCalls + 1);
                          }
                        }}
                      >
                        <i
                          class={
                            loading
                              ? "fa-regular fa-arrows-rotate fs-5 fa-spin"
                              : "fa-regular fa-arrows-rotate fs-5 "
                          }
                          style={{ color: "var(--webUtilGray)" }}
                        ></i>
                      </button>
                    </h3>
                  </div>
                  <div className="d-flex justify-content-end align-items-center">
                    <div className="col-9">
                      <input
                        type="search"
                        name="Search"
                        placeholder="Search users, groups or chat"
                        class="formItem fw-normal"
                        onChange={() => featureUnderdevelopment()}
                        style={{ backgroundColor: "var(--searchBg)" }}
                      />
                    </div>
                    <div className="col-auto ms-2">
                      <button
                        className="clearButton2 xl"
                        effect="ripple"
                        onClick={() => featureUnderdevelopment()}
                      >
                        <i className="fa-regular fa-bell" />
                      </button>
                    </div>
                    <DarkModeToggle marginLeft={"2"} />
                    <div className="col-auto">
                      <div class="dropdown">
                        <div
                          className="myProfileWidget"
                          type="button"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                          <div class="profileHolder" id="profileOnlineNav">
                            <img
                              src="https://buffer.com/cdn-cgi/image/w=1000,fit=contain,q=90,f=auto/library/content/images/size/w1200/2023/10/free-images.jpg"
                              alt="profile"
                            />
                          </div>
                          <div class="profileName">
                            {account?.username}{" "}
                            <span className="status">Available</span>
                          </div>
                        </div>
                        <ul class="dropdown-menu">
                        <li onClick={()=>{dispatch({type:"SET_LOGOUT",logout:1});sessionManager.disconnect()}}>
                            <div
                              class="dropdown-item"
                              style={{ cursor: "pointer" }}
                            >
                              Logout
                            </div>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-12 col-xl-6 col-xxl-5 allCallHistory">
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
                  <div className="d-flex">
                    <div className="col-xl-6 col-12 pe-2 mt-auto">
                      <input
                        type="search"
                        name="Search"
                        id="headerSearch"
                        placeholder="Search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <div className="col-xl-6 col-12">
                      <div className="d-flex justify-content-between">
                        <div className="">
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
                            style={{
                              background: "var(--searchBg)",
                              borderColor: "var(--border-color)",
                              borderRadius: "5px",
                            }}
                          >
                            <option value={"date"}>Only Date</option>
                            <option value={"date_range"}>Date Range</option>
                          </select>
                        </div>
                        <div className="d-flex">
                          {/* <div className="col-6 pe-2">
                          <input
                            type="date"
                            className="formItem"
                            style={{
                              background: "var(--searchBg)",
                              borderColor: "var(--border-color)",
                              borderRadius: "5px",
                            }}
                          />
                        </div>
                        <div className="col-6">
                          <input
                            type="date"
                            className="formItem"
                            style={{
                              background: "var(--searchBg)",
                              borderColor: "var(--border-color)",
                              borderRadius: "5px",
                            }}
                          />
                        </div> */}

                          {filterBy === "date" && (
                            <div className="ms-2">
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
                                  borderColor: "var(--border-color)",
                                  borderRadius: "5px",
                                }}
                              />
                            </div>
                          )}
                          {filterBy === "date_range" && (
                            <>
                              <div className="mx-2">
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
                                    // setPageNumber(1);
                                  }}
                                  style={{
                                    background: "var(--searchBg)",
                                    borderColor: "var(--border-color)",
                                    borderRadius: "5px",
                                  }}
                                />
                              </div>
                              <div className="">
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
                  </div>
                  {/* <button
                      className="ms-2 me-0 appPanelButton"
                      effect="ripple"
                      onClick={() => setAddContactToggle(true)}
                    >
                      <i className="fa-light fa-user-plus" />
                    </button> */}
                </div>
                {/* <div>
                        <SipRegister />
                      </div> */}

                <div className="col-12">
                  <nav className="mt-3">
                    <div
                      className="nav nav-tabs"
                      style={{ borderBottom: "1px solid var(--border-color)" }}
                    >
                      <button
                        onClick={() => setClickStatus("all")}
                        className={
                          clickStatus === "all" ? "tabLink active" : "tabLink"
                        }
                        data-category="all"
                      >
                        <i className="fa-light fa-phone" />
                      </button>
                      <button
                        onClick={() => setClickStatus("incoming")}
                        className={
                          clickStatus === "incoming"
                            ? "tabLink active"
                            : "tabLink"
                        }
                        effect="ripple"
                        data-category="incoming"
                      >
                        <i className="fa-light fa-phone-arrow-down-left" />
                      </button>
                      <button
                        onClick={() => setClickStatus("outgoing")}
                        className={
                          clickStatus === "outgoing"
                            ? "tabLink active"
                            : "tabLink"
                        }
                        effect="ripple"
                        data-category="outgoing"
                      >
                        <i className="fa-light fa-phone-arrow-up-right" />
                      </button>
                      <button
                        onClick={() => setClickStatus("missed")}
                        className={
                          clickStatus === "missed"
                            ? "tabLink active"
                            : "tabLink"
                        }
                        effect="ripple"
                        data-category="missed"
                      >
                        <i className="fa-light fa-phone-missed" />
                      </button>
                      {/* <button
                        onClick={() => setClickStatus("voicemail")}
                        className={
                          clickStatus === "voicemail"
                            ? "tabLink active"
                            : "tabLink"
                        }
                        effect="ripple"
                        data-category="voicemail"
                      >
                        <i className="fa-light fa-microphone-lines" />
                      </button> */}
                    </div>
                  </nav>
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
                        sortKeys(Object.keys(groupedCalls)).map((date) => (
                          <>
                            <div key={date} className="dateHeader">
                              <p>{date}</p>
                            </div>
                            {sortedGroupedCalls[date].map(renderCallItem)}
                          </>
                        ))
                      ) : (
                        <div className="startAJob">
                          <div class="text-center mt-3">
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
                      {isLoading ? (
                        <div className="text-center">
                          <i
                            class={
                              isLoading
                                ? "fa-regular fa-arrows-rotate fs-5 fa-spin"
                                : "fa-regular fa-arrows-rotate fs-5 "
                            }
                            style={{ color: "var(--webUtilGray)" }}
                          ></i>
                        </div>
                      ) : (
                        <div ref={targetRef}></div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="col-12 col-xl-6 col-xxl-7 callDetails"
                style={{ height: "calc(100vh - 65px)" }}
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
                {/* {selectedModule == "onGoingCall" ? (
                  callProgress ? (
                    <OngoingCall
                      setactivePage={setactivePage}
                      key={callProgressId}
                      id={callProgressId}
                      destination={callProgressDestination}
                      setHangupRefresh={setHangupRefresh}
                      hangupRefresh={hangupRefresh}
                      setSelectedModule={setSelectedModule}
                    />
                  ) : (
                    <CallDetails
                      clickedCall={clickedCall}
                      callHistory={callHistory}
                      isCustomerAdmin={isCustomerAdmin}
                      setSelectedModule={setSelectedModule}
                      isMicOn={isMicOn}
                      isVideoOn={isVideoOn}
                      onCall={onCall}
                      setactivePage={setactivePage}
                    />
                  )
                ) : (
                  clickedCall && (
                    <CallDetails
                      clickedCall={clickedCall}
                      callHistory={callHistory}
                      isCustomerAdmin={isCustomerAdmin}
                      setSelectedModule={setSelectedModule}
                      isMicOn={isMicOn}
                      isVideoOn={isVideoOn}
                      onCall={onCall}
                      setactivePage={setactivePage}
                    />
                  )
                )} */}
              </div>
            </div>
          </div>
        </section>
      </main>
      {/* <IncomingCallPopup /> */}
      {/* <IncomingCalls setSelectedModule={setSelectedModule} /> */}
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
