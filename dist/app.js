"use strict";
document.addEventListener('DOMContentLoaded', () => {
    const displayStreaks = async () => {
        try {
            const response = await fetch('http://localhost:3000/streaks');
            if (!response.ok) {
                throw new Error('Failed to fetch streaks');
            }
            const streaks = await response.json();
            // Clear previous streaks displayed on the dashboard
            const streaksContainer = document.getElementById('streaksContainer');
            streaksContainer.innerHTML = '';
            // Loop through fetched streaks and create HTML elements to represent each streak
            streaks.forEach((streak) => {
                const streakElement = document.createElement('div');
                streakElement.classList.add('streak');
                streakElement.id = `streak-${streak.id}`;
                streakElement.innerHTML = `
                    <h3>${streak.streakName}</h3>
                    
                    <p>${streak.description}</p>
                    <p>Start Date: ${streak.startDate}</p>
                    <p>Day Count: ${streak.dayCount}</p>
                    <button class="btn" onclick="deleteStreak(${streak.id})">Delete</button>
                `;
                streaksContainer.appendChild(streakElement);
            });
        }
        catch (error) {
            console.error('Error:', error);
        }
    };
    // Function to delete a streak
    // (window as any).deleteStreak = (streakId: number) => {
    //     fetch(`http://localhost:3000/streaks/${streakId}`, {
    //         method: 'DELETE'
    //     })
    //     .then(response => {
    //         if (!response.ok) {
    //             throw new Error('Failed to delete streak');
    //         }
    //         // Remove the streak element from the DOM
    //         const streakElement = document.getElementById(`streak-${streakId}`);
    //         if (streakElement) {
    //             streakElement.remove();
    //         }
    //     }
    async function deleteStreak(streakId) {
        try {
            const response = await fetch(`http://localhost:3000/streaks/${streakId}`, {
                method: 'DELETE'
            });
            if (!response.ok) {
                throw new Error('Failed to delete streak');
            }
            // Remove the streak element from the DOM
            const streakElement = document.getElementById(`streak-${streakId}`);
            if (streakElement) {
                streakElement.remove();
            }
        }
        catch (error) {
            console.error('Error:', error);
        }
    }
    // Call displayStreaks when the page loads to fetch and display the streaks
    displayStreaks();
    // HTML elements references
    const addStreakBtn = document.getElementById('addStreakBtn');
    const streakFormPopup = document.getElementById('streakFormPopup');
    const closeFormBtn = document.getElementById('closeFormBtn');
    const formContainer = document.getElementById('form-container');
    // Show the form popup when "Add Streak" button is clicked
    addStreakBtn.addEventListener('click', () => {
        streakFormPopup.style.display = 'block';
    });
    // Hide the form popup when "Close" button is clicked
    closeFormBtn.addEventListener('click', () => {
        streakFormPopup.style.display = 'none';
    });
    // Handle form submission
    formContainer.addEventListener('submit', (event) => {
        event.preventDefault(); // Prevent default form submission
        // Get form data
        const streakName = formContainer.querySelector('input[name="streakName"]').value;
        const description = formContainer.querySelector('input[name="description"]').value;
        const startDate = formContainer.querySelector('input[name="startDate"]').value;
        console.log('Streak Name:', streakName);
        console.log('Description:', description);
        console.log('Start Date:', startDate);
        // Calculate the count of days from start date to today
        const start = new Date(startDate);
        const today = new Date();
        const timeDiff = Math.abs(today.getTime() - start.getTime());
        const dayCount = Math.ceil(timeDiff / (1000 * 3600 * 24)); // Convert milliseconds to days
        // Construct new streak object
        const newStreak = {
            streakName: streakName,
            description: description,
            startDate: startDate,
            dayCount: dayCount
        };
        // Send form data to backend using fetch API
        fetch('http://localhost:3000/streaks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newStreak)
        })
            .then(response => {
            if (!response.ok) {
                throw new Error('Failed to add streak');
            }
            return response.json();
        })
            .then(data => {
            console.log('Streak added successfully:', data);
            // Reset the form
            formContainer.reset();
            // Close the form popup
            streakFormPopup.style.display = 'none';
            // Refresh the displayed streaks after adding a new streak
            displayStreaks();
        })
            .catch(error => {
            console.error('Error:', error);
        });
    });
    // function displayStreaks() {
    //     throw new Error("Function not implemented.");
    // }
});
