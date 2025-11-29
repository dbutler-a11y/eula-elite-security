// Eula Elite Security & Transport - Admin Dashboard Server (Port 3001)

const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files for admin dashboard
app.use('/css', express.static(path.join(__dirname, '../admin/public/css')));
app.use('/js', express.static(path.join(__dirname, '../admin/public/js')));
app.use('/images', express.static(path.join(__dirname, '../admin/public/images')));

// Basic authentication simulation (in production, use proper auth)
const authenticateAdmin = (req, res, next) => {
    // Skip auth for static files and login page
    if (req.path.startsWith('/css') || req.path.startsWith('/js') || req.path === '/login.html') {
        return next();
    }
    
    // Simulate authentication check
    const isAuthenticated = req.headers.authorization || req.session?.authenticated;
    
    if (!isAuthenticated && req.path !== '/login') {
        return res.redirect('/login.html');
    }
    
    next();
};

// Apply authentication middleware
app.use(authenticateAdmin);

// Admin dashboard routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../admin/pages/index.html'));
});

app.get('/index.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../admin/pages/index.html'));
});

app.get('/clients.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../admin/pages/clients.html'));
});

app.get('/bookings.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../admin/pages/bookings.html'));
});

app.get('/ppo.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../admin/pages/ppo.html'));
});

app.get('/content.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../admin/pages/content.html'));
});

// API endpoints for admin operations
app.get('/api/dashboard/stats', (req, res) => {
    const stats = {
        totalClients: 127,
        activeBookings: 18,
        monthlyRevenue: 485000,
        responseTime: 12.5,
        clientSatisfaction: 98.7,
        activePPOs: 34,
        emergencyResponses: 3,
        completedMissions: 245,
        uptime: '99.9%',
        systemStatus: 'operational'
    };
    
    res.json(stats);
});

app.get('/api/clients', (req, res) => {
    const clients = [
        {
            id: 1,
            name: 'Marcus Rodriguez',
            type: 'Professional Athlete',
            status: 'Active',
            package: 'Monthly Elite Membership',
            joinDate: '2024-01-15',
            lastContact: '2024-12-01',
            riskLevel: 'High',
            ppoAssigned: 'James Mitchell',
            phone: '(713) 555-0101',
            email: 'secure@marcus-rodriguez.com',
            address: 'River Oaks, Houston, TX',
            emergencyContacts: 2,
            contractValue: 25000
        },
        {
            id: 2,
            name: 'Sarah Chen',
            type: 'Fortune 500 Executive',
            status: 'Active',
            package: 'Weekly Executive Retainer',
            joinDate: '2024-03-22',
            lastContact: '2024-11-30',
            riskLevel: 'Medium',
            ppoAssigned: 'David Thompson',
            phone: '(713) 555-0102',
            email: 'secure@energycorp.com',
            address: 'Galleria, Houston, TX',
            emergencyContacts: 3,
            contractValue: 48000
        },
        {
            id: 3,
            name: 'Alexandra Williams',
            type: 'Entertainment Industry',
            status: 'Pending',
            package: 'Elite Daily Protection',
            joinDate: '2024-11-28',
            lastContact: '2024-11-28',
            riskLevel: 'High',
            ppoAssigned: 'Pending Assignment',
            phone: '(713) 555-0103',
            email: 'management@alexwilliams.com',
            address: 'The Heights, Houston, TX',
            emergencyContacts: 1,
            contractValue: 3000
        },
        {
            id: 4,
            name: 'Robert Kim',
            type: 'Tech Entrepreneur',
            status: 'Active',
            package: 'Monthly Elite Membership',
            joinDate: '2024-02-10',
            lastContact: '2024-11-29',
            riskLevel: 'Medium',
            ppoAssigned: 'Maria Santos',
            phone: '(713) 555-0104',
            email: 'security@kimtech.com',
            address: 'Memorial, Houston, TX',
            emergencyContacts: 2,
            contractValue: 25000
        },
        {
            id: 5,
            name: 'Diana Foster',
            type: 'Legal Professional',
            status: 'Active',
            package: 'Weekly Executive Retainer',
            joinDate: '2024-05-18',
            lastContact: '2024-11-28',
            riskLevel: 'High',
            ppoAssigned: 'Michael Johnson',
            phone: '(713) 555-0105',
            email: 'dfoster@fosterlaw.com',
            address: 'Downtown, Houston, TX',
            emergencyContacts: 4,
            contractValue: 12000
        }
    ];
    
    res.json(clients);
});

