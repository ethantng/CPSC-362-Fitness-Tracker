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

function addWorkout() {
    const date = document.getElementById('date').value;
    const workoutType = document.getElementById('workoutType').value;
    const repetitions = document.getElementById('repetitions').value;
    const setCount = document.getElementById('setCount').value;
    const workoutLog = document.getElementById('workoutLog');

    if (!date) {
        alert("Please select a date.");
        return;
    }

    // Create new log entry
    const listItem = document.createElement('li');
    listItem.style.display = "flex";
    listItem.style.justifyContent = "space-between";
    listItem.style.alignItems = "center";
    listItem.style.padding = "10px";
    listItem.style.border = "1px solid #ccc";
    listItem.style.borderRadius = "5px";
    listItem.style.margin = "5px 0";
    listItem.style.background = "#f9f9f9";

    const workoutText = document.createElement('span');
    workoutText.textContent = `${date} - ${workoutType}: ${repetitions} x ${setCount}`;

    // Remove button (-)
    const removeBtn = document.createElement('button');
    removeBtn.textContent = "❌";
    removeBtn.style.marginRight = "10px";
    removeBtn.style.background = "red";
    removeBtn.style.color = "white";
    removeBtn.style.border = "none";
    removeBtn.style.padding = "5px 10px";
    removeBtn.style.cursor = "pointer";
    removeBtn.style.borderRadius = "5px";
    removeBtn.onclick = function () {
        listItem.remove();
        if (workoutLog.children.length === 0) {
            workoutLog.innerHTML = "No workouts logged yet.";
        }
    };

    // Append elements to list item
    listItem.appendChild(removeBtn);
    listItem.appendChild(workoutText);

    // Append to log
    if (workoutLog.textContent === "No workouts logged yet.") {
        workoutLog.innerHTML = ''; // Clear placeholder text
    }
    workoutLog.appendChild(listItem);
}
