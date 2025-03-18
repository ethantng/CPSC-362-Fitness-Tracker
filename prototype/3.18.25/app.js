document.addEventListener('DOMContentLoaded', function() {
    // Initialize date input with current date if it exists
    const dateInput = document.getElementById('date');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.value = today;
    }
    
    // Determine current page from URL
    const currentPage = window.location.pathname.split('/').pop().split('.')[0] || 'index';
    
    // Update active navigation button based on current page
    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(btn => {
        const targetPage = btn.dataset.page;
        if ((currentPage === 'index' && targetPage === 'home') || 
            (currentPage === targetPage)) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

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
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
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
    
    // Calendar visualization functionality (placeholder)
    function renderCalendar() {
        if (!calendarContainer) return; // Not on data page
        
        // Calendar rendering logic would go here
        calendarContainer.innerHTML = '<p>Calendar visualization coming soon</p>';
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