// Eula Elite Security - Analytics & Conversion Tracking System
class EulaAnalytics {
    constructor() {
        this.measurementId = 'G-EULA123456'; // Demo measurement ID
        this.isProduction = window.location.hostname !== 'localhost';
        this.sessionId = this.generateSessionId();
        this.userId = this.getUserId();
        this.conversionValues = {
            daily: 3000,
            weekly: 12000,
            monthly: 25000
        };
        
        this.init();
    }
    
    init() {
        this.loadGoogleAnalytics();
        this.setupEventListeners();
        this.trackPageView();
        this.startSessionTracking();
        console.log('🔍 Eula Elite Analytics initialized');
    }
    
    loadGoogleAnalytics() {
        if (!this.isProduction) {
            console.log('📊 Analytics running in demo mode (localhost)');
            // Mock gtag for localhost testing
            window.gtag = this.mockGtag.bind(this);
            return;
        }
        
        // Load Google Analytics 4
        const script = document.createElement('script');
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${this.measurementId}`;
        document.head.appendChild(script);
        
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        window.gtag = gtag;
        
        gtag('js', new Date());
        gtag('config', this.measurementId, {
            send_page_view: false, // We'll handle page views manually
            custom_map: {
                custom_parameter_1: 'service_package',
                custom_parameter_2: 'client_type',
                custom_parameter_3: 'security_level'
            }
        });
    }
    
    mockGtag(command, ...args) {
        // Mock implementation for localhost testing
        console.log(`📈 Mock Analytics: ${command}`, args);
        
        // Store events locally for testing
        if (!window.eulaAnalyticsEvents) {
            window.eulaAnalyticsEvents = [];
        }
        
        window.eulaAnalyticsEvents.push({
            command,
            args,
            timestamp: new Date().toISOString(),
            sessionId: this.sessionId,
            userId: this.userId
        });
    }
    
    generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    getUserId() {
        let userId = localStorage.getItem('eula_user_id');
        if (!userId) {
            userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('eula_user_id', userId);
        }
        return userId;
    }
    
    setupEventListeners() {
        // Track quote requests
        document.addEventListener('click', (e) => {
            if (e.target.matches('.btn[href*="contact"]') || 
                e.target.matches('.btn[onclick*="consultation"]')) {
                this.trackEvent('quote_request_click', {
                    button_text: e.target.textContent.trim(),
                    page_location: window.location.pathname
                });
            }
            
            // Track service package clicks
            if (e.target.matches('.btn[href*="services"]')) {
                const serviceCard = e.target.closest('.service-card');
                if (serviceCard) {
                    const serviceTitle = serviceCard.querySelector('.service-title')?.textContent;
                    const servicePrice = serviceCard.querySelector('.service-price')?.textContent;
                    
                    this.trackServiceInterest(serviceTitle, servicePrice);
                }
            }
            
            // Track emergency button clicks
            if (e.target.matches('.btn-emergency') || e.target.matches('[href*="tel:"]')) {
                this.trackEmergencyContact(e.target.textContent.trim());
            }
            
            // Track navigation clicks
            if (e.target.matches('.nav-link')) {
                this.trackNavigation(e.target.textContent.trim(), e.target.href);
            }
        });
        
        // Track form submissions
        document.addEventListener('submit', (e) => {
            const form = e.target;
            if (form.matches('.secure-form') || form.matches('.consultation-form')) {
                this.trackFormSubmission(form);
            }
        });
        
        // Track scroll depth
        this.setupScrollTracking();
        
        // Track time on page
        this.setupTimeTracking();
        
        // Track live chat interactions
        this.setupChatTracking();
    }
    
    trackPageView() {
        const pageTitle = document.title;
        const pagePath = window.location.pathname;
        
        gtag('event', 'page_view', {
            page_title: pageTitle,
            page_location: window.location.href,
            page_path: pagePath,
            custom_parameter_1: this.getPageServiceType(pagePath),
            custom_parameter_2: 'prospect',
            custom_parameter_3: 'standard'
        });
        
        console.log(`📄 Page view tracked: ${pageTitle}`);
    }
    
    trackEvent(eventName, parameters = {}) {
        const enrichedParams = {
            ...parameters,
            session_id: this.sessionId,
            user_id: this.userId,
            timestamp: new Date().toISOString(),
            page_referrer: document.referrer,
            user_agent: navigator.userAgent.substring(0, 100) // Truncate for privacy
        };
        
        gtag('event', eventName, enrichedParams);
        console.log(`📊 Event tracked: ${eventName}`, enrichedParams);
    }
    
    trackServiceInterest(serviceTitle, servicePrice) {
        const packageType = this.determinePackageType(serviceTitle);
        const packageValue = this.conversionValues[packageType] || 0;
        
        this.trackEvent('service_interest', {
            service_package: packageType,
            service_title: serviceTitle,
            service_price: servicePrice,
            potential_value: packageValue,
            currency: 'USD'
        });
        
        // Enhanced ecommerce tracking
        gtag('event', 'select_item', {
            item_list_id: 'security_packages',
            item_list_name: 'Security Service Packages',
            items: [{
                item_id: packageType,
                item_name: serviceTitle,
                item_category: 'Security Services',
                item_variant: 'Elite Protection',
                price: packageValue,
                currency: 'USD'
            }]
        });
    }
    
    trackQuoteRequest(formData) {
        const packageType = formData.service_interest || formData.service_type || 'unknown';
        const packageValue = this.conversionValues[packageType] || 0;
        
        this.trackEvent('quote_request', {
            service_package: packageType,
            potential_value: packageValue,
            currency: 'USD',
            confidentiality_level: formData.confidentiality_level || 'standard',
            form_type: 'consultation'
        });
        
        // Track as conversion
        gtag('event', 'generate_lead', {
            currency: 'USD',
            value: packageValue * 0.1, // 10% probability multiplier
            lead_type: 'consultation_request',
            service_package: packageType
        });
    }
    
    trackFormSubmission(form) {
        const formData = new FormData(form);
        const formDataObj = Object.fromEntries(formData.entries());
        
        if (form.matches('.consultation-form')) {
            this.trackQuoteRequest(formDataObj);
        } else {
            this.trackEvent('form_submission', {
                form_type: form.className.includes('contact') ? 'contact' : 'general',
                form_fields: Object.keys(formDataObj).length,
                has_email: !!formDataObj.email,
                has_phone: !!formDataObj.phone
            });
        }
        
        // Track contact method preference
        if (formDataObj.preferred_contact_time) {
            this.trackEvent('contact_preference', {
                preferred_time: formDataObj.preferred_contact_time,
                contact_method: 'form'
            });
        }
    }
    
    trackEmergencyContact(buttonText) {
        this.trackEvent('emergency_contact', {
            contact_method: buttonText.includes('tel:') ? 'phone' : 'button',
            button_text: buttonText,
            urgency_level: 'high'
        });
        
        // Track as high-value event
        gtag('event', 'conversion', {
            send_to: this.measurementId,
            value: 1000, // Emergency contacts are high-value
            currency: 'USD',
            event_category: 'Emergency',
            event_label: 'Emergency Contact'
        });
    }
    
    trackNavigation(linkText, href) {
        this.trackEvent('navigation', {
            link_text: linkText,
            destination: href,
            navigation_type: 'header_menu'
        });
    }
    
    setupScrollTracking() {
        let scrollDepths = [10, 25, 50, 75, 90, 100];\n        let trackedDepths = new Set();\n        \n        const trackScroll = () => {\n            const scrollPercent = Math.round(\n                (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100\n            );\n            \n            scrollDepths.forEach(depth => {\n                if (scrollPercent >= depth && !trackedDepths.has(depth)) {\n                    trackedDepths.add(depth);\n                    this.trackEvent('scroll', {\n                        scroll_depth: depth,\n                        page_title: document.title\n                    });\n                }\n            });\n        };\n        \n        window.addEventListener('scroll', this.throttle(trackScroll, 1000));\n    }\n    \n    setupTimeTracking() {\n        const startTime = Date.now();\n        const intervals = [10, 30, 60, 120, 300]; // seconds\n        const tracked = new Set();\n        \n        setInterval(() => {\n            const timeOnPage = Math.floor((Date.now() - startTime) / 1000);\n            \n            intervals.forEach(interval => {\n                if (timeOnPage >= interval && !tracked.has(interval)) {\n                    tracked.add(interval);\n                    this.trackEvent('timing', {\n                        time_on_page: interval,\n                        page_title: document.title,\n                        engagement_level: interval >= 60 ? 'high' : 'medium'\n                    });\n                }\n            });\n        }, 10000); // Check every 10 seconds\n        \n        // Track page abandonment\n        window.addEventListener('beforeunload', () => {\n            const totalTime = Math.floor((Date.now() - startTime) / 1000);\n            this.trackEvent('page_exit', {\n                total_time_on_page: totalTime,\n                exit_type: 'navigation'\n            });\n        });\n    }\n    \n    setupChatTracking() {\n        // Track live chat events\n        document.addEventListener('chatEvent', (e) => {\n            const { eventType, data } = e.detail;\n            \n            switch (eventType) {\n                case 'chat_started':\n                    this.trackEvent('chat_started', {\n                        chat_type: 'live_support',\n                        client_name: data.clientName || 'anonymous'\n                    });\n                    break;\n                    \n                case 'chat_message_sent':\n                    this.trackEvent('chat_engagement', {\n                        message_type: 'client',\n                        chat_duration: data.duration || 0\n                    });\n                    break;\n                    \n                case 'emergency_triggered':\n                    this.trackEvent('emergency_chat', {\n                        trigger_method: 'chat_button',\n                        location_provided: !!data.location\n                    });\n                    \n                    // Track as high-value conversion\n                    gtag('event', 'conversion', {\n                        send_to: this.measurementId,\n                        value: 5000, // Emergency via chat is very high value\n                        currency: 'USD',\n                        event_category: 'Emergency',\n                        event_label: 'Chat Emergency'\n                    });\n                    break;\n            }\n        });\n    }\n    \n    // Conversion tracking methods\n    trackSuccessfulQuote(quoteData) {\n        const packageValue = this.conversionValues[quoteData.serviceType] || 0;\n        \n        this.trackEvent('successful_quote', {\n            service_package: quoteData.serviceType,\n            quote_value: packageValue,\n            duration: quoteData.duration,\n            addons: quoteData.addons?.join(',') || 'none',\n            currency: 'USD'\n        });\n        \n        // Enhanced ecommerce conversion\n        gtag('event', 'purchase', {\n            transaction_id: quoteData.referenceId,\n            value: packageValue,\n            currency: 'USD',\n            items: [{\n                item_id: quoteData.serviceType,\n                item_name: `${quoteData.serviceType.charAt(0).toUpperCase() + quoteData.serviceType.slice(1)} Protection Package`,\n                item_category: 'Security Services',\n                quantity: quoteData.duration,\n                price: packageValue\n            }]\n        });\n    }\n    \n    trackConsultationBooked(consultationData) {\n        this.trackEvent('consultation_booked', {\n            service_interest: consultationData.service_interest,\n            preferred_time: consultationData.preferred_contact_time,\n            confidentiality_level: consultationData.confidentiality_level,\n            has_special_requirements: !!consultationData.special_requirements\n        });\n        \n        // Track as conversion\n        gtag('event', 'conversion', {\n            send_to: this.measurementId,\n            value: 500, // Consultation booking value\n            currency: 'USD',\n            event_category: 'Lead Generation',\n            event_label: 'Consultation Booked'\n        });\n    }\n    \n    // Utility methods\n    determinePackageType(serviceTitle) {\n        const title = serviceTitle.toLowerCase();\n        if (title.includes('daily')) return 'daily';\n        if (title.includes('weekly')) return 'weekly';\n        if (title.includes('monthly')) return 'monthly';\n        return 'unknown';\n    }\n    \n    getPageServiceType(pagePath) {\n        if (pagePath.includes('services')) return 'services';\n        if (pagePath.includes('contact')) return 'contact';\n        if (pagePath.includes('about')) return 'about';\n        if (pagePath === '/' || pagePath.includes('index')) return 'homepage';\n        return 'other';\n    }\n    \n    throttle(func, limit) {\n        let inThrottle;\n        return function() {\n            const args = arguments;\n            const context = this;\n            if (!inThrottle) {\n                func.apply(context, args);\n                inThrottle = true;\n                setTimeout(() => inThrottle = false, limit);\n            }\n        };\n    }\n    \n    startSessionTracking() {\n        // Track session start\n        this.trackEvent('session_start', {\n            session_id: this.sessionId,\n            user_type: 'new_visitor', // Could be enhanced with returning visitor logic\n            traffic_source: document.referrer || 'direct'\n        });\n        \n        // Update last activity time\n        this.updateActivity();\n        \n        // Track activity every 30 seconds\n        setInterval(() => {\n            this.updateActivity();\n        }, 30000);\n    }\n    \n    updateActivity() {\n        localStorage.setItem('eula_last_activity', Date.now().toString());\n    }\n    \n    // Public methods for external use\n    trackCustomEvent(eventName, parameters) {\n        this.trackEvent(eventName, parameters);\n    }\n    \n    trackConversion(conversionType, value = 0) {\n        gtag('event', 'conversion', {\n            send_to: this.measurementId,\n            value: value,\n            currency: 'USD',\n            conversion_type: conversionType\n        });\n    }\n    \n    // Get analytics data (for admin dashboard)\n    getSessionEvents() {\n        return window.eulaAnalyticsEvents || [];\n    }\n    \n    getSessionSummary() {\n        const events = this.getSessionEvents();\n        return {\n            sessionId: this.sessionId,\n            userId: this.userId,\n            totalEvents: events.length,\n            pageViews: events.filter(e => e.command === 'event' && e.args[0] === 'page_view').length,\n            conversions: events.filter(e => e.command === 'event' && e.args[0] === 'conversion').length,\n            lastActivity: localStorage.getItem('eula_last_activity')\n        };\n    }\n}\n\n// Initialize analytics\nlet eulaAnalytics;\ndocument.addEventListener('DOMContentLoaded', () => {\n    eulaAnalytics = new EulaAnalytics();\n    \n    // Make available globally for other scripts\n    window.eulaAnalytics = eulaAnalytics;\n    \n    // Integrate with existing forms and chat\n    if (window.eulaChat) {\n        // Connect chat events to analytics\n        const originalSendMessage = window.eulaChat.sendMessage;\n        window.eulaChat.sendMessage = function() {\n            const result = originalSendMessage.apply(this, arguments);\n            document.dispatchEvent(new CustomEvent('chatEvent', {\n                detail: { eventType: 'chat_message_sent', data: { duration: Date.now() - this.startTime } }\n            }));\n            return result;\n        };\n    }\n});\n\n// Export for module systems\nif (typeof module !== 'undefined' && module.exports) {\n    module.exports = EulaAnalytics;\n}