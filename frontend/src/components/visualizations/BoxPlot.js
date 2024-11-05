// src/components/visualizations/BoxPlot.js
import React from 'react';
import { Chart } from 'react-chartjs-2';
import { BoxPlotController, BoxAndWhiskers } from '@sgratzl/chartjs-chart-boxplot';
Chart.register(BoxPlotController, BoxAndWhiskers);

const BoxPlotChart = ({ data }) => {
  const airlines = [...new Set(data.map((d) => d.airline))];
  const airlinePrices = airlines.map((airline) =>
    data.filter((d) => d.airline === airline).map((d) => d.price)
  );

  const chartData = {
    labels: airlines,
    datasets: [
      {
        label: 'Flight Price Distribution by Airline',
        backgroundColor: 'rgba(255,99,132,0.5)',
        borderColor: 'red',
        borderWidth: 1,
        data: airlinePrices,
      },
    ],
  };

  return (
    <div>
      <h3>Flight Price Distribution by Airline</h3>
      <Chart type="boxplot" data={chartData} options={{ responsive: true }} />
    </div>
  );
};

export default BoxPlotChart;
