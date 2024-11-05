// src/components/visualizations/ViolinPlot.js
import React from 'react';
import { Chart } from 'react-chartjs-2';
import { ViolinController, Violin } from 'chartjs-chart-box-and-violin-plot';
Chart.register(ViolinController, Violin);

const ViolinPlot = ({ data }) => {
  const classes = [...new Set(data.map((d) => d.class))];
  const classPrices = classes.map((cls) => data.filter((d) => d.class === cls).map((d) => d.price));

  const chartData = {
    labels: classes,
    datasets: [
      {
        label: 'Price Distribution by Class',
        backgroundColor: 'rgba(255,159,64,0.5)',
        borderColor: 'orange',
        borderWidth: 1,
        data: classPrices,
      },
    ],
  };

  return (
    <div>
      <h3>Price Distribution by Class</h3>
      <Chart type='violin' data={chartData} options={{ responsive: true }} />
    </div>
  );
};

export default ViolinPlot;