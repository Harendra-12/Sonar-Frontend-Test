/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import EFaxFile from "./EFaxFile";
import {
  featureUnderdevelopment,
  generalDeleteFunction,
  generalGetFunction,
  generalPostFunction,logout
} from "../../GlobalFunction/globalFunction";
import CircularLoader from "../../Loader/CircularLoader";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import DarkModeToggle from "../../CommonComponents/DarkModeToggle";
import { useSIPProvider } from "modify-react-sipjs";
import LogOutPopUp from "./LogOutPopUp";

function EFax() {
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
  const [loading, setLoading] = useState(true);
  const allCallCenterIds = useSelector((state) => state.allCallCenterIds);

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
          <div className="container-fluid">
            <div className="row">
              <div className="col-12 ps-xl-0">
                <div className="newHeader">
                  <div className="col-auto" style={{ padding: "0 10px" }}>
                    <h3 style={{ fontFamily: "Outfit", marginBottom: "0" }}>
                      <button
                        className="clearButton2 text-dark"
                        onClick={() => featureUnderdevelopment()}
                      >
                        <i className="fa-solid fa-chevron-left fs-4"></i>
                      </button>{" "}
                      E-Fax{" "}
                      <button className="clearButton2">
                        <i
                          className="fa-regular fa-arrows-rotate fs-5"
                          style={{ color: "var(--webUtilGray)" }}
                          onClick={() => featureUnderdevelopment()}
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
                    <div className="col-auto">
                      <div className="dropdown">
                        <div
                          className="myProfileWidget"
                          type="button"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                          {/* <div className="profileHolder" id="profileOnlineNav">
                            <img
                              src={account?.profile_picture}
                              alt="profile"
                              onError={(e) => e.target.src = require('../../assets/images/placeholder-image.webp')}
                            />
                          </div> */}
                          {/* <div className="profileName">
                            {account?.username}{" "}
                            <span className="status">Available</span>
                          </div> */}

                          <i class="fa-solid fa-right-from-bracket"></i>
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
                          <li
                            onClick={() => {
                              sessionManager.disconnect();
                            }}
                          >
                            <div
                              className="dropdown-item"
                              style={{ cursor: "pointer" }}
                            >
                              Disconnect
                            </div>
                          </li>
                          <li
                            onClick={() => {
                              sessionManager.connect();
                            }}
                          >
                            <div
                              className="dropdown-item"
                              style={{ cursor: "pointer" }}
                            >
                              Reconnect
                            </div>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-xxl-5 col-xl-6 allCallHistory pb-0">
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
                    onClick={() => setShowUserHistory(false)}
                  >
                    <i className="fa-light fa-fax" /> New Fax
                  </button>
                </div>
                <div className="col-12 mt-3" style={{ padding: "0 10px" }}>
                  <input
                    type="search"
                    name="Search"
                    id="headerSearch"
                    placeholder="Search"
                  />
                </div>

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
                        effect="ripple"
                        data-category="all"
                      >
                        All
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
                        File
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
                          className="callListItem incoming"
                          onClick={() => setShowUserHistory(true)}
                        >
                          <div className="row justify-content-between">
                            <div className="col-xl-12 d-flex">
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
                                <div className="contactTags">
                                  <span data-id="1">Received</span>
                                </div>
                                <h5 style={{ fontWeight: "400" }}>
                                  <i className="fa-light fa-paperclip"></i> 1
                                  Attachment
                                </h5>
                              </div>
                              <div className="col-1 text-end ms-auto">
                                <p className="timeAgo">12:46pm</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div data-bell="" className="callListItem outgoing">
                          <div className="row justify-content-between">
                            <div className="col-xl-12 d-flex">
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
                                <div className="contactTags">
                                  <span data-id="0">Sent</span>
                                </div>
                                <h5 style={{ fontWeight: "400" }}>
                                  <i className="fa-light fa-paperclip"></i> 1
                                  Attachment
                                </h5>
                              </div>
                              <div className="col-1 text-end ms-auto">
                                <p className="timeAgo">12:46pm</p>
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
                            <div className="row justify-content-between">
                              <div className="col-xl-6 d-flex">
                                <div
                                  className="profileHolder"
                                  id="profileOnline"
                                >
                                  {/* <i className="fa-light fa-user fs-5"></i> */}
                                  <img
                                    src={file.file_path}
                                    alt="profile"
                                    className="profileImg"
                                  />
                                </div>
                                <div className="my-auto ms-2 ms-xl-3">
                                  <h4>{file.file_name}</h4>
                                  {/* <h5>{file.file_path}</h5> */}
                                </div>
                              </div>
                              <div className="col-10 col-xl-4">
                                <div style={{ cursor: "pointer" }}>
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
                                </div>
                                <div style={{ cursor: "pointer" }}>
                                  <div className="clearButton">
                                    <a
                                      href={file?.file_path}
                                      target="_blank"
                                      rel="noreferrer"
                                    >
                                      <i className="fa-sharp fa-solid fa-eye"></i>{" "}
                                      View
                                    </a>
                                  </div>
                                </div>
                              </div>
                              <div className="col-auto text-end d-flex justify-content-center align-items-center">
                                <button
                                  className="border-0 bg-transparent"
                                  onClick={() => {
                                    setDeletePopup(true);
                                    setDeleteFile(file);
                                  }}
                                >
                                  <i className="fa-solid fa-trash text-danger"></i>
                                </button>
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
                <div
                  className="col-xxl-7 col-xl-6 callDetails eFaxCompose"
                  style={{ height: "100%" }}
                  id="callDetails"
                >
                  <div className="overviewTableWrapper p-2 mt-2">
                    <div className="overviewTableChild">
                      <div className="d-flex flex-wrap">
                        <div className="col-12">
                          <div className="heading">
                            <div className="content">
                              <h4>New Fax</h4>
                              <p>You can send a new fax from here</p>
                            </div>
                          </div>
                        </div>
                        <div
                          className="col-12"
                          style={{ padding: "0px 20px 0px" }}
                        >
                          <div className="newMessageWrapper mb-3">
                            <div>
                              {/* <div className="messageTitle">
                                <h4>New Fax</h4>
                              </div> */}
                              <div className="messageTo">
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
                                  <div className="col-auto my-auto">
                                    <input
                                      type="text"
                                      className="border-0 mb-0"
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
                                  onChange={(e) => setFaxIdent(e.target.value)}
                                  type="text"
                                />
                              </div>
                              <div className="messageBody">
                                <label>Fax Header</label>
                                <input
                                  value={faxHeader}
                                  onChange={(e) => setFaxHeader(e.target.value)}
                                />
                              </div>
                              <div className="messageBody">
                                <label>
                                  <i className="fa-regular fa-link"></i> Attach
                                  File(s) (maximum file size is 50 MB)
                                </label>
                                <div className="inputFileWrapper">
                                  {/* <input type="file" /> */}
                                  <select
                                    value={faxFileId}
                                    onChange={(e) =>
                                      setFaxDileId(e.target.value)
                                    }
                                    className="formItem"
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
              )}
              {clickStatus === "file" && (
                <EFaxFile
                  newFileUpload={newFileUpload}
                  eFaxFileLoadingState={eFaxFileLoadingState}
                />
              )}
              {clickStatus === "file" && EfaxFileLoading && (
                <div colSpan={99}>
                  <CircularLoader />
                </div>
              )}

              {/* THIS UI WILL BE SHOWN WHEN USER CLICKS A EFAX MESSAGE */}
              {showUserHistory && (
                <div
                  className="col-xxl-7 col-xl-6 callDetails eFaxCompose"
                  style={{ height: "100%" }}
                  id="callDetails"
                >
                  <div className="messageOverlay">
                    <div className="contactHeader">
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

                  <div className="overviewTableWrapper p-2 mt-2">
                    <div className="overviewTableChild">
                      <div className="d-flex flex-wrap">
                        <div className="col-12">
                          <div className="heading">
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
                                  data-bs-target="#nav-history"
                                  type="button"
                                  role="tab"
                                  aria-controls="nav-history"
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
                                <div className="callDetailsList tableContainer mt-0">
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
                                <div className="callDetailsList tableContainer mt-0">
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
        </section>
      </main>

      {deletePopup && (
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
                  <h4>Delete document</h4>
                  Are you sure you want to delete this document?
                  <br />
                  <p>{deleteFile.file_name}</p>
                  <br />
                  <div className="mt-2 d-flex justify-content-between">
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
