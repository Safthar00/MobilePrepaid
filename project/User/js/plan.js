const plans = {
    popular: [
        { price: 199, data: 2, duration: 28, ott: "Hotstar" },
        { price: 399, data: 3, duration: 56, ott: "Netflix" },
        { price: 599, data: 1.5, duration: 84, ott: "Amazon Prime" },
        { price: 799, data: 2.5, duration: 365, ott: "Sony Live" }
    ],
    validity: [
        { price: 129, data: 1, duration: 24, ott: "None" },
        { price: 249, data: 2, duration: 45, ott: "Hotstar" },
        { price: 499, data: 1.5, duration: 90, ott: "Netflix" }
    ],
    data: [
        { price: 19, data: 1, duration: 1, ott: "None" },
        { price: 49, data: 3, duration: 3, ott: "None" },
        { price: 99, data: 5, duration: 7, ott: "Amazon Prime" }
    ],
    unlimited: [
        { price: 999, data: 'Unlimited', duration: 90, ott: "Netflix + Amazon Prime" },
        { price: 1499, data: 'Unlimited', duration: 180, ott: "Hotstar + Netflix" },
        { price: 2499, data: 'Unlimited', duration: 365, ott: "All OTT" }
    ]
};

//navbar
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
});

// Function to display all plans when the page loads
function showAllPlans() {
    document.getElementById('categoryTitle').innerText = "All Plans";
    const plansContainer = document.getElementById('plansContainer');
    plansContainer.innerHTML = '';

    Object.keys(plans).forEach(category => {
        plans[category].forEach(plan => {
            plansContainer.innerHTML += `
                <div class="col-md-4">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">₹${plan.price}</h5>
                            <p class="card-text">Data: ${plan.data} GB</p>
                            <p class="card-text">Validity: ${plan.duration} Days</p>
                            <p class="card-text"><strong>OTT: ${plan.ott}</strong></p>
                            <button class="btn" onclick="buyNow('${plan.price}','${plan.data}','${plan.duration}','${plan.ott}')" style="background-color:#2a28a7; color: white;">Recharge</button>
                        </div>
                    </div>
                </div>`;
        });
    });
}

//display label
// Function to display the stored mobile number on the plan page
document.addEventListener("DOMContentLoaded", function () {
    const rechargeDetails = document.getElementById("rechargeDetails");
    const storedNumber = localStorage.getItem("rechargeNumber");
    const storedRecharge = document.getElementById("storedRecharge");
    const enteredNumber = document.getElementById("enteredNumber");
    const changeRecharge = document.getElementById("changeRecharge");
    const prepaidPopoverModal = new bootstrap.Modal(document.getElementById('prepaidPopoverModal'));
    const prepaidMobileInput = document.getElementById("prepaidMobileNumber");
    const prepaidErrorMsg = document.getElementById("prepaidErrorMsg");
    const prepaidSubmitBtn = document.getElementById("prepaidSubmitBtn");

    // Flag to track if user came from prepaid link
    let isFromPrepaid = false;
    if (localStorage.getItem("fromPrepaidLink") === "true") {
        isFromPrepaid = true;
        localStorage.removeItem("fromPrepaidLink"); // Clear after checking
    }

    // Display stored mobile number if available
    if (storedNumber && !isFromPrepaid) {
        enteredNumber.value = storedNumber;
        // localStorage.removeItem("stroedRecharge");
        rechargeDetails.style.display = "block";
    } else {
        rechargeDetails.style.display = "none";
    }

    // Variable to store pending plan details
    let pendingPlan = null;

    // Handle modal submission
    prepaidSubmitBtn.addEventListener("click", function () {
        const mobileNumber = prepaidMobileInput.value.trim();
        const mobilePattern = /^[6-9]\d{9}$/; // Validate Indian mobile number

        if (mobilePattern.test(mobileNumber)) {
            localStorage.setItem("rechargeNumber", mobileNumber);
            localStorage.setItem("mobileNumber", mobileNumber); // Sync with other pages
            enteredNumber.value = mobileNumber;
            storedRecharge.innerText = mobileNumber;
            rechargeDetails.style.display = "block";
            prepaidPopoverModal.hide();

            // Proceed with pending plan if exists
            if (pendingPlan) {
                localStorage.setItem("planPrice", pendingPlan.price);
                localStorage.setItem("planData", pendingPlan.data);
                localStorage.setItem("planValidity", pendingPlan.duration);
                localStorage.setItem("planOtt", pendingPlan.ott);
                window.location.href = "/project/User/html/payment.html";
                pendingPlan = null;
            }
        } else {
            prepaidErrorMsg.style.display = "block"; // Show error if invalid
        }
    });

   // Clear error message on input
   prepaidMobileInput.addEventListener("input", function () {
    prepaidErrorMsg.style.display = "none";
});

    // Handle "Change" link
    changeRecharge.addEventListener("click", function (event) {
        event.preventDefault();
        localStorage.removeItem("rechargeNumber");
        window.location.href = "/project/User/html/Home.html";
    });
    //recharge button handle
window.buyNow = function(price, data, duration, ott) {
        if (isFromPrepaid) {
            // Show modal for prepaid link users
            pendingPlan = { price, data, duration, ott };
            prepaidMobileInput.value = localStorage.getItem("rechargeNumber") || "";
            prepaidPopoverModal.show();
        } else {
            const mobileNumber = localStorage.getItem("rechargeNumber") || localStorage.getItem("mobileNumber");
            if (mobileNumber) {
                // Proceed to payment if number exists
                localStorage.setItem("mobileNumber", mobileNumber);
                localStorage.setItem("rechargeNumber", mobileNumber);
                localStorage.setItem("planPrice", price);
                localStorage.setItem("planData", data);
                localStorage.setItem("planValidity", duration);
                localStorage.setItem("planOtt", ott);
                window.location.href = "/project/User/html/payment.html";
            } else {
                // Show modal if no number is stored
                pendingPlan = { price, data, duration, ott };
                prepaidMobileInput.value = "";
                prepaidPopoverModal.show();
            }
        }
    };

    // Load all plans (function unchanged, omitted for brevity)
    showAllPlans();
});


