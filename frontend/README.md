# Flight Price Predictor

## Introduction
Flight Price Predictor is a web application designed to predict flight ticket prices based on various parameters and provide insightful data visualizations. Leveraging machine learning models, this application helps users make informed decisions when planning their travels by forecasting prices and analyzing trends.

The project comprises a React frontend and a FastAPI backend. The frontend allows users to input flight details, view price predictions, and explore interactive data visualizations. The backend handles data processing, model predictions, and serves aggregated data for the visualizations.

## Features
- **Flight Price Prediction**: Enter flight details to receive predicted ticket prices using trained machine learning models.
- **Interactive Data Visualizations**: Explore various charts and graphs that illustrate pricing trends, model performances, and more.
- **Model Performance Comparison**: Compare how different machine learning models perform over time.
- **Route-Specific Analysis**: Analyze predicted prices for specific routes and airlines.
- **User-Friendly Interface**: Navigate through an intuitive UI with easy access to all features.

## Technologies Used

### Frontend
- **React**: JavaScript library for building user interfaces.
- **React Router DOM**: Routing library for React applications.
- **Axios**: Promise-based HTTP client for making API requests.
- **Chart.js & react-chartjs-2**: Libraries for creating responsive charts.
- **Plotly.js & react-plotly.js**: Libraries for interactive data visualizations.
- **CSS Modules**: Scoped and maintainable CSS styles.

### Backend
- **Python 3.7+**: Programming language for backend development.
- **FastAPI**: High-performance web framework for building APIs.
- **Pandas**: Data manipulation and analysis library.
- **NumPy**: Numerical computing library.
- **Scikit-learn**: Machine learning library for predictive modeling.
- **Uvicorn**: ASGI web server implementation for Python.

## Installation and Setup Instructions

### Prerequisites
- **Node.js and npm**: [Download Node.js](https://nodejs.org/)
- **Python 3.7+**: [Download Python](https://www.python.org/)
- **Git**: [Download Git](https://git-scm.com/)

### Backend Setup

#### Clone the Repository
```bash
git clone https://github.com/yourusername/flight-price-predictor.git
cd flight-price-predictor/backend
```

#### Create a Virtual Environment
```bash
python -m venv venv
source venv/bin/activate
```

#### Install Required Packages
```bash
pip install -r requirements.txt
```

#### Prepare Data and Models
* Place your trained machine learning models in the models/ directory.
* Ensure all datasets required are placed in the data/ directory.
* If you have label encodings, ensure inverse_encoding_mappings.json is placed appropriately.


#### Start the Backend Server
```bash
uvicorn main:app --reload
```

Frontend Setup
Navigate to the Frontend Directory
bash
Copy code
cd ../frontend
Install Frontend Dependencies
bash
Copy code
npm install
Start the Frontend Server
bash
Copy code
npm start
The application will open in your default browser at http://localhost:3000.

Directory Structure
Here's an overview of the project's directory structure:

```plaintext
flight-price-predictor/
├── backend/
│   ├── main.py
│   ├── requirements.txt
│   ├── models/
│   ├── data/
│   └── ...
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   │   ├── airports.json
│   │   │   ├── background.jpg
│   │   │   ├── hasindu.jpg
│   │   │   ├── radin.jpg
│   │   │   └── savindu.jpg
│   │   ├── components/
│   │   │   ├── DaysLeftPriceComparison.js
│   │   │   ├── Navbar.js
│   │   │   ├── PredictionErrorDistribution.js
│   │   │   ├── PredictionVisualization.js
│   │   │   └── PricePredictionHeatmap.js
│   │   ├── objects/
│   │   │   ├── AboutUs.js
│   │   │   └── Home.js
│   │   ├── pages/
│   │   │   └── VisualizationsPage.js
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── styles/
│   │   │   ├── AboutUs.module.css
│   │   │   ├── HeatMap.module.css
│   │   │   ├── Home.module.css
│   │   │   ├── Navbar.module.css
│   │   │   ├── PredictionForm.module.css
│   │   │   └── Visualizer.module.css
│   │   ├── App.js
│   │   ├── index.js
│   │   └── ...
│   └── ...
└── README.md
```

api.js: Configures Axios for API calls.
styles/: CSS modules for component styling.
Navbar.module.css, Home.module.css, etc.: Styles scoped to their respective components.
App.js: Main React component setting up routing and layout.
index.js: Entry point for the React application.sets such as images and JSON files.
        * airports.json: JSON data for airport codes and names.
        * background.jpg, hasindu.jpg, radin.jpg, savindu.jpg: Image assets.
components/: Reusable React components.
Navbar.js: Navigation bar component.
PredictionVisualization.js: Visual representation of predictions.
PricePredictionHeatmap.js: Heatmap visualization component.
PredictionErrorDistribution.js: Component for error distribution visualization.
DaysLeftPriceComparison.js: Component comparing prices over days left until departure.
objects/: Components representing standalone pages.
Home.js: Homepage component.
AboutUs.js: Component for the "About Us" page.
pages/: Components that aggregate multiple components into full pages.
VisualizationsPage.js: Page displaying all visualizations.
services/: Contains API service files.
api.js: Configures Axios for API calls.
styles/: CSS modules for component styling.
Navbar.module.css, Home.module.css, etc.: Styles scoped to their respective components.
App.js: Main React component setting up routing and layout.
index.js: Entry point for the React application.