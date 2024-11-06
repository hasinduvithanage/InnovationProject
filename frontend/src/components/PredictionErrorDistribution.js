import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Chart, registerables } from 'chart.js';

// Register core Chart.js components
Chart.register(...registerables);

const PredictionErrorDistribution = () => {
  const [chartData, setChartData] = useState(null);
  const chartRef = useRef(null);

  useEffect(() => {
    axios.get('http://localhost:8000/get_model_results_prediction_error')
      .then(response => {
        const data = response.data;
        processChartData(data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const getRandomSample = (arr, sampleSize) => {
    const shuffled = arr.slice().sort(() => 0.5 - Math.random()); // Shuffle array
    return shuffled.slice(0, sampleSize); // Return first `sampleSize` elements
  };

  const processChartData = (data) => {
    const models = Object.keys(data);
    const datasets = models.map(model => {
      const sampledData = getRandomSample(data[model], 1000); // Sample 1000 points
      return {
        label: model,
        data: sampledData,
        backgroundColor: getModelColor(model),
        borderColor: getModelColor(model),
        borderWidth: 1,
      };
    });

    setChartData({
      labels: datasets[0].data.map((_, index) => `Sample ${index + 1}`),
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
        },
        beginAtZero: true
      },
      x: {
        title: {
          display: true,
          text: 'Sample'
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
        type: 'bar', // Use 'bar' for combined bar chart
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
