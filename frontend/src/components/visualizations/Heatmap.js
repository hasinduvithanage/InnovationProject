// src/components/visualizations/Heatmap.js
import React, { useEffect, useState } from 'react';
import { Chart } from 'react-chartjs-2';
import 'chartjs-plugin-datalabels';

const Heatmap = ({ data }) => {
  const [chartData, setChartData] = useState({});

  useEffect(() => {
    // Process data to get average prices between cities
    const cityPairs = {};
    data.forEach((flight) => {
      const key = `${flight.source_city}-${flight.destination_city}`;
      if (!cityPairs[key]) {
        cityPairs[key] = { total: 0, count: 0 };
      }
      cityPairs[key].total += flight.price;
      cityPairs[key].count += 1;
    });

    const cities = [...new Set(data.map((d) => d.source_city))];
    const destinations = [...new Set(data.map((d) => d.destination_city))];

    const dataset = cities.map((source) => {
      return destinations.map((destination) => {
        const key = `${source}-${destination}`;
        const value = cityPairs[key] ? cityPairs[key].total / cityPairs[key].count : 0;
        return value;
      });
    });

    setChartData({
      labels: destinations,
      datasets: cities.map((source, idx) => ({
        label: source,
        data: dataset[idx],
        backgroundColor: `rgba(75, 192, 192, 0.6)`,
      })),
    });
  }, [data]);

  return (
    <div>
      <h3>Average Flight Prices Between Cities</h3>
      <Chart
        type="bar"
        data={chartData}
        options={{
          indexAxis: 'y',
          scales: {
            x: { beginAtZero: true },
          },
          plugins: {
            legend: { display: false },
          },
        }}
      />
    </div>
  );
};

export default Heatmap;
