// Navigation
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        // Update active state
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        this.classList.add('active');
        
        // Show correct section
        const section = this.dataset.section;
        document.querySelectorAll('.dashboard-section').forEach(s => s.classList.add('d-none'));
        document.getElementById(section).classList.remove('d-none');
    });
});

// Mobile sidebar toggle
document.getElementById('sidebarToggle').addEventListener('click', function() {
    document.querySelector('.sidebar').classList.toggle('active');
});

// Charts
const createCharts = () => {
    // Trend Chart
    new Chart(document.getElementById('trendChart'), {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'Monthly Recharges',
                data: [65, 59, 80, 81, 56, 55],
                borderColor: '#0d6efd',
                tension: 0.1
            }]
        },
        options: {
            responsive: true, // Make the chart responsive
            maintainAspectRatio: false, // Allow the chart to resize freely
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                }
            }
        }
    });

    // Pie Chart
    new Chart(document.getElementById('pieChart'), {
        type: 'pie',
        data: {
            labels: ['Basic', 'Standard', 'Premium'],
            datasets: [{
                data: [30, 40, 30],
                backgroundColor: ['#0d6efd', '#6610f2', '#6f42c1']
            }]
        },
        options: {
            responsive: true, // Make the chart responsive
            maintainAspectRatio: false, // Allow the chart to resize freely
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                }
            }
        }
    });

    // Doughnut Chart
    new Chart(document.getElementById('doughnutChart'), {
        type: 'doughnut',
        data: {
            labels: ['Credit Card', 'Debit Card', 'UPI', 'Net Banking'],
            datasets: [{
                data: [40, 20, 25, 15],
                backgroundColor: ['#0d6efd', '#6610f2', '#6f42c1', '#d63384']
            }]
        },
        options: {
            responsive: true, // Make the chart responsive
            maintainAspectRatio: false, // Allow the chart to resize freely
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                }
            }
        }
    });
};

// Plan Management
class PlanManager {
    constructor() {
        this.plans = JSON.parse(localStorage.getItem('plans')) || [];
        this.editModal = new bootstrap.Modal(document.getElementById('editModal'));
        this.setupEventListeners();
        this.renderPlans();
    }

    setupEventListeners() {
        document.getElementById('planForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addPlan();
        });
    }

    addPlan() {
        const plan = {
            id: Date.now(),
            name: document.getElementById('planName').value,
            price: document.getElementById('planPrice').value,
            data: document.getElementById('dataLimit').value,
            validity: document.getElementById('validity').value
        };

        this.plans.push(plan);
        this.savePlans();
        this.renderPlans();
        document.getElementById('planForm').reset();
    }

    deletePlan(id) {
        this.plans = this.plans.filter(plan => plan.id !== id);
        this.savePlans();
        this.renderPlans();
    }

    editPlan(id) {
        const plan = this.plans.find(p => p.id === id);
        document.getElementById('editId').value = plan.id;
        document.getElementById('editName').value = plan.name;
        document.getElementById('editPrice').value = plan.price;
        document.getElementById('editData').value = plan.data;
        document.getElementById('editValidity').value = plan.validity;
        this.editModal.show();
    }

    updatePlan() {
        const id = parseInt(document.getElementById('editId').value);
        const index = this.plans.findIndex(p => p.id === id);
        
        this.plans[index] = {
            id: id,
            name: document.getElementById('editName').value,
            price: document.getElementById('editPrice').value,
            data: document.getElementById('editData').value,
            validity: document.getElementById('editValidity').value
        };

        this.savePlans();
        this.renderPlans();
        this.editModal.hide();
    }

    savePlans() {
        localStorage.setItem('plans', JSON.stringify(this.plans));
    }

    renderPlans() {
        const tbody = document.getElementById('plansTable');
        tbody.innerHTML = '';
        
        this.plans.forEach(plan => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${plan.name}</td>
                <td>$${plan.price}</td>
                <td>${plan.data}</td>
                <td>${plan.validity} days</td>
                <td>
                    <button class="btn btn-sm me-1" onclick="planManager.editPlan(${plan.id})">Edit</button>
                    <button class="btn btn-sm" onclick="planManager.deletePlan(${plan.id})">Delete</button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }
}

// Initialize Plan Manager
const planManager = new PlanManager();

// Initialize Charts
document.addEventListener('DOMContentLoaded', createCharts);

// Expiring Plans Data (Dummy Data)
const expiringPlans = [
    { subscriber: 'Suresh', plan: 'Unlimited', expiryDate: '2023-12-01' },
    { subscriber: 'Ramesh', plan: 'Popular', expiryDate: '2023-11-25' },
    { subscriber: 'Kamalesh', plan: 'Unlimited', expiryDate: '2023-11-30' }
];

// Render Expiring Plans
const renderExpiringPlans = () => {
    const tbody = document.getElementById('expiringTable');
    tbody.innerHTML = '';
    
    expiringPlans.forEach(plan => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${plan.subscriber}</td>
            <td>${plan.plan}</td>
            <td>${plan.expiryDate}</td>
            <td>
                <button class="btn btn-sm bg-custom me-1" onclick="window.open('/project/User/html/details.html', '_blank')">View Details</button>
            </td>
        `;
        tbody.appendChild(row);
    });
};

// Render Expiring Plans on Page Load
document.addEventListener('DOMContentLoaded', renderExpiringPlans);

// Update Plan Function (used in the modal)
const updatePlan = () => {
    planManager.updatePlan();
};