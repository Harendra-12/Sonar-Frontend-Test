/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const CallQueueDetails = () => {
  const dispatch = useDispatch();
  const callCenter = useSelector((state) => state.callCenter);
  const callCenterRefresh = useSelector((state) => state.callCenterRefresh);
  const allCall = useSelector((state) => state.allCall);
  const [callQueue, setCallQueue] = useState([]);
  const activeCall = useSelector((state) => state.activeCall);
  const [activeCallData, setActiveCallData] = useState([]);
  // const [callCenterLoading, setCallCenterLoading] = useState(true);
  useEffect(() => {
    if (callCenterRefresh > 0) {
      const filterCallQueue = () => {
        const filteredData = [];
        if (allCall && allCall.calls && callCenter && callCenter.length > 0) {
          callCenter.forEach((obj) => {
            if (allCall.calls.length > 0) {
              allCall.calls.forEach((call) => {
                if (call["Caller-Callee-ID-Number"] === obj.extension) {
                  filteredData.push(call);
                }
              });
            }
          });
        }
        const filteredCallCenter = filteredData.filter(
          (data) => data && data["Call-Direction"] === "inbound"
        );
        // if (filteredCallCenter.length > 0) setCallCenterLoading(false);
        setCallQueue(filteredCallCenter);
      };
      filterCallQueue();
    } else {
      dispatch({
        type: "SET_CALLCENTERREFRESH",
        callCenterRefresh: callCenterRefresh + 1,
      });
    }
  }, [callCenter, allCall]);

  useEffect(() => {
    if (callCenterRefresh > 0) {
      const activeCallFilterData = [];
      if (activeCall && callCenter && callCenter.length > 0) {
        callCenter.forEach((obj) => {
          if (activeCall.length > 0) {
            activeCall.forEach((call) => {
              if (call.dest === obj.extension && call.direction === "inbound") {
                activeCallFilterData.push(call);
              }
            });
          }
        });
      }
      return setActiveCallData(activeCallFilterData);
    }
  }, [callCenter, activeCall]);

  return (
    <div className="overviewTableWrapper px-0 pt-0">
      <div className="overviewTableChild">
        <div className="d-flex flex-wrap">
          <div className="col-12">
            <div className="heading">
              <div className="content">
                <h4>Call Queue</h4>
                <p>You can see a brief analysis of all the call queues</p>
              </div>
              {/* <div className="buttonGroup">
                <button effect="ripple" className="panelButton">
                  <span className="text">Export</span>
                  <span className="icon">
                    <i className="fa-solid fa-file-csv" />
                  </span>
                </button>
              </div> */}
            </div>
          </div>
          <div
            className="col-12"
            style={{ overflow: "auto", padding: "10px 10px 0px" }}
          >
            <div className="tableContainer mt-0" style={{ height: "30vh" }}>
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Active Calls</th>
                    <th>Missed Calls</th>
                    <th>Calls Completed</th>
                    <th>Total Calls</th>
                    <th>Agents</th>
                    <th>Destination</th>
                  </tr>
                </thead>
                <tbody className="">
                  {callQueue &&
                    callCenter &&
                    callCenter.map((call, index) => (
                      <tr>
                        <td>{index + 1}</td>
                        <td>{call.queue_name}</td>
                        <td>
                          {
                            activeCallData.filter((e) => e.dest === call.extension&&( e.b_callstate === "ACTIVE" || e.b_callstate === "HELD"))
                              .length
                          }
                        </td>
                        <td>
                          {
                            callQueue.filter(
                              (data) =>
                                data["Caller-Callee-ID-Number"] === call.extension &&
                                data["variable_DIALSTATUS"] !== "SUCCESS"
                            ).length
                          }
                        </td>
                        <td>
                          {
                            callQueue.filter(
                              (data) =>
                                data["Caller-Callee-ID-Number"] === call.extension &&
                                data["variable_DIALSTATUS"] === "SUCCESS"
                            ).length
                          }
                        </td>
                        <td>
                          {
                            callQueue.filter(
                              (data) =>
                                data["Caller-Callee-ID-Number"] === call.extension
                            ).length
                          }
                        </td>
                        <td>
                          <div className="dropdown">
                            <div
                              style={{ color: 'var(--ui-accent)', textDecoration: 'underline' }}
                              type="button"
                              data-bs-toggle="dropdown"
                              aria-expanded="false"
                            >
                              {call.agents.length}
                            </div>
                            <ul className="dropdown-menu light" >
                              <li>
                                <div className="dropdown-item">
                                  <span className="fw-bold d-inline-block" style={{ width: '50px' }}>Active:</span> {
                                    call.agents.filter(
                                      (agent) => agent.status === "available"
                                    ).length
                                  }
                                </div>
                              </li>
                              <li>
                                <div className="dropdown-item">
                                  <span className="fw-bold d-inline-block" style={{ width: '50px' }}>Offline:</span> {
                                    call.agents.filter(
                                      (agent) => agent.status !== "available"
                                    ).length
                                  }
                                </div>
                              </li>
                            </ul>
                          </div>
                        </td>
                        <td>{call.extension}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CallQueueDetails;
