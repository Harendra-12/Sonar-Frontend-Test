/* eslint-disable no-unused-vars */
/* eslint-disable eqeqeq */
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  featureUnderdevelopment,
  generalGetFunction,
  generatePreSignedUrl,
  logout,
} from "../../GlobalFunction/globalFunction";
import PaginationComponent from "../../CommonComponents/PaginationComponent";
import ContentLoader from "../../Loader/ContentLoader";
import { useNavigate } from "react-router-dom";
import DarkModeToggle from "../../CommonComponents/DarkModeToggle";
import { useSIPProvider } from "modify-react-sipjs";
import LogOutPopUp from "./LogOutPopUp";
import AudioWaveformCommon from "../../CommonComponents/AudioWaveformCommon";


function AllVoicemails({ isCustomerAdmin }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const sessions = useSelector((state) => state.sessions);
  const [voiceMail, setVoiceMail] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [filteredVoiceMail, setFilteredVoiceMail] = useState([]);
  const loadings = useSelector((state) => state.loading);
  const [loading, setLoading] = useState(false);
  const [clickedVoiceMail, setClickedVoiceMail] = useState(null);
  const [voiceMailRefresh, setVoiceMailRefresh] = useState(0);
  const { sessionManager, connectStatus } = useSIPProvider();
  const allCallCenterIds = useSelector((state) => state.allCallCenterIds);
  const [allLogOut, setAllLogOut] = useState(false);
  const thisAudioRef = useRef(null);
  const [currentPlaying, setCurrentPlaying] = useState("");
  const [audioURL, setAudioURL] = useState("");
  const [showInfoAudio, setShowInfoAudio] = useState(false);
  const [showLogsAudio, setShowLogsAudio] = useState("");



  useEffect(() => {
    const handlePlaying = async (audio) => {
      // Reseting state before Playing
      setCurrentPlaying("");
      setAudioURL("");

      try {
        setCurrentPlaying(audio);
        const url = audio.split(".com/").pop();
        // const res = await generatePreSignedUrl(url);

        // if (res?.status && res?.url) {
        setAudioURL(audio); // Update audio URL state
        // setAudioURL(res.url);
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
    if (clickedVoiceMail) {
      handlePlaying(clickedVoiceMail.recording_path)
    }
  }, [clickedVoiceMail])
  useEffect(() => {
    if (thisAudioRef.current) {
      thisAudioRef.current.load(); // Reload the audio source
    }
  }, [clickedVoiceMail]);

  const account = useSelector((state) => state.account);
  const extension = account?.extension?.extension || "";

  useEffect(() => {
    setLoading(true);
    async function getData() {
      const apiData = await generalGetFunction(
        `/voicemails?page=${pageNumber}`
      );
      if (apiData?.status) {
        setVoiceMail(apiData.data);
        setLoading(false);
      } else {
        setLoading(false);
      }
    }
    getData();
  }, [pageNumber, voiceMailRefresh]);

  useEffect(() => {
    if (voiceMail?.data) {
      // const updatedVoiceMail = voiceMail?.data?.filter((item) => {
      //   return item.dest == extension || item.src == extension;
      // });
      // setFilteredVoiceMail(updatedVoiceMail);
      setFilteredVoiceMail(voiceMail?.data);
      // setClickedVoiceMail(voiceMail.data[0]);
      // setClickedVoiceMail(updatedVoiceMail[0]);
      setClickedVoiceMail(voiceMail?.data[0]);
    }
  }, [voiceMail]);

  // Function to handle logout
  const handleLogOut = async () => {
    setLoading(true);
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
      setLoading(false);
    }
  };
  const groupVoicemailsByDate = (voiceMail) => {
    if (voiceMail.length == 0) return [];

    return voiceMail.reduce((acc, call) => {
      // Manually parse the date if necessary
      const callDate = new Date(call.created_at.replace(/-/g, "/")); // Ensure valid parsing
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

  const groupedVoiceMails = groupVoicemailsByDate(filteredVoiceMail);
  // const groupedVoiceMails = groupVoicemailsByDate(voiceMail?.data);

  const sortedVoiceMails = sortKeys(Object.keys(groupedVoiceMails)).reduce(
    (acc, date) => {
      acc[date] = groupedVoiceMails[date].sort(
        (a, b) =>
          new Date(b.created_at.replace(/-/g, "/")) -
          new Date(a.created_at.replace(/-/g, "/"))
      );
      return acc;
    },
    {}
  );
  const getSourceName = (src, dest) => {
    if (src == extension) {
      return dest;
    } else if (dest == extension) {
      return src;
    }
  };
  const handleVoiceMailClick = (item) => {
    setClickedVoiceMail(item);
  };

  const handleAudioDownload = (src) => {
    const link = document.createElement("a");
    link.href = src;
    link.download = "audio-file.wav";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderCallItem = (item) => (
    <div
      className={`callListItem ${clickedVoiceMail?.id === item?.id ? "selected" : ""
        }`}
      onClick={() => handleVoiceMailClick(item)}
    >
      <div className="row justify-content-between align-items-center">
        <div className="col-12 d-flex">
          <div className="profileHolder">
            {/* <i className="fa-light fa-user fs-5" /> */}
            <i className="fa-solid fa-microphone-lines fs-5"></i>
          </div>
          <div className="col-4 my-auto ms-2 ms-xl-3">
            {isCustomerAdmin ? (
              <h4>
                {item.src}
                <i className="fa-solid fa-voicemail mx-2 text-danger"></i>
                {item.dest}
              </h4>
            ) : (
              <h4>{getSourceName(item.src, item.dest)}</h4>
            )}
            <h5 style={{ fontSize: "12px" }}>{formatDate(item.created_at)}</h5>
            {/* <h5>USER XYZ</h5>
            <h6
              style={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <i className="fa-solid fa-voicemail text-danger fw-bold me-1" />
              Voicemail, 15 sec
            </h6> */}
          </div>
          <div className="col-3 mx-auto">
            <div className="contactTags">
              <span data-id="2">Duration: {item.duration}</span>
            </div>
          </div>
          <div className="col-1 text-end ms-auto">
            <p className="timeAgo">{formatTo12HourTime(item.created_at)}</p>
          </div>
        </div>
      </div>
      {/* <div className="contactPopup">
        <button>
          <i className="fa-light fa-phone" />
        </button>
        <button>
          <i className="fa-light fa-message" />
        </button>
        <button>
          <i className="fa-light fa-trash" />
        </button>
      </div> */}
    </div>
  );

  const formatTo12HourTime = (dateString) => {
    const [datePart, timePart] = dateString.split(" ");
    let [hours, minutes] = timePart.split(":");

    // Convert hours to a 12-hour format
    const period = hours >= 12 ? "pm" : "am";
    hours = hours % 12 || 12; // Convert 0 to 12 for midnight and adjust for 12-hour format

    // Format the time string
    return `${hours}:${minutes} ${period}`;
  };

  const formatDate = (dateString) => {
    if (dateString) {
      const date = new Date(dateString.replace(" ", "T") + "Z");
      const formattedTimestamp = date.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
      return formattedTimestamp;
    } else {
      return null;
    }
  };

  // function to play the audio
  const handlePlaying = async (audio) => {
    // Reseting state before Playing
    setCurrentPlaying("audio");
    setAudioURL("");

    if (!audio) return;
    if (currentPlaying === audio) {
      if (thisAudioRef.current) {
        thisAudioRef.current.pause();
      }
      setCurrentPlaying(null);
      return;
    }

    setCurrentPlaying(audio);

    try {
      const url = audio.split(".com/").pop();
      // const res = await generatePreSignedUrl(url);

      // if (res?.status && res?.url) {
      setAudioURL(audio);
      // setAudioURL(res.url);
      setTimeout(() => {
        if (thisAudioRef.current) {
          thisAudioRef.current.load();
          thisAudioRef.current
            .play()
            .catch((error) => console.error("Audio play error:", error));
        }
      }, 100);
      // }
    } catch (error) {
      console.error("Error in handlePlaying:", error);
      setCurrentPlaying(null);
    }
  };

  const handleTranscript = () => {


  }
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12;
    const minutesString = minutes < 10 ? `0${minutes}` : minutes;
    return `${hours}:${minutesString} ${ampm}`;
  };

  const selectedVoiceMailExtensionList = filteredVoiceMail.filter((item) => {
    if (!isCustomerAdmin) {
      return (
        item.dest ==
        getSourceName(clickedVoiceMail.src, clickedVoiceMail.dest) ||
        item.src == getSourceName(clickedVoiceMail.src, clickedVoiceMail.dest)
      );
    } else {
      return (
        item.src == clickedVoiceMail.src && item.dest == clickedVoiceMail.dest
      );
    }
  });

  return (
    <>
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
          <div className="container-fluid">
            <div className="row">
              <div className="col-12 ps-xl-0">
                <div className="newHeader">
                  <div className="col-auto" style={{ padding: "0 10px" }}>
                    <h3 style={{ fontFamily: "Outfit", marginBottom: "0" }}>
                      Voicemails{" "}
                      <button
                        className="clearButton2"
                        onClick={() =>
                          setVoiceMailRefresh(voiceMailRefresh + 1)
                        }
                        disabled={loading}
                      >
                        <i
                          className={
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
                        className="formItem fw-normal"
                        style={{ backgroundColor: "var(--searchBg)" }}
                        onChange={() => featureUnderdevelopment()}
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
                    {/* <div className="col-auto">
                      <div className="dropdown">
                        <div
                          className="myProfileWidget"
                          type="button"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                          <div className="profileHolder" id="profileOnlineNav">
                            <img
                              src={account?.profile_picture}
                              alt="profile"
                              onError={(e) => e.target.src = require('../../assets/images/placeholder-image.webp')}
                            />
                          </div>
                          <div className="profileName">
                            {account?.username}{" "}
                            <span className="status">Available</span>
                          </div>
                        </div>
                        <ul className="dropdown-menu">
                          <li
                            onClick={() => {
                              if (allCallCenterIds.length > 0) {
                                setAllLogOut(true);
                              } else {
                                handleLogOut();
                              }
                            }}
                          >
                            <div
                              className="dropdown-item"
                              style={{ cursor: "pointer" }}
                            >
                              Logout
                            </div>
                          </li>
                        </ul>
                      </div>
                    </div> */}
                  </div>
                </div>
              </div>

              <div className="col-xl-6 allCallHistory pb-0">
                <div className="col-auto" style={{ padding: "0 10px" }}>
                  <h5 className="viewingAs">
                    Viewing As:
                    <span>
                      {account && extension ? (
                        <span>
                          {account?.username} - {account && extension}
                        </span>
                      ) : (
                        <span className="text-danger">
                          No Extension Assigned
                        </span>
                      )}
                    </span>
                  </h5>
                </div>
                <div className="col-auto" style={{ padding: "0 10px" }}>
                  <button
                    className="clearColorButton dark"
                    onClick={() => featureUnderdevelopment()}
                  >
                    <i className="fa-light fa-mobile-retro" /> Dial Number
                  </button>
                </div>
                <div className="col-12 mt-3" style={{ padding: "0 10px" }}>
                  <input
                    type="search"
                    name="Search"
                    id="headerSearch"
                    placeholder="Search"
                    onChange={() => featureUnderdevelopment()}
                  />
                </div>
                <div className="col-12">
                  <nav className="mt-3">
                    <div
                      className="nav nav-tabs"
                      style={{ borderBottom: "1px solid var(--border-color)" }}
                    >
                      {/* <button
                        className="tabLink active"
                        effect="ripple"
                        data-category="all"
                      >
                        All
                      </button> */}
                      {/* <button
                        className="tabLink"
                        effect="ripple"
                        data-category="new"
                      >
                        New
                      </button> */}
                    </div>
                  </nav>
                  <div className="tab-content">
                    <div className="callList">
                      {loading && loadings ? (
                        <ContentLoader />
                      ) : Object.keys(groupedVoiceMails).length > 0 ? (
                        sortKeys(Object.keys(groupedVoiceMails)).map((date) => (
                          <>
                            <div key={date} className="dateHeader">
                              <p>{date}</p>
                            </div>
                            {sortedVoiceMails[date].map(renderCallItem)}
                          </>
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
                                  <b>voicemails</b>
                                </span>{" "}
                                available
                              </h5>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Call List Item */}
                    </div>
                  </div>
                  <div className="tableHeader mt-2 px-2">
                    {voiceMail && voiceMail?.data?.length > 0 ? (
                      // data here would be changed if we get data user specific
                      //currently data is for all users in this account
                      <PaginationComponent
                        pageNumber={(e) => setPageNumber(e)}
                        totalPage={voiceMail.last_page}
                        from={(pageNumber - 1) * voiceMail.per_page + 1}
                        to={voiceMail.to} //change here accordingly
                        total={voiceMail.total} //change here accordingly
                      />
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              </div>
              {clickedVoiceMail && (
                <div className="col-xl-6 callDetails"
                  style={{ height: "100%" }}
                  id="callDetails"
                >
                  <div className="messageOverlay">
                    <div className="contactHeader">
                      <div>
                        <h4 className="mb-0">Test User</h4>
                        <p className="gray14 mb-0 mt-1">
                          Extension -{" "}
                          {getSourceName(
                            clickedVoiceMail.src,
                            clickedVoiceMail.dest
                          )}
                        </p>
                      </div>
                      <div className="d-flex my-auto">
                        {/* <div className="d-flex align-items-center me-2">
                          <label className="gray14 me-2">Assigned to:</label>
                          <select className="ovalSelect">
                            <option>
                              Test User
                            </option>
                          </select>
                        </div> */}
                        <button
                          className="clearButton2 xl"
                          effect="ripple"
                          onClick={() => featureUnderdevelopment()}
                        >
                          <i className="fa-regular fa-message-dots" />
                        </button>
                        <button
                          className="clearButton2 xl"
                          effect="ripple"
                          onClick={() => featureUnderdevelopment()}
                        >
                          <i className="fa-regular fa-phone" />
                        </button>
                        <button
                          className="clearButton2 xl"
                          effect="ripple"
                          onClick={() => featureUnderdevelopment()}
                        >
                          <i className="fa-regular fa-video" />
                        </button>
                        <div className="dropdown">
                          <button
                            className="clearButton2 xl"
                            type="button"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                          >
                            <i className="fa-solid fa-ellipsis-vertical"></i>
                          </button>
                          <ul className="dropdown-menu">
                            <li>
                              <a
                                className="dropdown-item"
                                href="/"
                                onClick={() => featureUnderdevelopment()}
                                alt="Add to Contact"
                              >
                                Add to Contact
                              </a>
                            </li>
                            <li>
                              <a
                                className="dropdown-item"
                                href="/"
                                onClick={() => featureUnderdevelopment()}
                              >
                                Video Call
                              </a>
                            </li>
                            <li>
                              <a
                                className="dropdown-item"
                                href="/"
                                onClick={() => featureUnderdevelopment()}
                              >
                                Delete Contact
                              </a>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* <div className="profileInfoHolder">
                    <div className="profileHolder">
                      <i className="fa-light fa-user fs-3" />
                    </div>
                    {isCustomerAdmin ? (
                      <h4>{clickedVoiceMail.src}</h4>
                    ) : (
                      <h4>
                        {getSourceName(
                          clickedVoiceMail.src,
                          clickedVoiceMail.dest
                        )}
                      </h4>
                    )}
                    <div className="d-flex justify-content-center align-items-center mt-3">
                      <button className="appPanelButton" effect="ripple">
                        <i className="fa-light fa-message-dots" />
                      </button>
                      <button className="appPanelButton" effect="ripple">
                        <i className="fa-light fa-phone" />
                      </button>
                    </div>
                  </div> */}
                  <div className="overviewTableWrapper p-2 mt-2">
                    <div className="overviewTableChild">
                      <div className="d-flex flex-wrap">
                        <div className="col-12">
                          <div className="heading">
                            <div className="content">
                              <h4>Voicemails</h4>
                              <p>You can see all of the voicemail logs here</p>
                            </div>
                          </div>
                        </div>
                        <div
                          className="col-12"
                          style={{ padding: "0px 20px 0px" }}
                        >
                          <div className="mt-2">
                            <nav className="mb-2">
                              <div
                                className="nav nav-tabs"
                                id="nav-tab"
                                role="tablist"
                                style={{
                                  borderBottom: "1px solid var(--border-color)",
                                }}
                              >
                                <button
                                  className="tabLink active"
                                  effect="ripple"
                                  data-bs-toggle="tab"
                                  data-bs-target="#nav-home"
                                  type="button"
                                  role="tab"
                                  aria-controls="nav-home"
                                  aria-selected="true"
                                >
                                  Info
                                </button>
                                <button
                                  className="tabLink"
                                  effect="ripple"
                                  data-bs-toggle="tab"
                                  data-bs-target="#nav-profile"
                                  type="button"
                                  role="tab"
                                  aria-controls="nav-profile"
                                  aria-selected="false"
                                >
                                  Logs
                                </button>
                              </div>
                            </nav>
                            <div className="tab-content" id="nav-tabContent">
                              <div
                                className="tab-pane fade show active"
                                id="nav-home"
                                role="tabpanel"
                                aria-labelledby="nav-home-tab"
                                tabIndex={0}
                              >
                                <div
                                  className="callDetailsList tableContainer mt-0"
                                  style={{ height: "calc(100vh - 311px)" }}
                                >
                                  <table>
                                    <thead>
                                      <tr>
                                        <th>Date</th>
                                        <th>Time</th>
                                        <th>Call Type</th>
                                        <th>Sender</th>
                                        <th></th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      <tr >
                                        <td>
                                          {formatDate(
                                            clickedVoiceMail.created_at
                                          )}
                                        </td>
                                        <td>
                                          {formatTime(
                                            clickedVoiceMail.created_at
                                          )}
                                        </td>
                                        <td
                                          style={{
                                            display: "flex",
                                            alignItems: "center",
                                          }}
                                        >
                                          <i className="fa-solid fa-voicemail text-danger fw-bold me-1" />{" "}
                                          <span className="d-none d-xl-inline-block">
                                            Voicemail
                                          </span>
                                        </td>
                                        <td>
                                          {isCustomerAdmin ? (
                                            <span>
                                              {clickedVoiceMail.src}
                                              <i className="fa-solid fa-voicemail mx-2 text-danger"></i>
                                              {clickedVoiceMail.dest}
                                            </span>
                                          ) : (
                                            <span>
                                              {getSourceName(
                                                clickedVoiceMail.src,
                                                clickedVoiceMail.dest
                                              )}
                                            </span>
                                          )}
                                        </td>
                                        <td>
                                          <button
                                            className="tableButton px-2 mx-0"
                                            onClick={() => {
                                              if (clickedVoiceMail.recording_path === currentPlaying) {
                                                setCurrentPlaying("");
                                                setAudioURL("");
                                              } else {
                                                handlePlaying(clickedVoiceMail.recording_path);
                                              }
                                            }}
                                          >
                                            {currentPlaying === clickedVoiceMail.recording_path ? (
                                              <i className="fa-solid fa-chevron-up"></i>
                                            ) : (
                                              <i className="fa-solid fa-chevron-down"></i>
                                            )}
                                          </button>
                                          {/* <div className="dropdown">
                                            <div
                                              className={`tableButton`}
                                              href="#"
                                              role="button"
                                              data-bs-toggle="dropdown"
                                              aria-expanded="false"
                                            >
                                              <i className="fa-solid fa-ellipsis-vertical" />
                                            </div>
                                            <ul className="dropdown-menu actionBtnDropdowns">
                                              <>
                                                <li className="dropdown-item">
                                                  <div
                                                    className="clearButton text-align-start"
                                                    onClick={() => {
                                                      setShowInfoAudio(true)
                                                      if (clickedVoiceMail.recording_path) {

                                                        handlePlaying(
                                                          clickedVoiceMail.recording_path
                                                        );
                                                      }
                                                    }}
                                                  >

                                                    <i
                                                      className={`fa-solid fa-${clickedVoiceMail.recording_path.configuration !== null
                                                        ? "play"
                                                        : "triangle-exclamation"
                                                        } me-2`}
                                                    ></i>{" "}
                                                    {clickedVoiceMail.recording_path.configuration !== null
                                                      ? "Play "
                                                      : "Configure"}
                                                  </div>
                                                </li>

                                                <li className="dropdown-item">
                                                  <div
                                                    className="clearButton text-align-start"
                                                    onClick={() =>
                                                      handleTranscript()
                                                    }
                                                  >
                                                    <i className="fa-solid fa-bolt me-2"></i>
                                                    Transcript
                                                  </div>
                                                </li>
                                              </>

                                              <>
                                                <li className="dropdown-item">
                                                  <div
                                                    className="clearButton text-align-start"
                                                    onClick={() =>
                                                      handleAudioDownload(
                                                        clickedVoiceMail.recording_path
                                                      )
                                                    }
                                                  >
                                                    <i className="fa-regular fa-download"></i>{" "}
                                                    Download
                                                  </div>
                                                </li>
                                              </>
                                              <li className="dropdown-item"></li>
                                            </ul>
                                          </div> */}
                                        </td>
                                        {/* <td>
                                  {getSourceName(
                                    clickedVoiceMail.src,
                                    clickedVoiceMail.dest
                                  )}
                                </td> */}
                                        {/* <td style={{ color: "#444444" }}>16 sec</td> */}
                                      </tr>
                                    </tbody>
                                  </table>
                                  {currentPlaying === clickedVoiceMail.recording_path && clickedVoiceMail.recording_path && <div className="audio-container mx-2">
                                    {/* <audio
                                          controls={true}
                                          ref={thisAudioRef}
                                          autoPlay={true}
                                          onEnded={() => {
                                            setCurrentPlaying(null);
                                          }}
                                        >
                                          <source
                                            src={audioURL}
                                            type="audio/mpeg"
                                          />
                                        </audio>
                                    <button
                                      className="audioCustomButton"
                                      onClick={() =>
                                        handleAudioDownload(
                                          clickedVoiceMail.recording_path
                                        )
                                      }
                                    >
                                      <i className="fa-sharp fa-solid fa-download" />
                                    </button> */}
                                    {/* <button className="audioCustomButton ms-1">
                              <i className="fa-sharp fa-solid fa-box-archive" />
                            </button> */}
                                    <AudioWaveformCommon audioUrl={audioURL} />
                                  </div>}
                                </div>
                              </div>
                              <div
                                className="tab-pane fade"
                                id="nav-profile"
                                role="tabpanel"
                                aria-labelledby="nav-profile-tab"
                                tabIndex={0}
                              >
                                <div
                                  className="callDetailsList tableContainer mt-0"
                                  style={{ height: "calc(100vh - 311px)" }}
                                >
                                  <table>
                                    <thead>
                                      <tr>
                                        <th>Date</th>
                                        <th>Time</th>
                                        <th>Call Type</th>
                                        <th>Sender</th>
                                        <th>Duration</th>
                                        <th></th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {selectedVoiceMailExtensionList &&
                                        selectedVoiceMailExtensionList.length >
                                        0 &&
                                        selectedVoiceMailExtensionList.map(
                                          (item, index) => {
                                            return (
                                              <>
                                                <tr
                                                  // data-bs-toggle="collapse"
                                                  href={`#voiceMail${index}`}
                                                  role="button"
                                                >
                                                  <td>
                                                    {formatDate(
                                                      item.created_at
                                                    )}
                                                  </td>
                                                  <td>
                                                    {formatTime(
                                                      item.created_at
                                                    )}
                                                  </td>
                                                  <td
                                                    style={{
                                                      display: "flex",
                                                      alignItems: "center",
                                                    }}
                                                  >
                                                    <i className="fa-solid fa-voicemail text-danger fw-bold me-1" />{" "}
                                                    <span className="d-none d-xl-inline-block">
                                                      Voicemail
                                                    </span>
                                                  </td>
                                                  <td>
                                                    {isCustomerAdmin ? (
                                                      <span>
                                                        {item.src}
                                                        <i className="fa-solid fa-voicemail mx-2 text-danger"></i>
                                                        {item.dest}
                                                      </span>
                                                    ) : (
                                                      <span>
                                                        {getSourceName(
                                                          item.src,
                                                          item.dest
                                                        )}
                                                      </span>
                                                    )}
                                                  </td>
                                                  {/* <td>{item.dest}</td> */}
                                                  <td
                                                    style={{
                                                      color:
                                                        "var(--color-subtext)",
                                                    }}
                                                  >
                                                    {item.duration}
                                                  </td>
                                                  <td>   <div className="dropdown">
                                                    <div
                                                      className={`tableButton`}
                                                      href="#"
                                                      role="button"
                                                      data-bs-toggle="dropdown"
                                                      aria-expanded="false"
                                                    >
                                                      <i className="fa-solid fa-ellipsis-vertical" />
                                                    </div>
                                                    <ul className="dropdown-menu actionBtnDropdowns">
                                                      <>
                                                        <li className="dropdown-item">
                                                          <div
                                                            className="clearButton text-align-start"
                                                            onClick={() => {
                                                              setShowLogsAudio(item.id)
                                                              if (item?.recording_path) {
                                                                handlePlaying(
                                                                  item?.recording_path
                                                                );
                                                              }
                                                            }}
                                                          >

                                                            <i
                                                              className={`fa-solid fa-${item.configuration !== null
                                                                ? "play"
                                                                : "triangle-exclamation"
                                                                } me-2`}
                                                            ></i>{" "}
                                                            {item.configuration !== null
                                                              ? "Play "
                                                              : "Configure"}
                                                          </div>
                                                        </li>

                                                        <li className="dropdown-item">
                                                          <div
                                                            className="clearButton text-align-start"
                                                            onClick={() =>
                                                              handleTranscript()
                                                            }
                                                          >
                                                            <i className="fa-solid fa-bolt me-2"></i>
                                                            Transcript
                                                          </div>
                                                        </li>
                                                      </>

                                                      <>
                                                        <li className="dropdown-item">
                                                          <div
                                                            className="clearButton text-align-start"
                                                            onClick={() =>
                                                              handleAudioDownload(
                                                                item.recording_path
                                                              )
                                                            }
                                                          >
                                                            <i className="fa-regular fa-download"></i>{" "}
                                                            Download
                                                          </div>
                                                        </li>
                                                      </>
                                                      <li className="dropdown-item"></li>
                                                    </ul>
                                                  </div></td>
                                                </tr>
                                                {showLogsAudio == item?.id && <tr
                                                  // className="collapse"
                                                  key={`voiceMail${index}`}
                                                >
                                                  <td colSpan={5}>
                                                    <div
                                                      className="audio-container"
                                                      id={`voiceMail${index}`}
                                                    >
                                                      {/* <audio controls={true}>
                                                        <source
                                                          src=""
                                                          type="audio/ogg"
                                                        />
                                                        <source
                                                          src={
                                                            item.recording_path ||
                                                            ""
                                                          }
                                                          type="audio/mpeg"
                                                        />
                                                      </audio> */}
                                                      {/* Custom buttons */}
                                                      {/* <button className="audioCustomButton">
                                                        <i className="fa-sharp fa-solid fa-download" />
                                                      </button>
                                                      <button className="audioCustomButton ms-1">
                                                        <i className="fa-sharp fa-solid fa-box-archive" />
                                                      </button> */}
                                                      <AudioWaveformCommon audioUrl={audioURL} />
                                                    </div>
                                                  </td>

                                                </tr>}
                                              </>
                                            );
                                          }
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
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
      {/* {sessions.length > 0 && Object.keys(sessions).length > 0 ? (
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
      )} */}
    </>
  );
}

export default AllVoicemails;
