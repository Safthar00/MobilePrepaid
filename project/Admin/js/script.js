// Global variables for data
let expiringPlansData;
let usersData;
let rechargePlansData;
let transactionsData;
let rechargeHistoryData;

// Format date as DD/MM/YYYY
function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

// Load Expiring Plans table
function loadExpiringPlans() {
    const tableBody = document.querySelector('#expiring-plans-table tbody');
    tableBody.innerHTML = '';
    expiringPlansData.forEach(plan => {
        const today = new Date();
        const expiryDate = new Date(plan.expiry);
        const diffTime = expiryDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        let badgeClass = 'badge bg-success';
        if (diffDays <= 1) badgeClass = 'badge bg-danger';
        else if (diffDays <= 3) badgeClass = 'badge bg-warning text-dark';
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${plan.name}</td>
            <td>${plan.phone}</td>
            <td>${plan.plan}</td>
            <td>${formatDate(plan.expiry)} <span class="${badgeClass}">${diffDays} day${diffDays !== 1 ? 's' : ''}</span></td>
            <td>
                <button class="btn btn-sm btn-outline-primary view-history-btn" data-user-id="${plan.id}" data-user-name="${plan.name}">
                    <i class="fas fa-history"></i> View History
                </button>
                <button class="btn btn-sm btn-outline-success call-btn" data-phone="${plan.phone}">
                    <i class="fas fa-phone"></i> Call
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });
    document.querySelectorAll('.view-history-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const userId = this.getAttribute('data-user-id');
            const userName = this.getAttribute('data-user-name');
            openRechargeHistoryModal(userId, userName);
        });
    });
}

