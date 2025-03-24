/* eslint-disable eqeqeq */
/* eslint-disable react-hooks/exhaustive-deps */
import Tippy from "@tippyjs/react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

const RingGroup = () => {
  const dispatch = useDispatch();
  const ringGroup = useSelector((state) => state.ringGroup);
  const ringGroupRefresh = useSelector((state) => state.ringGroupRefresh);
  const allCall = useSelector((state) => state.allCall);
  const [ringGroupData, setRingGroupData] = useState([]);
  const activeCall = useSelector((state) => state.activeCall);
  const [activeCallData, setActiveCallData] = useState([]);
  const allCallDetails = useSelector((state) => state.allCallDetails);

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
                <h4>Ring Groups</h4>
                <p>You can see a brief analysis of all the ring group</p>
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
                    <th>Members</th>
                    <th>Extension</th>
                  </tr>
                </thead>
                <tbody className="">
                  {ringGroupData &&
                    ringGroup &&
                    ringGroup.map((call, index) => (
                      <tr>
                        <td>{index + 1}</td>
                        <td>{call.name}</td>
                        <td>
                          {
                            activeCallData.filter(
                              (e) =>
                                e.dest === call.extension &&
                                (e.b_callstate === "ACTIVE" ||
                                  e.b_callstate === "HELD")
                            ).length
                          }
                        </td>
                        <td>
                          {allCallDetails?.filter_count?.filter(
                            (item) =>
                              item?.variable_dialed_extension ==
                              call?.extension &&
                              item["Call-Direction"] == "missed" &&
                              item.application_state == "ringgroup"
                          )[0]?.filter_count || 0}
                        </td>
                        <td>
                          {allCallDetails?.filter_count?.filter(
                            (item) =>
                              item?.variable_dialed_extension ==
                              call?.extension &&
                              item["Call-Direction"] == "inbound" &&
                              item.application_state == "ringgroup"
                          )[0]?.filter_count || 0}
                        </td>
                        <td>
                          {allCallDetails?.filter_count
                            ?.filter((item) => {
                              return (
                                item?.variable_dialed_extension ===
                                call?.extension &&
                                item.application_state === "ringgroup" &&
                                (item["Call-Direction"] === "inbound" ||
                                  item["Call-Direction"] === "missed")
                              );
                            })
                            .reduce(
                              (acc, current) =>
                                acc + (current?.filter_count || 0),
                              0
                            ) || 0}
                        </td>
                        <td>
                          <div className="hover-dropdown">
                            <div
                              style={{
                                color: "var(--ui-accent)",
                              }}
                              type="button"
                              data-bs-toggle="hover-dropdown"
                              aria-expanded="false"
                            >
                              <div className="avatar-container">
                                {call.ring_group_destination?.slice(0, 4).map((item, index) => {
                                  return (
                                    <Tippy key={index} content={item?.username}><i className="fa-light fa-user"></i></Tippy>
                                  )
                                })}
                                {call.ring_group_destination.length > 4 && <span>+2</span>}
                              </div>
                            </div>
                            <ul className="dropdown-menu light">
                              <li className="col-12">
                                <div className="dropdown-item fw-bold disabled">
                                  Agents
                                </div>
                              </li>
                              <div
                                style={{ columnCount: 1 }}
                              >
                                {call.ring_group_destination.slice(0, 6).map(
                                  (item, index) => (
                                    <li>
                                      <div className="dropdown-item">
                                        {item?.username}
                                      </div>
                                    </li>

                                  )
                                )}

                              </div>
                              <li className="col-12">
                                {call.ring_group_destination.length > 6 && <Link to="/ring-groups" className="dropdown-item text-center text-primary">
                                  Show More
                                </Link>}
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

export default RingGroup;
