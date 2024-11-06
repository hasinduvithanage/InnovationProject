// src/components/PredictionErrorDistribution.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Chart } from 'react-chartjs-2';
import 'chartjs-chart-box-and-violin-plot/build/Chart.BoxPlot.js';

const PredictionErrorDistribution = () => {
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
    const models = [...new Set(data.map(d => d.model_name))];
    const datasets = [{
      label: 'Prediction Error Distribution',
      data: models.map(model => {
        const modelData = data.filter(d => d.model_name === model);
        const errors = modelData.map(d => d.Predicted_Price - d.Actual_Price);
        return errors;
      }),
      backgroundColor: models.map(model => getModelColor(model)),
    }];

    setChartData({
      labels: models,
      datasets: datasets,
    });
  };

  const getModelColor = (modelName) => {
    // Same as before
  };

  const chartOptions = {
    // Same as before
  };

  return (
    <div>
      {chartData ? (
        <Chart type="boxplot" data={chartData} options={chartOptions} />
      ) : (
        <p>Loading data...</p>
      )}
    </div>
  );
};

export default PredictionErrorDistribution;
