// Navbar.js
import { Link } from 'react-router-dom';
import styles from '../styles/Navbar.module.css';
const Navbar = () => (
  <nav className={styles.navbar}>
    <h1>Flight Price Predictor</h1>
    <div className={styles.links}>
      <Link to="/" className={styles.link}>Home</Link>
      <Link to="/predict" className={styles.link}>Prediction</Link>
      <Link to="/predict-visualization" className={styles.link}>Prediction with Visualization</Link> {/* New link */}
      <Link to="/visualization" className={styles.link}>Data Analysis</Link>
      <Link to="/about" className={styles.link}>About Us</Link>
    </div>
  </nav>
);

export default Navbar;
