// Eula Elite Security - Conversion Rate Optimization Suite
// A/B Testing and Funnel Optimization Engine

class ConversionOptimizationEngine {
    constructor() {
        this.abTests = new Map();
        this.funnelData = new Map();
        this.conversionVariants = new Map();
        this.userSessions = new Map();
        this.optimizationRules = new Map();
        
        this.initializeABTests();
        this.initializeFunnelTracking();
        this.initializeOptimizationRules();
        
        console.log('🎯 Conversion Optimization Engine initialized');
    }
    
    // ==================== A/B TESTING FRAMEWORK ====================
    
    initializeABTests() {
        // Quote Form A/B Test
        this.abTests.set('quote_form_optimization', {
            name: 'Quote Form Layout Optimization',
            status: 'active',
            traffic_split: 50, // 50/50 split
            variants: {
                control: {
                    id: 'quote_form_control',
                    name: 'Original Form',
                    description: 'Standard vertical layout with all fields visible',
                    conversion_rate: 0.0,
                    visitors: 0,
                    conversions: 0,
                    changes: {}
                },
                variant_a: {
                    id: 'quote_form_progressive',
                    name: 'Progressive Disclosure Form',
                    description: 'Step-by-step form with progress indicator',
                    conversion_rate: 0.0,
                    visitors: 0,
                    conversions: 0,
                    changes: {
                        layout: 'multi_step',
                        progress_bar: true,
                        simplified_first_step: true
                    }
                }
            }
        });
        
        // Landing Page A/B Test
        this.abTests.set('landing_page_headlines', {
            name: 'Service Page Headline Testing',
            status: 'active',
            traffic_split: 33, // 3-way split
            variants: {
                control: {
                    id: 'headline_control',
                    name: 'Professional Security',
                    headline: 'Professional Executive Protection Services',
                    conversion_rate: 0.0,
                    visitors: 0,
                    conversions: 0
                },
                variant_a: {
                    id: 'headline_fear_based',
                    name: 'Security-Focused',
                    headline: 'Protect What Matters Most - Licensed PPO Security',
                    conversion_rate: 0.0,
                    visitors: 0,
                    conversions: 0
                },
                variant_b: {
                    id: 'headline_status_based',
                    name: 'Status-Focused',
                    headline: 'Fortune 500-Caliber Executive Protection',
                    conversion_rate: 0.0,
                    visitors: 0,
                    conversions: 0
                }
            }
        });
        
        // CTA Button A/B Test
        this.abTests.set('cta_button_optimization', {
            name: 'Call-to-Action Button Testing',
            status: 'active',
            traffic_split: 50,
            variants: {
                control: {
                    id: 'cta_control',
                    name: 'Contact Us',
                    button_text: 'Contact Us',
                    button_color: '#007bff',
                    conversion_rate: 0.0,
                    visitors: 0,
                    conversions: 0
                },
                variant_a: {
                    id: 'cta_urgent',
                    name: 'Get Protection Now',
                    button_text: 'Get Protection Now',
                    button_color: '#dc3545',
                    conversion_rate: 0.0,
                    visitors: 0,
                    conversions: 0
                }
            }
        });
        
        // Mobile Optimization A/B Test
        this.abTests.set('mobile_layout_optimization', {
            name: 'Mobile Layout Optimization',
            status: 'active',
            traffic_split: 50,
            device_target: 'mobile',
            variants: {
                control: {
                    id: 'mobile_control',
                    name: 'Standard Mobile',
                    description: 'Standard responsive layout',
                    conversion_rate: 0.0,
                    visitors: 0,
                    conversions: 0
                },
                variant_a: {
                    id: 'mobile_emergency_first',
                    name: 'Emergency-First Mobile',
                    description: 'Emergency contact button prominently displayed',
                    conversion_rate: 0.0,
                    visitors: 0,
                    conversions: 0,
                    changes: {
                        emergency_button_top: true,
                        sticky_emergency_button: true,
                        simplified_nav: true
                    }
                }
            }
        });
        
        console.log('🧪 A/B tests initialized');
    }
    
    // ==================== FUNNEL TRACKING ====================
    
