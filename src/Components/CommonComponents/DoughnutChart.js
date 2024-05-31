import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { styled } from '@mui/material';

// Register necessary components
ChartJS.register(ArcElement, Tooltip, Legend);

const DoughnutChart = ({ fields, percentage, centerTitle, centerDesc, colors }) => {

  // Define the data for the chart
  const data = {
    labels: fields,
    datasets: [
      {
        label: 'Total ',
        data: percentage,
        backgroundColor: colors,
        hoverBackgroundColor: colors,
      },
    ],
  };

  // Optional: Define options for customization
  const options = {
    cutout: 80,
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
    <div style={{ width: '250px', height: '300px', position: 'relative', margin: '0 auto' }}>
      <Doughnut data={data} options={options} />
      <div className="data-number" style={{ position: 'absolute', top: '40%', left: '50%', transform: 'translate(-50%,-50%)' }}>
        <label style={{ color: '#FF6384' }}>{centerTitle.slice(0, 2).replace('/', '').padStart(2, '0')}</label> <span>/ {centerTitle.slice(2).replace('/', '')}</span>
        <p>{centerDesc}</p>
      </div>
    </div>
  );
};

export default DoughnutChart;
