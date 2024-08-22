import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { generalGetFunction } from "../../GlobalFunction/globalFunction";

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
        setRingGroupData(
          filteredData.filter(
            (data) => data && data["Call-Direction"] === "inbound"
          )
        );
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
    <div
      className="tabGroupDetails"
      data-id={2}
      // style={{ display: "none" }}
    >
      <div className="col-12">
        <div className="col-12 title text-start">
          <i className="fa-duotone fa-ball-pile" /> Ring Group{" "}
        </div>
        {ringGroupData &&
          ringGroup &&
          ringGroup.map((call) => (
            <div className="row mb-3">
              <div className="col-xl-1b">
                <div className="itemWrapperb a">
                  <div className="heading">Ring Group</div>
                  <div className="data-number" style={{ fontSize: "19px" }}>
                    {`${call.name} (${call.extension})`}
                  </div>
                  <div className="label2">N/A</div>
                </div>
              </div>
              <div className="col-xl-1b">
                <div className="itemWrapperb d">
                  <div className="heading">Total Calls</div>
                  <div className="data-number">
                    {
                      ringGroupData.filter(
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
                      ringGroupData.filter(
                        (data) =>
                          data["Caller-Callee-ID-Number"] === call.extension &&
                          data["variable_DIALSTATUS"] === "SUCCESS"
                      ).length
                    }
                  </div>
                  <div className="label2">
                    Percentage{" "}
                    {(
                      (ringGroupData.filter(
                        (data) =>
                          data["Caller-Callee-ID-Number"] === call.extension &&
                          data["variable_DIALSTATUS"] === "SUCCESS"
                      ).length /
                        ringGroupData.filter(
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
                      ringGroupData.filter(
                        (data) =>
                          data["Caller-Callee-ID-Number"] === call.extension &&
                          data["variable_DIALSTATUS"] !== "SUCCESS"
                      ).length
                    }
                  </div>
                  <div className="label2">
                    Percentage{" "}
                    {(
                      (ringGroupData.filter(
                        (data) =>
                          data["Caller-Callee-ID-Number"] === call.extension &&
                          data["variable_DIALSTATUS"] !== "SUCCESS"
                      ).length /
                        ringGroupData.filter(
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
                  <div className="data-number">
                    {
                      activeCallData.filter((e) => e.dest === call.extension)
                        .length
                    }
                  </div>
                  <div className="label2">Percentage 0%</div>
                </div>
              </div>
              <div className="col-xl-1b">
                <div className="itemWrapperb d">
                  <div className="heading">Total Extensions</div>
                  <div className="data-number">0</div>
                  <div className="label2">N/A</div>
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

export default RingGroup;
