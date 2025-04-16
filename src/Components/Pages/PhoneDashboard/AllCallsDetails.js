import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ContentLoader from "../../Loader/ContentLoader";
import { Link } from "react-router-dom";

function AllCallsDetails() {
  const callDetails = useSelector((state) => state.allCall);
  const activeCall = useSelector((state) => state.activeCall);
  const [extensionDataLoading, setExtensionDataLoading] = useState(true);
  useEffect(() => {
    if (callDetails?.calls) {
      setExtensionDataLoading(false);
    }
  }, [callDetails]);
  return (
    <>
      {callDetails ? (
        <div className="accordion dashboard" id="accordionPanelsStayOpenExample">
          <div className="row gy-3 gx-xxl-3 gx-lg-2">
            <div className="col-lg-3 ">
              <div className="accordion-item itemWrapper a h-auto">
                <h2 className="accordion-header ">
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapse1"
                    aria-expanded="false"
                    aria-controls="collapse1"
                  >
                    <div className="col-12 title text-start d-flex flex-wrap align-items-center justify-content-between">
                      <div className="col-xxl col-xl-12">
                        <i className="fa-duotone fa-phone-volume" /> All Calls  {" "}
                        {extensionDataLoading && (
                          <i
                            className={"ms-2 fa-regular fa-arrows-rotate fs-5 fa-spin"}
                          ></i>
                        )}
                      </div>
                      <div className="col-xxl-auto col-xl-12 mt-xxl-0 mt-xl-3">
                        <div className="headingExtraInfo" style={{ marginRight: '2.2rem' }}>
                          <div>
                            <span className="badge badge-soft-primary rounded-pill"
                            // style={{ backgroundColor: 'var(--ui-accent)' }}
                            >Active: {activeCall.length}</span>
                          </div>
                          <div className="ms-1">
                            <span className="badge badge-soft-primary rounded-pill"
                            // style={{ backgroundColor: 'var(--ui-accent)' }}
                            >Total:&nbsp;{callDetails?.totalCalls || 'N/A'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </button>
                </h2>
                <div id="collapse1" className="accordion-collapse collapse">
                  <div className="accordion-body">
                    <div className="customRow">
                      <div className="">
                        <Link to={"/active-calls"} state={{ filter: 'all' }} className="col-3 text-decoration">
                          <div className="call_dCard d shadow-none" >
                            {/* <i className="fa-solid fa-phone-intercom"></i> */}
                            <div className="imageBox_wrap">
                              <img className=" " src={require('../../assets/images/call-dashboardIcon/customer-service.png')} alt='customer-service' />
                            </div>
                            <div className="heading ">
                              <div className="d-flex flex-wrap justify-content-center align-items-center">
                                <div className=" text-center">
                                  <p>Agents On <br/> Calls</p>
                                  <h3 className="mb-0 fw-bolder">
                                    {activeCall.length}
                                  </h3>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </div>
                      <div className="">
                        <Link to={"/cdr-report"} state={{ filter: 'missed', direction: 'all' }} className="col-3 text-decoration">
                          <div className="call_dCard c shadow-none" >
                            <div className="heading">
                              <div className="d-flex flex-wrap justify-content-center align-items-center flex-column">
                                <div className="imageBox_wrap">
                                  <img className=" " src={require('../../assets/images/call-dashboardIcon/missed-call.webp')} alt='missed-call' />
                                </div>
                                <div className="text-center">
                                  <p>Missed Calls</p>
                                  <h3 className="mb-0 fw-bolder">
                                    {
                                      callDetails?.missed !== undefined ? (callDetails?.missed) : <i
                                        className={"fa-regular fa-arrows-rotate fs-5 fa-spin shadow-none bg-transparent float-start w-auto "}
                                      ></i>
                                    }
                                  </h3>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </div>
                      <div className="">
                        <Link to={"/cdr-report"} state={{ filter: 'completed', direction: 'all' }} className="col-3  text-decoration">
                          <div className="call_dCard b shadow-none" >
                            <div className="heading ">
                              <div className="d-flex flex-wrap justify-content-center flex-column align-items-center">
                                <div className="imageBox_wrap">
                                  <img className=" " src={require('../../assets/images/call-dashboardIcon/phone-call.webp')} alt='customer-service' />
                                </div>
                                <div className="text-center">
                                  <p>Total Calls <br /> Completed</p>
                                  <h3 className="mb-0 fw-bolder">
                                    {
                                      callDetails?.success !== undefined ? (callDetails?.success) : <i
                                        className={"fa-regular fa-arrows-rotate fs-5 fa-spin shadow-none bg-transparent float-start w-auto"}
                                      ></i>
                                    }
                                  </h3>
                                </div>
                                {/* <i className="fa-solid fa-circle-check"></i> */}
                              </div>
                            </div>
                          </div>
                        </Link>
                      </div>
                      <div className="">
                        <Link to={"/cdr-report"} className="col-3 text-decoration">
                          <div className="call_dCard a shadow-none" >
                            <div className="heading">
                              <div className="d-flex flex-wrap justify-content-center align-items-center flex-column">
                                <div className="imageBox_wrap">
                                  <img className=" " src={require('../../assets/images/call-dashboardIcon/total-call.webp')} alt='customer-service' />
                                </div>
                                <div className="text-center">
                                  <p>Total Calls</p>
                                  <h3 className="mb-0 fw-bolder">
                                    {callDetails?.totalCalls !== undefined ? (callDetails?.totalCalls) :
                                      <i className={"fa-regular fa-arrows-rotate fs-5 fa-spin shadow-none bg-transparent float-start w-auto"} ></i>}
                                  </h3>
                                </div>
                                {/* <i className="fa-solid fa-phone-volume"></i> */}
                              </div>
                            </div>
                          </div>
                        </Link>
                      </div>
                    </div>
                    {/* <div className="row g-3">
                      <div className="col-xl-6 col-xxl-6">
                        <div className="itemWrapper d shadow-none" style={{ border: '1px solid var(--border-color)' }}>
                          <div className="heading h-auto">
                            <div className="d-flex flex-wrap justify-content-between">
                              <div className="col-9">
                                <h3 style={{ fontWeight: 900 }}>
                                  {activeCall.length}
                                </h3>
                                <p>Agents On Calls</p>
                              </div>
                              <Link to={"/active-calls"} state={{ filter: 'all' }} className="col-3">
                                <i className="fa-solid fa-phone-intercom"></i>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-xl-6 col-xxl-6">
                        <div className="itemWrapper c shadow-none" style={{ border: '1px solid var(--border-color)' }}>
                          <div className="heading h-auto">
                            <div className="d-flex flex-wrap justify-content-center align-items">
                              <div className="col-9">
                                <h3 style={{ fontWeight: 900 }}>
                                  {
                                    callDetails?.missed !== undefined ? (callDetails?.missed) : <i
                                      className={"fa-regular fa-arrows-rotate fs-5 fa-spin shadow-none bg-transparent float-start w-auto h-auto"}
                                    ></i>
                                  }
                                </h3>
                                <p>Missed Calls</p>
                              </div>
                              <Link to={"/cdr-report"} state={{ filter: 'missed', direction: 'all' }} className="col-3" >
                                <i className="fa-solid fa-phone-hangup"></i>
                              </Link>
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
                                    callDetails?.success !== undefined ? (callDetails?.success) : <i
                                      className={"fa-regular fa-arrows-rotate fs-5 fa-spin shadow-none bg-transparent float-start w-auto h-auto"}
                                    ></i>
                                  }
                                </h3>
                                <p>Total Calls Completed</p>
                              </div>
                              <Link to={"/cdr-report"} state={{ filter: 'completed', direction: 'all' }} className="col-3">
                                <i className="fa-solid fa-circle-check"></i>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-xl-6 col-xxl-6">
                        <div className="itemWrapper a shadow-none" style={{ border: '1px solid var(--border-color)' }}>
                          <div className="heading h-auto">
                            <div className="d-flex flex-wrap justify-content-between">
                              <div className="col-9">
                                <h3 style={{ fontWeight: 900 }}>
                                  {callDetails?.totalCalls !== undefined ? (callDetails?.totalCalls) :
                                    <i className={"fa-regular fa-arrows-rotate fs-5 fa-spin shadow-none bg-transparent float-start w-auto h-auto"} ></i>}
                                </h3>
                                <p>Total Calls</p>
                              </div>
                              <Link to={"/cdr-report"} className="col-3">
                                <i className="fa-solid fa-phone-volume"></i>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div> */}
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-3">
              <div className="accordion-item itemWrapper a h-auto">
                <h2 className="accordion-header">
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapse2"
                    aria-expanded="false"
                    aria-controls="collapse2"
                  >
                    <div className="col-12 title text-start d-flex flex-wrap align-items-center justify-content-between">
                      <div className="col-xxl col-xl-12">
                        <i
                          className="fa-duotone fa-phone-arrow-down-left"
                          style={{ color: "var(--funky-boy3)" }}
                        />{" "}
                        Inbound Calls
                        {extensionDataLoading && (
                          <i
                            className={"ms-2 fa-regular fa-arrows-rotate fs-5 fa-spin"}
                          ></i>
                        )}
                      </div>
                      <div className="col-xxl-auto col-xl-12 mt-xxl-0 mt-xl-3">
                        <div className="headingExtraInfo" style={{ marginRight: '2.2rem' }}>
                          <div>
                            <span className="badge badge-soft-secondary rounded-pill"
                            >Active: {activeCall.length}</span>
                          </div>
                          <div className="ms-1">
                            <span className="badge badge-soft-secondary rounded-pill"
                            >Total:&nbsp;{callDetails?.inbound?.total || 'N/A'}</span>
                          </div>
                        </div>
                      </div>

                    </div>
                  </button>
                </h2>
                <div id="collapse2" className="accordion-collapse collapse">
                  <div className="accordion-body">
                    <div className="customRow">
                      <div className="">
                        <Link to="/active-calls" state={{ filter: 'inbound' }} className="col-3 text-decoration">
                          <div className="call_dCard d shadow-none " >
                            <div className="heading h-auto">
                              <div className="d-flex flex-wrap justify-content-center align-items-center flex-column">
                                <div className="imageBox_wrap">
                                  <img className=" " src={require('../../assets/images/call-dashboardIcon/customer-service.png')} alt='customer-service' />
                                </div>
                                <div className="text-center">
                                  <p>Agents On Calls</p>
                                  <h3 className="mb-0 fw-bolder">
                                    {
                                      activeCall.filter(
                                        (call) => call.direction === "inbound"
                                      ).length
                                    }
                                  </h3>
                                </div>

                              </div>
                            </div>
                          </div>
                        </Link>
                      </div>
                      <div className="">
                        <Link to={"/cdr-report"} state={{ filter: 'missed', direction: 'inbound' }} className="col-3 text-decoration">
                          <div className="call_dCard c shadow-none" >
                            <div className="heading ">
                              <div className="d-flex flex-wrap justify-content-center align-items-center flex-column">
                                <div className="text-center">
                                  <div className="imageBox_wrap">
                                    <img className=" " src={require('../../assets/images/call-dashboardIcon/missed-call.webp')} alt='missed-call' />
                                  </div>
                                  <p>Missed Inbound <br/> Calls</p>
                                  <h3 className="mb-0 fw-bolder">
                                    {
                                      callDetails?.inbound?.missed !== undefined ? callDetails?.inbound?.missed : <i
                                        className={"fa-regular fa-arrows-rotate fs-5 fa-spin shadow-none bg-transparent float-start w-auto "}
                                      ></i>
                                    }
                                  </h3>
                                </div>

                              </div>
                            </div>
                          </div>
                        </Link>
                      </div>
                      <div className="">
                        <Link to={"/cdr-report"} state={{ filter: 'completed', direction: 'inbound' }} className="col-3 text-decoration">
                          <div className="call_dCard b shadow-none" >
                            <div className="heading">
                              <div className="d-flex flex-wrap justify-content-center align-items-center flex-column">
                                <div className="imageBox_wrap">
                                  <img className=" " src={require('../../assets/images/call-dashboardIcon/phone-call.webp')} alt='customer-service' />
                                </div>
                                <div className="text-center">
                                  <p> Inbound Calls Completed</p>
                                  <h3 className="mb-0 fw-bolder">
                                    {
                                      callDetails?.inbound?.completed !== undefined ? callDetails?.inbound?.completed : <i
                                        className={"fa-regular fa-arrows-rotate fs-5 fa-spin shadow-none bg-transparent float-start "}
                                      ></i>
                                    }
                                  </h3>
                                </div>

                              </div>
                            </div>
                          </div>
                        </Link>
                      </div>
                      <div className="">
                        <Link to={"/cdr-report"} state={{ filter: 'all', direction: 'inbound' }} className="col-3 text-decoration">
                          <div className="call_dCard a shadow-none" >
                            <div className="heading ">
                              <div className="d-flex flex-wrap justify-content-center align-items-center flex-column">
                                <div className="imageBox_wrap">
                                  <img className=" " src={require('../../assets/images/call-dashboardIcon/total-call.webp')} alt='customer-service' />
                                </div>
                                <div className="text-center">
                                  <p>Total Inbound <br/>Calls</p>
                                  <h3 className="mb-0 fw-bolder">
                                    {callDetails?.inbound?.total !== undefined ? callDetails?.inbound?.total : <i
                                      className={"fa-regular fa-arrows-rotate fs-5 fa-spin shadow-none bg-transparent float-start w-auto "}
                                    ></i>}
                                  </h3>
                                </div>

                              </div>
                            </div>
                          </div>
                        </Link>
                      </div>
                    </div>
                    {/* <div className="row g-3">
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
                                <p>Agents On Calls</p>
                              </div>
                              <Link to="/active-calls" state={{ filter: 'inbound' }} className="col-3">
                                <i className="fa-solid fa-phone-intercom"></i>
                              </Link>
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
                                      className={"fa-regular fa-arrows-rotate fs-5 fa-spin shadow-none bg-transparent float-start w-auto h-auto"}
                                    ></i>
                                  }
                                </h3>
                                <p>Missed Inbound Calls</p>
                              </div>
                              <Link to={"/cdr-report"} state={{ filter: 'missed', direction: 'inbound' }} className="col-3">
                                <i className="fa-solid fa-phone-hangup"></i>
                              </Link>
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
                                      className={"fa-regular fa-arrows-rotate fs-5 fa-spin shadow-none bg-transparent float-start w-auto h-auto"}
                                    ></i>
                                  }
                                </h3>
                                <p> Inbound Calls Completed</p>
                              </div>
                              <Link to={"/cdr-report"} state={{ filter: 'completed', direction: 'inbound' }} className="col-3">
                                <i className="fa-solid fa-circle-check"></i>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-xl-6 col-xxl-6">
                        <div className="itemWrapper a shadow-none" style={{ border: '1px solid var(--border-color)' }}>
                          <div className="heading h-auto">
                            <div className="d-flex flex-wrap justify-content-between">
                              <div className="col-9">
                                <h3 style={{ fontWeight: 900 }}>
                                  {callDetails?.inbound?.total !== undefined ? callDetails?.inbound?.total : <i
                                    className={"fa-regular fa-arrows-rotate fs-5 fa-spin shadow-none bg-transparent float-start w-auto h-auto"}
                                  ></i>}
                                </h3>
                                <p>Total Inbound Calls</p>
                              </div>
                              <Link to={"/cdr-report"} state={{ filter: 'all', direction: 'inbound' }} className="col-3">
                                <i className="ms-2 fa-solid fa-phone-arrow-down-left"></i>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div> */}
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-3">
              <div className="accordion-item itemWrapper a h-auto">
                <h2 className="accordion-header">
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapse3"
                    aria-expanded="false"
                    aria-controls="collapse3"
                  >
                    <div className="col-12 title text-start d-flex flex-wrap align-items-center justify-content-between">
                      <div className="col-xxl col-xl-12">
                        <i
                          className="fa-duotone fa-phone-arrow-up-right"
                          style={{ color: "var(--color3)" }}
                        />{" "}
                        Outbound Calls
                        {extensionDataLoading && (
                          <i
                            className={"ms-2 fa-regular fa-arrows-rotate fs-5 fa-spin"}
                          ></i>
                        )}
                      </div>
                      <div className="col-xxl-auto col-xl-12 mt-xxl-0 mt-xl-3">
                        <div className="headingExtraInfo" style={{ marginRight: '2.2rem' }}>
                          <div>
                            <span className="badge badge-soft-success rounded-pill"
                            //  style={{ backgroundColor: 'var(--color3)' }}
                            >Active: {activeCall.length}</span>
                          </div>
                          <div className="ms-1">
                            <span className="badge badge-soft-success rounded-pill"
                            // style={{ backgroundColor: 'var(--color3)' }}
                            >Total:&nbsp;{callDetails?.outbound?.total || 'N/A'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </button>
                </h2>
                <div id="collapse3" className="accordion-collapse collapse">
                  <div className="accordion-body">
                    <div className="customRow">
                      <div className="">
                        <Link to="/active-calls" state={{ filter: 'outbound' }} className="col-3 text-decoration">
                          <div className="call_dCard d shadow-none" >
                            <div className="heading ">
                              <div className="d-flex flex-wrap justify-content-center align-items-center flex-column">
                                <div className="imageBox_wrap">
                                  <img className=" " src={require('../../assets/images/call-dashboardIcon/customer-service.png')} alt='customer-service' />
                                </div>
                                <div className="text-center">
                                  <p>Agents On Calls</p>
                                  <h3 className="mb-0 fw-bolder">
                                    {
                                      activeCall.filter(
                                        (call) => call.direction === "outbound"
                                      ).length
                                    }
                                  </h3>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </div>
                      <div className="">
                        <Link to={"/cdr-report"} state={{ filter: 'missed', direction: 'outbound' }} className="col-3 text-decoration">
                          <div className="call_dCard c shadow-none" >
                            <div className="heading ">
                              <div className="d-flex flex-wrap justify-content-center align-items-center flex-column">
                                <div className="imageBox_wrap">
                                  <img className=" " src={require('../../assets/images/call-dashboardIcon/missed-call.webp')} alt='missed-call' />
                                </div>
                                <div className="text-center">
                                  <p>Missed Outbound Calls</p>
                                  <h3 className="mb-0 fw-bolder">
                                    {
                                      callDetails?.outbound?.missed !== undefined ? callDetails?.outbound?.missed : <i
                                        className={"fa-regular fa-arrows-rotate fs-5 fa-spin shadow-none bg-transparent float-start w-auto "}
                                      ></i>
                                    }
                                  </h3>
                                </div>

                              </div>
                            </div>
                          </div>
                        </Link>
                      </div>
                      <div className="">
                        <Link to={"/cdr-report"} state={{ filter: 'completed', direction: 'outbound' }} className="col-3 text-decoration">
                          <div className="call_dCard b shadow-none" >
                            <div className="heading ">
                              <div className="d-flex flex-wrap justify-content-center align-items-center flex-column">
                                <div className="imageBox_wrap">
                                  <img className=" " src={require('../../assets/images/call-dashboardIcon/phone-call.webp')} alt='customer-service' />
                                </div>
                                <div className="text-center">
                                  <p>Outbound Calls Completed</p>
                                  <h3 className="mb-0 fw-bolder">
                                    {
                                      callDetails?.outbound?.completed !== undefined ? callDetails?.outbound?.completed : <i
                                        className={"fa-regular fa-arrows-rotate fs-5 fa-spin shadow-none bg-transparent float-start w-auto "}
                                      ></i>
                                    }
                                  </h3>
                                </div>

                              </div>
                            </div>
                          </div>
                        </Link>
                      </div>
                      <div className="">
                        <Link to={"/cdr-report"} state={{ filter: 'all', direction: 'outbound' }} className="col-3 text-decoration">
                          <div className="call_dCard a shadow-none" >
                            <div className="heading ">
                              <div className="d-flex flex-wrap justify-content-center align-items-center flex-column">
                                <div className="imageBox_wrap">
                                  <img className=" " src={require('../../assets/images/call-dashboardIcon/total-call.webp')} alt='customer-service' />
                                </div>
                                <div className="text-center">
                                  <p>Total Outbound Calls</p>
                                  <h3 className="mb-0 fw-bolder">
                                    {callDetails?.outbound?.total !== undefined ? callDetails?.outbound?.total : <i
                                      className={"fa-regular fa-arrows-rotate fs-5 fa-spin shadow-none bg-transparent float-start w-auto "}
                                    ></i>}
                                  </h3>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-3">
              <div className="accordion-item itemWrapper a h-auto">
                <h2 className="accordion-header">
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseinternal"
                    aria-expanded="false"
                    aria-controls="collapseinternal" >
                    <div className="col-12 title text-start d-flex flex-wrap align-items-center justify-content-between">
                      <div className="col-xxl col-xl-12">
                        <i
                          className="fa-duotone fa-right-left"
                          style={{ color: "var(--funky-boy4)" }}
                        />{" "}
                        Internal Calls{" "}
                        {extensionDataLoading && (
                          <i
                            className={"ms-2 fa-regular fa-arrows-rotate fs-5 fa-spin"}
                          ></i>
                        )}
                      </div>
                      <div className="col-xxl-auto col-xl-12 mt-xxl-0 mt-xl-3">
                        <div className="headingExtraInfo" style={{ marginRight: '2.2rem' }}>
                          <div>
                            <span className="badge badge-soft-danger rounded-pill"
                            // style={{ backgroundColor: 'var(--funky-boy4)' }}
                            >Active: {activeCall.length}</span>
                          </div>
                          <div className="ms-1">
                            <span className="badge badge-soft-danger rounded-pill"
                            // style={{ backgroundColor: 'var(--funky-boy4)' }}
                            >Total:&nbsp;{callDetails?.internal?.total || 'N/A'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </button>
                </h2>
                <div id="collapseinternal" className="accordion-collapse collapse">
                  <div className="accordion-body">
                    <div className="customRow">
                      <div className="">
                        <Link to="/active-calls" state={{ filter: 'internal' }} className="col-3 text-decoration">
                          <div className="call_dCard d shadow-none" >
                            <div className="heading">
                              <div className="d-flex flex-wrap justify-content-center align-items flex-column">
                                <div className="imageBox_wrap">
                                  <img className=" " src={require('../../assets/images/call-dashboardIcon/customer-service.png')} alt='missed-call' />
                                </div>
                                <div className="text-center">
                                  <p>Agents On Calls</p>
                                  <h3 className="mb-0 fw-bolder">
                                    {
                                      activeCall.filter(
                                        (call) => call.direction === "internal"
                                      ).length
                                    }
                                  </h3>
                                </div>

                              </div>
                            </div>
                          </div>
                        </Link>
                      </div>
                      <div className="">
                        <Link to={"/cdr-report"} state={{ filter: 'missed', direction: 'internal' }} className="col-3 text-decoration">
                          <div className="call_dCard c shadow-none" >
                            <div className="heading ">
                              <div className="d-flex flex-wrap justify-content-center align-items-center flex-column">
                                <div className="imageBox_wrap">
                                  <img className=" " src={require('../../assets/images/call-dashboardIcon/missed-call.webp')} alt='customer-service' />
                                </div>
                                <div className="text-center">
                                  <p>Missed Internal <br/>Calls</p>
                                  <h3 className="mb-0 fw-bolder">
                                    {
                                      callDetails?.internal?.missed !== undefined ? callDetails?.internal?.missed : <i
                                        className={"fa-regular fa-arrows-rotate fs-5 fa-spin shadow-none bg-transparent float-start w-auto "}
                                      ></i>
                                    }
                                  </h3>
                                </div>
                             
                              </div>
                            </div>
                          </div>
                        </Link>
                      </div>
                      <div className="">
                        <Link to={"/cdr-report"} state={{ filter: 'completed', direction: 'internal' }} className="col-3 text-decoration">
                          <div className="call_dCard b shadow-none" >
                            <div className="heading ">
                              <div className="d-flex flex-wrap justify-content-center align-items-center flex-column">
                                <div className="imageBox_wrap">
                                  <img className=" " src={require('../../assets/images/call-dashboardIcon/phone-call.webp')} alt='customer-service' />
                                </div>
                                <div className="text-center">
                                  <p>Internal Calls Completed</p>
                                  <h3 className="mb-0 fw-bolder">
                                    {
                                      callDetails?.internal?.completed !== undefined ? callDetails?.internal?.completed : <i
                                        className={"fa-regular fa-arrows-rotate fs-5 fa-spin shadow-none bg-transparent float-start w-auto "}
                                      ></i>
                                    }
                                  </h3>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </div>
                      <div className="">
                        <Link to={"/cdr-report"} state={{ filter: 'all', direction: 'internal' }} className="col-3 text-decoration">
                          <div className="call_dCard a shadow-none" >
                            <div className="heading ">
                              <div className="d-flex flex-wrap justify-content-center align-items-center flex-column">
                                <div className="imageBox_wrap">
                                  <img className=" " src={require('../../assets/images/call-dashboardIcon/total-call.webp')} alt='customer-service' />
                                </div>
                                <div className="text-center">
                                  <p>Total Internal Calls</p>
                                  <h3 className="mb-0 fw-bolder">
                                    {callDetails?.internal?.total !== undefined ? callDetails?.internal?.total : <i
                                      className={"fa-regular fa-arrows-rotate fs-5 fa-spin shadow-none bg-transparent float-start w-auto h-auto"}
                                    ></i>}
                                  </h3>
                                </div>

                              </div>
                            </div>
                          </div>
                        </Link>
                      </div>
                    </div>
                    {/* <div className="row g-3">
                      <div className="col-xl-6 col-xxl-6">
                        <div className="itemWrapper d shadow-none" style={{ border: '1px solid var(--border-color)' }}>
                          <div className="heading h-auto">
                            <div className="d-flex flex-wrap justify-content-between">
                              <div className="col-9">
                                <h3 style={{ fontWeight: 900 }}>
                                  {
                                    activeCall.filter(
                                      (call) => call.direction === "internal"
                                    ).length
                                  }
                                </h3>
                                <p>Agents On Calls</p>
                              </div>
                              <Link to="/active-calls" state={{ filter: 'internal' }} className="col-3">
                                <i className="fa-solid fa-phone-intercom"></i>
                              </Link>
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
                                    callDetails?.internal?.missed !== undefined ? callDetails?.internal?.missed : <i
                                      className={"fa-regular fa-arrows-rotate fs-5 fa-spin shadow-none bg-transparent float-start w-auto h-auto"}
                                    ></i>
                                  }
                                </h3>
                                <p>Missed Internal Calls</p>
                              </div>
                              <Link to={"/cdr-report"} state={{ filter: 'missed', direction: 'internal' }} className="col-3">
                                <i className="fa-solid fa-phone-hangup"></i>
                              </Link>
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
                                    callDetails?.internal?.completed !== undefined ? callDetails?.internal?.completed : <i
                                      className={"fa-regular fa-arrows-rotate fs-5 fa-spin shadow-none bg-transparent float-start w-auto h-auto"}
                                    ></i>
                                  }
                                </h3>
                                <p>Internal Calls Completed</p>
                              </div>
                              <Link to={"/cdr-report"} state={{ filter: 'completed', direction: 'internal' }} className="col-3">
                                <i className="fa-solid fa-circle-check"></i>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-xl-6 col-xxl-6">
                        <div className="itemWrapper a shadow-none" style={{ border: '1px solid var(--border-color)' }}>
                          <div className="heading h-auto">
                            <div className="d-flex flex-wrap justify-content-between">
                              <div className="col-9">
                                <h3 style={{ fontWeight: 900 }}>
                                  {callDetails?.internal?.total !== undefined ? callDetails?.internal?.total : <i
                                    className={"fa-regular fa-arrows-rotate fs-5 fa-spin shadow-none bg-transparent float-start w-auto h-auto"}
                                  ></i>}
                                </h3>
                                <p>Total Internal Calls</p>
                              </div>
                              <Link to={"/cdr-report"} state={{ filter: 'all', direction: 'internal' }} className="col-3">
                                <i className="fa-solid fa-phone-arrow-up-right"></i>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div >
      ) : (
        <ContentLoader />
      )
      }
    </>
  );
}

export default AllCallsDetails;
