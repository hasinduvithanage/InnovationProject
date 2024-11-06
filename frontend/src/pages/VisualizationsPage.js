// src/pages/VisualizationsPage.js

import React from 'react';
import PredictionErrorDistribution from '../components/PredictionErrorDistribution';
import PricePredictionHeatmap from '../components/PricePredictionHeatmap';
import DaysLeftPriceComparison from '../components/DaysLeftPriceComparison.js'
import styles from "../styles/Visualizer.module.css";

const VisualizationsPage = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Flight Price Predictions Analysis</h1>

      <section>
        <h2>1. Days Left Actual vs Predicted</h2>
        <DaysLeftPriceComparison />
      </section>

      <section>
        <h2>2. Prediction Error Distribution by Model</h2>
        <PredictionErrorDistribution />
      </section>

      <section>
        <h2>3. Price Prediction Heatmap by Days till Departure and Airline</h2>
        <PricePredictionHeatmap />
      </section>
    </div>
  );
};

export default VisualizationsPage;
