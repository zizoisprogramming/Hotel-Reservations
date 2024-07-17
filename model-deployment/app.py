from flask import Flask, request, jsonify, render_template
import joblib
from dotenv import load_dotenv
import os
from datetime import datetime
import numpy as np


print(load_dotenv())

model_directory = os.getenv('Model_Dir')
model_filename = os.getenv('Model_Name')

model_path = os.path.join(model_directory, model_filename)

# Load the model
model = joblib.load(model_path)
app = Flask(__name__)

@app.route('/')
def index():
    return render_template('gui.html')

@app.route('/predict', methods=['POST'])
def process():
    print("Received request:", request.json)  # Debug print
    # Get the data from the request
    data = request.json
    try:
        room_types = ['Room Type 1', 'Room Type 2', 'Room Type 3', 'Room Type 4', 'Room Type 5', 'Room Type 6', 'Room Type 7']
        meal_types = ['Meal Plan 1','Meal Plan 2','Meal Plan 3','Not Selected' ]
        market_types = ['Aviation','Complementary','Corporate','Offline','Online']
        
        
        request_list = []
        request_list.append(1 if data['repeated'] else 0)
        request_list.append(1 if data['car parking space'] else 0)
        request_list.extend([1 if room_type == data['room type'] else 0 for room_type in room_types])
        request_list.extend([1 if meal_type == data['type of meal'] else 0 for meal_type in meal_types])
        request_list.extend([1 if market_type == data['market segment'] else 0 for market_type in market_types])
        request_list.extend([int(data['lead time']), int(data['p-not-c']), 
                             int(data['average price']), int(data['special requests']), 
                             int(data['num adults']), int(data['num children']),int(data['num adults'])
                             + int(data['num children']), int(data['num weekend']), int(data['num week'])
                             ,int(data['num weekend']) + int(data['num week'])])

        date_obj = datetime.strptime(data['date'], '%Y-%m-%d')
        request_list.append(date_obj.year)
        request_list.append(date_obj.month)
        
        request_array = np.array([request_list])
        prediction = int(model.predict(request_array)[0])
        if prediction == 0:
            result_str = "Cancelled"
        else:
            result_str = "Not Cancelled"
        # Your prediction logic here
        result = {"prediction": result_str}  # Replace with actual prediction
        return jsonify(result)
    except Exception as e:
        print("Error:", str(e))  # Debug print
        return jsonify({"error": str(e)}), 400


if __name__ == '__main__':
    app.run(debug=True)