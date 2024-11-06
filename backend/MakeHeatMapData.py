import pandas as pd
import os
import json
import numpy as np

def convert_and_save_heatmap_data(model_name: str):
    try:
        # Step 1: Load the dataset
        if not os.path.exists('Data/Results_merged.csv'):
            raise FileNotFoundError("Data/Results_merged.csv not found.")
        df = pd.read_csv('Data/Results_merged.csv')

        # Step 2: Filter data for the selected model
        if 'model_name' not in df.columns:
            raise ValueError("'model_name' column not found in the dataset.")
        df = df[df['model_name'] == model_name]

        if df.empty:
            raise ValueError(f"No data found for model_name: {model_name}")

        # Step 3: Aggregate data
        if 'airline' not in df.columns or 'days_left' not in df.columns or 'Predicted_Price' not in df.columns:
            raise ValueError("Required columns ('airline', 'days_left', 'Predicted_Price') not found in the dataset.")

        aggregated_df = df.groupby(['airline', 'days_left'])['Predicted_Price'].mean().reset_index()

        # Step 4: Load and apply inverse mappings if 'airline' is label-encoded
        if not os.path.exists('inverse_encoding_mappings.json'):
            raise FileNotFoundError("inverse_encoding_mappings.json not found.")
        with open('inverse_encoding_mappings.json', 'r') as f:
            inverse_mappings = json.load(f)

        if 'airline' not in inverse_mappings:
            raise KeyError("Key 'airline' not found in inverse encoding mappings.")

        airline_mapping = {int(k): v for k, v in inverse_mappings['airline'].items()}

        # Apply decoding
        aggregated_df['airline'] = aggregated_df['airline'].map(airline_mapping)

        # Step 5: Handle NaN and Infinity values in 'Predicted_Price'
        aggregated_df.replace([np.inf, -np.inf], np.nan, inplace=True)
        aggregated_df.dropna(subset=['Predicted_Price'], inplace=True)

        # Step 6: Convert DataFrame to list of dictionaries and save to JSON file
        data = aggregated_df.to_dict(orient='records')
        with open(f'heatmap_data_{model_name}.json', 'w') as f:
            json.dump(data, f)

    except Exception as e:
        # Handle any errors during conversion and saving process
        raise Exception(f"Failed to convert and save heatmap data: {str(e)}")

data_RF = convert_and_save_heatmap_data('RandomForestRegressor')
data_XGB = convert_and_save_heatmap_data('XGBRegressor')
data_DT = convert_and_save_heatmap_data('DecisionTreeRegressor')
data_ET = convert_and_save_heatmap_data('ExtraTreesRegressor')
print("All Heatmap data saved successfully!")