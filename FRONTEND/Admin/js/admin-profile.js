document.addEventListener('DOMContentLoaded', function() {
    const passwordInput = document.getElementById('password');
    const togglePasswordBtn = document.getElementById('togglePassword');
    const toggleIcon = togglePasswordBtn.querySelector('i');
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

    // Fetch admin profile data
    async function loadAdminProfile() {
        try {
            const response = await fetch(`${API_BASE_URL}/users/profile`, {
                method: 'GET',
                headers: getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error('Failed to fetch profile data');
            }

            const adminData = await response.json();
            
            // Populate form fields with fetched data
            document.getElementById('firstName').value = adminData.firstName || '';
            document.getElementById('lastName').value = adminData.lastName || '';
            document.getElementById('username').value = adminData.username || '';
            document.getElementById('password').value = adminData.password ? '********' : ''; // Mask password
            document.getElementById('email').value = adminData.email || '';
            document.getElementById('phoneNumber').value = adminData.phone || '';
        } catch (error) {
            console.error('Error loading profile:', error);
            alert('Failed to load profile: ' + error.message);
        }
    }

    // Toggle password visibility
    togglePasswordBtn.addEventListener('click', function() {
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            toggleIcon.classList.remove('fa-eye');
            toggleIcon.classList.add('fa-eye-slash');
        } else {
            passwordInput.type = 'password';
            toggleIcon.classList.remove('fa-eye-slash');
            toggleIcon.classList.add('fa-eye');
        }
    });

    // Handle form submission
    const profileForm = document.getElementById('profileForm');
    profileForm.addEventListener('submit', async function(event) {
        event.preventDefault();
        const newPassword = document.getElementById('password').value;

        // Only send update if password has been changed from the masked value
        if (newPassword !== '********') {
            const formData = {
                password: newPassword
            };
            
            try {
                const response = await fetch(`${API_BASE_URL}/users/update-password`, {
                    method: 'PUT',
                    headers: getAuthHeaders(),
                    body: JSON.stringify(formData)
                });

                if (!response.ok) {
                    throw new Error('Failed to update password');
                }

                alert('Password changed successfully!');
                passwordInput.value = '********'; // Reset to masked value after save
            } catch (error) {
                console.error('Error updating password:', error);
                alert('Failed to update password: ' + error.message);
            }
        }
    });

    // Back button
    document.getElementById('backBtn').addEventListener('click', function() {
        window.location.href = '/project/Admin/html/admin.html';
    });

    // Load profile data when page loads
    loadAdminProfile();
});