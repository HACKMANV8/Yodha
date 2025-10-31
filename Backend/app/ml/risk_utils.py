def calculate_risk_score(yield_uncertainty: float, price_volatility: float, climate_risk: float) -> tuple[float, str]:
    """Calculate overall risk score and category"""
    risk_score = (yield_uncertainty * 0.4) + (price_volatility * 0.3) + (climate_risk * 0.3)
    
    if risk_score < 0.3:
        category = "Low Risk"
    elif risk_score < 0.6:
        category = "Moderate Risk"
    else:
        category = "High Risk"
    
    return risk_score, category