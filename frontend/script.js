// Agric-Empower Main Script - No Firebase Dependencies
// Simple functionality without authentication requirements

const currentPath = window.location.pathname;

// Utility: Store user info in localStorage
function storeUserInfo(userData) {
    localStorage.setItem('sf_user', JSON.stringify(userData));
}

// Utility: Get user info from localStorage
function getUserInfo() {
    const data = localStorage.getItem('sf_user');
    return data ? JSON.parse(data) : null;
}

// Utility: Update user info display on any dashboard page
function updateUserInfoDisplay() {
    const userData = getUserInfo();
    if (!userData) return;
    
    // Farmer/General dashboard elements
    const userNameEl = document.getElementById('user-name');
    const roleEl = document.getElementById('user-role');
    if (userNameEl) userNameEl.textContent = userData.fullName || userData.firstName || 'User';
    if (roleEl) roleEl.textContent = userData.role ? userData.role.charAt(0).toUpperCase() + userData.role.slice(1) : 'Farmer';
    
    // Admin dashboard elements
    const adminNameEl = document.getElementById('admin-name');
    const adminRoleEl = document.getElementById('admin-role');
    if (adminNameEl) adminNameEl.textContent = userData.fullName || userData.firstName || 'Admin';
    if (adminRoleEl) adminRoleEl.textContent = userData.role ? userData.role.charAt(0).toUpperCase() + userData.role.slice(1) : 'Administrator';
}

// Global logout functionality
function setupLogout() {
    const logoutButton = document.getElementById('logout-btn');
    if (logoutButton) {
        logoutButton.addEventListener('click', async (e) => {
            e.preventDefault();
            try {
                localStorage.clear(); // Clear user info and all local storage
                alert('You have been logged out successfully!');
                window.location.href = 'index.html';
            } catch (error) {
                console.error('Error signing out:', error);
                alert('Failed to logout. Please try again.');
            }
        });
    }
}

// --- Page Initializers ---

function initSignupPage() {
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const firstName = document.getElementById('firstName').value.trim();
            const lastName = document.getElementById('lastName').value.trim();
            const email = document.getElementById('email').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const location = document.getElementById('location').value;
            const role = document.getElementById('role').value;

            // Create user profile (no password required)
            const userProfile = {
                firstName: firstName || 'Community',
                lastName: lastName || 'Member',
                fullName: `${firstName || 'Community'} ${lastName || 'Member'}`,
                email: email || 'member@agric-empower.org',
                phone: phone || '+256 774 330 491',
                location: location || 'rhino',
                role: role || 'farmer',
                isActive: true,
                createdAt: new Date().toISOString(),
                profilePicUrl: './images/africa_numbers_cover.jpg'
            };

            // Store in localStorage
            storeUserInfo(userProfile);
            
            alert('Welcome to Agric-Empower! Redirecting to your dashboard...');
            
            // Redirect based on role
            setTimeout(() => {
                if (userProfile.role === 'admin') {
                    window.location.href = 'admin-dashboard.html';
                } else {
                    window.location.href = 'user-dashboard.html';
                }
            }, 1500);
        });
    }
}

function initLoginPage() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;
            
            // Simple login simulation
            const userData = {
                email: email || 'guest@agric-empower.org',
                fullName: 'Demo User',
                role: email && email.includes('admin') ? 'admin' : 'farmer',
                loginTime: new Date().toISOString(),
                profilePicUrl: './images/africa_numbers_cover.jpg'
            };
            
            storeUserInfo(userData);
            
            alert('Login successful! Redirecting to dashboard...');
            
            setTimeout(() => {
                if (userData.role === 'admin') {
                    window.location.href = 'admin-dashboard.html';
                } else {
                    window.location.href = 'user-dashboard.html';
                }
            }, 1500);
        });
    }
}

// --- Main Execution ---

document.addEventListener('DOMContentLoaded', () => {
    console.log('🌱 Agric-Empower Script Loading...');
    
    if (currentPath.includes('signup.html')) {
        initSignupPage();
    } else if (currentPath.includes('login.html')) {
        initLoginPage();
    } else {
        // For all dashboard/section pages, update user info display and setup logout
        updateUserInfoDisplay();
        setupLogout();
    }
    
    console.log('✅ Agric-Empower Script loaded successfully');
});

