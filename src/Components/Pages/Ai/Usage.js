import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto'; // or 'chart.js' if you're using Chart.js v2
import { Line } from "react-chartjs-2";

const Usage = () => {
    const [startDateFlag, setStartDateFlag] = useState("");
    const [endDateFlag, setEndDateFlag] = useState("");
    const [filterBy, setFilterBy] = useState("date");
    const [createdAt, setCreatedAt] = useState("");
        const [startDate, setStartDate] = useState("");
            const [endDate, setEndDate] = useState("");
               const [pageNumber, setPageNumber] = useState(1);
    


    const [timeFlag, setTimeFlag] = useState({
        startTime: "",
        endTime: "",
    });
    const [timeFilter, setTimeFilter] = useState({
        startTime: "",
        endTime: "",
    });
    const canvasRef = useRef(null);

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

    const data = {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        datasets: [
            {
                label: "First dataset",
                data: [33, 53, 85, 41, 44, 65],
                fill: true,
                backgroundColor: "rgba(75,192,192,0.2)",
                borderColor: "rgba(75,192,192,1)"
            },
            {
                label: "Second dataset",
                data: [33, 25, 35, 51, 54, 76],
                fill: false,
                borderColor: "#742774"
            }
        ]
    };


    useEffect(() => {
        if (
            filterBy === "7_days" ||
            filterBy === "1_month" ||
            filterBy === "3_month"
        ) {
            // featureUnderdevelopment();
            getDateRange(filterBy);
        }
    }, [filterBy]);

    useEffect(() => {
        if (filterBy === "date" && startDateFlag !== "") {
            setCreatedAt(startDateFlag);
            setStartDate("");
            setEndDate("");
        } else if (
            filterBy === "date_range" &&
            endDateFlag !== "" &&
            startDateFlag !== ""
        ) {
            setStartDate(startDateFlag);
            setEndDate(endDateFlag);
            setCreatedAt("");
        }
    }, [startDateFlag, endDateFlag, filterBy]);


    const getDateRange = (period) => {
        const currentDate = new Date();
        const formattedCurrentDate = formatDate(currentDate);

        let startDate = new Date();

        switch (period) {
            case "7_days":
                startDate.setDate(currentDate.getDate() - 7);
                break;

            case "1_month":
                startDate.setMonth(currentDate.getMonth() - 1);
                break;

            case "3_month":
                startDate.setMonth(currentDate.getMonth() - 3);
                break;

            default:
                throw new Error(
                    "Invalid period. Use 'last7days', 'last1month', or 'last3months'."
                );
        }

        const formattedStartDate = formatDate(startDate);
        setStartDate(formattedStartDate);

        setEndDate(formattedCurrentDate);

        // return { currentDate: formattedCurrentDate, startDate: formattedStartDate };
    };
    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    return (
        <>
            <div className='row mb-3'>
                <div className='col-5'>
                    <div className="formRow border-0 p-0 gap-2">
                        <div className="d-flex justify-content-start flex-wrap gap-2">
                            {/* {filteredKeys.includes("variable_start_stamp") && ( 
                                                                <> */}

                            <div className="formRow border-0 p-0 gap-2">
                                <label className="formLabel text-start mb-0 w-100">
                                    Date Filter
                                </label>
                                <select
                                    className="formItem"
                                    value={filterBy}
                                    onChange={(e) => {
                                        setFilterBy(e.target.value);
                                        setStartDateFlag("");
                                        setEndDateFlag("");
                                    }}
                                >
                                    <option value={"date"}>Single Date</option>
                                    <option value={"date_range"}>Date Range</option>
                                    <option value={"7_days"}>Last 7 Days</option>
                                    <option value={"1_month"}>Last 1 Month</option>
                                    <option value={"3_month"}>Last 3 Months</option>
                                </select>
                            </div>

                            {/* {filterBy === "date_range" && (
                                                                        <> */}
                            <div className="formRow border-0 p-0 gap-2">
                                <label className="formLabel text-start mb-0 w-100">
                                    From
                                </label>
                                <div className="d-flex w-100">
                                    <input
                                        type="date"
                                        className="formItem"
                                        max={
                                            new Date()?.toISOString()?.split("T")[0]
                                        }
                                        value={startDateFlag}
                                        onChange={(e) => {
                                            setStartDateFlag(e.target.value);
                                            setPageNumber(1);
                                        }}
                                    />

                                </div>
                            </div>
                            <div className="formRow border-0 p-0 gap-2">
                                <label className="formLabel text-start mb-0 w-100">
                                    To
                                </label>
                                <div className="d-flex w-100">
                                    <input
                                        type="date"
                                        className="formItem"
                                        max={
                                            new Date()?.toISOString()?.split("T")[0]
                                        }
                                        value={endDateFlag}
                                        onChange={(e) => {
                                            setEndDateFlag(e.target.value);
                                            setPageNumber(1);
                                        }}
                                        min={startDateFlag} // Prevent selecting an end date before the start date
                                    />

                                </div>
                            </div>
                            {/* </>
                                                                     )} 
                                                                 </> 
                                                            )}  */}
                        </div>
                    </div>
                </div>
            </div>
            <div className='row'>
                <div className='col-lg-4 col-sm-12 mb-3'>
                    <div className='card usage_card shadow-none'>
                        <div className='card-body d-flex justify-content-center flex-column'>
                            <p className='f-s-14 mb-1' style={{ color: 'var(--color-subtext)' }}>Cost</p>
                            <h4>$0.24</h4>
                        </div>
                    </div>
                </div>
                <div className='col-lg-4 col-sm-12 mb-3'>
                    <div className='card usage_card shadow-none'>
                        <div className='card-body d-flex justify-content-center flex-column'>
                            <p className='f-s-14 mb-1' style={{ color: 'var(--color-subtext)' }}>Call Minutes</p>
                            <h4>0 mins</h4>
                        </div>
                    </div>
                </div>
                <div className='col-lg-4 col-sm-12 mb-3'>
                    <div className='card usage_card shadow-none'>
                        <div className='card-body d-flex justify-content-center flex-column'>
                            <p className='f-s-14 mb-1' style={{ color: 'var(--color-subtext)' }}>Average Cost Per Minute</p>
                            <h4>$0.00</h4>
                        </div>
                    </div>
                </div>
                <div className='col-lg-6 col-sm-12 mb-3'>
                    <div className='card usage_card shadow-none'>
                        <div className='card-body'>
                            <canvas ref={canvasRef} width="400" height="200" />;
                        </div>
                    </div>
                </div>
                <div className='col-lg-6 col-sm-12 mb-3'>
                    <div className='card usage_card shadow-none'>
                        <div className='card-body'>
                            <Line data={data} />
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
};

export default Usage;
