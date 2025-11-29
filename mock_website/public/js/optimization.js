// Eula Elite Security - Frontend Optimization & A/B Testing
// Handles conversion optimization, A/B testing, and marketing tracking

class EulaOptimizationEngine {
    constructor() {
        this.userId = this.generateUserId();
        this.baseUrl = window.location.origin;
        this.abTests = new Map();
        this.optimizations = {};
        this.device = this.detectDevice();
        this.currentPage = this.getCurrentPage();
        
        this.init();
    }
    
    // ==================== INITIALIZATION ====================
    
    async init() {
        console.log('🎯 Eula Elite Optimization Engine starting...');
        
        try {
            // Load optimization content
            await this.loadOptimizationContent();
            
            // Initialize A/B tests
            await this.initializeABTests();
            
            // Apply optimizations
            this.applyOptimizations();
            
            // Set up tracking
            this.setupEventTracking();
            
            console.log('🎯 Optimization engine ready');
        } catch (error) {
            console.warn('Optimization engine failed to initialize:', error);
        }
    }
    
    // ==================== DEVICE & USER DETECTION ====================
    
    generateUserId() {
        let userId = localStorage.getItem('eula_user_id');
        if (!userId) {
            userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('eula_user_id', userId);
        }
        return userId;
    }
    
    detectDevice() {
        const userAgent = navigator.userAgent.toLowerCase();
        if (/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/.test(userAgent)) {
            return 'mobile';
        }
        return 'desktop';
    }
    
    getCurrentPage() {
        const path = window.location.pathname;
        if (path === '/' || path.includes('index')) return 'home';
        if (path.includes('about')) return 'about';
        if (path.includes('services')) return 'services';
        if (path.includes('contact')) return 'contact';
        if (path.includes('blog')) return 'blog';
        return 'other';
    }
    
    // ==================== OPTIMIZATION CONTENT LOADING ====================
    
    async loadOptimizationContent() {
        try {
            const params = new URLSearchParams({
                page: this.currentPage,
                service_interest: this.getServiceInterest(),
                high_value: this.isHighValueUser()
            });
            
            const response = await fetch(`${this.baseUrl}/api/optimization/content?${params}`);
            const data = await response.json();
            
            if (data.success) {
                this.optimizations = data.optimizations;
                this.trustSignals = data.trustSignals;
                this.mobileOptimizations = data.mobileOptimizations;
                
                console.log('📊 Optimization content loaded:', this.optimizations);
            }
        } catch (error) {
            console.warn('Failed to load optimization content:', error);
        }
    }
    
    // ==================== A/B TESTING ====================
    
    async initializeABTests() {
        const testKeys = [
            'quote_form_optimization',
            'landing_page_headlines',
            'cta_button_optimization',
            'mobile_layout_optimization'
        ];
        
        for (const testKey of testKeys) {
            await this.assignToTest(testKey);
        }
    }
    
