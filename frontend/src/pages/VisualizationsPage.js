// src/pages/VisualizationsPage.js

import React from 'react';
import ModelPerformanceOverTime from '../components/ModelPerformanceOverTime';
import RoutePriceComparison from '../components/RoutePriceComparison';
import PredictionErrorDistribution from '../components/PredictionErrorDistribution';
import TopRoutesByModel from '../components/TopRoutesByModel';
import PricePredictionHeatmap from '../components/PricePredictionHeatmap';

const VisualizationsPage = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Flight Price Predictions Analysis</h1>

      {/*<section>*/}
      {/*  <h2>1. Model Performance Comparison Over Time</h2>*/}
      {/*  <ModelPerformanceOverTime />*/}
      {/*</section>*/}

      {/*<section>*/}
      {/*  <h2>2. Route-Specific Price Comparison Across Models</h2>*/}
      {/*  <RoutePriceComparison />*/}
      {/*</section>*/}

      {/*<section>*/}
      {/*  <h2>3. Prediction Error Distribution by Model</h2>*/}
      {/*  <PredictionErrorDistribution />*/}
      {/*</section>*/}

      {/*<section>*/}
      {/*  <h2>4. Top 10 Most and Least Expensive Routes Predicted by Models</h2>*/}
      {/*  <TopRoutesByModel />*/}
      {/*</section>*/}

      <section>
        <h2>5. Price Prediction Heatmap by Days till Departure and Airline</h2>
        <PricePredictionHeatmap />
      </section>
    </div>
  );
};

export default VisualizationsPage;
