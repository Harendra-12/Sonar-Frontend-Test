import React, { useEffect, useState } from "react";
import Header from "../../CommonComponents/Header";
import { backToTop, checkViewSidebar, featureUnderdevelopment, formatTime, formatTimeWithAMPM, generalGetFunction, useDebounce } from "../../GlobalFunction/globalFunction";
import { useNavigate } from "react-router-dom";
import PaginationComponent from "../../CommonComponents/PaginationComponent";
import EmptyPrompt from "../../Loader/EmptyPrompt";
import { toast } from "react-toastify";
import SkeletonTableLoader from "../../Loader/SkeletonTableLoader";
import ThreeDotedLoader from "../../Loader/ThreeDotedLoader";
import { useSelector } from "react-redux";

function DialerCdrReport() {
  const navigate = useNavigate();
  const [filteredData, setFilteredData] = useState([]);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [pageNumber, setPageNumber] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [refreshState, setRefreshState] = useState(false);
  const debouncedSearchTerm = useDebounce(searchQuery, 1000);
  const account = useSelector((state) => state.account);
  const slugPermissions = useSelector((state) => state?.permissions);

  async function getAllData(shouldLoad) {
    if (shouldLoad) setLoading(true);
    try {
      const response = await generalGetFunction(`/campaign/cdr?page=${pageNumber}&row_per_page=${itemsPerPage}&search=${searchQuery}`);
      if (response.status) {
        setFilteredData(response.data);
      } else {
        toast.error(response.message);
      }
      setLoading(false);
      setRefreshState(false)
    } catch (err) {
      console.log(err);
      setLoading(false);
      setRefreshState(false)
    }
  }

  // Call getAllData when pageNumber, itemsPerPage, or searchQuery changes
  useEffect(() => {
    // if (searchQuery.trim() === '') {
    //   getAllData()
    // } else {
    //   const delay = setTimeout(() => {
    //     getAllData();
    //   }, 500);

    //   return () => clearTimeout(delay);
    // }
    setRefreshState(true)
    const shouldLoad = true
    getAllData(shouldLoad);
  }, [pageNumber, itemsPerPage, debouncedSearchTerm])

  const handleRefreshBtnClicked = () => {
    setRefreshState(true)
    const shouldLoad = false
    getAllData(shouldLoad);
  }

  return (
    <main className="mainContent">
      <section id="phonePage">
        <Header title="Dialer Cdr Report" />
        <section className="py-2">
          <div className="container-fluid">
            <div className="overviewTableWrapper">
              <div className="overviewTableChild">
                <div className="d-flex flex-wrap">
                  <div className="col-12">
                    <div className="heading">
                      <div className="content">
                        <h4>Dialer CDR Reports {" "}
                          <button
                            className="clearButton"
                            onClick={handleRefreshBtnClicked}
                            disabled={refreshState}
                          >
                            <i
                              className={
                                refreshState
                                  ? "fa-regular fa-arrows-rotate fs-5 fa-spin"
                                  : "fa-regular fa-arrows-rotate fs-5"
                              }
                            ></i>
                          </button>
                        </h4>
                        <p>Here are all the Dialer CDR Reports</p>
                      </div>
                      <div className="buttonGroup">
                        <button className="panelButton gray"
                          onClick={() => {
                            navigate(-1);
                            backToTop();
                          }}
                        >
                          <span className="text">Back</span>
                          <span className="icon">
                            <i className="fa-solid fa-caret-left" />
                          </span>
                        </button>
                        {/* <button className="panelButton" onClick={getAllData}>
                          <span className="text">Refresh</span>
                          <span className="icon">
                            <i className="fa-regular fa-arrows-rotate fs-5" />
                          </span>
                        </button> */}
                        <div className="dropdown">
                          <button className="panelButton" onClick={() => featureUnderdevelopment()}>
                            <span className="text">Export</span>
                            <span className="icon">
                              <i className="fa-solid fa-file-export" />
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className="col-12"
                    style={{ overflow: "auto", padding: "25px 20px 0px" }}
                  >
                    <div className="tableHeader">
                      <div className="showEntries">
                        <label>Show</label>
                        <select className="formItem"
                          value={itemsPerPage}
                          onChange={(e) => {
                            setItemsPerPage(e.target.value);
                          }}
                        > <option value={10}>10</option>
                          <option value={20}>20</option>
                          <option value={30}>30</option>
                        </select>
                        <label>entries</label>
                      </div>
                      {checkViewSidebar(
                        "Campaign",
                        slugPermissions,
                        account?.sectionPermissions,
                        account?.permissions,
                        "search"
                      ) && <div className="searchBox position-relative">
                          <label>Search:</label>
                          <input
                            type="search"
                            name="Search"
                            value={searchQuery}
                            className="formItem"
                            onChange={(e) => setSearchQuery(e.target.value)}
                          />
                        </div>
                      }
                    </div>
                    {/* <div className="tableHeader">
                      <div className="d-flex justify-content-xl-end">
                        <div className="formRow border-0">
                          <label className="formLabel text-start mb-0 w-100">
                            Date Filter
                          </label>
                          <select className="formItem">
                            <option value="date">Single Date</option>
                            <option value="date_range">Date Range</option>
                            <option value="7_days">Last 7 Days</option>
                            <option value="1_month">Last 1 Month</option>
                            <option value="3_month">Last 3 Months</option>
                          </select>
                        </div>
                        <div className="formRow border-0">
                          <label className="formLabel text-start mb-0 w-100">
                            Choose Date
                          </label>
                          <input
                            type="date"
                            className="formItem"
                            max="2025-04-03"
                            defaultValue=""
                          />
                        </div>
                        <div className="formRow border-0">
                          <label className="formLabel text-start mb-0 w-100">
                            Call Origin
                          </label>
                          <input
                            type="text"
                            className="formItem"
                            defaultValue=""
                          />
                        </div>
                        <div className="formRow border-0">
                          <label className="formLabel text-start mb-0 w-100">
                            Call Destination
                          </label>
                          <input
                            type="text"
                            className="formItem"
                            defaultValue=""
                          />
                        </div>
                        <div className="formRow border-0">
                          <label className="formLabel text-start mb-0 w-100">
                            Call Direction
                          </label>
                          <select className="formItem">
                            <option value="">All Calls</option>
                            <option value="inbound">Inbound Calls</option>
                            <option value="outbound">Outbound Calls</option>
                            <option value="internal">Internal Calls</option>
                          </select>
                        </div>
                        <div className="formRow border-0">
                          <label className="formLabel text-start mb-0 w-100">
                            Call Type
                          </label>
                          <select className="formItem">
                            <option value="">All Calls</option>
                            <option value="extension">Extension</option>
                            <option value="voicemail">Voice Mail</option>
                            <option value="callcenter">Call Center</option>
                            <option value="ringgroup">Ring Group</option>
                          </select>
                        </div>
                        <div className="formRow border-0">
                          <label className="formLabel text-start mb-0 w-100">
                            Hangup Status
                          </label>
                          <select className="formItem">
                            <option value="">All</option>
                            <option value="Answered">Answer</option>
                            <option value="Missed">Missed</option>
                            <option value="Voicemail">Voicemail</option>
                            <option value="Cancelled">Cancelled</option>
                            <option value="Failed">Failed</option>
                          </select>
                        </div>
                        <div className="formRow border-0 pe-xl-0">
                          <label className="formLabel text-start mb-0 w-100">
                            Hangup Cause
                          </label>
                          <select className="formItem">
                            <option value="">All</option>
                            <option value="NORMAL_CLEARING">
                              Normal Clearing
                            </option>
                            <option value="ORIGINATOR_CANCEL">
                              Originator Cancel
                            </option>
                            <option value="MANAGER_REQUEST">
                              Manager Request
                            </option>
                            <option value="NO_ANSWER">No Answer</option>
                            <option value="INVALID_GATEWAY">
                              Invalid Gateway
                            </option>
                            <option value="SERVICE_UNAVAILABLE">
                              Service Unavailable
                            </option>
                            <option value="INCOMPATIBLE_DESTINATION">
                              Incompatible Destination
                            </option>
                            <option value="NO_USER_RESPONSE">
                              No User Response
                            </option>
                            <option value="MEDIA_TIMEOUT">Media Timeout</option>
                            <option value="LOSE_RACE">Lose Race</option>
                            <option value="NORMAL_UNSPECIFIED">
                              Normal Unspecified
                            </option>
                            <option value="USER_BUSY">User Busy</option>
                            <option value="RECOVERY_ON_TIMER_EXPIRE">
                              Recovery On Timer Expire
                            </option>
                            <option value="USER_NOT_REGISTERED">
                              User Not Registered
                            </option>
                            <option value="CALL_REJECTED">Call Rejected</option>
                            <option value="SUBSCRIBER_ABSENT">
                              Subscriber Absent
                            </option>
                            <option value="CHAN_NOT_IMPLEMENTED">
                              Chan Not Implemented
                            </option>
                            <option value="DESTINATION_OUT_OF_ORDER">
                              Destination Out Of Order
                            </option>
                            <option value="NORMAL_TEMPORARY_FAILURE">
                              Normal Temporary Failure
                            </option>
                            <option value="NO_ROUTE_DESTINATION">
                              No Route Destination
                            </option>
                            <option value="ALLOTTED_TIMEOUT">
                              Allotted Timeout
                            </option>
                            <option value="INVALID_NUMBER_FORMAT">
                              Invalid Number Format
                            </option>
                          </select>
                        </div>
                      </div>
                    </div> */}
                    <div className="tableContainer mt-3">
                      {loading ?
                        // <SkeletonTableLoader row={15} col={11} />
                        <ThreeDotedLoader />
                        :
                        <table>
                          <thead>
                            <tr style={{ whiteSpace: "nowrap" }}>
                              <th>#</th>
                              <th>Agent Name</th>
                              <th>Extension</th>
                              <th>Campaign Name</th>
                              <th>Campaign Type</th>
                              <th>Customer Name</th>
                              <th>Customer Number</th>
                              <th>Duration</th>
                              <th>Disposition</th>
                              <th>Hangup Cause</th>
                              <th>Date</th>
                              <th>Time</th>
                            </tr>
                          </thead>
                          <tbody>
                            {!checkViewSidebar(
                              "Campaign",
                              slugPermissions,
                              account?.sectionPermissions,
                              account?.permissions,
                              "read"
                            ) ? <tr><td colSpan={99}>You dont have any permission</td></tr> :
                              filteredData && filteredData?.data?.length > 0 ? (
                                filteredData?.data?.map((item, index) => (
                                  <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{item?.agent || 'N/A'}</td>
                                    <td>{item?.extension || 'N/A'}</td>
                                    <td>{item?.campaign_title || 'N/A'}</td>
                                    <td style={{ textTransform: 'capitalize' }}>{item?.camp_type || 'N/A'}</td>
                                    <td>{item?.customer || 'N/A'}</td>
                                    <td>{item?.phone_number || 'N/A'}</td>
                                    <td>{item.duration ? formatTime(item?.duration) : 'N/A'}</td>
                                    <td style={{ textTransform: 'capitalize' }}>{item.ext_dispo?.replace(/_/g, ' ') || 'N/A'}</td>
                                    <td>{item?.hangup_cause || 'N/A'}</td>
                                    <td>{item.created_at ? item?.created_at?.split(" ")[0] : 'N/A'}</td>
                                    <td>{item.created_at ? formatTimeWithAMPM(item?.created_at?.split(" ")[1]) : 'N/A'}</td>
                                  </tr>
                                ))
                              ) : (
                                <tr>
                                  <td colSpan={99} className="text-center">
                                    <EmptyPrompt generic={true} />
                                  </td>
                                </tr>
                              )}
                          </tbody>
                        </table>
                      }
                    </div>
                    <div className="tableHeader mb-3">
                      {filteredData && filteredData?.data?.length > 0 ? (
                        <PaginationComponent
                          pageNumber={(e) => setPageNumber(e)}
                          totalPage={filteredData.last_page}
                          from={filteredData.from}
                          to={filteredData.to}
                          total={filteredData.total}
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
        </section>
      </section>
    </main>
  );
}

export default DialerCdrReport;
