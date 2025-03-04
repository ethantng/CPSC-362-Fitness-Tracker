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
    /*function getMonthsFromWorkouts() {
        const monthsSet = new Set();
        
        workouts.forEach(workout => {
            const date = new Date(workout.date);
            const monthYear = `${date.getFullYear()}-${date.getMonth()}`;
            monthsSet.add(monthYear);
        });
        
        const months = Array.from(monthsSet).map(monthYear => {
            const [year, month] = monthYear.split('-').map(Number);
            return new Date(year, month, 1);
        });
        
        // Sort months in descending order (newest first)
        months.sort((a, b) => b - a);
        
        return months;
    }
    
    function getWorkoutsForDate(dateString) {
        return workouts.filter(workout => workout.date === dateString);
    }
    
    function countWorkoutsForDate(dateString) {
        return getWorkoutsForDate(dateString).length;
    }
    
    function getIntensityLevel(count) {
        if (count === 0) return 0;
        if (count === 1) return 1;
        if (count === 2) return 2;
        if (count === 3) return 3;
        if (count === 4) return 4;
        return 5;
    }
    
    function showWorkoutDetails(date, dateFormatted) {
        const workoutsForDate = getWorkoutsForDate(date);
        
        if (workoutsForDate.length === 0) {
            workoutDetails.style.display = 'none';
            return;
        }
        
        selectedDateElement.textContent = dateFormatted;
        workoutDetailsList.innerHTML = '';
        
        workoutsForDate.forEach(workout => {
            const li = document.createElement('li');
            li.textContent = `${workout.workoutType}: ${workout.repetitions} x ${workout.sets}`;
            workoutDetailsList.appendChild(li);
        });
        
        workoutDetails.style.display = 'block';
    }
    
    function renderCalendar() {
        if (workouts.length === 0) {
            calendarContainer.innerHTML = '<p class="no-data-message">No workout data available. Add workouts to see your activity calendar.</p>';
            workoutDetails.style.display = 'none';
            return;
        }
        
        const months = getMonthsFromWorkouts();
        calendarContainer.innerHTML = '';
        
        // Add legend
        const legendHTML = `
            <div class="calendar-legend">
                <div class="legend-item">
                    <div class="legend-color" style="background-color: #e0e7ff;"></div>
                    <span>1 workout</span>
                </div>
                <div class="legend-item">
                    <div class="legend-color" style="background-color: #c7d2fe;"></div>
                    <span>2 workouts</span>
                </div>
                <div class="legend-item">
                    <div class="legend-color" style="background-color: #a5b4fc;"></div>
                    <span>3 workouts</span>
                </div>
                <div class="legend-item">
                    <div class="legend-color" style="background-color: #818cf8;"></div>
                    <span>4 workouts</span>
                </div>
                <div class="legend-item">
                    <div class="legend-color" style="background-color: #4a66f5;"></div>
                    <span>5+ workouts</span>
                </div>
            </div>
        `;
        
        months.forEach(month => {
            const monthContainer = document.createElement('div');
            monthContainer.className = 'month-container';
            
            const monthTitle = document.createElement('div');
            monthTitle.className = 'month-title';
            monthTitle.textContent = formatMonthYear(month);
            
            const daysGrid = document.createElement('div');
            daysGrid.className = 'days-grid';
            
            // Calculate the number of days in this month
            const year = month.getFullYear();
            const monthIndex = month.getMonth();
            const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
            
            // Create cells for each day in the month
            for (let day = 1; day <= daysInMonth; day++) {
                const date = new Date(year, monthIndex, day);
                const dateString = date.toISOString().split('T')[0];
                const workoutCount = countWorkoutsForDate(dateString);
                const intensity = getIntensityLevel(workoutCount);
                
                const dayCell = document.createElement('div');
                dayCell.className = `day-cell ${workoutCount > 0 ? 'has-workout intensity-' + intensity : ''}`;
                dayCell.innerHTML = `
                    <div class="day-number">${day}</div>
                    ${workoutCount > 0 ? `<div class="workout-count">${workoutCount}</div>` : ''}
                `;
                
                // Add click event to show workout details
                dayCell.addEventListener('click', () => {
                    const dateFormatted = formatDate(dateString);
                    showWorkoutDetails(dateString, dateFormatted);
                });
                
                daysGrid.appendChild(dayCell);
            }
            
            monthContainer.appendChild(monthTitle);
            monthContainer.appendChild(daysGrid);
            calendarContainer.appendChild(monthContainer);
        });
        
        calendarContainer.innerHTML += legendHTML;
    }*/
    
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