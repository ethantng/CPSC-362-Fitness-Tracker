async function addWorkout() {
    const dateInput = document.getElementById('date').value;
    const workoutsInput = document.getElementById('workouts').value;

    if (!dateInput || !workoutsInput.trim()) {
        alert('Please enter both a date and at least one workout.');
        return;
    }

    const workouts = workoutsInput.split('\n').map(workout => workout.trim()).filter(workout => workout);
    const newEntry = { date: dateInput, workouts: workouts };

    console.log('Sending workout data:', JSON.stringify(newEntry)); // Debugging log

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
        console.log('Workout log response:', result); // Debugging log
        alert(result.message);
        displayWorkoutLog();
    } catch (error) {
        console.error('Error adding workout:', error);
        alert('Failed to add workout. Check console for details.');
    }
}