    initializeFunnelTracking() {
        this.funnelStages = {
            'awareness': {
                name: 'Awareness',
                description: 'Initial page visit',
                position: 1,
                conversion_rate: 100 // Entry point
            },
            'interest': {
                name: 'Interest',
                description: 'Service page visit',
                position: 2,
                conversion_rate: 0
            },
            'consideration': {
                name: 'Consideration',
                description: 'Contact form or quote request',
                position: 3,
                conversion_rate: 0
            },
            'intent': {
                name: 'Intent',
                description: 'Phone call or consultation request',
                position: 4,
                conversion_rate: 0
            },
            'conversion': {
                name: 'Conversion',
                description: 'Service booking or contract signed',
                position: 5,
                conversion_rate: 0
            }
        };
        
        console.log('📊 Funnel tracking initialized');
    }
    
    // ==================== OPTIMIZATION RULES ====================
    
    initializeOptimizationRules() {
        // Trust signal optimization rules
        this.optimizationRules.set('trust_signals', {
            name: 'Trust Signal Display Rules',
            rules: [
                {
                    condition: 'new_visitor',
                    action: 'show_certifications',
                    description: 'Show PPO licensing and certifications prominently'
                },
                {
                    condition: 'high_value_service_interest',
                    action: 'show_testimonials',
                    description: 'Display Fortune 500 testimonials for monthly service viewers'
                },
                {
                    condition: 'mobile_user',
                    action: 'emergency_contact_priority',
                    description: 'Prioritize emergency contact display on mobile'
                },
                {
                    condition: 'repeat_visitor',
                    action: 'personalized_content',
                    description: 'Show content based on previous page views'
                }
            ]
        });
        
        // Urgency optimization rules
        this.optimizationRules.set('urgency_optimization', {
            name: 'Urgency and Scarcity Rules',
            rules: [
                {
                    condition: 'consultation_request',
                    action: 'show_response_time',
                    description: 'Emphasize quick response times'
                },
                {
                    condition: 'high_lead_score',
                    action: 'priority_contact',
                    description: 'Flag for immediate PPO contact'
                },
                {
                    condition: 'emergency_page_visit',
                    action: 'direct_phone_prompt',
                    description: 'Immediately show phone number with call button'
                }
            ]
        });
        
        console.log('📈 Optimization rules initialized');
    }
    
    // ==================== A/B TEST ASSIGNMENT ====================
    
    assignUserToTest(userId, testKey, userAgent = '', device = 'desktop') {
        const test = this.abTests.get(testKey);
        if (!test || test.status !== 'active') return null;
        
        // Skip if test is device-specific and doesn't match
        if (test.device_target && test.device_target !== device) return null;
        
        // Generate consistent hash for user to ensure same variant assignment
        const hash = this.hashUserId(userId + testKey);
        const trafficSplit = test.traffic_split;
        
        // Determine variant based on hash
        let assignedVariant;
        const variants = Object.keys(test.variants);
        
        if (variants.length === 2) {
            // Simple A/B test
            assignedVariant = hash < trafficSplit ? variants[1] : variants[0];
        } else {
            // Multi-variant test
            const splitPerVariant = 100 / variants.length;
            const variantIndex = Math.floor(hash / splitPerVariant);
            assignedVariant = variants[Math.min(variantIndex, variants.length - 1)];
        }
        
        // Track assignment
        if (!this.userSessions.has(userId)) {
            this.userSessions.set(userId, {
                id: userId,
                device: device,
                userAgent: userAgent,
                tests: new Map(),
                conversions: [],
                created: new Date()
            });
        }
        
        const session = this.userSessions.get(userId);
        session.tests.set(testKey, {
            variant: assignedVariant,
            assigned: new Date()
        });
        
        // Increment visitor count
        test.variants[assignedVariant].visitors++;
        
        console.log(`🧪 User ${userId} assigned to ${testKey}: ${assignedVariant}`);
        
        return {
            testKey: testKey,
            variant: assignedVariant,
            variantData: test.variants[assignedVariant]
        };
    }
    
    // ==================== CONVERSION TRACKING ====================
    
    trackConversion(userId, testKey, conversionType, value = 0) {
        const session = this.userSessions.get(userId);
        if (!session || !session.tests.has(testKey)) return false;
        
        const test = this.abTests.get(testKey);
        if (!test) return false;
        
        const userTest = session.tests.get(testKey);
        const variant = userTest.variant;
        
        // Record conversion
        test.variants[variant].conversions++;
        
        // Recalculate conversion rate
        const variantData = test.variants[variant];
        variantData.conversion_rate = variantData.visitors > 0 ? 
            (variantData.conversions / variantData.visitors) * 100 : 0;
        
        // Add to session conversions
        session.conversions.push({
            testKey: testKey,
            variant: variant,
            type: conversionType,
            value: value,
            timestamp: new Date()
        });
        
        console.log(`🎯 Conversion tracked: ${userId} - ${testKey}:${variant} - ${conversionType} ($${value})`);
        
        return true;
    }
    
