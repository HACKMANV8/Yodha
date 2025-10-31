# app/ml/price_preprocessing.py
import pandas as pd
import numpy as np
from sklearn.preprocessing import LabelEncoder
from dateutil import parser

def load_data(path):
    df = pd.read_csv(path, parse_dates=['arrival_date'])
    return df

def preprocess(df):
    # Standardize column names
    df = df.rename(columns={
        'commodity':'crop', 'modal_price':'modal_price',
        # adapt as needed
    })
    # Fill missing values
    df['arrivals'] = df['arrivals'].fillna(0)
    df['min_price'] = df['min_price'].fillna(df['modal_price'] * 0.9)
    df['max_price'] = df['max_price'].fillna(df['modal_price'] * 1.1)

    # Date features
    df['year'] = df['arrival_date'].dt.year
    df['month'] = df['arrival_date'].dt.month
    df['day'] = df['arrival_date'].dt.day
    df['dayofweek'] = df['arrival_date'].dt.dayofweek

    # Label encoding for categorical features
    encoders = {}
    for col in ['state', 'district', 'market', 'crop', 'variety']:
        if col in df.columns:
            le = LabelEncoder()
            df[col+'_enc'] = le.fit_transform(df[col].astype(str))
            encoders[col] = le

    # Lag features: modal_price lag 1..3 by market+crop
    df = df.sort_values(['market','crop','arrival_date'])
    for lag in [1,2,3,7]:
        df[f'modal_lag_{lag}'] = df.groupby(['market','crop'])['modal_price'].shift(lag)
    # Fill lag missing with mode or forward fill
    df.fillna(method='ffill', inplace=True)
    df.fillna(0, inplace=True)

    # Feature matrix
    feature_cols = []
    # numeric
    numeric = ['arrivals','min_price','max_price','modal_price']  # modal is target but we may include prior day's modal
    for c in ['year','month','day','dayofweek']:
        if c in df.columns: feature_cols.append(c)
    for col in ['arrivals']:
        if col in df.columns: feature_cols.append(col)
    # encoded categorical
    for c in ['state_enc','district_enc','market_enc','crop_enc','variety_enc']:
        if c in df.columns: feature_cols.append(c)
    # lags
    for lag in [1,2,3,7]:
        feature_cols.append(f'modal_lag_{lag}')

    X = df[feature_cols].astype(float).values
    y = df['modal_price'].astype(float).values

    return X, y, df, encoders, feature_cols
