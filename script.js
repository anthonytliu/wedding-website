let signaturePad;
let understand = false;
let engage = false;

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
        document.getElementById("submit-btn").style.display = "none";
        document.getElementById("engage-positive-button").classList.remove('selected-yes', 'selected-no');
        document.getElementById("engage-negative-button").classList.remove('selected-yes', 'selected-no');
        engageMessage.style.display = "none";
        confirmationMessage.style.display = "block";
        confirmationMessage.innerText = "Please contact Anthony or Mahal with questions.";
        if (signaturePad) {
            signaturePad.clear();
        }
    }

}

// Handle agreement Yes/No click and show signature
function handleAgreeClick(value) {
    var signatureBox = document.getElementById("signature-box");
    var submitBtn = document.getElementById("submit-btn");
    var engageMessage = document.getElementById("engage-message");
    var confirmationMessage = document.getElementById("confirmation-message");

    if (value === 'yes') {
        signatureBox.style.display = "block"; // Show signature box
        signatureBox.classList.add('show'); // Add class for fade effect
        submitBtn.style.display = "block"; // Show submit button
        // submitBtn.classList.add('show'); // Add class for fade effect
        engage = true;
        engageMessage.style.display = "none";
        if (!signaturePad) {
            const canvas = document.getElementById('signature-pad');
            signaturePad = new SignaturePad(canvas);
        }
        showNextElementAndScroll("signature-box"); // Smoothly scroll to signature box
    } else {
        signatureBox.style.display = "none"; // Hide signature box
        submitBtn.style.display = "none"; // Hide submit button
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

document.getElementById("saveTheDateForm").addEventListener("submit", function (event) {
    event.preventDefault();

    // Show loading spinner
    const spinnerOverlay = document.getElementById('spinnerOverlay');
    spinnerOverlay.classList.add('show');
    document.getElementById("thank-you-message").style.display = "none";
    // Check if the signature pad is filled
    if (signaturePad && !signaturePad.isEmpty()) {
        const name = document.getElementById("name").value;
        const signature = signaturePad.toDataURL("image/png"); // Capture signature as Base64
        const browserInfo = navigator.userAgent; // Get browser info

        // Determine device type based on user agent
        const deviceType = /Mobile|Android|iP(hone|od|ad)/i.test(navigator.userAgent) ? "Mobile" : "Desktop";

        // Capture current date and time
        const dateTimeSubmitted = new Date().toLocaleString(); // Format as "MM/DD/YYYY, HH:MM:SS AM/PM"

        // Ensure all required fields are filled
        if (!understand || !engage) {
            alert("Please complete all fields.");
            return;
        }

        // EmailJS template parameters with additional fields
        const templateParams = {
            from_name: name,
            browser_info: browserInfo,
            device_type: deviceType, // Device type (Mobile or Desktop)
            date_time_submitted: dateTimeSubmitted, // Date and time of submission
            attachments: [
                {
                    filename: "signature.png",
                    path: signature // Base64 string of the signature
                }
            ]
        };

        // Send email with EmailJS, including the additional data
        emailjs.send('service_zj9cs3c', 'template_4hhimvf', templateParams)
        .then(function(response) {
            // Hide loading spinner and show success message
            spinnerOverlay.classList.remove('show');
            document.getElementById("thank-you-message").style.display = "block";
            document.getElementById("thank-you-message").innerText = 'Thank you! Your response has been submitted.';
            signaturePad.clear(); // Clear the signature pad after submission
        }, function(error) {
            console.error('Error:', error);
            alert("There was an issue submitting the form. Please try again.");
            spinnerOverlay.classList.remove('show');
        });
    } else {
        alert("Please sign before submitting.");
        document.getElementById("loading-spinner").style.display = "none"; // Hide spinner if not signed
    }
});


// Clear signature button
document.getElementById("clear-signature").addEventListener("click", function () {
    if (signaturePad) {
        signaturePad.clear();
    }
});

// Function to validate the name input
function validateName() {
    const nameInput = document.getElementById("name");
    const errorMessage = document.getElementById("name-error");

    // Regex for First Middle Last Name (allows multiple middle names and ignores trailing whitespace)
    const nameRegex = /^[A-Za-z]+(?:\s[A-Za-z]+)*\s[A-Za-z]+$/;

    // Trim whitespace from both ends of the input
    const trimmedName = nameInput.value.trim();

    if (!nameRegex.test(trimmedName)) {
        errorMessage.textContent = "Please enter your full name.";
        errorMessage.style.display = "block"; // Show error message
        return false; // Validation failed
    } else {
        errorMessage.style.display = "none"; // Hide error message
        return true; // Validation successful
    }
}

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


// Example of calling validateName on form submission
document.querySelector('form').addEventListener('submit', function (event) {
    if (!validateName()) {
        event.preventDefault(); // Prevent form submission if validation fails
    }
});

// Optional: Validate on input blur
document.getElementById("name").addEventListener('blur', validateName);

