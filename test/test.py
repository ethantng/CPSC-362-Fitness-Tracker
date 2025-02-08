from flask import Flask, request, jsonify

app = Flask(__name__)
workouts = []

@app.route('/add_workout', methods=['POST'])
def add_workout():
    data = request.json
    workouts.append(data)
    return jsonify({"message": "Workout logged successfully!"})

@app.route('/get_workouts', methods=['GET'])
def get_workouts():
    return jsonify(workouts)

if __name__ == '__main__':
    app.run(debug=True)
