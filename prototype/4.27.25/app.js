document.addEventListener('DOMContentLoaded', function() {
    // Initialize date input with current date if it exists
    const dateInput = document.getElementById('date');
    if (dateInput) {
        /*const today = new Date().toISOString().split('T')[0];
        dateInput.value = today;*/
        const today = new Date();
        
        // Apply timezone offset to ensure we get the correct local date
        const userTimezoneOffset = today.getTimezoneOffset() * 60000;
        const localDate = new Date(today.getTime() - userTimezoneOffset);
        
        // Format as YYYY-MM-DD for the input field
        const localDateString = localDate.toISOString().split('T')[0];
        dateInput.value = localDateString;
    }
    
    // Determine current page from URL
    const currentPage = window.location.pathname.split('/').pop().split('.')[0] || 'index';

    //====================================================================================================

    //Profile section greyed despite being in home page****

    // Update active navigation button based on current page
    const navButtons = document.querySelectorAll('.nav-btn');

    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove "active" class from all nav buttons
            navButtons.forEach(b => b.classList.remove('active'));
    
            // Add "active" class to the clicked button
            btn.classList.add('active');
        });
    });
    
    //====================================================================================================

    // Navigation functionality
    const logo = document.getElementById('logo');
    
    function navigateTo(pageId) {
        let targetUrl;
        
        switch(pageId) {
            case 'home':
                targetUrl = 'index.html';
                break;
            case 'workout-log':
                targetUrl = 'workout-log.html';
                break;
            case 'data':
                targetUrl = 'data.html';
                break;
            case 'profile':
                targetUrl = 'profile.html';
                break;
            default:
                targetUrl = 'index.html';
        }
        
        window.location.href = targetUrl;
    }
    
    navButtons.forEach(button => {
        button.addEventListener('click', function() {
            navigateTo(this.dataset.page);
        });
    });
    
    if (logo) {
        logo.addEventListener('click', function() {
            navigateTo('home');
        });
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('.sidebar-link').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            // Close sidebar on click
            const sidebar = document.querySelector('.sidebar');
            if (sidebar && sidebar.classList.contains('open')) {
                sidebar.classList.remove('open');
            }
            
            // Only do smooth scroll if we're already on the index page
            if (currentPage === 'index' || currentPage === '') {
                e.preventDefault();
                
                const targetId = this.getAttribute('href').split('#')[1];
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    // Get header height for offset
                    const headerHeight = document.querySelector('header').offsetHeight;
                    
                    // Scroll to element with offset for header
                    window.scrollTo({
                        top: targetElement.offsetTop - headerHeight,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Workout log functionality (only initialize if on the workout log page)
    const addWorkoutBtn = document.getElementById('add-workout');
    const logItemsContainer = document.getElementById('log-items');
    const successMessage = document.getElementById('success-message');
    
    // Data visualization functionality (only initialize if on the data page)
    const calendarContainer = document.getElementById('calendar-container');
    const workoutDetails = document.getElementById('workout-details');
    const selectedDateElement = document.getElementById('selected-date');
    const workoutDetailsList = document.getElementById('workout-details-list');
    
    let workouts = JSON.parse(localStorage.getItem('workouts')) || [];
    
    function formatDate(dateString) {
        const date = new Date(dateString + 'T12:00:00');
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    }
    
    function formatMonthYear(date) {
        const options = { year: 'numeric', month: 'long' };
        return date.toLocaleDateString('en-US', options);
    }
    
    function renderWorkouts() {
        if (!logItemsContainer) return; // Not on workout-log page
        
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
                if (calendarContainer) renderCalendar(); // Only if on data page
            });
        });
    }
    
    function saveWorkouts() {
        localStorage.setItem('workouts', JSON.stringify(workouts));
    }
    
    function showSuccessMessage() {
        if (!successMessage) return; // Not on workout-log page
        
        successMessage.classList.add('show');
        setTimeout(() => {
            successMessage.classList.remove('show');
        }, 2000);
    }
    
    // Calendar visualization functionality
    function getMonthsFromWorkouts() {
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
        if (!calendarContainer) return;
    
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
            
            const calendarGrid = document.createElement('div');
            calendarGrid.className = 'calendar-grid';
            
            // Add day labels (Sunday to Saturday)
            const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            dayLabels.forEach(day => {
                const dayLabel = document.createElement('div');
                dayLabel.className = 'day-label';
                dayLabel.textContent = day;
                calendarGrid.appendChild(dayLabel);
            });
            
            // Calculate the first day of the month (0 = Sunday, 1 = Monday, etc.)
            const year = month.getFullYear();
            const monthIndex = month.getMonth();
            const firstDay = new Date(year, monthIndex, 1).getDay();
            const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
            
            // Add empty cells for days before the first day of the month
            for (let i = 0; i < firstDay; i++) {
                const emptyCell = document.createElement('div');
                emptyCell.className = 'day-cell empty';
                calendarGrid.appendChild(emptyCell);
            }
            
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
                
                calendarGrid.appendChild(dayCell);
            }
            
            // Add empty cells to complete the grid (to ensure we have complete weeks)
            const totalCells = firstDay + daysInMonth;
            const rowsNeeded = Math.ceil(totalCells / 7);
            const totalCellsNeeded = rowsNeeded * 7;
            const emptyCellsToAdd = totalCellsNeeded - totalCells;
            
            for (let i = 0; i < emptyCellsToAdd; i++) {
                const emptyCell = document.createElement('div');
                emptyCell.className = 'day-cell empty';
                calendarGrid.appendChild(emptyCell);
            }
            
            monthContainer.appendChild(monthTitle);
            monthContainer.appendChild(calendarGrid);
            calendarContainer.appendChild(monthContainer);
        });
        
        calendarContainer.innerHTML += legendHTML;
    }
    


    // Initialize workout form functionality if on workout-log page
    if (addWorkoutBtn) {
        addWorkoutBtn.addEventListener('click', function() {
            const date = document.getElementById('date').value;
            const workoutType = document.getElementById('workout-type').value;
            const repetitions = document.getElementById('repetitions').value;
            const sets = document.getElementById('sets').value;
            
            if (!date || !workoutType || !repetitions || !sets) {
                alert('Please fill in all fields');
                return;
            }

            const inputDate = new Date(dateInput.value + 'T12:00:00'); // Add noon time to avoid date shift
            const year = inputDate.getFullYear();
            const month = String(inputDate.getMonth() + 1).padStart(2, '0');
            const day = String(inputDate.getDate()).padStart(2, '0');
            const normalizedDateStr = `${year}-${month}-${day}`;
            
            workouts.push({
                date: normalizedDateStr,
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
    }
    
    // Initialize data visualization if on data page
    if (calendarContainer) {
        renderCalendar();
    }
    
    // Initialize workout log if on workout-log page
    if (logItemsContainer) {
        renderWorkouts();
    }

// ------------------------
// SIDEBAR FUNCTIONALITY
// ------------------------
    const toggleBtn = document.getElementById('toggleSidebar');
    const sidebar = document.querySelector('.sidebar');
    const sidebarNavButtons = document.querySelectorAll('.sidebar .nav-btn');
    
    // Toggle sidebar visibility
    if (toggleBtn && sidebar) {
        toggleBtn.addEventListener('click', function() {
            sidebar.classList.toggle('open');
            this.classList.toggle('open');
        });
    }
    
    // Navigation through sidebar buttons
    sidebarNavButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetPage = this.getAttribute('data-page');
            
            // Navigate to the selected page
            navigateTo(targetPage);
            
            // Close sidebar after navigation on mobile
            if (window.innerWidth <= 768 && sidebar) {
                sidebar.classList.remove('open');
            }
        });
    });
    
    // Close sidebar when clicking outside
    if (sidebar) {
        document.addEventListener('click', function(event) {
            if (!sidebar.contains(event.target) && 
                event.target !== toggleBtn && 
                sidebar.classList.contains('open')) {
                sidebar.classList.remove('open');
            }
        });
    }
    
    // Handle escape key to close sidebar
    if (sidebar) {
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape' && sidebar.classList.contains('open')) {
                sidebar.classList.remove('open');
            }
        });
    }
});