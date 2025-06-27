/* eslint-disable eqeqeq */
/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import {
  checkTimeDifference,
  checkViewSidebar,
  formatDateTime,
  generalGetFunction,
  useDebounce,
} from "../../../GlobalFunction/globalFunction";
import ContentLoader from "../../../Loader/ContentLoader";
import { useDispatch, useSelector } from "react-redux";
import { set } from "date-fns";
import EmptyPrompt from "../../../Loader/EmptyPrompt";
import ThreeDotedLoader from "../../../Loader/ThreeDotedLoader";
import axios from "axios";
import PaginationComponent from "../../../CommonComponents/PaginationComponent";
import HeaderApp from "../HeaderApp";
import CircularLoader from "../../../Loader/CircularLoader";

const ConferenceConfig = ({ setactivePage, setConferenceToggle, setConferenceId, pin, calling, setCalling, setIsConferenceCall, setIsConferenceAdmin, setConferenceInfo }) => {
  const [loading, setLoading] = useState(false);
  const [spinLoading, setSpinLoading] = useState(false);
  const [allConferences, setAllConferences] = useState([]);
  const [conferenceRefresh, setConferenceRefresh] = useState(0);
  const dispatch = useDispatch();
  const sessions = useSelector((state) => state.sessions);
  const [error, setError] = useState("");
  const [selectedTab, setselectedTab] = useState("conf-list-tab");
  const videoRef = useRef(null);           // Reference to the video element
  const streamRef = useRef(null);          // Reference to store the media stream
  const [videoEnable, setVideoEnable] = useState(true); // State to track video status
  const [token, setToken] = useState(null);
  const [serverUrl, setServerUrl] = useState(null);

  const [pageNumber, setPageNumber] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchValue, setSearchValue] = useState("");
  const debouncedSearch = useDebounce(searchValue, 1000);
  const [joinAsModPopup, setJoinAsModPopup] = useState(false);
  const [moderatorPassword, setModeratorPassword] = useState("");

  const account = useSelector((state) => state.account);
  const slugPermissions = useSelector((state) => state?.permissions);

  // Initial API call to get all conference data
  useEffect(() => {
    async function getData() {
      setLoading(true);
      try {
        let url;
        if (account.usertype !== "Company" && account.usertype !== "SupreAdmin") {
          url = `/conference/get-user-conferences?page=${pageNumber}&row_per_page=${itemsPerPage}&search=${debouncedSearch}`;
        } else {
          url = `/conference/all?page=${pageNumber}&row_per_page=${itemsPerPage}&search=${debouncedSearch}`
        }
        const apiData = await generalGetFunction(url);
        if (apiData?.status) {
          setAllConferences(apiData.data);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }
    getData();
  }, [conferenceRefresh]);


  // Refresh Conference Data
  const handleConferenceRefresh = () => {
    setLoading(true);
    setConferenceRefresh(conferenceRefresh + 1);
  };

  // Conference Join Function
  const handleConferenceJoin = async (item) => {
    setSpinLoading(true)
    setIsConferenceCall(true);
    try {
      const urlObj = new URL(item.conf_url)
      const param = urlObj.searchParams.get("id");
      dispatch({
        type: "SET_ROOMID",
        RoomID: param
      })
    } catch (err) {
      console.log(err)
    } finally {
      setConferenceInfo(item)
      setTimeout(() => {
        setCalling(true);
        setSpinLoading(false);
      }, 1000)
    }
  }

  const checkModeratorPassword = (item) => {
    if (moderatorPassword.trim() == "") {
      toast.error("Please enter moderator password");
      return false
    }
    if (moderatorPassword == item) {
      setIsConferenceAdmin(true);
      setJoinAsModPopup(false)
      return true
    } else {
      toast.error("Incorrect moderator password");
      return false
    }
  }
  return (
    <>
      {spinLoading && <CircularLoader />}
      <main
        className="mainContentApp"
        style={{
          marginRight:
            sessions.length > 0 && Object.keys(sessions).length > 0
              ? "250px"
              : "0",
        }}
      >
        <section id="phonePage">
          <div className="w-100 p-0">
            <HeaderApp
              title={"Conference"}
              loading={loading}
              setLoading={setLoading}
              refreshApi={handleConferenceRefresh}
            />
          </div>
          <div className="col-xl-12">
            <div className="overviewTableWrapper">
              <div className="overviewTableChild">
                <div className="d-flex flex-wrap">
                  <div className="col-12">
                    <div className="heading">
                      <div className="content">
                        <h4>Join a Conference
                          <button className="clearButton ms-2" onClick={handleConferenceRefresh}>
                            <i
                              className={
                                loading
                                  ? "fa-regular fa-arrows-rotate fs-5 fa-spin"
                                  : "fa-regular fa-arrows-rotate fs-5"
                              }
                            ></i>
                          </button>
                        </h4>
                        <p>
                          You are assigned to the following conferences
                        </p>
                      </div>
                    </div>
                  </div>
                  <div
                    className="col-12"
                    style={{
                      padding: "25px 23px",
                    }}
                  >
                    <div className="tab-content" id="nav-tabContent">
                      <div
                        className={`tab-pane fade ${selectedTab == "conf-list-tab" ? 'show active' : ""}`}
                        id="conf-list"
                        role="tabpanel"
                        aria-labelledby="conf-list"
                        tabIndex="0"
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
                          {loading ? <ThreeDotedLoader /> :
                            <table>
                              <thead>
                                <tr>
                                  <th>Conference Name</th>
                                  <th>Meeting link</th>
                                  <th>Scheduled Time</th>
                                  <th>Action</th>
                                </tr>
                              </thead>
                              <tbody>
                                <>
                                  {allConferences && allConferences?.data?.length > 0 ?
                                    allConferences?.data?.map((item) => {
                                      const isUser = account.usertype !== "Company" && account.usertype !== 'SupreAdmin';
                                      const isLessThan5Minutes = item?.conf_start_time ? checkTimeDifference(formatDateTime(item?.conf_start_time)) : false;
                                      const isAllDay = item?.conf_start_time == null ? true : false;
                                      return (
                                        <tr key={item.id}>
                                          <td>{item.conf_name}</td>
                                          <td>{item.conf_url}</td>
                                          <td>{item?.conf_start_time ? formatDateTime(item?.conf_start_time) : "All Day"}</td>
                                          <td>
                                            {(isAllDay || isLessThan5Minutes) && isUser ? (
                                              <div className="dropdown">
                                                <div className="tableButton" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                                  <i className="fa-solid fa-send"></i>
                                                </div>
                                                <ul className="dropdown-menu actionBtnDropdowns">
                                                  <li className="dropdown-item" onClick={() => handleConferenceJoin(item)}>
                                                    <div className="clearButton text-align-start">
                                                      <i className="fa-regular fa-user me-2" /> Join
                                                    </div>
                                                  </li>
                                                  <li className="dropdown-item" onClick={() => setJoinAsModPopup(true)}>
                                                    <div className="clearButton text-align-start">
                                                      <i className="fa-regular fa-gear me-2" /> Join as Mod
                                                    </div>
                                                  </li>
                                                </ul>
                                                {joinAsModPopup && (
                                                  <div className="popup" >
                                                    <div className="container h-100">
                                                      <div className="d-flex h-100 justify-content-center align-items-center">
                                                        <div className="row content col-xxl-4 col-xl-5 col-md-6">
                                                          <div className="col-12 px-0">
                                                            <div className="iconWrapper mb-3">
                                                              <i className="fa-duotone fa-circle-exclamation" />
                                                            </div>
                                                          </div>
                                                          <div className="col-12 ps-0 pe-0 text-center">
                                                            <h4 className="text-center text-orange">Join as Moderator!</h4>
                                                            <p className="mb-2">
                                                              Please input your moderator password to join as moderator
                                                            </p>
                                                            <input type="password" className="formItem" value={moderatorPassword} onChange={(e) => setModeratorPassword(e.target.value)} />
                                                            <div className="d-flex justify-content-center align-items-center gap-2 mt-3">
                                                              <button className="panelButton gray m-0" onClick={() => { setJoinAsModPopup(false); setModeratorPassword("") }}>
                                                                <span className="text">Close</span>
                                                                <span className="icon">
                                                                  <i className="fa-solid fa-xmark" />
                                                                </span>
                                                              </button>
                                                              <button className="panelButton m-0" onClick={() => checkModeratorPassword(item?.moderator_pin) ? handleConferenceJoin(item) : ""}>
                                                                <span className="text">Join</span>
                                                                <span className="icon">
                                                                  <i className="fa-solid fa-send" />
                                                                </span>
                                                              </button>
                                                            </div>
                                                          </div>
                                                        </div>
                                                      </div>
                                                    </div>
                                                  </div>
                                                )}
                                              </div>
                                            ) : !isUser ? (
                                              <div className="tableButton" onClick={() => { handleConferenceJoin(item); setIsConferenceAdmin(true) }}>
                                                <i className="fa-solid fa-send"></i>
                                              </div>
                                            ) : ""}
                                          </td>
                                        </tr>
                                      );
                                    }) : <tr><td colSpan={99}><EmptyPrompt generic={true} /></td></tr>}{" "}
                                </>
                              </tbody>
                            </table>
                          }
                        </div>
                        <div className="tableFooter">
                          {allConferences && allConferences?.data?.length > 0 ? (
                            <PaginationComponent
                              pageNumber={(e) => setPageNumber(e)}
                              totalPage={allConferences.last_page}
                              from={allConferences.from}
                              to={allConferences.to}
                              total={allConferences.total}
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
          </div>
        </section>
      </main>
    </>
  );
};

export default ConferenceConfig;
