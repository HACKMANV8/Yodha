# app/ml/price_data_fetch.py
import requests
import pandas as pd
import os
from datetime import datetime

def fetch_agmarknet(api_url, params=None):
    """
    Fetch daily data from Agmarknet. api_url must be the Agmarknet endpoint.
    Return a DataFrame with columns matching our schema.
    """
    # Example: adjust this to the exact Agmarknet endpoint & auth if needed
    res = requests.get(api_url, params=params, timeout=30)
    res.raise_for_status()
    data = res.json()  # depends on API format
    # Convert JSON to DataFrame - mapping depends on Agmarknet output
    df = pd.json_normalize(data)  # adapt
    return df

def load_kaggle_dataset(path):
    return pd.read_csv(path)

def unify_and_save(raw_df, kaggle_df, out_path):
    """
    Normalize columns: state, district, market, commodity, variety, arrival_date, min_price, max_price, modal_price, arrivals, source
    """
    # Example normalization - adapt column names based on CSV
    # raw_df and kaggle_df must be cleaned to same column names
    df = pd.concat([raw_df, kaggle_df], ignore_index=True, sort=False)
    df['arrival_date'] = pd.to_datetime(df['arrival_date']).dt.date
    df.to_csv(out_path, index=False)
    return df

if __name__ == "__main__":
    BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    kaggle = load_kaggle_dataset(os.path.join(BASE, "..", "..", "data", "kaggle_prices.csv"))
    # Provide your Agmarknet URL and params
    # ag = fetch_agmarknet("https://api.agmarknet/...", params={})
    # unified = unify_and_save(ag, kaggle, os.path.join(BASE, "..", "..", "data", "market_prices.csv"))
    print("fetch script ready — adapt to Agmarknet schema.")