app.get('/api/bookings', (req, res) => {
    const bookings = [
        {
            id: 1,
            clientId: 1,
            client: 'Marcus Rodriguez',
            service: 'Monthly Elite Membership',
            startDate: '2024-12-01',
            endDate: '2024-12-31',
            duration: '30 days',
            status: 'Active',
            ppo: 'James Mitchell',
            vehicle: 'Escalade ESV (Armored)',
            amount: 25000,
            priority: 'High',
            location: 'Houston Metro Area',
            specialRequirements: 'Stadium events, public appearances',
            emergencyContacts: ['Agent', 'Family Manager']
        },
        {
            id: 2,
            clientId: 4,
            client: 'Corporate Event - Energy Corp',
            service: 'Elite Daily Protection',
            startDate: '2024-12-08',
            endDate: '2024-12-08',
            duration: '8 hours',
            status: 'Pending',
            ppo: 'Pending Assignment',
            vehicle: 'Suburban (Standard)',
            amount: 3500,
            priority: 'Medium',
            location: 'Galleria Conference Center',
            specialRequirements: 'VIP reception, media presence',
            emergencyContacts: ['Event Coordinator']
        },
        {
            id: 3,
            clientId: 2,
            client: 'Sarah Chen',
            service: 'Weekly Executive Retainer',
            startDate: '2024-12-10',
            endDate: '2024-12-17',
            duration: '7 days',
            status: 'Confirmed',
            ppo: 'David Thompson',
            vehicle: 'Mercedes S-Class',
            amount: 12000,
            priority: 'High',
            location: 'Houston + Austin Travel',
            specialRequirements: 'Board meetings, confidential travel',
            emergencyContacts: ['Executive Assistant', 'Legal Counsel']
        },
        {
            id: 4,
            clientId: 5,
            client: 'Diana Foster',
            service: 'Weekly Executive Retainer',
            startDate: '2024-12-15',
            endDate: '2024-12-22',
            duration: '7 days',
            status: 'Confirmed',
            ppo: 'Michael Johnson',
            vehicle: 'Rolls-Royce Ghost',
            amount: 15000,
            priority: 'High',
            location: 'Downtown Houston + Courthouse',
            specialRequirements: 'High-profile trial, media attention',
            emergencyContacts: ['Law Firm Security', 'Family']
        }
    ];
    
    res.json(bookings);
});

