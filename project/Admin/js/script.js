// Base URL for backend API
const API_BASE_URL = 'http://localhost:8084';

// Utility to get the JWT token from localStorage
function getAuthToken() {
    return localStorage.getItem('adminToken');
}

// Utility to set headers with Authorization token
function getAuthHeaders() {
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`
    };
}

// Format date as DD/MM/YYYY
function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

// Load Registered Users Table
async function loadUsers() {
    try {
        const response = await fetch(`${API_BASE_URL}/users/registered-users`, {
            method: 'GET',
            headers: getAuthHeaders()
        });
        if (!response.ok) throw new Error('Failed to fetch users');
        const usersData = await response.json();
        
        const tableBody = document.querySelector('#users-table tbody');
        tableBody.innerHTML = '';
        usersData.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.userId}</td>
                <td>${user.firstName} ${user.lastName}</td>
                <td>${user.phone}</td>
                <td>${user.email}</td>
                <td>${formatDate(user.startDate)}</td>
                <td><span class="badge ${user.active ? 'bg-success' : 'bg-danger'}">${user.active ? 'Active' : 'Inactive'}</span></td>
                <td>
                    <button class="btn btn-sm btn-outline-primary toggle-status-btn" data-user-id="${user.userId}">
                        <i class="fas fa-sync-alt"></i> Toggle Status
                    </button>
                </td>
            `;
            tableBody.appendChild(row);
        });

        // Add event listeners for toggle status buttons
        document.querySelectorAll('.toggle-status-btn').forEach(btn => {
            btn.addEventListener('click', function () {
                const userId = this.getAttribute('data-user-id');
                toggleUserStatus(userId);
            });
        });
    } catch (error) {
        console.error('Error loading users:', error);
        alert('Failed to load users: ' + error.message);
    }
}

// Toggle User Status (Not directly in Postman, but inferred from SignUpController)
async function toggleUserStatus(userId) {
    try {
        const response = await fetch(`${API_BASE_URL}/users/toggle-status/${userId}`, {
            method: 'POST',
            headers: getAuthHeaders()
        });
        if (!response.ok) throw new Error('Failed to toggle status');
        const message = await response.text();
        alert(message);
        loadUsers(); // Refresh the table
    } catch (error) {
        console.error('Error toggling status:', error);
        alert('Failed to toggle user status: ' + error.message);
    }
}

