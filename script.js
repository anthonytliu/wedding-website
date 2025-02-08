let signaturePad;
let understand = false;
let engage = false;
const pageLoadStartTime = Date.now();

// Show/Hide tab content
function openTab(tabName) {
    var tabcontent = document.getElementsByClassName("tabcontent");
    for (var i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none"; // Hide all tab content
    }
    var tablinks = document.getElementsByClassName("tablink");
    for (var i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(tabName).style.display = "flex";
    //todo: add transition when clicking a tab to fade in and out
}

function handleAgreement(value) {
    const saveTheDateForm = document.getElementById("saveTheDateForm");
    const noMessage = document.getElementById("no-message");

    if (value === 'yes') {
        // toggleSelection(this, 'yes')
        saveTheDateForm.style.display = "block"; // Show the form if they agree
        noMessage.style.display = "none"; // Hide the no message
        showNextElementAndScroll("understand-statement")
    } else if (value === 'no') {
        // toggleSelection(this, 'no')
        saveTheDateForm.style.display = "none"; // Hide the form if they don't agree
        noMessage.style.display = "block"; // Show the no message
    }
}


// Handling Yes/No selection and showing the next question
function handleUnderstandClick(value) {
    var followUp = document.getElementById("follow-up");
    var confirmationMessage = document.getElementById("confirmation-message");
    var engageMessage = document.getElementById("engage-message");

    if (value === 'yes') {
        followUp.style.display = "block"; // Show follow-up
        followUp.classList.add('show'); // Add class for fade effect
        confirmationMessage.style.display = "none";
        showNextElementAndScroll("follow-up"); // Smoothly scroll to the follow-up question
        understand = true;
    } else {
        followUp.style.display = "none"; // Hide follow-up
        document.getElementById("signature-box").style.display = "none";
        document.getElementById("engage-positive-button").classList.remove('selected-yes', 'selected-no');
        document.getElementById("engage-negative-button").classList.remove('selected-yes', 'selected-no');
        engageMessage.style.display = "none";
        confirmationMessage.style.display = "block";
        confirmationMessage.innerText = "Thank you for your honesty. Feel free to contact us with any questions.";
        if (signaturePad) {
            signaturePad.clear();
        }
    }

}

function handleAgreeClick(value) {
    var signatureBox = document.getElementById("signature-box");
    var submitBtn = document.getElementById("submit-btn");
    var engageMessage = document.getElementById("engage-message");
    var confirmationMessage = document.getElementById("confirmation-message");

    if (value === 'yes') {
        signatureBox.style.display = "block"; // Show signature box
        signatureBox.classList.add('show'); // Add class for fade effect
        submitBtn.style.display = "block"; // Show submit button
        engage = true;
        engageMessage.style.display = "none";
        if (!signaturePad) {
            const canvas = document.getElementById('signature-pad');
            signaturePad = new SignaturePad(canvas);

            // Resize canvas for high-DPI screens (e.g., Retina displays)
            function resizeCanvas() {
                const ratio = Math.max(window.devicePixelRatio || 1, 1);
                canvas.width = canvas.offsetWidth * ratio;
                canvas.height = canvas.offsetHeight * ratio;
                canvas.getContext('2d').scale(ratio, ratio);
            }

            // Adjust touch coordinates
            function getCanvasCoordinates(event) {
                const rect = canvas.getBoundingClientRect();
                const touch = event.touches[0]; // Get the first touch point
                return {
                    x: (touch.clientX - rect.left) * (canvas.width / rect.width),
                    y: (touch.clientY - rect.top) * (canvas.height / rect.height),
                };
            }

            // Resize canvas on load and window resize
            window.addEventListener('resize', resizeCanvas);
            resizeCanvas(); // Call on initialization
        }
        showNextElementAndScroll("signature-box"); // Smoothly scroll to signature box
    } else {
        signatureBox.style.display = "none"; // Hide signature box
        confirmationMessage.style.display = "none";
        engageMessage.style.display = "block";
        engageMessage.innerText = "Totally fine! We'd love to take you out to dinner on us sometime. Please click submit so we know not to send an invitation + questionnaire your way."
        if (signaturePad) {
            signaturePad.clear();
        }
    }
}

// Handle button clicks for Yes/No selection
function toggleSelection(button, type) {
    var buttons = button.parentNode.getElementsByClassName('option-button');
    for (var i = 0; i < buttons.length; i++) {
        buttons[i].classList.remove('selected-yes', 'selected-no');
    }

    if (type === 'yes') {
        button.classList.add('selected-yes');
    } else {
        button.classList.add('selected-no');
    }
}


document.addEventListener("DOMContentLoaded", function() {
    // Check if the current HTML file is not faq.html
    if (window.location.pathname.indexOf('faq.html') === -1) {
        document.getElementById("saveTheDateForm").addEventListener("submit", function (event) {
            event.preventDefault();

    // Show loading spinner
    const spinnerOverlay = document.getElementById('spinnerOverlay');
    spinnerOverlay.classList.add('show');
    document.getElementById("thank-you-message").style.display = "none";
    const browserInfo = navigator.userAgent; // Get browser info
    const deviceType = /Mobile|Android|iP(hone|od|ad)/i.test(navigator.userAgent) ? "Mobile" : "Desktop";
    const dateTimeSubmitted = new Date().toLocaleString(); // Format as "MM/DD/YYYY, HH:MM:SS AM/PM"
    const elapsedTime = Math.round((Date.now() - pageLoadStartTime) / 1000); // Time in seconds

    const submitButton = document.querySelector('#saveTheDateForm button[type="submit"]');
    submitButton.disabled = true; // Disable the submit button to prevent multiple submissions

    if (areAllErrorsEmpty()) { // Use parentheses to invoke the function
        // const deviceInfo = getDeviceInfo();
        // const ipGeoData = getIPAndGeolocation();
        // const timestamp = new Date().toISOString();
        const nameInput = document.getElementById('name-input');
        const questionInput = document.getElementById('question-box');
        const questionAnswerBox = document.getElementById('question-answer-box');
        const fact1Input = document.getElementById('fact-1');
        const fact2Input = document.getElementById('fact-2');
        const fact3Input = document.getElementById('fact-3');
        const recipeInput = document.getElementById('recipe-box');
        const loveFeelingTextbox = document.getElementById('love-feeling-box');
        const loveMostTextbox = document.getElementById('love-most-box');
        const songMovieInput = document.getElementById('song-movie-box');
        const wisdomInput = document.getElementById('wisdom-box');
        const weddingQuestionsBox = document.getElementById('wedding-questions-box');

        const templateParams = {
            // device: deviceInfo,
            // ip: ipGeoData.ip,
            // city: ipGeoData.city,
            // region: ipGeoData.region,
            // country: ipGeoData.country,
            // latitude: ipGeoData.latitude,
            // longitude: ipGeoData.longitude,
            // timestamp: timestamp,
            from_name: nameInput.value,
            invitation_status: `ACCEPTED`,
            browser_info: browserInfo,
            device_type: deviceType,
            date_time_submitted: dateTimeSubmitted,
            time_elapsed: `${elapsedTime} seconds`,
            question_input: questionInput.value,
            question_answer_input: questionAnswerBox.value,
            fact_1: fact1Input.value,
            fact_2: fact2Input.value,
            fact_3: fact3Input.value,
            recipe_input: recipeInput.value,
            love_feeling_input: loveFeelingTextbox.value,
            love_most_input: loveMostTextbox.value,
            song_movie_input: songMovieInput.value,
            wisdom_input: wisdomInput.value,
            wedding_questions_input: weddingQuestionsBox.value
        };

        // Send email with EmailJS, including the additional data
        emailjs.send('service_zj9cs3c', 'template_4hhimvf', templateParams)
            .then(function (response) {
                // Hide loading spinner and show success message
                spinnerOverlay.classList.remove('show');
                document.getElementById("thank-you-message").style.display = "block";
                document.getElementById("thank-you-message").innerText = 'Thank you! Your response has been submitted.';
                // Scroll to the bottom of the page
                window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
                submitButton.disabled = false; // Re-enable the submit button
            }, function (error) {
                console.error('Error:', error);
                alert("There was an issue submitting the form. Please try again.");
                spinnerOverlay.classList.remove('show');
                submitButton.disabled = false; // Re-enable the submit button
            });
    } else {
        spinnerOverlay.classList.remove('show');
        submitButton.disabled = false; // Re-enable the submit button
        scrollToFirstError(); // Scroll to the first error message
    }
});
}});

// Collect all error message spans
const errorMessages = document.querySelectorAll('.error-message');

// Function to check if all errors are empty
function areAllErrorsEmpty() {
    const errorMessages = document.querySelectorAll('.error-message');
    for (const error of errorMessages) {
        if (error.textContent.trim() !== '') {
            return false; // Found an error message
        }
    }
    return true; // All errors are empty
}

function scrollToFirstError() {
    const errorMessages = document.querySelectorAll('.error-message');
    for (const error of errorMessages) {
        if (error.textContent.trim() !== '') {
            error.scrollIntoView({ behavior: 'smooth', block: 'center' });
            break;
        }
    }
}


// Example usage: Check when a button is clicked
const submitButton = document.getElementById('submit-button'); // Replace with your button's ID
submitButton.addEventListener('click', (event) => {
    if (!areAllErrorsEmpty()) {
        event.preventDefault(); // Prevent form submission
        alert('Please fix all errors before submitting the form.');
    } else {
        alert('Form submitted successfully!');
    }
});

// Function to show the next content and smooth scroll to it
function showNextElementAndScroll(nextElementId) {
    const nextElement = document.getElementById(nextElementId);

    if (nextElement) {
        nextElement.style.display = "block"; // Show the next element

        // Smoothly scroll to the next element
        nextElement.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });
    }
}

function validateFact(factId, errorId) {
    const fact = document.getElementById(factId);
    const error = document.getElementById(errorId);

    if (fact.value.trim() === "") {
        error.classList.add('show');
        error.textContent = "Please type a fun fact"; // Error message
    } else {
        error.classList.remove('show');
        error.textContent = ""; // Clear error message if valid
    }
}

// Event listeners to validate on blur (when the user clicks away)
document.getElementById('fact-1').addEventListener('blur', () => validateFact('fact-1', 'fact-1-error'));
document.getElementById('fact-2').addEventListener('blur', () => validateFact('fact-2', 'fact-2-error'));
document.getElementById('fact-3').addEventListener('blur', () => validateFact('fact-3', 'fact-3-error'));
