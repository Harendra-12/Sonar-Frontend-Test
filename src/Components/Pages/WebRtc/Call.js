import React, { useEffect, useState } from "react";
import Dialpad from "./Dialpad";
import { SIPProvider } from "react-sipjs";
import { SipRegister } from "./SipRegister";
import ActiveCallSidePanel from "./ActiveCallSidePanel";
import IncomingCallPopup from "./IncomingCallPopup";
import SideNavbarApp from "./SideNavbarApp";
import CallDetails from "./CallDetails";
import OngoingCall from "./OngoingCall";
import { useDispatch, useSelector } from "react-redux";
import IncomingCalls from "./IncomingCalls";
import AddNewContactPopup from "./AddNewContactPopup";
import { generalGetFunction } from "../../GlobalFunction/globalFunction";
import { useNavigate } from "react-router-dom";
import ContentLoader from "../../Loader/ContentLoader";

function Call({
  setHangupRefresh,
  hangupRefresh,
  selectedModule,
  setSelectedModule,
  isCustomerAdmin,
}) {
  const dispatch = useDispatch();
  const sessions = useSelector((state) => state.sessions);
  const allCall = useSelector((state) => state.allCall);
  const callDetailsRefresh = useSelector((state) => state.callDetailsRefresh);
  const [dialpadShow, setDialpadShow] = useState(false);
  const [clickStatus, setClickStatus] = useState("all");
  const callProgress = useSelector((state) => state.callProgress);
  const callProgressId = useSelector((state) => state.callProgressId);
  const navigate = useNavigate();
  const account = useSelector((state) => state.account);
  const [allCalls, setAllCalls] = useState([]);
  const extension = account?.extension?.extension || "";
  // const [hangupRefresh, setHangupRefresh] = useState(0);
  const [callNow, setCallNow] = useState(false);
  const [previewCalls, setPreviewCalls] = useState([]);
  const [addContactToggle, setAddContactToggle] = useState(false);
  const [clickedCall, setClickedCall] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [allApiData, setAllApiData] = useState([]);
  const [callHistory, setCallHistory] = useState([]);
  // const [selectedModule, setSelectedModule] = useState("");
  const callProgressDestination = useSelector(
    (state) => state.callProgressDestination
  );
  const [clickedExtension, setClickedExtension] = useState(null);

  function handleHideDialpad(value) {
    setDialpadShow(value);
  }

  // const useWebSocketErrorHandling = (options) => {
  //   useEffect(() => {
  //     const webSocket = new WebSocket(options.webSocketServer);

  //     webSocket.onerror = (event) => {
  //       console.error("WebSocket error:", event);
  //       // Prevent default error handling
  //       event.preventDefault();
  //     };

  //     webSocket.onclose = (event) => {
  //       if (event.code === 1006) {
  //         console.error(
  //           `WebSocket closed ${options.webSocketServer} (code: ${event.code})`
  //         );
  //         // Handle the WebSocket close event
  //       }
  //     };
  //     console.log(global);
  //     return () => {
  //       webSocket.close();
  //     };
  //   }, [options.webSocketServer]);
  // };

  // useEffect(() => {
  //   if (allCall && allCall.calls) {
  //     const apiData = allCall;
  //     setAllApiData(apiData.calls.reverse());

  //     const uniqueArray = [
  //       ...new Map(
  //         apiData.calls
  //           .filter(
  //             (item) =>
  //               item["Caller-Callee-ID-Number"] ===
  //                 extension ||
  //               item["Caller-Caller-ID-Number"] ===
  //                 extension
  //           )
  //           .reverse()
  //           .map((item) => [
  //             // item["Caller-Callee-ID-Number"],
  //             //   item["Caller-Caller-ID-Number"],
  //             // item["Hangup-Cause"] &&
  //             // item["variable_start_stamp"] &&
  //             // item["variable_billsec"],
  //             item,
  //             item,
  //           ])
  //       ).values(),
  //     ];
  //     setAllCalls(uniqueArray.reverse());

  //     setLoading(false);
  //   }
  // }, [allCall]);
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
      console.log(uniqueArray);

      setAllCalls(uniqueArray.reverse());
      setLoading(false);
    }
  }, [allCall, isCustomerAdmin]);

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
  }, [account, navigate, hangupRefresh]);

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
      `${hour ? hour + " hr" : ""}${min ? min + " min" : ""}${
        sec ? sec + " sec" : ""
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
    setCallNow(true);
  };

  const renderCallItem = (item) => (
    <div
      key={item.id}
      onClick={() => handleCallItemClick(item)}
      onDoubleClick={() => handleDoubleClickCall(item)}
      className={`callListItem ${
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
      style={{
        backgroundColor:
          clickedCall && clickedCall.id === item.id ? "#d7eeefcf" : "",
      }}
    >
      <div className="row justify-content-between">
        {!isCustomerAdmin ? (
          <div className="col-8 ms-4 text-start" style={{ cursor: "pointer" }}>
            <h4>
              {item["Caller-Callee-ID-Number"] === extension
                ? item["Caller-Caller-ID-Number"]
                : item["Caller-Callee-ID-Number"]}
            </h4>
            <h5>{item.caller_user ? item.caller_user.username : "USER XYZ"}</h5>
            <h6>Call, {formatTime(item["variable_billsec"])}</h6>
          </div>
        ) : (
          <div className="col-8 ms-4 text-start" style={{ cursor: "pointer" }}>
            <h4>
              {item["Caller-Callee-ID-Number"]}
              ==<i class="fa-solid fa-angles-right"></i>
              {item["Caller-Caller-ID-Number"]}
            </h4>
            <h6 className="mt-2">
              Call, {formatTime(item["variable_billsec"])}
            </h6>
          </div>
        )}

        <div className="col-3 text-end">
          <h5>
            {new Date(item.variable_start_stamp)
              .toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              })
              .replace(" AM", "am")
              .replace(" PM", "pm")}
          </h5>
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

  // const options = {
  //   domain: account.domain.domain_name,
  //   webSocketServer: "ws://192.168.2.225:5066",
  //   // domain: "192.168.0.91",
  //   // domain: "webvio.1.com",
  //   // webSocketServer: "ws://192.168.0.91:5066",
  // };

  // useWebSocketErrorHandling(options);
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
              <div
                className="col-12 col-xl-6 allCallHistory"
                // style={{ height: "100%" }}
              >
                <div className="col-12 webRtcHeading">
                  <div className="col-2">
                    <h3 style={{ fontFamily: "Outfit", color: "#444444" }}>
                      Calls
                    </h3>
                  </div>
                  <div className="col-5">
                    <h5
                      style={{
                        fontFamily: "Outfit",
                        color: "#444444",
                        marginBottom: "0",
                      }}
                    >
                      Extension - {account && extension}
                    </h5>
                  </div>
                  <div className="col-5 d-flex justify-content-end">
                    <div className="col-auto">
                      <button
                        className="appPanelButton"
                        effect="ripple"
                        onClick={() => setDialpadShow(!dialpadShow)}
                      >
                        <i className="fa-light fa-mobile-retro" />
                      </button>
                    </div>
                    <div className="col-auto  position-relative">
                      <button className="appPanelButton" effect="ripple">
                        <i className="fa-light fa-satellite-dish" />
                      </button>
                      {/* <div>
                        <SipRegister />
                      </div> */}
                    </div>
                  </div>
                </div>

                <div className="col-12">
                  <nav>
                    <div className="nav nav-tabs">
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
                      <button
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
                      </button>
                    </div>
                  </nav>
                  <div className="tab-content">
                    <div className="position-relative searchBox d-flex mt-3">
                      <input
                        type="search"
                        name="Search"
                        id="headerSearch"
                        placeholder="Search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                      <button
                        className="ms-2 me-0 appPanelButton"
                        effect="ripple"
                        onClick={() => setAddContactToggle(true)}
                      >
                        <i className="fa-light fa-user-plus" />
                      </button>
                    </div>
                    {/* <div className="callList">
                        <div className="text-center callListItem">
                          <h5 className="fw-semibold">Today</h5>
                          {previewCalls.length > 0 ? (
                            previewCalls.map(renderCallItem)
                          ) : (
                            <h3>No {clickStatus} calls</h3>
                          )}
                        </div>
                      </div> */}

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
                              className="text-center callListItem"
                            >
                              <h5 className="fw-semibold">{date}</h5>
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
                className="col-12 callDetails col-xl-6"
                style={{ height: "100vh" }}
                id="callDetails"
              >
                {selectedModule == "onGoingCall"
                  ? callProgress && (
                      <OngoingCall
                        key={callProgressId}
                        id={callProgressId}
                        destination={callProgressDestination}
                        setHangupRefresh={setHangupRefresh}
                        hangupRefresh={hangupRefresh}
                        setSelectedModule={setSelectedModule}
                      />
                    )
                  : clickedCall && (
                      <CallDetails
                        clickedCall={clickedCall}
                        callHistory={callHistory}
                        isCustomerAdmin={isCustomerAdmin}
                        setCallNow={setCallNow}
                        callNow={callNow}
                        setSelectedModule={setSelectedModule}
                      />
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
