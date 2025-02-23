from flask import Flask, render_template, request, jsonify

app = Flask(__name__, static_folder='static', template_folder='templates')

# Temporary workout log stored in memory (will reset when the server restarts)
workout_log = []

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/add_workout", methods=["POST"])
def add_workout():
    data = request.get_json()
    print(f"Received data: {data}")  # Debugging log
    if not data or "date" not in data or "workouts" not in data:
        return jsonify({"message": "Invalid data format"}), 400
    workout_log.append(data)
    return jsonify({"message": "Workout added successfully!", "workoutLog": workout_log})

@app.route("/get_workouts", methods=["GET"])
def get_workouts():
    return jsonify(workout_log)

if __name__ == "__main__":
    app.run(debug=True)
