// app.js - Frontend JavaScript with Debugging and Fixes

document.addEventListener("DOMContentLoaded", displayWorkoutLog);

function addWorkout() {
    const date = document.getElementById("date").value;
    const workoutType = document.getElementById("workoutType").value;
    const repetitions = document.getElementById("repetitions").value;

    if (!date) {
        alert("Please select a date.");
        return;
    }

    const workoutEntry = `${workoutType} - ${repetitions} reps`;

    fetch("/add_workout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date, workout: workoutEntry })
    })
    .then(response => response.json())
    .then(data => {
        console.log("Workout added:", data);
        displayWorkoutLog(); // Refresh log
    })
    .catch(error => console.error("Error adding workout:", error));
}

function displayWorkoutLog() {
    fetch("/get_workouts")
        .then(response => response.json())
        .then(workoutLog => {
            console.log("Fetched workout log:", workoutLog);
            const workoutLogList = document.getElementById("workoutLog");
            workoutLogList.innerHTML = "";

            if (workoutLog.length === 0) {
                workoutLogList.innerHTML = "<p>No workouts logged yet.</p>";
                return;
            }

            workoutLog.forEach((entry, index) => {
                const listItem = document.createElement("li");
                listItem.classList.add("log-entry");

                const text = document.createElement("input");
                text.type = "text";
                text.value = `${entry.date}: ${entry.workout}`;
                text.classList.add("editable");

                const editButton = document.createElement("button");
                editButton.textContent = "Edit";
                editButton.onclick = () => editWorkout(index, text.value);

                const deleteButton = document.createElement("button");
                deleteButton.textContent = "Delete";
                deleteButton.onclick = () => deleteWorkout(index);

                listItem.appendChild(text);
                listItem.appendChild(editButton);
                listItem.appendChild(deleteButton);
                workoutLogList.appendChild(listItem);
            });
        })
        .catch(error => console.error("Error fetching logs:", error));
}

function editWorkout(index, updatedText) {
    fetch("/edit_workout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ index, updatedText })
    })
    .then(() => displayWorkoutLog())
    .catch(error => console.error("Error editing:", error));
}

function deleteWorkout(index) {
    fetch("/delete_workout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ index })
    })
    .then(() => displayWorkoutLog())
    .catch(error => console.error("Error deleting:", error));
}
