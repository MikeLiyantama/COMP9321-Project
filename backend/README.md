# COMP9321-Project Backend

## Endpoints
 - `/api/stats/<string:feature_name>` GET | Getting required data for graph generation
 - `/api/predict` POST | Getting prediction (target) based on user input
    Example payload : `{'sex' : 0, 'age' : 27, .........}`
    Note: all features must be present, for features/column names, see csv in data folder
 - `/api/important_val` GET | Getting important factors / features that influence target and the weights of the them
