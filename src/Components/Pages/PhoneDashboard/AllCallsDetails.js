import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ContentLoader from "../../Loader/ContentLoader";
import { useNavigate } from "react-router-dom";

function AllCallsDetails() {
  const callDetails = useSelector((state) => state.allCall);
  const activeCall = useSelector((state) => state.activeCall);
  const navigate = useNavigate();
  const [inboundCall, setInboundCall] = useState([]);
  const [outboundCall, setOutboundCall] = useState([]);
  const [allCalls, setAllCalls] = useState([]);
  const [extensionDataLoading, setExtensionDataLoading] = useState(true);
  useEffect(() => {
    if (callDetails?.calls) {
      setExtensionDataLoading(false);
      setInboundCall(
        callDetails?.calls.filter((call) => call["Call-Direction"] === "inbound")
      );
      setOutboundCall(
        callDetails?.calls.filter(
          (call) => call["Call-Direction"] === "outbound"
        )
      );
      setAllCalls(callDetails?.calls);
    }
  }, [callDetails]);
  console.log("allCalls", callDetails);

  return (
    <>
      {callDetails ? (
        <div className="tabGroupDetails" data-id={1}>
          <div className="col-12">
            <div
              className="callItemWrapper"
              data-id={1}
              style={{ height: "auto" }}
            >
              <div class="accordion" id="accordionPanelsStayOpenExample">
                <div className="row">
                  <div className="col-4">
                    <div class="accordion-item">
                      <h2 class="accordion-header">
                        <button
                          class="accordion-button px-3"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target="#collapse1"
                          aria-expanded="false"
                          aria-controls="collapse1"
                        >
                          <div className="col-12 title text-start">
                            <i className="fa-duotone fa-phone-volume" /> All Calls{" "}
                            {extensionDataLoading && (
                              <i
                                class={"fa-regular fa-arrows-rotate fs-5 fa-spin"}
                              ></i>
                            )}
                          </div>
                        </button>
                      </h2>
                      <div id="collapse1" class="accordion-collapse collapse pb-1 show">
                        <div className="accordion-body">
                          <div class="row col-12 mx-auto gx-xxl-3 gx-xl-2">
                            <div className="col-xl-6 col-xxl-6 mt-2">
                              <div className="itemWrapperb a">
                                <div className="heading">Total Calls</div>
                                <div className="data-number">{callDetails?.totalCalls}</div>
                                <div className="label2">
                                  {100}
                                  % of total calls
                                </div>
                              </div>
                            </div>
                            <div className="col-xl-6 col-xxl-6 mt-2">
                              <div className="itemWrapperb b">
                                <div className="heading">Total Calls Completed</div>
                                <div className="data-number">
                                  {
                                    callDetails?.success
                                  }
                                </div>
                                <div className="label2">
                                  Percentage{" "}
                                  {(
                                    (callDetails?.success * 100) /callDetails?.totalCalls
                                  ).toFixed(2)}
                                  %
                                </div>
                              </div>
                            </div>
                            <div className="col-xl-6 col-xxl-6 mt-2">
                              <div className="itemWrapperb d">
                                <div className="heading">Missed Calls</div>
                                {/* <div className="data-number">{callDetails?.missed}</div> */}
                                <div className="data-number">
                                  {
                                    callDetails?.missed
                                  }
                                </div>
                                <div className="label2">
                                  Percentage{" "}
                                  {(
                                    (callDetails?.missed * 100) /callDetails?.totalCalls
                                  ).toFixed(2)}
                                  %
                                </div>
                              </div>
                            </div>
                            <div className="col-xl-6 col-xxl-6 mt-2">
                              <div
                                className="itemWrapperb a"
                                onClick={() => navigate("/active-calls")}
                                style={{ cursor: "pointer" }}
                              >
                                <div className="heading">Extensions On Calls</div>
                                <div className="data-number">
                                  {activeCall.length}
                                </div>
                                <div className="label2">
                                  Active Calls{" "}
                                  {}
                                  
                                </div>
                              </div>
                            </div>
                            {/* <div className="col-xl-6 col-xxl-4 mt-2">
                              <div className="itemWrapperb a">
                                <div className="heading">Average Talk Time</div>
                                <div className="data-number">00.00.00</div>
                                <div className="label2">Total 00.00.00</div>
                              </div>
                            </div>
                            <div className="col-xl-6 col-xxl-4 mt-2">
                              <div className="itemWrapperb a">
                                <div className="heading">Total Spent</div>
                                <div className="data-number">$0.00</div>
                                <div className="label2">N/A</div>
                              </div>
                            </div> */}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-4 px-0">
                    <div class="accordion-item">
                      <h2 class="accordion-header">
                        <button
                          class="accordion-button px-3"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target="#collapse2"
                          aria-expanded="false"
                          aria-controls="collapse2"
                        >
                          <div className="col-12 title text-start">
                            <i
                              className="fa-duotone fa-phone-arrow-down-left"
                              style={{ color: "var(--funky-boy3)" }}
                            />{" "}
                            Inbound Calls{" "}
                            {extensionDataLoading && (
                              <i
                                class={"fa-regular fa-arrows-rotate fs-5 fa-spin"}
                              ></i>
                            )}
                          </div>
                        </button>
                      </h2>
                      <div id="collapse2" class="accordion-collapse collapse pb-1 show">
                        <div class="accordion-body">
                          <div className="row col-12 mx-auto gx-xxl-3 gx-xl-2">
                            <div className="col-xl-6 col-xxl-6 mt-2">
                              <div className="itemWrapperb a">
                                <div className="heading">Total Inbound Calls</div>
                                <div className="data-number">
                                  {callDetails?.inbound?.total}
                                </div>
                                <div className="label2">
                                  {100}
                                  % of total calls
                                </div>
                              </div>
                            </div>
                            <div className="col-xl-6 col-xxl-6 mt-2">
                              <div className="itemWrapperb b">
                                <div className="heading">
                                  Inbound Calls Completed
                                </div>
                                <div className="data-number">
                                  {
                                    callDetails?.inbound?.completed
                                  }
                                </div>
                                <div className="label2">
                                  Percentage{" "}
                                  {(
                                    (callDetails?.inbound?.completed * 100) /
                                    callDetails?.inbound?.total
                                  ).toFixed(2)}
                                  %
                                </div>
                              </div>
                            </div>
                            <div className="col-xl-6 col-xxl-6 mt-2">
                              <div className="itemWrapperb d">
                                <div className="heading">Missed Inbound Calls</div>
                                <div className="data-number">
                                  {
                                    callDetails?.inbound?.missed
                                  }
                                </div>
                                <div className="label2">
                                  Percentage{" "}
                                  {(
                                   (callDetails?.inbound?.missed * 100) /
                                    callDetails?.inbound?.total
                                  ).toFixed(2)}
                                  %
                                </div>
                              </div>
                            </div>
                            <div className="col-xl-6 col-xxl-6 mt-2">
                              <div
                                className="itemWrapperb a"
                                onClick={() => navigate("/active-calls")}
                                style={{ cursor: "pointer" }}
                              >
                                <div className="heading">Extensions On Calls</div>
                                <div className="data-number">
                                  {
                                    activeCall.filter(
                                      (call) => call.direction === "inbound"
                                    ).length
                                  }
                                </div>
                                <div className="label2">
                                  Active Calls{" "}
                                 
                                </div>
                              </div>
                            </div>
                            {/* <div className="col-xl-6 col-xxl-4 mt-2">
                              <div className="itemWrapperb a">
                                <div className="heading">Average Talk Time</div>
                                <div className="data-number">00.00.00</div>
                                <div className="label2">Total 00.00.00</div>
                              </div>
                            </div>
                            <div className="col-xl-6 col-xxl-4 mt-2">
                              <div className="itemWrapperb a">
                                <div className="heading">Total Spent</div>
                                <div className="data-number">$0.00</div>
                                <div className="label2">N/A</div>
                              </div>
                            </div> */}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="accordion-item">
                      <h2 class="accordion-header">
                        <button
                          class="accordion-button px-3"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target="#collapse3"
                          aria-expanded="false"
                          aria-controls="collapse3"
                        >
                          <div className="col-12 title text-start">
                            <i
                              className="fa-duotone fa-phone-arrow-up-right"
                              style={{ color: "var(--color3)" }}
                            />{" "}
                            Outbound Calls{" "}
                            {extensionDataLoading && (
                              <i
                                class={"fa-regular fa-arrows-rotate fs-5 fa-spin"}
                              ></i>
                            )}
                          </div>
                        </button>
                      </h2>
                      <div id="collapse3" class="accordion-collapse collapse pb-1 show">
                        <div className="accordion-body">
                          <div className="row col-12 mx-auto gx-xxl-3 gx-xl-2">
                            <div className="col-xl-6 col-xxl-6 mt-2">
                              <div className="itemWrapperb a">
                                <div className="heading">Total Outbound Calls</div>
                                <div className="data-number">
                                  {callDetails?.outbound?.total}
                                </div>
                                <div className="label2">
                                  {100}
                                  % of total calls
                                </div>
                              </div>
                            </div>
                            <div className="col-xl-6 col-xxl-6 mt-2">
                              <div className="itemWrapperb b">
                                <div className="heading">
                                  Outbound Calls Completed
                                </div>
                                <div className="data-number">
                                  {
                                    callDetails?.outbound?.completed
                                  }
                                </div>
                                <div className="label2">
                                  Percentage{" "}
                                  {(
                                    (callDetails?.outbound?.completed * 100) /
                                    callDetails?.outbound?.total
                                  ).toFixed(2) || 0}
                                  %
                                </div>
                              </div>
                            </div>
                            <div className="col-xl-6 col-xxl-6 mt-2">
                              <div className="itemWrapperb d">
                                <div className="heading">Missed Outbound Calls</div>
                                <div className="data-number">
                                  {
                                    callDetails?.outbound?.missed
                                  }
                                </div>
                                <div className="label2">
                                  Percentage{" "}
                                  {(
                                    (callDetails?.outbound?.missed * 100) /
                                    callDetails?.outbound?.total
                                  ).toFixed(2) || 0}
                                  %
                                </div>
                              </div>
                            </div>
                            <div className="col-xl-6 col-xxl-6 mt-2">
                              <div className="itemWrapperb a">
                                <div className="heading">Extensions On Calls</div>
                                <div className="data-number">
                                  {
                                    activeCall.filter(
                                      (call) => call.direction === "outbound"
                                    ).length
                                  }
                                </div>
                                <div className="label2">
                                  Active Calls{" "}
                                  
                                </div>
                              </div>
                            </div>
                            {/* <div className="col-xl-6 col-xxl-4 mt-2">
                              <div className="itemWrapperb a">
                                <div className="heading">Average Talk Time</div>
                                <div className="data-number">00.00.00</div>
                                <div className="label2">Total 00.00.00</div>
                              </div>
                            </div>
                            <div className="col-xl-6 col-xxl-4 mt-2">
                              <div className="itemWrapperb a">
                                <div className="heading">Total Spent</div>
                                <div className="data-number">$0.00</div>
                                <div className="label2">N/A</div>
                              </div>
                            </div> */}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-12 row d-none">
            <div className="col-xl-6 position-relative">
              <canvas id="callsChart" />
            </div>
            <div className="col-xl-6 position-relative">
              <canvas id="usersChart" />
            </div>
          </div>
        </div>
      ) : (
        <ContentLoader />
      )}
    </>
  );
}

export default AllCallsDetails;
