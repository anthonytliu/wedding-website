document.getElementById("allergy-form").addEventListener("submit", function (event) {
    event.preventDefault();

    const dateTimeSubmitted = new Date().toLocaleString(); // Format as "MM/DD/YYYY, HH:MM:SS AM/PM"
    const nameInput = document.getElementById('name-input-faq');
    const allergyInput = document.getElementById('allergy-input');
    console.log("Name:", nameInput.value);
    console.log("Allergy:", allergyInput.value);

    const templateParams = {
        name: nameInput.value,
        timestamp: dateTimeSubmitted,
        allergy: allergyInput.value
    };

    // Send email with EmailJS, including the additional data
    emailjs.send('service_zj9cs3c', 'template_pkid75p', templateParams)
        .then(function () {            
            document.getElementById("thank-you-message-faq").style.display = "block";
            document.getElementById("thank-you-message-faq").innerText = 'Thank you! Your response has been submitted.';
        }, function (error) {
            console.error('Error:', error);
            alert("There was an issue submitting your allergy. Please try again.");
        });
});