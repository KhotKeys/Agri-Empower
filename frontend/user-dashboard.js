// Agric-Empower User Dashboard - No Authentication Required
// Simple dashboard functionality without Firebase dependencies

const DEFAULT_AVATAR = './images/africa_numbers_cover.jpg';

// Store user info in localStorage
function storeUserInfo(userData) {
    localStorage.setItem('sf_user', JSON.stringify(userData));
}

// Update the UI with user info
function updateUserInfoDisplay(userData) {
    if (!userData) return;
    
    const userNameEl = document.getElementById('user-name');
    const roleEl = document.getElementById('user-role');
    const avatarEl = document.querySelector('.user-profile .avatar');
    
    if (userNameEl) userNameEl.textContent = userData.fullName || userData.firstName || 'User';
    if (roleEl) roleEl.textContent = userData.role ? userData.role.charAt(0).toUpperCase() + userData.role.slice(1) : 'Farmer';
    if (avatarEl) avatarEl.src = userData.profilePicUrl || DEFAULT_AVATAR;
    
    const welcomeMsg = document.getElementById('welcome-message');
    if (welcomeMsg) welcomeMsg.textContent = `Welcome back, ${userData.fullName || userData.firstName || 'User'}!`;
    
    const badge = document.getElementById('role-badge');
    if (badge) {
        badge.textContent = userData.role ? userData.role.charAt(0).toUpperCase() + userData.role.slice(1) : 'Farmer';
        badge.className = 'badge ' + (userData.role || 'farmer');
    }
    
    if (document.getElementById('user-email')) document.getElementById('user-email').textContent = userData.email || '';
    if (document.getElementById('user-location')) document.getElementById('user-location').textContent = userData.location || 'Rhino Refugee Camp';
    if (document.getElementById('user-phone')) document.getElementById('user-phone').textContent = userData.phone || '';
    
    // Show/hide admin section based on role
    if (userData.role === 'admin' && document.getElementById('admin-section')) {
        document.getElementById('admin-section').style.display = 'block';
    } else if (document.getElementById('admin-section')) {
        document.getElementById('admin-section').style.display = 'none';
    }
}

// Logout handler
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

// Generate random sensor data for demo
function generateSensorData() {
    return {
        ph: (6.0 + Math.random() * 1.5).toFixed(1),
        moisture: Math.floor(50 + Math.random() * 30),
        temperature: Math.floor(20 + Math.random() * 15),
        humidity: Math.floor(60 + Math.random() * 30)
    };
}

// Update sensor values on the dashboard
function updateSensorValues() {
    const data = generateSensorData();
    
    const phElement = document.getElementById('ph-value');
    const moistureElement = document.getElementById('moisture-value');
    const temperatureElement = document.getElementById('temperature-value');
    const humidityElement = document.getElementById('humidity-value');
    
    if (phElement) phElement.textContent = data.ph;
    if (moistureElement) moistureElement.textContent = data.moisture + '%';
    if (temperatureElement) temperatureElement.textContent = data.temperature + '°C';
    if (humidityElement) humidityElement.textContent = data.humidity + '%';
}

// Initialize chart if Chart.js is available
function initializeChart() {
    const chartCanvas = document.getElementById('soilHealthChart');
    if (chartCanvas && typeof Chart !== 'undefined') {
        const ctx = chartCanvas.getContext('2d');
        
        // Generate sample data for the last 7 days
        const labels = [];
        const phData = [];
        const moistureData = [];
        
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            labels.push(date.toLocaleDateString('en-US', { weekday: 'short' }));
            phData.push((6.0 + Math.random() * 1.5).toFixed(1));
            moistureData.push(Math.floor(50 + Math.random() * 30));
        }
        
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Soil pH',
                    data: phData,
                    borderColor: '#388E3C',
                    backgroundColor: 'rgba(56, 142, 60, 0.1)',
                    tension: 0.4
                }, {
                    label: 'Soil Moisture (%)',
                    data: moistureData,
                    borderColor: '#EF6C00',
                    backgroundColor: 'rgba(239, 108, 0, 0.1)',
                    tension: 0.4,
                    yAxisID: 'y1'
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Soil Health Trends (Last 7 Days)'
                    }
                },
                scales: {
                    y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        title: {
                            display: true,
                            text: 'pH Level'
                        }
                    },
                    y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        title: {
                            display: true,
                            text: 'Moisture (%)'
                        },
                        grid: {
                            drawOnChartArea: false,
                        },
                    }
                }
            }
        });
    }
}

// Main initialization
document.addEventListener('DOMContentLoaded', () => {
    console.log('🌱 Agric-Empower Dashboard Loading...');
    
    // Check for stored user data, otherwise use demo user
    const storedUser = localStorage.getItem('sf_user');
    let userData;
    
    if (storedUser) {
        try {
            userData = JSON.parse(storedUser);
            console.log('Using stored user data:', userData);
        } catch (e) {
            console.error('Invalid stored user data:', e);
            localStorage.removeItem('sf_user');
            userData = null;
        }
    }
    
    // Use demo user if no stored data
    if (!userData) {
        userData = {
            fullName: 'Demo Farmer',
            role: 'farmer',
            email: 'demo@agric-empower.org',
            location: 'Rhino Refugee Camp, Uganda',
            phone: '+256 774 330 491',
            profilePicUrl: DEFAULT_AVATAR,
            joinDate: new Date().toISOString()
        };
        storeUserInfo(userData);
    }
    
    // Update UI with user info
    updateUserInfoDisplay(userData);
    
    // Update sensor values
    updateSensorValues();
    
    // Set up periodic updates for sensor data (every 30 seconds)
    setInterval(updateSensorValues, 30000);
    
    // Initialize chart
    setTimeout(initializeChart, 500); // Small delay to ensure DOM is ready
    
    // Setup logout functionality
    setupLogout();
    
    // Setup mobile menu
    setupMobileMenu();
    
    console.log('✅ Agric-Empower Dashboard loaded successfully - No authentication required');
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
window.AgricEmpowerDashboard = {
    updateUserInfoDisplay,
    updateSensorValues,
    generateSensorData
};