// src/components/visualizations/ScatterPlot.js
import React from 'react';
import { Scatter } from 'react-chartjs-2';

const ScatterPlot = ({ data }) => {
  const plotData = data.map((d) => ({ x: d.duration, y: d.price }));

  const chartData = {
    datasets: [
      {
        label: 'Price vs. Flight Duration',
        data: plotData,
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
      },
    ],
  };

  return (
    <div>
      <h3>Price vs. Flight Duration</h3>
      <Scatter data={chartData} options={{ scales: { x: { title: { display: true, text: 'Duration (hours)' } }, y: { title: { display: true, text: 'Price (INR)' } } } }} />
    </div>
  );
};

export default ScatterPlot;
