/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import EFaxFile from "./EFaxFile";
import {
  featureUnderdevelopment,
  generalDeleteFunction,
  generalGetFunction,
  generalPostFunction, logout
} from "../../GlobalFunction/globalFunction";
import CircularLoader from "../../Loader/CircularLoader";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import DarkModeToggle from "../../CommonComponents/DarkModeToggle";
import { useSIPProvider } from "modify-react-sipjs";
import LogOutPopUp from "./LogOutPopUp";
import HeaderApp from "./HeaderApp";

function EFax({ did }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [clickStatus, setClickStatus] = useState("all");
  const [allFiles, setAllFiles] = useState([]);
  const [deletePopup, setDeletePopup] = useState(false);
  const [deleteFile, setDeleteFile] = useState(null);
  const [contentLoading, setContentLoading] = useState(true);
  const [dropdownOption, setDropdownOption] = useState([]);
  const [EfaxFileLoading, setEfaxFileLoading] = useState(true);
  const [faxFileId, setFaxDileId] = useState("");
  const [destinationId, setDestinationId] = useState("");
  const [faxIdent, setFaxIdent] = useState("");
  const [faxHeader, setFaxHeader] = useState("");
  const { sessionManager } = useSIPProvider();
  const account = useSelector((state) => state.account);
  const extension = account?.extension?.extension || "";
  const [allLogOut, setAllLogOut] = useState(false);
  const [showUserHistory, setShowUserHistory] = useState(false);
  const [loading, setLoading] = useState(false);
  const allCallCenterIds = useSelector((state) => state.allCallCenterIds);
  const [uploadPopup, setUploadPopup] = useState(false);

  useEffect(() => {
    const getData = async () => {
      setContentLoading(true);
      const response = await generalGetFunction("/fax/all");
      if (response?.status) {
        setAllFiles(response.data);
        const newOptions = response.data.map((file) => ({
          value: file.id,
          label: file.file_name,
        }));

        setDropdownOption([...dropdownOption, ...newOptions]);
        setContentLoading(false);
      } else {
        setContentLoading(false);
      }
    };

    getData();
  }, []);

  const eFaxFileLoadingState = (state) => {
    setEfaxFileLoading(state);
  };

  const newFileUpload = (file) => {
    setAllFiles([...allFiles, file]);
  };

  const downloadImage = async (imageUrl, fileName) => {
    try {
      const response = await fetch(imageUrl);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);

      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading the image:", error);
    }
  };

  const sessions = useSelector((state) => state.sessions);

  const deleteDocument = async () => {
    setDeletePopup(false);
    setEfaxFileLoading(true);
    const response = await generalDeleteFunction(
      `/fax/destroy/${deleteFile.id}`
    );
    if (response.status) {
      setDeletePopup(false);
      setAllFiles(allFiles.filter((file) => file.id !== deleteFile.id));
      setEfaxFileLoading(false);
    } else {
      setDeletePopup(false);
      setEfaxFileLoading(false);
    }
  };
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
  async function sendFax() {
    if (destinationId === "") {
      toast.error("Please enter destination id");
    } else if (faxFileId === "") {
      toast.error("Please select file");
    } else if (faxIdent === "") {
      toast.error("Please enter fax identifier");
    } else if (faxHeader === "") {
      toast.error("Please enter fax header");
    } else {
      setContentLoading(true);
      const parsedData = {
        destination_caller_id_number: destinationId,
        fax_files_id: faxFileId,
        fax_ident: faxIdent,
        fax_header: faxHeader,
      };
      const response = await generalPostFunction(`/send-fax`, parsedData);
      if (response.status) {
        toast.success(response.message);
        setDestinationId("");
        setFaxDileId("");
        setFaxIdent("");
        setFaxHeader("");
        setContentLoading(false);
      } else {
        setContentLoading(false);
      }
    }
  }

  return (
    <>
      {allLogOut && (
        <LogOutPopUp setAllLogOut={setAllLogOut} handleLogOut={handleLogOut} />
      )}
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
          <div className=" ps-xl-0 stickyHeader">
            <HeaderApp title={"E-Fax"} loading={loading} setLoading={setLoading} refreshApi={() => featureUnderdevelopment()} />
          </div>
          <div className="container-fluid">
            <div className="row webrtc_newMessageUi">

              <div className=" allCallHistory col-12 col-xl-4 col-lg-4 col-xxl-3 py-3 px-0 rounded-3 pb-0">
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
                    onClick={() => setUploadPopup(true)}
                  >
                    <i className="fa-duotone fa-upload" /> Upload
                  </button>
                  {/* <div
                    onClick={() => setUploadPopup(true)}
                    style={{ cursor: "pointer" }}
                    className="clearButton fw-bold"
                  >
                    Upload <i className="fa-duotone fa-upload"></i>
                  </div> */}
                </div>
                <div className="col-12 mt-3" style={{ padding: "0 10px" }}>
                  <input
                    type="search"
                    name="Search"
                    id="headerSearch"
                    placeholder="Search"
                    className="searchStyle"
                  />
                </div>

                <div className="col-12">
                  <nav className="mt-3">
                    <div
                      className="nav nav-tabs"
                      style={{ borderBottom: "1px solid var(--me-border1)" }}
                    >
                      <button
                        onClick={() => setClickStatus("all")}
                        className={
                          clickStatus === "all" ? "tabLink active" : "tabLink"
                        }
                        effect="ripple"
                        data-category="all"
                      >
                        <i className="fa-regular fa-circle-dot me-1"></i>  All
                      </button>
                      <button
                        onClick={() => setClickStatus("file")}
                        // onClick={() => featureUnderdevelopment()}
                        className={
                          clickStatus === "file" ? "tabLink active" : "tabLink"
                        }
                        effect="ripple"
                        data-category="file"
                      >
                        <i className="fa-light fa-file me-1"></i> File
                      </button>
                      {/* <button
                        className={"tabLink"}
                        effect="ripple"
                        data-category="incoming"
                      >
                        Received
                      </button> */}
                      {/* <button
                        className={"tabLink"}
                        effect="ripple"
                        data-category="outgoing"
                      >
                        Sent
                      </button> */}
                      {/* <button
                        className={"tabLink"}
                        effect="ripple"
                        data-category="missed"
                      >
                        Failed
                      </button> */}
                    </div>
                  </nav>
                  <div className="tab-content">
                    {clickStatus === "all" && (
                      <div className="callList">
                        <div className="dateHeader">
                          <p className="fw-semibold">Today</p>
                        </div>
                        <div
                          data-bell=""
                          className="callListItem incoming wertc_iconBox border-bottom-0 border-end-0 "
                          onClick={() => setShowUserHistory(true)}
                        >
                          <div className="row justify-content-between align-items-center">
                            <div className="col-xl-12 d-flex align-items-center">
                              <div className="profileHolder">
                                <i className="fa-light fa-user fs-5"></i>
                              </div>

                              <div
                                className="col-4 my-auto ms-2 ms-xl-3"
                                style={{ cursor: "pointer" }}
                              >
                                <h4>AUSER XYZ</h4>
                                <h5 style={{ paddingLeft: "20px" }}>
                                  1 (999) 999-9999
                                </h5>
                              </div>

                              <div className="col-3 mx-auto">
                                <div className="contactTags mb-1">
                                  <span data-id="1">Received</span>
                                </div>
                                <h5 style={{ fontWeight: "400" }}>
                                  <i className="fa-light fa-paperclip"></i> 1
                                  Attachment
                                </h5>
                              </div>
                              <div className="col-2 text-end ms-auto">
                                <p className="timeAgo mb-0">12:46pm</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div data-bell="" className="callListItem outgoing wertc_iconBox border-bottom-0 border-end-0 ">
                          <div className="row justify-content-between align-items-center">
                            <div className="col-xl-12 d-flex align-items-center">
                              <div className="profileHolder">
                                <i className="fa-light fa-user fs-5"></i>
                              </div>

                              <div
                                className="col-4 my-auto ms-2 ms-xl-3"
                                style={{ cursor: "pointer" }}
                              >
                                <h4>AUSER XYZ</h4>
                                <h5 style={{ paddingLeft: "20px" }}>
                                  1 (999) 999-9999
                                </h5>
                              </div>

                              <div className="col-3 mx-auto">
                                <div className="contactTags mb-1">
                                  <span data-id="0">Sent</span>
                                </div>
                                <h5 style={{ fontWeight: "400" }}>
                                  <i className="fa-light fa-paperclip"></i> 1
                                  Attachment
                                </h5>
                              </div>
                              <div className="col-2 text-end ms-auto">
                                <p className="timeAgo mb-0">12:46pm</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    {clickStatus === "file" &&
                      allFiles.length > 0 &&
                      allFiles.map((file) => (
                        // <div className="callList">
                        <div style={{ cursor: "unset" }}>
                          <div data-bell="" className="contactListItem">
                            <div className="d-flex flex-wrap justify-content-between gap-2">
                              <div className="d-flex">
                                <div className="iconBox">
                                  <i class="fa-regular fa-file-pdf"></i>

                                </div>
                                <div className="my-auto ms-2 ms-xl-3">
                                  <h3 className="ellipsisText efaxListing">{file.file_name}</h3>
                                  {/* <h5>{file.file_path}</h5> */}
                                </div>
                              </div>
                              <div className="d-flex align-items-center gap-2 justify-content-end">
                                <button class="aitable_button bg-transparent"
                                  onClick={() =>
                                    downloadImage(
                                      file?.file_path,
                                      file?.file_name
                                    )
                                  }>
                                  <i class="fa-regular fa-arrow-down-to-line"></i>
                                </button>

                                {/* <div style={{ cursor: "pointer" }}>
                                  <div
                                    className="clearButton"
                                    onClick={() =>
                                      downloadImage(
                                        file?.file_path,
                                        file?.file_name
                                      )
                                    }
                                  >
                                    <i className="fa-solid fa-file-arrow-down"></i>{" "}
                                    Download
                                  </div>
                                </div> */}
                                <div className=" ">
                                  <a
                                    href={file?.file_path}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="aitable_button info "
                                    style={{ padding: "0.20rem 0.3rem" }}
                                  >
                                    <i className="fa-sharp fa-solid fa-eye fs-12"></i>{" "}
                                  </a>
                                </div>
                                <button
                                  className="aitable_button delete bg-transparent"
                                  onClick={() => {
                                    setDeletePopup(true);
                                    setDeleteFile(file);
                                  }}
                                >
                                  <i className="fa-solid fa-trash"></i>
                                </button>
                                {/* <div className="col-auto text-end d-flex justify-content-center align-items-center">
                                <button
                                  className="aitable_button bg-transparent"
                                  onClick={() => {
                                    setDeletePopup(true);
                                    setDeleteFile(file);
                                  }}
                                >
                                  <i className="fa-solid fa-trash text-danger"></i>
                                </button>
                              </div> */}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>

              {/* THIS UI WILL BE SHOWN TO USER BY DEFAULT OR WHEN HE CLICKS NEW EFAX */}
              {clickStatus === "all" && !showUserHistory && (
                <div className="callDetails col-12 col-xl-8 col-lg-8 col-xxl-9  newVoicemailBoxUi pe-0 eFaxCompose"
                  style={{ height: "100%" }}
                  id="callDetails"
                >
                  <div className="overviewTableWrapper p-0 ">
                    <div className="overviewTableChild">
                      <div className="d-flex flex-wrap">
                        <div className="col-12">
                          <div className="heading border-bottom-0">
                            <div className="content">
                              <h4>New Fax</h4>
                              <p>You can send a new fax from here</p>
                            </div>
                          </div>
                        </div>
                        <div className="w-100 p-3 rounded-start-0 rounded-end-0"
                          style={{
                            // border: "1px solid var(--me-border1)",
                          }} >
                          <div
                            className="col-12"

                          >
                            <div className="newMessageWrapper mt-0">
                              <div>
                                {/* <div className="messageTitle">
                                <h4>New Fax</h4>
                              </div> */}
                                <div className="messageSubject">
                                  <label>Enter Sender Number</label>
                                  <select className="formItem rounded-3 p-2 mt-1">
                                    {did && did.length > 0 ?
                                      did.filter((item) => item.default_eFax == 1 || item.is_secondary_eFax == 1)
                                        .map((item, index) => (
                                          <option key={index} value={item.did}>
                                            {item.did}{item.default_eFax == 1 ? ' - Default' : ''}
                                          </option>
                                        ))
                                      : ""
                                    }
                                  </select>
                                </div>
                                <div className="messageTo border-0">
                                  <label>Recipents</label>
                                  <div className="d-flex flex-wrap">
                                    {/* Map This in Loop */}
                                    {/* <div className="col-auto">
                                  <div style={{ width: "max-content" }}>
                                    <button className="receipentButton">
                                      johndoe@email.com
                                    </button>
                                  </div>
                                </div> */}
                                    {/* <div className="col-auto">
                                  <div style={{ width: "max-content" }}>
                                    <button className="receipentButton">
                                      johndoe@email.com
                                    </button>
                                  </div>
                                </div> */}
                                    {/* <div className="col-auto">
                                  <div style={{ width: "max-content" }}>
                                    <button className="receipentButton">
                                      johndoe@email.com
                                    </button>
                                  </div>
                                </div> */}
                                    {/* Map This in Loop */}
                                    <div className="col-auto my-auto w-100">
                                      <input
                                        type="text"
                                        className="formItem rounded-3 p-2 mt-1"
                                        value={destinationId}
                                        onChange={(e) =>
                                          setDestinationId(e.target.value)
                                        }
                                      />
                                    </div>
                                  </div>
                                </div>
                                <div className="messageSubject">
                                  <label>Fax Identifier</label>
                                  <input
                                    value={faxIdent}
                                    className="formItem rounded-3 p-2 mt-1"
                                    onChange={(e) => setFaxIdent(e.target.value)}
                                    type="text"
                                  />
                                </div>
                                <div className="messageBody">
                                  <label>Fax Header</label>
                                  <input
                                    value={faxHeader}
                                    className="formItem rounded-3 p-2"
                                    onChange={(e) => setFaxHeader(e.target.value)}
                                  />
                                </div>
                                <div className="messageBody">
                                  <label>
                                    <i className="fa-regular fa-link"></i> Attach
                                    File(s) (maximum file size is 50 MB)
                                  </label>
                                  <div className="inputFileWrapper faxSelectUnset_hover w-100">
                                    {/* <input type="file" /> */}
                                    <select
                                      value={faxFileId}

                                      onChange={(e) =>
                                        setFaxDileId(e.target.value)
                                      }
                                      className="formItem rounded-3 p-2"
                                    >
                                      <option value="" disabled>
                                        Chose file
                                      </option>
                                      {allFiles &&
                                        allFiles.map((file) => (
                                          <option value={file.id}>
                                            {file.file_name}
                                          </option>
                                        ))}
                                    </select>

                                    {/* {dropdownOption && (
                                  <Select
                                    closeMenuOnSelect={false}
                                    isMulti
                                    options={dropdownOption}
                                    value={dropdownOption.filter((option) =>
                                      selectedUsages.includes(option.value)
                                    )}
                                    styles={customStyles}
                                    onChange={(selectedOptions) => {
                                      const values = selectedOptions
                                        ? selectedOptions.map(
                                          (option) => option.value
                                        )
                                        : [];
                                      setValue("usages", values);
                                    }}
                                  />
                                )} */}
                                  </div>
                                </div>
                                <div className="buttonControl">
                                  {/* <button className="panelButton">Send Later</button> */}
                                  <button
                                    onClick={sendFax}
                                    className="panelButton"
                                  >
                                    <span className="text">Send</span>
                                    <span className="icon">
                                      <i className="fa-solid fa-paper-plane-top"></i>
                                    </span>
                                  </button>
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
              <div
                className="col-12 col-xl-8 col-lg-8 col-xxl-9 callDetails eFaxCompose"
                style={{ height: "100%" }}
              >
                <div className="row">
                  <div className="col-12 ">
                    {clickStatus === "file" && (

                      <EFaxFile
                        newFileUpload={newFileUpload}
                        eFaxFileLoadingState={eFaxFileLoadingState}
                      />
                    )}

                  </div>
                  <div className="col-12">


                    {clickStatus === "file" && EfaxFileLoading && (
                      <div colSpan={99}>
                        <CircularLoader />
                      </div>
                    )}

                    {/* THIS UI WILL BE SHOWN WHEN USER CLICKS A EFAX MESSAGE */}
                    {showUserHistory && (
                      <div className="callDetails col-12 col-xl-12 col-lg-12 col-xxl-12   newVoicemailBoxUi pe-0 eFaxCompose"
                        style={{ height: "100%" }}
                        id="callDetails"
                      >
                        <div className="messageOverlay">
                          <div className="contactHeader px-3 border-bottom-0">
                            <div>
                              <h4 className="mb-0">Test User</h4>
                              <p className="gray14 mb-0 mt-1">Extension - 1002</p>
                            </div>
                            <div className="d-flex my-auto">
                              <div className="d-flex align-items-center me-2">
                                <label className="gray14 me-2">Assigned to:</label>
                                <select className="ovalSelect">
                                  <option>Test User</option>
                                </select>
                              </div>
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

                        <div className="overviewTableWrapper p-0 mt-2">
                          <div className="overviewTableChild">
                            <div className="d-flex flex-wrap">
                              <div className="col-12">
                                <div className="heading border-bottom-0">
                                  <div className="content">
                                    <h4>E-Fax</h4>
                                    <p>You can see all of the eFax logs here</p>
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
                                        borderBottom: "1px solid var(--me-border1)",
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
                                        <i className="fa-light fa-circle-info me-1"></i> Info
                                      </button>
                                      <button
                                        className="tabLink"
                                        effect="ripple"
                                        data-bs-toggle="tab"
                                        data-bs-target="#nav-history"
                                        type="button"
                                        role="tab"
                                        aria-controls="nav-history"
                                        aria-selected="false"
                                      >
                                        <i className="fa-light fa-list-ul me-1"></i> Logs
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
                                      <div className="callDetailsList tableContainer mt-0" style={{ height: "calc(100vh - 326px)" }}>
                                        <table>
                                          <thead>
                                            <tr>
                                              <th>Date</th>
                                              <th>Time</th>
                                              <th>eFax Type</th>
                                              <th>DID / Extension</th>
                                              <th>Attachment</th>
                                            </tr>
                                          </thead>
                                          <tbody>
                                            <tr>
                                              <td
                                                style={{
                                                  color: "var(--color-subtext)",
                                                }}
                                              >
                                                Jan 16, 2022
                                              </td>
                                              <td>12:46 PM</td>
                                              <td
                                                className="incoming"
                                                style={{ paddingLeft: "30px" }}
                                              >
                                                <span>Received</span>
                                              </td>
                                              <td>1 (999) 999-9999</td>
                                              <td
                                                style={{
                                                  color: "var(--color-subtext)",
                                                }}
                                              >
                                                1 Attachment
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table>
                                      </div>
                                    </div>
                                    <div
                                      className="tab-pane fade"
                                      id="nav-history"
                                      role="tabpanel"
                                      aria-labelledby="nav-history-tab"
                                      tabIndex={1}
                                    >
                                      <div className="callDetailsList tableContainer mt-0" style={{ height: "calc(100vh - 326px)" }}>
                                        <table>
                                          <thead>
                                            <tr>
                                              <th>Date</th>
                                              <th>Time</th>
                                              <th>eFax Type</th>
                                              <th>DID / Extension</th>
                                              <th>Attachment</th>
                                            </tr>
                                          </thead>
                                          <tbody>
                                            <tr>
                                              <td
                                                style={{
                                                  color: "var(--color-subtext)",
                                                }}
                                              >
                                                Jan 16, 2022
                                              </td>
                                              <td>12:46 PM</td>
                                              <td
                                                className="incoming"
                                                style={{ paddingLeft: "30px" }}
                                              >
                                                <span>Received</span>
                                              </td>
                                              <td>1 (999) 999-9999</td>
                                              <td
                                                style={{
                                                  color: "var(--color-subtext)",
                                                }}
                                              >
                                                1 Attachment
                                              </td>
                                            </tr>
                                            <tr>
                                              <td
                                                style={{
                                                  color: "var(--color-subtext)",
                                                }}
                                              >
                                                Jan 16, 2022
                                              </td>
                                              <td>12:46 PM</td>
                                              <td
                                                className="outgoing"
                                                style={{ paddingLeft: "30px" }}
                                              >
                                                <span>Sent</span>
                                              </td>
                                              <td>1 (999) 999-9999</td>
                                              <td
                                                style={{
                                                  color: "var(--color-subtext)",
                                                }}
                                              >
                                                1 Attachment
                                              </td>
                                            </tr>
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
              </div>
            </div>
          </div>
        </section>
      </main>

      {deletePopup && (
        <div className="popup">
          <div className="container h-100">
            <div className="row h-100 justify-content-center align-items-center">
              <div className="row content col-xl-4 col-md-5">
                <div className="col-12 px-0">
                  <div className="iconWrapper">
                    <i className="fa-duotone fa-triangle-exclamation"></i>
                  </div>
                </div>
                <div className="col-12 ps-0">
                  <h4 className="text-center text-danger">Delete document</h4>
                  <p className="text-center">Are you sure you want to delete this document?</p>
                  <br />
                  <p className="text-center">{deleteFile.file_name}</p>
                  <br />
                  <div className="mt-2 d-flex justify-content-center gap-2">
                    <button
                      className="panelButton m-0"
                      onClick={deleteDocument}
                    >
                      <span className="text">Confirm</span>
                      <span className="icon">
                        <i className="fa-solid fa-check"></i>
                      </span>
                    </button>
                    <button
                      className="panelButtonWhite m-0 float-end"
                      onClick={() => setDeletePopup(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
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

export default EFax;
