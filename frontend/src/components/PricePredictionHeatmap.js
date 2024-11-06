// src/components/PricePredictionHeatmap.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Plot from 'react-plotly.js';
import styles from "../styles/Visualizer.module.css";

const PricePredictionHeatmap = () => {
  const [heatmapData, setHeatmapData] = useState(null);
  const [selectedModel, setSelectedModel] = useState('RandomForestRegressor');

  useEffect(() => {
    // Fetch aggregated data from the backend
    axios.get(`http://localhost:8000/get_heatmap_data?model_name=${selectedModel}`)
      .then(response => {
        const data = response.data;
        processHeatmapData(data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, [selectedModel]);

  const processHeatmapData = (data) => {
    // Extract unique airlines and days_left
    const airlines = [...new Set(data.map(d => d.airline))];
    const daysLeft = [...new Set(data.map(d => d.days_left))].sort((a, b) => a - b);

    // Create a mapping from (airline, days_left) to Predicted_Price
    const priceMap = {};
    data.forEach(d => {
      priceMap[`${d.airline}-${d.days_left}`] = d.Predicted_Price;
    });

    // Initialize a 2D array for z-values
    const zData = airlines.map(airline => {
      return daysLeft.map(day => {
        const key = `${airline}-${day}`;
        return priceMap[key] || null;
      });
    });

    setHeatmapData({
      x: daysLeft,
      y: airlines,
      z: zData,
    });
  };

  return (
    <div>
      <label className={styles.labelText}>Select Model: </label>
      <select
        id="model-select"
        value={selectedModel}
        onChange={(e) => setSelectedModel(e.target.value)} className={styles.selectInput}>
      >
        <option value="RandomForestRegressor">RandomForestRegressor</option>
        <option value="XGBRegressor">XGBRegressor</option>
        <option value="ExtraTreesRegressor">ExtraTreesRegressor</option>
        <option value="DecisionTreeRegressor">DecisionTreeRegressor</option>
      </select>

      {heatmapData ? (
        <Plot
          data={[
            {
              x: heatmapData.x,
              y: heatmapData.y,
              z: heatmapData.z,
              type: 'heatmap',
              colorscale: 'Viridis',
              reversescale: true,
            },
          ]}
          layout={{
            title: `Price Prediction Heatmap (${selectedModel})`,
            xaxis: { title: 'Days till Departure' },
            yaxis: { title: 'Airline' },
            autosize: true,
          }}
          useResizeHandler={true}
          style={{ width: '100%', height: '600px' }}
        />
      ) : (
        <p>Loading heatmap data...</p>
      )}
    </div>
  );
};

export default PricePredictionHeatmap;