    async assignToTest(testKey) {
        try {
            const response = await fetch(`${this.baseUrl}/api/optimization/assign-test`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ testKey })
            });
            
            const data = await response.json();
            
            if (data.success && data.assignment) {
                this.abTests.set(testKey, data.assignment);
                console.log(`🧪 A/B Test assigned: ${testKey} = ${data.assignment.variant}`);
                
                // Apply A/B test changes immediately
                this.applyABTestVariant(testKey, data.assignment);
            }
        } catch (error) {
            console.warn(`Failed to assign A/B test ${testKey}:`, error);
        }
    }
    
    applyABTestVariant(testKey, assignment) {
        const { variant, variantData } = assignment;
        
        switch (testKey) {
            case 'quote_form_optimization':
                this.applyQuoteFormVariant(variant, variantData);
                break;
            case 'landing_page_headlines':
                this.applyHeadlineVariant(variant, variantData);
                break;
            case 'cta_button_optimization':
                this.applyCTAVariant(variant, variantData);
                break;
            case 'mobile_layout_optimization':
                if (this.device === 'mobile') {
                    this.applyMobileVariant(variant, variantData);
                }
                break;
        }
    }
    
    // ==================== VARIANT IMPLEMENTATIONS ====================
    
    applyQuoteFormVariant(variant, variantData) {
        const quoteForm = document.querySelector('.quote-form');
        if (!quoteForm) return;
        
        if (variant === 'quote_form_progressive') {
            // Convert to progressive form
            this.convertToProgressiveForm(quoteForm);
        }
    }
    
    applyHeadlineVariant(variant, variantData) {
        const headlines = document.querySelectorAll('h1, .hero-title, .main-headline');
        
        if (variantData && variantData.headline) {
            headlines.forEach(headline => {
                if (headline.textContent.includes('Executive Protection') || 
                    headline.textContent.includes('Professional Security')) {
                    headline.textContent = variantData.headline;
                }
            });
        }
    }
    
    applyCTAVariant(variant, variantData) {
        const ctaButtons = document.querySelectorAll('.cta-button, .btn-primary, .contact-btn');
        
        if (variantData) {
            ctaButtons.forEach(button => {
                if (variantData.button_text) {
                    button.textContent = variantData.button_text;
                }
                if (variantData.button_color) {
                    button.style.backgroundColor = variantData.button_color;
                }
            });
        }
    }
    
    applyMobileVariant(variant, variantData) {
        if (variant === 'mobile_emergency_first' && variantData.changes) {
            this.applyMobileEmergencyFirst(variantData.changes);
        }
    }
    
    // ==================== OPTIMIZATION APPLICATIONS ====================
    
    applyOptimizations() {
        // Apply trust signals
        if (this.optimizations.show_certifications) {
            this.showCertificationBadges();
        }
        
        if (this.optimizations.show_fortune500_testimonials) {
            this.showPremiumTestimonials();
        }
        
        if (this.optimizations.emergency_contact_prominent && this.device === 'mobile') {
            this.makeEmergencyContactProminent();
        }
        
        if (this.optimizations.show_response_time) {
            this.emphasizeResponseTime();
        }
        
        // Apply trust signals
        this.displayTrustSignals();
        
        // Apply mobile optimizations
        if (this.device === 'mobile' && this.mobileOptimizations) {
            this.applyMobileOptimizations();
        }
    }
    
    showCertificationBadges() {
        const badges = `
        <div class="certification-badges" style="display: flex; align-items: center; gap: 15px; margin: 20px 0;">
            <div class="badge">
                <span class="badge-icon">🛡️</span>
                <span>Licensed Level IV PPO</span>
            </div>
            <div class="badge">
                <span class="badge-icon">⭐</span>
                <span>Military Backgrounds</span>
            </div>
            <div class="badge">
                <span class="badge-icon">📞</span>
                <span>24/7 Emergency Response</span>
            </div>
        </div>`;
        
        const heroSection = document.querySelector('.hero, .header-section, .main-content');
        if (heroSection) {
            heroSection.insertAdjacentHTML('afterend', badges);
        }
    }
    
    showPremiumTestimonials() {
        const premiumTestimonial = `
        <div class="premium-testimonial" style="background: #f8f9fa; padding: 30px; margin: 30px 0; border-left: 4px solid #007bff; border-radius: 8px;">
            <blockquote style="font-style: italic; font-size: 18px; margin-bottom: 15px;">
                "The monthly package provided comprehensive security that adapted to my business needs. 
                Their Licensed PPO team understood the unique challenges of executive protection."
            </blockquote>
            <cite style="font-weight: bold; color: #666;">— Fortune 500 Executive, Houston</cite>
        </div>`;
        
        const servicesSection = document.querySelector('.services-section, .pricing-section');
        if (servicesSection) {
            servicesSection.insertAdjacentHTML('afterbegin', premiumTestimonial);
        }
    }
    
    makeEmergencyContactProminent() {
        // Create sticky emergency button
        const emergencyButton = `
        <div class="emergency-contact-sticky" style="
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 1000;
            background: #dc3545;
            color: white;
            padding: 15px 20px;
            border-radius: 50px;
            box-shadow: 0 4px 15px rgba(220, 53, 69, 0.3);
            cursor: pointer;
            font-weight: bold;
            animation: pulse 2s infinite;
        ">
            🚨 Emergency: (713) 555-1234
        </div>
        
        <style>
        @keyframes pulse {
            0% { box-shadow: 0 4px 15px rgba(220, 53, 69, 0.3); }
            50% { box-shadow: 0 4px 25px rgba(220, 53, 69, 0.6); }
            100% { box-shadow: 0 4px 15px rgba(220, 53, 69, 0.3); }
        }
        </style>`;
        
        document.body.insertAdjacentHTML('beforeend', emergencyButton);
        
        // Add click handler
        document.querySelector('.emergency-contact-sticky').addEventListener('click', () => {
            window.location.href = 'tel:+17135551234';
            this.trackEvent('emergency_contact_click', { source: 'sticky_button' });
        });
    }
    
    emphasizeResponseTime() {
        const responseTimeElements = document.querySelectorAll('.response-time, .contact-info');
        responseTimeElements.forEach(element => {
            if (element.textContent.includes('hour') || element.textContent.includes('contact')) {
                element.style.background = '#fff3cd';
                element.style.border = '2px solid #ffc107';
                element.style.padding = '10px';
                element.style.borderRadius = '5px';
                element.style.fontWeight = 'bold';
            }
        });
    }
    
    displayTrustSignals() {
        if (!this.trustSignals) return;
        
        const trustSignalsHtml = this.trustSignals.map(signal => `
            <div class="trust-signal" style="display: flex; align-items: center; gap: 10px; margin: 10px 0;">
                <span class="signal-icon">${this.getSignalIcon(signal.icon)}</span>
                <span class="signal-content">${signal.content}</span>
            </div>
        `).join('');
        
        const trustContainer = `
        <div class="trust-signals-container" style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h4 style="margin-bottom: 15px; color: #333;">Why Choose Eula Elite Security?</h4>
            ${trustSignalsHtml}
        </div>`;
        
        const insertTarget = document.querySelector('.services-section, .main-content, .hero');
        if (insertTarget) {
            insertTarget.insertAdjacentHTML('afterend', trustContainer);
        }
    }
    
    applyMobileOptimizations() {
        if (!this.mobileOptimizations) return;
        
        // Apply mobile-specific styles
        const mobileStyles = `
        <style>
        @media (max-width: 768px) {
            .mobile-optimized {
                padding: 10px;
                font-size: 16px;
            }
            
            .mobile-cta {
                width: 100%;
                padding: 15px;
                font-size: 18px;
                margin: 10px 0;
            }
            
            .mobile-form input, .mobile-form select {
                width: 100%;
                padding: 15px;
                font-size: 16px;
                margin-bottom: 15px;
            }
        }
        </style>`;
        
        document.head.insertAdjacentHTML('beforeend', mobileStyles);
        
        // Add mobile-specific classes
        document.querySelectorAll('form').forEach(form => {
            form.classList.add('mobile-form');
        });
        
        document.querySelectorAll('.btn, .cta-button').forEach(btn => {
            btn.classList.add('mobile-cta');
        });
    }
    
    // ==================== PROGRESSIVE FORM CONVERSION ====================
    
    convertToProgressiveForm(formElement) {
        const formFields = Array.from(formElement.querySelectorAll('input, select, textarea'));
        if (formFields.length < 3) return; // Not worth making progressive
        
        // Group fields into steps
        const steps = this.groupFormFields(formFields);
        
        // Create multi-step structure
        const progressiveForm = this.createProgressiveFormHTML(steps);
        
        // Replace original form
        formElement.innerHTML = progressiveForm;
        
        // Initialize progressive form behavior
        this.initializeProgressiveForm(formElement);
    }
    
    groupFormFields(fields) {
        const steps = [
            {
                title: 'Service Type',
                fields: fields.filter(f => f.name && (f.name.includes('service') || f.name.includes('type')))
            },
            {
                title: 'Contact Information',
                fields: fields.filter(f => f.name && (f.name.includes('name') || f.name.includes('email') || f.name.includes('phone')))
            },
            {
                title: 'Additional Details',
                fields: fields.filter(f => !f.name || (!f.name.includes('service') && !f.name.includes('type') && !f.name.includes('name') && !f.name.includes('email') && !f.name.includes('phone')))
            }
        ];
        
        return steps.filter(step => step.fields.length > 0);
    }
    
    createProgressiveFormHTML(steps) {
        const progressBar = `
        <div class="progress-bar" style="width: 100%; background: #e9ecef; border-radius: 10px; margin-bottom: 20px;">
            <div class="progress-fill" style="width: ${100/steps.length}%; background: #007bff; height: 8px; border-radius: 10px; transition: width 0.3s ease;"></div>
        </div>`;
        
        const stepsHTML = steps.map((step, index) => `
        <div class="form-step" data-step="${index}" style="display: ${index === 0 ? 'block' : 'none'};">
            <h3>${step.title}</h3>
            ${step.fields.map(field => field.outerHTML).join('')}
            <div class="step-navigation" style="margin-top: 20px;">
                ${index > 0 ? '<button type="button" class="btn-prev">Previous</button>' : ''}
                ${index < steps.length - 1 ? '<button type="button" class="btn-next">Next</button>' : '<button type="submit" class="btn-submit">Get Quote</button>'}
            </div>
        </div>`).join('');
        
        return progressBar + stepsHTML;
    }
    
    initializeProgressiveForm(formElement) {
        let currentStep = 0;
        const steps = formElement.querySelectorAll('.form-step');
        const progressFill = formElement.querySelector('.progress-fill');
        
        // Handle next buttons
        formElement.querySelectorAll('.btn-next').forEach(btn => {
            btn.addEventListener('click', () => {
                if (this.validateStep(steps[currentStep])) {
                    currentStep++;
                    this.showStep(steps, currentStep);
                    this.updateProgress(progressFill, currentStep, steps.length);
                    this.trackEvent('form_step_completed', { step: currentStep });
                }
            });
        });
        
        // Handle previous buttons
        formElement.querySelectorAll('.btn-prev').forEach(btn => {
            btn.addEventListener('click', () => {
                currentStep--;
                this.showStep(steps, currentStep);
                this.updateProgress(progressFill, currentStep, steps.length);
            });
        });
    }
    
    showStep(steps, stepIndex) {
        steps.forEach((step, index) => {
            step.style.display = index === stepIndex ? 'block' : 'none';
        });
    }
    
    updateProgress(progressFill, currentStep, totalSteps) {
        const progress = ((currentStep + 1) / totalSteps) * 100;
        progressFill.style.width = `${progress}%`;
    }
    
    validateStep(stepElement) {
        const requiredFields = stepElement.querySelectorAll('[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                field.style.borderColor = '#dc3545';
                isValid = false;
            } else {
                field.style.borderColor = '#28a745';
            }
        });
        
        return isValid;
    }
    
    // ==================== EVENT TRACKING ====================
    
    setupEventTracking() {
        // Track form submissions
        document.querySelectorAll('form').forEach(form => {
            form.addEventListener('submit', (e) => {
                this.trackFormSubmission(form, e);
            });
        });
        
        // Track button clicks
        document.querySelectorAll('.cta-button, .btn-primary, .contact-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.trackButtonClick(btn, e);
            });
        });
        
        // Track page engagement
        this.trackPageEngagement();
        
        // Track scroll depth
        this.trackScrollDepth();
    }
    
    trackFormSubmission(form, event) {
        const formType = this.getFormType(form);
        
        this.trackEvent('form_submission', {
            form_type: formType,
            page: this.currentPage,
            device: this.device,
            ab_tests: Object.fromEntries(this.abTests)
        });
        
        // Track conversion for A/B tests
        this.abTests.forEach((assignment, testKey) => {
            this.trackConversion(testKey, 'form_submission');
        });
    }
    
    trackButtonClick(button, event) {
        const buttonText = button.textContent.trim();
        const buttonType = this.getButtonType(button);
        
        this.trackEvent('button_click', {
            button_text: buttonText,
            button_type: buttonType,
            page: this.currentPage,
            device: this.device
        });
        
        // Track CTA conversions
        if (buttonType === 'cta') {
            this.abTests.forEach((assignment, testKey) => {
                if (testKey === 'cta_button_optimization') {
                    this.trackConversion(testKey, 'cta_click');
                }
            });
        }
    }
    
    trackPageEngagement() {
        const startTime = Date.now();
        
        window.addEventListener('beforeunload', () => {
            const timeOnPage = Date.now() - startTime;
            this.trackEvent('page_engagement', {
                time_on_page: timeOnPage,
                page: this.currentPage,
                device: this.device
            });
        });
    }
    
    trackScrollDepth() {
        let maxScroll = 0;
        
        window.addEventListener('scroll', () => {
            const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
            
            if (scrollPercent > maxScroll) {
                maxScroll = scrollPercent;
                
                // Track milestone scrolls
                if (scrollPercent >= 25 && maxScroll < 25) {
                    this.trackEvent('scroll_depth', { depth: 25, page: this.currentPage });
                } else if (scrollPercent >= 50 && maxScroll < 50) {
                    this.trackEvent('scroll_depth', { depth: 50, page: this.currentPage });
                } else if (scrollPercent >= 75 && maxScroll < 75) {
                    this.trackEvent('scroll_depth', { depth: 75, page: this.currentPage });
                } else if (scrollPercent >= 90 && maxScroll < 90) {
                    this.trackEvent('scroll_depth', { depth: 90, page: this.currentPage });
                }
            }
        });
    }
    
    async trackEvent(eventType, data) {
        try {
            // Store locally for now (in production, send to analytics)
            const events = JSON.parse(localStorage.getItem('eula_events') || '[]');
            events.push({
                type: eventType,
                data: data,
                timestamp: new Date().toISOString(),
                user_id: this.userId
            });
            
            // Keep only last 100 events
            localStorage.setItem('eula_events', JSON.stringify(events.slice(-100)));
            
            console.log(`📊 Event tracked: ${eventType}`, data);
        } catch (error) {
            console.warn('Failed to track event:', error);
        }
    }
    
    async trackConversion(testKey, conversionType) {
        try {
            // This would normally send to backend, but we'll simulate for now
            console.log(`🎯 Conversion tracked: ${testKey} - ${conversionType}`);
            
            this.trackEvent('ab_test_conversion', {
                test_key: testKey,
                conversion_type: conversionType,
                variant: this.abTests.get(testKey)?.variant
            });
        } catch (error) {
            console.warn('Failed to track conversion:', error);
        }
    }
    
    // ==================== UTILITY METHODS ====================
    
    getServiceInterest() {
        // Try to detect service interest from URL params or page content
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('service') || 'daily';
    }
    
    isHighValueUser() {
        // Simple heuristics for high-value user detection
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('tier') === 'monthly' || 
               document.referrer.includes('fortune') ||
               localStorage.getItem('eula_high_value') === 'true';
    }
    
    getFormType(form) {
        if (form.action.includes('contact')) return 'contact';
        if (form.action.includes('quote')) return 'quote';
        if (form.action.includes('consultation')) return 'consultation';
        if (form.action.includes('newsletter')) return 'newsletter';
        return 'unknown';
    }
    
    getButtonType(button) {
        const classes = button.className.toLowerCase();
        const text = button.textContent.toLowerCase();
        
        if (classes.includes('cta') || text.includes('get') || text.includes('contact')) return 'cta';
        if (text.includes('emergency')) return 'emergency';
        if (text.includes('quote')) return 'quote';
        return 'general';
    }
    
    getSignalIcon(iconType) {
        const icons = {
            'shield-check': '🛡️',
            'quote': '💬',
            'award': '🏆',
            'clock': '⏱️',
            'star': '⭐',
            'phone': '📞'
        };
        return icons[iconType] || '✓';
    }
}

// Initialize optimization engine when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    if (typeof window !== 'undefined') {
        window.eulaOptimization = new EulaOptimizationEngine();
    }
});

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EulaOptimizationEngine;
}