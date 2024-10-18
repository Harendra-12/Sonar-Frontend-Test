import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import EFaxFile from "./EFaxFile";
import {
  generalDeleteFunction,
  generalGetFunction,
} from "../../GlobalFunction/globalFunction";
import Select from "react-select";
import { useForm } from "react-hook-form";
import CircularLoader from "../../Loader/CircularLoader";

function EFax() {
  const [clickStatus, setClickStatus] = useState("all");
  const [allFiles, setAllFiles] = useState([]);
  const [deletePopup, setDeletePopup] = useState(false);
  const [deleteFile, setDeleteFile] = useState(null);
  const [contentLoading, setContentLoading] = useState(true);
  const [dropdownOption, setDropdownOption] = useState([]);
  const { watch, setValue } = useForm();
  const [EfaxFileLoading, setEfaxFileLoading] = useState(true);

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
      console.log("response:", response);
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

  const selectedUsages = watch("usages", []);

  // Custom styles for react-select
  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      // border: '1px solid var(--color4)',
      border: "1px solid var(--color4)",
      borderRadius: "5px",
      outline: "none",
      fontSize: "14px",
      width: "100%",
      minHeight: "32px",
      height: "auto",
      boxShadow: state.isFocused ? "none" : provided.boxShadow,
      "&:hover": {
        borderColor: "var(--ui-accent)",
      },
    }),
    valueContainer: (provided) => ({
      ...provided,
      height: "auto",
      padding: "0 6px",
    }),
    input: (provided) => ({
      ...provided,
      margin: "0",
    }),
    indicatorSeparator: (provided) => ({
      display: "none",
    }),
    indicatorsContainer: (provided) => ({
      ...provided,
      height: "32px",
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      color: "#202020",
      "&:hover": {
        color: "#202020",
      },
    }),
    option: (provided, state) => ({
      ...provided,
      paddingLeft: "15px",
      paddingTop: 0,
      paddingBottom: 0,
      // backgroundColor: state.isSelected ? "transparent" : "transparent",
      "&:hover": {
        backgroundColor: "#0055cc",
        color: "#fff",
      },
      fontSize: "14px",
    }),
    menu: (provided) => ({
      ...provided,
      margin: 0,
      padding: 0,
    }),
    menuList: (provided) => ({
      ...provided,
      padding: 0,
      margin: 0,
      maxHeight: "150px",
      overflowY: "auto",
    }),
  };

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
        <section>
          <div className="container-fluid">
            <div className="row">
              <div
                className="col-12 col-xl-6 d-flex flex-wrap justify-content-between py-3 border-end"
                style={{ height: "100%" }}
              >
                <div className="col-auto">
                  <h3 style={{ fontFamily: "Outfit", color: "#444444" }}>
                    eFax <button class="clearButton"><i class="fa-regular fa-arrows-rotate fs-5" style={{ color: 'rgb(148, 148, 148)' }}></i></button>
                  </h3>
                </div>
                <div className="col-auto d-flex">
                  <div className="col-auto">
                    <button className="appPanelButton" effect="ripple">
                      <i className="fa-solid fa-message-plus"></i>
                    </button>
                  </div>
                  <div className="col-auto">
                    <button className="appPanelButton" effect="ripple">
                      <i className="fa-solid fa-gear"></i>
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
                        effect="ripple"
                        data-category="all"
                      >
                        All
                      </button>
                      <button
                        onClick={() => setClickStatus("file")}
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
                    <div className="position-relative searchBox d-flex mt-3">
                      <input
                        type="search"
                        name="Search"
                        id="headerSearch"
                        placeholder="Search"
                      />
                    </div>
                    {clickStatus === "all" && (
                      <div className="callList">
                        <div className="text-center callListItem">
                          <h5 className="fw-semibold">Today</h5>
                        </div>
                        <div data-bell="" className="contactListItem">
                          <div className="row justify-content-between">
                            <div className="col-xl-6 d-flex">
                              <div className="profileHolder" id="profileOnline">
                                <i className="fa-light fa-user fs-5"></i>
                              </div>
                              <div className="my-auto ms-2 ms-xl-3">
                                <h4>AUSER XYZ</h4>
                                <h5>1 (999) 999-9999</h5>
                              </div>
                            </div>
                            <div className="col-10 col-xl-4">
                              <h4>
                                <span>Received</span>
                              </h4>
                              <h5>1 Attachment</h5>
                            </div>
                            <div className="col-auto text-end d-flex justify-content-center align-items-center">
                              <h5>12:46pm</h5>
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
                                  <i class="fa-solid fa-trash text-danger"></i>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
              {clickStatus === "all" && (
                <div
                  className="col-12 col-xl-6 callDetails eFaxCompose"
                  style={{ height: "100%" }}
                  id="callDetails"
                >
                  <div className="profileInfoHolder">
                    <div className="profileHolder">
                      <i className="fa-light fa-user fs-3" />
                    </div>
                    <h4>1 (999) 999-9999</h4>
                    <h5>USER XYZ</h5>
                    <div className="d-flex justify-content-center align-items-center mt-3">
                      <button className="appPanelButton" effect="ripple">
                        <i className="fa-light fa-message-dots" />
                      </button>
                      <button className="appPanelButton" effect="ripple">
                        <i className="fa-light fa-phone" />
                      </button>
                      <button className="appPanelButton" effect="ripple">
                        <i className="fa-light fa-video" />
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
                          <i className="fa-regular fa-inbox-out" />
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
                        <div className="newMessageWrapper">
                          <div>
                            <div className="messageTitle">
                              <h4>New Fax</h4>
                            </div>
                            <div className="messageTo">
                              <label>To</label>
                              <div className="d-flex flex-wrap">
                                {/* Map This in Loop */}
                                {/* <div className="col-auto">
                                  <div style={{ width: "max-content" }}>
                                    <button class="receipentButton">
                                      johndoe@email.com
                                    </button>
                                  </div>
                                </div> */}
                                {/* <div className="col-auto">
                                  <div style={{ width: "max-content" }}>
                                    <button class="receipentButton">
                                      johndoe@email.com
                                    </button>
                                  </div>
                                </div> */}
                                {/* <div className="col-auto">
                                  <div style={{ width: "max-content" }}>
                                    <button class="receipentButton">
                                      johndoe@email.com
                                    </button>
                                  </div>
                                </div> */}
                                {/* Map This in Loop */}
                                <div className="col-auto my-auto">
                                  <input
                                    type="text"
                                    placeholder="Recipents"
                                    className="border-0 mb-0"
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="messageSubject">
                              <label>Cover Page</label>
                              <input type="text" placeholder="Subject" />
                            </div>
                            <div className="messageBody">
                              <label>Cover Page Note</label>
                              <textarea rows={4} />
                            </div>
                            <div className="messageBody">
                              <label>
                                <i className="fa-regular fa-link"></i> Attach
                                File(s) (maximum file size is 50 MB)
                              </label>
                              <div className="inputFileWrapper">
                                {/* <input type="file" /> */}
                                {/* <select>
                                <option value="" disabled>
                                  Chose file
                                </option>
                                {allFiles &&
                                  allFiles.map((file) => (
                                    <option value={file.id}>
                                      {file.file_name}
                                    </option>
                                  ))}
                              </select> */}
                                {dropdownOption && (
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
                                )}
                              </div>
                            </div>
                            <div className="buttonControl">
                              <button className="panelButtonWhite">
                                Cancel
                              </button>
                              {/* <button className="panelButton">Send Later</button> */}
                              <button className="panelButton"><span className="text">Send</span><span className="icon"><i class="fa-solid fa-paper-plane-top"></i></span></button>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div
                        className="tab-pane fade"
                        id="nav-history"
                        role="tabpanel"
                        aria-labelledby="nav-history-tab"
                        tabIndex={1}
                      >
                        <div className="callDetailsList">
                          <table className="mt-3">
                            <tbody>
                              <tr>
                                <td style={{ color: "#444444" }}>
                                  Jan 16, 2022
                                </td>
                                <td>12:46 PM</td>
                                <td className="incoming">
                                  <span>Received</span>
                                </td>
                                <td>1 (999) 999-9999</td>
                                <td style={{ color: "#444444" }}>
                                  1 Attachment
                                </td>
                              </tr>
                              <tr>
                                <td style={{ color: "#444444" }}>
                                  Jan 16, 2022
                                </td>
                                <td>12:46 PM</td>
                                <td className="outgoing">
                                  <span>Sent</span>
                                </td>
                                <td>1 (999) 999-9999</td>
                                <td style={{ color: "#444444" }}>
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
            </div>
          </div>
        </section>
      </main>

      {deletePopup && (
        <div className="popup">
          <div className="container h-100">
            <div className="row h-100 justify-content-center align-items-center">
              <div className="row content col-xl-4">
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
                      <span className="icon"><i class="fa-solid fa-check"></i></span>
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
