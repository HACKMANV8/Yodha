import pandas as pd

# Load your main dataset
df = pd.read_csv("synthetic_crop_full_dataset.csv")

# Clean column names (optional but good practice)
df.columns = df.columns.str.strip()

def get_fertilizer_recommendation(crop_name):
    """
    Given a crop name, this function returns its fertilizer recommendation,
    dose, price, and total cost details from the dataset.
    """
    # Filter for the selected crop
    crop_data = df[df['Crop Name'].str.lower() == crop_name.lower()]

    if crop_data.empty:
        return f"❌ No fertilizer data found for '{crop_name}'."

    fertilizers = crop_data.iloc[0]['Recommended Fertilizers']
    dose = crop_data.iloc[0]['Dose_kg_per_ha']
    price = crop_data.iloc[0]['Price_per_kg_INR']
    total_cost = crop_data.iloc[0]['Total_Cost_per_ha_INR']

    return {
        "Crop": crop_name,
        "Recommended Fertilizers": fertilizers,
        "Dose (kg/ha)": dose,
        "Price (₹/kg)": price,
        "Total Cost (₹/ha)": total_cost
    }

# Example: (replace with the crop your model predicts)
example_crop = "Rice"
print(get_fertilizer_recommendation(example_crop))