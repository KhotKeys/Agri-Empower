// Agric-Empower Admin Dashboard - No Authentication Required
// Simple admin dashboard functionality without Firebase dependencies

const DEFAULT_AVATAR = './images/africa_numbers_cover.jpg';

// Store user info in localStorage
function storeUserInfo(userData) {
    localStorage.setItem('sf_user', JSON.stringify(userData));
}

// Update the UI with admin info
function updateUserInfoDisplay(userData) {
    if (!userData) return;
    
    const adminNameEl = document.getElementById('admin-name');
    const adminRoleEl = document.getElementById('admin-role');
    const avatarEl = document.querySelector('.user-profile .avatar');
    
    if (adminNameEl) adminNameEl.textContent = userData.fullName || userData.firstName || 'Admin';
    if (adminRoleEl) adminRoleEl.textContent = userData.role ? userData.role.charAt(0).toUpperCase() + userData.role.slice(1) : 'Administrator';
    if (avatarEl) avatarEl.src = userData.profilePicUrl || DEFAULT_AVATAR;
}

// Setup logout functionality
function setupLogout() {
    const logoutButton = document.getElementById('logout-btn');
    if (logoutButton) {
        logoutButton.addEventListener('click', async (e) => {
            e.preventDefault();
            
            // Clear local storage
            localStorage.clear();
            
            // Show logout message
            alert('You have been logged out successfully!');
            
            // Redirect to home page
            window.location.href = 'index.html';
        });
    }
}

// Generate demo user data
function generateDemoUsers() {
    return [
        {
            fullName: 'John Doe',
            email: 'john.doe@agric-empower.org',
            role: 'farmer',
            createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
            status: 'active'
        },
        {
            fullName: 'Jane Smith',
            email: 'jane.smith@agric-empower.org',
            role: 'farmer',
            createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 14 days ago
            status: 'active'
        },
        {
            fullName: 'Mike Johnson',
            email: 'mike.johnson@agric-empower.org',
            role: 'admin',
            createdAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000), // 21 days ago
            status: 'active'
        },
        {
            fullName: 'Sarah Wilson',
            email: 'sarah.wilson@agric-empower.org',
            role: 'farmer',
            createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
            status: 'active'
        },
        {
            fullName: 'David Brown',
            email: 'david.brown@agric-empower.org',
            role: 'farmer',
            createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
            status: 'active'
        }
    ];
}

// Populate users table with demo data
function populateUsersTable() {
    const usersTableBody = document.getElementById('users-table-body');
    const totalUsersCountEl = document.getElementById('total-users-count');
    
    if (!usersTableBody) return;
    
    const demoUsers = generateDemoUsers();
    
    // Update total users count
    if (totalUsersCountEl) {
        totalUsersCountEl.textContent = demoUsers.length;
    }
    
    // Populate table
    usersTableBody.innerHTML = demoUsers.map(user => {
        const regDate = user.createdAt.toLocaleDateString();
        return `
            <tr>
                <td>${user.fullName}</td>
                <td>${user.email}</td>
                <td><span class="role-badge ${user.role}">${user.role.charAt(0).toUpperCase() + user.role.slice(1)}</span></td>
                <td>${regDate}</td>
                <td><span class="status-active">Active</span></td>
            </tr>
        `;
    }).join('');
}

// Initialize charts if Chart.js is available
function initializeCharts() {
    // User Activity Chart
    const userActivityCanvas = document.getElementById('userActivityChart');
    if (userActivityCanvas && typeof Chart !== 'undefined') {
        const ctx = userActivityCanvas.getContext('2d');
        
        // Generate sample data for the last 7 days
        const labels = [];
        const signupData = [];
        
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            labels.push(date.toLocaleDateString('en-US', { weekday: 'short' }));
            signupData.push(Math.floor(Math.random() * 10) + 1);
        }
        
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'New Signups',
                    data: signupData,
                    borderColor: '#388E3C',
                    backgroundColor: 'rgba(56, 142, 60, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'User Signups (Last 7 Days)'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Number of Signups'
                        }
                    }
                }
            }
        });
    }
    
    // User Roles Chart
    const userRolesCanvas = document.getElementById('userRolesChart');
    if (userRolesCanvas && typeof Chart !== 'undefined') {
        const ctx = userRolesCanvas.getContext('2d');
        
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Farmers', 'Admins'],
                datasets: [{
                    data: [4, 1], // Based on demo data
                    backgroundColor: ['#388E3C', '#EF6C00'],
                    borderWidth: 2,
                    borderColor: '#fff'
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'User Distribution by Role'
                    },
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }
}

// Main initialization
document.addEventListener('DOMContentLoaded', () => {
    console.log('🛡️ Agric-Empower Admin Dashboard Loading...');
    
    // Check for stored user data, otherwise use demo admin
    const storedUser = localStorage.getItem('sf_user');
    let userData;
    
    if (storedUser) {
        try {
            userData = JSON.parse(storedUser);
            console.log('Using stored admin data:', userData);
        } catch (e) {
            console.error('Invalid stored user data:', e);
            localStorage.removeItem('sf_user');
            userData = null;
        }
    }
    
    // Use demo admin if no stored data or if user is not admin
    if (!userData || userData.role !== 'admin') {
        userData = {
            fullName: 'Demo Admin',
            role: 'admin',
            email: 'admin@agric-empower.org',
            location: 'Rhino Refugee Camp, Uganda',
            phone: '+256 774 330 491',
            profilePicUrl: DEFAULT_AVATAR,
            joinDate: new Date().toISOString()
        };
        storeUserInfo(userData);
    }
    
    // Update UI with admin info
    updateUserInfoDisplay(userData);
    
    // Populate users table with demo data
    populateUsersTable();
    
    // Initialize charts
    setTimeout(initializeCharts, 500); // Small delay to ensure DOM is ready
    
    // Setup logout functionality
    setupLogout();
    
    // Setup mobile menu
    setupMobileMenu();
    
    console.log('✅ Agric-Empower Admin Dashboard loaded successfully - No authentication required');
});

// Setup mobile menu functionality
function setupMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const sidebar = document.querySelector('.sidebar');
    
    if (mobileMenuBtn && sidebar) {
        mobileMenuBtn.addEventListener('click', function() {
            sidebar.classList.toggle('active');
        });
        
        // Close sidebar when clicking outside
        document.addEventListener('click', function(e) {
            if (!sidebar.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                sidebar.classList.remove('active');
            }
        });
    }
}

// Export functions for potential use in other scripts
window.AgricEmpowerAdmin = {
    updateUserInfoDisplay,
    populateUsersTable,
    generateDemoUsers
};