import React, { useState } from 'react';
import axios from '../services/api'; // Import axios instance
import styles from '../styles/PredictionForm.module.css'; // Path for CSS module

const PredictionForm = () => {
  const [formData, setFormData] = useState({
    airline: '',
    source_city: '',
    departure_time: '',
    stops: '',
    arrival_time: '',
    destination_city: '',
    class_type: '',  // Use class_type to avoid reserved keyword issue
    duration: '',    // Ensure this is sent as a float
    days_left: ''    // Ensure this is sent as an integer
  });
  const [predictedPrice, setPredictedPrice] = useState(null);
  const [error, setError] = useState('');

  // Handle input changes for each form field
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
      // Prepare data for submission, with flight defaulted to 0
      const formattedData = {
        ...formData,
        flight: "0",  // Set flight to 0 as default
        class: formData.class_type,  // Map class_type to class for backend
        duration: parseFloat(formData.duration),  // Convert to float
        days_left: parseInt(formData.days_left, 10)  // Convert to integer
      };
      delete formattedData.class_type; // Remove class_type to avoid redundancy

      // Send POST request to the backend
      const response = await axios.post('/predict', formattedData);
      setPredictedPrice(response.data.price);
      setError('');
    } catch (err) {
      if (err.response && err.response.data && err.response.data.detail) {
        // Display error message from the backend
        setError(`Error: ${err.response.data.detail}`);
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    }
  };

  return (
    <div className={styles.homemain}>
      <h2>Predict Flight Price</h2>
      <form onSubmit={handleSubmit}>

        {/* Dropdown for Airline */}
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

        {/* Dropdown for Source City */}
        <label htmlFor="source_city">Source City:</label><br/>
        <select id="source_city" name="source_city" value={formData.source_city} onChange={handleChange}>
          <option value="">Select Source City</option>
          <option value="Bangalore">Bangalore</option>
          <option value="Chennai">Chennai</option>
          <option value="Delhi">Delhi</option>
          <option value="Hyderabad">Hyderabad</option>
          <option value="Kolkata">Kolkata</option>
          <option value="Mumbai">Mumbai</option>
        </select><br/><br/>

        {/* Dropdown for Departure Time */}
        <label htmlFor="departure_time">Departure Time:</label><br/>
        <select id="departure_time" name="departure_time" value={formData.departure_time} onChange={handleChange}>
          <option value="">Select Departure Time</option>
          <option value="Afternoon">Afternoon</option>
          <option value="Early_Morning">Early Morning</option>
          <option value="Evening">Evening</option>
          <option value="Late_Night">Late Night</option>
          <option value="Morning">Morning</option>
          <option value="Night">Night</option>
        </select><br/><br/>

        {/* Dropdown for Arrival Time */}
        <label htmlFor="arrival_time">Arrival Time:</label><br/>
        <select id="arrival_time" name="arrival_time" value={formData.arrival_time} onChange={handleChange}>
          <option value="">Select Arrival Time</option>
          <option value="Afternoon">Afternoon</option>
          <option value="Early_Morning">Early Morning</option>
          <option value="Evening">Evening</option>
          <option value="Late_Night">Late Night</option>
          <option value="Morning">Morning</option>
          <option value="Night">Night</option>
        </select><br/><br/>

        {/* Dropdown for Stops */}
        <label htmlFor="stops">Stops:</label><br/>
        <select id="stops" name="stops" value={formData.stops} onChange={handleChange}>
          <option value="">Select Number of Stops</option>
          <option value="zero">Zero</option>
          <option value="one">One</option>
          <option value="two_or_more">Two or More</option>
        </select><br/><br/>

        {/* Dropdown for Destination City */}
        <label htmlFor="destination_city">Destination City:</label><br/>
        <select id="destination_city" name="destination_city" value={formData.destination_city} onChange={handleChange}>
          <option value="">Select Destination City</option>
          <option value="Bangalore">Bangalore</option>
          <option value="Chennai">Chennai</option>
          <option value="Delhi">Delhi</option>
          <option value="Hyderabad">Hyderabad</option>
          <option value="Kolkata">Kolkata</option>
          <option value="Mumbai">Mumbai</option>
        </select><br/><br/>

        {/* Dropdown for Class */}
        <label htmlFor="class_type">Class:</label><br/>
        <select id="class_type" name="class_type" value={formData.class_type} onChange={handleChange}>
          <option value="">Select Class</option>
          <option value="Business">Business</option>
          <option value="Economy">Economy</option>
        </select><br/><br/>

        <label htmlFor="duration">Duration (in hours):</label><br/>
        <input id="duration" name="duration" value={formData.duration} onChange={handleChange} placeholder="Duration"
               type="number"/><br/><br/>

        <label htmlFor="days_left">Days Left Until Departure:</label><br/>
        <input id="days_left" name="days_left" value={formData.days_left} onChange={handleChange}
               placeholder="Days Left" type="number"/><br/><br/>

        <button type="submit">Get Prediction</button>
        <br/><br/>
      </form>
      {predictedPrice && <div className={styles.resultContainer}>Predicted Price: INR {predictedPrice}</div>}
      {error && <div className={styles.error}>{error}</div>}
    </div>
  );
};

export default PredictionForm;
