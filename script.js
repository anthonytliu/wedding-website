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
    // Check if the signature pad is filled
    if (!validateName) {
        return;
    } else if (document.getElementById("signature-box").style.display === 'block') {
        if (signaturePad && !signaturePad.isEmpty()) {
            const name = document.getElementById("name").value;
            const signature = signaturePad.toDataURL("image/png"); // Capture signature as Base64

            // Ensure all required fields are filled
            if (!understand || !engage) {
                alert("Please complete all fields.");
                return;
            }

            // EmailJS template parameters with additional fields
            const templateParams = {
                from_name: name,
                invitation_status: `ACCEPTED`,
                browser_info: browserInfo,
                device_type: deviceType, // Device type (Mobile or Desktop)
                date_time_submitted: dateTimeSubmitted, // Date and time of submission
                time_elapsed: `${elapsedTime} seconds`, // Time taken to complete the page
                signature_image: "cid:signature_image" // Use cid for inline attachment
            };

            // Prepare attachment (signature image as a Base64 string)
            const attachments = [
                {
                    filename: "signature.png",
                    content: signature, // Remove the Base64 prefix
                    cid: "signature_image" // Use the same CID as in the template
                }
            ];

            // Send email with EmailJS, including the additional data
            emailjs.send('service_zj9cs3c', 'template_4hhimvf', templateParams, {
                attachments: attachments
            })
                .then(function (response) {
                    // Hide loading spinner and show success message
                    spinnerOverlay.classList.remove('show');
                    document.getElementById("thank-you-message").style.display = "block";
                    document.getElementById("thank-you-message").innerText = 'Thank you! Your response has been submitted.';
                     // Scroll to the bottom of the page
                     window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
                }, function (error) {
                    console.error('Error:', error);
                    alert("There was an issue submitting the form. Please try again.");
                    spinnerOverlay.classList.remove('show');
                });
        } else {
            alert("Please sign before submitting.");
            document.getElementById("loading-spinner").style.display = "none"; // Hide spinner if not signed
        }
    } else {
        const name = document.getElementById("name").value;
        // EmailJS template parameters with additional fields
        const templateParams = {
            from_name: name,
            invitation_status: `DECLINED`,
            browser_info: browserInfo,
            device_type: deviceType, // Device type (Mobile or Desktop)
            date_time_submitted: dateTimeSubmitted, // Date and time of submission
            time_elapsed: `${elapsedTime} seconds`, // Time taken to complete the page
        };
        emailjs.send('service_zj9cs3c', 'template_4hhimvf', templateParams)
            .then(function (response) {
                // Hide loading spinner and show success message
                spinnerOverlay.classList.remove('show');
                document.getElementById("thank-you-message").style.display = "block";
                document.getElementById("thank-you-message").innerText = 'Thank you! Your response has been submitted.';
                 // Scroll to the bottom of the page
                 window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
            }, function (error) {
                console.error('Error:', error);
                alert("There was an issue submitting the form. Please try again.");
                spinnerOverlay.classList.remove('show');
            });
        return;
    }
});


// Clear signature button
document.getElementById("clear-signature").addEventListener("click", function () {
    if (signaturePad) {
        signaturePad.clear();
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
