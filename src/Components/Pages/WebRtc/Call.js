/* eslint-disable eqeqeq */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import Dialpad from "./Dialpad";
import CallDetails from "./CallDetails";
import OngoingCall from "./OngoingCall";
import { useDispatch, useSelector } from "react-redux";
import AddNewContactPopup from "./AddNewContactPopup";
import { useNavigate } from "react-router-dom";
import ContentLoader from "../../Loader/ContentLoader";
import { toast } from "react-toastify";
import { useSIPProvider } from "react-sipjs";
import VideoCall from "./VideoCall";

function Call({
  setHangupRefresh,
  hangupRefresh,
  selectedModule,
  setSelectedModule,
  isCustomerAdmin,
  isMicOn,
  isVideoOn,
  activePage,
}) {
  const dispatch = useDispatch();
  const sessions = useSelector((state) => state.sessions);
  const allCall = useSelector((state) => state.allCall);
  const callDetailsRefresh = useSelector((state) => state.callDetailsRefresh);
  const [dialpadShow, setDialpadShow] = useState(false);
  const [clickStatus, setClickStatus] = useState("all");
  const callProgress = useSelector((state) => state.callProgress);
  const videoCall = useSelector((state) => state.videoCall);
  const callProgressId = useSelector((state) => state.callProgressId);
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
  const callProgressDestination = useSelector(
    (state) => state.callProgressDestination
  );
  const [clickedExtension, setClickedExtension] = useState(null);

  function handleHideDialpad(value) {
    setDialpadShow(value);
  }
  useEffect(() => {
    if (allCall && allCall.calls) {
      const apiData = allCall;
      setAllApiData(apiData.calls.reverse());

      const uniqueArray = [
        ...new Map(
          apiData.calls
            .filter((item) => {
              // Apply the filter condition if 'applyFilter' is true
              if (!isCustomerAdmin) {
                return (
                  item["Caller-Callee-ID-Number"] === extension ||
                  item["Caller-Caller-ID-Number"] === extension
                );
              }
              // If applyFilter is false, return all items
              return true;
            })
            .reverse()
            .map((item) => [item, item])
        ).values(),
      ];

      setAllCalls(uniqueArray.reverse());
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allCall, isCustomerAdmin, refreshCalls]);

  useEffect(() => {
    console.log("This is account", account && account.account_id);

    setLoading(true);
    if (account && account.account_id) {
      dispatch({
        type: "SET_CALLDETAILSREFRESH",
        callDetailsRefresh: callDetailsRefresh + 1,
      });
    } else {
      navigate("/");
    }
  }, [account, navigate, hangupRefresh, refreshCalls]);

  // user data filter based on the extension
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
        filteredCalls = allCalls;
        break;
    }
    // search functionality
    if (searchQuery) {
      const lowerCaseSearchQuery = searchQuery.toLowerCase();
      filteredCalls = filteredCalls.filter((call) => {
        return (
          call.caller_user?.username
            ?.toLowerCase()
            .includes(lowerCaseSearchQuery) ||
          call["Caller-Callee-ID-Number"]
            .toString()
            .toLowerCase()
            .includes(lowerCaseSearchQuery)
        );
      });
    }
    setPreviewCalls(filteredCalls);
    if (clickedCall == null) {
      setClickedCall(filteredCalls[0]);
    }
    if (filteredCalls[0]) {
      setClickedExtension(
        filteredCalls[0]["Caller-Callee-ID-Number"] === extension
          ? filteredCalls[0]["Caller-Caller-ID-Number"]
          : filteredCalls[0]["Caller-Callee-ID-Number"]
      );
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
  }, [allCalls, clickStatus, searchQuery]);

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

  const renderCallItem = (item) => (
    <div
      key={item.id}
      onClick={() => handleCallItemClick(item)}
      onDoubleClick={() => handleDoubleClickCall(item)}
      className={`callListItem ${item["Caller-Callee-ID-Number"] === extension &&
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
            <div className="col-4 my-auto ms-2 ms-xl-3" style={{ cursor: "pointer" }}>
              <h4>{item.caller_user ? item.caller_user.username : "USER XYZ"}</h4>
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
            <div className="col-4 my-auto ms-2 ms-xl-5" style={{ cursor: "pointer" }}>
              <h4>
                {item["Caller-Callee-ID-Number"]}
                ==<i class="fa-solid fa-angles-right"></i>
                {item["Caller-Caller-ID-Number"]}
              </h4>
              {/* <div className="contactTags">
                <span data-id="2">Call, {formatTime(item["variable_billsec"])}</span>
              </div> */}
            </div>
          )}

          {item["variable_billsec"] > 0 && <div className="col-3 mx-auto">
            <div className="contactTags">
              <span data-id="2">Duration: {formatTime(item["variable_billsec"])}</span>
            </div>
          </div>}

          <div className="col-1 text-end ms-auto">
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
  useEffect(() => {
    if (clickedExtension) {
      const filteredHistory = allApiData.filter((item) => {
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

  const groupedCalls = groupCallsByDate(previewCalls);

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
    console.log("otherPartyExtension", otherPartyExtension);
    if (otherPartyExtension === extension) {
      toast.error("You can't call yourself");
      return;
    }
    const apiData = await sessionManager?.call(
      `sip:${otherPartyExtension}@192.168.2.225`,
      {
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

  console.log("call status", callProgress, videoCall);

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
    <div className="browserPhoneWrapper">
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
                  <div className="col-auto" style={{ padding: '0 10px' }}>
                    <h3 style={{ fontFamily: "Outfit", marginBottom: '0' }}>
                      <button class="clearButton text-dark"><i class="fa-solid fa-chevron-left fs-4"></i></button> Calls{" "}
                      <button class="clearButton" onClick={() => setRefreshCalls(refreshCalls + 1)}>
                        <i
                          class={loading ? "fa-regular fa-arrows-rotate fs-5 fa-spin" : "fa-regular fa-arrows-rotate fs-5 "}
                          style={{ color: "rgb(148, 148, 148)" }}
                        ></i>
                      </button>
                    </h3>
                  </div>
                  <div className="d-flex justify-content-end align-items-center">
                    <div className="col-9">
                      <input type="search" name="Search" placeholder="Search users, groups or chat" class="formItem fw-normal" style={{ backgroundColor: '#f5f5f5' }} />
                    </div>
                    <div className="col-auto mx-2">
                      <button
                        className="clearButton2 xl"
                        effect="ripple"
                      >
                        <i className="fa-regular fa-bell" />
                      </button>
                    </div>
                    <div className="col-auto">
                      <div className="myProfileWidget">
                        <div class="profileHolder" id="profileOnlineNav">
                          <img src="https://buffer.com/cdn-cgi/image/w=1000,fit=contain,q=90,f=auto/library/content/images/size/w1200/2023/10/free-images.jpg" alt="profile" />
                        </div>
                        <div class="profileName">{account.username} <span className="status">Available</span></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-12 col-xl-6 col-xxl-5 allCallHistory">
                <div className="col-auto" style={{ padding: '0 10px' }}>
                  <h5 className="viewingAs">
                    Viewing As:
                    <span>
                      {account && extension ? (
                        <span>
                          {account.username} - {account && extension}
                        </span>
                      ) : (
                        <span className="text-danger">
                          No Extension Assigned
                        </span>
                      )}
                    </span>
                  </h5>
                </div>
                <div className="col-auto" style={{ padding: '0 10px' }}>
                  <button className="clearColorButton dark" onClick={() => setDialpadShow(!dialpadShow)}>
                    <i className="fa-light fa-mobile-retro" /> Dial
                  </button>
                </div>
                <div className="col-12 mt-3" style={{ padding: '0 10px' }}>
                  <input
                    type="search"
                    name="Search"
                    id="headerSearch"
                    placeholder="Search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
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
                    <div className="nav nav-tabs" style={{ borderBottom: '1px solid #ddd' }}>
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
                      onClick={() => setSelectedModule("callDetails")}
                    >
                      {loading &&
                        (callDetailsRefresh == 0 ||
                          callDetailsRefresh == 1 ||
                          callDetailsRefresh == 2) ? (
                        <ContentLoader />
                      ) : Object.keys(groupedCalls).length > 0 ? (
                        sortKeys(Object.keys(groupedCalls)).map((date) => (
                          <>
                            <div
                              key={date}
                              className="dateHeader"
                            >
                              <p>{date}</p>
                            </div>
                            {sortedGroupedCalls[date].map(renderCallItem)}
                          </>
                        ))
                      ) : (
                        <h3 className="text-center pt-10">
                          No {clickStatus} calls
                        </h3>
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
                {selectedModule == "onGoingCall" ? (
                  callProgress ? (
                    <OngoingCall
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
                    />
                  )
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      {/* {console.log("this is session", sessions)} */}
      {/* {sessions.length > 0 && Object.keys(sessions).length > 0 ? (
        <>
          <section
            className="activeCallsSidePanel"
            onClick={() => setSelectedModule("onGoingCall")}
          >
            <div className="container">
              <div className="row">
                {sessions.length > 0 &&
                  sessions.map((session, chennel) => (
                    <ActiveCallSidePanel
                      key={chennel}
                      sessionId={session.id}
                      destination={session.destination}
                      chennel={chennel}
                      setHangupRefresh={setHangupRefresh}
                      hangupRefresh={hangupRefresh}
                      setSelectedModule={setSelectedModule}
                    />
                  ))}
              </div>
            </div>
          </section>
        </>
      ) : (
        ""
      )} */}
      {/* <IncomingCallPopup /> */}
      {/* <IncomingCalls setSelectedModule={setSelectedModule} /> */}
      {dialpadShow ? (
        <Dialpad
          hideDialpad={handleHideDialpad}
          setSelectedModule={setSelectedModule}
          isMicOn={isMicOn}
          isVideoOn={isVideoOn}
        />
      ) : (
        ""
      )}
      {addContactToggle && (
        <AddNewContactPopup setAddContactToggle={setAddContactToggle} />
      )}
    </div>
  );
}

export default Call;

// 1. Add option to share screen when user is on video call
// 2. Ask userpermission to shear different screen like entire screen, any specific tab of browser, or any specific window
// 3. During screen shearing add option to toggle between screen shearing and video shearing
// 4. Add DTMF options on video call page
