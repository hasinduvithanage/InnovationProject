// App.js

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './objects/Home';
import Navbar from './components/Navbar';
import PredictionForm from './components/PredictionForm';
import PredictionVisualization from './components/PredictionVisualization';
import DataAnalysis from './objects/DataAnalysis';
import AboutUs from './objects/AboutUs';
import DaysLeftPriceComparison from './components/DaysLeftPriceComparison'; // Import the component

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/predict" element={<PredictionForm />} />
        <Route path="/predict-visualization" element={<PredictionVisualization />} />
        <Route path="/visualization" element={<DataAnalysis />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/days-left-comparison" element={<DaysLeftPriceComparison />} /> {/* New Route */}
      </Routes>
    </Router>
  );
}

export default App;
