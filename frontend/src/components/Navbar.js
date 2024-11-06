// src/components/Navbar.js

import { Link } from 'react-router-dom';
import styles from '../styles/Navbar.module.css';

const Navbar = () => (
  <nav className={styles.navbar}>
    <h1>Flight Price Predictor</h1>
    <div className={styles.links}>
      <Link to="/" className={styles.link}>Home</Link>
      <Link to="/predict-visualization" className={styles.link}>Flight Price Prediction</Link>
      <Link to="/visualizations" className={styles.link}>Visualizations</Link> {/* New link */}
      <Link to="/about" className={styles.link}>About Us</Link>
    </div>
  </nav>
);

export default Navbar;