// Open Recharge History Modal
function openRechargeHistoryModal(userId, userName) {
    document.getElementById('historyUserName').textContent = userName;
    const historyTableBody = document.querySelector('#rechargeHistoryTable tbody');
    historyTableBody.innerHTML = '';
    const history = rechargeHistoryData[userId] || [];
    history.forEach(recharge => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${recharge.plan}</td>
            <td>₹${recharge.amount}</td>
            <td>${formatDate(recharge.date)}</td>
            <td>${recharge.status}</td>
        `;
        historyTableBody.appendChild(row);
    });
    new bootstrap.Modal(document.getElementById('rechargeHistoryModal')).show();
}

// Load User Management table with Status and Actions
function loadUsers() {
    const tableBody = document.querySelector('#users-table tbody');
    tableBody.innerHTML = '';
    usersData.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.id}</td>
            <td>${user.name}</td>
            <td>${user.phone}</td>
            <td>${user.email}</td>
            <td>${formatDate(user.registrationDate)}</td>
            <td><span class="badge ${user.status === 'Active' ? 'bg-success' : 'bg-danger'}">${user.status}</span></td>
            <td>
                <button class="btn btn-sm btn-outline-primary toggle-status-btn" data-user-id="${user.id}">
                    <i class="fas fa-sync-alt"></i> Toggle Status
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });
    document.querySelectorAll('.toggle-status-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const userId = this.getAttribute('data-user-id');
            toggleUserStatus(userId);
        });
    });
}

// Toggle User Status
function toggleUserStatus(userId) {
    const user = usersData.find(u => u.id == userId);
    if (user) {
        user.status = user.status === 'Active' ? 'Inactive' : 'Active';
        loadUsers(); // Reload the table
        loadAnalytics(); // Update analytics
    }
}

// Load Recharge Plans table
function loadRechargePlans() {
    const tableBody = document.querySelector('#plans-table tbody');
    tableBody.innerHTML = '';
    rechargePlansData.forEach(plan => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${plan.id}</td>
            <td>${plan.name}</td>
            <td>₹${plan.price}</td>
            <td>${plan.data}</td>
            <td>${plan.validity} days</td>
            <td>${plan.benefits}</td>
            <td>
                <button class="btn btn-sm btn-outline-primary edit-plan-btn" data-plan-id="${plan.id}">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="btn btn-sm btn-outline-danger delete-plan-btn" data-plan-id="${plan.id}">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });
    document.querySelectorAll('.edit-plan-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const planId = this.getAttribute('data-plan-id');
            openPlanFormModal('edit', planId);
        });
    });
    document.querySelectorAll('.delete-plan-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const planId = this.getAttribute('data-plan-id');
            deletePlan(planId);
        });
    });
}

// Open Plan Form Modal for Add/Edit
function openPlanFormModal(mode, planId = null) {
    const modal = new bootstrap.Modal(document.getElementById('planFormModal'));
    const form = document.getElementById('planForm');
    form.reset();
    document.getElementById('planId').value = '';
    if (mode === 'edit') {
        const plan = rechargePlansData.find(p => p.id == planId);
        if (plan) {
            document.getElementById('planId').value = plan.id;
            document.getElementById('planName').value = plan.name;
            document.getElementById('planPrice').value = plan.price;
            document.getElementById('planData').value = plan.data;
            document.getElementById('planValidity').value = plan.validity;
            document.getElementById('planBenefits').value = plan.benefits;
        }
    }
    modal.show();
}

// Save Plan (Add or Edit)
function savePlan() {
    const id = document.getElementById('planId').value;
    const name = document.getElementById('planName').value;
    const price = parseFloat(document.getElementById('planPrice').value);
    const data = document.getElementById('planData').value;
    const validity = parseInt(document.getElementById('planValidity').value);
    const benefits = document.getElementById('planBenefits').value;

    if (!name || isNaN(price) || !data || isNaN(validity) || !benefits) {
        alert('Please fill in all fields correctly.');
        return;
    }

    if (id) {
        const plan = rechargePlansData.find(p => p.id == id);
        if (plan) {
            plan.name = name;
            plan.price = price;
            plan.data = data;
            plan.validity = validity;
            plan.benefits = benefits;
        }
    } else {
        const newId = rechargePlansData.length ? Math.max(...rechargePlansData.map(p => p.id)) + 1 : 1;
        rechargePlansData.push({ id: newId, name, price, data, validity, benefits });
    }
    loadRechargePlans();
    bootstrap.Modal.getInstance(document.getElementById('planFormModal')).hide();
}

// Delete Plan
function deletePlan(planId) {
    if (confirm('Are you sure you want to delete this plan?')) {
        rechargePlansData = rechargePlansData.filter(p => p.id != planId);
        loadRechargePlans();
    }
}

// Load Transactions table
function loadTransactions() {
    const tableBody = document.querySelector('#transactions-table tbody');
    tableBody.innerHTML = '';
    transactionsData.forEach(transaction => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${transaction.id}</td>
            <td>${transaction.customerName}</td>
            <td>${transaction.phone}</td>
            <td>${transaction.plan}</td>
            <td>₹${transaction.amount}</td>
            <td>${formatDate(transaction.date)}</td>
            <td>${transaction.paymentMode}</td>
            <td>
                <button class="btn btn-sm btn-outline-primary view-invoice-btn" data-transaction-id="${transaction.id}">
                    <i class="fas fa-eye"></i> View
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });
    document.querySelectorAll('.view-invoice-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const transactionId = this.getAttribute('data-transaction-id');
            openInvoiceModal(transactionId);
        });
    });
}

// Open Invoice Modal
function openInvoiceModal(transactionId) {
    const transaction = transactionsData.find(t => t.id == transactionId);
    if (transaction) {
        document.getElementById('invoiceCustomerName').textContent = transaction.customerName;
        document.getElementById('invoicePhone').textContent = transaction.phone;
        document.getElementById('invoicePlan').textContent = transaction.plan;
        document.getElementById('invoiceAmount').textContent = `₹${transaction.amount}`;
        document.getElementById('invoiceDate').textContent = formatDate(transaction.date);
        document.getElementById('invoicePaymentMode').textContent = transaction.paymentMode;
        document.getElementById('downloadInvoiceBtn').setAttribute('data-transaction-id', transactionId);
        new bootstrap.Modal(document.getElementById('invoiceModal')).show();
    }
}

// Download Invoice
function downloadInvoice(transactionId) {
    const transaction = transactionsData.find(t => t.id == transactionId);
    if (transaction) {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        doc.setFontSize(18);
        doc.text('Invoice', 105, 20, { align: 'center' });
        doc.setFontSize(12);
        doc.text(`Transaction ID: ${transaction.id}`, 20, 40);
        doc.text(`Customer Name: ${transaction.customerName}`, 20, 50);
        doc.text(`Phone Number: ${transaction.phone}`, 20, 60);
        doc.text(`Plan: ${transaction.plan}`, 20, 70);
        doc.text(`Amount: ₹${transaction.amount}`, 20, 80);
        doc.text(`Date: ${formatDate(transaction.date)}`, 20, 90);
        doc.text(`Payment Mode: ${transaction.paymentMode}`, 20, 100);
        doc.save(`invoice_${transaction.id}.pdf`);
    }
}

// Load Analytics Expiring Plans table (without Actions)
function loadAnalyticsExpiringPlans() {
    const tableBody = document.querySelector('#analytics-expiring-plans-table tbody');
    tableBody.innerHTML = '';
    expiringPlansData.forEach(plan => {
        const today = new Date();
        const expiryDate = new Date(plan.expiry);
        const diffTime = expiryDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        let badgeClass = 'badge bg-success';
        if (diffDays <= 1) badgeClass = 'badge bg-danger';
        else if (diffDays <= 3) badgeClass = 'badge bg-warning text-dark';
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${plan.name}</td>
            <td>${plan.phone}</td>
            <td>${plan.plan}</td>
            <td>${formatDate(plan.expiry)} <span class="${badgeClass}">${diffDays} day${diffDays !== 1 ? 's' : ''}</span></td>
        `;
        tableBody.appendChild(row);
    });
}

