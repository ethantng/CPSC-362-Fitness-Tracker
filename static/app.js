async function addWorkout() {
    const dateInput = document.getElementById('date').value;
    const workoutsInput = document.getElementById('workouts').value;

    if (!dateInput || !workoutsInput.trim()) {
        alert('Please enter both a date and at least one workout.');
        return;
    }

    const workouts = workoutsInput.split('\n').map(workout => workout.trim()).filter(workout => workout);
    const newEntry = { date: dateInput, workouts: workouts };

    console.log('Sending workout data:', JSON.stringify(newEntry)); 

    try {
        const response = await fetch('/add_workout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newEntry)
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const result = await response.json();
        console.log('Workout log response:', result); 
        alert(result.message);
        displayWorkoutLog();
    } catch (error) {
        console.error('Error adding workout:', error);
        alert('Failed to add workout. Check console for details.');
    }
}

async function displayWorkoutLog() {
    try {
        const response = await fetch('/get_workouts');
        if (!response.ok) {
            throw new Error('Failed to fetch workout log');
        }

        const workoutLog = await response.json();
        const workoutLogDiv = document.getElementById('workoutLog');

        if (workoutLog.length === 0) {
            workoutLogDiv.innerHTML = '<p>No workouts logged yet.</p>';
            return;
        }

        // Sort workouts by date (most recent first, FILO)
        workoutLog.sort((a, b) => new Date(b.date) - new Date(a.date));

        const logHTML = workoutLog.map(entry => `
            <div class="log-entry">
                <strong>Date: ${entry.date}</strong>
                <ul>
                    ${entry.workouts.map(workout => `<li>${workout}</li>`).join('')}
                </ul>
            </div>
        `).join('');

        workoutLogDiv.innerHTML = logHTML;
    } catch (error) {
        console.error('Error fetching workout log:', error);
        document.getElementById('workoutLog').innerHTML = '<p>Error loading workout log.</p>';
    }
}

// Load workout log ONLY when HTML page is finished loading
document.addEventListener('DOMContentLoaded', displayWorkoutLog);

