
# Flight Price Prediction Web Application

This repository contains a full-stack web application for predicting flight ticket prices based on multiple factors, using a range of machine learning models and data visualization techniques. The backend is built with FastAPI, while the frontend leverages React for interactive UI and Axios for API calls. Additionally, various models and visualizations are used to better understand the factors impacting flight prices.

## Features
- **Machine Learning Models:** Predict flight prices using various models (e.g., RandomForestRegressor, ExtraTreesRegressor, etc.)
- **Data Visualizations:** An EDA (Exploratory Data Analysis) section that includes a variety of visualizations to provide insights into the data.
- **RESTful API:** FastAPI for backend server and model inference.
- **Frontend Interface:** A React-based frontend with form inputs and real-time prediction display.
- **Model Evaluation Metrics:** View performance metrics for different models (MAE, MSE, RMSE, R2 Score, etc.)
- **External Data Integration:** (Optional) Use an external API for additional insights into factors affecting flight prices.

---

## Table of Contents
- [Installation](#installation)
- [Directory Structure](#directory-structure)
- [Dataset](#dataset)
- [Model Details](#model-details)
- [Data Visualizations](#data-visualizations)
- [API Endpoints](#api-endpoints)
- [Usage](#usage)
- [Model Evaluation Results](#model-evaluation-results)
- [License](#license)

---

## Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/flight-price-prediction.git
   cd flight-price-prediction
   ```

2. **Backend Setup**:
   - Create a virtual environment:
     ```bash
     python -m venv env
     source env/bin/activate  # On Windows use `venv\Scripts\Activate`
     ```
   - Install dependencies:
     ```bash
     pip install -r requirements.txt
     ```

3. **Frontend Setup**:
   - Navigate to the frontend directory:
     ```bash
     cd frontend
     ```
   - Install Node dependencies:
     ```bash
     npm install
     ```

4. **Run the Backend Server**:
   ```bash
   uvicorn main:app --reload
   ```
   This will start the FastAPI server at `http://localhost:8000`.

5. **Run the Frontend Server**:
   ```bash
   npm start
   ```
   This will start the React development server at `http://localhost:3000`.

---

## Directory Structure

- **`backend/`**: Contains backend code, including models and API endpoints.
  - `main.py`: Main API logic with endpoints for prediction and data processing.
  - `models/`: Contains saved machine learning models in `.joblib` format.
- **`frontend/`**: Contains frontend code in React.
- **`data.csv`**: Dataset used for training and testing the model.

---

## Dataset

The dataset `data.csv` contains the following fields:
- `airline`: Name of the airline (e.g., AirAsia, Indigo).
- `flight`: Flight number (string).
- `source_city`: Departure city.
- `departure_time`: Time of departure (categorized).
- `stops`: Number of stops (e.g., zero, one, two_or_more).
- `arrival_time`: Time of arrival (categorized).
- `destination_city`: Arrival city.
- `class`: Travel class (e.g., Economy, Business).
- `duration`: Flight duration in hours.
- `days_left`: Days left until departure.
- `price`: Flight ticket price (target variable).

---

## Model Details

Multiple machine learning models are used to predict the price of a flight ticket:
- `RandomForestRegressor`
- `ExtraTreesRegressor`
- `XGBRegressor`
- `KNeighborsRegressor`
- `LinearRegression`
- `DecisionTreeRegressor`
- `BaggingRegressor`

Each model’s evaluation metrics (MAE, MSE, RMSE, R2 Score, etc.) are displayed to help choose the best model for predictions.

---

## Data Visualizations

In the **Data EDA** section, we explore various relationships in the data. Here are some examples:

1. **Heatmap of Correlations**: Visualize correlations between different features to identify strong relationships.
2. **Price Distribution by Airline**: Bar plot showing average ticket prices across airlines.
3. **Flight Duration by Source City**: Plot flight durations for each source city.
4. **Price vs. Days Left**: Line chart showing price trends as days left to departure increase.
5. **Class-wise Price Distribution**: Visualize differences in price distribution between Economy and Business class.

These visualizations help users understand how different factors influence flight prices.

---

## API Endpoints

### `/predict` (POST)
**Description**: Predicts flight ticket price based on user-provided details.

**Request Body**:
```json
{
  "airline": "SpiceJet",
  "flight": "SG-8709",
  "source_city": "Delhi",
  "departure_time": "Evening",
  "stops": "zero",
  "arrival_time": "Night",
  "destination_city": "Mumbai",
  "class": "Economy",
  "duration": 2.17,
  "days_left": 1
}
```

**Response**:
```json
{
  "price": 5953
}
```

---

## Usage

1. **Open the Application**:
   - Navigate to `http://localhost:3000` in your browser.

2. **Predict Flight Price**:
   - Select flight details from the dropdown menus.
   - Enter values for `duration` and `days_left`.
   - Submit the form to get the predicted price.

3. **View Visualizations**:
   - Navigate to the **Data EDA** section to explore various visualizations of the data.

---

## Model Evaluation Results

The following table summarizes the performance of each model on the dataset:

| Model                  | MAE     | MSE         | RMSE    | R2 Score | RMSLE | Adjusted R2 Score |
|------------------------|---------|-------------|---------|----------|-------|--------------------|
| LinearRegression       | 4623.41 | 49062056.15 | 7004.43 | 0.904672 | 8.854 | 0.904662          |
| DecisionTreeRegressor  | 2225.40 | 16044205.37 | 4005.52 | 0.968826 | 8.295 | 0.968823          |
| RandomForestRegressor  | 1320.78 | 7319110.04  | 2705.39 | 0.985779 | 7.903 | 0.985777          |
| KNeighborsRegressor    | 12274.68| 288415712.64| 16982.81| 0.439607 | 9.74  | 0.439544          |
| ExtraTreesRegressor    | 1511.97 | 8713209.69  | 2951.82 | 0.98307  | 7.99  | 0.983068          |
| XGBRegressor           | 1267.93 | 6109175.26  | 2471.68 | 0.98813  | 7.813 | 0.988129          |
| BaggingRegressor       | 3951.47 | 30990730.01 | 5566.93 | 0.939785 | 8.625 | 0.939778          |

---

## License

This project is licensed under the MIT License.
