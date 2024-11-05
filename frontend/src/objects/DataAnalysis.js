// /src/objects/DataAnalysis.js
import React from 'react';
import BarChart from '../components/visualizations/BarChart';
import LineChart from '../components/visualizations/LineChart';

const DataAnalysis = () => {
  // Data for the Bar Chart (e.g., average ticket price by airline)
  const barChartData = {
    labels: ['AirAsia', 'Air India', 'GO FIRST', 'Indigo', 'SpiceJet', 'Vistara'],
    datasets: [
      {
        label: 'Average Ticket Price (INR)',
        data: [4000, 5000, 4500, 4800, 4700, 5100],
        backgroundColor: 'rgba(75, 192, 192, 0.6)', // Adjust color if needed
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Data for the Line Chart (e.g., monthly sales data)
  const lineChartData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June'],
    datasets: [
      {
        label: 'Monthly Sales (INR)',
        data: [1200, 1900, 3000, 5000, 2000, 3000],
        borderColor: 'rgba(153, 102, 255, 1)',
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        tension: 0.4, // Optional for smoothing line
      },
    ],
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Data Analysis</h2>

      {/* Bar Chart Section */}
      <div style={{ marginBottom: '50px' }}>
        <h3>Average Flight Prices by Airline</h3>
        <BarChart
          chartData={barChartData}
          title="Average Flight Prices by Airline"
          xLabel="Airline"
          yLabel="Price (INR)"
        />
      </div>

      {/* Line Chart Section */}
      <div>
        <h3>Monthly Sales Over Time</h3>
        <LineChart
          chartData={lineChartData}
          title="Monthly Sales Over Time"
          xLabel="Months"
          yLabel="Sales (INR)"
        />
      </div>
    </div>
  );
};

export default DataAnalysis;