// Ensure search also works when clicking the button
function filterPlans() {
    const query = document.getElementById('searchBar').value.toLowerCase().trim();
    const plansContainer = document.getElementById('plansContainer');
    plansContainer.innerHTML = '';

    if (query === '') {
        showAllPlans(); // Reset to all plans when input is empty
        return;
    }

    let filteredPlans = [];
    Object.values(plans).forEach(categoryPlans => {
        filteredPlans = filteredPlans.concat(categoryPlans.filter(plan =>
            plan.price.toString().includes(query) ||
            plan.data.toString().includes(query) ||
            plan.duration.toString().includes(query) ||
            plan.ott.toLowerCase().includes(query)
        ));
    });

    if (filteredPlans.length > 0) {
        filteredPlans.forEach(plan => {
            plansContainer.innerHTML += `
                <div class="col-md-4">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">₹${plan.price}</h5>
                            <p class="card-text">Data: ${plan.data} GB</p>
                            <p class="card-text">Validity: ${plan.duration} Days</p>
                            <p class="card-text"><strong>OTT: ${plan.ott}</strong></p>
                            <button class="btn" onclick="buyNow('${plan.price}','${plan.data}','${plan.duration}','${plan.ott}')" style="background-color:#2a28a7; color: white;">Recharge</button>
                        </div>
                    </div>
                </div>`;
        });
    } else {
        plansContainer.innerHTML = "<p class='text-center text-muted'>No matching plans found.</p>";
    }
}


//display all plans while entered
const defaultCategory="";

// Function to display plans for a selected category
function showPlans(category) {
    if (!plans[category]) {
        console.warn("Invalid category:", category);
        return;
    }

    document.getElementById('categoryTitle').innerText = category.charAt(0).toUpperCase() + category.slice(1) + ' Plans';
    const plansContainer = document.getElementById('plansContainer');

    plansContainer.innerHTML = plans[category].map(plan => `
        <div class="col-md-4">
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">₹${plan.price}</h5>
                    <p class="card-text">Data: ${plan.data} GB</p>
                    <p class="card-text">Validity: ${plan.duration} Days</p>
                    <p class="card-text"><strong>OTT: ${plan.ott}</strong></p>
                    <button class="btn" onclick="buyNow('${plan.price}','${plan.data}','${plan.duration}','${plan.ott}')" style="background-color:#2a28a7; color: white;">Recharge</button>
                </div>
            </div>
        </div>`).join("");
}


// Function to filter plans based on search input
function filterPlans() {
    const query = document.getElementById('searchBar').value.toLowerCase();
    const plansContainer = document.getElementById('plansContainer');
    plansContainer.innerHTML = '';

    let filteredPlans = [];
    Object.values(plans).forEach(categoryPlans => {
        filteredPlans = filteredPlans.concat(categoryPlans.filter(plan =>
            plan.price.toString().includes(query) ||
            plan.data.toString().includes(query) ||
            plan.duration.toString().includes(query) ||
            plan.ott.toLowerCase().includes(query)
        ));
    });

    if (filteredPlans.length > 0) {
        filteredPlans.forEach(plan => {
            plansContainer.innerHTML += `
                <div class="col-md-4">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">₹${plan.price}</h5>
                            <p class="card-text">Data: ${plan.data} GB</p>
                            <p class="card-text">Validity: ${plan.duration} Days</p>
                            <p class="card-text"><strong>OTT: ${plan.ott}</strong></p>
                            <button class="btn" onclick="buyNow('${plan.price}','${plan.data}','${plan.duration}','${plan.ott}')" style="background-color:#2a28a7; color: white;">Recharge</button>
                        </div>
                    </div>
                </div>`;
        });
    } else {
        plansContainer.innerHTML = "<p class='text-center text-muted'>No matching plans found.</p>";
    }

    if (query === '') {
        showAllPlans(); // Ensure all plans are shown again when search is cleared
    }
}


// Event listener for search bar
document.addEventListener("DOMContentLoaded", function () {
    const searchBar = document.getElementById('searchBar');
    if (searchBar) {
        searchBar.addEventListener('input', filterPlans);
    } else {
        console.error("Error: searchBar element not found!");
    }
});


// Load all plans when the page opens
document.addEventListener("DOMContentLoaded", showAllPlans);

function selectPlan(planName, amount) {
    localStorage.setItem("selectedPlan", planName);
    localStorage.setItem("planAmount", amount);
    window.location.href = "/project/User/html/payment.html"; // Redirect to payment page
}
