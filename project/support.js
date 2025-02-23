//navbar
document.addEventListener("DOMContentLoaded", function () {
    const authButton = document.getElementById("authButton");
    let isLoggedIn = false; // Simulating login state
    
    authButton.addEventListener("click", function () {
        if (!isLoggedIn) {
            // Simulate login
            isLoggedIn = true;
            authButton.textContent = "Logout";
        } else {
            isLoggedIn = false;
            authButton.textContent = "Login";
        }
    });

    const rechargeLink = document.getElementById("rechargeDropdown");
    rechargeLink.addEventListener("click", function (event) {
        if (isLoggedIn) {
            window.location.href = "dashboard.html";
        }
    });
});

// Accordion Animation
document.querySelectorAll(".accordion-button").forEach(button => {
    button.addEventListener("click", function () {
        this.classList.toggle("collapsed");
    });
});

// Contact Form Submission with Toast Notification
document.addEventListener("DOMContentLoaded", function () {
    let toastEl = document.getElementById("successToast");
    let toast = new bootstrap.Toast(toastEl, { delay: 3000 }); // Show toast for 3 seconds

    document.getElementById("supportForm").addEventListener("submit", function (event) {
        event.preventDefault();

        let name = document.getElementById("name").value.trim();
        let email = document.getElementById("email").value.trim();
        let message = document.getElementById("message").value.trim();

        if (name && email && message) {
            console.log("Form submitted successfully!"); // Debugging line
            toast.show(); // Display toast on form submission
            this.reset(); // Reset the form
        } else {
            console.log("Please fill out all fields."); // Debugging line
        }
    });
});



