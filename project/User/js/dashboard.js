const BASE_URL = 'http://localhost:8084';

// Utility to get token and user data
const getUserData = () => JSON.parse(localStorage.getItem('user')) || {};

// Update profile info and handle login state
const updateAuthButtonAndProfile = () => {
    const user = getUserData();
    const profileDropdown = document.getElementById('profileDropdown');

    if (!profileDropdown) {
        console.error('Element with ID "profileDropdown" not found');
        return;
    }

    if (user.token) {
        // User is logged in
        profileDropdown.style.display = 'block';
        document.getElementById('profileName').textContent = user.name || 'User';
        document.getElementById('sidebarName').textContent = user.name || 'User';
        document.getElementById('sidebarMobile').value = user.mobile || '+91 Unknown';
    } else {
        // User is not logged in
        profileDropdown.style.display = 'none';
        console.log('No token found, redirecting to OTP page');
        window.location.href = '/project/User/html/otp.html';
    }
};

// Fetch transaction history
const fetchTransactions = async () => {
    const user = getUserData();
    if (!user.token) {
        console.log('No token found, redirecting to login');
        window.location.href = '/project/User/html/otp.html';
        return;
    }

    try {
        console.log("User from localStorage:", user);
        const response = await fetch(`${BASE_URL}/transactions`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${user.token}` }        });
        if (!response.ok) {
            if (response.status === 401) {
                // Token expired or invalid, redirect to login
                console.log('Unauthorized, redirecting to login');
                localStorage.removeItem('user');
                window.location.href = '/project/User/html/otp.html';
                return;
            }
            throw new Error(`Failed to fetch transactions: ${response.statusText}`);
        }
        const transactions = await response.json();
        displayTransactions(transactions);
    } catch (error) {
        console.error('Error fetching transactions:', error);
        alert('Failed to load transactions. Please try again later.');
    }
};

// Display transactions
const displayTransactions = (transactions) => {
    const tbody = document.getElementById('transactionTableBody');
    if (!tbody) {
        console.error('Element with ID "transactionTableBody" not found');
        return;
    }
    tbody.innerHTML = '';
    transactions.forEach(tx => {
        const dateParts = tx.tran_date.split('-');
        const transactionDate = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
        const formattedDate = isNaN(transactionDate) ? 'Invalid Date' : transactionDate.toLocaleDateString();
        tbody.innerHTML += `
            <tr>
                <td>${tx.transId}</td>
                <td>${tx.user.username}</td>
                <td>${tx.paymentMode}</td>
                <td>₹${tx.amount}</td>
                <td>${tx.validity || 'N/A'} Days</td>
                <td>${tx.status}</td>
                <td>${formattedDate}</td>
            </tr>`;
    });
};

// Logout functionality
const logout = async () => {
    const user = getUserData();
    if (!user.token) {
        window.location.href = '/project/User/html/index.html';
        return;
    }

    try {
        const response = await fetch(`${BASE_URL}/users/logout`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${user.token}` }
        });
        if (!response.ok) {
            throw new Error('Logout failed');
        }
    } catch (error) {
        console.error('Logout failed:', error);
    } finally {
        // Always clear localStorage and redirect, even if logout fails
        localStorage.removeItem('user');
        window.location.href = '/project/User/html/index.html';
    }
};

// Scroll to top
const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

// Sidebar Toggle
const toggleSidebar = () => {
    const sidebar = document.getElementById('sidebar');
    if (sidebar) sidebar.classList.toggle('show');
};

// Notification Panel Toggle
const toggleNotificationPanel = () => {
    const notificationPanel = document.getElementById('notificationPanel');
    if (notificationPanel) notificationPanel.classList.toggle('show');
};

// Close Notification Panel
const closeNotificationPanel = () => {
    const notificationPanel = document.getElementById('notificationPanel');
    if (notificationPanel) notificationPanel.classList.remove('show');
};

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    // DOM elements
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebarToggle');
    const notificationBtn = document.getElementById('notificationBtn');
    const closeNotificationBtn = document.getElementById('closeNotificationBtn');
    const notificationPanel = document.getElementById('notificationPanel');

    // Initialize page
    updateAuthButtonAndProfile();
    fetchTransactions();

    // Event listeners for existing functionality
    const logoutLink = document.getElementById('logoutLink');
    if (logoutLink) logoutLink.addEventListener('click', logout);

    const scrollBtn = document.getElementById('scrollToTopBtn');
    if (scrollBtn) scrollBtn.addEventListener('click', scrollToTop);

    if (notificationBtn) {
        notificationBtn.addEventListener('click', () => {
            if (notificationPanel) notificationPanel.style.right = '0';
        });
    }

    if (closeNotificationBtn) {
        closeNotificationBtn.addEventListener('click', () => {
            if (notificationPanel) notificationPanel.style.right = '-300px';
        });
    }

    // Event listeners for sidebar and notification panel
    if (sidebarToggle) sidebarToggle.addEventListener('click', toggleSidebar);
    if (notificationBtn) notificationBtn.addEventListener('click', toggleNotificationPanel);
    if (closeNotificationBtn) closeNotificationBtn.addEventListener('click', closeNotificationPanel);

    // Close sidebar and notification panel when clicking outside
    document.addEventListener('click', function(e) {
        if (sidebar && sidebar.classList.contains('show') && 
            !sidebar.contains(e.target) && e.target !== sidebarToggle) {
            sidebar.classList.remove('show');
        }
        if (notificationPanel && notificationPanel.classList.contains('show') && 
            !notificationPanel.contains(e.target) && e.target !== notificationBtn) {
            closeNotificationPanel();
        }
    });
});