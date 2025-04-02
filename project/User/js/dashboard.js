const BASE_URL = 'http://localhost:8084';

// Utility to get token and user data
const getUserData = () => JSON.parse(localStorage.getItem('user')) || {};

// Update profile info and handle login state
const updateAuthButtonAndProfile = () => {
    const user = getUserData();
    const profileDropdown = document.getElementById('profileDropdown'); // Use existing dropdown instead of authButton
    
    if (!profileDropdown) {
        console.error('Element with ID "profileDropdown" not found');
        return;
    }

    if (user.token) {
        // User is logged in
        profileDropdown.style.display = 'block'; // Show dropdown
        document.getElementById('profileName').textContent = user.name || 'User';
        document.getElementById('sidebarName').textContent = user.name || 'User';
        document.getElementById('sidebarMobile').value = user.mobile || '+91 Unknown';
    } else {
        // User is not logged in
        profileDropdown.style.display = 'none'; // Hide dropdown
        console.log('No token found, redirecting to OTP page');
        window.location.href = '/project/User/html/otp.html'; // Redirect to login
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
        const response = await fetch(`${BASE_URL}/transactions/user/${user.id || 1}`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${user.token}` }
        });
        if (!response.ok) throw new Error('Failed to fetch transactions');
        const transactions = await response.json();
        displayTransactions(transactions);
    } catch (error) {
        console.error('Error fetching transactions:', error);
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
        tbody.innerHTML += `
            <tr>
                <td>${tx.id}</td>
                <td>${tx.user.username}</td>
                <td>${tx.paymentMode || 'Online'}</td>
                <td>₹${tx.amount}</td>
                <td>${tx.status}</td>
                <td>${new Date(tx.transactionDate).toLocaleDateString()}</td>
            </tr>`;
    });
};

// Logout functionality
const logout = async () => {
    const user = getUserData();
    if (!user.token) return;

    try {
        await fetch(`${BASE_URL}/users/logout`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${user.token}` }
        });
        localStorage.removeItem('user');
        updateAuthButtonAndProfile();
    } catch (error) {
        console.error('Logout failed:', error);
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