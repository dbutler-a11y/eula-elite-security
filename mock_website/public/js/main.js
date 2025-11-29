// Eula Elite Security & Transport - Main JavaScript

// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    
    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', function() {
            mainNav.classList.toggle('active');
        });
    }
    
    // Close mobile menu when clicking nav links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            mainNav.classList.remove('active');
        });
    });
});

// Smooth scrolling for anchor links
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

// Active navigation highlighting
function updateActiveNav() {
    const sections = document.querySelectorAll('.section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').includes(current)) {
            link.classList.add('active');
        }
    });
}

window.addEventListener('scroll', updateActiveNav);

// Quote Calculator
class QuoteCalculator {
    constructor() {
        this.rates = {
            daily: 3000,
            weekly: 12000,
            monthly: 25000
        };
        
        this.addons = {
            armored_vehicle: 500,
            additional_officers: 1000,
            event_coordination: 750,
            travel_security: 1200,
            family_protection: 800
        };
        
        this.init();
    }
    
    init() {
        const calculatorForm = document.getElementById('quote-calculator');
        if (calculatorForm) {
            calculatorForm.addEventListener('change', () => this.calculateQuote());
            calculatorForm.addEventListener('input', () => this.calculateQuote());
        }
    }
    
    calculateQuote() {
        const serviceType = document.querySelector('input[name="service_type"]:checked');
        const duration = document.getElementById('duration');
        const addons = document.querySelectorAll('input[name="addons"]:checked');
        
        if (!serviceType || !duration) return;
        
        let baseRate = this.rates[serviceType.value];
        let total = baseRate * parseInt(duration.value);
        
        // Add selected addons
        addons.forEach(addon => {
            total += this.addons[addon.value] * parseInt(duration.value);
        });
        
        this.displayQuote(total, serviceType.value, duration.value);
    }
    
    displayQuote(total, serviceType, duration) {
        const quoteDisplay = document.getElementById('quote-display');
        if (quoteDisplay) {
            quoteDisplay.innerHTML = `
                <div class="quote-result">
                    <h3>Estimated Investment</h3>
                    <div class="quote-total">$${total.toLocaleString()}</div>
                    <div class="quote-details">
                        <p>${serviceType.charAt(0).toUpperCase() + serviceType.slice(1)} Protection</p>
                        <p>Duration: ${duration} ${serviceType === 'daily' ? 'days' : serviceType === 'weekly' ? 'weeks' : 'months'}</p>
                    </div>
                    <button type="button" class="btn btn-primary" onclick="openConsultationForm()">
                        Secure This Protection
                    </button>
                </div>
            `;
            quoteDisplay.style.display = 'block';
        }
    }
}

// Initialize quote calculator
const quoteCalculator = new QuoteCalculator();

// Consultation Form Handler
function openConsultationForm() {
    const modal = document.getElementById('consultation-modal');
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

function closeConsultationForm() {
    const modal = document.getElementById('consultation-modal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Form Validation and Submission
class FormHandler {
    constructor() {
        this.init();
    }
    
    init() {
        const forms = document.querySelectorAll('.secure-form');
        forms.forEach(form => {
            form.addEventListener('submit', (e) => this.handleSubmit(e));
        });
    }
    
    async handleSubmit(e) {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        const formDataObj = Object.fromEntries(formData.entries());
        
        // Track form submission with analytics
        if (window.eulaAnalytics) {
            if (form.classList.contains('consultation-form')) {
                window.eulaAnalytics.trackConsultationBooked(formDataObj);
            } else {
                window.eulaAnalytics.trackEvent('form_submission', {
                    form_type: form.className.includes('contact') ? 'contact' : 'general',
                    form_fields: Object.keys(formDataObj).length
                });
            }
        }
        
        // Show loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Securing...';
        submitBtn.disabled = true;
        
        try {
            // Call actual API endpoint
            const response = await this.submitToAPI(form, formDataObj);
            
            // Track successful submission
            if (window.eulaAnalytics && response.success) {
                const eventType = form.classList.contains('consultation-form') ? 'consultation_success' : 'form_success';
                window.eulaAnalytics.trackCustomEvent(eventType, {
                    reference_id: response.referenceId || 'unknown'
                });
            }
            
            // Show success message
            this.showSuccessMessage(response.message || 'Your secure consultation request has been received. We will contact you within 2 hours.');
            form.reset();
            
            // Close modal if open
            closeConsultationForm();
            
        } catch (error) {
            // Track form errors
            if (window.eulaAnalytics) {
                window.eulaAnalytics.trackCustomEvent('form_error', {
                    form_type: form.classList.contains('consultation-form') ? 'consultation' : 'contact',
                    error_message: error.message
                });
            }
            
            this.showErrorMessage('There was an issue submitting your request. Please call our emergency line.');
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    }
    
    async submitToAPI(form, formDataObj) {
        // Determine endpoint based on form type
        let endpoint = '/api/contact';
        if (form.classList.contains('consultation-form')) {
            endpoint = '/api/consultation';
        } else if (form.classList.contains('newsletter-form')) {
            endpoint = '/api/newsletter';
        } else if (form.classList.contains('quote-form')) {
            endpoint = '/api/quote';
        }
        
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formDataObj)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        if (!data.success) {
            throw new Error(data.message || 'Request failed');
        }
        
        return data;
    }
    
    showSuccessMessage(message) {
        this.showNotification(message, 'success');
    }
    
    showErrorMessage(message) {
        this.showNotification(message, 'error');
    }
    
    showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }
}

// Initialize form handler
const formHandler = new FormHandler();

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
        }
    });
}, observerOptions);

