document.addEventListener("DOMContentLoaded", function () {
    const authButton = document.getElementById("authButton");
    let isLoggedIn = false; // Simulating login state

    // Login/Logout functionality
    authButton.addEventListener("click", function () {
        if (!isLoggedIn) {
            isLoggedIn = true;
            authButton.textContent = "Logout";
            window.location.href = "/project/User/html/otp.html";
        } else {
            isLoggedIn = false;
            authButton.textContent = "Login";
        }
    });

    // Quick Recharge functionality
    const rechargeNowBtn = document.getElementById("rechargeNowBtn");
    const mobileNumberInput = document.getElementById("mobileNumber");
    const errorMsg = document.getElementById("error-msg");

    rechargeNowBtn.addEventListener("click", function () {
        const mobileNumber = mobileNumberInput.value.trim();
        const mobilePattern = /^[6-9]\d{9}$/; 

        if (mobilePattern.test(mobileNumber)) {
            localStorage.setItem("rechargeNumber", mobileNumber); // Store the mobile number
            localStorage.setItem("fromQuickRecharge", "true"); // Set flag for Quick Recharge
            window.location.href = "/project/User/html/plan.html"; // Redirect to Plan page
        } else {
            errorMsg.style.display = "block"; // Show error message           
        }
    });

    // Clear error message on input
    mobileNumberInput.addEventListener("input", function () {
        errorMsg.style.display = "none";
    });
});
    
    //popular plans
document.addEventListener("DOMContentLoaded", function() {
    // Get all plan selection buttons
    const planButtons = document.querySelectorAll('.select-plan-btn');
    const mobileNumberModal = new bootstrap.Modal(document.getElementById('mobileNumberModal'));
    const modalMobileInput = document.getElementById('modalMobileNumber');
    const modalErrorMsg = document.getElementById('modalErrorMsg');
    const modalSubmitBtn = document.getElementById('modalSubmitBtn');
    
    let selectedPlanData = {};
    
    // Add click event to all plan buttons
    planButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Store selected plan data
            selectedPlanData = {
                price: this.getAttribute('data-price'),
                data: this.getAttribute('data-data'),
                validity: this.getAttribute('data-validity'),
                ott: this.getAttribute('data-ott')
            };
            
            // Show mobile number modal
            mobileNumberModal.show();
        });
    });
    
    // Handle mobile number input validation
    modalMobileInput.addEventListener('input', function() {
        modalErrorMsg.style.display = 'none';
    });
    
    // Handle submit button in modal
    modalSubmitBtn.addEventListener('click', function() {
        const mobileNumber = modalMobileInput.value.trim();
        const mobilePattern = /^[6-9]\d{9}$/; // Indian mobile number validation
        
        if (mobilePattern.test(mobileNumber)) {
            // Store plan details and mobile number in localStorage
            localStorage.setItem('planPrice', selectedPlanData.price);
            localStorage.setItem('planData', selectedPlanData.data);
            localStorage.setItem('planValidity', selectedPlanData.validity);
            localStorage.setItem('planOtt', selectedPlanData.ott);
            localStorage.setItem('mobileNumber', mobileNumber);
            
            // Navigate to payment page
            window.location.href = '/project/User/html/payment.html';
        } else {
            // Show error message
            modalErrorMsg.style.display = 'block';
        }
    });
});




    
    //review
    document.addEventListener("DOMContentLoaded", function () {
        // Ensure the container exists before modifying it
        let container = document.querySelector(".reviews-scroll");
        if (!container) {
            console.error("Error: .reviews-scroll container not found!");
            return;
        }
    
        // Sample user reviews data
        const reviews = [
            { name: "Akash", rating: 5, comment: "Excellent service and great recharge plans!" },
            { name: "Sara Mehta", rating: 4, comment: "Very good experience, but the app can be improved." },
            { name: "John", rating: 3, comment: "Average service, but customer support is helpful." },
            { name: "Priya", rating: 5, comment: "Amazing 5G speeds and affordable plans!" },
            { name: "Rahul", rating: 4, comment: "Great customer service and easy recharge process." },
            { name: "Ananya", rating: 5, comment: "Best telecom provider I've ever used!" }
        ];
    
        // Function to generate star ratings dynamically
        function generateStars(rating) {
            let stars = "";
            for (let i = 1; i <= 5; i++) {
                stars += i <= rating ? "★" : "☆";
            }
            return stars;
        }
    
        // Function to display reviews dynamically
        function displayReviews() {
            container.innerHTML = ""; // Clear existing reviews
    
            // Duplicate the reviews to create a seamless loop
            const duplicatedReviews = [...reviews, ...reviews];
    
            duplicatedReviews.forEach(review => {
                container.innerHTML += `
                    <div class="review-card">
                        <h5 class="card-title">${review.name}</h5>
                        <p class="star-rating">${generateStars(review.rating)}</p>
                        <p class="card-text">"${review.comment}"</p>
                    </div>
                `;
            });
        }
    
        displayReviews(); // Call the function after the DOM is loaded
    });
//scroll to top
    document.addEventListener("scroll", function () {
        const scrollToTopBtn = document.getElementById("scrollToTopBtn");
        if (window.scrollY > 300) {
            scrollToTopBtn.style.display = "block";
        } else {
            scrollToTopBtn.style.display = "none";
        }
    });
    
    document.getElementById("scrollToTopBtn").addEventListener("click", function () {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });