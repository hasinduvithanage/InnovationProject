import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Chart, registerables } from 'chart.js';
import * as ChartBoxAndViolin from 'chartjs-chart-box-and-violin-plot'; // Import entire module as namespace

// Register all components from Chart.js and the box-and-violin plot plugin
Chart.register(...registerables, ChartBoxAndViolin);

const PredictionErrorDistribution = () => {
  const [chartData, setChartData] = useState(null);
  const chartRef = useRef(null);

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
    const models = Object.keys(data);
    const datasets = [{
      label: 'Prediction Error Distribution',
      data: models.map(model => data[model]),
      backgroundColor: models.map(model => getModelColor(model)),
    }];

    setChartData({
      labels: models,
      datasets: datasets,
    });
  };

  const getModelColor = (modelName) => {
    const colors = {
      RandomForestRegressor: '#4caf50',
      DecisionTreeRegressor: '#f44336',
      ExtraTreesRegressor: '#2196f3',
      XGBRegressor: '#ff9800'
    };
    return colors[modelName] || '#9e9e9e';
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
    },
    scales: {
      y: {
        title: {
          display: true,
          text: 'Prediction Error'
        }
      }
    }
  };

  useEffect(() => {
    if (chartData && chartRef.current) {
      // Destroy existing chart instance if it exists
      if (chartRef.current.chartInstance) {
        chartRef.current.chartInstance.destroy();
      }

      // Create a new chart instance
      chartRef.current.chartInstance = new Chart(chartRef.current, {
        type: 'boxplot',
        data: chartData,
        options: chartOptions,
      });
    }
    // Cleanup function to destroy the chart when the component is unmounted
    return () => {
      if (chartRef.current && chartRef.current.chartInstance) {
        chartRef.current.chartInstance.destroy();
      }
    };
  }, [chartData]);

  return (
    <div>
      <canvas ref={chartRef}></canvas>
      {!chartData && <p>Loading data...</p>}
    </div>
  );
};

export default PredictionErrorDistribution;
