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

    function showToast(message, type = 'success') {
        const toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container position-fixed bottom-0 end-0 p-3';
        document.body.appendChild(toastContainer);

        const toastElement = document.createElement('div');
        toastElement.className = `toast align-items-center text-bg-${type} border-0`;
        toastElement.setAttribute('role', 'alert');
        toastElement.setAttribute('aria-live', 'assertive');
        toastElement.setAttribute('aria-atomic', 'true');

        toastElement.innerHTML = `
            <div class="d-flex">
                <div class="toast-body">
                    ${message}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
        `;

        toastContainer.appendChild(toastElement);
        const toast = new bootstrap.Toast(toastElement);
        toast.show();

        toastElement.addEventListener('hidden.bs.toast', () => {
            toastElement.remove();
            toastContainer.remove();
        });
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
            showToast('Failed to load profile: ' + error.message, 'danger');
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

                showToast('Password changed successfully!', 'success');                passwordInput.value = '********'; // Reset to masked value after save
            } catch (error) {
                console.error('Error updating password:', error);
                showToast('Failed to update password: ' + error.message, 'danger'); 
            }
        }
    });

    // Back button
    document.getElementById('backBtn').addEventListener('click', function() {
        window.location.href = '../html/admin.html';
    });

    // Load profile data when page loads
    loadAdminProfile();
});