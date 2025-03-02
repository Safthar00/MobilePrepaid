document.addEventListener("DOMContentLoaded", function () {
    const authButton = document.getElementById("authButton");
    let isLoggedIn = false; // Simulating login state

    // Login/Logout functionality
    authButton.addEventListener("click", function () {
        if (!isLoggedIn) {
            // Simulate login
            isLoggedIn = true;
            authButton.textContent = "Logout";
            window.location.href = "/project/User/html/otp.html";
        } else {
            isLoggedIn = false;
            authButton.textContent = "Login";
        }
    });
// Contact Form Submission with Toast Notification

    // Initialize the toast
    let toastEl = document.getElementById("successToast");
    let toast = new bootstrap.Toast(toastEl, { delay: 3000 });
    
    // Get the form
    let form = document.getElementById("supportForm");
    
    // Add event listener to the form
    form.addEventListener("submit", function (event) {
        event.preventDefault();
        
        // Get form values
        let name = document.getElementById("name").value.trim();
        let email = document.getElementById("email").value.trim();
        let message = document.getElementById("message").value.trim();
        
        // Validate form
        if (name && email && message) {
            // Store data in local storage
            let formData = {
                name: name,
                email: email,
                message: message,
                timestamp: new Date().toISOString()
            };
            
            // Get existing submissions or initialize empty array
            let submissions = JSON.parse(localStorage.getItem('formSubmissions') || '[]');
            submissions.push(formData);
            localStorage.setItem('formSubmissions', JSON.stringify(submissions));
            
            // Show toast notification
            toast.show();
            
            // Reset the form
            this.reset();
        } else {
            console.log("Please fill out all fields.");
        }
    });
});