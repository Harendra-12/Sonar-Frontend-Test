import React, { useEffect, useState } from "react";
import Header from "../../CommonComponents/Header";
import { featureUnderdevelopment, generalGetFunction } from "../../GlobalFunction/globalFunction";
import GraphChart from "../../CommonComponents/GraphChart";
import { use } from "react";
import { useSelector } from "react-redux";
import EmptyPrompt from '../../Loader/EmptyPrompt'

function BillingDashboard() {
  const accountDetails = useSelector((state) => state.accountDetails);
  // Graph Module
  const [graphData, setGraphData] = useState({
    totalCallMin: [],
    numberOfCall: [],
    callCostPerHour: [],
    totalSpent: [],
  })
  const [graphFilter, setGraphFilter] = useState({
    totalCallMin: {
      interval: "1",
      startTime: "24",
    },
    numberOfCall: {
      date: "7_days"
    },
    callCostPerHour: {
      interval: "1",
      startTime: "24",
    },
    totalSpent: [],
  });

  const [graphLoading, setGraphLoading] = useState({
    totalCallMin: 1,
    numberOfCall: 1,
    callCostPerHour: 1
  });

  const [bcStartDateFlag, setBcStartDateFlag] = useState(() => getbcDateFlags());
  const [bcCdrData, setBcCdrData] = useState([]);
  const [bcCdrDataYearly, setBcCdrDataYearly] = useState([]);
  const [bcLoading, setBcLoading] = useState(false);

  // Call Cost Graph Data
  const fetchTotalCallCostGraphData = async () => {
    const endDate = new Date().toISOString().split("T")[0];
    const startDate = new Date();
    const currentTime = new Date().toTimeString().slice(0, 8);

    switch (graphFilter.callCostPerHour.startTime) {
      case "1":
        startDate?.setHours(startDate.getHours() - 1);
        break;
      case "3":
        startDate?.setHours(startDate.getHours() - 3);
        break;
      case "6":
        startDate?.setHours(startDate.getHours() - 6);
        break;
      case "12":
        startDate?.setHours(startDate.getHours() - 12);
        break;
      case "24":
        startDate?.setHours(startDate.getHours() - 24);
        break;
      default:
        startDate?.setHours(0, 0, 0);
    }

    const startDateTimeObj = {
      date: startDate.toISOString().split("T")[0],
      time: startDate.toTimeString().slice(0, 8)
    }

    const startDateTime = `${startDateTimeObj.date} ${startDateTimeObj.time}`;
    const endDateTime = `${endDate} ${currentTime}`;

    try {
      setGraphLoading((prevGraphLoading) => ({
        ...prevGraphLoading,
        callCostPerHour: 1
      }));
      const apiCall = await generalGetFunction(`/cdr-graph-report?start_date=${startDateTime}&end_date=${endDateTime}&hours=${graphFilter.totalCallMin.interval}`);
      if (apiCall.status) {
        setGraphData((prevGraphData) => ({
          ...prevGraphData,
          callCostPerHour: apiCall.filtered
        }));
        setGraphLoading((prevGraphLoading) => ({
          ...prevGraphLoading,
          callCostPerHour: 0
        }));
      }
    } catch (err) {
      console.log(err);
    }
  }

  // Call Per Hour Graph Data
  const fetchTotalCallMinGraphData = async () => {
    const endDate = new Date().toISOString().split("T")[0];
    const startDate = new Date();
    const currentTime = new Date().toTimeString().slice(0, 8);

    switch (graphFilter.totalCallMin.startTime) {
      case "1":
        startDate?.setHours(startDate.getHours() - 1);
        break;
      case "3":
        startDate?.setHours(startDate.getHours() - 3);
        break;
      case "6":
        startDate?.setHours(startDate.getHours() - 6);
        break;
      case "12":
        startDate?.setHours(startDate.getHours() - 12);
        break;
      case "24":
        startDate?.setHours(startDate.getHours() - 24);
        break;
      default:
        startDate?.setHours(0, 0, 0);
    }

    const startDateTimeObj = {
      date: startDate.toISOString().split("T")[0],
      time: startDate.toTimeString().slice(0, 8)
    }

    const startDateTime = `${startDateTimeObj.date} ${startDateTimeObj.time}`;
    const endDateTime = `${endDate} ${currentTime}`;

    try {
      setGraphLoading((prevGraphLoading) => ({
        ...prevGraphLoading,
        totalCallMin: 1
      }));
      const apiCall = await generalGetFunction(`/cdr-graph-report?start_date=${startDateTime}&end_date=${endDateTime}&hours=${graphFilter.totalCallMin.interval}`);
      if (apiCall.status) {
        setGraphData((prevGraphData) => ({
          ...prevGraphData,
          totalCallMin: apiCall.filtered,
        }));
        setGraphLoading((prevGraphLoading) => ({
          ...prevGraphLoading,
          totalCallMin: 0
        }));
      }
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    fetchTotalCallCostGraphData();
  }, [graphFilter.callCostPerHour])

  useEffect(() => {
    fetchTotalCallMinGraphData();
  }, [graphFilter.totalCallMin])

  function getbcDateFlags() {
    const today = new Date();
    const startDate = (today.getFullYear() - 1) + '-' + ('0' + (today.getMonth() + 1)).slice(-2);
    const endDate = today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).slice(-2);

    return { startDate, endDate }
  }

  const getBillingCostCDRData = async () => {
    setBcLoading(true)
    const { startDate, endDate } = bcStartDateFlag;
    const response = await generalGetFunction(`/billing-cost-cdr?start_date=${startDate}&end_date=${endDate}&type=monthly`);
    if (response.status) {
      setBcCdrData(response.data);
      setBcLoading(false)
    }
  }

  const getBillingCostCDRDataYearly = async () => {
    setBcLoading(true)
    const startDate = new Date(accountDetails.subscription[0].created_at.split("T")[0]);
    const formatedStartDate = startDate.getFullYear() + '-' + ('0' + (startDate.getMonth() + 1)).slice(-2);
    const endDate = new Date();
    const formatedEndDate = endDate.getFullYear() + '-' + ('0' + (endDate.getMonth() + 1)).slice(-2);

    const response = await generalGetFunction(`/billing-cost-cdr?start_date=${formatedStartDate}&end_date=${formatedEndDate}&type=yearly`);
    if (response.status) {
      setBcCdrDataYearly(response.data);
      setBcLoading(false)
    }
  }

  useEffect(() => {
    getBillingCostCDRData();
    getBillingCostCDRDataYearly();
  }, [bcStartDateFlag])

  return (
    <main className="mainContent">
      <section id="phonePage">
        <Header title="Billing Dashboard" />
        <div className="container-fluid">
          <div className="row">
            <div className="overviewTableWrapper0">
              <div className="overviewTableChild0">
                <div className="row my-3">
                  <div className="col-12">
                    <div className="heading border-0 d-block">
                      <div className="col-xl-12">
                        <div className="row">
                          <div className="col-xxl-8 col-lg-12">
                            <div className="row gy-3">
                              <div className="col-6">
                                <div className="itemWrapper a text-start">
                                  <div className="heading">
                                    <div className="d-flex flex-wrap justify-content-between">
                                      <div className="col-9">
                                        <h5>Monthly</h5>
                                        <p>Last 12 month's billing cost</p>
                                      </div>
                                      <div className="col-3">
                                        <i className="fa-duotone fa-file-invoice" />
                                      </div>
                                    </div>
                                  </div>
                                  <div className="tableContainer" style={{ height: '314px' }}>
                                    <table>
                                      <thead>
                                        <th>Month</th>
                                        <th>Inbound</th>
                                        <th>Outbound</th>
                                      </thead>
                                      <tbody>
                                        {bcLoading ?
                                          <tr>
                                            <td colSpan={99}>
                                              <div className="deviceProvision position-relative" style={{ width: '100%', height: '265px' }}>
                                                <div className="itemWrapper a addNew d-flex justify-content-center align-items-center shadow-none">
                                                  <i className="fa-solid fa-spinner-third fa-spin fs-3"></i>
                                                </div>
                                              </div>
                                            </td>
                                          </tr> :
                                          bcCdrData && bcCdrData.length > 0 ?
                                            bcCdrData.reverse().map((item, index) => {
                                              const monthArray = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

                                              return (
                                                <tr key={index}>
                                                  <td>
                                                    <span>{monthArray[parseInt(item.period.split("-")[1]) - 1]}, {item.period.split("-")[0]}</span>
                                                  </td>
                                                  <td>
                                                    <span>${item.inbound_call_cost}</span>
                                                  </td>
                                                  <td>
                                                    <span>${item.outbound_call_cost}</span>
                                                  </td>
                                                </tr>
                                              )
                                            }) : <tr><td colSpan={99}><EmptyPrompt generic={true} /></td></tr>}
                                      </tbody>
                                    </table>
                                  </div>
                                </div>
                              </div>
                              <div className="col-6">
                                <div className="itemWrapper a text-start">
                                  <div className="heading">
                                    <div className="d-flex flex-wrap justify-content-between">
                                      <div className="col-9">
                                        <h5>Annually</h5>
                                        <p>Past year's invoices</p>
                                      </div>
                                      <div className="col-3">
                                        <i className="fa-duotone fa-file-invoice" />
                                      </div>
                                    </div>
                                  </div>
                                  <div className="tableContainer" style={{ height: '314px' }}>
                                    <table>
                                      <thead>
                                        <th>Year</th>
                                        <th>Inbound</th>
                                        <th>Outbound</th>
                                      </thead>
                                      <tbody>
                                        {bcLoading ?
                                          <tr>
                                            <td colSpan={99}>
                                              <div className="deviceProvision position-relative" style={{ width: '100%', height: '265px' }}>
                                                <div className="itemWrapper a addNew d-flex justify-content-center align-items-center shadow-none">
                                                  <i className="fa-solid fa-spinner-third fa-spin fs-3"></i>
                                                </div>
                                              </div>
                                            </td>
                                          </tr> :
                                          bcCdrDataYearly && bcCdrDataYearly.length > 0 ?
                                            bcCdrDataYearly.reverse().map((item, index) => {
                                              return (
                                                <tr key={index}>
                                                  <td>
                                                    <span>{item.period.split("-")[0]}</span>
                                                  </td>
                                                  <td>
                                                    <span>${item.inbound_call_cost}</span>
                                                  </td>
                                                  <td>
                                                    <span>${item.outbound_call_cost}</span>
                                                  </td>
                                                </tr>
                                              )
                                            }) : <tr><td colSpan={99}><EmptyPrompt generic={true} /></td></tr>}
                                      </tbody>
                                    </table>
                                  </div>
                                </div>
                              </div>
                              <div className="col-6">
                                <div className="itemWrapper a">
                                  <div className="heading h-auto">
                                    <div className="d-flex flex-wrap justify-content-between p-2">
                                      <div className="col-3">
                                        <p>Total Billing Addon </p>
                                        <div className="icon-edit">
                                          <h3
                                            className="mt-3"
                                            style={{ fontWeight: 900 }}
                                          >

                                            <div className="d-flex justify-content-start ">
                                              100
                                              <i className="fa-solid fa-arrow-trend-up custom-icon"></i>
                                            </div>
                                          </h3>
                                        </div>
                                        <div className="total-month ">
                                          <span className="">
                                            This Month
                                          </span>
                                        </div>
                                      </div>
                                      <div className="col-3">
                                        <p> Billing Addon </p>
                                        <div className="icon-edit">
                                          <h3
                                            className="mt-3"
                                            style={{ fontWeight: 900 }}
                                          >

                                            <div className="d-flex justify-content-start ">
                                              6554
                                              <i className="fa-solid fa-arrow-trend-up custom-icon"></i>
                                            </div>
                                          </h3>
                                        </div>
                                        <div className="total-month ">
                                          <span className="">
                                            This Year
                                          </span>
                                        </div>
                                      </div>
                                      {/* <div className="col-4">
                                            <div className="parent">
                                              <div className="magicpattern" />
                                            </div>
                                          </div> */}
                                      <div className="col-2">
                                        <i className="fa-solid fa-eye"></i>
                                        <div className="parent mt-5">
                                          <div className="magicpattern" />
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="col-6">
                                <div className="itemWrapper b">
                                  <div className="heading h-auto">
                                    <div className="d-flex flex-wrap justify-content-between p-2">
                                      <div className="col-3 ">
                                        <p>Total Billing AI</p>
                                        <h3
                                          className="mt-3"
                                          style={{ fontWeight: 900 }}
                                        >
                                          <div className="d-flex justify-content-start ">
                                            $4000
                                            <i className="fa-solid fa-arrow-trend-up custom-icon"></i>
                                          </div>
                                        </h3>
                                        <div className="total-month light-color1">
                                          <span className="">
                                            This Month
                                          </span>
                                        </div>
                                      </div>
                                      <div className="col-3 ">
                                        <p> Billing AI</p>
                                        <h3
                                          className="mt-3"
                                          style={{ fontWeight: 900 }}
                                        >
                                          <div className="d-flex justify-content-start ">
                                            $7896
                                            <i className="fa-solid fa-arrow-trend-up custom-icon"></i>
                                          </div>
                                        </h3>
                                        <div className="total-month light-color1">
                                          <span className="">
                                            This Year
                                          </span>
                                        </div>
                                      </div>

                                      <div className="col-2">
                                        <i className="fa-solid fa-eye"></i>
                                        <div className="parent mt-5">
                                          <div className="magicpattern" />
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="col-6 ">
                                <div className="itemWrapper c">
                                  <div className="heading h-auto">
                                    <div className="d-flex flex-wrap justify-content-between  p-2">
                                      <div className="col-3 ">
                                        <p>Total Bill Agent Flow</p>
                                        <h3
                                          className="mt-3"
                                          style={{ fontWeight: 900 }}
                                        >
                                          <div className="d-flex justify-content-start ">
                                            986
                                            <i className="fa-solid fa-arrow-trend-up custom-icon"></i>
                                          </div>
                                        </h3>
                                        <div className="total-month light-color2">
                                          <span className="">
                                            This Month
                                          </span>
                                        </div>
                                      </div>

                                      <div className="col-3 ">
                                        <p>Bill Agent Flow</p>
                                        <h3
                                          className="mt-3"
                                          style={{ fontWeight: 900 }}
                                        >
                                          <div className="d-flex justify-content-start ">
                                            00
                                            <i style={{ color: "red" }} className="fa-solid fa-arrow-trend-down custom-icon"></i>
                                          </div>
                                        </h3>
                                        <div className="total-month light-color2">
                                          <span className="">
                                            This Year
                                          </span>
                                        </div>
                                      </div>


                                      <div className="col-2">
                                        <i className="fa-solid fa-eye"></i>
                                        <div className="parent mt-5">
                                          <div className="magicpattern" />
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="col-6 ">
                                <div className="itemWrapper c">
                                  <div className="heading h-auto">
                                    <div className="d-flex flex-wrap justify-content-between  p-2">
                                      <div className="col-3 ">
                                        <p>Total Bill Agent Flow</p>
                                        <h3
                                          className="mt-3"
                                          style={{ fontWeight: 900 }}
                                        >
                                          <div className="d-flex justify-content-start ">
                                            4613
                                            <i className="fa-solid fa-arrow-trend-up custom-icon"></i>
                                          </div>


                                        </h3>
                                        <div className="total-month light-color3">
                                          <span className="">
                                            This Month
                                          </span>
                                        </div>
                                      </div>
                                      <div className="col-3 ">
                                        <p>Bill Agent Flow</p>
                                        <h3
                                          className="mt-3"
                                          style={{ fontWeight: 900 }}
                                        >
                                          <div className="d-flex justify-content-start ">
                                            1000
                                            <i className="fa-solid fa-arrow-trend-down custom-icon"></i>
                                          </div>


                                        </h3>
                                        <div className="total-month light-color3">
                                          <span className="">
                                            This Year
                                          </span>
                                        </div>
                                      </div>
                                      <div className="col-2">
                                        <i className="fa-solid fa-eye"></i>
                                        <div className="parent mt-5">
                                          <div className="magicpattern" />
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-xxl-4 col-lg-12 chartWrapper mb-3">
                            <div className="itemWrapper c h-auto">
                              <div className='heading h-auto'>
                                <div className="d-flex flex-wrap justify-content-between align-items-center">
                                  <div className='col-auto'>
                                    <h5>Call Billed Per Hour</h5>
                                  </div>
                                  <div className="col-auto">
                                    <ul className="chart_tabs" >
                                      <li className="nav-item">
                                        <input className="nav-link" type="radio" name="graphCostFilter"
                                          value="1"
                                          checked={graphFilter.callCostPerHour.startTime === '1'}
                                          onChange={(e) =>
                                            setGraphFilter((prevGraphData) => ({
                                              ...prevGraphData,
                                              callCostPerHour: {
                                                ...prevGraphData.callCostPerHour,
                                                startTime: e.target.value,
                                              },
                                            }))
                                          }
                                        />
                                        <button className="nav-link">1 Hr</button>
                                      </li>
                                      <li className="nav-item">
                                        <input className="nav-link" type="radio" name="graphCostFilter" value="3"
                                          checked={graphFilter.callCostPerHour.startTime === '3'}
                                          onChange={(e) =>
                                            setGraphFilter((prevGraphData) => ({
                                              ...prevGraphData,
                                              callCostPerHour: {
                                                ...prevGraphData.callCostPerHour,
                                                startTime: e.target.value,
                                              },
                                            }))
                                          }
                                        />
                                        <button className="nav-link">3 Hr</button>
                                      </li>
                                      <li className="nav-item">
                                        <input className="nav-link" type="radio" name="graphCostFilter" value="6"
                                          checked={graphFilter.callCostPerHour.startTime === '6'}
                                          onChange={(e) =>
                                            setGraphFilter((prevGraphData) => ({
                                              ...prevGraphData,
                                              callCostPerHour: {
                                                ...prevGraphData.callCostPerHour,
                                                startTime: e.target.value,
                                              },
                                            }))
                                          }
                                        />
                                        <button className="nav-link">6 Hr</button>
                                      </li>
                                      <li className="nav-item">
                                        <input className="nav-link" type="radio" name="graphCostFilter" value="12"
                                          checked={graphFilter.callCostPerHour.startTime === '12'}
                                          onChange={(e) =>
                                            setGraphFilter((prevGraphData) => ({
                                              ...prevGraphData,
                                              callCostPerHour: {
                                                ...prevGraphData.callCostPerHour,
                                                startTime: e.target.value,
                                              },
                                            }))
                                          }
                                        />
                                        <button className="nav-link">12 Hr</button>
                                      </li>
                                      <li className="nav-item">
                                        <input className="nav-link" type="radio" name="graphCostFilter" value="24"
                                          checked={graphFilter.callCostPerHour.startTime === '24'}
                                          onChange={(e) =>
                                            setGraphFilter((prevGraphData) => ({
                                              ...prevGraphData,
                                              callCostPerHour: {
                                                ...prevGraphData.callCostPerHour,
                                                startTime: e.target.value,
                                              },
                                            }))
                                          }
                                        />
                                        <button className="nav-link">24 Hr</button>
                                      </li>
                                    </ul>
                                  </div>
                                </div>
                              </div>
                              <div className='d-flex flex-wrap justify-content-between mt-1'>
                                {graphLoading.callCostPerHour == 1 ?
                                  (
                                    <div className="deviceProvision position-relative" style={{ width: '500px', height: '300px' }}>
                                      <div className="itemWrapper a addNew d-flex justify-content-center align-items-center shadow-none">
                                        <i className="fa-solid fa-spinner-third fa-spin fs-3"></i>
                                      </div>
                                    </div>
                                  ) :
                                  <GraphChart
                                    height={'320px'}
                                    // chartType="multiple"
                                    chartCateg={"money"}
                                    label1={"Inbound"}
                                    label2={"Outbound"}
                                    // label3={"Internal"}
                                    // label4={"Missed"}
                                    type={"line"}
                                    fields={graphData?.callCostPerHour?.map((item, index) => {
                                      const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
                                      const day = weekday[new Date(item.start_time).getDay()].replace('day', '');
                                      const time = new Date(item.start_time).getHours().toString().padStart(2, '0') + ":" + new Date(item.start_time).getMinutes().toString().padStart(2, '0');
                                      return `${time}`
                                    })}
                                    percentage={[graphData?.callCostPerHour?.map((item, index) => item.inbound_call_cost), graphData?.callCostPerHour?.map((item, index) => item.outbound_call_cost)]}
                                    colors={["#05b62c", "#ff7900"]}
                                  />
                                }
                              </div>
                            </div>
                            <div className="itemWrapper a h-auto mt-3">
                              <div className='heading h-auto'>
                                <div className="d-flex flex-wrap justify-content-between align-items-center">
                                  <div className='col-auto'>
                                    <h5>Call Per Hour</h5>
                                  </div>
                                  <div className="col-auto">
                                    <ul className="chart_tabs" >
                                      <li className="nav-item">
                                        <input className="nav-link" type="radio" name="graphTimeFilter"
                                          value="1"
                                          checked={graphFilter.totalCallMin.startTime === '1'}
                                          onChange={(e) =>
                                            setGraphFilter((prevGraphData) => ({
                                              ...prevGraphData,
                                              totalCallMin: {
                                                ...prevGraphData.totalCallMin,
                                                startTime: e.target.value,
                                              },
                                            }))
                                          }
                                        />
                                        <button className="nav-link">1 Hr</button>
                                      </li>
                                      <li className="nav-item">
                                        <input className="nav-link" type="radio" name="graphTimeFilter" value="3"
                                          checked={graphFilter.totalCallMin.startTime === '3'}
                                          onChange={(e) =>
                                            setGraphFilter((prevGraphData) => ({
                                              ...prevGraphData,
                                              totalCallMin: {
                                                ...prevGraphData.totalCallMin,
                                                startTime: e.target.value,
                                              },
                                            }))
                                          }
                                        />
                                        <button className="nav-link">3 Hr</button>
                                      </li>
                                      <li className="nav-item">
                                        <input className="nav-link" type="radio" name="graphTimeFilter" value="6"
                                          checked={graphFilter.totalCallMin.startTime === '6'}
                                          onChange={(e) =>
                                            setGraphFilter((prevGraphData) => ({
                                              ...prevGraphData,
                                              totalCallMin: {
                                                ...prevGraphData.totalCallMin,
                                                startTime: e.target.value,
                                              },
                                            }))
                                          }
                                        />
                                        <button className="nav-link">6 Hr</button>
                                      </li>
                                      <li className="nav-item">
                                        <input className="nav-link" type="radio" name="graphTimeFilter" value="12"
                                          checked={graphFilter.totalCallMin.startTime === '12'}
                                          onChange={(e) =>
                                            setGraphFilter((prevGraphData) => ({
                                              ...prevGraphData,
                                              totalCallMin: {
                                                ...prevGraphData.totalCallMin,
                                                startTime: e.target.value,
                                              },
                                            }))
                                          }
                                        />
                                        <button className="nav-link">12 Hr</button>
                                      </li>
                                      <li className="nav-item">
                                        <input className="nav-link" type="radio" name="graphTimeFilter" value="24"
                                          checked={graphFilter.totalCallMin.startTime === '24'}
                                          onChange={(e) =>
                                            setGraphFilter((prevGraphData) => ({
                                              ...prevGraphData,
                                              totalCallMin: {
                                                ...prevGraphData.totalCallMin,
                                                startTime: e.target.value,
                                              },
                                            }))
                                          }
                                        />
                                        <button className="nav-link">24 Hr</button>
                                      </li>
                                    </ul>
                                  </div>
                                </div>
                              </div>
                              <div className='d-flex flex-wrap justify-content-between mt-1'>
                                {graphLoading.totalCallMin == 1 ? (
                                  <div className="deviceProvision position-relative" style={{ width: '500px', height: '300px' }}>
                                    <div className="itemWrapper a addNew d-flex justify-content-center align-items-center shadow-none">
                                      <i className="fa-solid fa-spinner-third fa-spin fs-3"></i>
                                    </div>
                                  </div>) :
                                  <GraphChart
                                    height={'300px'}
                                    chartType="multiple"
                                    label1={"Inbound"}
                                    label2={"Outbound"}
                                    label3={"Internal"}
                                    label4={"Missed"}
                                    type={"bar"}
                                    fields={graphData?.totalCallMin?.map((item, index) => {
                                      const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
                                      const day = weekday[new Date(item.start_time).getDay()].replace('day', '');
                                      const time = new Date(item.start_time).getHours().toString().padStart(2, '0') + ":" + new Date(item.start_time).getMinutes().toString().padStart(2, '0');
                                      return `${time}`
                                    })}
                                    percentage={[graphData?.totalCallMin?.map((item, index) => item.inbound), graphData?.totalCallMin?.map((item, index) => item.outbound), graphData?.totalCallMin?.map((item, index) => item.internal), graphData?.totalCallMin?.map((item, index) => item.missed)]}
                                    colors={["#05b62c", "#00fd79", "#ff7900", "#dd2e2f"]}
                                  />
                                }

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
      </section>
    </main>
  );
}

export default BillingDashboard;
