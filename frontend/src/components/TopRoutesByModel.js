// src/components/TopRoutesByModel.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';

const options = {
  indexAxis: 'y', // This makes the bar chart horizontal
  // other chart options
};


const TopRoutesByModel = () => {
  const [chartDataMost, setChartDataMost] = useState(null);
  const [chartDataLeast, setChartDataLeast] = useState(null);
  const [selectedModel, setSelectedModel] = useState('RandomForestRegressor');
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
  }, [selectedModel]);

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

    const modelData = data.filter(d => d.model_name === selectedModel);

    // Compute average predicted price per route
    const routePrices = {};
    modelData.forEach(d => {
      if (!routePrices[d.route]) {
        routePrices[d.route] = { sum: 0, count: 0 };
      }
      routePrices[d.route].sum += d.Predicted_Price;
      routePrices[d.route].count += 1;
    });

    const averagePrices = Object.keys(routePrices).map(route => ({
      route,
      average_price: routePrices[route].sum / routePrices[route].count,
    }));

    // Sort routes by average price
    averagePrices.sort((a, b) => b.average_price - a.average_price);

    const mostExpensiveRoutes = averagePrices.slice(0, 10);
    const leastExpensiveRoutes = averagePrices.slice(-10).reverse();

    // Prepare datasets
    const chartDataMost = {
      labels: mostExpensiveRoutes.map(item => item.route),
      datasets: [{
        label: `${selectedModel} - Most Expensive Routes`,
        data: mostExpensiveRoutes.map(item => item.average_price),
        backgroundColor: getModelColor(selectedModel),
      }],
    };

    const chartDataLeast = {
      labels: leastExpensiveRoutes.map(item => item.route),
      datasets: [{
        label: `${selectedModel} - Least Expensive Routes`,
        data: leastExpensiveRoutes.map(item => item.average_price),
        backgroundColor: getModelColor(selectedModel),
      }],
    };

    setChartDataMost(chartDataMost);
    setChartDataLeast(chartDataLeast);
  };

  const getModelColor = (modelName) => {
    // Same as before
  };

  const chartOptions = {
    indexAxis: 'y',
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: `Top 10 Routes Predicted by ${selectedModel}` },
    },
    scales: {
      x: { title: { display: true, text: 'Predicted Price (INR)' } },
      y: { title: { display: true, text: 'Routes' } },
    },
  };

  return (
    <div>
      <select value={selectedModel} onChange={(e) => setSelectedModel(e.target.value)}>
        <option value="RandomForestRegressor">RandomForestRegressor</option>
        <option value="XGBRegressor">XGBRegressor</option>
        <option value="ExtraTreesRegressor">ExtraTreesRegressor</option>
        <option value="DecisionTreeRegressor">DecisionTreeRegressor</option>
      </select>

      {chartDataMost && chartDataLeast ? (
        <>
          <h3>Most Expensive Routes</h3>
          <Bar data={chartDataMost} options={chartOptions} />
          <h3>Least Expensive Routes</h3>
          <Bar data={chartDataLeast} options={chartOptions} />
        </>
      ) : (
        <p>Loading data...</p>
      )}
    </div>
  );
};

export default TopRoutesByModel;
