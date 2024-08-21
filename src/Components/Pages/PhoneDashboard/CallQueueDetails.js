import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const CallQueueDetails = () => {
  const dispatch = useDispatch();
  const callCenter = useSelector((state) => state.callCenter);
  const callCenterRefresh = useSelector((state) => state.callCenterRefresh);
  const allCall = useSelector((state) => state.allCall);
  const [callQueue, setCallQueue] = useState([]);

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
        setCallQueue(
          filteredData.filter(
            (data) => data && data["Call-Direction"] === "inbound"
          )
        );
      };
      filterCallQueue();
    } else {
      dispatch({
        type: "SET_CALLCENTERREFRESH",
        callCenterRefresh: callCenterRefresh + 1,
      });
    }
  }, [callCenter, allCall]);
  console.log("callcenter", callCenter);
  console.log("callCenter", callQueue);

  return (
    <div className="tabGroupDetails" data-id={3}>
      <div className="col-12">
        <div className="col-12 title text-start">
          <i className="fa-duotone fa-code-pull-request-draft" /> Call Queue{" "}
        </div>
        {callQueue &&
          callCenter &&
          callCenter.map((call) => (
            <div className="row mb-3">
              <div className="col-xl-1b">
                <div className="itemWrapperb a">
                  <div className="heading">Queue Name</div>
                  <div className="data-number" style={{ fontSize: "19px" }}>
                    {`${call.queue_name} (${call.extension})`}
                  </div>
                  <div className="label2">N/A</div>
                </div>
              </div>
              <div className="col-xl-1b">
                <div className="itemWrapperb b agents">
                  <div className="heading">Agents</div>
                  <div className="d-flex justify-content-between">
                    <div className="group">
                      <div className="data-number">{call.agents.length}</div>
                      <div className="label2">Total</div>
                    </div>
                    <div className="border-start" />
                    <div className="group">
                      <div className="data-number">
                        {
                          call.agents.filter(
                            (agent) => agent.status === "available"
                          ).length
                        }
                      </div>
                      <div className="label2">Active</div>
                    </div>
                    <div className="border-start" />
                    <div className="group">
                      <div className="data-number">
                        {
                          call.agents.filter(
                            (agent) => agent.status !== "available"
                          ).length
                        }
                      </div>
                      <div className="label2">Logged off</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-1b">
                <div className="itemWrapperb c">
                  <div className="heading">Total Calls</div>
                  <div className="data-number">
                    {
                      callQueue.filter(
                        (data) =>
                          data["Caller-Callee-ID-Number"] === call.extension
                      ).length
                    }
                  </div>
                  <div className="label2">100% of total calls</div>
                </div>
              </div>
              <div className="col-xl-1b">
                <div className="itemWrapperb d">
                  <div className="heading">Total Calls Completed</div>
                  <div className="data-number">
                    {
                      callQueue.filter(
                        (data) =>
                          data["Caller-Callee-ID-Number"] === call.extension &&
                          data["variable_DIALSTATUS"] === "SUCCESS"
                      ).length
                    }
                  </div>
                  <div className="label2">
                  Percentage{" "}
                    {(
                      (callQueue.filter(
                        (data) =>
                          data["Caller-Callee-ID-Number"] === call.extension &&
                          data["variable_DIALSTATUS"] === "SUCCESS"
                      ).length /
                        callQueue.filter(
                          (data) =>
                            data["Caller-Callee-ID-Number"] === call.extension
                        ).length) *
                      100
                    ).toFixed(2)}
                    %
                  </div>
                </div>
              </div>
              <div className="col-xl-1b">
                <div className="itemWrapperb c">
                  <div className="heading">Missed Calls</div>
                  <div className="data-number">
                    {
                      callQueue.filter(
                        (data) =>
                          data["Caller-Callee-ID-Number"] === call.extension &&
                          data["variable_DIALSTATUS"] !== "SUCCESS"
                      ).length
                    }
                  </div>
                  <div className="label2">
                  Percentage{" "}
                    {(
                      (callQueue.filter(
                        (data) =>
                          data["Caller-Callee-ID-Number"] === call.extension &&
                          data["variable_DIALSTATUS"] !== "SUCCESS"
                      ).length /
                        callQueue.filter(
                          (data) =>
                            data["Caller-Callee-ID-Number"] === call.extension
                        ).length) *
                      100
                    ).toFixed(2)}
                    %
                  </div>
                </div>
              </div>
              <div className="col-xl-1b">
                <div className="itemWrapperb a">
                  <div className="heading">Active Calls</div>
                  <div className="data-number">0</div>
                  <div className="label2">Percentage 0%</div>
                </div>
              </div>
              <div className="col-xl-1b">
                <div className="itemWrapperb d">
                  <div className="heading">Total Spent</div>
                  <div className="data-number">$0.00</div>
                  <div className="label2">N/A</div>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default CallQueueDetails;
