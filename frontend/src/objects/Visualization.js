// src/objects/Visualization.js
import React, { useEffect, useState } from 'react';
import Heatmap from '../components/visualizations/Heatmap';
import BoxPlotChart from '../components/visualizations/BoxPlot';
import ScatterPlot from '../components/visualizations/ScatterPlot';
import DaysLeftBarChart from '../components/visualizations/DaysLeftBarChart';
import ViolinPlot from '../components/visualizations/ViolinPlot';
import axios from 'axios';

const Visualization = () => {
  const [dataset, setDataset] = useState([]);

  useEffect(() => {
    // Fetch data from your backend
    axios.get('http://localhost:8000/data')
      .then((response) => {
        setDataset(response.data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h2>Data EDA</h2>
      <Heatmap data={dataset} />
      <BoxPlotChart data={dataset} />
      <ScatterPlot data={dataset} />
      <DaysLeftBarChart data={dataset} />
      <ViolinPlot data={dataset} />
    </div>
  );
};

export default Visualization;
