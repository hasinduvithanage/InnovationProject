// src/components/RoutePriceComparison.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';

const RoutePriceComparison = () => {
  const [chartData, setChartData] = useState(null);
  const [inverseMappings, setInverseMappings] = useState({});

  useEffect(() => {
    axios.get('http://localhost:8000/get_model_results')
      .then(response => {
        const data = response.data;
        fetchMappingsAndProcessData(data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const fetchMappingsAndProcessData = (data) => {
    axios.get('http://localhost:8000/get_inverse_mappings')
      .then(response => {
        setInverseMappings(response.data);
        processChartData(data, response.data);
      })
      .catch(error => {
        console.error('Error fetching mappings:', error);
      });
  };

  const processChartData = (data, mappings) => {
    // Decode source_city and destination_city
    data.forEach(d => {
      d.source_city = mappings['source_city'][d.source_city];
      d.destination_city = mappings['destination_city'][d.destination_city];
    });

    // Create route labels
    data.forEach(d => {
      d.route = `${d.source_city}-${d.destination_city}`;
    });

    const routes = [...new Set(data.map(d => d.route))];
    const models = [...new Set(data.map(d => d.model_name))];

    const datasets = models.map(model => ({
      label: model,
      data: routes.map(route => {
        const routeData = data.filter(d => d.route === route && d.model_name === model);
        const avgPrice = routeData.reduce((sum, d) => sum + d.Predicted_Price, 0) / routeData.length;
        return avgPrice;
      }),
      backgroundColor: getModelColor(model),
    }));

    setChartData({
      labels: routes,
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
        <Bar data={chartData} options={chartOptions} />
      ) : (
        <p>Loading data...</p>
      )}
    </div>
  );
};

export default RoutePriceComparison;
