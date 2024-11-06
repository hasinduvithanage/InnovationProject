import pandas as pd
import numpy as np

# Load your data
df = pd.read_csv('Data/Results_merged.csv')

# Calculate Prediction Error
df['Prediction_Error'] = df['Predicted_Price'] - df['Actual_Price']

# Group by model_name and aggregate
aggregated_data = df.groupby('model_name')['Prediction_Error'].agg([
    'count',           # Total count of errors for each model
    'mean',            # Mean prediction error for each model
    'std',             # Standard deviation of prediction error
    'median',          # Median prediction error for each model
    lambda x: x.quantile(0.25),  # First quartile (Q1)
    lambda x: x.quantile(0.75)   # Third quartile (Q3)
])

# Rename quartile columns for clarity
aggregated_data.columns = ['count', 'mean', 'std', 'median', 'Q1', 'Q3']

# Calculate Interquartile Range (IQR)
aggregated_data['IQR'] = aggregated_data['Q3'] - aggregated_data['Q1']

print(aggregated_data)