// Load Recharge Plans Table (Assuming a GET /plans endpoint exists)
async function loadRechargePlans() {
    try {
        const response = await fetch(`${API_BASE_URL}/plans`, {
            method: 'GET',
            headers: getAuthHeaders()
        });
        if (!response.ok) throw new Error('Failed to fetch plans');
        const rechargePlansData = await response.json();

        const tableBody = document.querySelector('#plans-table tbody');
        tableBody.innerHTML = '';
        rechargePlansData.forEach(plan => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${plan.id}</td>
                <td>${plan.name}</td>
                <td>₹${plan.price}</td>
                <td>${plan.data}</td>
                <td>${plan.validity}</td>
                <td>${plan.benefits}</td>
                <td><span class="badge ${plan.status === 'ACTIVE' ? 'bg-success' : 'bg-danger'}">${plan.status}</span></td>
                <td>
                    <button class="btn btn-sm btn-outline-primary edit-plan-btn" data-plan-id="${plan.id}">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn btn-sm btn-outline-danger delete-plan-btn" data-plan-id="${plan.id}">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                    <button class="btn btn-sm btn-outline-secondary toggle-plan-btn" data-plan-id="${plan.id}">
                        <i class="fas fa-sync-alt"></i> Toggle Status
                    </button>
                </td>
            `;
            tableBody.appendChild(row);
        });

        // Add event listeners for edit, delete, and toggle buttons
        document.querySelectorAll('.edit-plan-btn').forEach(btn => {
            btn.addEventListener('click', function () {
                const planId = this.getAttribute('data-plan-id');
                openPlanFormModal('edit', planId);
            });
        });
        document.querySelectorAll('.delete-plan-btn').forEach(btn => {
            btn.addEventListener('click', function () {
                const planId = this.getAttribute('data-plan-id');
                deletePlan(planId);
            });
        });
        document.querySelectorAll('.toggle-plan-btn').forEach(btn => {
            btn.addEventListener('click', function () {
                const planId = this.getAttribute('data-plan-id');
                togglePlanStatus(planId);
            });
        });
    } catch (error) {
        console.error('Error loading plans:', error);
        alert('Failed to load plans: ' + error.message);
    }
}

async function loadCategories() {
    try {
        const response = await fetch(`${API_BASE_URL}/categories`, {
            method: 'GET',
            headers: getAuthHeaders()
        });
        if (!response.ok) throw new Error('Failed to fetch categories');
        const categories = await response.json();
        
        const select = document.getElementById('planCategory');
        select.innerHTML = '<option value="">Select a category</option>'; // Reset options
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = category.name;
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Error loading categories:', error);
        alert('Failed to load categories: ' + error.message);
    }
}

// Open Plan Form Modal for Add/Edit
async function openPlanFormModal(mode, planId = null) {
    const modal = new bootstrap.Modal(document.getElementById('planFormModal'));
    const form = document.getElementById('planForm');
    form.reset();
    document.getElementById('planId').value = '';

    await loadCategories();

    if (mode === 'edit') {
        try {
            const response = await fetch(`${API_BASE_URL}/plans/${planId}`, {
                method: 'GET',
                headers: getAuthHeaders()
            });
            if (!response.ok) throw new Error('Failed to fetch plan details');
            const plan = await response.json();

            document.getElementById('planId').value = plan.id;
            document.getElementById('planName').value = plan.name;
            document.getElementById('planPrice').value = plan.price;
            document.getElementById('planData').value = plan.data;
            document.getElementById('planValidity').value = plan.validity;
            document.getElementById('planSms').value = plan.sms; 
            document.getElementById('planCalls').value = plan.calls;
            document.getElementById('planBenefits').value = plan.benefits;
            document.getElementById('planCategory').value = plan.category.id;
        } catch (error) {
            console.error('Error fetching plan:', error);
            alert('Failed to load plan details: ' + error.message);
            return;
        }
    }
    modal.show();
}

// Save Plan (Add or Edit)
async function savePlan() {
    const id = document.getElementById('planId').value;
    const name = document.getElementById('planName').value;
    const price = parseFloat(document.getElementById('planPrice').value);
    const data = document.getElementById('planData').value;
    const validity = document.getElementById('planValidity').value;
    const sms = document.getElementById('planSms').value; 
    const calls = document.getElementById('planCalls').value;
    const benefits = document.getElementById('planBenefits').value;
    const categoryId = document.getElementById('planCategory').value;

    if (!name || isNaN(price) || !data || !validity || !benefits) {
        alert('Please fill in all fields correctly.');
        return;
    }

    const payload = { name, price, validity, data,sms,calls, benefits, category: { id: parseInt(categoryId) } }; // Hardcoding category ID as per Postman

    try {
        const url = id ? `${API_BASE_URL}/plans/modify/${id}` : `${API_BASE_URL}/plans/add`;
        const method = id ? 'PUT' : 'POST';
        const response = await fetch(url, {
            method: method,
            headers: getAuthHeaders(),
            body: JSON.stringify(payload)
        });
        if (!response.ok) throw new Error(`Failed to ${id ? 'update' : 'add'} plan`);
        const result = await response.json();
        alert(`${id ? 'Plan updated' : 'Plan added'} successfully: ${result.name}`);
        loadRechargePlans();
        bootstrap.Modal.getInstance(document.getElementById('planFormModal')).hide();
    } catch (error) {
        console.error('Error saving plan:', error);
        alert(`Failed to ${id ? 'update' : 'add'} plan: ` + error.message);
    }
}

// Delete Plan
async function deletePlan(planId) {
    if (confirm('Are you sure you want to delete this plan?')) {
        try {
            const response = await fetch(`${API_BASE_URL}/plans/delete/${planId}`, {
                method: 'DELETE',
                headers: getAuthHeaders()
            });
            if (!response.ok) throw new Error('Failed to delete plan');
            alert('Plan deleted successfully');
            loadRechargePlans();
        } catch (error) {
            console.error('Error deleting plan:', error);
            alert('Failed to delete plan: ' + error.message);
        }
    }
}

// Toggle Plan Status
async function togglePlanStatus(planId) {
    try {
        const response = await fetch(`${API_BASE_URL}/plans/toggle-status/${planId}`, {
            method: 'PUT',
            headers: getAuthHeaders()
        });
        if (!response.ok) throw new Error('Failed to toggle plan status');
        const updatedPlan = await response.json();
        alert(`Plan status toggled to ${updatedPlan.status}`);
        loadRechargePlans();
    } catch (error) {
        console.error('Error toggling plan status:', error);
        alert('Failed to toggle plan status: ' + error.message);
    }
}

// Logout
async function logout() {
    try {
        const response = await fetch(`${API_BASE_URL}/users/logout`, {
            method: 'POST',
            headers: getAuthHeaders()
        });
        if (!response.ok) throw new Error('Logout failed');
        localStorage.removeItem('adminToken');
        alert('Logged out successfully');
        window.location.href = '/project/Admin/html/admin-login.html';
    } catch (error) {
        console.error('Error during logout:', error);
        alert('Logout failed: ' + error.message);
    }
}

// Sidebar and Navigation Handling
function setupSidebarAndNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section-content');
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            sections.forEach(section => section.classList.add('d-none'));
            const sectionId = this.getAttribute('data-section');
            document.getElementById(sectionId).classList.remove('d-none');
        });
    });

    document.getElementById('sidebarCollapse').addEventListener('click', function () {
        document.getElementById('sidebar').classList.toggle('active');
        document.getElementById('content').classList.toggle('active');
    });

    function setSidebarState() {
        if (window.innerWidth < 768) {
            document.getElementById('sidebar').classList.add('active');
            document.getElementById('content').classList.add('active');
        } else {
            document.getElementById('sidebar').classList.remove('active');
            document.getElementById('content').classList.remove('active');
        }
    }
    setSidebarState();
    window.addEventListener('resize', setSidebarState);
}

// Initialize Page
document.addEventListener('DOMContentLoaded', function () {
    if (!getAuthToken()) {
        window.location.href = '/project/Admin/html/admin-login.html';
        return;
    }

    // Load initial data
    loadUsers();
    loadRechargePlans();

    // Setup sidebar and navigation
    setupSidebarAndNavigation();

    document.getElementById('adminProfileBtn').addEventListener('click', function() {
        window.location.href = "/project/Admin/html/admin-profile.html"; // Adjust the path as needed
    });
    
    // Event listeners for buttons
    document.getElementById('add-plan-btn').addEventListener('click', () => openPlanFormModal('add'));
    document.getElementById('savePlanBtn').addEventListener('click', savePlan);
    document.getElementById('logoutBtn').addEventListener('click', logout);
});