import React, { useEffect, useState } from 'react'
import GraphChart from '../../CommonComponents/GraphChart';
import { checkViewSidebar, convertDateToCurrentTimeZone, formatDateTime, generalGetFunction } from '../../GlobalFunction/globalFunction';
import Header from '../../CommonComponents/Header';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function PackageAndSubscriptionDetails() {
    const accountDetails = useSelector((state) => state.accountDetails);
    const account = useSelector((state) => state.account);
    const slugPermissions = useSelector((state) => state?.permissions);
    const navigate = useNavigate();

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

    useEffect(() => {
        fetchTotalCallCostGraphData();
    }, [graphFilter.callCostPerHour])

    // Function to download invoice
    const downloadImage = async (imageUrl, fileName) => {
        try {
            const response = await fetch(imageUrl);
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", fileName);

            document.body.appendChild(link);
            link.click();

            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Error downloading the image:", error);
        }
    };
    return (
        <>
            <main className='mainContent'>
                <section id="phonePage">
                    <div className='container-fluid'>
                        <div className="row ">
                            <Header title="Package Details" />
                            <div id="detailsHeader" className="p-0">
                                <div className="headerBgWave">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
                                        <path
                                            fill="var(--color2)"
                                            fill-opacity="1"
                                            d="M0,160L120,186.7C240,213,480,267,720,277.3C960,288,1200,256,1320,240L1440,224L1440,0L1320,0C1200,0,960,0,720,0C480,0,240,0,120,0L0,0Z"
                                        ></path>
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='container-fluid mt-3'>
                        <div className="row">
                            {checkViewSidebar(
                                "Package",
                                slugPermissions,
                                account?.sectionPermissions,
                                account?.permissions,
                                "read"
                            ) &&
                                <div
                                    className="col-xl-3 mb-3 mb-xl-0"
                                    style={{ cursor: "pointer" }}
                                >
                                    <div className="itemWrapper a">
                                        <div className="heading">
                                            <div className="d-flex flex-wrap justify-content-between">
                                                <div className="col-9">
                                                    <h5>Package Type</h5>
                                                    <p>Click to view details</p>
                                                </div>
                                                <div className="col-3">
                                                    <i className="fa-duotone fa-cube"></i>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="data-number2">
                                            <div className="d-flex flex-wrap justify-content-between">
                                                <div className="col-9">
                                                    <h5>{accountDetails?.package.name}</h5>
                                                    <p>
                                                        Price: ${accountDetails?.package?.regular_price}{" "}
                                                        /{" "}
                                                        {accountDetails?.package?.subscription_type ===
                                                            "annually"
                                                            ? "Annually"
                                                            : "Monthly"}
                                                    </p>
                                                    <p>
                                                        Started On:{" "}
                                                        {convertDateToCurrentTimeZone(accountDetails?.subscription?.[0]?.created_at?.split("T")[0])}
                                                    </p>
                                                </div>
                                                <div className="col-3">
                                                    <img
                                                        alt="dashboard"
                                                        src={require("../../assets/images/icons/diagram.png")}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            }
                            {checkViewSidebar(
                                "Package",
                                slugPermissions,
                                account?.sectionPermissions,
                                account?.permissions,
                                "read"
                            ) &&
                                <div className="col-xl-3 mb-3 mb-xl-0">
                                    <div className="itemWrapper b">
                                        <div className="heading">
                                            <div className="d-flex flex-wrap justify-content-between">
                                                <div className="col-9">
                                                    <h5>Upcoming Transaction</h5>
                                                    <p>
                                                        {convertDateToCurrentTimeZone(accountDetails?.subscription[0].end_date?.split(" ")[0])}
                                                    </p>
                                                </div>
                                                <div className="col-3">
                                                    <i className="fa-duotone fa-money-check-dollar" onClick={() => { navigate("/card-details") }}></i>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="data-number2">
                                            <div className="d-flex flex-wrap justify-content-between">
                                                <div className="col-9">
                                                    <h5>${accountDetails?.package?.regular_price}</h5>
                                                    <p>
                                                        End Date:{" "}
                                                        {convertDateToCurrentTimeZone(accountDetails?.subscription[0].end_date?.split(" ")[0])}
                                                    </p>
                                                    <p>
                                                        {accountDetails?.package?.subscription_type ===
                                                            "annually"
                                                            ? "Annually"
                                                            : "Monthly"}{" "}
                                                        Basis
                                                    </p>
                                                </div>
                                                <div className="col-3">
                                                    <img
                                                        alt="dashboard"
                                                        src={require("../../assets/images/icons/diagram.png")}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            }
                            {checkViewSidebar(
                                "Payment",
                                slugPermissions,
                                account?.sectionPermissions,
                                account?.permissions,
                                "read"
                            ) &&
                                <div className="col-xl-3 mb-3 mb-xl-0">
                                    <div className="itemWrapper c">
                                        <div className="heading">
                                            <div className="d-flex flex-wrap justify-content-between">
                                                <div className="col-9">
                                                    <h5>Last Transaction</h5>
                                                    <p>
                                                        #{accountDetails?.payments[0]?.transaction_id}
                                                    </p>
                                                </div>
                                                <div className="col-3">
                                                    <i className="fa-solid fa-dollar-sign" onClick={() => navigate("/card-transaction-list")}></i>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="data-number2">
                                            <div className="d-flex flex-wrap justify-content-between">
                                                <div className="col-9">
                                                    <h5>
                                                        ${accountDetails?.payments[0]?.amount_subtotal}
                                                    </h5>
                                                    <p>
                                                        Transaction Time:{" "}
                                                        {formatDateTime(accountDetails?.payments[0]?.transaction_date)}
                                                    </p>
                                                </div>
                                                <div className="col-3">
                                                    <img
                                                        alt="dashboard"
                                                        src={require("../../assets/images/icons/diagram.png")}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            }

                            <div className="col-xl-3 mb-3 mb-xl-0">
                                <div className="itemWrapper d">
                                    <div className="heading">
                                        <div className="d-flex flex-wrap justify-content-between">
                                            <div className="col-9">
                                                <h5>Wallet Info</h5>
                                                {accountDetails?.balance?.created_at ? (
                                                    <p>
                                                        Created On:{" "}
                                                        {formatDateTime(accountDetails?.balance?.created_at)}
                                                    </p>
                                                ) : (
                                                    ""
                                                )}
                                            </div>
                                            <div className="col-3">
                                                <i className="fa-duotone fa-wallet" onClick={() => navigate("/card-details")}></i>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="data-number2">
                                        <div className="d-flex flex-wrap justify-content-between">
                                            <div className="col-9">
                                                <h5>${accountDetails?.balance?.amount || 0}</h5>
                                                {accountDetails?.balance?.updated_at ? (
                                                    <p>
                                                        Last recharged:{" "}
                                                        {formatDateTime(accountDetails?.balance?.updated_at)}
                                                    </p>
                                                ) : (
                                                    ""
                                                )}
                                            </div>
                                            <div className="col-3">
                                                <img
                                                    alt="dashboard"
                                                    src={require("../../assets/images/icons/diagram.png")}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-xl-12 mt-xl-4">
                                <div className="row">
                                    {checkViewSidebar(
                                        "Payment",
                                        slugPermissions,
                                        account?.sectionPermissions,
                                        account?.permissions,
                                        "read"
                                    ) &&
                                        <div className="col-xl-4 mb-3 mb-xl-0">
                                            <div className="itemWrapper a">
                                                <div className="heading">
                                                    <div className="d-flex flex-wrap justify-content-between">
                                                        <div className="col-9">
                                                            <h5>Invoices</h5>
                                                            <p>Last 5 invoices</p>
                                                        </div>
                                                        <div className="col-3">
                                                            <i className="fa-duotone fa-file-invoice" onClick={() => navigate("/card-transaction-list")}></i>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="data-number2">
                                                    <div className="d-flex flex-wrap justify-content-between">
                                                        <div className="col-12">
                                                            <ul>
                                                                {accountDetails?.payments
                                                                    ?.slice(0, 5)
                                                                    .map((item, index) => (
                                                                        <li key={index}>
                                                                            {formatDateTime(item.transaction_date)}
                                                                            <span
                                                                                className="float-end fw-bold"
                                                                                onClick={() =>
                                                                                    downloadImage(item.invoice_url)
                                                                                }
                                                                            >
                                                                                ${item.amount_subtotal}{" "}
                                                                            </span>
                                                                        </li>
                                                                    ))}
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    }
                                    {checkViewSidebar(
                                        "BillingAddress",
                                        slugPermissions,
                                        account?.sectionPermissions,
                                        account?.permissions,
                                        "read"
                                    ) &&
                                        <div className="col-xl-4 mb-3 mb-xl-0">
                                            <div className="itemWrapper b">
                                                <div className="heading">
                                                    <div className="d-flex flex-wrap justify-content-between">
                                                        <div className="col-9">
                                                            <h5>Billing Address</h5>
                                                            <p>Click the icon to change it</p>
                                                        </div>
                                                        <div className="col-3">
                                                            <i className="fa-duotone fa-address-card" onClick={() => navigate("/card-details")}></i>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="data-number2">
                                                    <div className="d-flex flex-wrap justify-content-between">
                                                        <div className="col-12">
                                                            <ul>
                                                                <li>
                                                                    Full Name{" "}
                                                                    <span className="float-end">
                                                                        {
                                                                            accountDetails?.billing_address[0]
                                                                                ?.fullname
                                                                        }
                                                                    </span>
                                                                </li>
                                                                <li>
                                                                    Phone{" "}
                                                                    <span className="float-end">
                                                                        {
                                                                            accountDetails?.billing_address[0]
                                                                                ?.contact_no
                                                                        }
                                                                    </span>
                                                                </li>
                                                                <li>
                                                                    Email{" "}
                                                                    <span className="float-end">
                                                                        {
                                                                            accountDetails?.billing_address[0]
                                                                                ?.email
                                                                        }
                                                                    </span>
                                                                </li>
                                                                <li>
                                                                    Address{" "}
                                                                    <span className="float-end">
                                                                        {
                                                                            accountDetails?.billing_address[0]
                                                                                ?.address
                                                                        }
                                                                    </span>
                                                                </li>
                                                                <li>
                                                                    City, State
                                                                    <span className="float-end">
                                                                        {
                                                                            accountDetails?.billing_address[0]
                                                                                ?.city
                                                                        }
                                                                        ,{" "}
                                                                        {
                                                                            accountDetails?.billing_address[0]
                                                                                ?.state
                                                                        }
                                                                    </span>
                                                                </li>
                                                                <li>
                                                                    Zip Code{" "}
                                                                    <span className="float-end">
                                                                        {
                                                                            accountDetails?.billing_address[0]
                                                                                ?.zip
                                                                        }
                                                                    </span>
                                                                </li>
                                                                <li>
                                                                    Country{" "}
                                                                    <span className="float-end">
                                                                        {
                                                                            accountDetails?.billing_address[0]
                                                                                ?.country
                                                                        }
                                                                    </span>
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    }
                                    <div className="col-xl-4 chartWrapper mb-3 mb-xl-0">
                                        <div className="itemWrapper c">
                                            <div className='heading h-auto'>
                                                <div className="d-flex flex-wrap justify-content-between align-items-center">
                                                    <div className='col-auto'>
                                                        <h5>Call Billed Per Hour</h5>
                                                    </div>
                                                    <div className="col-auto">
                                                        <ul class="chart_tabs" >
                                                            <li class="nav-item">
                                                                <input class="nav-link" type="radio" name="graphCostFilter"
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
                                                                <button class="nav-link">1 Hr</button>
                                                            </li>
                                                            <li class="nav-item">
                                                                <input class="nav-link" type="radio" name="graphCostFilter" value="3"
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
                                                                <button class="nav-link">3 Hr</button>
                                                            </li>
                                                            <li class="nav-item">
                                                                <input class="nav-link" type="radio" name="graphCostFilter" value="6"
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
                                                                <button class="nav-link">6 Hr</button>
                                                            </li>
                                                            <li class="nav-item">
                                                                <input class="nav-link" type="radio" name="graphCostFilter" value="12"
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
                                                                <button class="nav-link">12 Hr</button>
                                                            </li>
                                                            <li class="nav-item">
                                                                <input class="nav-link" type="radio" name="graphCostFilter" value="24"
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
                                                                <button class="nav-link">24 Hr</button>
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
                                                                <i class="fa-solid fa-spinner-third fa-spin fs-3"></i>
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
                                                        type={"bar"}
                                                        fields={graphData?.callCostPerHour?.map((item, index) => {
                                                            const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
                                                            const day = weekday[new Date(item.start_time).getDay()].replace('day', '');
                                                            const convertedTime = formatDateTime(item.start_time);
                                                            const time = new Date(convertedTime).getHours().toString().padStart(2, '0') + ":" + new Date(convertedTime).getMinutes().toString().padStart(2, '0');
                                                            return `${time}`
                                                        })}
                                                        percentage={[graphData?.callCostPerHour?.map((item, index) => item.inbound_call_cost), graphData?.callCostPerHour?.map((item, index) => item.outbound_call_cost)]}
                                                        colors={["#05b62c", "#ff7900"]}
                                                    />
                                                }
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

export default PackageAndSubscriptionDetails