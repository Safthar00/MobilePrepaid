const BASE_URL = 'http://localhost:8084';

// Check if user is logged in and update auth button, plus set up event listeners
document.addEventListener('DOMContentLoaded', () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const authButton = document.getElementById('authButton');
    if (user) {
        authButton.textContent = 'Profile';
        authButton.onclick = () => window.location.href = '../html/dashboard.html';
    } else {
        authButton.textContent = 'Login';
        authButton.onclick = () => window.location.href = '../html/otp.html';
    }

    // Load popular plans
    loadPopularPlans();

    // Handle quick recharge
    const quickRechargeBtn = document.getElementById('quickRechargeBtn');
    if (quickRechargeBtn) {
        quickRechargeBtn.addEventListener('click', () => {
            const mobileNumber = document.getElementById('quickMobileNumber').value;
            const errorMsg = document.getElementById('error-msg');

            if (!mobileNumber) {
                console.error('Error: Element with ID "mobileNumber" not found in the DOM');
                if (errorMsg) toggleElement('error-msg', 'block'); // Show error if errorMsg exists
                return;
            }
            // Indian mobile number regex: starts with 6,7,8,9 followed by 9 digits
            if (!/^[6-9]\d{9}$/.test(mobileNumber)) {
                toggleElement('error-msg', 'block');
                return;
            }
            toggleElement('error-msg', 'none');

            // Store mobile number with country code in localStorage
            localStorage.setItem('rechargeMobile', mobileNumber);
            window.location.href = '../html/plan.html';
        });
    } else {
        console.error('Element with ID "quickRechargeBtn" not found');
    }

    // Proceed to plan page event listener
    const proceedBtn = document.getElementById('proceedToPaymentBtn');
    if (proceedBtn) {
        proceedBtn.addEventListener('click', proceedToPlanPage);
    } else {
        console.error('Element with ID "proceedToPaymentBtn" not found');
    }
});

// Utility function to show/hide elements
const toggleElement = (id, display) => {
    const element = document.getElementById(id);
    if (element) element.style.display = display;
};

// Load popular plans
async function loadPopularPlans() {
    try {
        const response = await fetch(`${BASE_URL}/plans/category/4`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });

        if (response.ok) {
            const plans = await response.json();
            const planContainer = document.getElementById('planContainer');
            const section = document.getElementById('popularPlansSection');

            // Clear any existing content
            planContainer.innerHTML = '';

            // Add plans dynamically (up to 3)
            plans.slice(0, 3).forEach(plan => {
                const planCard = document.createElement('div');
                planCard.className = 'col-md-4 mb-4';
                planCard.innerHTML = `
                    <div class="card plan-card h-100">
                        <div class="card-body">
                            <h3 class="card-title text-primary">₹${plan.price}</h3>
                            <ul class="list-unstyled">
                                <li>${plan.data}</li>
                                <li>${plan.validity}</li>
                                <li>${plan.benefits}</li>
                            </ul>
                            <button class="btn btn-secondary w-100 mt-3 select-plan-btn">Select Plan</button>
                        </div>
                    </div>
                `;
                planContainer.appendChild(planCard);
            });

            // Show the section after loading plans
            section.classList.add('loaded');

            // Add event listeners to select plan buttons
            document.querySelectorAll('.select-plan-btn').forEach((btn, index) => {
                btn.addEventListener('click', () => showPlanModal(plans[index]));
            });
        } else {
            console.error('Failed to load plans:', await response.text());
        }
    } catch (error) {
        console.error('Error loading plans:', error);
    }
}

// Show plan selection modal
function showPlanModal(plan) {
    const modalElement = document.getElementById('planSelectionModal');
    if (!modalElement) {
        console.error('Modal not found');
        return;
    }
    const modal = new bootstrap.Modal(modalElement);
    const priceElement = document.getElementById('selectedPlanPrice');
    const detailsElement = document.getElementById('selectedPlanDetails');
    if (priceElement && detailsElement) {
        priceElement.textContent = `₹${plan.price}`;
        detailsElement.innerHTML = `
            <li>${plan.data}/day Data</li>
            <li>${plan.validity}</li>
            <li>${plan.benefits}</li>
        `;
        modal.show();
    } else {
        console.error('Modal content not found');
    }
}

// Proceed to plan page
const proceedToPlanPage = () => {
    const mobile = document.getElementById('modalMobileNumber').value;
    const error = document.getElementById('mobileNumberError');

    if (!/^\d{10}$/.test(mobile)) {
        error.style.display = 'block';
        return;
    }
    error.style.display = 'none';
    localStorage.setItem('rechargeMobile', mobile);

    // Navigate to plan.html instead of processing payment
    window.location.href = '../html/plan.html';
};