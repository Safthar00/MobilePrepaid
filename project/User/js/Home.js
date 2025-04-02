const BASE_URL = 'http://localhost:8084';

// Check if user is logged in and update auth button, plus set up event listeners
document.addEventListener('DOMContentLoaded', () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const authButton = document.getElementById('authButton');
    if (user) {
        authButton.textContent = 'Profile';
        authButton.onclick = () => window.location.href = '/project/User/html/dashboard.html';
    } else {
        authButton.textContent = 'Login';
        authButton.onclick = () => window.location.href = '/project/User/html/otp.html';
    }

    // Load popular plans
    loadPopularPlans();

    // Handle quick recharge
    const rechargeNowBtn = document.getElementById('rechargeNowBtn');
    if (rechargeNowBtn) {
        rechargeNowBtn.addEventListener('click', () => {
            const mobileNumber = document.getElementById('mobileNumber').value;
            const errorMsg = document.getElementById('error-msg');

            if (!/^\d{10}$/.test(mobileNumber)) {
                toggleElement('error-msg', 'block');
                return;
            }
            toggleElement('error-msg', 'none');

            localStorage.setItem('rechargeMobile', mobileNumber);
            window.location.href = '/project/User/html/plan.html';
        });
    } else {
        console.error('Element with ID "rechargeNowBtn" not found');
    }

    // Proceed to plan page event listener
    const proceedBtn = document.getElementById('proceedToPaymentBtn');
    if (proceedBtn) {
        proceedBtn.addEventListener('click', proceedToPlanPage);
    } else {
        console.error('Element with ID "proceedToPaymentBtn" not found');
    }
});

// Quick Recharge logic
const quickRechargeBtn = document.getElementById('quickRechargeBtn');
const quickMobileNumber = document.getElementById('quickMobileNumber');
const errorMsg = document.getElementById('quickErrorMsg');

if (quickRechargeBtn) {
    quickRechargeBtn.addEventListener('click', async () => {
        const mobile = quickMobileNumber.value.trim();
        if (!/^\d{10}$/.test(mobile)) {
            errorMsg.style.display = 'block';
            return;
        }
        errorMsg.style.display = 'none';

        try {
            const response = await fetch(`${BASE_URL}/users/quick-recharge`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ quickno: mobile })
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText);
            }

            localStorage.setItem('quickRechargeNumber', '+91' + mobile); // Store locally for plan page
            alert('Quick recharge number stored. Please select a plan.');
            window.location.href = '/project/User/html/plan.html';
        } catch (error) {
            alert('Failed to store quick recharge number: ' + error.message);
        }
    });
}

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
                                <li>${plan.data}/day Data</li>
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

    // Navigate to plan.html instead of processing payment
    window.location.href = '/project/User/html/plan.html';
};