app.get('/api/ppos', (req, res) => {
    const ppos = [
        {
            id: 1,
            name: 'James Mitchell',
            license: 'TX-PPO-L4-001234',
            status: 'Active',
            currentAssignment: 'Marcus Rodriguez',
            certifications: ['Level IV PPO', 'Advanced Tactical', 'VIP Protection', 'Emergency Medical'],
            experience: 12,
            rating: 4.9,
            availability: 'Assigned',
            phone: '(713) 555-2001',
            email: 'j.mitchell@eulalite.com',
            specializations: ['Celebrity Protection', 'Stadium Security', 'High-Threat Response'],
            vehicleAuthorizations: ['Armored Vehicles', 'Luxury Fleet'],
            lastTraining: '2024-10-15',
            emergencyResponse: true,
            languages: ['English', 'Spanish']
        },
        {
            id: 2,
            name: 'David Thompson',
            license: 'TX-PPO-L4-002345',
            status: 'Active',
            currentAssignment: 'Sarah Chen',
            certifications: ['Level IV PPO', 'Executive Protection', 'Crisis Management', 'Digital Security'],
            experience: 8,
            rating: 4.8,
            availability: 'Assigned',
            phone: '(713) 555-2002',
            email: 'd.thompson@eulalite.com',
            specializations: ['Corporate Executive Protection', 'Travel Security', 'Threat Assessment'],
            vehicleAuthorizations: ['Luxury Fleet', 'Standard Fleet'],
            lastTraining: '2024-11-20',
            emergencyResponse: true,
            languages: ['English', 'Mandarin']
        },
        {
            id: 3,
            name: 'Maria Santos',
            license: 'TX-PPO-L4-003456',
            status: 'Active',
            currentAssignment: 'Robert Kim',
            certifications: ['Level IV PPO', 'Digital Security', 'Emergency Response', 'Medical Training'],
            experience: 6,
            rating: 4.9,
            availability: 'Assigned',
            phone: '(713) 555-2003',
            email: 'm.santos@eulalite.com',
            specializations: ['Tech Industry Protection', 'Cyber Threat Awareness', 'Family Protection'],
            vehicleAuthorizations: ['Standard Fleet', 'Emergency Response'],
            lastTraining: '2024-11-01',
            emergencyResponse: true,
            languages: ['English', 'Spanish', 'Portuguese']
        },
        {
            id: 4,
            name: 'Michael Johnson',
            license: 'TX-PPO-L4-004567',
            status: 'Active',
            currentAssignment: 'Diana Foster',
            certifications: ['Level IV PPO', 'Legal Security', 'Courthouse Protection', 'Crisis Management'],
            experience: 10,
            rating: 4.7,
            availability: 'Assigned',
            phone: '(713) 555-2004',
            email: 'm.johnson@eulalite.com',
            specializations: ['Legal Professional Protection', 'Courthouse Security', 'Media Management'],
            vehicleAuthorizations: ['Luxury Fleet', 'Armored Vehicles'],
            lastTraining: '2024-10-30',
            emergencyResponse: true,
            languages: ['English']
        },
        {
            id: 5,
            name: 'Ashley Rodriguez',
            license: 'TX-PPO-L4-005678',
            status: 'Available',
            currentAssignment: 'Available',
            certifications: ['Level IV PPO', 'Event Security', 'VIP Protection', 'Crowd Management'],
            experience: 5,
            rating: 4.8,
            availability: 'Available',
            phone: '(713) 555-2005',
            email: 'a.rodriguez@eulalite.com',
            specializations: ['Event Security', 'Entertainment Protection', 'Social Media Threat Analysis'],
            vehicleAuthorizations: ['Standard Fleet'],
            lastTraining: '2024-11-15',
            emergencyResponse: true,
            languages: ['English', 'Spanish']
        }
    ];
    
    res.json(ppos);
});

app.get('/api/activity', (req, res) => {
    const activities = [
        {
            id: 1,
            type: 'booking',
            message: 'New Elite Daily Protection booking - Downtown Houston',
            details: 'Corporate event security requested by Energy Corp',
            time: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
            priority: 'high',
            userId: 'System',
            clientId: 4
        },
        {
            id: 2,
            type: 'client',
            message: 'VIP client consultation scheduled for tomorrow',
            details: 'Alexandra Williams - Entertainment industry protection assessment',
            time: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
            priority: 'medium',
            userId: 'Admin',
            clientId: 3
        },
        {
            id: 3,
            type: 'ppo',
            message: 'Level IV PPO certification renewal completed',
            details: 'Ashley Rodriguez certification updated through 2026',
            time: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
            priority: 'low',
            userId: 'HR System',
            ppoId: 5
        },
        {
            id: 4,
            type: 'emergency',
            message: 'Emergency response completed - Memorial area',
            details: 'False alarm - client accidentally triggered panic button',
            time: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            priority: 'high',
            userId: 'Command Center',
            clientId: 4
        },
        {
            id: 5,
            type: 'payment',
            message: 'Monthly membership payment received - $25,000',
            details: 'Marcus Rodriguez - December 2024 payment processed',
            time: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
            priority: 'medium',
            userId: 'Payment System',
            clientId: 1
        }
    ];
    
    res.json(activities);
});

// Admin operations endpoints
app.post('/api/clients', (req, res) => {
    console.log('Creating new client:', req.body);
    
    const newClient = {
        id: Date.now(),
        ...req.body,
        status: 'Pending',
        joinDate: new Date().toISOString().split('T')[0],
        lastContact: new Date().toISOString().split('T')[0]
    };
    
    res.json({
        success: true,
        message: 'Client created successfully',
        client: newClient
    });
});

app.put('/api/clients/:id', (req, res) => {
    console.log(`Updating client ${req.params.id}:`, req.body);
    
    res.json({
        success: true,
        message: 'Client updated successfully',
        clientId: req.params.id
    });
});

