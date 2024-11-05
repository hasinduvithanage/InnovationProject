import joblib
import pandas as pd
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

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

# Load the trained model
model = joblib.load('models/extra_trees_regressor_model.joblib')

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

# Define request and response schemas
class PredictionRequest(BaseModel):
    airline: str = Field(..., example="SpiceJet")
    flight: str = Field(..., example="SG-8709")  # Keep flight as a string
    source_city: str = Field(..., example="Delhi")
    departure_time: str = Field(..., example="Evening")
    stops: str = Field(..., example="zero")
    arrival_time: str = Field(..., example="Night")
    destination_city: str = Field(..., example="Mumbai")
    class_type: str = Field(..., alias="class", example="Economy")
    duration: float = Field(..., example=2.17)
    days_left: int = Field(..., example=1)

class PredictionResponse(BaseModel):
    price: float

# Helper function to preprocess input data
def preprocess_input(data: PredictionRequest) -> pd.DataFrame:
    # Convert to dictionary using alias for "class" field
    input_data = data.dict(by_alias=True)
    print("Input Data Received:", input_data)  # Debugging line to check input data

    # Create DataFrame and apply label encoding for categorical columns
    input_df = pd.DataFrame([input_data])

    # Apply label encoding for categorical columns, skipping the 'flight' field
    for column, mapping in encoding_mappings.items():
        if column in input_df.columns and column != 'flight':  # Skip flight column
            input_df[column] = input_df[column].map(mapping).fillna(0)

    print("Processed Input DataFrame:", input_df)  # Debugging line to check processed data
    return input_df

# Endpoint for predicting flight price
@app.post("/predict", response_model=PredictionResponse)
async def get_prediction(data: PredictionRequest):
    try:
        # Preprocess the input data
        input_df = preprocess_input(data)

        # Predict the flight price using the model
        prediction = model.predict(input_df)[0]

        # Return the prediction as a JSON response
        return PredictionResponse(price=prediction)

    except Exception as e:
        # Handle errors and return an HTTP exception
        raise HTTPException(status_code=500, detail=str(e))
