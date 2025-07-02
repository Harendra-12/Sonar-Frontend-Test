import React, { useEffect, useRef, useState } from "react";
import Header from "../../CommonComponents/Header";
import { useNavigate } from "react-router-dom";
import {
  backToTop,
  checkViewSidebar,
  featureUnderdevelopment,
  generalDeleteFunction,
  generalGetFunction,
  generatePreSignedUrl,
  meetGeneralGetFunction,
  useDebounce,
} from "../../GlobalFunction/globalFunction";
import SkeletonTableLoader from "../../Loader/SkeletonTableLoader";
import { toast } from "react-toastify";
import axios from "axios";
import { set } from "react-hook-form";
import CircularLoader from "../../Loader/CircularLoader";
import { useSelector } from "react-redux";
import ThreeDotedLoader from "../../Loader/ThreeDotedLoader";
import PaginationComponent from "../../CommonComponents/PaginationComponent";
import { api_url } from "../../../urls";

/**
 * This component renders the meeting rooms page
 * It displays a table with conference name, max members, conference id, moderator pin, joining pin, meeting link, recordings, and email
 * The component also includes a search box and a select all button
 * The component also includes a delete button that calls the handleDelete function
 * The component also includes a share button that calls the handleShare function
 * The component also includes a view button that calls the handleView function
 * The component also includes a email button that calls the handleEmail function
 * The component also includes a send email popup that allows the user to select emails of participants to send the recording or summary of the meeting
 * The component also includes a share recording popup that allows the user to select how to share the file
 * The component also includes a view recording popup that displays the recording
 */