// Mobile Navigation Toggle - Enhanced for Vercel deployment
function initMobileNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (!hamburger || !navMenu) {
        console.warn('Mobile nav elements not found');
        return;
    }
    
    // Initialize nav menu state
    function resetNavState() {
        if (window.innerWidth <= 768) {
            navMenu.setAttribute('aria-hidden', 'true');
            hamburger.setAttribute('aria-expanded', 'false');
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        } else {
            navMenu.setAttribute('aria-hidden', 'false');
            hamburger.setAttribute('aria-expanded', 'false');
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        }
        document.body.style.overflow = '';
    }
    
    // Toggle function
    function toggleMobileMenu(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const isActive = hamburger.classList.contains('active');
        
        if (isActive) {
            // Close menu
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            navMenu.setAttribute('aria-hidden', 'true');
            hamburger.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        } else {
            // Open menu
            hamburger.classList.add('active');
            navMenu.classList.add('active');
            navMenu.setAttribute('aria-hidden', 'false');
            hamburger.setAttribute('aria-expanded', 'true');
            document.body.style.overflow = 'hidden';
        }
    }
    
    // Close menu function
    function closeMobileMenu() {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        navMenu.setAttribute('aria-hidden', 'true');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }
    
    // Event listeners
    hamburger.addEventListener('click', toggleMobileMenu);
    hamburger.addEventListener('touchstart', toggleMobileMenu, { passive: false });
    
    // Keyboard support
    hamburger.setAttribute('tabindex', '0');
    hamburger.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            toggleMobileMenu(e);
        }
    });
    
    // Close menu when clicking nav links
    navMenu.addEventListener('click', (e) => {
        if (e.target.tagName === 'A') {
            closeMobileMenu();
        }
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768 && 
            navMenu.classList.contains('active') &&
            !hamburger.contains(e.target) && 
            !navMenu.contains(e.target)) {
            closeMobileMenu();
        }
    });
    
    // Handle window resize
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(resetNavState, 100);
    });
    
    // Initialize state
    resetNavState();
}

// Initialize mobile navigation when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMobileNavigation);
} else {
    initMobileNavigation();
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Navbar background change on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        }
    }
});

// Contact form handling (simplified - saves to localStorage)
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const name = this.querySelector('input[type="text"]')?.value;
        const email = this.querySelector('input[type="email"]')?.value;
        const message = this.querySelector('textarea')?.value;
        
        // Simple validation
        if (!name || !email || !message) {
            alert('Please fill in all fields');
            return;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Please enter a valid email address');
            return;
        }
        
        // Save to localStorage
        const contactData = {
            name,
            email,
            message,
            timestamp: new Date().toISOString()
        };
        
        const existingContacts = JSON.parse(localStorage.getItem('contactMessages') || '[]');
        existingContacts.push(contactData);
        localStorage.setItem('contactMessages', JSON.stringify(existingContacts));
        
        // Success message
        alert('Thank you for your message! We will get back to you soon.');
        this.reset();
    });
}

// Animate elements on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.feature-card, .impact-card, .about-text, .about-image');
    
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Counter animation for impact numbers
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target + '%';
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start) + '%';
        }
    }, 16);
}

// Trigger counter animation when impact section is visible
const impactObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const counters = entry.target.querySelectorAll('.impact-number');
            counters.forEach(counter => {
                const target = parseInt(counter.textContent);
                if (!isNaN(target)) {
                    animateCounter(counter, target);
                }
            });
            impactObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const impactSection = document.querySelector('.impact');
if (impactSection) {
    impactObserver.observe(impactSection);
}

// Preloader
window.addEventListener('load', () => {
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        preloader.style.opacity = '0';
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 500);
    }
});

// Back to top button
const backToTopBtn = document.createElement('button');
backToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
backToTopBtn.className = 'back-to-top';
backToTopBtn.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 50px;
    height: 50px;
    background: #388E3C;
    color: white;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    z-index: 1000;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

document.body.appendChild(backToTopBtn);

window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        backToTopBtn.style.opacity = '1';
        backToTopBtn.style.visibility = 'visible';
    } else {
        backToTopBtn.style.opacity = '0';
        backToTopBtn.style.visibility = 'hidden';
    }
});

backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Add hover effect to back to top button
backToTopBtn.addEventListener('mouseenter', () => {
    backToTopBtn.style.transform = 'translateY(-3px)';
    backToTopBtn.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.2)';
});

backToTopBtn.addEventListener('mouseleave', () => {
    backToTopBtn.style.transform = 'translateY(0)';
    backToTopBtn.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
});

// Tab functionality for features section
document.addEventListener('DOMContentLoaded', () => {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-tab');
            
            // Remove active class from all buttons and panes
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));
            
            // Add active class to clicked button and corresponding pane
            button.classList.add('active');
            const targetPane = document.getElementById(targetTab);
            if (targetPane) {
                targetPane.classList.add('active');
            }
        });
    });
});

console.log('✅ Agric-Empower main script loaded successfully - No authentication required');