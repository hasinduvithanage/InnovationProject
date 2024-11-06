// src/objects/Home.js
import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/Home.module.css';
import backgroundImage from '../assets/background.jpg'; // Import the background image

const Home = () => {
  return (
    <div
      className={styles.homeContainer}
      style={{ backgroundImage: `url(${backgroundImage})` }} // Apply background image inline
    >
      <div className={styles.overlay}>
        <h1>Welcome to the Flight Price Predictor</h1>
        {/*<p>Accurately predict flight prices based on factors like departure time, stops, and airline.</p>*/}

        <div className={styles.infoCards}>
          <div className={styles.card}>
            <h3>Real-Time Price Prediction</h3>
            <p>Use data-driven insights to get real-time predictions on flight prices and plan your trips with confidence.</p>
          </div>
          <div className={styles.card}>
            <h3>Visual Analytics</h3>
            <p>View visualizations that provide insights into pricing trends and patterns across different airlines and times.</p>
          </div>
          <div className={styles.card}>
            <h3>Easy and Intuitive</h3>
            <p>Our tool is designed for simplicity and efficiency. Start predicting in just a few clicks!</p>
          </div>
        </div>

        <Link to="/predict-visualization">
          <button className={styles.startButton}>Get Started</button>
        </Link>
      </div>
    </div>
  );
};

export default Home;
