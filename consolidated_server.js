// Eula Elite Security & Transport - Consolidated Server (Port 8081)
// Combines: Main Website + Admin Dashboard + Asset Server

const express = require('express');
const path = require('path');
const cors = require('cors');
const fs = require('fs');
const { createServer } = require('http');
const { Server } = require('socket.io');

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});
const PORT = 8081;

// Chat storage (in production, use a database)
const activeChats = new Map();
const chatHistory = new Map();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static file serving - Assets first (highest priority) with recursive serving
app.use('/assets', express.static(path.join(__dirname, '03_Visual_Assets')));

// Serve flagship hero image directly for easy access
app.get('/assets/officer_flagship_hero.png', (req, res) => {
    res.sendFile(path.join(__dirname, '03_Visual_Assets/Character_Images/Officer_Primary/officer_flagship_hero.png'));
});

// Serve logo from any location
app.use('/logo-mark.svg', (req, res) => {
    res.sendFile(path.join(__dirname, '03_Visual_Assets/logo-mark.svg'));
});

// Serve website static files
app.use('/css', express.static(path.join(__dirname, 'mock_website/public/css')));
app.use('/js', express.static(path.join(__dirname, 'mock_website/public/js')));
app.use('/images', express.static(path.join(__dirname, 'mock_website/public/images')));

// Admin static files
app.use('/admin/css', express.static(path.join(__dirname, 'mock_website/admin/public/css')));
app.use('/admin/js', express.static(path.join(__dirname, 'mock_website/admin/public/js')));

// Asset Gallery Endpoint - Dynamic loading of all assets (recursive)
app.get('/api/assets', (req, res) => {
    const assetsDir = path.join(__dirname, '03_Visual_Assets');
    
    function getAllAssets(dir, baseUrl = '/assets') {
        let assets = [];
        try {
            const items = fs.readdirSync(dir);
            
            for (const item of items) {
                const fullPath = path.join(dir, item);
                const stat = fs.statSync(fullPath);
                
                if (stat.isDirectory()) {
                    // Recursively get assets from subdirectories
                    const subAssets = getAllAssets(fullPath, `${baseUrl}/${item}`);
                    assets = assets.concat(subAssets);
                } else if (/\.(jpg|jpeg|png|gif|svg|webp)$/i.test(item)) {
                    // Add image files
                    assets.push({
                        filename: item,
                        url: `${baseUrl}/${item}`,
                        type: path.extname(item).toLowerCase(),
                        size: stat.size,
                        directory: path.relative(assetsDir, dir) || 'root'
                    });
                }
            }
        } catch (error) {
            console.error('Error reading directory:', dir, error);
        }
        return assets;
    }
    
    try {
        const assets = getAllAssets(assetsDir);
        res.json({
            success: true,
            assets: assets,
            count: assets.length,
            featured: {
                flagship: assets.find(a => a.filename.includes('flagship')),
                hero: assets.find(a => a.filename.includes('hero'))
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to read assets directory'
        });
    }
});

// ==================== MAIN WEBSITE ROUTES ====================

// Homepage and main pages
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'mock_website/pages/index.html'));
});

app.get('/index.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'mock_website/pages/index.html'));
});

app.get('/about.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'mock_website/pages/about.html'));
});

app.get('/services.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'mock_website/pages/services.html'));
});

app.get('/contact.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'mock_website/pages/contact.html'));
});

app.get('/blog.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'mock_website/pages/blog.html'));
});

// ==================== ADMIN DASHBOARD ROUTES ====================

// Admin dashboard pages
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'mock_website/admin/pages/index.html'));
});

app.get('/admin/', (req, res) => {
    res.sendFile(path.join(__dirname, 'mock_website/admin/pages/index.html'));
});

app.get('/admin/index.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'mock_website/admin/pages/index.html'));
});

app.get('/admin/clients.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'mock_website/admin/pages/clients.html'));
});

