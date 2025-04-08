document.addEventListener("DOMContentLoaded", function () {
    const authButton = document.getElementById("authButton");

    // Function to update the auth button based on login status
    function updateAuthButton() {
        const user = JSON.parse(localStorage.getItem("user"));
        const isLoggedIn = user && user.token;

        if (isLoggedIn) {
            authButton.textContent = "Profile";
            authButton.className = "btn btn-primary";
            authButton.onclick = function () {
                window.location.href = "../html/dashboard.html";
            };
        } else {
            authButton.textContent = "Login";
            authButton.className = "btn btn-outline-light";
            authButton.onclick = function () {
                window.location.href = "../html/otp.html";
            };
        }
    }

    // Initial update when page loads
    updateAuthButton();

    let form = document.getElementById("supportForm");
    let toastEl = document.getElementById("successToast");
    let toast = new bootstrap.Toast(toastEl, { delay: 3000 });

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        let name = document.getElementById("name");
        let email = document.getElementById("email");
        let subject = document.getElementById("subject");
        let message = document.getElementById("message");

        let nameError = document.getElementById("nameError");
        let emailError = document.getElementById("emailError");
        let subjectError = document.getElementById("subjectError");
        let messageError = document.getElementById("messageError");

        let nameValue = name.value.trim();
        let emailValue = email.value.trim();
        let subjectValue = subject.value.trim();
        let messageValue = message.value.trim();

        let isValid = true;

        // Name validation
        if (!nameValue) {
            name.classList.add("is-invalid");
            nameError.innerHTML = "Name is required.";
            isValid = false;
        } else if (!/^[A-Z][a-z]+(?: [A-Z][a-z]+)*$/.test(nameValue)) {
            name.classList.add("is-invalid");
            nameError.innerHTML = "Enter a valid name.";
            isValid = false;
        } else {
            name.classList.remove("is-invalid");
            nameError.innerHTML = "";
        }

        // Email validation
        if (!emailValue) {
            email.classList.add("is-invalid");
            emailError.innerHTML = "Email is required.";
            isValid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)) {
            email.classList.add("is-invalid");
            emailError.innerHTML = "Enter a valid email address.";
            isValid = false;
        } else {
            email.classList.remove("is-invalid");
            emailError.innerHTML = "";
        }

        // Subject validation
        if (!subjectValue) {
            subject.classList.add("is-invalid");
            subjectError.innerHTML = "Subject is required.";
            isValid = false;
        } else {
            subject.classList.remove("is-invalid");
            subjectError.innerHTML = "";
        }

        // Message validation
        if (!messageValue) {
            message.classList.add("is-invalid");
            messageError.innerHTML = "Message is required.";
            isValid = false;
        } else {
            message.classList.remove("is-invalid");
            messageError.innerHTML = "";
        }

        if (!isValid) return;

        // Prepare data to send to the backend
        let formData = {
            name: nameValue,
            email: emailValue,
            subject: subjectValue,
            message: messageValue
        };

        // Send form data to the backend
        fetch('http://127.0.0.1:8084/support', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Support message saved:', data);
            toast.show(); // Show success toast
            form.reset(); // Reset the form
        })
        .catch(error => {
            console.error('Error submitting support message:', error);
            alert('There was an error submitting your message. Please try again.');
        });
    });

    // Optional: Function to fetch and display all support messages (not used in current HTML)
    function fetchSupportMessages() {
        fetch('http://127.0.0.1:8084/support', {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('All support messages:', data);
            // If you want to display these messages, you can add logic here
            // For example, append them to a div in the HTML
        })
        .catch(error => {
            console.error('Error fetching support messages:', error);
        });
    }

    // Uncomment the line below if you want to fetch messages on page load
    // fetchSupportMessages();
});