// Observe all animatable elements
document.addEventListener('DOMContentLoaded', function() {
    const animatableElements = document.querySelectorAll('.service-card, .trust-item, .section');
    animatableElements.forEach(el => observer.observe(el));
});

// Emergency Contact Handler
function initiateEmergencyContact() {
    if (confirm('This will initiate emergency contact protocols. Continue?')) {
        // In a real implementation, this would trigger emergency systems
        alert('Emergency protocols activated. A Licensed Level IV PPO will be dispatched immediately. Please stay on the line.');
        
        // Simulate emergency call
        window.location.href = 'tel:+17135551234';
    }
}

// Page-specific functionality
function initPageSpecificFeatures() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    switch(currentPage) {
        case 'services.html':
            initServiceComparison();
            break;
        case 'contact.html':
            initContactForm();
            break;
        case 'blog.html':
            initBlogFeatures();
            break;
        default:
            initHomepageFeatures();
    }
}

function initServiceComparison() {
    const compareButtons = document.querySelectorAll('.compare-service');
    compareButtons.forEach(button => {
        button.addEventListener('click', function() {
            const serviceCard = this.closest('.service-card');
            serviceCard.classList.toggle('selected-for-comparison');
            updateComparisonView();
        });
    });
}

function updateComparisonView() {
    const selectedServices = document.querySelectorAll('.service-card.selected-for-comparison');
    const comparisonPanel = document.getElementById('comparison-panel');
    
    if (selectedServices.length > 0) {
        comparisonPanel.style.display = 'block';
        // Update comparison content
    } else {
        comparisonPanel.style.display = 'none';
    }
}

function initContactForm() {
    const confidentialityLevel = document.getElementById('confidentiality_level');
    if (confidentialityLevel) {
        confidentialityLevel.addEventListener('change', function() {
            const warningText = document.getElementById('confidentiality-warning');
            if (this.value === 'maximum') {
                warningText.textContent = 'Maximum confidentiality protocols will be applied. All communications will be encrypted.';
            } else if (this.value === 'high') {
                warningText.textContent = 'High confidentiality protocols will be applied. Limited documentation will be maintained.';
            } else {
                warningText.textContent = 'Standard confidentiality protocols will be applied.';
            }
        });
    }
}

function initBlogFeatures() {
    // Blog search functionality
    const searchInput = document.getElementById('blog-search');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(filterBlogPosts, 300));
    }
    
    // Category filtering
    const categoryFilters = document.querySelectorAll('.category-filter');
    categoryFilters.forEach(filter => {
        filter.addEventListener('click', function() {
            const category = this.dataset.category;
            filterBlogPostsByCategory(category);
        });
    });
}

function filterBlogPosts(searchTerm) {
    const posts = document.querySelectorAll('.blog-post');
    posts.forEach(post => {
        const title = post.querySelector('.post-title').textContent.toLowerCase();
        const excerpt = post.querySelector('.post-excerpt').textContent.toLowerCase();
        
        if (title.includes(searchTerm.toLowerCase()) || excerpt.includes(searchTerm.toLowerCase())) {
            post.style.display = 'block';
        } else {
            post.style.display = 'none';
        }
    });
}

function filterBlogPostsByCategory(category) {
    const posts = document.querySelectorAll('.blog-post');
    posts.forEach(post => {
        if (category === 'all' || post.dataset.category === category) {
            post.style.display = 'block';
        } else {
            post.style.display = 'none';
        }
    });
}

function initHomepageFeatures() {
    // Hero video controls if present
    const heroVideo = document.getElementById('hero-video');
    if (heroVideo) {
        heroVideo.addEventListener('loadeddata', function() {
            this.play().catch(e => console.log('Video autoplay prevented'));
        });
    }
    
    // Testimonial carousel
    initTestimonialCarousel();
}

function initTestimonialCarousel() {
    const testimonials = document.querySelectorAll('.testimonial-item');
    let currentTestimonial = 0;
    
    function showTestimonial(index) {
        testimonials.forEach((testimonial, i) => {
            testimonial.style.display = i === index ? 'block' : 'none';
        });
    }
    
    function nextTestimonial() {
        currentTestimonial = (currentTestimonial + 1) % testimonials.length;
        showTestimonial(currentTestimonial);
    }
    
    if (testimonials.length > 0) {
        showTestimonial(0);
        setInterval(nextTestimonial, 5000); // Change every 5 seconds
    }
}

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Performance monitoring
function trackPagePerformance() {
    if ('performance' in window) {
        window.addEventListener('load', function() {
            const perfData = performance.getEntriesByType('navigation')[0];
            console.log('Page Load Time:', perfData.loadEventEnd - perfData.loadEventStart);
        });
    }
}

// Initialize all features when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initPageSpecificFeatures();
    trackPagePerformance();
});

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        QuoteCalculator,
        FormHandler
    };
}