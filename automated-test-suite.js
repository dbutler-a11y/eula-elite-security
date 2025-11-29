#!/usr/bin/env node
// Eula Elite Security - Automated Testing Suite
// Reduces redundant errors through comprehensive validation

const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const fs = require('fs');

class EulaEliteTestSuite {
    constructor() {
        this.results = {
            passed: 0,
            failed: 0,
            errors: []
        };
        this.baseUrl = 'http://localhost:8081';
    }

    async runFullTestSuite() {
        console.log('\n🛡️  Eula Elite Security - Automated Test Suite');
        console.log('='.repeat(50));
        
        try {
            await this.testServerHealth();
            await this.testAssetAvailability();
            await this.testAPIEndpoints();
            await this.testFormSubmissions();
            await this.testErrorHandling();
            await this.testMarketingAutomation();
            await this.testConversionOptimization();
            await this.testScalingInfrastructure();
            
            this.generateReport();
            
            if (this.results.failed === 0) {
                console.log('\n✅ ALL TESTS PASSED - System healthy, no redundant errors detected');
                process.exit(0);
            } else {
                console.log(`\n❌ ${this.results.failed} TESTS FAILED - Issues detected that could cause redundant errors`);
                process.exit(1);
            }
        } catch (error) {
            console.error('💥 Test suite encountered critical error:', error.message);
            process.exit(1);
        }
    }

    async testServerHealth() {
        console.log('\n📊 Testing Server Health...');
        
        const healthTests = [
            { name: 'Homepage', url: '/', expectedStatus: 200 },
            { name: 'About Page', url: '/about.html', expectedStatus: 200 },
            { name: 'Services Page', url: '/services.html', expectedStatus: 200 },
            { name: 'Contact Page', url: '/contact.html', expectedStatus: 200 },
            { name: 'Admin Dashboard', url: '/admin', expectedStatus: 200 },
            { name: 'Health Check', url: '/health', expectedStatus: 200 }
        ];

        for (const test of healthTests) {
            await this.validateEndpoint(test);
        }
    }

    async testAssetAvailability() {
        console.log('\n🖼️  Testing Asset Availability...');
        
        try {
            // Test asset API
            const assetApiTest = await this.validateEndpoint({
                name: 'Asset API',
                url: '/api/assets',
                expectedStatus: 200
            });

            if (assetApiTest.passed) {
                const response = await fetch(`${this.baseUrl}/api/assets`);
                const assetData = await response.json();
                
                console.log(`   📁 Found ${assetData.count} assets`);
                
                // Test flagship hero image specifically
                if (assetData.featured && assetData.featured.flagship) {
                    await this.validateEndpoint({
                        name: 'Flagship Hero Image',
                        url: '/assets/officer_flagship_hero.png',
                        expectedStatus: 200
                    });
                }

                // Test a few key assets
                for (const asset of assetData.assets.slice(0, 3)) {
                    await this.validateEndpoint({
                        name: `Asset: ${asset.filename}`,
                        url: asset.url,
                        expectedStatus: 200
                    });
                }
            }
        } catch (error) {
            this.logError('Asset Testing', error.message);
        }
    }

    async testAPIEndpoints() {
        console.log('\n🔌 Testing API Endpoints...');
        
        const apiTests = [
            { name: 'Admin Stats API', url: '/api/admin/stats' },
            { name: 'Admin Activity API', url: '/api/admin/recent-activity' },
            { name: 'Admin Clients API', url: '/api/admin/clients' }
        ];

        for (const test of apiTests) {
            await this.validateEndpoint({
                name: test.name,
                url: test.url,
                expectedStatus: 200
            });
        }
    }

