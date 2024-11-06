// src/App.js

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './objects/Home';
import Navbar from './components/Navbar';
import PredictionVisualization from './components/PredictionVisualization';
import AboutUs from './objects/AboutUs';
import VisualizationsPage from './pages/VisualizationsPage';
import DaysLeftPriceComparison from "./components/DaysLeftPriceComparison"; // Import the visualizations pages

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/predict-visualization" element={<PredictionVisualization />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/visualizations" element={<VisualizationsPage />} />
          <Route path={"/DaysLeftPriceComparison"} element={<DaysLeftPriceComparison />} />
      </Routes>
    </Router>
  );
}

export default App;
