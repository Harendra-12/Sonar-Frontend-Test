import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement } from 'chart.js';

// Register necessary components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement);

const GraphChart = ({ fields, percentage, labels, centerTitle, centerDesc, colors, chartType, label1, label2, label3, label4, height }) => {

  // Define the data for the chart
  const data = {
    labels: fields,
    datasets: [
      {
        label: label1,
        data: percentage[0],
        backgroundColor: colors,
        hoverBackgroundColor: colors,
        borderColor: colors,
      },
    ],
  };

  const multiChartData = {
    labels: fields,
    datasets: [{
      label: label1,
      data: percentage[0],
      backgroundColor: colors[0],
      borderColor: colors[0],
      order: 1
    }, {
      label: label2,
      data: percentage[1],
      type: 'line',
      // this dataset is drawn on top
      backgroundColor: colors[1],
      borderColor: colors[1],
      order: 2
    },
    {
      label: label3,
      data: percentage[2],
      type: 'line',
      // this dataset is drawn on top
      backgroundColor: colors[2],
      borderColor: colors[2],
      order: 3
    },
    {
      label: label4,
      data: percentage[3],
      type: 'line',
      // this dataset is drawn on top
      backgroundColor: colors[3],
      borderColor: colors[3],
      order: 4
    }
    ],
  }


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
    scales: {
      x: {
        grid: {
          color: 'rgba(128, 128, 128, 0.2)',
        }
      },
      y: {
        grid: {
          color: 'rgba(128, 128, 128, 0.2)',
        }
      }
    }
  };

  return (
    <div style={{ width: '100%', height: height || '300px', position: 'relative', margin: '0 auto' }}>
      <Line data={chartType === "multiple" ? multiChartData : data} options={options} />
    </div>
  );
};

export default GraphChart;