    // ==================== FUNNEL ANALYSIS ====================
    
    trackFunnelStage(userId, stage, metadata = {}) {
        if (!this.funnelStages[stage]) return false;
        
        if (!this.funnelData.has(userId)) {
            this.funnelData.set(userId, {
                userId: userId,
                stages: [],
                currentStage: stage,
                started: new Date(),
                lastActivity: new Date()
            });
        }
        
        const funnelUser = this.funnelData.get(userId);
        
        // Don't duplicate stages
        const existingStage = funnelUser.stages.find(s => s.stage === stage);
        if (!existingStage) {
            funnelUser.stages.push({
                stage: stage,
                timestamp: new Date(),
                metadata: metadata
            });
            
            funnelUser.currentStage = stage;
            funnelUser.lastActivity = new Date();
        }
        
        console.log(`📊 Funnel stage tracked: ${userId} - ${stage}`);
        return true;
    }
    
    getFunnelAnalysis() {
        const analysis = {
            total_users: this.funnelData.size,
            stage_breakdown: {},
            conversion_rates: {},
            drop_off_analysis: {}
        };
        
        // Count users at each stage
        Object.keys(this.funnelStages).forEach(stage => {
            analysis.stage_breakdown[stage] = 0;
        });
        
        this.funnelData.forEach(user => {
            user.stages.forEach(stageData => {
                analysis.stage_breakdown[stageData.stage]++;
            });
        });
        
        // Calculate conversion rates between stages
        const stageOrder = Object.keys(this.funnelStages).sort((a, b) => 
            this.funnelStages[a].position - this.funnelStages[b].position
        );
        
        for (let i = 0; i < stageOrder.length - 1; i++) {
            const currentStage = stageOrder[i];
            const nextStage = stageOrder[i + 1];
            
            const currentCount = analysis.stage_breakdown[currentStage];
            const nextCount = analysis.stage_breakdown[nextStage];
            
            analysis.conversion_rates[`${currentStage}_to_${nextStage}`] = 
                currentCount > 0 ? (nextCount / currentCount) * 100 : 0;
        }
        
        return analysis;
    }
    
    // ==================== LANDING PAGE OPTIMIZATION ====================
    
    getOptimizedContent(userId, page, device = 'desktop') {
        const optimizations = {};
        
        // Get user session data
        const session = this.userSessions.get(userId);
        const isNewVisitor = !session || session.created > new Date(Date.now() - 24 * 60 * 60 * 1000);
        const funnelUser = this.funnelData.get(userId);
        
        // Apply trust signal optimizations
        if (isNewVisitor) {
            optimizations.show_certifications = true;
            optimizations.show_licensing_badges = true;
        }
        
        // Apply service-specific optimizations
        if (page === 'services' && session) {
            const viewedPages = Array.from(session.tests.keys());
            if (viewedPages.some(test => test.includes('monthly'))) {
                optimizations.show_fortune500_testimonials = true;
                optimizations.highlight_monthly_value = true;
            }
        }
        
        // Apply mobile-specific optimizations
        if (device === 'mobile') {
            optimizations.emergency_contact_prominent = true;
            optimizations.simplified_navigation = true;
            optimizations.click_to_call = true;
        }
        
        // Apply urgency optimizations
        if (funnelUser && funnelUser.currentStage === 'consideration') {
            optimizations.show_response_time = true;
            optimizations.emphasize_urgency = true;
        }
        
        return optimizations;
    }
    
    // ==================== TRUST SIGNAL OPTIMIZATION ====================
    
    getTrustSignals(userProfile = {}) {
        const signals = [];
        
        // Always show licensing
        signals.push({
            type: 'licensing',
            content: 'Licensed Level IV PPO',
            icon: 'shield-check',
            priority: 1
        });
        
        // Show testimonials based on service interest
        if (userProfile.service_interest === 'monthly' || userProfile.high_value) {
            signals.push({
                type: 'testimonial',
                content: '"The monthly package provided comprehensive security that adapted to my business needs." - Fortune 500 Executive',
                icon: 'quote',
                priority: 2
            });
        } else {
            signals.push({
                type: 'testimonial',
                content: '"Professional, discreet, and highly effective protection services." - Business Owner',
                icon: 'quote',
                priority: 2
            });
        }
        
        // Show certifications
        signals.push({
            type: 'certification',
            content: 'Military & Law Enforcement Backgrounds',
            icon: 'award',
            priority: 3
        });
        
        // Show response time
        signals.push({
            type: 'response',
            content: '24/7 Emergency Response',
            icon: 'clock',
            priority: 4
        });
        
        return signals.sort((a, b) => a.priority - b.priority);
    }
    
