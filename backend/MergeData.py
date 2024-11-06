import pandas as pd
import os


def load_model_results():
    results_dir = 'Data/'

    model_files = {
        'RandomForestRegressor': 'Results_merged_RandomForest.csv',
        'XGBRegressor': 'Results_merged_XGBoost.csv',
        'ExtraTreesRegressor': 'Results_merged_ExtraTrees.csv',
        'DecisionTreeRegressor': 'Results_merged_DecisionTree.csv',
    }

    combined_df = pd.DataFrame()

    for model_name, filename in model_files.items():
        file_path = os.path.join(results_dir, filename)
        df = pd.read_csv(file_path)
        df['Prediction_Error'] = df['Predicted_Price'] - df['Actual_Price']


        # Add a column with the model name
        df['model_name'] = model_name

        # Append to the combined DataFrame
        combined_df = pd.concat([combined_df, df], ignore_index=True)

    return combined_df


# Load and combine the model results
df = load_model_results()

# Save the combined DataFrame to a single CSV file
df.to_csv('Data/Results_merged.csv', index=False)