function Meeting() {
  const [refreshState, setRefreshState] = useState(0);
  const [refreshBooleanState, setRefreshBooleanState] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [conference, setConference] = useState([]);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [pageNumber, setPageNumber] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const debouncedSearch = useDebounce(searchValue, 1000);
  const [popUp, setPopUp] = useState(false);
  const [viewVideoPopup, setViewVideoPopup] = useState(false);
  const [showRecordingsPopup, setShowRecordingsPopup] = useState(false);
  const [shareRecordingPopup, setShareRecordingPopup] = useState(false);
  const [deleteId, setDeleteId] = useState("");
  const [moderatorPinId, setModeratorPinId] = useState("");
  const [participantPinId, setParticipantPinId] = useState("");
  const [recordData, setRecorddata] = useState([]);
  const [dataLoade, setdataLoader] = useState(true);
  const viewVideoRef = useRef(null);
  const [pageLoading, setPageLoading] = useState(false);
  const [preSignedUrl, setPreSignedUrl] = useState("");
  const [sendEmailPopup, setSendEmailPopup] = useState(false);
  const [copyElement, setCopyElement] = useState(null);
  const account = useSelector((state) => state?.account);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [selectedEmails, setSelectedEmails] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const slugPermissions = useSelector((state) => state?.permissions);

  const getData = async (shouldLoad) => {
    if (shouldLoad) setLoading(true);
    const apiData = await generalGetFunction(
      `/conference/all?page=${pageNumber}&row_per_page=${itemsPerPage}&search=${searchValue}`
    );
    if (apiData?.status) {
      setLoading(false);
      setRefreshBooleanState(false);
      setConference(apiData.data);
    } else {
      setLoading(false);
      setRefreshBooleanState(false);
    }
  };

  useEffect(() => {
    setRefreshBooleanState(true);
    const shouldLoad = true;
    getData(shouldLoad);
  }, [refreshState, pageNumber, itemsPerPage, debouncedSearch]);

  async function handleDelete() {
    setLoading(true);
    const apiData = await generalDeleteFunction(`/conference/${deleteId}`);
    if (apiData.status) {
      setLoading(false);
      setRefreshState(refreshState + 1);
      setDeleteId("");
      toast.success(apiData.message);
    } else {
      setLoading(false);
      setDeleteId("");
    }
  }

  async function handleGetRecord(id) {
    setdataLoader(true);
    // axios
    //   .get(`https://meet.webvio.in/backend/recordings?roomName=${id}`)
    //   .then((res) => {
    //     setRecorddata(res.data.recordings);
    //     setdataLoader(false);
    //   })
    //   .catch((err) => {
    //     setdataLoader(false);
    //   });
    const res = await meetGeneralGetFunction(api_url?.MEET_RECORDING(id));
    if (res?.status) {
      setRecorddata(res.data.recordings);
      setdataLoader(false);
    } else {
      setRecorddata([]);
      setdataLoader(false);
    }
  }

  function formatTimestamp(nanoseconds) {
    // console.log(nanoseconds, "nanoseconds");

    const milliseconds = Number(nanoseconds) / 1_000_000; // Convert safely
    const date = new Date(milliseconds);

    const dd = String(date.getDate()).padStart(2, "0");
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const yyyy = date.getFullYear();
    const hh = String(date.getHours()).padStart(2, "0");
    const min = String(date.getMinutes()).padStart(2, "0");
    const ss = String(date.getSeconds()).padStart(2, "0");

    return `${dd}/${mm}/${yyyy} ${hh}:${min}:${ss}`;
  }

  async function handleShare(filename) {
    setPageLoading(true);
    try {
      const apidata = await generatePreSignedUrl(filename);
      if (apidata?.status) {
        setShareRecordingPopup(true);
        setPreSignedUrl(apidata.url);
        setPageLoading(false);
      }
    } catch (err) {
      setPageLoading(false);
      console.log(err);
    }
  }

  async function handleView(filename) {
    setPageLoading(true);
    try {
      const apidata = await generatePreSignedUrl(filename);
      if (apidata?.status) {
        // window.open(apidata.url, "_blank");
        setViewVideoPopup(true);
        setTimeout(() => {
          if (viewVideoRef.current) {
            viewVideoRef.current.src = apidata.url;
            viewVideoRef.current.load();
            setPageLoading(false);
            viewVideoRef.current.play();
          }
        }, 100);
      }
    } catch (err) {
      setPageLoading(false);
      console.log(err);
    }
  }

  const handleRefreshBtnClicked = () => {
    setRefreshBooleanState(true);
    const shouldLoad = false;
    getData(shouldLoad);
  };

  function handleEmailCheckBoxChange(email) {
    setSelectedEmails((prevEmails) => {
      if (prevEmails.includes(email)) {
        return prevEmails.filter((e) => e !== email);
      } else {
        return [...prevEmails, email];
      }
    });
  }

  function handleSelectAllToggel() {
    if (selectedEmails.length === selectedMeeting?.emails?.length) {
      setSelectedEmails([]);
    } else {
      const allEmails = selectedMeeting?.emails?.map((email) => email.email);
      setSelectedEmails(allEmails);
    }
  }
  return (
    <>
      {pageLoading && <CircularLoader />}

      <main className="mainContent">
        <section id="phonePage">
          <div className="container-fluid">
            <div className="row">
              <Header title="Meeting Rooms" />
              <div className="overviewTableWrapper">
                <div className="overviewTableChild">
                  <div className="d-flex flex-wrap">
                    <div className="col-12">
                      <div className="heading">
                        <div className="content">
                          <h4>
                            Meeting Rooms
                            <button
                              className="clearButton"
                              onClick={handleRefreshBtnClicked}
                              disabled={refreshBooleanState}
                            >
                              <i
                                className={
                                  refreshBooleanState
                                    ? "fa-regular fa-arrows-rotate fs-5 fa-spin"
                                    : "fa-regular fa-arrows-rotate fs-5"
                                }
                              ></i>
                            </button>
                          </h4>
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
                          {checkViewSidebar(
                            "Conference",
                            slugPermissions,
                            account?.sectionPermissions,
                            account?.permissions,
                            "add"
                          ) && (
                            <button
                              type="button"
                              className="panelButton"
                              onClick={() => navigate("/meeting-add")}
                            >
                              <span className="text">Create</span>
                              <span className="icon">
                                <i className="fa-solid fa-plus"></i>
                              </span>
                            </button>
                          )}
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
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                            <option value={30}>30</option>
                          </select>
                          <label>entries</label>
                        </div>
                        {checkViewSidebar(
                          "Conference",
                          slugPermissions,
                          account?.sectionPermissions,
                          account?.permissions,
                          "search"
                        ) && (
                          <div className="searchBox position-relative">
                            <label>Search:</label>
                            <input
                              type="text"
                              name="Search"
                              placeholder="Search"
                              value={searchValue}
                              className="formItem"
                              onChange={(e) => setSearchValue(e.target.value)}
                            />
                          </div>
                        )}
                      </div>
                      <div className="tableContainer">
                        {loading ? (
                          // <SkeletonTableLoader col={8} row={15} />
                          <ThreeDotedLoader />
                        ) : (
                          <table>
                            <thead>
                              <tr>
                                <th>Conference Name</th>
                                <th>Type</th>
                                <th>Max. Members</th>
                                <th>Moderator Pin</th>
                                <th>Joining Pin</th>
                                <th>Meeting link</th>
                                <th>Recordings</th>
                                <th>Email</th>
                                {checkViewSidebar(
                                  "Conference",
                                  slugPermissions,
                                  account?.sectionPermissions,
                                  account?.permissions,
                                  "edit"
                                ) && <th>Edit</th>}
                                {checkViewSidebar(
                                  "Conference",
                                  slugPermissions,
                                  account?.sectionPermissions,
                                  account?.permissions,
                                  "delete"
                                ) && <th>Delete</th>}
                                {/* <th>Action</th> */}
                              </tr>
                            </thead>
                            <tbody>
                              {!checkViewSidebar(
                                "Conference",
                                slugPermissions,
                                account?.sectionPermissions,
                                account?.permissions,
                                "read"
                              ) ? (
                                <tr>
                                  <td colSpan={99} className="text-center">
                                    You dont have any permission
                                  </td>
                                </tr>
                              ) : (
                                <>
                                  {conference &&
                                    conference?.data?.map((item, key) => {
                                      return (
                                        <>
                                          <tr key={key}>
                                            <td>{item.conf_name}</td>
                                            <td
                                              style={{
                                                textTransform: "capitalize",
                                              }}
                                            >
                                              {item.conf_type}
                                            </td>
                                            <td>{item.conf_max_members}</td>
                                            <td>
                                              {item?.moderator_pin && (
                                                <div className="d-flex align-items-center justify-content-start ">
                                                  {moderatorPinId === item.id
                                                    ? item.moderator_pin
                                                    : "******"}
                                                  <button
                                                    onClick={() =>
                                                      setModeratorPinId(
                                                        moderatorPinId ===
                                                          item.id
                                                          ? ""
                                                          : item.id
                                                      )
                                                    }
                                                    className="clearButton2 edit ms-3"
                                                  >
                                                    <i
                                                      className={`fa-solid ${
                                                        moderatorPinId ===
                                                        item.id
                                                          ? "fa-eye"
                                                          : "fa-eye-slash"
                                                      }`}
                                                    ></i>
                                                  </button>
                                                </div>
                                              )}
                                            </td>
                                            <td>
                                              {item?.participate_pin && (
                                                <div className="d-flex align-items-center justify-content-start ">
                                                  {participantPinId === item.id
                                                    ? item.participate_pin
                                                    : "******"}
                                                  <button
                                                    onClick={() =>
                                                      setParticipantPinId(
                                                        participantPinId ===
                                                          item.id
                                                          ? ""
                                                          : item.id
                                                      )
                                                    }
                                                    className="clearButton2 edit ms-3"
                                                  >
                                                    <i
                                                      className={`fa-solid ${
                                                        participantPinId ===
                                                        item.id
                                                          ? "fa-eye"
                                                          : "fa-eye-slash"
                                                      }`}
                                                    ></i>
                                                  </button>
                                                </div>
                                              )}
                                            </td>
                                            <td
                                              style={{
                                                width: "174px",
                                                cursor: "pointer",
                                              }}
                                              onClick={() => {
                                                setCopyElement(item.conf_url);
                                                navigator.clipboard.writeText(
                                                  item.conf_url
                                                );
                                                setTimeout(() => {
                                                  setCopyElement(null);
                                                }, 1000);
                                              }}
                                              title="Click to copy"
                                            >
                                              <div className="position-relative">
                                                {item.conf_url}
                                                <div
                                                  className="smallNottif"
                                                  style={{
                                                    opacity:
                                                      item.conf_url ===
                                                      copyElement
                                                        ? 1
                                                        : 0,
                                                  }}
                                                >
                                                  <i className="fa-solid fa-check" />{" "}
                                                  Copied
                                                </div>
                                              </div>
                                            </td>
                                            <td>
                                              <div
                                                className="tableButton"
                                                onClick={() => {
                                                  setShowRecordingsPopup(true);
                                                  handleGetRecord(
                                                    item.random_str
                                                  );
                                                }}
                                              >
                                                <i className="fa-solid fa-archive"></i>
                                              </div>
                                            </td>
                                            <td>
                                              {item?.emails?.length > 0 && (
                                                <button
                                                  disabled={
                                                    !item?.recording_url &&
                                                    !item?.summary
                                                  }
                                                  className={`tableButton edit ${
                                                    !item?.recording_url &&
                                                    !item?.summary
                                                      ? "disabled"
                                                      : ""
                                                  }`}
                                                  onClick={() => {
                                                    setSelectedMeeting(item);
                                                    setSelectedEmails([]);
                                                    setSearchQuery("");
                                                    setSendEmailPopup(true);
                                                  }}
                                                >
                                                  <i className="fa-solid fa-envelope"></i>
                                                </button>
                                              )}
                                            </td>
                                            {checkViewSidebar(
                                              "Conference",
                                              slugPermissions,
                                              account?.sectionPermissions,
                                              account?.permissions,
                                              "edit"
                                            ) && (
                                              <td>
                                                <div
                                                  className="tableButton edit"
                                                  onClick={() =>
                                                    navigate(`/meeting-edit`, {
                                                      state: item,
                                                    })
                                                  }
                                                >
                                                  <i className="fa-solid fa-pen"></i>
                                                </div>
                                              </td>
                                            )}
                                            {checkViewSidebar(
                                              "Conference",
                                              slugPermissions,
                                              account?.sectionPermissions,
                                              account?.permissions,
                                              "delete"
                                            ) && (
                                              <td>
                                                <div
                                                  className="tableButton delete"
                                                  onClick={() => {
                                                    setDeleteId(item.id);
                                                    setPopUp(true);
                                                  }}
                                                >
                                                  <i className="fa-solid fa-trash"></i>
                                                </div>
                                              </td>
                                            )}
                                          </tr>
                                        </>
                                      );
                                    })}{" "}
                                </>
                              )}
                            </tbody>
                          </table>
                        )}
                      </div>
                      <div className="tableFooter">
                        {conference && conference?.data?.length > 0 ? (
                          <PaginationComponent
                            pageNumber={(e) => setPageNumber(e)}
                            totalPage={conference.last_page}
                            from={conference.from}
                            to={conference.to}
                            total={conference.total}
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
          </div>
        </section>
        {popUp ? (
          <div className="popup">
            <div className="container h-100">
              <div className="row h-100 justify-content-center align-items-center">
                <div className="row content col-xl-4 col-md-5">
                  <div className="col-2 px-0">
                    <div className="iconWrapper">
                      <i className="fa-duotone fa-triangle-exclamation"></i>
                    </div>
                  </div>
                  <div className="col-10 ps-0">
                    <h4>Warning!</h4>
                    <p>Are you sure you want to delete this Meeting?</p>
                    <div className="d-flex justify-content-between">
                      <button
                        disabled={loading}
                        className="panelButton m-0"
                        onClick={() => {
                          handleDelete();
                          setPopUp(false);
                        }}
                      >
                        <span className="text">Confirm</span>
                        <span className="icon">
                          <i className="fa-solid fa-check"></i>
                        </span>
                      </button>

                      <button
                        className="panelButton gray m-0 float-end"
                        onClick={() => {
                          setPopUp(false);
                          setDeleteId("");
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
        {viewVideoPopup ? (
          <div className="popup">
            <button
              className="clearButton2 xl bg-white"
              style={{ position: "absolute", top: 30, right: 30 }}
              onClick={() => setViewVideoPopup(false)}
            >
              <i className="fa-solid fa-xmark" />
            </button>
            <div className="w-100 h-100 d-flex justify-content-center align-items-center">
              <div className="videoContainer">
                <video ref={viewVideoRef} autoPlay controls />
              </div>
            </div>
          </div>
        ) : (
          ""
        )}
        {/* Meeting Details Or Something */}
        {showRecordingsPopup && (
          <div className="backdropContact">
            <div className="addNewContactPopup" style={{ width: "500px" }}>
              <div className="overviewTableWrapper p-0">
                <div className="overviewTableChild border-0 shadow-none">
                  <div className="col-xl-12">
                    <div className="tableContainer m-0 p-0">
                      <table>
                        <thead>
                          <tr>
                            <th>Sl No.</th>
                            <th>Date</th>
                            <th>View</th>
                            <th>Share</th>
                            <th>Delete</th>
                          </tr>
                        </thead>
                        <tbody>
                          {dataLoade && <SkeletonTableLoader col={5} row={5} />}
                          {recordData.length === 0 && !dataLoade ? (
                            <tr>
                              <td colSpan={5} className="text-center">
                                No Recordings Found
                              </td>
                            </tr>
                          ) : (
                            recordData.map((item, key) => {
                              return (
                                <tr>
                                  <td>{key + 1}</td>
                                  <td>
                                    {formatTimestamp(
                                      item?.fileUrl?.file?.startedAt
                                    )}
                                  </td>
                                  <td>
                                    <button
                                      className="tableButton"
                                      onClick={() =>
                                        handleView(
                                          item?.fileUrl?.file?.filename
                                        )
                                      }
                                    >
                                      <i className="fa-solid fa-eye" />
                                    </button>
                                  </td>
                                  <td>
                                    <button
                                      className="tableButton edit"
                                      onClick={() =>
                                        handleShare(
                                          item?.fileUrl?.file?.filename
                                        )
                                      }
                                    >
                                      <i className="fa-solid fa-share" />
                                    </button>
                                  </td>
                                  <td>
                                    <button
                                      className="tableButton delete"
                                      onClick={() => featureUnderdevelopment()}
                                    >
                                      <i className="fa-solid fa-trash" />
                                    </button>
                                  </td>
                                </tr>
                              );
                            })
                          )}
                        </tbody>
                      </table>
                    </div>
                    <div className="col-xl-12 mt-2">
                      <button
                        className="panelButton gray ms-auto"
                        onClick={() => setShowRecordingsPopup(false)}
                      >
                        <span className="text">Close</span>
                        <span className="icon">
                          <i className="fa-solid fa-caret-left"></i>
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {shareRecordingPopup && (
          <div className="backdropContact">
            <div className="addNewContactPopup">
              <div className="row">
                <div className="col-12 heading mb-0">
                  <i className="fa-light fa-share"></i>
                  <h5>Share This File</h5>
                  <p>Share this file with your peers using the method below</p>
                  <div className="border-bottom col-12" />
                  <div className="col-xl-12">
                    <div className="overviewTableWrapper p-0">
                      <div className="overviewTableChild border-0 shadow-none">
                        <div className="col-xl-12">
                          <div className="tableContainer m-0 p-0">
                            <table>
                              <thead>
                                <tr>
                                  <th>Sl No.</th>
                                  <th>Email</th>
                                  <th>View</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td>#</td>
                                  <td>#</td>
                                  <td>
                                    <input />
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                          <div className="col-xl-12 mt-2">
                            <button
                              className="panelButton gray ms-auto"
                              onClick={() => setShowRecordingsPopup(false)}
                            >
                              <span className="text">Close</span>
                              <span className="icon">
                                <i className="fa-solid fa-caret-left"></i>
                              </span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-12 mt-2">
                    <button
                      className="panelButton gray ms-auto"
                      onClick={() => setShareRecordingPopup(false)}
                    >
                      <span className="text">Close</span>
                      <span className="icon">
                        <i className="fa-solid fa-caret-left"></i>
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {sendEmailPopup && (
          <div className="popup">
            <div className="container h-100">
              <div className="row h-100 justify-content-center align-items-center ">
                <div className="content col-xl-4 col-md-5">
                  <div className="row">
                    <div className="col-12 heading">
                      <i className="fa-light fa-user-plus" />
                      <h5>Select Emails of Participants</h5>
                      <p>
                        Select Emails of Participants to send recording or
                        summary of the meeting
                      </p>
                    </div>
                    <div className="col-xl-12">
                      <div className="col-12 d-flex justify-content-between align-items-center">
                        <input
                          type="text"
                          className="formItem"
                          placeholder="Search"
                          //   name="name"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="col-xl-12 mt-3">
                      <div
                        className="tableContainer mt-0"
                        style={{ maxHeight: "calc(-400px + 100vh)" }}
                      >
                        <table>
                          <thead>
                            <tr>
                              <th>S.No</th>
                              <th>Email</th>
                              <th>
                                <input
                                  type="checkbox"
                                  checked={
                                    selectedEmails.length ===
                                    selectedMeeting?.emails?.length
                                  }
                                  onChange={() => handleSelectAllToggel()}
                                />
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {selectedMeeting &&
                            selectedMeeting?.emails?.length === 0 ? (
                              <tr>
                                <td colSpan={3} className="text-center">
                                  No Emails Found
                                </td>
                              </tr>
                            ) : (
                              selectedMeeting &&
                              selectedMeeting?.emails
                                ?.sort((a, b) => {
                                  const aMatches = a.email
                                    .toLowerCase()
                                    .includes(searchQuery.toLowerCase());
                                  const bMatches = b.email
                                    .toLowerCase()
                                    .includes(searchQuery.toLowerCase());
                                  return bMatches - aMatches;
                                })
                                .map((email, index) => (
                                  <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{email.email}</td>
                                    <td>
                                      <input
                                        type="checkbox"
                                        checked={selectedEmails.includes(
                                          email.email
                                        )}
                                        onChange={() =>
                                          handleEmailCheckBoxChange(email.email)
                                        }
                                      />
                                    </td>
                                  </tr>
                                ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <div className="col-xl-12 mt-2">
                      <div className="d-flex justify-content-between">
                        <button
                          className="panelButton gray ms-0"
                          onClick={() => setSendEmailPopup(false)}
                        >
                          <span className="text">Close</span>
                          <span className="icon">
                            <i className="fa-light fa-xmark" />
                          </span>
                        </button>
                        <div className="dropdown">
                          <button
                            disabled={selectedEmails.length === 0}
                            className="panelButton"
                            role="button"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                          >
                            <span className="text">Send</span>
                            <span className="icon">
                              <i className="fa-solid fa-send" />
                            </span>
                          </button>
                          <ul className="dropdown-menu actionBtnDropdowns collapse">
                            {/* {selectedMeeting?.recording_url && ( */}
                            <li className="dropdown-item">
                              <div className="clearButton text-align-start">
                                <i className="fa-regular fa-video me-2" /> Send
                                Recording
                              </div>
                            </li>
                            {/* )} */}
                            {/* {selectedMeeting?.summary && ( */}
                            <li className="dropdown-item">
                              <div className="clearButton text-align-start">
                                <i className="fa-regular fa-note me-2" /> Send
                                Summary
                              </div>
                            </li>
                            {/* )} */}
                            {/* {selectedMeeting?.recording_url &&
                              selectedMeeting?.summary && ( */}
                            <li className="dropdown-item">
                              <div className="clearButton text-align-start">
                                <i className="fa-regular fa-send me-2" /> Send
                                Both
                              </div>
                            </li>
                            {/* )} */}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}

export default Meeting;
