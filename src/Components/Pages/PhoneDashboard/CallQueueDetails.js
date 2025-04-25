/* eslint-disable eqeqeq */
/* eslint-disable react-hooks/exhaustive-deps */
import Tippy from "@tippyjs/react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import CircularLoader from "../../Loader/CircularLoader";
import { generalGetFunction } from "../../GlobalFunction/globalFunction";

const CallQueueDetails = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const callCenter = useSelector((state) => state.callCenter);
  const callCenterRefresh = useSelector((state) => state.callCenterRefresh);
  const allCall = useSelector((state) => state.allCall);
  const [callQueue, setCallQueue] = useState([]);
  const activeCall = useSelector((state) => state.activeCall);
  const [activeCallData, setActiveCallData] = useState([]);
  const allCallDetails = useSelector((state) => state.allCallDetails);
  const [loading, setLoading] = useState(false);
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

  // Agent Edit
  const handleAgentClick = async (item) => {
    setLoading(true);
    if (item) {
      const apiData = await generalGetFunction(`/agents?search=${item.username}`);
      if (apiData?.status) {
        const userData = apiData.data.data[0];
        setLoading(false);
        navigate(`/agents-edit?id=${userData.id}`, {
          state: userData,
        });
      }
    }
  }

  return (
    <>
      {loading && <CircularLoader />}
      <div className="overviewTableWrapper px-0 pt-0 accordion" id="cQueueAccordion">
        <div className="overviewTableChild">
          <div className="d-flex flex-wrap">
            <div className="col-12 accordion-button p-0 border-0 bg-transparent collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOnes" aria-expanded="true" aria-controls="collapseOnes">
              <div className="heading col-12">
                <div className="content col-xxl-6 col-xl-5">
                  <h4>Call Queue</h4>
                  <p>You can see a brief analysis of all the call queues</p>
                </div>
                <div className="d-flex col">
                  <div className="col-6">
                    <div className="headingExtraInfo">
                      <div className="mx-auto">
                        <span className="badge badge-soft-primary rounded-pill"
                          // style={{ minWidth: '7vw', backgroundColor: 'var(--ui-accent)' }}>
                          style={{ minWidth: '7vw', }}>
                          Active Calls:&nbsp;
                          {activeCallData.filter((e) => e.b_callstate === "ACTIVE" || e.b_callstate === "HELD").length}
                        </span>
                      </div>
                    </div>
                    <div className="headingExtraInfo mt-1">
                      <div className="mx-auto">
                        <span className="badge badge-soft-danger rounded-pill"
                          style={{ minWidth: '7vw', }}>
                          {/* style={{ minWidth: '7vw', backgroundColor: 'var(--color3)' }}> */}
                          Missed Calls:&nbsp;
                          {allCallDetails?.filter_count?.filter(
                            (item) =>
                              item["Call-Direction"] == "missed" &&
                              item?.application_state == 'callcenter'
                          ).reduce((acc, current) => acc + (current.filter_count), 0) || 0}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="headingExtraInfo">
                      <div className="mx-auto">
                        <span className="badge badge-soft-success rounded-pill "
                          style={{ minWidth: '7vw', }}>
                          {/* style={{ minWidth: '7vw', backgroundColor: 'var(--funky-boy3)' }}> */}
                          Completed Calls:&nbsp;
                          {allCallDetails?.filter_count?.filter(
                            (item) =>
                              item["Call-Direction"] == "inbound" &&
                              item.application_state == 'callcenter'
                          ).reduce((acc, current) => acc + (current.filter_count), 0) || 0}
                        </span>
                      </div>
                    </div>
                    <div className="headingExtraInfo mt-1">
                      <div className="mx-auto">
                        <span className="badge badge-soft-secondary rounded-pill"
                          style={{ minWidth: '7vw', }}>
                          {/* style={{ minWidth: '7vw', backgroundColor: 'var(--funky-boy4)' }}> */}
                          Total Calls:&nbsp;
                          {allCallDetails?.filter_count
                            ?.filter((item) => {
                              return (
                                item.application_state === 'callcenter' &&
                                (item["Call-Direction"] === "inbound" ||
                                  item["Call-Direction"] === "missed")
                              );
                            })
                            .reduce(
                              (acc, current) =>
                                acc + (current?.filter_count || 0),
                              0
                            ) || 0}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              id="collapseOnes"
              className="col-12 accordion-collapse collapse"
              style={{ overflow: "auto", padding: "10px 10px 0px" }}
              aria-labelledby="headingOne" data-bs-parent="#cQueueAccordion"
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
                      <th>Extension</th>
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
                              activeCallData.filter((e) => e.dest === call.extension && (e.b_callstate === "ACTIVE" || e.b_callstate === "HELD"))
                                .length
                            }
                          </td>
                          <td>
                            {allCallDetails?.filter_count?.filter(
                              (item) =>
                                item?.variable_dialed_extension ==
                                call?.extension &&
                                item["Call-Direction"] == "missed" &&
                                item?.application_state == 'callcenter'
                            )[0]?.filter_count || 0}
                          </td>
                          <td>
                            {allCallDetails?.filter_count?.filter(
                              (item) =>
                                item?.variable_dialed_extension ==
                                call?.extension &&
                                item["Call-Direction"] == "inbound" &&
                                item.application_state == 'callcenter'
                            )[0]?.filter_count || 0}
                          </td>
                          <td>
                            {allCallDetails?.filter_count
                              ?.filter((item) => {
                                return (
                                  item?.variable_dialed_extension ===
                                  call?.extension &&
                                  item.application_state === 'callcenter' &&
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
                            <Tippy content={
                              <ul className="dropdown-menu-hover" style={{ columnCount: call.agents.length > 8 ? 2 : 1 }}>
                                {call.agents.map(
                                  (item, index) => (
                                    <li key={index}>
                                      <div className="dropdown-item d-flex align-items-center" onClick={() => handleAgentClick(item)}>
                                          <span className="avatar-container">
                                            {
                                              item.profile_picture ?
                                                <img
                                                  alt="profile"
                                                  src={item.profile_picture}
                                                  onError={(e) => e.target.src = require('../../assets/images/placeholder-image.webp')}
                                                /> : <i className="fa-light fa-user"></i>}
                                          </span>
                                          <span className="ms-2">{item?.username}</span>
                                        </div>
                                    </li>
                                  )
                                )}
                                {/* {call.agents.length > 6 && <li className="col-12">
                              <Link to="/agents" className="dropdown-item text-center text-primary">
                                Show More
                              </Link>
                            </li>} */}
                              </ul>
                            }
                              allowHTML={true}
                              placement="bottom"
                              interactive={true}
                              popperOptions={{ strategy: 'fixed' }}
                            >
                              <div className="hover-dropdown">
                                <div className="avatar-container">
                                  {call.agents?.slice(0, 4).map((item, index) => {
                                    return (
                                      <Tippy 
                                        key={index} 
                                        content={item?.username}
                                      >
                                        {item?.profile_picture ? (
                                          <img
                                            alt="avatar"
                                            src={item?.profile_picture}
                                            onError={(e) => e.target.src = require('../../assets/images/placeholder-image.webp')}
                                          />
                                        ) : (
                                          <i className="fa-light fa-user"></i>
                                        )}
                                      </Tippy>
                                    )
                                  })}
                                  {call.agents.length > 4 && <span>+{call?.agents?.length - 4}</span>}
                                </div>
                              </div>
                            </Tippy>
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
    </>
  );
};

export default CallQueueDetails;
