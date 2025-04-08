const BASE_URL = 'http://localhost:8084';
let categories = [];
let allPlans = [];
let selectedPlan = null;

// Utility to get token from localStorage
const getToken = () => localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).token : null;

// Authentication check
document.addEventListener('DOMContentLoaded', async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const authButton = document.getElementById('authButton');
    if (user && user.token) {
        authButton.textContent = 'Profile';
        authButton.onclick = () => window.location.href = '/project/User/html/dashboard.html';
    } else {
        authButton.textContent = 'Login';
        authButton.onclick = () => window.location.href = '/project/User/html/otp.html'; 
    }

    const modal = document.getElementById('paymentModal');
    if (modal) modal.style.display = 'none';

    await fetchCategories();
    await showAllPlans();
    
    document.getElementById('searchInput').addEventListener('input', (e) => {
        const searchTerm = e.target.value.trim().toLowerCase();
        if (searchTerm.length > 0) {
            filterPlans(searchTerm);
        } else {
            displayPlans(allPlans);
        }
    });
});

async function fetchCategories() {
    try {
        const response = await fetch(`${BASE_URL}/categories`, {
            headers: getToken() ? { 'Authorization': `Bearer ${getToken()}` } : {}
        });
        if (response.ok) {
            categories = await response.json();
        }
    } catch (error) {
        console.error('Error fetching categories:', error);
    }
}

function getCategoryId(category) {
    const categoryMapping = {
        popular: 'Popular Plans',
        validity: 'Validity Plans',
        data: 'Data Plans',
        unlimited: 'Unlimited Plans'
    };
    const backendCategoryName = categoryMapping[category.toLowerCase()];
    const categoryObj = categories.find(cat => cat.name.toLowerCase() === backendCategoryName.toLowerCase());
    return categoryObj ? categoryObj.id : null;
}

async function loadPlans(categoryId = null) {
    try {
        // Use the active plans endpoint when no category is specified
        const url = categoryId 
            ? `${BASE_URL}/plans/category/${categoryId}` 
            : `${BASE_URL}/plans/active`;
        
        const response = await fetch(url, {
            headers: getToken() ? { 'Authorization': `Bearer ${getToken()}` } : {}
        });
        
        if (response.ok) {
            const plans = await response.json();
            if (!categoryId) allPlans = plans; // Store all active plans
            displayPlans(plans);
        } else {
            throw new Error('Failed to load plans');
        }
    } catch (error) {
        console.error('Error loading plans:', error);
        displayPlans([]); // Display empty state on error
    }
}

async function filterPlans(searchTerm) {
    try {
        const plansContainer = document.getElementById('plansContainer');
        plansContainer.innerHTML = '<div class="text-center py-4">Searching plans...</div>';
        
        const response = await fetch(`${BASE_URL}/plans/search?term=${encodeURIComponent(searchTerm)}`, {
            headers: getToken() ? { 'Authorization': `Bearer ${getToken()}` } : {}
        });
        
        if (response.ok) {
            const filteredPlans = await response.json();
            if (filteredPlans.length === 0) {
                displayNoResults(searchTerm);
            } else {
                displayPlans(filteredPlans);
            }
        } else {
            throw new Error('Failed to fetch search results');
        }
    } catch (error) {
        console.error('Search error:', error);
        // Fallback to frontend filtering of active plans
        const filteredPlans = allPlans.filter(plan => 
            String(plan.price).includes(searchTerm) ||
            plan.validity.toLowerCase().includes(searchTerm.toLowerCase()) ||
            plan.data.toLowerCase().includes(searchTerm.toLowerCase()) ||
            plan.sms.toLowerCase().includes(searchTerm.toLowerCase()) ||
            plan.calls.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (plan.benefits && plan.benefits.toLowerCase().includes(searchTerm.toLowerCase()))
        );
        displayPlans(filteredPlans.length ? filteredPlans : []);
    }
}

