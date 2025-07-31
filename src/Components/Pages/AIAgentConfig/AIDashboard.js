import React, { useEffect, useState } from "react";
import Header from "../../CommonComponents/Header";
import "../../assets/css/components/aiDashboard.css";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { hexToRgb } from "@mui/material";
import { height } from "@mui/system";
import {
  awsGeneralGetFunction,
  awsGeneralPostFunction,
} from "../../GlobalFunction/globalFunction";
import ThreeDotedLoader from "../../Loader/ThreeDotedLoader";

ChartJS.register(ArcElement, Tooltip, Legend);

function AIDashboard() {
  const [aiData, setAiData] = useState();
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState("7_days");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  useEffect(() => {
    handleDateChange(filterType);
  }, [filterType]);

  const getLastNDaysRange = (days) => {
    const today = new Date();
    const priorDate = new Date();
    priorDate.setDate(today.getDate() - (days - 1));
    const format = (date) => date.toISOString().split("T")[0];
    return {
      startDate: format(priorDate),
      endDate: format(today),
    };
  };

  const handleDateChange = (value) => {
    setFilterType(value);
    if (value === "7_days") {
      const { startDate, endDate } = getLastNDaysRange(7);
      setFromDate(startDate);
      setToDate(endDate);
    } else if (value === "1_month") {
      const today = new Date();
      const past = new Date();
      past.setMonth(today.getMonth() - 1);
      setFromDate(past.toISOString().split("T")[0]);
      setToDate(today.toISOString().split("T")[0]);
    } else if (value === "3_month") {
      const today = new Date();
      const past = new Date();
      past.setMonth(today.getMonth() - 3);
      setFromDate(past.toISOString().split("T")[0]);
      setToDate(today.toISOString().split("T")[0]);
    } else if (value === "date") {
      const today = new Date().toISOString().split("T")[0];
      setFromDate(today);
      setToDate(""); // Hide or clear To
    } else if (value === "date_range") {
      setFromDate("");
      setToDate("");
    }
  };

  const todayDate = new Date().toISOString().split("T")[0];

  const handleFromDateChange = (e) => {
    const selectedDate = e.target.value;

    // Prevent future date
    if (selectedDate > todayDate) {
      alert("From date cannot be in the future.");
      return;
    }

    // Ensure from is not greater than to
    if (toDate && selectedDate > toDate) {
      alert("From date cannot be after To date.");
      return;
    }

    setFromDate(selectedDate);
  };

  const handleToDateChange = (e) => {
    const selectedDate = e.target.value;

    // Prevent future date
    if (selectedDate > todayDate) {
      alert("To date cannot be in the future.");
      return;
    }

    // Ensure to is not less than from
    if (fromDate && selectedDate < fromDate) {
      alert("To date cannot be before From date.");
      return;
    }

    setToDate(selectedDate);
  };

  const data = {
    labels: [
      "Customer Satisfaction",
      "Dropped Call Rate",
      "Resolution Score_averag",
      "Escalation Rate",
    ],

    datasets: [
      {
        label: "# of Votes",
        data: [
          aiData?.csat_average,
          aiData?.dropped_call_rate,
          aiData?.resolution_score_average,
          aiData?.escalation_rate,
        ],
        backgroundColor: [
          "rgba(255, 99, 133, 0.81)",
          "rgba(54, 163, 235, 0.81)",
          "rgba(255, 207, 86, 0.81)",
          "rgba(77, 81, 87, 0.32) ",
        ],
      },
    ],
  };
  useEffect(() => {
    async function getData() {
      const res = await awsGeneralPostFunction("/dev2/ai-dashboard", {
        date_range: `${fromDate}:${toDate}`,
      });
      if (res?.status) {
        setLoading(false);
        setAiData(res?.data);
      } else {
        setLoading(false);
      }
    }
    if (fromDate) {
      getData();
    }
  }, [fromDate, toDate]);

  function getAverageDurationHHMMSS(data) {
    if (!Array.isArray(data) || data.length === 0) return "00:00:00";

    const total = data.reduce(
      (sum, item) => sum + (item.average_duration_sec || 0),
      0
    );

    const avg = total / data.length;

    const format = (seconds) => {
      const hrs = Math.floor(seconds / 3600);
      const mins = Math.floor((seconds % 3600) / 60);
      const secs = Math.floor(seconds % 60);
      return [hrs, mins, secs].map((v) => String(v).padStart(2, "0")).join(":");
    };

    return format(avg);
  }

  return (
    <>
      <main className="mainContent ">
        <section id="phonePage">
          <Header title="AI Dashboard" />
          <div className="container-fluid lightBG_ai " style={{ height: "100vh" }}>
            <div className=" position-relative h-100" >
              {loading ? (
                <ThreeDotedLoader />
              ) : (
                <>
                  <div className="row mt-3">
                    <div className="col-xxl-8">
                      <div className="row gx-xxl-3 gx-lg-2">
                        <div className="col-12 mb-3">
                          <div className="row">
                            <div class="col-xxl-4 col-xl-4 col-lg-4 col-sm-6 col-12 mb-1">
                              <div class="card custom-card p-0 mb-0 w-100 h-100">
                                <div class="card-body align-content-center">
                                  <div class="d-flex align-items-top align-items-center">
                                    <div class="me-3">
                                      <span class="avatar avatar-md p-2 bg-info">
                                        <i class=" fa-solid fa-headset text-white fs-4"></i>
                                      </span>
                                    </div>
                                    <div class="flex-fill">
                                      <div class="d-flex mb-1 align-items-top justify-content-between">
                                        <h5 class="fw-semibold mb-0 lh-1">Calls analyzed</h5>
                                      </div>
                                      <p class="mb-0 fs-12 op-7 text-muted fw-semibold"> calls in last 7 days</p>
                                      <div class="text-primary fw-semibold">{aiData?.call_volume_trend.reduce(
                                        (sum, item) => sum + item.count,
                                        0
                                      )}</div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div class="col-xxl-4 col-xl-4 col-lg-4 col-sm-6 col-12 mb-1">
                              <div class="card custom-card p-0 mb-0 w-100 h-100">
                                <div class="card-body align-content-center">
                                  <div class="d-flex align-items-top align-items-center">
                                    <div class="me-3">
                                      <span class="avatar avatar-md p-2 bg-pink">
                                        <i class="fas fa-waveform text-white fs-5"></i>

                                      </span>
                                    </div>
                                    <div class="flex-fill">
                                      <div class="d-flex mb-1 align-items-top justify-content-between">
                                        <h5 class="fw-semibold mb-0 lh-1"> Average call duration</h5>
                                      </div>
                                      <p class="mb-0 fs-12 op-7 text-muted fw-semibold"> score in last 7 days</p>
                                      <div class="text-primary fw-semibold">{getAverageDurationHHMMSS(
                                        aiData?.avg_duration_trend
                                      )} </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div class="col-xxl-4 col-xl-4 col-lg-4 col-sm-6 col-12 mb-1">
                              <div class="card custom-card p-0 mb-0 w-100 h-100">
                                <div class="card-body align-content-center">
                                  <div class="d-flex align-items-top align-items-center">
                                    <div class="me-3">
                                      <span class="avatar avatar-md p-2 bg-primary">
                                        <i class="fas fa-phone-volume text-white fs-5"></i>
                                      </span>
                                    </div>
                                    <div class="flex-fill">
                                      <div class="d-flex mb-1 align-items-top justify-content-between">
                                        <h5 class="fw-semibold mb-0 lh-1">Unique moments</h5>
                                      </div>
                                      <p class="mb-0 fs-12 op-7 text-muted fw-semibold"> captured during coustomer interactions</p>
                                      <div class="text-primary fw-semibold">{aiData?.unique_moments.length}</div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                          </div>
                          {/* <div className="gridCall">
                            <div className="w-100">
                              <div className="card small-widget overflow-hidden cardbg_gradient">
                                <div className="card-body primary">
                                  {" "}
                                  <span className="text25">Calls analyzed </span>
                                  <div className="textArea">
                                    <p className=" fs-14 text-b mb-0">
                                      <strong>
                                        {aiData?.call_volume_trend.reduce(
                                          (sum, item) => sum + item.count,
                                          0
                                        )}
                                      </strong>{" "}
                                      <span className="f-light fs-12">
                                        {" "}
                                        calls in last 7 days
                                      </span>
                                    </p>
                                  </div>
                                  <div className="bg-gradient">
                                    <img
                                      src={require("../../assets/images/customer-service.png")}
                                      alt="customer-service"
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="w-100">
                              <div className="card small-widget overflow-hidden cardbg_gradient2">
                                <div className="card-body success ">
                                  {" "}
                                  <span className="text25">
                                    Average call duration{" "}
                                  </span>
                                  <div className="textArea">
                                    <p className=" fs-14 text-b mb-0">
                                      <strong>
                                        {getAverageDurationHHMMSS(
                                          aiData?.avg_duration_trend
                                        )}
                                      </strong>{" "}
                                      <span className="f-light fs-12">
                                        {" "}
                                        score in last 7 days
                                      </span>
                                    </p>
                                  </div>
                                  <div className="bg-gradient">
                                    <img
                                      src={require("../../assets/images/customer-care.png")}
                                      alt="customer-care"
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="w-100">
                              <div className="card small-widget overflow-hidden cardbg_gradient3">
                                <div className="card-body warning ">
                                  {" "}
                                  <span className="text25">Unique moments </span>
                                  <div className="textArea">
                                    <p className=" fs-14 text-b mb-0">
                                      <strong>{aiData?.unique_moments.length}</strong>{" "}
                                      <span className="f-light fs-12">
                                        {" "}
                                        captured during coustomer interactions
                                      </span>
                                    </p>
                                  </div>
                                  <div className="bg-gradient">
                                    <img
                                      src={require("../../assets/images/phone.png")}
                                      alt="phone"
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div> */}
                        </div>

                        <div className="col-12 mb-3">
                          <div className="card border-0 shadow-none h-100">
                            <div className="card-header">
                              <div className="header-top">
                                <h5 className="m-0">Average Call Score</h5>
                              </div>
                            </div>
                            {/* <div className='card-header bg-transparent py-3' style={{ borderColor: 'var(--me-border1)' }}>
                        <h6 className='mb-0'></h6>
                      </div> */}
                            <div className="card-body py-4">
                              <div
                                style={{
                                  width: "100%",
                                  height: "340px",
                                  position: "relative",
                                  margin: "0 auto",
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                }}
                              >
                                <Doughnut data={data} />
                              </div>
                            </div>
                          </div>

                          {/* <div className="card">
                      <div className="card-header ">
                        <div className="header-top">
                          <h5 className='mb-0'>Average Call Score</h5>
                        
                           <div style={{ width: '100%', height: '300px', position: 'relative', margin: '0 auto', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                          <Doughnut data={data} />
                           </div>
                        </div>
                      </div>
                      <div className="card-body pt-0">
                        <div className="monthly-profit">
                          <div id="profitmonthly"></div>
                        </div>
                      </div>
                    </div> */}
                        </div>
                      </div>
                    </div>
                    <div className="col-xxl-4 mb-3 h-100">
                      <div className="card d-flex justify-content-start">
                        <div className="card-body d-flex flex-row flex-wrap align-items-center border-0">
                          <div className="col-4 formRow border-0 pt-0">
                            <label className="formLabel text-start mb-0 w-100 pt-0">
                              Date Filter
                            </label>
                            <select
                              className="formItem"
                              value={filterType}
                              onChange={(e) => handleDateChange(e.target.value)}
                            >
                              <option value="date">Single Date</option>
                              <option value="date_range">Date Range</option>
                              <option value="7_days">Last 7 Days</option>
                              <option value="1_month">Last 1 Month</option>
                              <option value="3_month">Last 3 Months</option>
                            </select>
                          </div>

                          <div className="col-4 formRow border-0 pt-0 ">
                            <label className="formLabel text-start mb-0 w-100 pt-0">
                              From
                            </label>
                            <div className="d-flex w-100">
                              <input
                                type="date"
                                className="formItem"
                                value={fromDate}
                                onChange={(e) => setFromDate(e.target.value)}
                                max={toDate || todayDate} // Prevent 'from' > 'to' or > today
                              />
                            </div>
                          </div>

                          {/* To Date – only when not single date mode */}
                          {filterType !== "date" && (
                            <div className="col-4 formRow border-0 pt-0 ">
                              <label className="formLabel text-start mb-0 w-100 pt-0">
                                To
                              </label>
                              <div className="d-flex w-100">
                                <input
                                  type="date"
                                  className="formItem"
                                  value={toDate}
                                  onChange={(e) => setToDate(e.target.value)}
                                  min={fromDate || ""}
                                  max={todayDate} // Restrict to today or earlier
                                />
                              </div>
                            </div>
                          )}

                        </div>
                      </div>
                      <div className="schedule-card card ">
                        <div className=" card-header">
                          <div className="header-top">
                            <h5 className="m-0">Customer Sentiment Analytics</h5>
                          </div>
                        </div>
                        <div className=" card-body pt-0">
                          <ul className=" d-flex list-group">
                            {Object.entries(aiData?.sentiment_dist || {}).map(
                              ([key, value], index) => {
                                return (
                                  <>
                                    <li class="list-group-item border-top-0 border-start-0 border-end-0" key={index}>
                                      <div class="d-flex align-items-center w-100">
                                        <div class="me-2 lh-1"> <span class="avatar avatar-md avatar-rounded bg-primary-transparent">   <i className="fa-regular fa-face-worried "></i> </span> </div>
                                        <div class="flex-fill">
                                          <p class="mb-0 fw-semibold"> {value}</p>
                                        </div>
                                        <div class="text-end">
                                          <span class="badge bg-success-transparent"> {key}</span> </div>
                                      </div>
                                    </li>




                                    {/* <li
                                  //   key={index}
                                  //   className="primary list-group-item"
                                  // >
                                  //   <div className="me-2">
                                  //     <span className="avatar avatar-rounded bg-secondary-transparent">
                                  //       <i className="fa-regular fa-face-worried text-primary"></i>
                                  //     </span>
                                  //   </div>
                                  //   <div className="flex-fill">
                                  //     <div className="d-flex justify-content-between align-items-center">
                                  //       <h6
                                  //         className="mb-0"
                                  //         style={{ textTransform: "capitalize" }}
                                  //       >
                                  //         {key}
                                  //       </h6>
                                  //       <p className="text-primary fw-bold mb-0">
                                  //         {value}
                                  //       </p>
                                  //     </div>
                                  //     <div className="progress re_progress" role="progressbar">
                                  //       <div
                                  //         className="progress-bar bg-primary"
                                  //         style={{ width: `${(value / totalValue) * 100}%` }}
                                  //       ></div>
                                  //     </div>
                                  //   </div>
                                  // </li> */}
                                  </>
                                );
                              }
                            )}
                          </ul>
                        </div>
                      </div>


                      {/* <li class="list-group-item border-top-0 border-start-0 border-end-0" >
                        <div class="d-flex align-items-center w-100">
                          <div class="me-2 lh-1"> <span class="avatar avatar-md avatar-rounded bg-primary-transparent">   <i className="fa-regular fa-face-worried "></i> </span> </div>
                          <div class="flex-fill">
                            <p class="mb-0 fw-semibold">neutral</p>
                          </div>
                          <div class="text-end">
                            <span class="badge bg-success-transparent">90</span> </div>
                        </div>
                      </li>
                      <li class="list-group-item border-top-0 border-start-0 border-end-0" >
                        <div class="d-flex align-items-center w-100">
                          <div class="me-2 lh-1"> <span class="avatar avatar-md avatar-rounded bg-primary-transparent">   <i className="fa-regular fa-face-worried "></i> </span> </div>
                          <div class="flex-fill">
                            <p class="mb-0 fw-semibold">neutral</p>
                          </div>
                          <div class="text-end">
                            <span class="badge bg-success-transparent">90</span> </div>
                        </div>
                      </li> */}

                      {/* <div className="card border-0 shadow-none mb-3">
                    <div className="card-header">
                      <div className="header-top">
                        <h5 className="m-0">Top 5 Moments</h5>
                      </div>
                    </div>
                    <div className="card-body ">
                      <span className="badge bg-secondary-subtle text-secondary secondary-badge-border me-1  ">
                        Product Demo
                      </span>
                      <span className="badge bg-secondary-subtle text-secondary secondary-badge-border me-1  ">
                        Email Marketing
                      </span>
                      <span className="badge bg-secondary-subtle text-secondary secondary-badge-border me-1  ">
                        Problem Resolution
                      </span>
                      <span className="badge bg-secondary-subtle text-secondary secondary-badge-border me-1  ">
                        Meeting
                      </span>
                      <span className="badge bg-secondary-subtle text-secondary secondary-badge-border me-1  ">
                        Flexible schedule
                      </span>
                    </div>
                  </div>
                  <div className="card border-0 shadow-none mb-3">
                    <div className="card-header">
                      <div className="header-top">
                        <h5 className="m-0">Top 5 Customs Moments</h5>
                      </div>
                    </div>
                    <div className="card-body ">
                      <span className="badge bg-secondary-subtle text-secondary secondary-badge-border me-1  ">
                        Zoho
                      </span>
                      <span className="badge bg-secondary-subtle text-secondary secondary-badge-border me-1  ">
                        Sale
                      </span>
                      <span className="badge bg-secondary-subtle text-secondary secondary-badge-border me-1  ">
                        Hubspot
                      </span>
                      <span className="badge bg-secondary-subtle text-secondary secondary-badge-border me-1  ">
                        Package
                      </span>
                      <span className="badge bg-secondary-subtle text-secondary secondary-badge-border me-1  ">
                        Meeting
                      </span>
                    </div>
                  </div> */}
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-12">
                      <div className="card customAicard p-0 border-0 shadow-none">
                        <div className="card-header">
                          <div className="header-top">
                            <h5 className="m-0">Agent Analytics</h5>
                          </div>
                        </div>

                        <div className="card-body">
                          <div className="tableContainer ai-agent-analytics">
                            <table>
                              <thead>
                                <tr>
                                  <th>Name</th>
                                  <th>Avg Call Duration</th>
                                  <th>Customer Sentiments</th>
                                  <th>Customer Satisfaction</th>
                                  <th>Top Moments</th>
                                </tr>
                              </thead>
                              <tbody>
                                {aiData?.agent_report.map((item, key) => {
                                  return (
                                    <tr>
                                      <td>
                                        <div className="d-flex align-items-center">
                                          <div className="tableProfilePicHolder">
                                            {/* {item.profile_picture ? ( */}
                                            <img
                                              src={require("../../assets/images/placeholder-image.webp")}
                                            // onError={(e) => e.target.src = require('../../assets/images/placeholder-image.webp')}
                                            />
                                            {/* ) : ( */}
                                            {/* <i className="fa-light fa-user" /> */}
                                            {/* )} */}
                                          </div>
                                          <div className="ms-2">
                                            {item?.agent}
                                          </div>
                                        </div>
                                      </td>
                                      <td>
                                        <span className="badge badge-soft-primary  rounded-pill text-black">
                                          {item?.average_duration_sec}{" "} seconds
                                        </span>
                                      </td>
                                      <td>
                                        <span className="badge badge-soft-primary  rounded-pill text-black">
                                          {parseFloat(
                                            item?.average_sentiment_score
                                          ).toFixed(2)}
                                        </span>
                                      </td>
                                      <td>
                                        {" "}
                                        <span className="badge badge-soft-primary  rounded-pill text-black">
                                          {item?.average_csat_score}
                                        </span>
                                      </td>
                                      <td>
                                        {item?.top_moments.map(
                                          (moment, index) => {
                                            return (
                                              <span
                                                key={index}
                                                className="badge badge-soft-secondary rounded-pill me-2 text-black"
                                              >
                                                {moment}
                                              </span>
                                            );
                                          }
                                        )}
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

export default AIDashboard;