    async testFormSubmissions() {
        console.log('\n📝 Testing Form Submissions...');
        
        try {
            // Test contact form
            const contactResponse = await fetch(`${this.baseUrl}/api/contact`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: 'Test Client',
                    email: 'test@example.com',
                    service: 'monthly',
                    message: 'Automated test submission'
                })
            });

            if (contactResponse.ok) {
                console.log('   ✅ Contact form submission: PASS');
                this.results.passed++;
            } else {
                console.log('   ❌ Contact form submission: FAIL');
                this.results.failed++;
                this.results.errors.push('Contact form not accepting submissions');
            }

            // Test quote system
            const quoteResponse = await fetch(`${this.baseUrl}/api/quote`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    service_type: 'monthly',
                    duration: 1,
                    addons: ['armored_vehicle']
                })
            });

            if (quoteResponse.ok) {
                const quoteData = await quoteResponse.json();
                const expectedTotal = 25000 + 500; // Monthly + armored vehicle addon
                
                if (quoteData.quote && quoteData.quote.totalAmount === expectedTotal) {
                    console.log('   ✅ Quote calculation: PASS');
                    this.results.passed++;
                } else {
                    console.log(`   ❌ Quote calculation: FAIL (Expected: $${expectedTotal}, Got: $${quoteData.quote?.totalAmount})`);
                    this.results.failed++;
                    this.results.errors.push('Quote calculation incorrect');
                }
            } else {
                console.log('   ❌ Quote system: FAIL');
                this.results.failed++;
                this.results.errors.push('Quote system not responding');
            }

        } catch (error) {
            this.logError('Form Testing', error.message);
        }
    }

    async testErrorHandling() {
        console.log('\n🚨 Testing Error Handling...');
        
        // Test 404 handling
        const notFoundResponse = await fetch(`${this.baseUrl}/nonexistent-page`);
        if (notFoundResponse.status === 404) {
            console.log('   ✅ 404 error handling: PASS');
            this.results.passed++;
        } else {
            console.log('   ❌ 404 error handling: FAIL');
            this.results.failed++;
            this.results.errors.push('404 errors not properly handled');
        }

        // Test malformed API requests
        try {
            const malformedResponse = await fetch(`${this.baseUrl}/api/quote`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: 'invalid json'
            });
            
            if (malformedResponse.status >= 400) {
                console.log('   ✅ Malformed request handling: PASS');
                this.results.passed++;
            } else {
                console.log('   ❌ Malformed request handling: FAIL');
                this.results.failed++;
                this.results.errors.push('Malformed requests not properly handled');
            }
        } catch (error) {
            console.log('   ✅ Malformed request handling: PASS (properly rejected)');
            this.results.passed++;
        }
    }

    async validateEndpoint(test) {
        try {
            const response = await fetch(`${this.baseUrl}${test.url}`);
            
            if (response.status === test.expectedStatus) {
                console.log(`   ✅ ${test.name}: PASS`);
                this.results.passed++;
                return { passed: true, status: response.status };
            } else {
                console.log(`   ❌ ${test.name}: FAIL (${response.status})`);
                this.results.failed++;
                this.results.errors.push(`${test.name} returned ${response.status}, expected ${test.expectedStatus}`);
                return { passed: false, status: response.status };
            }
        } catch (error) {
            console.log(`   💥 ${test.name}: ERROR (${error.message})`);
            this.results.failed++;
            this.results.errors.push(`${test.name}: ${error.message}`);
            return { passed: false, error: error.message };
        }
    }

    logError(category, message) {
        console.log(`   ❌ ${category}: ERROR (${message})`);
        this.results.failed++;
        this.results.errors.push(`${category}: ${message}`);
    }

    generateReport() {
        console.log('\n📊 TEST RESULTS SUMMARY');
        console.log('='.repeat(30));
        console.log(`✅ Passed: ${this.results.passed}`);
        console.log(`❌ Failed: ${this.results.failed}`);
        console.log(`📊 Success Rate: ${((this.results.passed / (this.results.passed + this.results.failed)) * 100).toFixed(1)}%`);
        
        if (this.results.errors.length > 0) {
            console.log('\n🚨 ERRORS DETECTED:');
            this.results.errors.forEach((error, index) => {
                console.log(`   ${index + 1}. ${error}`);
            });
        }

        // Save detailed results
        const reportData = {
            timestamp: new Date().toISOString(),
            results: this.results,
            systemInfo: {
                nodeVersion: process.version,
                platform: process.platform,
                uptime: process.uptime()
            }
        };

        try {
            fs.writeFileSync('./test-results.json', JSON.stringify(reportData, null, 2));
            console.log('\n📄 Detailed results saved to: test-results.json');
        } catch (error) {
            console.log('⚠️  Could not save detailed results:', error.message);
        }
    }

    // ==================== MARKETING AUTOMATION TESTS ====================
    
    async testMarketingAutomation() {
        console.log('\\n📧 Testing Marketing Automation...');
        
        const marketingTests = [
            { name: 'Marketing Stats API', url: '/api/marketing/stats' },
            { name: 'Marketing Leads API', url: '/api/marketing/leads' },
            { name: 'Marketing Campaigns API', url: '/api/marketing/campaigns' }
        ];
        
        for (const test of marketingTests) {
            await this.validateEndpoint({
                name: test.name,
                url: test.url,
                expectedStatus: 200
            });
        }
    }
    
    // ==================== CONVERSION OPTIMIZATION TESTS ====================
    
    async testConversionOptimization() {
        console.log('\\n🎯 Testing Conversion Optimization...');
        
        const optimizationTests = [
            { name: 'A/B Tests API', url: '/api/optimization/tests' },
            { name: 'Optimization Metrics API', url: '/api/optimization/metrics' },
            { name: 'Funnel Analysis API', url: '/api/optimization/funnel' },
            { name: 'Optimization Content API', url: '/api/optimization/content' }
        ];
        
        for (const test of optimizationTests) {
            await this.validateEndpoint({
                name: test.name,
                url: test.url,
                expectedStatus: 200
            });
        }
    }
    
    // ==================== SCALING INFRASTRUCTURE TESTS ====================
    
    async testScalingInfrastructure() {
        console.log('\\n🚀 Testing Scaling Infrastructure...');
        
        const infrastructureTests = [
            { name: 'Infrastructure Stats API', url: '/api/infrastructure/stats' },
            { name: 'Performance Metrics API', url: '/api/infrastructure/performance' }
        ];
        
        for (const test of infrastructureTests) {
            await this.validateEndpoint({
                name: test.name,
                url: test.url,
                expectedStatus: 200
            });
        }
    }

    // Static method for quick health check
    static async quickHealthCheck() {
        const suite = new EulaEliteTestSuite();
        try {
            const response = await fetch(`${suite.baseUrl}/health`);
            if (response.ok) {
                const health = await response.json();
                console.log('✅ Server is healthy:', health);
                return true;
            }
        } catch (error) {
            console.log('❌ Server health check failed:', error.message);
            return false;
        }
    }
}

// Auto-run if called directly
if (require.main === module) {
    const args = process.argv.slice(2);
    
    if (args.includes('--quick') || args.includes('-q')) {
        EulaEliteTestSuite.quickHealthCheck();
    } else {
        const suite = new EulaEliteTestSuite();
        suite.runFullTestSuite();
    }
}

module.exports = EulaEliteTestSuite;