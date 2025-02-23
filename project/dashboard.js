// Theme Management
function toggleTheme() {
    const body = document.body;
    if (body.getAttribute('data-theme') === 'dark') {
        body.removeAttribute('data-theme');
        localStorage.setItem('theme', 'light');
    } else {
        body.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
    }
}

// Initialize theme from localStorage
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.body.setAttribute('data-theme', savedTheme);
});

// Load Section Functionality (Placeholder)
function loadSection(section) {
    console.log(`Loading section: ${section}`);
    // You can implement AJAX or fetch calls here to load different sections dynamically
}

// Toggle Chat Functionality (Placeholder)
function toggleChat() {
    console.log('Chat toggled');
    // Implement chat widget toggle functionality here
}

// Sidebar Toggle for Mobile (Placeholder)
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('show');
}

// Add event listener for mobile sidebar toggle
document.addEventListener('DOMContentLoaded', () => {
    const sidebarToggle = document.createElement('button');
    sidebarToggle.className = 'btn btn-primary d-md-none';
    sidebarToggle.innerHTML = '<i class="fas fa-bars"></i>';
    sidebarToggle.style.position = 'fixed';
    sidebarToggle.style.top = '1rem';
    sidebarToggle.style.left = '1rem';
    sidebarToggle.style.zIndex = '1000';
    sidebarToggle.onclick = toggleSidebar;
    document.body.appendChild(sidebarToggle);
});

