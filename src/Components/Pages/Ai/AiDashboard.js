import React, { useEffect, useRef, useState } from 'react';
import Header from '../../CommonComponents/Header'
import { Link, Navigate } from 'react-router-dom'
import Chart from 'chart.js/auto'; // or 'chart.js' if you're using Chart.js v2
import { Line } from "react-chartjs-2";
import AllActiveAgentStatus from '../PhoneDashboard/AllActiveAgentStatus';

const AiDashboard = () => {
    const canvasRef = useRef(null);
    const canvasTwoRef = useRef(null);
    useEffect(() => {
        const ctx = canvasRef.current.getContext("2d");

        const myChart = new Chart(ctx, {
            type: "bar",
            data: {
                labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
                datasets: [
                    {
                        label: "# of Votes",
                        data: [12, 19, 3, 5, 2, 3],
                        backgroundColor: [
                            "rgba(255, 99, 132, 0.2)",
                            "rgba(54, 162, 235, 0.2)",
                            "rgba(255, 206, 86, 0.2)",
                            "rgba(75, 192, 192, 0.2)",
                            "rgba(153, 102, 255, 0.2)",
                            "rgba(255, 159, 64, 0.2)"
                        ],
                        borderColor: [
                            "rgba(255, 99, 132, 1)",
                            "rgba(54, 162, 235, 1)",
                            "rgba(255, 206, 86, 1)",
                            "rgba(75, 192, 192, 1)",
                            "rgba(153, 102, 255, 1)",
                            "rgba(255, 159, 64, 1)"
                        ],
                        borderWidth: 1
                    }
                ]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: true,
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });

        return () => {
            myChart.destroy(); // Cleanup on unmount
        };
    }, []);

    useEffect(() => {
        const ctx = canvasTwoRef.current.getContext("2d");

        const myChart = new Chart(ctx, {
            type: "bar",
            data: {
                labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
                datasets: [
                    {
                        label: "# of Votes",
                        data: [12, 19, 3, 5, 2, 3],
                        backgroundColor: [
                            "rgba(255, 99, 132, 0.2)",
                            "rgba(54, 162, 235, 0.2)",
                            "rgba(255, 206, 86, 0.2)",
                            "rgba(75, 192, 192, 0.2)",
                            "rgba(153, 102, 255, 0.2)",
                            "rgba(255, 159, 64, 0.2)"
                        ],
                        borderColor: [
                            "rgba(255, 99, 132, 1)",
                            "rgba(54, 162, 235, 1)",
                            "rgba(255, 206, 86, 1)",
                            "rgba(75, 192, 192, 1)",
                            "rgba(153, 102, 255, 1)",
                            "rgba(255, 159, 64, 1)"
                        ],
                        borderWidth: 1
                    }
                ]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: true,
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });

        return () => {
            myChart.destroy(); // Cleanup on unmount
        };
    }, []);

    return (
        <>
            <main className="mainContent">
                <section id="phonePage">
                    <div className="container-fluid">
                        <div className="row">
                            <Header title="Ai Dashboard" />
                            <div className="overviewTableWrapper">
                                <div className="">
                                    <div className="accordion dashboard" id="accordionPanelsStayOpenExample">
                                        <div className="row ">
                                            <div className="col-xxl-4 col-xl-6 col-lg-6 col-md-6">
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
                                                                    {/* {extensionDataLoading && ( */}
                                                                    <i
                                                                        className={"ms-2 fa-regular fa-arrows-rotate fs-5 fa-spin"}
                                                                    ></i>
                                                                    {/* )} */}
                                                                </div>
                                                                <div className="col-xxl-auto col-xl-12 mt-xxl-0 mt-xl-3">
                                                                    <div className="headingExtraInfo" style={{ marginRight: '2.2rem' }}>
                                                                        <div>
                                                                            <span className="badge badge-soft-primary rounded-pill"
                                                                            // style={{ backgroundColor: 'var(--ui-accent)' }}
                                                                            >Active: 05</span>
                                                                        </div>
                                                                        <div className="ms-1">
                                                                            <span className="badge badge-soft-primary rounded-pill"
                                                                            // style={{ backgroundColor: 'var(--ui-accent)' }}
                                                                            >Total:&nbsp; 41</span>
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
                                                                            <div className="heading justify-content-center">
                                                                                <div className="d-flex flex-wrap justify-content-center align-items-center">
                                                                                    <div className=" text-center">
                                                                                        <p>Agents On Calls</p>
                                                                                        <h3 className="mb-0 fw-bolder">
                                                                                            {/* {activeCall.length} */}
                                                                                            02
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
                                                                            <div className="heading justify-content-center">
                                                                                <div className="d-flex flex-wrap justify-content-center align-items-center flex-column">
                                                                                    <div className="imageBox_wrap">
                                                                                        <img className=" " src={require('../../assets/images/call-dashboardIcon/missed-call.webp')} alt='missed-call' />
                                                                                    </div>
                                                                                    <div className="text-center">
                                                                                        <p>Missed Calls</p>
                                                                                        <h3 className="mb-0 fw-bolder">
                                                                                            40
                                                                                            {/* {
                                                                                                    callDetails?.missed !== undefined ? (callDetails?.missed) : */}
                                                                                            {/* <i
                                                                                                className={"fa-regular fa-arrows-rotate fs-5 fa-spin shadow-none bg-transparent float-start w-auto "}
                                                                                            ></i> */}
                                                                                            {/* } */}
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
                                                                            <div className="heading justify-content-center">
                                                                                <div className="d-flex flex-wrap justify-content-center flex-column align-items-center">
                                                                                    <div className="imageBox_wrap">
                                                                                        <img className=" " src={require('../../assets/images/call-dashboardIcon/phone-call.webp')} alt='customer-service' />
                                                                                    </div>
                                                                                    <div className="text-center">
                                                                                        <p>Total Calls Completed</p>
                                                                                        <h3 className="mb-0 fw-bolder">
                                                                                            80
                                                                                            {/* {
                                                                                                    callDetails?.success !== undefined ? (callDetails?.success) :  */}
                                                                                            {/* <i
                                                                                                className={"fa-regular fa-arrows-rotate fs-5 fa-spin shadow-none bg-transparent float-start w-auto"}
                                                                                            ></i> */}
                                                                                            {/* } */}
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
                                                                            <div className="heading justify-content-center">
                                                                                <div className="d-flex flex-wrap justify-content-center align-items-center flex-column">
                                                                                    <div className="imageBox_wrap">
                                                                                        <img className=" " src={require('../../assets/images/call-dashboardIcon/total-call.webp')} alt='customer-service' />
                                                                                    </div>
                                                                                    <div className="text-center">
                                                                                        <p>Total Calls</p>
                                                                                        <h3 className="mb-0 fw-bolder">
                                                                                            95
                                                                                            {/* {callDetails?.totalCalls !== undefined ? (callDetails?.totalCalls) : */}
                                                                                            {/* <i className={"fa-regular fa-arrows-rotate fs-5 fa-spin shadow-none bg-transparent float-start w-auto"} ></i> */}
                                                                                            {/* } */}
                                                                                        </h3>
                                                                                    </div>
                                                                                    {/* <i className="fa-solid fa-phone-volume"></i> */}
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
                                            <div className="col-xxl-4 col-xl-6 col-lg-6 col-md-6">
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
                                                                    {/* {extensionDataLoading && ( */}
                                                                    <i
                                                                        className={"ms-2 fa-regular fa-arrows-rotate fs-5 fa-spin"}
                                                                    ></i>
                                                                    {/* )} */}
                                                                </div>
                                                                <div className="col-xxl-auto col-xl-12 mt-xxl-0 mt-xl-3">
                                                                    <div className="headingExtraInfo" style={{ marginRight: '2.2rem' }}>
                                                                        <div>
                                                                            <span className="badge badge-soft-secondary rounded-pill"
                                                                            >Active: 02</span>
                                                                        </div>
                                                                        <div className="ms-1">
                                                                            <span className="badge badge-soft-secondary rounded-pill"
                                                                            >Total:250</span>
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
                                                                            <div className="heading justify-content-center h-auto">
                                                                                <div className="d-flex flex-wrap justify-content-center align-items-center flex-column">
                                                                                    <div className="imageBox_wrap">
                                                                                        <img className=" " src={require('../../assets/images/call-dashboardIcon/customer-service.png')} alt='customer-service' />
                                                                                    </div>
                                                                                    <div className="text-center">
                                                                                        <p>Agents On Calls</p>
                                                                                        <h3 className="mb-0 fw-bolder">
                                                                                            {/* {
                                                                                                    activeCall.filter(
                                                                                                        (call) => call.direction === "inbound"
                                                                                                    ).length
                                                                                                } */}
                                                                                            520
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
                                                                            <div className="heading justify-content-center">
                                                                                <div className="d-flex flex-wrap justify-content-center align-items-center flex-column">
                                                                                    <div className="text-center">
                                                                                        <div className="imageBox_wrap">
                                                                                            <img className=" " src={require('../../assets/images/call-dashboardIcon/missed-call.webp')} alt='missed-call' />
                                                                                        </div>
                                                                                        <p>Missed Inbound Calls</p>
                                                                                        <h3 className="mb-0 fw-bolder">
                                                                                            14
                                                                                            {/* {
                                                                                                    callDetails?.inbound?.missed !== undefined ? callDetails?.inbound?.missed :  */}
                                                                                            {/* <i
                                                                                                className={"fa-regular fa-arrows-rotate fs-5 fa-spin shadow-none bg-transparent float-start w-auto "}
                                                                                            ></i> */}
                                                                                            {/* } */}
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
                                                                            <div className="heading justify-content-center">
                                                                                <div className="d-flex flex-wrap justify-content-center align-items-center flex-column">
                                                                                    <div className="imageBox_wrap">
                                                                                        <img className=" " src={require('../../assets/images/call-dashboardIcon/phone-call.webp')} alt='customer-service' />
                                                                                    </div>
                                                                                    <div className="text-center">
                                                                                        <p> Inbound Calls Completed</p>
                                                                                        <h3 className="mb-0 fw-bolder">
                                                                                            362
                                                                                            {/* {
                                                                                                    callDetails?.inbound?.completed !== undefined ? callDetails?.inbound?.completed :  */}
                                                                                            {/* <i
                                                                                                className={"fa-regular fa-arrows-rotate fs-5 fa-spin shadow-none bg-transparent float-start "}
                                                                                            ></i> */}
                                                                                            {/* } */}
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
                                                                            <div className="heading justify-content-center">
                                                                                <div className="d-flex flex-wrap justify-content-center align-items-center flex-column">
                                                                                    <div className="imageBox_wrap">
                                                                                        <img className=" " src={require('../../assets/images/call-dashboardIcon/total-call.webp')} alt='customer-service' />
                                                                                    </div>
                                                                                    <div className="text-center">
                                                                                        <p>Total Inbound Calls</p>
                                                                                        <h3 className="mb-0 fw-bolder">
                                                                                            58
                                                                                            {/* {callDetails?.inbound?.total !== undefined ? callDetails?.inbound?.total :  */}
                                                                                            {/* <i className={"fa-regular fa-arrows-rotate fs-5 fa-spin shadow-none bg-transparent float-start w-auto "}
                                                                                            ></i> */}
                                                                                            {/* // } */}
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
                                            <div className="col-xxl-4 col-xl-6 col-lg-6 col-md-6">
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
                                                                    {/* {extensionDataLoading && ( */}
                                                                    <i
                                                                        className={"ms-2 fa-regular fa-arrows-rotate fs-5 fa-spin"}
                                                                    ></i>
                                                                    {/* )} */}
                                                                </div>
                                                                <div className="col-xxl-auto col-xl-12 mt-xxl-0 mt-xl-3">
                                                                    <div className="headingExtraInfo" style={{ marginRight: '2.2rem' }}>
                                                                        <div>
                                                                            <span className="badge badge-soft-success rounded-pill"
                                                                            //  style={{ backgroundColor: 'var(--color3)' }}
                                                                            >Active: 03</span>
                                                                        </div>
                                                                        <div className="ms-1">
                                                                            <span className="badge badge-soft-success rounded-pill"
                                                                            // style={{ backgroundColor: 'var(--color3)' }}
                                                                            >Total:&nbsp;45</span>
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
                                                                            <div className="heading justify-content-center">
                                                                                <div className="d-flex flex-wrap justify-content-center align-items-center flex-column">
                                                                                    <div className="imageBox_wrap">
                                                                                        <img className=" " src={require('../../assets/images/call-dashboardIcon/customer-service.png')} alt='customer-service' />
                                                                                    </div>
                                                                                    <div className="text-center">
                                                                                        <p>Agents On Calls</p>
                                                                                        <h3 className="mb-0 fw-bolder">
                                                                                            0
                                                                                            {/* {
                                                                                                    activeCall.filter(
                                                                                                        (call) => call.direction === "outbound"
                                                                                                    ).length
                                                                                                } */}
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
                                                                            <div className="heading justify-content-center">
                                                                                <div className="d-flex flex-wrap justify-content-center align-items-center flex-column">
                                                                                    <div className="imageBox_wrap">
                                                                                        <img className=" " src={require('../../assets/images/call-dashboardIcon/missed-call.webp')} alt='missed-call' />
                                                                                    </div>
                                                                                    <div className="text-center">
                                                                                        <p>Missed Outbound Calls</p>
                                                                                        <h3 className="mb-0 fw-bolder">
                                                                                            56
                                                                                            {/* {
                                                                                                    callDetails?.outbound?.missed !== undefined ? callDetails?.outbound?.missed :  */}
                                                                                            {/* <i
                                                                                                className={"fa-regular fa-arrows-rotate fs-5 fa-spin shadow-none bg-transparent float-start w-auto "}
                                                                                            ></i> */}
                                                                                            {/* } */}
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
                                                                            <div className="heading justify-content-center">
                                                                                <div className="d-flex flex-wrap justify-content-center align-items-center flex-column">
                                                                                    <div className="imageBox_wrap">
                                                                                        <img className=" " src={require('../../assets/images/call-dashboardIcon/phone-call.webp')} alt='customer-service' />
                                                                                    </div>
                                                                                    <div className="text-center">
                                                                                        <p>Outbound Calls Completed</p>
                                                                                        <h3 className="mb-0 fw-bolder">
                                                                                            85
                                                                                            {/* {
                                                                                                    callDetails?.outbound?.completed !== undefined ? callDetails?.outbound?.completed :  */}
                                                                                            {/* <i
                                                                                                className={"fa-regular fa-arrows-rotate fs-5 fa-spin shadow-none bg-transparent float-start w-auto "}
                                                                                            ></i> */}
                                                                                            {/* } */}
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
                                                                            <div className="heading justify-content-center">
                                                                                <div className="d-flex flex-wrap justify-content-center align-items-center flex-column">
                                                                                    <div className="imageBox_wrap">
                                                                                        <img className=" " src={require('../../assets/images/call-dashboardIcon/total-call.webp')} alt='customer-service' />
                                                                                    </div>
                                                                                    <div className="text-center">
                                                                                        <p>Total Outbound Calls</p>
                                                                                        <h3 className="mb-0 fw-bolder">
                                                                                            25
                                                                                            {/* {callDetails?.outbound?.total !== undefined ? callDetails?.outbound?.total : */}
                                                                                            {/* <i
                                                                                                className={"fa-regular fa-arrows-rotate fs-5 fa-spin shadow-none bg-transparent float-start w-auto "}
                                                                                            ></i> */}
                                                                                            {/* } */}
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
                                        </div>
                                        <div className="row ">
                                            <div className="col-xl-4 col-lg-6 col-md-6 mb-3">
                                                <div className="itemWrapper mt-0 a d_card1">
                                                    <div className="heading h-auto">
                                                        <div className="d-flex flex-wrap justify-content-between align-items-center w-100">
                                                            <div className="col-10">
                                                                <h5>Total Ai Agents</h5>
                                                                {/* <p>7 October, 2024</p> */}
                                                            </div>
                                                            <div
                                                                className="col-2"
                                                            // onClick={() => Navigate("/extensions")}
                                                            >
                                                                <i className="fa-duotone fa-phone-office"></i>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="data-number2">
                                                        <div className="d-flex flex-wrap justify-content-between align-items-center w-100">
                                                            <div className="col-10">
                                                                <h5>100</h5>
                                                                <p>
                                                                    {/* {activeCall.length} on Call /{" "} */}
                                                                    {/* {(assignedExtension.length) ||
                                                                        0}{" "}
                                                                    Assigned /{" "}
                                                                    {(extension.length - assignedExtension.length) ||
                                                                        0}{" "} */}
                                                                    Total Agents
                                                                </p>
                                                            </div>

                                                        </div>
                                                    </div>
                                                    <div className="d_chartImg">
                                                        <img
                                                            src={require("../../assets/images/d-chart1.png")}
                                                            alt="diagram"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-xl-4 col-lg-6 col-md-6 mb-3">
                                                <div className="itemWrapper mt-0 b d_card2 position-relative">
                                                    <div className="heading h-auto">
                                                        <div className="d-flex flex-wrap justify-content-between align-items-center w-100">
                                                            <div className="col-10">
                                                                <h5>Total Number</h5>
                                                                {/* <p>7 October, 2024</p> */}
                                                            </div>
                                                            <div
                                                                className="col-2"
                                                            // onClick={() => navigate("/cal-center-queue")}
                                                            >
                                                                <i className="fa-duotone fa-clock"></i>
                                                            </div>
                                                        </div>

                                                    </div>
                                                    <div className="data-number2">
                                                        <div className="d-flex flex-wrap justify-content-between align-items-center w-100">
                                                            <div className="col-10">
                                                                <h5>25</h5>
                                                                <p>
                                                                    {/* {activeCall.length > 0 ? activeCall
                                                                        .filter((item) => item.application_state === "callcenter" && (item.b_callstate === "ACTIVE" || item.b_callstate === "HELD")).length : 0}{" "} */}
                                                                    Total Number

                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="d_chartImg">
                                                        <img
                                                            src={require("../../assets/images/d-chart2.png")}
                                                            alt="diagram"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-xl-4 col-lg-6 col-md-6 mb-3">
                                                <div className="itemWrapper mt-0 c d_card3">
                                                    <div className="heading h-auto">
                                                        <div className="d-flex flex-wrap justify-content-between align-items-center w-100">
                                                            <div className="col-10">
                                                                <h5>Squared</h5>
                                                                {/* <p>7 October, 2024</p> */}
                                                            </div>
                                                            <div
                                                                className="col-2"
                                                            // onClick={() => navigate("/ring-groups")}
                                                            >
                                                                <i className="fa-duotone fa-solid fa-bell-ring"></i>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="data-number2">
                                                        <div className="d-flex flex-wrap justify-content-between align-items-center w-100">
                                                            <div className="col-10">
                                                                <h5>36</h5>
                                                                <p>
                                                                    {/* {activeCall.length > 0 ? activeCall
                                                                        .filter((item) => item.application_state === "ringgroup" && (item.b_callstate === "ACTIVE" || item.b_callstate === "HELD")).length : 0} Active Calls /{" "}
                                                                    {(ringGroupData &&
                                                                        ringGroupData.filter(
                                                                            (data) =>
                                                                                data["variable_DIALSTATUS"] !== "SUCCESS"
                                                                        ).length) ||
                                                                        0}{" "} */}
                                                                    Squared
                                                                </p>
                                                            </div>

                                                        </div>
                                                    </div>
                                                    <div className="d_chartImg">
                                                        <img
                                                            src={require("../../assets/images/d-chart3.png")}
                                                            alt="diagram"
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                          <div className='row'>
                                            <div className=' col-12 mb-3'>
                                                <div className="itemWrapper mt-0 a">
                                                    <div className='heading h-auto'>
                                                        <div className="d-flex flex-wrap justify-content-between align-items-center">
                                                            <div className='col-auto'>
                                                                <h5 className="d-flex">Agent Status

                                                                </h5>
                                                            </div>

                                                        </div>
                                                    </div>
                                                    <div className=''>
                                                        <div className="tableContainer mt-0" style={{    height: 'calc(100vh - 569px)'}}>
                                                            <table>
                                                                <thead>
                                                                    <tr>
                                                                        <th className='text-start'>Status</th>
                                                                        <th className='text-start'>Name</th>
                                                                        <th className='text-center'>Number</th>
                                                                        <th className='text-center'>Direction</th>
                                                                        <th className='text-center'>Origin</th>
                                                                        <th className='text-center'>Route</th>
                                                                        <th className='text-center'>Routed Number</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>

                                                                    <tr>
                                                                        <td>
                                                                            <div class="d-flex align-items-center"><span class="extensionStatus online"></span><span class="ms-1">Online</span></div>
                                                                        </td>
                                                                        <td>
                                                                            <div className="d-flex align-items-center">
                                                                                <div className="tableProfilePicHolder">
                                                                                    <img
                                                                                        src={require('../../assets/images/placeholder-image.webp')}

                                                                                    />

                                                                                    {/* <i className="fa-light fa-user" /> */}

                                                                                </div>
                                                                                <div className="ms-2">Webvio Technologies</div>
                                                                            </div>
                                                                        </td>
                                                                        <td>2546312562</td>
                                                                        <td style={{ textTransform: 'capitalize' }}>
                                                                            Abc
                                                                        </td>
                                                                        <td>abc</td>
                                                                        <td>abc</td>
                                                                        <td>256314568</td>
                                                                    </tr>

                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                        <div className='row'>
                                            <div className='col-xl-6 col-lg-12 col-12 mb-3'>
                                                <div className="itemWrapper mt-0 a">
                                                    <div className='heading h-auto'>
                                                        <div className="d-flex flex-wrap justify-content-between align-items-center">
                                                            <div className='col-auto'>
                                                                <h5 className="d-flex">Monthly
                                                                    <div class="my-auto position-relative ms-3">


                                                                    </div>
                                                                </h5>
                                                            </div>

                                                        </div>
                                                    </div>
                                                    <div className='d-flex flex-wrap justify-content-between mt-1'>
                                                        <canvas ref={canvasRef} width="400" height="200" />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='col-xl-6 col-lg-12 col-12 mb-3'>
                                                <div className="itemWrapper mt-0 a">
                                                    <div className='heading h-auto'>
                                                        <div className="d-flex flex-wrap justify-content-between align-items-center">
                                                            <div className='col-auto'>
                                                                <h5 className="d-flex">Annually
                                                                    <div class="my-auto position-relative ms-3">


                                                                    </div>
                                                                </h5>
                                                            </div>

                                                        </div>
                                                    </div>
                                                    <div className='d-flex flex-wrap justify-content-between mt-1'>
                                                        <canvas ref={canvasTwoRef} width="400" height="200" />
                                                    </div>
                                                </div>
                                            </div>



                                        </div>
                                      
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

            </main>
        </>
    )
}

export default AiDashboard