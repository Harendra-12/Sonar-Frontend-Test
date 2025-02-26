import { color, display } from '@mui/system';
import { Chart as ChartJS, ArcElement, CategoryScale, Legend, LinearScale, LineElement, PointElement, Tooltip, BarElement } from 'chart.js';
import React from 'react'
import { Bar, Line } from 'react-chartjs-2';


// Register necessary components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement);
function LineChartDashboard({ fields, percentage, labels, centerTitle, centerDesc, colors, chartType, label1, label2, height }) {

    // Define the data for the chart
    // const data = {
    //     labels: fields,
    //     datasets: [
    //         {
    //             label: 'Dataset 1',
    //             data: percentage,
    //             backgroundColor: 'transparent',
    //             hoverBackgroundColor: colors,
    //             borderColor: colors,
    //         },
    //     ],
    // };

    const shadowPlugin = {
        id: "shadowLine",
        beforeDatasetsDraw(chart) {
            const ctx = chart.ctx;
            chart.data.datasets.forEach((dataset, i) => {
                const meta = chart.getDatasetMeta(i);
                if (!meta.hidden) {
                    ctx.save();
                    ctx.shadowColor = "rgba(62, 142, 247, 1)"; // Shadow color
                    ctx.shadowBlur = 10; // Blur level
                    ctx.shadowOffsetX = 0; // X offset
                    ctx.shadowOffsetY = 0; // Y offset

                    // Draw shadowed line
                    meta.dataset.draw(ctx);
                    ctx.restore();
                }
            });
        },
    };

    const data = {
        labels: ["Inbound Completed", "Outbound Completed", "Inbound Completed", "Outbound Completed"],
        datasets: [
            {
                label: "Sales",
                data: [553, 689, 553, 689],
                backgroundColor: colors,
                borderWidth: 2,
                tension: 0.4, // Smooth curves
            },
        ],
    };

    const multiChartData = {
        labels: fields,
        datasets: [{
            label: label2,
            data: percentage[0],
            backgroundColor: '#FF0000',
            order: 2
        }, {
            label: label1,
            data: percentage[1],
            type: 'line',
            // this dataset is drawn on top
            backgroundColor: '#0000FF',
            order: 1
        }],
    }


    // Optional: Define options for customization
    const options = {
        cutout: 90,
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                enabled: true,
            },
        },
        scales: {
            x: { display: false, },
            y: { display: false, }
        },
        elements: {
            point: {
                radius: 0, // Hide nodes (data points)
                hoverRadius: 5, // Prevent points from appearing on hover
            },
        },
    };

    return (
        <div style={{ width: '100%', height: '100%', position: 'relative', margin: '0 auto' }}>
            <Bar data={chartType === "multiple" ? multiChartData : data} options={options} />
        </div>
    )
}

export default LineChartDashboard