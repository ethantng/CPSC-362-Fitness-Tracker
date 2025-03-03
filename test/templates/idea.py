import datetime

workout_log = []

def add_workout():
    date_workout = input("Enter the date of hte workout (YYYY-MM-DD): ")
    try:
        date = datetime.datetime.strptime(date_workout, "%Y-%m-%d").date()
    except ValueError:
        print("Please enter a valid date (YYYY-MM-DD).")
        return

    print("Enter your workouts one at a time. Press Enter twice to finish.")
    
    workouts = []
    while True:
        workout = input("Workout: ")
        if workout == "":  # If the user presses Enter twice
            break
        workouts.append(workout)

    if workouts:
        workout_log.append({"date": date, "workouts": workouts})
        print("Workout logged successfully!\n")
    else:
        print("No workouts entered. Entry discarded.\n")

def display_workouts():
    if not workout_log:
        print("No workouts logged yet.")
        return

    print("\nWorkout Log:")
    for entry in sorted(workout_log, key=lambda x: x['date']):
        print(f"Date: {entry['date']}")
        for i, workout in enumerate(entry['workouts'], start=1):
            print(f"  {i}. {workout}")
        print("-" * 30)    
    
def main():
    print("Welcome to the Workout Logger!")
    while True:
        print("\nMenu:")
        print("1. Add a workout")
        print("2. View workout log")
        print("3. Exit")
        choice = input("Choose an option (1-3): ")

        if choice == '1':
            add_workout()
        elif choice == '2':
            display_workouts()
        elif choice == '3':
            print("Exiting Workout Logger. Stay strong!")
            break
        else:
            print("Invalid choice. Please try again.")

if __name__ == "__main__":
    main()    