app.delete('/api/clients/:id', (req, res) => {
    console.log(`Deleting client ${req.params.id}`);
    
    res.json({
        success: true,
        message: 'Client deleted successfully',
        clientId: req.params.id
    });
});

app.post('/api/bookings', (req, res) => {
    console.log('Creating new booking:', req.body);
    
    const newBooking = {
        id: Date.now(),
        ...req.body,
        status: 'Pending',
        createdDate: new Date().toISOString().split('T')[0]
    };
    
    res.json({
        success: true,
        message: 'Booking created successfully',
        booking: newBooking
    });
});

app.put('/api/bookings/:id/assign-ppo', (req, res) => {
    console.log(`Assigning PPO to booking ${req.params.id}:`, req.body);
    
    res.json({
        success: true,
        message: 'PPO assigned successfully',
        bookingId: req.params.id,
        ppoId: req.body.ppoId
    });
});

app.post('/api/emergency/trigger', (req, res) => {
    console.log('🚨 ADMIN EMERGENCY TRIGGER:', req.body);
    
    res.json({
        success: true,
        message: 'Emergency protocols activated. All available PPOs have been notified.',
        emergencyId: `EMG-ADMIN-${Date.now()}`,
        timestamp: new Date().toISOString(),
        responseUnits: ['Alpha-7', 'Bravo-3', 'Command-1'],
        estimatedResponse: '8-12 minutes'
    });
});

app.post('/api/reports/generate', (req, res) => {
    console.log('Generating report:', req.body);
    
    const reportTypes = {
        'daily-report': 'Daily Operations Summary',
        'client-activity': 'Client Activity Report',
        'ppo-performance': 'PPO Performance Analysis',
        'financial': 'Financial Summary',
        'security-incidents': 'Security Incidents Report'
    };
    
    res.json({
        success: true,
        message: `${reportTypes[req.body.type] || 'Report'} generated successfully`,
        reportId: `RPT-${Date.now()}`,
        downloadUrl: `/api/reports/download/${Date.now()}`,
        generatedAt: new Date().toISOString()
    });
});

app.post('/api/system/backup', (req, res) => {
    console.log('Creating system backup');
    
    res.json({
        success: true,
        message: 'System backup initiated successfully',
        backupId: `BKP-${Date.now()}`,
        estimatedCompletion: '15-20 minutes',
        timestamp: new Date().toISOString()
    });
});

// Health check for admin system
app.get('/api/health', (req, res) => {
    res.json({
        status: 'healthy',
        service: 'Eula Elite Admin Dashboard',
        port: PORT,
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        connections: {
            database: 'connected',
            commandCenter: 'active',
            emergencySystem: 'operational',
            communicationHub: 'online'
        }
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Admin endpoint not found',
        availableEndpoints: [
            'GET /',
            'GET /api/dashboard/stats',
            'GET /api/clients',
            'GET /api/bookings',
            'GET /api/ppos',
            'GET /api/activity',
            'POST /api/emergency/trigger',
            'GET /api/health'
        ]
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Admin server error:', err);
    res.status(500).json({
        success: false,
        message: 'Admin system error',
        error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
});

// Start admin server
app.listen(PORT, () => {
    console.log(`
🛡️  Eula Elite Security & Transport - Admin Dashboard Server
📍 Running on: http://localhost:${PORT}
🔐 Access: Admin personnel only
⚡ Command Center: Active
🚨 Emergency Response: Ready

Admin Dashboard:
• http://localhost:${PORT}/ (Operations Overview)
• http://localhost:${PORT}/clients.html (Client Management)
• http://localhost:${PORT}/bookings.html (Booking System)
• http://localhost:${PORT}/ppo.html (PPO Management)
• http://localhost:${PORT}/content.html (Content Management)

API Endpoints:
• GET /api/dashboard/stats (Dashboard statistics)
• GET /api/clients (Client data)
• GET /api/bookings (Booking data)
• GET /api/ppos (PPO data)
• GET /api/activity (Recent activity)
• POST /api/emergency/trigger (Emergency protocols)
• GET /api/health (System health)

Security Notice: This is a mock implementation for planning purposes.
In production, proper authentication and encryption would be required.
    `);
});

module.exports = app;