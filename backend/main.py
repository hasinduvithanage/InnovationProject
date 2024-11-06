import joblib
import pandas as pd
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Dict
import os
import json
from functools import lru_cache
import http.client
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
    model_name: Optional[str] = Field(None, example="ExtraTreesRegressor")



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

        # Ensure model_name is provided in the request and use it to select the model
        if data.model_name not in models:
            raise HTTPException(status_code=400, detail="Invalid model name provided.")

        selected_model = models[data.model_name]

        # Predict the flight price using the selected model
        prediction = selected_model.predict(input_df)[0]

        # Return the prediction as a JSON response
        return PredictionResponse(price=prediction)

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
            data[model_name] = group[['days_left', 'Actual_Price', 'Predicted_Price']].to_dict(orient='records')
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
async def get_inverse_mappings():
    return inverse_encoding_mappings


@app.get("/get_heatmap_data")
async def get_heatmap_data(model_name: str = 'RandomForestRegressor'):
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


@app.get("/get_model_results_prediction_error")
async def get_model_results():
    try:
        # Load the dataset
        if not os.path.exists('Data/Results_merged.csv'):
            raise FileNotFoundError("Data/Results_merged.csv not found.")

        df = pd.read_csv('Data/Results_merged.csv')

        # Ensure required columns are present
        required_columns = {'model_name', 'Predicted_Price', 'Actual_Price'}
        if not required_columns.issubset(df.columns):
            raise ValueError(f"Dataset must contain columns: {required_columns}")

        # Calculate prediction error
        df['Prediction_Error'] = df['Predicted_Price'] - df['Actual_Price']

        # Aggregate prediction errors by model
        model_errors = df.groupby('model_name')['Prediction_Error'].apply(list).to_dict()

        # Return aggregated data as JSON
        return model_errors

    except FileNotFoundError as fnf_error:
        raise HTTPException(status_code=404, detail=str(fnf_error))
    except ValueError as value_error:
        raise HTTPException(status_code=422, detail=f"Data error: {str(value_error)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred: {str(e)}")



class WeatherForecast(BaseModel):
    temperature: float
    feels_like: float
    temp_min: float
    temp_max: float
    pressure: int
    humidity: int
    weather: str
    wind_speed: float
    wind_direction: int
    date_time: str

class WeatherDataResponse(BaseModel):
    temperature: float
    feels_like: float
    temp_min: float
    temp_max: float
    pressure: int
    humidity: int
    weather: str
    wind_speed: float
    wind_direction: int
    date_time: str

# @app.get("/get_weather_data", response_model=WeatherDataResponse)
# async def get_weather_data(lat: float, lon: float):
#     conn = http.client.HTTPSConnection("rapidweather.p.rapidapi.com")
#
#     headers = {
#         'x-rapidapi-key': "d0897fb5f7msh048a3d319f81dcap103a53jsn8c7b09d1906f",
#         'x-rapidapi-host': "rapidweather.p.rapidapi.com"
#     }
#
#     try:
#         # Make API request to fetch weather data
#         conn.request("GET", f"/data/2.5/forecast?lat={lat}&lon={lon}", headers=headers)
#         res = conn.getresponse()
#         data = res.read()
#         raw_data = json.loads(data.decode("utf-8"))
#
#         # Process and structure weather data to only return relevant information
#         item = raw_data["list"][0]
#         forecast_data = {
#             "temperature": item["main"]["temp"],
#             "feels_like": item["main"]["feels_like"],
#             "temp_min": item["main"]["temp_min"],
#             "temp_max": item["main"]["temp_max"],
#             "pressure": item["main"]["pressure"],
#             "humidity": item["main"]["humidity"],
#             "weather": item["weather"][0]["description"],
#             "wind_speed": item["wind"]["speed"],
#             "wind_direction": item["wind"]["deg"],
#             "date_time": item["dt_txt"]
#         }
#
#         return forecast_data
#
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))