function displayNoResults(searchTerm) {
    const plansContainer = document.getElementById('plansContainer');
    plansContainer.innerHTML = `
        <div class="no-results text-center py-5">
            <i class="bi bi-search" style="font-size: 2rem;"></i>
            <h4 class="mt-3">No plans found for "${searchTerm}"</h4>
            <p>Try different search terms or check back later</p>
            <button class="btn btn-outline-primary mt-2" onclick="showAllPlans()">Show All Plans</button>
        </div>
    `;
}

function displayPlans(plans) {
    const plansContainer = document.getElementById('plansContainer');
    plansContainer.innerHTML = '';

    if (plans.length === 0) {
        plansContainer.innerHTML = `
            <div class="no-results text-center py-5">
                <h4>No active plans available</h4>
                <p>Please check back later</p>
            </div>
        `;
        return;
    }

    plans.forEach(plan => {
        const planCard = `
            <div class="plan-card">
                <h3>₹${plan.price}</h3>
                <p><strong>Validity:</strong> ${plan.validity}</p>
                <p><strong>Name:</strong> ${plan.name}</p>
                <p><strong>Data:</strong> ${plan.data}</p>
                <p><strong>SMS:</strong> ${plan.sms}</p>
                <p><strong>Calls:</strong> ${plan.calls}</p>
                ${plan.benefits ? `<p><strong>Benefits:</strong> ${plan.benefits}</p>` : ''}
                <button class="btn btn-custom select-plan-btn" data-plan-id="${plan.id}">Select Plan</button>
            </div>
        `;
        plansContainer.innerHTML += planCard;
    });

    document.querySelectorAll('.select-plan-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const planId = e.target.getAttribute('data-plan-id');
            selectedPlan = allPlans.find(plan => plan.id == planId);
            showPaymentModal();
        });
    });
}

function showPlans(category) {
    const categoryId = getCategoryId(category);
    if (categoryId) {
        document.getElementById('categoryTitle').textContent = 
            category.charAt(0).toUpperCase() + category.slice(1) + ' Plans';
        loadPlans(categoryId);
    }
}

async function showAllPlans() {
    document.getElementById('categoryTitle').textContent = 'All Active Plans';
    await loadPlans();
}

// Payment Modal Functions
function showPaymentModal() {
    const user = JSON.parse(localStorage.getItem('user'));
    const rechargeMobile = localStorage.getItem('rechargeMobile'); 
    const modal = document.getElementById('paymentModal');
    const mobileInput = document.getElementById('paymentMobileNumber');
    const errorMsg = document.getElementById('paymentErrorMsg');
    
    if (!modal || !mobileInput || !errorMsg) return;
    
    errorMsg.style.display = 'none';
    
    if (rechargeMobile) {
        mobileInput.value = rechargeMobile; 
    } else if (user && user.mobile) {
        mobileInput.value = user.mobile; 
    } else {
        mobileInput.value = ''; 
    }
    
    mobileInput.readOnly = false;
    modal.style.display = 'block';
}

function closePaymentModal() {
    const modal = document.getElementById('paymentModal');
    if (modal) modal.style.display = 'none';
}

function submitPayment() {
    const mobileInput = document.getElementById('paymentMobileNumber');
    const errorMsg = document.getElementById('paymentErrorMsg');
    const mobileNumber = mobileInput.value.trim();

    if (!/^\d{10}$/.test(mobileNumber)) {
        errorMsg.textContent = 'Please enter a valid 10-digit mobile number';
        errorMsg.style.display = 'block';
        return;
    }

    localStorage.setItem('selectedPlan', JSON.stringify(selectedPlan));
    localStorage.setItem('rechargeMobile', mobileNumber);
    window.location.href = '/project/User/html/payment.html';
}

// Back button handler
const backToPlansBtn = document.getElementById('backToPlansBtn');
if (backToPlansBtn) {
    backToPlansBtn.addEventListener('click', () => {
        window.location.href = '/project/User/html/plan.html';
    });
}