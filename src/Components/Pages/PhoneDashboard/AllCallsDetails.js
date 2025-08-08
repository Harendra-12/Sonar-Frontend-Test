import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ContentLoader from "../../Loader/ContentLoader";
import { Link } from "react-router-dom";
import { act } from "react";

function AllCallsDetails() {
  const callDetails = useSelector((state) => state.allCall);
    const realTimePbxDashboardData = useSelector((state)=>state.realTimePbxDashboardData)
  const activeCall = useSelector((state) => state.activeCall);
  const [extensionDataLoading, setExtensionDataLoading] = useState(true);
  const callDetailsRefresh = useSelector((state) => state.callDetailsRefresh);
  const dispatch = useDispatch();

  useEffect(() => {
    if (callDetails.length > 0 || Object.entries(callDetails).length > 0) {
      setExtensionDataLoading(false);
    }
  }, [callDetails]);

  const refreshCallDetails = () => {
    dispatch({
      type: "SET_CALLDETAILSREFRESH",
      callDetailsRefresh: callDetailsRefresh + 1,
    });
  }

  // // Poll Call Details Data
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     refreshCallDetails();
  //   }, 7000)

  //   return () => clearInterval(interval);
  // }, [callDetailsRefresh])


  return (
    <>
      {callDetails ? (
        <div className="accordion dashboard" id="accordionPanelsStayOpenExample">
          <div className="row ">
            <div className="col-xxl-3 col-xl-6 col-lg-6 col-md-6">
              <div className="accordion-item itemWrapper mt-0 a h-auto">
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
                      <div className="col-xxl col-xl-12 f-s-14">
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
                            >Active: {activeCall.filter((call) => call?.b_callstate === "ACTIVE" || call?.b_callstate === "HELD" || call?.callstate === "HELD" || call?.callstate === "ACTIVE")?.length}</span>
                          </div>
                          <div className="ms-1">
                            <span className="badge badge-soft-primary rounded-pill"
                            // style={{ backgroundColor: 'var(--ui-accent)' }}
                            >Total:&nbsp;{realTimePbxDashboardData?.totalCalls || ''}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </button>
                </h2>
                <div id="collapse1" className="accordion-collapse collapse">
                  <div className="accordion-body">
                    <div className=" customRow">
                      <div className="w-100">
                        <Link to={"/active-calls"} state={{ filter: 'all' }} className=" text-decoration">
                          <div className="call_dCard d shadow-none" >
                            {/* <i className="fa-solid fa-phone-intercom"></i> */}
                            <div className="imageBox_wrap">
                              <img className=" " src={require('../../assets/images/call-dashboardIcon/customer-service.png')} alt='customer-service' />
                            </div>
                            <div className="heading ">
                              <div className="d-flex flex-wrap justify-content-center align-items-center">
                                <div className=" text-center">
                                  <p>Agents On Calls</p>
                                  <h3 className="mb-0 fw-bolder">
                                    {activeCall.filter((call) => call?.b_callstate === "ACTIVE" || call?.b_callstate === "HELD" || call?.callstate === "HELD" || call?.callstate === "ACTIVE").length}
                                  </h3>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </div>
                      <div className="w-100">
                        <Link to={"/cdr-report"} state={{ filter: 'missed', direction: 'all' }} className="text-decoration">
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
                                      realTimePbxDashboardData?.missed !== undefined ? (realTimePbxDashboardData?.missed) : <i
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
                      <div className="w-100">
                        <Link to={"/cdr-report"} state={{ filter: 'completed', direction: 'all' }} className="  text-decoration">
                          <div className="call_dCard b shadow-none" >
                            <div className="heading ">
                              <div className="d-flex flex-wrap justify-content-center flex-column align-items-center">
                                <div className="imageBox_wrap">
                                  <img className=" " src={require('../../assets/images/call-dashboardIcon/phone-call.webp')} alt='customer-service' />
                                </div>
                                <div className="text-center">
                                  <p>Total Calls Completed</p>
                                  <h3 className="mb-0 fw-bolder">
                                    {
                                      realTimePbxDashboardData?.success !== undefined ? (realTimePbxDashboardData?.success) : <i
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
                      <div className="w-100">
                        <Link to={"/cdr-report"} className=" text-decoration">
                          <div className="call_dCard a shadow-none" >
                            <div className="heading">
                              <div className="d-flex flex-wrap justify-content-center align-items-center flex-column">
                                <div className="imageBox_wrap">
                                  <img className=" " src={require('../../assets/images/call-dashboardIcon/total-call.webp')} alt='customer-service' />
                                </div>
                                <div className="text-center">
                                  <p>Total Calls</p>
                                  <h3 className="mb-0 fw-bolder">
                                    {realTimePbxDashboardData?.totalCalls !== undefined ? (realTimePbxDashboardData?.totalCalls) :
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
                                    realTimePbxDashboardData?.missed !== undefined ? (realTimePbxDashboardData?.missed) : <i
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
                                    realTimePbxDashboardData?.success !== undefined ? (realTimePbxDashboardData?.success) : <i
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
                                  {realTimePbxDashboardData?.totalCalls !== undefined ? (realTimePbxDashboardData?.totalCalls) :
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
            <div className="col-xxl-3 col-xl-6 col-lg-6 col-md-6">
              <div className="accordion-item itemWrapper mt-0 a h-auto">
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
                      <div className="col-xxl col-xl-12 f-s-14">
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
                            >Active: {activeCall.filter((call) => call?.direction === "inbound" && (call?.b_callstate === "ACTIVE" || call?.b_callstate === "HELD" || call?.callstate === "HELD" || call?.callstate === "ACTIVE"))?.length}</span>
                          </div>
                          <div className="ms-1">
                            <span className="badge badge-soft-secondary rounded-pill"
                            >Total:&nbsp;{realTimePbxDashboardData?.inbound?.total || ""}</span>
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
                                        (call) => call.direction === "inbound" && (call?.b_callstate === "ACTIVE" || call?.b_callstate === "HELD" || call?.callstate === "HELD" || call?.callstate === "ACTIVE")
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
                                  <p>Missed Inbound Calls</p>
                                  <h3 className="mb-0 fw-bolder">
                                    {
                                      realTimePbxDashboardData?.inbound?.missed !== undefined ? realTimePbxDashboardData?.inbound?.missed : <i
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
                                      realTimePbxDashboardData?.inbound?.completed !== undefined ? realTimePbxDashboardData?.inbound?.completed : <i
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
                                  <p>Total Inbound Calls</p>
                                  <h3 className="mb-0 fw-bolder">
                                    {realTimePbxDashboardData?.inbound?.total !== undefined ? realTimePbxDashboardData?.inbound?.total : <i
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
                                    realTimePbxDashboardData?.inbound?.missed !== undefined ? realTimePbxDashboardData?.inbound?.missed : <i
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
                                    realTimePbxDashboardData?.inbound?.completed !== undefined ? realTimePbxDashboardData?.inbound?.completed : <i
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
                                  {realTimePbxDashboardData?.inbound?.total !== undefined ? realTimePbxDashboardData?.inbound?.total : <i
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
            <div className="col-xxl-3 col-xl-6 col-lg-6 col-md-6">
              <div className="accordion-item itemWrapper mt-0 a h-auto">
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
                      <div className="col-xxl col-xl-12 f-s-14">
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
                            >Active: {activeCall.filter((call) => call?.direction === 'outbound').length}</span>
                          </div>
                          <div className="ms-1">
                            <span className="badge badge-soft-success rounded-pill"
                            // style={{ backgroundColor: 'var(--color3)' }}
                            >Total:&nbsp;{realTimePbxDashboardData?.outbound?.total || ""}</span>
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
                                        (call) => call.direction === "outbound" && (call?.b_callstate === "ACTIVE" || call?.b_callstate === "HELD" || call?.callstate === "HELD" || call?.callstate === "ACTIVE")
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
                                      realTimePbxDashboardData?.outbound?.missed !== undefined ? realTimePbxDashboardData?.outbound?.missed : <i
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
                                      realTimePbxDashboardData?.outbound?.completed !== undefined ? realTimePbxDashboardData?.outbound?.completed : <i
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
                                    {realTimePbxDashboardData?.outbound?.total !== undefined ? realTimePbxDashboardData?.outbound?.total : <i
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
            <div className="col-xxl-3 col-xl-6 col-lg-6 col-md-6">
              <div className="accordion-item mt-0 itemWrapper a h-auto">
                <h2 className="accordion-header">
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseinternal"
                    aria-expanded="false"
                    aria-controls="collapseinternal" >
                    <div className="col-12 title text-start d-flex flex-wrap align-items-center justify-content-between">
                      <div className="col-xxl col-xl-12 f-s-14">
                        <i
                          className="fa-duotone fa-headset"
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
                            >Active: {activeCall.filter((call) => call.direction === 'internal' && (call?.b_callstate === "ACTIVE" || call?.b_callstate === "HELD" || call?.callstate === "HELD" || call?.callstate === "ACTIVE")).length}</span>
                          </div>
                          <div className="ms-1">
                            <span className="badge badge-soft-danger rounded-pill"
                            // style={{ backgroundColor: 'var(--funky-boy4)' }}
                            >Total:&nbsp;{realTimePbxDashboardData?.internal?.total || ""}</span>
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
                                        (call) => call.direction === "internal" && (call?.b_callstate === "ACTIVE" || call?.b_callstate === "HELD" || call?.callstate === "HELD" || call?.callstate === "ACTIVE")
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
                                  <p>Missed Internal Calls</p>
                                  <h3 className="mb-0 fw-bolder">
                                    {
                                      realTimePbxDashboardData?.internal?.missed !== undefined ? realTimePbxDashboardData?.internal?.missed : <i
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
                                      realTimePbxDashboardData?.internal?.completed !== undefined ? realTimePbxDashboardData?.internal?.completed : <i
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
                                    {realTimePbxDashboardData?.internal?.total !== undefined ? realTimePbxDashboardData?.internal?.total : <i
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
                                    realTimePbxDashboardData?.internal?.missed !== undefined ? realTimePbxDashboardData?.internal?.missed : <i
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
                                    realTimePbxDashboardData?.internal?.completed !== undefined ? realTimePbxDashboardData?.internal?.completed : <i
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
                                  {realTimePbxDashboardData?.internal?.total !== undefined ? realTimePbxDashboardData?.internal?.total : <i
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
