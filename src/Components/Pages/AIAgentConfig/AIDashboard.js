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
  function getLast7DaysRange() {
    const today = new Date();
    const priorDate = new Date();
    priorDate.setDate(today.getDate() - 6); // 6 days before today
    const format = (date) => date.toISOString().split("T")[0];
    return {
      startDate: format(priorDate),
      endDate: format(today),
    };
  }
  const { startDate, endDate } = getLast7DaysRange();

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
        date_range: `${startDate}:${endDate}`,
      });
      if (res?.status) {
        setLoading(false);
        setAiData(res?.data);
      } else {
        setLoading(false);
      }
    }
    getData();
  }, []);

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
          <div className="container-fluid lightBG_ai">
            {loading ? (
              <ThreeDotedLoader />
            ) : (<>
              <div className="row mt-3">
                <div className="col-xxl-8">
                  <div className="row gx-xxl-3 gx-lg-2">
                    <div className="col-xl-4 col-lg-6 col-md-6 mb-3">
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
                            {/* <i className="fa-solid fa-headset "></i> */}
                            <img
                              src={require("../../assets/images/customer-service.png")}
                              alt="customer-service"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-xl-4 col-lg-6 col-md-6 mb-3">
                      <div className="card small-widget overflow-hidden cardbg_gradient2">
                        <div className="card-body success ">
                          {" "}
                          <span className="text25">Average call duration </span>
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
                            {/* <i className="fa-solid fa-headset "></i> */}
                            <img
                              src={require("../../assets/images/customer-care.png")}
                              alt="customer-care"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-xl-4 col-lg-6 col-md-6 mb-3">
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
                            {/* <i className="fa-solid fa-headset "></i> */}
                            <img
                              src={require("../../assets/images/phone.png")}
                              alt="phone"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="col-12">
                      <div className="card border-0 shadow-none">
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
                <div className="col-xxl-4">
                  <div className="d-flex justify-content-start">
                    <div className="formRow border-0 pt-0">
                      <label className="formLabel text-start mb-0 w-100 pt-0">Date Filter</label>
                      <select className="formItem">
                        <option value="date">Single Date</option>
                        <option value="date_range">Date Range</option>
                        <option value="7_days">Last 7 Days</option>
                        <option value="1_month">Last 1 Month</option>
                        <option value="3_month">Last 3 Months</option>
                      </select>
                    </div>
                    <div className="formRow border-0 pt-0">
                      <label className="formLabel text-start mb-0 w-100 pt-0">From</label>
                      <div className="d-flex w-100">
                        <input type="date" className="formItem" defaultValue="" />
                      </div>
                    </div>
                    <div className="formRow border-0 pt-0">
                      <label className="formLabel text-start mb-0 w-100 pt-0">To</label>
                      <div className="d-flex w-100">
                        <input type="date" className="formItem" defaultValue="" />
                      </div>
                    </div>
                  </div>
                  <div className="schedule-card card">
                    <div className=" card-header">
                      <div className="header-top">
                        <h5 className="m-0">Sentiments Analytics</h5>
                      </div>
                    </div>
                    <div className=" card-body">
                      <ul className="schedule-list d-flex list-group">
                        {Object.entries(aiData?.sentiment_dist || {}).map(
                          ([key, value], index) => {
                            return (
                              <li
                                key={index}
                                className="primary list-group-item"
                              >
                                <div className="me-2">
                                  <span className="avatar avatar-rounded bg-secondary-transparent">
                                    <i className="fa-regular fa-face-worried text-primary"></i>
                                  </span>
                                </div>
                                <div className="flex-fill">
                                  <div className="d-flex justify-content-between align-items-center">
                                    <h6 className="mb-0" style={{ textTransform: 'capitalize' }}>{key}</h6>
                                    <p className="text-primary fw-bold mb-0">
                                      {value}
                                    </p>
                                  </div>
                                  {/* Optional progress bar */}
                                  {/* <div className="progress re_progress" role="progressbar">
          <div
            className="progress-bar bg-primary"
            style={{ width: `${(value / totalValue) * 100}%` }}
          ></div>
        </div> */}
                                </div>
                              </li>
                            );
                          }
                        )}
                      </ul>
                    </div>
                  </div>
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
                                      <div className="ms-2">{item?.agent}</div>
                                    </div>
                                  </td>
                                  <td>
                                    <span className="badge badge-soft-primary  rounded-pill">
                                      {item?.average_duration_sec} seconds
                                    </span>
                                  </td>
                                  <td>
                                    <span className="badge badge-soft-primary  rounded-pill">
                                      {parseFloat(item?.average_sentiment_score).toFixed(2)}
                                    </span>
                                  </td>
                                  <td>
                                    {" "}
                                    <span className="badge badge-soft-primary  rounded-pill">
                                      {item?.average_csat_score}
                                    </span>
                                  </td>
                                  <td>
                                    {item?.top_moments.map((moment, index) => {
                                      return (
                                        <span
                                          key={index}
                                          className="badge badge-soft-secondary rounded-pill me-2"
                                        >
                                          {moment}
                                        </span>
                                      );
                                    })}
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
        </section>
      </main>
    </>
  );
}

export default AIDashboard;
