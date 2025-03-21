
import { Chart as ChartJS, ArcElement, CategoryScale, Legend, LinearScale, LineElement, PointElement, Tooltip, BarElement, PolarAreaController, RadialLinearScale } from 'chart.js';
import React from 'react'
import {  Doughnut } from 'react-chartjs-2';


// Register necessary components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement, PolarAreaController, RadialLinearScale);
function ModuleGraphDashboard({ fields, percentage, labels, centerTitle, centerDesc, colors, chartType, label1, label2, height }) {


    const data = {
        labels: fields,
        datasets: [
            {
                data: percentage,
                backgroundColor: colors,
                hoverOffset: 10,
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
        cutout: '50%',
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
        <div style={{ width: 'auto', height: '100%', position: 'relative', margin: '0 auto' }}>
            <Doughnut data={chartType === "multiple" ? multiChartData : data} options={options} />
        </div>
    )
}

export default ModuleGraphDashboard