app.get('/admin/bookings.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'mock_website/admin/pages/bookings.html'));
});

app.get('/admin/ppo.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'mock_website/admin/pages/ppo.html'));
});

app.get('/admin/content.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'mock_website/admin/pages/content.html'));
});

app.get('/admin/chat.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'mock_website/admin/pages/chat.html'));
});

// ==================== LIVE CHAT SOCKET.IO ====================

// Socket.IO connection handling
io.on('connection', (socket) => {
    console.log('🔗 Client connected to live chat:', socket.id);
    
    // Join client to a chat room
    socket.on('join_chat', (data) => {
        const { clientId, clientName, isAdmin = false } = data;
        const roomId = isAdmin ? 'admin_room' : `client_${clientId}`;
        
        socket.join(roomId);
        socket.clientId = clientId;
        socket.clientName = clientName;
        socket.isAdmin = isAdmin;
        socket.roomId = roomId;
        
        // Store active chat session
        if (!isAdmin) {
            activeChats.set(clientId, {
                clientId,
                clientName,
                socketId: socket.id,
                startTime: new Date(),
                status: 'active',
                roomId
            });
            
            // Notify admin of new chat
            io.to('admin_room').emit('new_chat_alert', {
                clientId,
                clientName,
                startTime: new Date(),
                message: `${clientName} has started a secure chat session`
            });
        }
        
        console.log(`📱 ${isAdmin ? 'Admin' : 'Client'} ${clientName} joined room: ${roomId}`);
        
        // Send chat history if available
        const history = chatHistory.get(clientId) || [];
        socket.emit('chat_history', history);
        
        // Send active chats list to admins
        if (isAdmin) {
            const activeChatsList = Array.from(activeChats.values());
            socket.emit('active_chats_update', activeChatsList);
        }
    });
    
    // Handle new messages
    socket.on('send_message', (data) => {
        const { message, clientId, isEmergency = false } = data;
        const timestamp = new Date();
        
        const messageData = {
            id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            message,
            sender: socket.isAdmin ? 'Admin PPO' : socket.clientName,
            senderType: socket.isAdmin ? 'admin' : 'client',
            timestamp,
            clientId: socket.isAdmin ? clientId : socket.clientId,
            isEmergency
        };
        
        // Store message in history
        const targetClientId = socket.isAdmin ? clientId : socket.clientId;
        if (!chatHistory.has(targetClientId)) {
            chatHistory.set(targetClientId, []);
        }
        chatHistory.get(targetClientId).push(messageData);
        
        // Route message to appropriate room
        if (socket.isAdmin) {
            // Admin sending to specific client
            io.to(`client_${clientId}`).emit('new_message', messageData);
            io.to('admin_room').emit('new_message', messageData); // Echo to admin
        } else {
            // Client sending to admin
            io.to('admin_room').emit('new_message', messageData);
            io.to(`client_${socket.clientId}`).emit('new_message', messageData); // Echo to client
        }
        
        // Handle emergency messages
        if (isEmergency) {
            console.log('🚨 EMERGENCY CHAT MESSAGE:', messageData);
            io.to('admin_room').emit('emergency_alert', {
                ...messageData,
                alertType: 'emergency_chat',
                urgency: 'critical'
            });
        }
        
        console.log(`💬 Message from ${messageData.sender}: ${message.substring(0, 50)}...`);
    });
    
    // Handle admin taking over chat
    socket.on('admin_take_chat', (data) => {
        const { clientId, adminName } = data;
        
        if (activeChats.has(clientId)) {
            const chat = activeChats.get(clientId);
            chat.adminHandler = adminName;
            chat.handlerSocketId = socket.id;
            
            // Notify client
            io.to(`client_${clientId}`).emit('admin_joined', {
                adminName,
                message: `${adminName} has joined your secure chat. PPO assistance is now active.`
            });
            
            // Notify other admins
            socket.to('admin_room').emit('chat_taken', {
                clientId,
                adminName,
                message: `${adminName} is now handling chat with ${chat.clientName}`
            });
        }
    });
    
    // Handle typing indicators
    socket.on('typing_start', (data) => {
        const { clientId } = data;
        if (socket.isAdmin) {
            io.to(`client_${clientId}`).emit('admin_typing');
        } else {
            io.to('admin_room').emit('client_typing', {
                clientId: socket.clientId,
                clientName: socket.clientName
            });
        }
    });
    
    socket.on('typing_stop', (data) => {
        const { clientId } = data;
        if (socket.isAdmin) {
            io.to(`client_${clientId}`).emit('admin_typing_stop');
        } else {
            io.to('admin_room').emit('client_typing_stop', {
                clientId: socket.clientId
            });
        }
    });
    
    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('🔌 Client disconnected from live chat:', socket.id);
        
        if (!socket.isAdmin && socket.clientId) {
            // Update chat status
            if (activeChats.has(socket.clientId)) {
                const chat = activeChats.get(socket.clientId);
                chat.status = 'disconnected';
                chat.endTime = new Date();
                
                // Notify admin
                io.to('admin_room').emit('client_disconnected', {
                    clientId: socket.clientId,
                    clientName: socket.clientName,
                    endTime: new Date()
                });
                
                // Clean up after 1 hour
                setTimeout(() => {
                    activeChats.delete(socket.clientId);
                }, 3600000);
            }
        }
        
        if (socket.isAdmin) {
            // Update active chats list for remaining admins
            const activeChatsList = Array.from(activeChats.values());
            socket.to('admin_room').emit('active_chats_update', activeChatsList);
        }
    });
});

