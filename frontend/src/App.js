import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './objects/Home';
import Navbar from './components/Navbar';
import PredictionForm from './components/PredictionForm';
import PredictionVisualization from './components/PredictionVisualization'; // Corrected path
import Visualization from './objects/Visualization'; // Corrected path
import AboutUs from './objects/AboutUs'; // Corrected path

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/predict" element={<PredictionForm />} />
        <Route path="/predict-visualization" element={<PredictionVisualization />} /> {/* New route */}
        <Route path="/visualization" element={<Visualization />} />
        <Route path="/about" element={<AboutUs />} />
      </Routes>
    </Router>
  );
}

export default App;