// Load Analytics (Charts and Metrics)
function loadAnalytics() {
    const totalSubscribers = usersData.length;
    const activePlans = usersData.filter(u => u.status === 'Active').length;
    const revenue = transactionsData.reduce((sum, t) => sum + t.amount, 0);
    const inactiveUsers = usersData.filter(u => u.status === 'Inactive').length;
    const expiringPlans = expiringPlansData.length;

    document.getElementById('totalSubscribers').textContent = totalSubscribers;
    document.getElementById('activePlans').textContent = activePlans;
    document.getElementById('revenue').textContent = `₹${revenue}`;
    document.getElementById('inactiveUsers').textContent = inactiveUsers;
    document.getElementById('expiringPlans').textContent = expiringPlans;

    const registrationDates = usersData.map(user => new Date(user.registrationDate));
    const minDate = new Date(Math.min(...registrationDates));
    const maxDate = new Date(Math.max(...registrationDates));
    const months = [];
    let current = new Date(minDate.getFullYear(), minDate.getMonth(), 1);
    while (current <= maxDate) {
        months.push(current.toISOString().slice(0, 7));
        current.setMonth(current.getMonth() + 1);
    }
    const subscribersGrowth = months.map(month => {
        return usersData.filter(user => user.registrationDate <= month + "-31").length;
    });
    new Chart(document.getElementById('subscribersGrowthChart').getContext('2d'), {
        type: 'line',
        data: {
            labels: months,
            datasets: [{
                label: 'Subscribers',
                data: subscribersGrowth,
                borderColor: 'blue',
                fill: false
            }]
        },
        options: { scales: { y: { beginAtZero: true } } }
    });

    const paymentModes = transactionsData.map(t => t.paymentMode);
    const paymentModeCounts = {};
    paymentModes.forEach(mode => {
        paymentModeCounts[mode] = (paymentModeCounts[mode] || 0) + 1;
    });
    new Chart(document.getElementById('paymentMethodChart').getContext('2d'), {
        type: 'pie',
        data: {
            labels: Object.keys(paymentModeCounts),
            datasets: [{ data: Object.values(paymentModeCounts), backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'] }]
        }
    });

    const revenueByMonth = {};
    transactionsData.forEach(t => {
        const date = new Date(t.date);
        const month = date.toISOString().slice(0, 7);
        revenueByMonth[month] = (revenueByMonth[month] || 0) + t.amount;
    });
    const sortedMonths = Object.keys(revenueByMonth).sort();
    new Chart(document.getElementById('revenueTrendChart').getContext('2d'), {
        type: 'bar',
        data: {
            labels: sortedMonths,
            datasets: [{ label: 'Revenue', data: sortedMonths.map(m => revenueByMonth[m]), backgroundColor: 'green' }]
        },
        options: { scales: { y: { beginAtZero: true } } }
    });

    const planCounts = {};
    transactionsData.forEach(t => {
        planCounts[t.plan] = (planCounts[t.plan] || 0) + 1;
    });
    const sortedPlans = Object.entries(planCounts).sort((a, b) => b[1] - a[1]);
    const topPlans = sortedPlans.slice(0, 3);
    const planLabels = topPlans.map(p => p[0]);
    const planData = topPlans.map(p => p[1]);
    new Chart(document.getElementById('popularPlansChart').getContext('2d'), {
        type: 'bar',
        data: {
            labels: planLabels,
            datasets: [{ label: 'Number of Recharges', data: planData, backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'] }]
        },
        options: { scales: { y: { beginAtZero: true } } }
    });
}

// Download Transactions PDF
function downloadTransactionsPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.text('Transaction History', 20, 20);
    doc.autoTable({
        html: '#transactions-table',
        startY: 30,
        theme: 'striped',
        headStyles: { fillColor: [26, 35, 126] }
    });
    doc.save('transaction_history.pdf');
}

// Add Search Functionality
function addSearchFunctionality(searchInputId, tableId) {
    const searchInput = document.getElementById(searchInputId);
    searchInput.addEventListener('input', function() {
        const query = this.value.toLowerCase();
        const rows = document.querySelectorAll(`#${tableId} tbody tr`);
        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            row.style.display = text.includes(query) ? '' : 'none';
        });
    });
}

// Fetch Data from JSON
async function loadData() {
    try {
        const response = await fetch('/project/Admin/json/data.json');
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        expiringPlansData = data.expiringPlans;
        usersData = data.users;
        rechargePlansData = data.rechargePlans;
        transactionsData = data.transactions;
        rechargeHistoryData = data.rechargeHistory;

        loadExpiringPlans();
        loadUsers();
        loadRechargePlans();
        loadTransactions();
        loadAnalyticsExpiringPlans();
        loadAnalytics();

        addSearchFunctionality('expiring-plans-search', 'expiring-plans-table');
        addSearchFunctionality('user-search', 'users-table');
        addSearchFunctionality('plans-search', 'plans-table');
        addSearchFunctionality('transactions-search', 'transactions-table');
    } catch (error) {
        console.error('Error loading data:', error);
    }
}

// Initialize on Page Load
document.addEventListener('DOMContentLoaded', function() {
    loadData();

    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section-content');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            sections.forEach(section => section.classList.add('d-none'));
            const sectionId = this.getAttribute('data-section');
            document.getElementById(sectionId).classList.remove('d-none');
        });
    });

    document.getElementById('sidebarCollapse').addEventListener('click', function() {
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

    document.getElementById('add-plan-btn').addEventListener('click', () => openPlanFormModal('add'));
    document.getElementById('savePlanBtn').addEventListener('click', savePlan);
    document.getElementById('downloadInvoiceBtn').addEventListener('click', function() {
        const transactionId = this.getAttribute('data-transaction-id');
        downloadInvoice(transactionId);
    });
    document.getElementById('downloadTransactionsBtn').addEventListener('click', downloadTransactionsPDF);
    document.getElementById('logoutBtn').addEventListener('click', function() {
        alert('Logging out...');
        window.location.href="/project/Admin/html/admin-login.html";
    });
});