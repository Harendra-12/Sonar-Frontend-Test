import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto'; // or 'chart.js' if you're using Chart.js v2
import { Line } from "react-chartjs-2";

const Usage = () => {
    const [startDateFlag, setStartDateFlag] = useState("");
    const [endDateFlag, setEndDateFlag] = useState("");
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

    return (
        <>
            <div className='row mb-3'>
                <div className='col-5'>
                    <div className="formRow border-0">
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
                                    // setPageNumber(1);
                                }}
                                min={startDateFlag} // Prevent selecting an end date before the start date
                            />
                            <input
                                type="time"
                                className="formItem ms-2"
                                value={timeFlag.endTime}
                                onChange={(e) => {
                                    setTimeFlag((prev) => ({
                                        ...prev,
                                        endTime: `${e.target.value}:00`,
                                    }));
                                    // setPageNumber(1);
                                }}
                            />
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
