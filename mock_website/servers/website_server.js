// Eula Elite Security & Transport - Main Website Server (Port 3000)

const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (CSS, JS, images)
app.use('/css', express.static(path.join(__dirname, '../public/css')));
app.use('/js', express.static(path.join(__dirname, '../public/js')));
app.use('/images', express.static(path.join(__dirname, '../public/images')));
app.use('/assets', express.static(path.join(__dirname, '../public/assets')));

// Route handlers for main website pages
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../pages/index.html'));
});

app.get('/index.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../pages/index.html'));
});

app.get('/about.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../pages/about.html'));
});

app.get('/services.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../pages/services.html'));
});

app.get('/contact.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../pages/contact.html'));
});

app.get('/blog.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../pages/blog.html'));
});

// API endpoints for form submissions
app.post('/api/contact', (req, res) => {
    console.log('Contact form submission received:', req.body);
    
    // Simulate processing delay
    setTimeout(() => {
        res.json({
            success: true,
            message: 'Your secure consultation request has been received. We will contact you within 2 hours.',
            referenceId: `EE-${Date.now().toString().slice(-6)}`
        });
    }, 1000);
});

app.post('/api/consultation', (req, res) => {
    console.log('Consultation request received:', req.body);
    
    // Simulate processing based on urgency
    const urgency = req.body.urgency || 'standard';
    const responseTime = urgency === 'urgent' ? 500 : urgency === 'priority' ? 1000 : 2000;
    
    setTimeout(() => {
        res.json({
            success: true,
            message: `Consultation request received. Our Licensed Level IV PPO will contact you within ${urgency === 'urgent' ? '1 hour' : urgency === 'priority' ? '2 hours' : '4 hours'}.`,
            urgency: urgency,
            confidentialityLevel: req.body.confidentiality_level || 'standard',
            referenceId: `CON-${Date.now().toString().slice(-6)}`
        });
    }, responseTime);
});

app.post('/api/quote', (req, res) => {
    console.log('Quote request received:', req.body);
    
    // Calculate quote based on service type and addons
    const baseRates = {
        daily: 3000,
        weekly: 12000,
        monthly: 25000
    };
    
    const addonRates = {
        armored_vehicle: 500,
        additional_officers: 1000,
        event_coordination: 750,
        travel_security: 1200,
        family_protection: 800
    };
    
    const serviceType = req.body.service_type;
    const duration = parseInt(req.body.duration) || 1;
    const addons = req.body.addons || [];
    
    let baseTotal = baseRates[serviceType] * duration;
    let addonTotal = 0;
    
    if (Array.isArray(addons)) {
        addonTotal = addons.reduce((total, addon) => {
            return total + (addonRates[addon] * duration);
        }, 0);
    }
    
    const totalAmount = baseTotal + addonTotal;
    
    res.json({
        success: true,
        quote: {
            serviceType: serviceType,
            duration: duration,
            baseAmount: baseTotal,
            addonAmount: addonTotal,
            totalAmount: totalAmount,
            currency: 'USD',
            validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 7 days from now
        }
    });
});

app.post('/api/emergency', (req, res) => {
    console.log('🚨 EMERGENCY RESPONSE TRIGGERED:', req.body);
    
    // Log emergency details
    const emergency = {
        timestamp: new Date().toISOString(),
        location: req.body.location,
        threatLevel: req.body.threatLevel || 'unknown',
        clientId: req.body.clientId,
        contactNumber: req.body.contactNumber,
        description: req.body.description
    };
    
    // In a real system, this would:
    // 1. Alert all available PPOs
    // 2. Dispatch closest unit
    // 3. Notify command center
    // 4. Log incident
    
    res.json({
        success: true,
        emergencyId: `EMG-${Date.now()}`,
        message: 'Emergency response protocols activated. Licensed Level IV PPO dispatched.',
        estimatedArrival: '12-15 minutes',
        dispatchedUnit: 'Unit Alpha-7',
        commandCenter: 'Houston Command active',
        instructions: 'Please remain in secure location. PPO will contact you via provided number.'
    });
});

// Newsletter subscription
app.post('/api/newsletter', (req, res) => {
    console.log('Newsletter subscription:', req.body);
    
    res.json({
        success: true,
        message: 'Successfully subscribed to security insights. All communications are encrypted.',
        email: req.body.email
    });
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        service: 'Eula Elite Main Website',
        port: PORT,
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        memory: process.memoryUsage()
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, '../pages/404.html'));
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Website server error:', err);
    res.status(500).json({
        success: false,
        message: 'Internal server error. Please contact our emergency line if this is urgent.',
        emergency: '(713) 555-1234'
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`
🛡️  Eula Elite Security & Transport - Main Website Server
📍 Running on: http://localhost:${PORT}
🏢 Service: Fortune 500-caliber executive protection
🔒 Status: Licensed Level IV PPO services active
⚡ Emergency Line: (713) 555-1234

Available Pages:
• http://localhost:${PORT}/ (Homepage)
• http://localhost:${PORT}/about.html (About Us)
• http://localhost:${PORT}/services.html (Protection Services)
• http://localhost:${PORT}/contact.html (Secure Contact)
• http://localhost:${PORT}/blog.html (Security Insights)

API Endpoints:
• POST /api/contact (Contact form)
• POST /api/consultation (Consultation requests)
• POST /api/quote (Service quotes)
• POST /api/emergency (Emergency response)
• POST /api/newsletter (Newsletter subscription)
• GET /health (Health check)

Asset Server: http://localhost:8080
Admin Dashboard: http://localhost:3001
    `);
});

module.exports = app;