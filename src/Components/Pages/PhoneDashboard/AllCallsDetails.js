import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ContentLoader from "../../Loader/ContentLoader";
import { useNavigate } from "react-router-dom";

function AllCallsDetails() {
  const callDetails = useSelector((state) => state.allCall);
  const activeCall = useSelector((state) => state.activeCall);
  const navigate = useNavigate();
  const [extensionDataLoading, setExtensionDataLoading] = useState(true);
  useEffect(() => {
    if (callDetails?.calls) {
      setExtensionDataLoading(false);
    }
  }, [callDetails]);
  console.log("allCalls", callDetails);

  return (
    <>
      {callDetails ? (
        <div class="accordion dashboard" id="accordionPanelsStayOpenExample">
          <div className="row">
            <div className="col-4">
              <div class="accordion-item itemWrapper a h-auto">
                <h2 class="accordion-header">
                  <button
                    class="accordion-button"
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
                          class={"ms-2 fa-regular fa-arrows-rotate fs-5 fa-spin"}
                        ></i>
                      )}
                    </div>
                  </button>
                </h2>
                <div id="collapse1" class="accordion-collapse collapse show">
                  <div className="accordion-body">
                    <div class="row g-3">
                      <div className="col-xl-6 col-xxl-6">
                        <div className="itemWrapper a shadow-none" style={{ border: '1px solid var(--border-color)' }}>
                          <div className="heading h-auto">
                            <div className="d-flex flex-wrap justify-content-between">
                              <div className="col-9">
                                <h3 style={{ fontWeight: 900 }}>
                                  {/* {callDetails?.totalCalls !== undefined ? callDetails?.totalCalls :
                                    <i className={"fa-regular fa-arrows-rotate fs-5 fa-spin shadow-none bg-transparent float-start"} ></i>} */}
                                  {callDetails?.totalCalls !== undefined ? callDetails?.totalCalls :
                                    <i className={"fa-regular fa-arrows-rotate fs-5 fa-spin shadow-none bg-transparent float-start w-auto h-auto"} ></i>}
                                </h3>
                                <p>Total Calls</p>
                              </div>
                              <div className="col-3">
                                <i className="fa-solid fa-phone-volume"></i>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-xl-6 col-xxl-6">
                        <div className="itemWrapper b shadow-none" style={{ border: '1px solid var(--border-color)' }}>
                          <div className="heading h-auto">
                            <div className="d-flex flex-wrap justify-content-between">
                              <div className="col-9">
                                <h3 style={{ fontWeight: 900 }}>
                                  {
                                    callDetails?.success !== undefined ? callDetails?.success : <i
                                      class={"fa-regular fa-arrows-rotate fs-5 fa-spin shadow-none bg-transparent float-start w-auto h-auto"}
                                    ></i>
                                  }
                                </h3>
                                <p>Total Calls Completed</p>
                                {/* <div className="label2">
                                  Percentage{" "}
                                  {((
                                    (callDetails?.success * 100) / callDetails?.totalCalls
                                  ).toFixed(2)) ? ((
                                    (callDetails?.success * 100) / callDetails?.totalCalls
                                  ).toFixed(2)) : <i
                                    class={"fa-regular fa-arrows-rotate fs-5 fa-spin"}
                                  ></i>}
                                  %
                                </div> */}
                              </div>
                              <div className="col-3">
                                <i className="fa-solid fa-circle-check"></i>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-xl-6 col-xxl-6">
                        <div className="itemWrapper c shadow-none" style={{ border: '1px solid var(--border-color)' }}>
                          <div className="heading h-auto">
                            <div className="d-flex flex-wrap justify-content-between">
                              <div className="col-9">
                                <h3 style={{ fontWeight: 900 }}>
                                  {
                                    callDetails?.missed !== undefined ? callDetails?.missed : <i
                                      class={"fa-regular fa-arrows-rotate fs-5 fa-spin shadow-none bg-transparent float-start w-auto h-auto"}
                                    ></i>
                                  }
                                </h3>
                                <p>Missed Calls</p>
                                {/* <div className="label2">
                                  Percentage{" "}
                                  {((
                                    (callDetails?.missed * 100) / callDetails?.totalCalls
                                  ).toFixed(2)) ? ((
                                    (callDetails?.missed * 100) / callDetails?.totalCalls
                                  ).toFixed(2)) : <i
                                    class={"fa-regular fa-arrows-rotate fs-5 fa-spin"}
                                  ></i>}
                                  %
                                </div> */}
                              </div>
                              <div className="col-3">
                                <i className="fa-solid fa-phone-hangup"></i>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-xl-6 col-xxl-6">
                        <div className="itemWrapper d shadow-none" style={{ border: '1px solid var(--border-color)' }}>
                          <div className="heading h-auto">
                            <div className="d-flex flex-wrap justify-content-between">
                              <div className="col-9">
                                <h3 style={{ fontWeight: 900 }}>
                                  {activeCall.length}
                                </h3>
                                <p>Extensions On Calls</p>
                              </div>
                              <div className="col-3">
                                <i className="fa-solid fa-phone-intercom"></i>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-4 px-0">
              <div class="accordion-item itemWrapper a h-auto">
                <h2 class="accordion-header">
                  <button
                    class="accordion-button"
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
                <div id="collapse2" class="accordion-collapse collapse show">
                  <div class="accordion-body">
                    <div className="row g-3">
                      <div className="col-xl-6 col-xxl-6">
                        <div className="itemWrapper a shadow-none" style={{ border: '1px solid var(--border-color)' }}>
                          <div className="heading h-auto">
                            <div className="d-flex flex-wrap justify-content-between">
                              <div className="col-9">
                                <h3 style={{ fontWeight: 900 }}>
                                  {callDetails?.inbound?.total !== undefined ? callDetails?.inbound?.total : <i
                                    class={"fa-regular fa-arrows-rotate fs-5 fa-spin shadow-none bg-transparent float-start w-auto h-auto"}
                                  ></i>}
                                </h3>
                                <p>Total Inbound Calls</p>
                              </div>
                              <div className="col-3">
                                <i className="ms-2 fa-solid fa-phone-arrow-down-left"></i>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-xl-6 col-xxl-6">
                        <div className="itemWrapper b shadow-none" style={{ border: '1px solid var(--border-color)' }}>
                          <div className="heading h-auto">
                            <div className="d-flex flex-wrap justify-content-between">
                              <div className="col-9">
                                <h3 style={{ fontWeight: 900 }}>
                                  {
                                    callDetails?.inbound?.completed !== undefined ? callDetails?.inbound?.completed : <i
                                      class={"fa-regular fa-arrows-rotate fs-5 fa-spin shadow-none bg-transparent float-start w-auto h-auto"}
                                    ></i>
                                  }
                                </h3>
                                <p> Inbound Calls Completed</p>
                                {/* <div className="label2">
                                  Percentage{" "}
                                  {((
                                    (callDetails?.inbound?.completed * 100) /
                                    callDetails?.inbound?.total
                                  ).toFixed(2)) ? ((
                                    (callDetails?.inbound?.completed * 100) /
                                    callDetails?.inbound?.total
                                  ).toFixed(2)) : <i
                                    class={"fa-regular fa-arrows-rotate fs-5 fa-spin"}
                                  ></i>}
                                  %
                                </div> */}
                              </div>
                              <div className="col-3">
                                <i className="fa-solid fa-circle-check"></i>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-xl-6 col-xxl-6">
                        <div className="itemWrapper c shadow-none" style={{ border: '1px solid var(--border-color)' }}>
                          <div className="heading h-auto">
                            <div className="d-flex flex-wrap justify-content-between">
                              <div className="col-9">
                                <h3 style={{ fontWeight: 900 }}>
                                  {
                                    callDetails?.inbound?.missed !== undefined ? callDetails?.inbound?.missed : <i
                                      class={"fa-regular fa-arrows-rotate fs-5 fa-spin shadow-none bg-transparent float-start w-auto h-auto"}
                                    ></i>
                                  }
                                </h3>
                                <p>Missed Inbound Calls</p>
                                {/* <div className="label2">
                                  {((
                                    (callDetails?.inbound?.missed * 100) /
                                    callDetails?.inbound?.total
                                  ).toFixed(2)) ? ((
                                    (callDetails?.inbound?.missed * 100) /
                                    callDetails?.inbound?.total
                                  ).toFixed(2)) : <i
                                    class={"fa-regular fa-arrows-rotate fs-5 fa-spin"}
                                  ></i>}
                                  %
                                </div> */}
                              </div>
                              <div className="col-3">
                                <i className="fa-solid fa-phone-hangup"></i>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-xl-6 col-xxl-6">
                        <div className="itemWrapper d shadow-none" style={{ border: '1px solid var(--border-color)' }}>
                          <div className="heading h-auto">
                            <div className="d-flex flex-wrap justify-content-between">
                              <div className="col-9">
                                <h3 style={{ fontWeight: 900 }}>
                                  {
                                    activeCall.filter(
                                      (call) => call.direction === "inbound"
                                    ).length
                                  }
                                </h3>
                                <p>Extensions On Calls</p>
                                {/* <div className="label2">
                                  {((
                                    (callDetails?.inbound?.missed * 100) /
                                    callDetails?.inbound?.total
                                  ).toFixed(2)) ? ((
                                    (callDetails?.inbound?.missed * 100) /
                                    callDetails?.inbound?.total
                                  ).toFixed(2)) : <i
                                    class={"fa-regular fa-arrows-rotate fs-5 fa-spin"}
                                  ></i>}
                                  %
                                </div> */}
                              </div>
                              <div className="col-3">
                                <i className="fa-solid fa-phone-intercom"></i>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-4">
              <div className="accordion-item itemWrapper a h-auto">
                <h2 class="accordion-header">
                  <button
                    class="accordion-button"
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
                          class={"ms-2 fa-regular fa-arrows-rotate fs-5 fa-spin"}
                        ></i>
                      )}
                    </div>
                  </button>
                </h2>
                <div id="collapse3" class="accordion-collapse collapse show">
                  <div className="accordion-body">
                    <div className="row g-3">
                      <div className="col-xl-6 col-xxl-6">
                        <div className="itemWrapper a shadow-none" style={{ border: '1px solid var(--border-color)' }}>
                          <div className="heading h-auto">
                            <div className="d-flex flex-wrap justify-content-between">
                              <div className="col-9">
                                <h3 style={{ fontWeight: 900 }}>
                                  {callDetails?.outbound?.total !== undefined ? callDetails?.outbound?.total : <i
                                    class={"fa-regular fa-arrows-rotate fs-5 fa-spin shadow-none bg-transparent float-start w-auto h-auto"}
                                  ></i>}
                                </h3>
                                <p>Total Outbound Calls</p>
                              </div>
                              <div className="col-3">
                                <i className="fa-solid fa-phone-arrow-up-right"></i>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-xl-6 col-xxl-6">
                        <div className="itemWrapper b shadow-none" style={{ border: '1px solid var(--border-color)' }}>
                          <div className="heading h-auto">
                            <div className="d-flex flex-wrap justify-content-between">
                              <div className="col-9">
                                <h3 style={{ fontWeight: 900 }}>
                                  {
                                    callDetails?.outbound?.completed !== undefined ? callDetails?.outbound?.completed : <i
                                      class={"fa-regular fa-arrows-rotate fs-5 fa-spin shadow-none bg-transparent float-start w-auto h-auto"}
                                    ></i>
                                  }
                                </h3>
                                <p>Outbound Calls Completed</p>
                                {/* <div className="label2">
                                  Percentage{" "}
                                  {((
                                    (callDetails?.outbound?.completed * 100) /
                                    callDetails?.outbound?.total
                                  ).toFixed(2)) ? ((
                                    (callDetails?.outbound?.completed * 100) /
                                    callDetails?.outbound?.total
                                  ).toFixed(2)) : <i class={"fa-regular fa-arrows-rotate fs-5 fa-spin"}></i>}
                                  %
                                </div> */}
                              </div>
                              <div className="col-3">
                                <i className="fa-solid fa-circle-check"></i>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-xl-6 col-xxl-6">
                        <div className="itemWrapper c shadow-none" style={{ border: '1px solid var(--border-color)' }}>
                          <div className="heading h-auto">
                            <div className="d-flex flex-wrap justify-content-between">
                              <div className="col-9">
                                <h3 style={{ fontWeight: 900 }}>
                                  {
                                    callDetails?.outbound?.missed !== undefined ? callDetails?.outbound?.missed : <i
                                      class={"fa-regular fa-arrows-rotate fs-5 fa-spin shadow-none bg-transparent float-start w-auto h-auto"}
                                    ></i>
                                  }
                                </h3>
                                <p>Missed Outbound Calls</p>
                                {/* <div className="label2">
                                  Percentage{" "}
                                  {((
                                    (callDetails?.outbound?.missed * 100) /
                                    callDetails?.outbound?.total
                                  ).toFixed(2)) ? ((
                                    (callDetails?.outbound?.missed * 100) /
                                    callDetails?.outbound?.total
                                  ).toFixed(2)) : <i class={"fa-regular fa-arrows-rotate fs-5 fa-spin"}></i>}
                                  %
                                </div> */}
                              </div>
                              <div className="col-3">
                                <i className="fa-solid fa-phone-hangup"></i>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-xl-6 col-xxl-6">
                        <div className="itemWrapper d shadow-none" style={{ border: '1px solid var(--border-color)' }}>
                          <div className="heading h-auto">
                            <div className="d-flex flex-wrap justify-content-between">
                              <div className="col-9">
                                <h3 style={{ fontWeight: 900 }}>
                                  {
                                    activeCall.filter(
                                      (call) => call.direction === "outbound"
                                    ).length
                                  }
                                </h3>
                                <p>Extensions On Calls</p>
                                {/* <div className="label2">
                                  Percentage{" "}
                                  {((
                                    (callDetails?.outbound?.missed * 100) /
                                    callDetails?.outbound?.total
                                  ).toFixed(2)) ? ((
                                    (callDetails?.outbound?.missed * 100) /
                                    callDetails?.outbound?.total
                                  ).toFixed(2)) : <i class={"fa-regular fa-arrows-rotate fs-5 fa-spin"}></i>}
                                  %
                                </div> */}
                              </div>
                              <div className="col-3">
                                <i className="fa-solid fa-phone-intercom"></i>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
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
