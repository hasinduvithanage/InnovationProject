// src/components/visualizations/DaysLeftBarChart.js
import React from 'react';
import { Bar } from 'react-chartjs-2';

const DaysLeftBarChart = ({ data }) => {
  const days = [...new Set(data.map((d) => d.days_left))].sort((a, b) => a - b);
  const avgPrices = days.map((day) => {
    const flights = data.filter((d) => d.days_left === day);
    const total = flights.reduce((sum, f) => sum + f.price, 0);
    return total / flights.length;
  });

  const chartData = {
    labels: days,
    datasets: [
      {
        label: 'Average Price',
        data: avgPrices,
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
      },
    ],
  };

  return (
    <div>
      <h3>Average Prices by Days Left Until Departure</h3>
      <Bar data={chartData} options={{ scales: { x: { title: { display: true, text: 'Days Left' } }, y: { title: { display: true, text: 'Average Price (INR)' } } } }} />
    </div>
  );
};

export default DaysLeftBarChart;
