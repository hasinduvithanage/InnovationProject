import joblib
import pandas as pd
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Dict
import os
import json
from functools import lru_cache
from MakeHeatMapData import convert_and_save_heatmap_data

# Initialize FastAPI app
app = FastAPI()

# Enable CORS to allow requests from the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Allow frontend origin
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

# Load the trained models
models = {
    'RandomForestRegressor': joblib.load('models/random_forest_regressor_model.joblib'),
    'XGBRegressor': joblib.load('models/xgb_regressor_model.joblib'),
    'ExtraTreesRegressor': joblib.load('models/extra_trees_regressor_model.joblib'),
    'DecisionTreeRegressor': joblib.load('models/decision_tree_regressor_model.joblib'),
}


# Define encoding mappings based on training data
encoding_mappings = {
    'airline': {'AirAsia': 0, 'Air_India': 1, 'GO_FIRST': 2, 'Indigo': 3, 'SpiceJet': 4, 'Vistara': 5},
    'source_city': {'Bangalore': 0, 'Chennai': 1, 'Delhi': 2, 'Hyderabad': 3, 'Kolkata': 4, 'Mumbai': 5},
    'departure_time': {'Afternoon': 0, 'Early_Morning': 1, 'Evening': 2, 'Late_Night': 3, 'Morning': 4, 'Night': 5},
    'stops': {'one': 0, 'two_or_more': 1, 'zero': 2},
    'arrival_time': {'Afternoon': 0, 'Early_Morning': 1, 'Evening': 2, 'Late_Night': 3, 'Morning': 4, 'Night': 5},
    'destination_city': {'Bangalore': 0, 'Chennai': 1, 'Delhi': 2, 'Hyderabad': 3, 'Kolkata': 4, 'Mumbai': 5},
    'class': {'Business': 0, 'Economy': 1}
}

# List of all airlines
all_airlines = ["AirAsia", "Air_India", "GO_FIRST", "Indigo", "SpiceJet", "Vistara"]

from typing import Optional

class PredictionRequest(BaseModel):
    airline: str = Field(..., example="SpiceJet")
    flight: str = Field(..., example="SG-8709")
    source_city: str = Field(..., example="Delhi")
    departure_time: str = Field(..., example="Evening")
    stops: str = Field(..., example="zero")
    arrival_time: str = Field(..., example="Night")
    destination_city: str = Field(..., example="Mumbai")
    class_type: str = Field(..., alias="class", example="Economy")
    duration: float = Field(..., example=2.17)
    days_left: int = Field(..., example=1)
    model_name: Optional[str] = Field('ExtraTreesRegressor', example="ExtraTreesRegressor")



class PredictionResponse(BaseModel):
    price: float


# Define the response schema for the airline prices
class AirlinePriceResponse(BaseModel):
    airline_prices: List[Dict[str, float]]


# Helper function to preprocess input data
def preprocess_input(data: PredictionRequest, airline: str = None) -> pd.DataFrame:
    # Convert to dictionary using alias for "class" field
    input_data = data.dict(by_alias=True)

    # Remove 'model_name' from input_data before creating DataFrame
    input_data.pop('model_name', None)  # Remove the model_name key

    # If airline is provided (for batch prediction), set it in the data dictionary
    if airline:
        input_data['airline'] = airline
    else:
        input_data['airline'] = data.airline  # Use the specified airline for single prediction

    # Create DataFrame after removing 'model_name'
    input_df = pd.DataFrame([input_data])

    # Fill 'flight' column with a placeholder value, since the model expects it
    input_df['flight'] = 0  # Or use input_df['flight'] = float('nan')

    # Apply label encoding for categorical columns
    for column, mapping in encoding_mappings.items():
        if column in input_df.columns:
            input_df[column] = input_df[column].map(mapping).fillna(0)

    # Optional: Print the columns to verify 'model_name' is not included
    print("Columns in input_df:", input_df.columns.tolist())

    return input_df



# Endpoint for predicting flight price for a single airline
@app.post("/predict", response_model=PredictionResponse)
async def get_prediction(data: PredictionRequest):
    try:
        # Preprocess the input data
        input_df = preprocess_input(data)

        # Get the selected model
        selected_model = models.get(data.model_name)
        if not selected_model:
            selected_model = models['ExtraTreesRegressor']
            #raise HTTPException(status_code=400, detail="Model not found")

        # Predict the flight price using the selected model
        prediction = selected_model.predict(input_df)[0]

        # Return the prediction as a JSON response
        return PredictionResponse(price=prediction)

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Endpoint for predicting prices for all airlines
@app.post("/predict_airline_prices", response_model=AirlinePriceResponse)
async def get_airline_prices(data: PredictionRequest):
    try:
        airline_prices = []
        for airline in all_airlines:
            # Preprocess the input data for each airline
            input_df = preprocess_input(data, airline)

            # Predict the price for the current airline
            predicted_price = model.predict(input_df)[0]

            # Append the airline and its predicted price as a dictionary
            airline_prices.append({airline: predicted_price})

        # Return the list of airline price predictions
        return AirlinePriceResponse(airline_prices=airline_prices)

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/data")
async def get_data():
    try:
        # Read your dataset
        df = pd.read_csv('backend/data.csv')
        # Convert DataFrame to a list of dictionaries
        data = df.to_dict(orient='records')
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@lru_cache(maxsize=100)
def load_model_results():
    results_file = 'Data/Results_merged.csv'
    data = {}
    try:
        df = pd.read_csv(results_file)
        # Ensure only necessary columns are used
        df = df[['days_left', 'Actual_Price', 'Predicted_Price', 'model_name']]
        # Group the data by 'model_name'
        grouped = df.groupby('model_name')
        for model_name, group in grouped:
            # Convert each group's DataFrame to a list of dictionaries
            data[model_name] = group[['days_left', 'Actual_Price', 'Predicted_Price', 'Prediction_Error']].to_dict(orient='records')
    except FileNotFoundError as e:
        print(f"File not found: {e}")
        raise HTTPException(status_code=404, detail=f"File {results_file} not found")
    except Exception as e:
        print(f"Error reading {results_file}: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    return data

@app.get("/get_model_results")
async def get_model_results():
    try:
        return load_model_results()
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail="Unexpected error occurred.")

with open('inverse_encoding_mappings.json', 'r') as f:
    inverse_encoding_mappings = json.load(f)

@app.get("/get_inverse_mappings")
def get_inverse_mappings():
    return inverse_encoding_mappings


@app.get("/get_heatmap_data")
def get_heatmap_data(model_name: str = 'RandomForestRegressor'):
    try:
        # Determine the file name based on the model name
        file_name = f'heatmap_data_{model_name}.json'

        # Load data from the specific JSON file
        with open(file_name, 'r') as f:
            data = json.load(f)

        return data

    except FileNotFoundError as fnf_error:
        raise HTTPException(status_code=404, detail=str(fnf_error))
    except KeyError as key_error:
        raise HTTPException(status_code=400, detail=f"Missing key in mappings: {str(key_error)}")
    except ValueError as value_error:
        raise HTTPException(status_code=422, detail=f"Data error: {str(value_error)}")
    except Exception as e:
        # Generic error handling for unexpected issues
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred: {str(e)}")