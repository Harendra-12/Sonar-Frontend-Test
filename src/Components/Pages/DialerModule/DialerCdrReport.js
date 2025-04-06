import React from "react";
import Header from "../../CommonComponents/Header";

function DialerCdrReport() {
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
                        <h4>Dialer CDR Reports</h4>
                        <p>Here are all the Dialer CDR Reports</p>
                      </div>
                      <div className="buttonGroup">
                        <button effect="ripple" className="panelButton gray">
                          <span className="text">Back</span>
                          <span className="icon">
                            <i className="fa-solid fa-caret-left" />
                          </span>
                        </button>
                        <button effect="ripple" className="panelButton">
                          <span className="text">Refresh</span>
                          <span className="icon">
                            <i className="fa-regular fa-arrows-rotate fs-5" />
                          </span>
                        </button>
                        <div className="dropdown">
                          <button effect="ripple" className="panelButton">
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
                        <select className="formItem">
                          <option value={20}>20</option>
                          <option value={30}>30</option>
                          <option value={40}>40</option>
                          <option value={50}>50</option>
                          <option value={60}>60</option>
                          <option value={70}>70</option>
                          <option value={80}>80</option>
                        </select>
                        <label>entries</label>
                      </div>
                    </div>
                    <div className="tableHeader">
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
                    </div>
                    <div className="tableContainer">
                      <table>
                        <thead>
                          <tr style={{ whiteSpace: "nowrap" }}>
                            <th>#</th>
                            <th>Time</th>

                            <th>Lead ID</th>
                            <th>Lead Tries</th>
                            <th>Hangup Cause</th>
                            <th>Duration</th>
                            <th>Agents id </th>
                            <th>AgentExtension</th>
                            <th>AgentDisposition</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="cdrTableRow">
                            <td>1</td>
                            <td>6:42:49 PM</td>
                            <td>101</td>
                            <td>1000</td>
                            <td>USER_NOT_REGISTERED</td>
                            <td>00:00:02</td>
                            <td>1002</td>
                            <td>45878</td>
                            <td>5</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div className="tableHeader mb-3">
                      <label
                        className="col-6"
                        style={{
                          fontFamily: "Roboto",
                          color: "var(--color-subtext)",
                          fontWeight: 500,
                          fontSize: 14,
                        }}
                      >
                        Showing 1 to 20 of 81 Entries.
                      </label>
                     
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
