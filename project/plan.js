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
    let isLoggedIn = false; // Simulating login state
    
    authButton.addEventListener("click", function () {
        if (!isLoggedIn) {
            // Simulate login
            isLoggedIn = true;
            authButton.textContent = "Logout";
            window.location.href = "dashboard.html";
        } else {
            isLoggedIn = false;
            authButton.textContent = "Login";
        }
    });

    // const rechargeLink = document.getElementById("rechargeDropdown");
    // rechargeLink.addEventListener("click", function (event) {
    //     if (isLoggedIn) {
    //         window.location.href = "dashboard.html";
    //     }
    // });
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
                            <button class="btn" onclick="location.href='payment.html';" style="background-color:#2a28a7; color: white;">Recharge</button>
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

    // Check if the user navigated from the Prepaid link
    const isFromPrepaidLink = localStorage.getItem("fromPrepaidLink");

    if (isFromPrepaidLink === "true") {
        // Hide the "Recharge for" section if navigated from the Prepaid link
        rechargeDetails.style.display = "none";
        localStorage.removeItem("fromPrepaidLink"); // Clear the flag
    } else if (storedNumber) {
        // Display the stored mobile number if available
        enteredNumber.value = storedNumber;
        storedRecharge.innerText = storedNumber;
        rechargeDetails.style.display = "block"; // Ensure the section is visible
    } else {
        // Hide the "Recharge for" section if no mobile number is stored
        rechargeDetails.style.display = "none";
    }

    // Redirect to home page when "Change" is clicked
    if (changeRecharge) {
        changeRecharge.addEventListener("click", function (event) {
            event.preventDefault(); // Prevent default link behavior
            localStorage.removeItem("rechargeNumber"); // Clear the stored number
            window.location.href = "Home.html"; // Redirect to the home page
        });
    }
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
                            <button class="btn" onclick="location.href='payment.html';" style="background-color:#2a28a7; color: white;">Recharge</button>
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
                    <button class="btn" onclick="location.href='payment.html';" style="background-color:#2a28a7; color: white;">Recharge</button>
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
                            <button class="btn" onclick="location.href='payment.html';" style="background-color:#2a28a7; color: white;">Recharge</button>
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