    // ==================== MOBILE CONVERSION OPTIMIZATION ====================
    
    getMobileOptimizations(page) {
        const optimizations = {
            layout: 'mobile_first',
            emergency_button: {
                enabled: true,
                position: 'sticky_top',
                text: '🚨 Emergency Contact',
                color: '#dc3545'
            },
            simplified_forms: true,
            click_to_call: true,
            reduced_copy: true,
            larger_buttons: true,
            simplified_navigation: true
        };
        
        // Page-specific optimizations
        if (page === 'contact') {
            optimizations.form_style = 'single_column';
            optimizations.auto_focus_phone = true;
            optimizations.smart_defaults = true;
        }
        
        if (page === 'services') {
            optimizations.pricing_display = 'accordion';
            optimizations.service_comparison = 'tabbed';
        }
        
        return optimizations;
    }
    
    // ==================== ANALYTICS AND REPORTING ====================
    
    getABTestResults() {
        const results = [];
        
        this.abTests.forEach((test, key) => {
            const variants = Object.values(test.variants);
            const totalVisitors = variants.reduce((sum, v) => sum + v.visitors, 0);
            const totalConversions = variants.reduce((sum, v) => sum + v.conversions, 0);
            
            results.push({
                testKey: key,
                testName: test.name,
                status: test.status,
                totalVisitors: totalVisitors,
                totalConversions: totalConversions,
                overallConversionRate: totalVisitors > 0 ? (totalConversions / totalVisitors) * 100 : 0,
                variants: variants.map(v => ({
                    id: v.id,
                    name: v.name,
                    visitors: v.visitors,
                    conversions: v.conversions,
                    conversionRate: v.conversion_rate
                })),
                statistical_significance: this.calculateStatisticalSignificance(variants)
            });
        });
        
        return results;
    }
    
    getConversionMetrics() {
        const totalSessions = this.userSessions.size;
        const convertedSessions = Array.from(this.userSessions.values())
            .filter(session => session.conversions.length > 0).length;
        
        const metrics = {
            total_sessions: totalSessions,
            converted_sessions: convertedSessions,
            overall_conversion_rate: totalSessions > 0 ? (convertedSessions / totalSessions) * 100 : 0,
            funnel_analysis: this.getFunnelAnalysis(),
            top_converting_tests: this.getTopConvertingTests(),
            device_performance: this.getDevicePerformance()
        };
        
        return metrics;
    }
    
    getTopConvertingTests() {
        const results = this.getABTestResults();
        return results
            .sort((a, b) => b.overallConversionRate - a.overallConversionRate)
            .slice(0, 5);
    }
    
    getDevicePerformance() {
        const devices = { desktop: { sessions: 0, conversions: 0 }, mobile: { sessions: 0, conversions: 0 } };
        
        this.userSessions.forEach(session => {
            const device = session.device || 'desktop';
            if (!devices[device]) devices[device] = { sessions: 0, conversions: 0 };
            
            devices[device].sessions++;
            if (session.conversions.length > 0) {
                devices[device].conversions++;
            }
        });
        
        // Calculate conversion rates
        Object.keys(devices).forEach(device => {
            const data = devices[device];
            data.conversion_rate = data.sessions > 0 ? (data.conversions / data.sessions) * 100 : 0;
        });
        
        return devices;
    }
    
    // ==================== UTILITY METHODS ====================
    
    hashUserId(userId) {
        let hash = 0;
        for (let i = 0; i < userId.length; i++) {
            const char = userId.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return Math.abs(hash) % 100; // Return percentage
    }
    
    calculateStatisticalSignificance(variants) {
        if (variants.length !== 2) return 'Multi-variant test';
        
        const [control, variant] = variants;
        
        if (control.visitors < 100 || variant.visitors < 100) {
            return 'Insufficient data';
        }
        
        // Simplified significance calculation
        const controlRate = control.conversions / control.visitors;
        const variantRate = variant.conversions / variant.visitors;
        
        const improvementPercentage = ((variantRate - controlRate) / controlRate) * 100;
        
        if (Math.abs(improvementPercentage) > 20) {
            return 'Statistically significant';
        } else if (Math.abs(improvementPercentage) > 10) {
            return 'Approaching significance';
        } else {
            return 'Not significant';
        }
    }
}

module.exports = ConversionOptimizationEngine;