from flask import Flask, request, jsonify
import joblib
from dotenv import load_dotenv

load_dotenv()

model_directory = os.getenv('Model_Dir')
model_filename = os.getenv('Model_Name')

model_path = os.path.join(model_directory, model_filename)

model = joblib.load(model_path)

app = Flask(__name__)

# Load the model

@app.route('/predict', methods=['POST'])
def predict():
    # Get the data from the POST request
    data = request.json

    input_arr = [[value for key, value in data.items()]] # 2-d better
    # Make prediction using model loaded from disk
    prediction = model.predict(input_arr)

    # Return the prediction as JSON
    return jsonify({'prediction': prediction})

if __name__ == '__main__':
    app.run(debug=True)