// ==================== API ENDPOINTS ====================

// Website API endpoints
app.post('/api/contact', (req, res) => {
    console.log('Contact form submission received:', req.body);
    
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
            validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        }
    });
});

app.post('/api/emergency', (req, res) => {
    console.log('🚨 EMERGENCY RESPONSE TRIGGERED:', req.body);
    
    const emergency = {
        timestamp: new Date().toISOString(),
        location: req.body.location,
        threatLevel: req.body.threatLevel || 'unknown',
        clientId: req.body.clientId,
        contactNumber: req.body.contactNumber,
        description: req.body.description
    };
    
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

// Admin API endpoints
app.get('/api/admin/stats', (req, res) => {
    res.json({
        totalClients: 127,
        activeBookings: 18,
        monthlyRevenue: 485000,
        clientSatisfaction: 98.7,
        responseTime: 12.5,
        activePPOs: 34,
        emergencyStatus: 'standby'
    });
});

app.get('/api/admin/recent-activity', (req, res) => {
    const activities = [
        { message: "New client consultation scheduled - Rodriguez, M.", time: "2 min ago", type: "consultation" },
        { message: "PPO Team Alpha deployed - Memorial Area", time: "8 min ago", type: "deployment" },
        { message: "Weekly security briefing completed", time: "15 min ago", type: "briefing" },
        { message: "Fleet vehicle maintenance completed - Unit 7", time: "23 min ago", type: "maintenance" },
        { message: "Emergency response drill conducted", time: "34 min ago", type: "drill" },
        { message: "New PPO certification completed - Johnson, K.", time: "1 hr ago", type: "certification" },
        { message: "Client satisfaction survey received - 5 stars", time: "1.5 hrs ago", type: "feedback" },
        { message: "Monthly revenue milestone achieved", time: "2 hrs ago", type: "milestone" }
    ];
    
    res.json({ activities });
});

// Cache warming endpoint for performance
app.post('/api/admin/warm-cache', (req, res) => {
    // Warm up frequently accessed data
    scalingEngine.setCache('admin_stats', {
        totalClients: 127,
        activeBookings: 18,
        monthlyRevenue: 485000
    }, 300);
    
    scalingEngine.setCache('marketing_stats', marketingEngine.getMarketingStats(), 600);
    
    res.json({
        success: true,
        message: 'Cache warmed successfully'
    });
});

// Cache invalidation endpoint
app.post('/api/admin/invalidate-cache', (req, res) => {
    const { pattern } = req.body;
    const invalidatedCount = scalingEngine.invalidateCache(pattern || 'admin');
    
    res.json({
        success: true,
        message: `Cache invalidated: ${invalidatedCount} entries removed`
    });
});

app.get('/api/admin/clients', (req, res) => {
    const clients = [
        {
            id: "CL-001",
            name: "Rodriguez, M.",
            status: "active",
            package: "Monthly Elite",
            lastService: "2024-01-15",
            riskLevel: "medium",
            preferredPPO: "Johnson, K."
        },
        {
            id: "CL-002", 
            name: "Thompson, J.",
            status: "active",
            package: "Weekly Executive",
            lastService: "2024-01-14",
            riskLevel: "high",
            preferredPPO: "Davis, M."
        },
        {
            id: "CL-003",
            name: "Chen, L.",
            status: "pending",
            package: "Daily Protection",
            lastService: "2024-01-12",
            riskLevel: "low",
            preferredPPO: "Wilson, R."
        }
    ];
    
    res.json({ clients });
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
        service: 'Eula Elite Consolidated Server',
        port: PORT,
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        features: [
            'Main Website',
            'Admin Dashboard', 
            'Asset Server',
            'API Endpoints'
        ]
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Page not found',
        availableRoutes: [
            '/ (Homepage)',
            '/admin (Admin Dashboard)',
            '/assets/* (Brand Assets)',
            '/api/* (API Endpoints)'
        ]
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({
        success: false,
        message: 'Internal server error. Please contact our emergency line if this is urgent.',
        emergency: '(713) 555-1234'
    });
});

// Chat API endpoints
app.get('/api/chat/active', (req, res) => {
    const activeChatsList = Array.from(activeChats.values());
    res.json({
        success: true,
        activeChats: activeChatsList,
        count: activeChatsList.length
    });
});

app.get('/api/chat/history/:clientId', (req, res) => {
    const { clientId } = req.params;
    const history = chatHistory.get(clientId) || [];
    
    res.json({
        success: true,
        clientId,
        messages: history,
        count: history.length
    });
});

app.post('/api/chat/emergency', (req, res) => {
    const { clientId, message, location } = req.body;
    
    // Broadcast emergency to all admin sockets
    io.to('admin_room').emit('emergency_alert', {
        type: 'chat_emergency',
        clientId,
        message,
        location,
        timestamp: new Date(),
        urgency: 'critical'
    });
    
    console.log('🚨 CHAT EMERGENCY ALERT:', { clientId, message, location });
    
    res.json({
        success: true,
        message: 'Emergency alert sent to all available PPOs',
        alertId: `CHAT_EMG_${Date.now()}`,
        dispatchStatus: 'alert_sent'
    });
});

// ==================== CONTENT MANAGEMENT API ====================

// In-memory content storage (in production, use a database)
let contentStorage = {
    blog: [
        {
            id: '1',
            title: 'Executive Protection Best Practices for 2024',
            slug: 'executive-protection-best-practices-2024',
            status: 'published',
            category: 'security-tips',
            excerpt: 'Essential security protocols every executive should know in the evolving threat landscape.',
            body: `# Executive Protection Best Practices for 2024

In an increasingly complex threat landscape, executive protection requires a multi-layered approach that combines traditional security measures with cutting-edge technology and intelligence.

## Key Principles

1. **Threat Assessment**: Continuous evaluation of potential risks
2. **Advance Work**: Thorough planning and reconnaissance 
3. **Protective Intelligence**: Gathering and analyzing threat information
4. **Emergency Procedures**: Clear protocols for various scenarios

## Technology Integration

Modern executive protection leverages:
- Real-time communication systems
- GPS tracking and monitoring
- Advanced surveillance detection
- Secure transportation protocols

Our Licensed Level IV PPOs are trained in these comprehensive methodologies to ensure maximum protection for high-profile clients.`,
            author: 'PPO Team',
            created: '2024-01-15T10:00:00Z',
            modified: '2024-01-15T10:00:00Z',
            wordCount: 1250
        },
        {
            id: '2',
            title: 'Houston Security Landscape Analysis',
            slug: 'houston-security-landscape-analysis',
            status: 'draft',
            category: 'industry-news',
            excerpt: 'Comprehensive analysis of security trends and challenges in Houston\'s business environment.',
            body: `# Houston Security Landscape Analysis

Houston's dynamic business environment presents unique security challenges that require specialized expertise and local knowledge.

## Current Trends

The Houston metropolitan area has seen significant changes in security requirements, driven by:
- Economic growth and expansion
- Increased executive mobility
- Evolving threat vectors
- Technology integration

## Our Response

Eula Elite Security & Transport has adapted our services to meet these challenges through enhanced training and strategic partnerships.`,
            author: 'Security Analyst',
            created: '2024-01-14T15:30:00Z',
            modified: '2024-01-14T15:30:00Z',
            wordCount: 890
        }
    ],
    pages: [],
    services: [],
    testimonials: [],
    media: []
};

// Get all content by type
app.get('/api/content/:type', (req, res) => {
    const { type } = req.params;
    const content = contentStorage[type] || [];
    
    res.json({
        success: true,
        type,
        content,
        count: content.length
    });
});

// Get single content item
app.get('/api/content/:type/:id', (req, res) => {
    const { type, id } = req.params;
    const content = contentStorage[type]?.find(item => item.id === id);
    
    if (!content) {
        return res.status(404).json({
            success: false,
            message: 'Content not found'
        });
    }
    
    res.json({
        success: true,
        content
    });
});

// Create new content
app.post('/api/content/:type', (req, res) => {
    const { type } = req.params;
    const contentData = req.body;
    
    // Validate required fields
    if (!contentData.title || !contentData.body) {
        return res.status(400).json({
            success: false,
            message: 'Title and body are required'
        });
    }
    
    // Generate ID and timestamps
    const newContent = {
        ...contentData,
        id: Date.now().toString(),
        created: new Date().toISOString(),
        modified: new Date().toISOString(),
        author: 'Admin',
        wordCount: contentData.body ? contentData.body.trim().split(/\s+/).length : 0
    };
    
    // Initialize content type array if it doesn't exist
    if (!contentStorage[type]) {
        contentStorage[type] = [];
    }
    
    contentStorage[type].unshift(newContent);
    
    console.log(`📝 New ${type} content created:`, newContent.title);
    
    res.json({
        success: true,
        message: 'Content created successfully',
        content: newContent
    });
});

// Update existing content
app.put('/api/content/:type/:id', (req, res) => {
    const { type, id } = req.params;
    const updates = req.body;
    
    const contentArray = contentStorage[type];
    if (!contentArray) {
        return res.status(404).json({
            success: false,
            message: 'Content type not found'
        });
    }
    
    const index = contentArray.findIndex(item => item.id === id);
    if (index === -1) {
        return res.status(404).json({
            success: false,
            message: 'Content not found'
        });
    }
    
    // Update content with new data
    const updatedContent = {
        ...contentArray[index],
        ...updates,
        modified: new Date().toISOString(),
        wordCount: updates.body ? updates.body.trim().split(/\s+/).length : contentArray[index].wordCount
    };
    
    contentStorage[type][index] = updatedContent;
    
    console.log(`📝 ${type} content updated:`, updatedContent.title);
    
    res.json({
        success: true,
        message: 'Content updated successfully',
        content: updatedContent
    });
});

// Delete content
app.delete('/api/content/:type/:id', (req, res) => {
    const { type, id } = req.params;
    
    const contentArray = contentStorage[type];
    if (!contentArray) {
        return res.status(404).json({
            success: false,
            message: 'Content type not found'
        });
    }
    
    const index = contentArray.findIndex(item => item.id === id);
    if (index === -1) {
        return res.status(404).json({
            success: false,
            message: 'Content not found'
        });
    }
    
    const deletedContent = contentArray.splice(index, 1)[0];
    
    console.log(`🗑️ ${type} content deleted:`, deletedContent.title);
    
    res.json({
        success: true,
        message: 'Content deleted successfully',
        deletedContent
    });
});

// Publish/unpublish content
app.post('/api/content/:type/:id/publish', (req, res) => {
    const { type, id } = req.params;
    const { status = 'published' } = req.body;
    
    const contentArray = contentStorage[type];
    if (!contentArray) {
        return res.status(404).json({
            success: false,
            message: 'Content type not found'
        });
    }
    
    const content = contentArray.find(item => item.id === id);
    if (!content) {
        return res.status(404).json({
            success: false,
            message: 'Content not found'
        });
    }
    
    content.status = status;
    content.modified = new Date().toISOString();
    
    if (status === 'published') {
        content.publishedDate = new Date().toISOString();
    }
    
    console.log(`📢 ${type} content ${status}:`, content.title);
    
    res.json({
        success: true,
        message: `Content ${status} successfully`,
        content
    });
});

// Search content
app.get('/api/content/search/:type', (req, res) => {
    const { type } = req.params;
    const { q, status, category } = req.query;
    
    let content = contentStorage[type] || [];
    
    // Filter by search query
    if (q) {
        const searchTerm = q.toLowerCase();
        content = content.filter(item => 
            item.title.toLowerCase().includes(searchTerm) ||
            item.excerpt.toLowerCase().includes(searchTerm) ||
            item.body.toLowerCase().includes(searchTerm)
        );
    }
    
    // Filter by status
    if (status) {
        content = content.filter(item => item.status === status);
    }
    
    // Filter by category
    if (category) {
        content = content.filter(item => item.category === category);
    }
    
    res.json({
        success: true,
        type,
        content,
        count: content.length,
        filters: { q, status, category }
    });
});

// Get content analytics
app.get('/api/content/analytics/:type', (req, res) => {
    const { type } = req.params;
    const content = contentStorage[type] || [];
    
    const analytics = {
        totalContent: content.length,
        published: content.filter(item => item.status === 'published').length,
        draft: content.filter(item => item.status === 'draft').length,
        scheduled: content.filter(item => item.status === 'scheduled').length,
        totalWords: content.reduce((total, item) => total + (item.wordCount || 0), 0),
        averageWordCount: content.length > 0 ? Math.round(content.reduce((total, item) => total + (item.wordCount || 0), 0) / content.length) : 0,
        recentActivity: content
            .sort((a, b) => new Date(b.modified) - new Date(a.modified))
            .slice(0, 5)
            .map(item => ({
                id: item.id,
                title: item.title,
                action: 'modified',
                timestamp: item.modified
            }))
    };
    
    res.json({
        success: true,
        type,
        analytics
    });
});

// Start consolidated server with Socket.IO
server.listen(PORT, () => {
    console.log(`
🛡️  Eula Elite Security & Transport - CONSOLIDATED SERVER
📍 Running on: http://localhost:${PORT}
🏢 Service: Fortune 500-caliber executive protection
🔒 Status: Licensed Level IV PPO services active
⚡ Emergency Line: (713) 555-1234

🌐 MAIN WEBSITE PAGES:
• http://localhost:${PORT}/ (Homepage)
• http://localhost:${PORT}/about.html (About Us) 
• http://localhost:${PORT}/services.html (Protection Services)
• http://localhost:${PORT}/contact.html (Secure Contact)
• http://localhost:${PORT}/blog.html (Security Insights)

🔐 ADMIN DASHBOARD:
• http://localhost:${PORT}/admin (Command Dashboard)
• http://localhost:${PORT}/admin/clients.html (Client Management)
• http://localhost:${PORT}/admin/bookings.html (Booking System)
• http://localhost:${PORT}/admin/ppo.html (PPO Management)
• http://localhost:${PORT}/admin/content.html (Content Management)

📁 ASSETS & MEDIA:
• http://localhost:${PORT}/assets/* (Brand Assets)
• http://localhost:${PORT}/api/assets (Asset Gallery API)

🔌 API ENDPOINTS:
• POST /api/contact (Contact forms)
• POST /api/consultation (Consultation requests) 
• POST /api/quote (Service quotes)
• POST /api/emergency (Emergency response)
• GET /api/admin/stats (Dashboard statistics)
• GET /api/admin/recent-activity (Recent activity feed)
• GET /health (Health check)

✅ ALL SERVICES CONSOLIDATED - SINGLE SERVER SOLUTION
    `);
});

// New API endpoints for optimization features

// Marketing automation endpoints
app.get('/api/marketing/stats', (req, res) => {
    res.json(marketingEngine.getMarketingStats());
});

app.get('/api/marketing/leads', (req, res) => {
    res.json({
        success: true,
        leads: marketingEngine.getAllLeads().slice(0, 50) // Limit for performance
    });
});

app.get('/api/marketing/campaigns', (req, res) => {
    res.json({
        success: true,
        campaigns: marketingEngine.getCampaigns()
    });
});

// A/B testing endpoints
app.get('/api/optimization/tests', (req, res) => {
    res.json({
        success: true,
        tests: conversionEngine.getABTestResults()
    });
});

app.get('/api/optimization/metrics', (req, res) => {
    res.json({
        success: true,
        metrics: conversionEngine.getConversionMetrics()
    });
});

app.get('/api/optimization/funnel', (req, res) => {
    res.json({
        success: true,
        funnel: conversionEngine.getFunnelAnalysis()
    });
});

// Infrastructure monitoring endpoints
app.get('/api/infrastructure/stats', (req, res) => {
    res.json({
        success: true,
        infrastructure: scalingEngine.getInfrastructureStats()
    });
});

app.get('/api/infrastructure/performance', (req, res) => {
    const metrics = {
        response_times: scalingEngine.getMetrics('response_time'),
        memory_usage: scalingEngine.getMetrics('memory_used'),
        cpu_usage: scalingEngine.getMetrics('cpu_user')
    };
    
    res.json({
        success: true,
        metrics: metrics
    });
});

// A/B testing assignment endpoint for frontend
app.post('/api/optimization/assign-test', (req, res) => {
    const { testKey } = req.body;
    const userId = req.ip || req.connection.remoteAddress;
    const device = req.headers['user-agent']?.includes('Mobile') ? 'mobile' : 'desktop';
    
    const assignment = conversionEngine.assignUserToTest(userId, testKey, req.headers['user-agent'], device);
    
    res.json({
        success: true,
        assignment: assignment
    });
});

// Trust signals and optimization content endpoint
app.get('/api/optimization/content', (req, res) => {
    const userId = req.ip || req.connection.remoteAddress;
    const page = req.query.page || 'home';
    const device = req.headers['user-agent']?.includes('Mobile') ? 'mobile' : 'desktop';
    
    const optimizedContent = conversionEngine.getOptimizedContent(userId, page, device);
    const trustSignals = conversionEngine.getTrustSignals({
        service_interest: req.query.service_interest,
        high_value: req.query.high_value === 'true'
    });
    
    let mobileOptimizations = {};
    if (device === 'mobile') {
        mobileOptimizations = conversionEngine.getMobileOptimizations(page);
    }
    
    res.json({
        success: true,
        optimizations: optimizedContent,
        trustSignals: trustSignals,
        mobileOptimizations: mobileOptimizations,
        device: device
    });
});

module.exports = { app, server, io };