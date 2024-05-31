import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement } from 'chart.js';
import { styled } from '@mui/material';

// Register necessary components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement);

const GraphChart = ({ fields, percentage, centerTitle, centerDesc, colors }) => {

  // Define the data for the chart
  const data = {
    labels: fields,
    datasets: [
      {
        label: 'Dataset 1',
        data: percentage,
        backgroundColor: colors,
        hoverBackgroundColor: colors,
      },
    ],
  };

  // Optional: Define options for customization
  const options = {
    cutout: 90,
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
      tooltip: {
        enabled: true,
      },
    },
  };

  return (
    <div style={{ width: '100%', height: '300px', position: 'relative', margin: '0 auto' }}>
      <Line data={data} options={options} />
    </div>
  );
};

export default GraphChart;
