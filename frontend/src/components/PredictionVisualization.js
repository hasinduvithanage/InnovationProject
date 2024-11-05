// src/objects/PredictionVisualization.js
import React, { useState } from 'react';
import axios from '../services/api';
import styles from '../styles/PredictionForm.module.css';
import PredictionBarChart from '../components/visualizations/PredictionBarChart'; // Bar chart component

const PredictionVisualization = () => {
  const [formData, setFormData] = useState({
    airline: '',
    source_city: '',
    departure_time: '',
    stops: '',
    arrival_time: '',
    destination_city: '',
    class_type: '',
    duration: '',
    days_left: ''
  });
  const [predictedPrice, setPredictedPrice] = useState(null);
  const [error, setError] = useState('');

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formattedData = {
        ...formData,
        flight: "0",  // Set flight to 0 by default
        class: formData.class_type,
        duration: parseFloat(formData.duration),
        days_left: parseInt(formData.days_left, 10)
      };
      delete formattedData.class_type;

      // Request prediction from backend
      const response = await axios.post('/predict', formattedData);
      setPredictedPrice(response.data.price);
      setError('');
    } catch (err) {
      if (err.response && err.response.data && err.response.data.detail) {
        setError(`Error: ${err.response.data.detail}`);
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    }
  };

  return (
    <div className={styles.homemain}>
      <h2>Predict Flight Price and View Visualization</h2>
      <form onSubmit={handleSubmit}>
        {/* Form fields, similar to PredictionForm.js */}
        <label htmlFor="airline">Airline:</label><br/>
        <select id="airline" name="airline" value={formData.airline} onChange={handleChange}>
          <option value="">Select Airline</option>
          <option value="Air_India">Air India</option>
          <option value="AirAsia">AirAsia</option>
          <option value="GO_FIRST">GO FIRST</option>
          <option value="Indigo">Indigo</option>
          <option value="SpiceJet">SpiceJet</option>
          <option value="Vistara">Vistara</option>
        </select><br/><br/>

        {/* Add other input fields as in PredictionForm */}
        <label htmlFor="duration">Duration (in hours):</label><br/>
        <input id="duration" name="duration" value={formData.duration} onChange={handleChange} placeholder="Duration" type="number"/><br/><br/>

        <label htmlFor="days_left">Days Left Until Departure:</label><br/>
        <input id="days_left" name="days_left" value={formData.days_left} onChange={handleChange} placeholder="Days Left" type="number"/><br/><br/>

        <button type="submit">Get Prediction</button>
        <br/><br/>
      </form>

      {/* Display error if exists */}
      {error && <div className={styles.error}>{error}</div>}

      {/* Display the bar chart with prediction */}
      {predictedPrice && (
        <PredictionBarChart predictions={[predictedPrice]} />
      )}
    </div>
  );
};

export default PredictionVisualization;
