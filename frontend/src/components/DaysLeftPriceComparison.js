import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';

const DaysLeftPriceComparison = () => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    // Fetch data from the backend
    axios.get('http://localhost:8000/get_model_results')
      .then((response) => {
        const data = response.data;
        processChartData(data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const processChartData = (data) => {
    const daysLeft = data.map(item => item.days_left);
    const actualPrices = data.map(item => item.actual_price);

    // Prepare datasets for charting
    const datasets = [
      {
        label: 'Actual Price',
        data: actualPrices,
        fill: false,
        borderColor: 'red',
        tension: 0.4,
        pointRadius: 2,
      },
    ];

    // Loop through each model and add its data to the datasets
    const modelNames = ["RandomForestRegressor", "XGBRegressor", "ExtraTreesRegressor", "DecisionTreeRegressor"];
    modelNames.forEach((modelName) => {
      const color = getModelColor(modelName);
      const modelData = data.map(item => item[modelName]);
      datasets.push({
        label: `Predicted Price - ${modelName}`,
        data: modelData,
        fill: false,
        borderColor: color,
        tension: 0.4,
        pointRadius: 2,
      });
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
      legend: {
        position: 'top',
        labels: {
          font: { size: 12 },
        },
      },
      title: {
        display: true,
        text: 'Days Left vs Actual and Predicted Ticket Prices',
        font: { size: 18 },
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        callbacks: {
          label: (context) => `${context.dataset.label}: ${context.raw.toFixed(2)}`,
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Days Left for Departure',
          font: { size: 14 },
        },
        ticks: {
          maxTicksLimit: 20,
          font: { size: 12 },
        },
      },
      y: {
        title: {
          display: true,
          text: 'Price (INR)',
          font: { size: 14 },
        },
        ticks: {
          font: { size: 12 },
        },
      },
    },
  };

  return (
    <div style={{ height: '900px', width: '1500' }}>
      {chartData ? (
        <Line data={chartData} options={chartOptions}/>
      ) : (
        <p>Loading chart data...</p>
      )}
    </div>
  );
};

export default DaysLeftPriceComparison;
