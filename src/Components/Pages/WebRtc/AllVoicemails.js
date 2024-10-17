import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import ActiveCallSidePanel from "./ActiveCallSidePanel";
import {
  generalGetFunction,
  globalErrorHandler,
} from "../../GlobalFunction/globalFunction";
import PaginationComponent from "../../CommonComponents/PaginationComponent";
import ContentLoader from "../../Loader/ContentLoader";

function AllVoicemails({ isCustomerAdmin }) {
  const sessions = useSelector((state) => state.sessions);
  const [voiceMail, setVoiceMail] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [filteredVoiceMail, setFilteredVoiceMail] = useState([]);
  const loadings = useSelector((state) => state.loading);
  const [loading, setLoading] = useState(false);
  const [clickedVoiceMail, setClickedVoiceMail] = useState(null);

  const audioRef = useRef(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.load(); // Reload the audio source
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
      console.log("api_data:", apiData);
    }
    getData();
  }, [pageNumber]);

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
        <div className="col-9 d-flex">
          <div className="profileHolder">
            {/* <i className="fa-light fa-user fs-5" /> */}
            <i class="fa-solid fa-microphone-lines fs-5"></i>
          </div>
          <div className="my-auto">
            {isCustomerAdmin ? (
              <h4>
                {item.src}
                ==<i class="fa-solid fa-angles-right"></i>
                {item.dest}
              </h4>
            ) : (
              <h4>{getSourceName(item.src, item.dest)}</h4>
            )}
            <h5>{formatDate(item.created_at)}</h5>
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
        </div>
        <div className="col-auto text-end">
          <h5>{formatTo12HourTime(item.created_at)}</h5>
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
      <main
        className="mainContentApp"
        style={{
          marginRight:
            sessions.length > 0 && Object.keys(sessions).length > 0
              ? "250px"
              : "0",
        }}
      >
        <section>
          <div className="container-fluid">
            <div className="row">
              <div
                className="col-xl-6 d-flex flex-wrap justify-content-between py-3 border-end"
                style={{ height: "100%" }}
              >
                <div className="col-auto">
                  <h3 style={{ fontFamily: "Outfit", color: "#444444" }}>
                    Voicemails <button class="clearButton"><i class="fa-regular fa-arrows-rotate fs-5" style={{ color: 'rgb(148, 148, 148)' }}></i></button>
                  </h3>
                </div>
                <div className="col-auto d-flex">
                  <div className="col-auto">
                    <button className="appPanelButton" effect="ripple">
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
                        className="tabLink active"
                        effect="ripple"
                        data-category="all"
                      >
                        All
                      </button>
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
                    <div className="position-relative searchBox d-flex mt-3">
                      <input
                        type="search"
                        name="Search"
                        id="headerSearch"
                        placeholder="Search"
                      />
                      <button className="ms-2 appPanelButton" effect="ripple">
                        <i className="fa-light fa-calendar-plus" />
                      </button>
                    </div>
                    <div className="callList">
                      {loading && loadings ? (
                        <ContentLoader />
                      ) : Object.keys(groupedVoiceMails).length > 0 ? (
                        sortKeys(Object.keys(groupedVoiceMails)).map((date) => (
                          <>
                            <div
                              key={date}
                              className="text-center callListItem"
                            >
                              <h5 className="fw-semibold">{date}</h5>
                            </div>
                            {sortedVoiceMails[date].map(renderCallItem)}
                          </>
                        ))
                      ) : (
                        <h3 className="text-center pt-10">
                          {/* No {clickStatus} calls */}
                          No Voicemails
                        </h3>
                      )}

                      {/* Call List Item */}
                    </div>
                  </div>
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
              {clickedVoiceMail && (
                <div
                  className="col-xl-6 callDetails"
                  style={{ height: "100%" }}
                  id="callDetails"
                >
                  <div className="profileInfoHolder">
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
                    {/* <h4>
                      {getSourceName(
                        clickedVoiceMail?.src,
                        clickedVoiceMail?.dest
                      )}
                    </h4> */}
                    {/* <h5>USER XYZ</h5> */}
                    <div className="d-flex justify-content-center align-items-center mt-3">
                      <button className="appPanelButton" effect="ripple">
                        <i className="fa-light fa-message-dots" />
                      </button>
                      <button className="appPanelButton" effect="ripple">
                        <i className="fa-light fa-phone" />
                      </button>
                    </div>
                  </div>
                  <div className="mt-2">
                    <nav>
                      <div className="nav nav-tabs" id="nav-tab" role="tablist">
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
                          <i className="fa-regular fa-circle-info" />
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
                          <i className="fa-regular fa-clock-rotate-left" />
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
                        <div className="callDetailsList">
                          <table className="mt-3">
                            <tbody>
                              <tr>
                                <td style={{ color: "#444444" }}>
                                  {formatDate(clickedVoiceMail.created_at)}
                                </td>
                                <td>
                                  {formatTime(clickedVoiceMail.created_at)}
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
                                      ==<i class="fa-solid fa-angles-right"></i>
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
                          <div className="audio-container">
                            <audio ref={audioRef} controls={true}>
                              {/* <source
                                src="https://crmdata-test.s3.us-east-2.amazonaws.com/rout.8.webvio.in/2024/Oct/01/b78c0901-4cb1-4c3d-9f5f-2e0c0a61775c.wav"
                                type="audio/ogg"
                              /> */}
                              <source
                                src={clickedVoiceMail.recording_path}
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
                            </button>
                            {/* <button className="audioCustomButton ms-1">
                              <i className="fa-sharp fa-solid fa-box-archive" />
                            </button> */}
                          </div>
                        </div>
                      </div>
                      <div
                        className="tab-pane fade"
                        id="nav-profile"
                        role="tabpanel"
                        aria-labelledby="nav-profile-tab"
                        tabIndex={0}
                      >
                        <div className="callDetailsList">
                          <table className="mt-3">
                            <tbody>
                              {selectedVoiceMailExtensionList &&
                                selectedVoiceMailExtensionList.length > 0 &&
                                selectedVoiceMailExtensionList.map(
                                  (item, index) => {
                                    return (
                                      <>
                                        <tr
                                          data-bs-toggle="collapse"
                                          href={`#voiceMail${index}`}
                                          role="button"
                                        >
                                          <td style={{ color: "#444444" }}>
                                            {formatDate(item.created_at)}
                                          </td>
                                          <td>{formatTime(item.created_at)}</td>
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
                                                ==
                                                <i class="fa-solid fa-angles-right"></i>
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
                                          <td style={{ color: "#444444" }}>
                                            24 sec
                                          </td>
                                        </tr>
                                        <tr
                                          className="collapse"
                                          id={`voiceMail${index}`}
                                        >
                                          <td colSpan={5}>
                                            <div
                                              className="audio-container collapse"
                                              id={`voiceMail${index}`}
                                            >
                                              <audio controls={true}>
                                                <source
                                                  src=""
                                                  type="audio/ogg"
                                                />
                                                <source
                                                  src={
                                                    item.recording_path || ""
                                                  }
                                                  type="audio/mpeg"
                                                />
                                              </audio>
                                              {/* Custom buttons */}
                                              <button className="audioCustomButton">
                                                <i className="fa-sharp fa-solid fa-download" />
                                              </button>
                                              <button className="audioCustomButton ms-1">
                                                <i className="fa-sharp fa-solid fa-box-archive" />
                                              </button>
                                            </div>
                                          </td>
                                        </tr>
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
