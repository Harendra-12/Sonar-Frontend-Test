/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const RingGroup = () => {
  const dispatch = useDispatch();
  const ringGroup = useSelector((state) => state.ringGroup);
  const ringGroupRefresh = useSelector((state) => state.ringGroupRefresh);
  const allCall = useSelector((state) => state.allCall);
  const [ringGroupData, setRingGroupData] = useState([]);
  const activeCall = useSelector((state) => state.activeCall);
  const [activeCallData, setActiveCallData] = useState([]);
  useEffect(() => {
    if (ringGroupRefresh > 0) {
      const filterRinggroup = () => {
        const filteredData = [];
        if (allCall && allCall.calls && ringGroup && ringGroup.length > 0) {
          ringGroup.forEach((obj) => {
            if (allCall.calls.length > 0) {
              allCall.calls.forEach((call) => {
                if (call["Caller-Callee-ID-Number"] === obj.extension) {
                  filteredData.push(call);
                }
              });
            }
          });
        }
        const filteredRingGroup = filteredData.filter(
          (data) => data && data["Call-Direction"] === "inbound"
        );
        if (filteredRingGroup.length > 0) {
        }
        setRingGroupData(filteredRingGroup);
      };
      filterRinggroup();
    } else {
      dispatch({
        type: "SET_RINGGROUPREFRESH",
        ringGroupRefresh: ringGroupRefresh + 1,
      });
    }
  }, [ringGroup, allCall]);

  useEffect(() => {
    if (ringGroupRefresh > 0) {
      const activeCallFilterData = [];
      if (activeCall && ringGroup && ringGroup.length > 0) {
        ringGroup.forEach((obj) => {
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
  }, [ringGroup, activeCall]);

  return (
    <div className="overviewTableWrapper px-0 pt-0">
      <div className="overviewTableChild">
        <div className="d-flex flex-wrap">
          <div className="col-12">
            <div className="heading">
              <div className="content">
                <h4>Ring Group</h4>
                <p>You can see a brief analysis of all the ring groups</p>
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
            style={{ overflow: "auto", padding: "25px 20px 0px" }}
          >
           
            <div className="tableContainer" style={{ height: "30vh" }}>
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Total Calls</th>
                    <th>Calls Completed</th>
                    <th>Missed Calls</th>
                    <th>Active Calls</th>
                    <th style={{ width: '100px' }}>Members</th>
                    <th>Destination</th>
                  </tr>
                </thead>
                <tbody className="">
                  {ringGroupData && ringGroup && ringGroup.map((call, index) => (
                    <tr>
                      <td>{index + 1}</td>
                      <td>{call.name}</td>
                      <td>
                        {
                          ringGroupData.filter(
                            (data) =>
                              data["Caller-Callee-ID-Number"] === call.extension
                          ).length
                        }
                      </td>
                      <td>
                        {
                          ringGroupData.filter(
                            (data) =>
                              data["Caller-Callee-ID-Number"] === call.extension &&
                              data["variable_DIALSTATUS"] === "SUCCESS"
                          ).length
                        }
                      </td>
                      <td>
                        {
                          ringGroupData.filter(
                            (data) =>
                              data["Caller-Callee-ID-Number"] === call.extension &&
                              data["variable_DIALSTATUS"] !== "SUCCESS"
                          ).length
                        }
                      </td>
                      <td>
                        {
                          activeCallData.filter((e) => e.dest === call.extension)
                            .length
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
                            {call.ring_group_destination.length}
                          </div>
                          <ul className="dropdown-menu light" >
                            <li className="col-12"><div className="dropdown-item fw-bold disabled">Agents</div></li>
                            <div style={{ columnCount: call.ring_group_destination.length > 6 ? 2 : 1 }}>
                              {
                                call.ring_group_destination.map((item, index) => (
                                  <li>
                                    <div className="dropdown-item">
                                      {item.username}
                                    </div>
                                  </li>
                                ))
                              }
                            </div>
                          </ul>
                        </div>
                      </td>
                      <td>{call.extension}</td>
                    </tr>)
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RingGroup;
