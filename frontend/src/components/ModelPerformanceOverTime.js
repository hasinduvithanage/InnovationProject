// src/components/ModelPerformanceOverTime.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';

const ModelPerformanceOverTime = () => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:8000/get_model_results')
      .then(response => {
        const data = response.data;
        processChartData(data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const processChartData = (data) => {
    // Extract unique models and days_left
    const models = [...new Set(data.map(d => d.model_name))];
    const daysLeft = [...new Set(data.map(d => d.days_left))].sort((a, b) => a - b);

    // Prepare datasets for the chart
    const datasets = models.map(model => {
      // Filter data for the current model
      const modelData = data.filter(d => d.model_name === model);

      // Map days_left to predicted prices
      const dayPriceMap = {};
      modelData.forEach(d => {
        dayPriceMap[d.days_left] = d.Predicted_Price;
      });

      // Ensure that data aligns with daysLeft array
      const avgPredictedPrices = daysLeft.map(day => dayPriceMap[day] || null);

      return {
        label: model,
        data: avgPredictedPrices,
        borderColor: getModelColor(model),
        fill: false,
        tension: 0.1,
      };
    });

    setChartData({
      labels: daysLeft,
      datasets: datasets,
    });
  };

  const getModelColor = (modelName) => {
    const colorMap = {
      'RandomForestRegressor': 'blue',
      'XGBRegressor': 'green',
      'ExtraTreesRegressor': 'orange',
      'DecisionTreeRegressor': 'purple',
    };
    return colorMap[modelName] || 'gray';
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Model Performance Comparison Over Time' },
    },
    scales: {
      x: { title: { display: true, text: 'Days till Departure' } },
      y: { title: { display: true, text: 'Predicted Price (INR)' } },
    },
  };

  return (
    <div>
      {chartData ? (
        <Line data={chartData} options={chartOptions} />
      ) : (
        <p>Loading data...</p>
      )}
    </div>
  );
};

export default ModelPerformanceOverTime;
