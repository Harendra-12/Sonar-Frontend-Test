import React, { useEffect, useState } from "react";
import Dialpad from "./Dialpad";
import { SIPProvider } from "react-sipjs";
import { SipRegister } from "./SipRegister";
import ActiveCallSidePanel from "./ActiveCallSidePanel";
import IncomingCallPopup from "./IncomingCallPopup";
import SideNavbarApp from "./SideNavbarApp";
import CallDetails from "./CallDetails";
import OngoingCall from "./OngoingCall";
import { useSelector } from "react-redux";
import IncomingCalls from "./IncomingCalls";
import AddNewContactPopup from "./AddNewContactPopup";
import { generalGetFunction } from "../../GlobalFunction/globalFunction";
import { useNavigate } from "react-router-dom";
import ContentLoader from "../../Loader/ContentLoader";

function Call() {
  const sessions = useSelector((state) => state.sessions);
  const [dialpadShow, setDialpadShow] = useState(false);
  const [clickStatus, setClickStatus] = useState("all");
  const callProgress = useSelector((state) => state.callProgress);
  const callProgressId = useSelector((state) => state.callProgressId);
  const navigate = useNavigate();
  const account = useSelector((state) => state.account);
  const [allCalls, setAllCalls] = useState([]);
  const [hangupRefresh, setHangupRefresh] = useState(0);

  const [previewCalls, setPreviewCalls] = useState([]);
  const [addContactToggle, setAddContactToggle] = useState(false);
  const [clickedCall, setClickedCall] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [allApiData, setAllApiData] = useState([]);
  const [callHistory, setCallHistory] = useState([]);
  const callProgressDestination = useSelector(
    (state) => state.callProgressDestination
  );

  function handleHideDialpad(value) {
    setDialpadShow(value);
  }

  const useWebSocketErrorHandling = (options) => {
    useEffect(() => {
      const webSocket = new WebSocket(options.webSocketServer);

      webSocket.onerror = (event) => {
        console.error("WebSocket error:", event);
        // Prevent default error handling
        event.preventDefault();
      };

      webSocket.onclose = (event) => {
        if (event.code === 1006) {
          console.error(
            `WebSocket closed ${options.webSocketServer} (code: ${event.code})`
          );
          // Handle the WebSocket close event
        }
      };
      console.log(global);
      return () => {
        webSocket.close();
      };
    }, [options.webSocketServer]);
  };

  useEffect(() => {
    setLoading(true);
    if (account && account.account_id) {
      async function getData() {
        const apiData = await generalGetFunction(
          `/call-details?account_id=${account.account_id}`
        );
        if (apiData.status) {
          // setAllCalls(apiData.data.calls.reverse());
          // console.log("apiData", apiData.data.calls);
          setAllApiData(apiData.data.calls.reverse());
          const uniqueArray = [
            ...new Map(
              apiData.data.calls
                .reverse()
                .map((item) => [item["Caller-Callee-ID-Number"], item])
            ).values(),
          ];
          setAllCalls(uniqueArray.reverse());
          console.log("uniqueArray", uniqueArray);
          setLoading(false);
        }
      }
      getData();
    } else {
      navigate("/");
    }
  }, [account, navigate, hangupRefresh]);

  // user data filter based on name and number(currently id)
  useEffect(() => {
    let filteredCalls = [];
    switch (clickStatus) {
      case "incoming":
        filteredCalls = allCalls.filter(
          (e) => e["Call-Direction"] === "inbound"
        );
        break;
      case "outgoing":
        filteredCalls = allCalls.filter(
          (e) => e["Call-Direction"] === "outbound"
        );
        break;
      case "missed":
        filteredCalls = allCalls.filter(
          (e) => e["Call-Direction"] === "missed"
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
    setClickedCall(filteredCalls[0]);
    setCallHistory(
      filteredCalls[0] &&
        allApiData.filter(
          (e) =>
            e["Caller-Callee-ID-Number"] ===
            filteredCalls[0]["Caller-Callee-ID-Number"]
        )
    );
  }, [allCalls, clickStatus, searchQuery]);

  // useEffect(() => {
  //   let filteredCalls = [];
  //   switch (clickStatus) {
  //     case "incoming":
  //       filteredCalls = allCalls.filter(
  //         (e) => e["Call-Direction"] === "inbound"
  //       );
  //       setClickedCall(filteredCalls[0]);
  //       break;
  //     case "outgoing":
  //       filteredCalls = allCalls.filter(
  //         (e) => e["Call-Direction"] === "outbound"
  //       );
  //       setClickedCall(filteredCalls[0]);
  //       break;
  //     case "missed":
  //       filteredCalls = allCalls.filter(
  //         (e) => e["Call-Direction"] === "missed"
  //       );
  //       setClickedCall(filteredCalls[0]);
  //       break;
  //     case "voicemail":
  //       filteredCalls = allCalls.filter(
  //         (e) => e["Call-Direction"] === "voicemail"
  //       );
  //       setClickedCall(filteredCalls[0]);
  //       break;
  //     case "all":
  //     default:
  //       filteredCalls = allCalls;
  //       setClickedCall(filteredCalls[0]);
  //       break;
  //   }
  //   setPreviewCalls(filteredCalls);
  // }, [allCalls, clickStatus]);

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

  const renderCallItem = (item) => (
    // <div key={item.id} className={`callListItem ${clickStatus}`}>
    <div
      key={item.id}
      onClick={() => {
        setClickedCall(item);
        setCallHistory(
          allApiData.filter(
            (e) =>
              e["Caller-Callee-ID-Number"] === item["Caller-Callee-ID-Number"]
          )
        );
      }}
      className={`callListItem ${
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
      style={{
        backgroundColor:
          clickedCall && clickedCall.id === item.id ? "#d7eeefcf" : "",
      }}
    >
      <div className="row justify-content-between">
        <div className="col-8 ms-4 text-start" style={{ cursor: "pointer" }}>
          <h4>{item["Caller-Callee-ID-Number"]}</h4>
          <h5>{item.caller_user ? item.caller_user.username : "USER XYZ"}</h5>
          <h6>Call, {formatTime(item.variable_duration)}</h6>
        </div>
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

  const groupCallsByDate = (calls) => {
    return calls.reduce((acc, call) => {
      // Parse the date as UTC and handle different formats
      // const callDate = new Date(call.created_at);
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

  // const groupCallsByDate = (calls) => {
  //   return calls.reduce((acc, call) => {
  //     const date = new Date(call.created_at).toLocaleDateString("en-US", {
  //       month: "short",
  //       day: "numeric",
  //       year: "numeric",
  //     });

  //     if (!acc[date]) {
  //       acc[date] = [];
  //     }

  //     acc[date].push(call);
  //     return acc;
  //   }, {});
  // };

  const groupedCalls = groupCallsByDate(previewCalls);

  const options = {
    domain: "192.168.2.225",
    webSocketServer: "ws://192.168.2.225:5066",
    // domain: "192.168.0.91",
    // webSocketServer: "ws://192.168.0.91:5066",
  };

  useWebSocketErrorHandling(options);
  console.log("This is sessions", sessions);

  return (
    <div className="browserPhoneWrapper">
      <SIPProvider options={options}>
        <SideNavbarApp />
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
                  <SipRegister />

                  <div className="col-auto d-flex">
                    <div className="col-auto">
                      <button
                        className="appPanelButton"
                        effect="ripple"
                        onClick={() => setDialpadShow(!dialpadShow)}
                      >
                        <i className="fa-light fa-mobile-retro" />
                      </button>
                    </div>
                    <div className="col-auto">
                      <button className="appPanelButton" effect="ripple">
                        <i className="fa-light fa-satellite-dish" />
                      </button>
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

                      <div className="callList">
                        {loading ? (
                          <ContentLoader />
                        ) : Object.keys(groupedCalls).length > 0 ? (
                          Object.keys(groupedCalls).map((date) => (
                            <div
                              key={date}
                              className="text-center callListItem"
                            >
                              <h5 className="fw-semibold">{date}</h5>
                              {groupedCalls[date].map(renderCallItem)}
                            </div>
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
                  {callProgress ? (
                    <OngoingCall
                      key={callProgressId}
                      id={callProgressId}
                      destination={callProgressDestination}
                      setHangupRefresh={setHangupRefresh}
                      hangupRefresh={hangupRefresh}
                    />
                  ) : (
                    clickedCall && (
                      <CallDetails
                        clickedCall={clickedCall}
                        callHistory={callHistory}
                      />
                    )
                  )}
                </div>
              </div>
            </div>
          </section>
        </main>
        {sessions.length > 0 && Object.keys(sessions).length > 0 ? (
          <>
            <section className="activeCallsSidePanel">
              <div className="container">
                <div className="row">
                  {sessions.length > 0 &&
                    sessions.map((session, chennel) => (
                      <ActiveCallSidePanel
                        sessionId={session.id}
                        destination={session.destination}
                        chennel={chennel}
                      />
                    ))}
                </div>
              </div>
            </section>
          </>
        ) : (
          ""
        )}
        {/* <IncomingCallPopup /> */}
        <IncomingCalls />
        {dialpadShow ? <Dialpad hideDialpad={handleHideDialpad} /> : ""}
        {addContactToggle && (
          <AddNewContactPopup setAddContactToggle={setAddContactToggle} />
        )}
      </SIPProvider>
    </div>
  );
}

export default Call;
