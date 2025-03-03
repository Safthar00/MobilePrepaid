document.addEventListener("DOMContentLoaded", function () {
    const authButton = document.getElementById("authButton");
    function updateAuthButton() {
        const user = JSON.parse(localStorage.getItem("user"));
        const isLoggedIn = user && user.token;

        if (isLoggedIn) {
            authButton.textContent = "Profile";
            authButton.className = "btn btn-primary"; // Optional: Style change
            authButton.onclick = function () {
                window.location.href = "/project/User/html/dashboard.html";
            };
        } else {
            authButton.textContent = "Login";
            authButton.className = "btn btn-outline-light"; // Match initial HTML class
            authButton.onclick = function () {
                window.location.href = "/project/User/html/otp.html";
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

        if (!subjectValue) {
            subject.classList.add("is-invalid");
            subjectError.innerHTML = "Subject is required.";
            isValid = false;
        } else {
            subject.classList.remove("is-invalid");
            subjectError.innerHTML = "";
        }

        if (!messageValue) {
            message.classList.add("is-invalid");
            messageError.innerHTML = "Message is required.";
            isValid = false;
        } else {
            message.classList.remove("is-invalid");
            messageError.innerHTML = "";
        }

        if (!isValid) return;

        let formData = { name: nameValue, email: emailValue, subject: subjectValue, message: messageValue, timestamp: new Date().toISOString() };
        let submissions = JSON.parse(localStorage.getItem('formSubmissions') || '[]');
        submissions.push(formData);
        localStorage.setItem('formSubmissions', JSON.stringify(submissions));

        toast.show();
        form.reset();
    });
});