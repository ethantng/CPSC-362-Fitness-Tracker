document.addEventListener('DOMContentLoaded', function() {
    // Initialize date input with current date
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('date').value = today;
    
    // Navigation functionality
    const navButtons = document.querySelectorAll('.nav-btn');
    const pages = document.querySelectorAll('.page');
    const logo = document.getElementById('logo');
    
    function navigateTo(pageId) {
        // Hide all pages
        pages.forEach(page => {
            page.classList.remove('active');
        });
        
        // Show selected page
        document.getElementById(pageId).classList.add('active');
        
        // Update active nav button
        navButtons.forEach(btn => {
            if (btn.dataset.page === pageId) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
        
        // If navigating to data page, render calendar
        if (pageId === 'data') {
            renderCalendar();
        }
    }
    
    navButtons.forEach(button => {
        button.addEventListener('click', function() {
            navigateTo(this.dataset.page);
        });
    });
    
    logo.addEventListener('click', function() {
        navigateTo('home');
    });
    
    // Workout log functionality
    const addWorkoutBtn = document.getElementById('add-workout');
    const logItemsContainer = document.getElementById('log-items');
    const successMessage = document.getElementById('success-message');
    const calendarContainer = document.getElementById('calendar-container');
    const workoutDetails = document.getElementById('workout-details');
    const selectedDateElement = document.getElementById('selected-date');
    const workoutDetailsList = document.getElementById('workout-details-list');
    
    let workouts = JSON.parse(localStorage.getItem('workouts')) || [];
    
    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    }
    
    function formatMonthYear(date) {
        const options = { year: 'numeric', month: 'long' };
        return date.toLocaleDateString('en-US', options);
    }
    
    function renderWorkouts() {
        if (workouts.length === 0) {
            logItemsContainer.innerHTML = '<div class="empty-log">No workouts logged yet. Add your first workout above!</div>';
            return;
        }
        
        // Sort workouts by date (newest first)
        workouts.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        logItemsContainer.innerHTML = '';
        workouts.forEach((workout, index) => {
            const logItem = document.createElement('div');
            logItem.className = 'log-item';
            logItem.innerHTML = `
                <div>${formatDate(workout.date)} - ${workout.workoutType}: ${workout.repetitions} x ${workout.sets}</div>
                <button class="remove-btn" data-index="${index}">Remove</button>
            `;
            logItemsContainer.appendChild(logItem);
        });
        
        // Add event listeners to remove buttons
        document.querySelectorAll('.remove-btn').forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(this.dataset.index);
                workouts.splice(index, 1);
                saveWorkouts();
                renderWorkouts();
                renderCalendar();
            });
        });
    }
    
    function saveWorkouts() {
        localStorage.setItem('workouts', JSON.stringify(workouts));
    }
    
    function showSuccessMessage() {
        successMessage.classList.add('show');
        setTimeout(() => {
            successMessage.classList.remove('show');
        }, 2000);
    }
    
    // Calendar visualization functionality
    
    
    addWorkoutBtn.addEventListener('click', function() {
        const date = document.getElementById('date').value;
        const workoutType = document.getElementById('workout-type').value;
        const repetitions = document.getElementById('repetitions').value;
        const sets = document.getElementById('sets').value;
        
        if (!date || !workoutType || !repetitions || !sets) {
            alert('Please fill in all fields');
            return;
        }
        
        workouts.push({
            date,
            workoutType,
            repetitions,
            sets
        });
        
        saveWorkouts();
        renderWorkouts();
        
        // Only reset the workout type, keep other fields
        document.getElementById('workout-type').value = '';
        // Show success message
        showSuccessMessage();
    });
    
    // Initialize workout log
    renderWorkouts();
});
