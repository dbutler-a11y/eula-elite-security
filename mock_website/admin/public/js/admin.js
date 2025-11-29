// Eula Elite Security & Transport - Admin Dashboard JavaScript

// Admin Dashboard Controller
class AdminDashboard {
    constructor() {
        this.init();
        this.setupEventListeners();
        this.loadMockData();
    }
    
    init() {
        console.log('Initializing Eula Elite Admin Dashboard...');
        this.setupSidebar();
        this.setupSearch();
        this.setupFilters();
        this.initializeCharts();
    }
    
    setupSidebar() {
        const sidebarToggle = document.querySelector('.sidebar-toggle');
        const sidebar = document.querySelector('.admin-sidebar');
        
        if (sidebarToggle && sidebar) {
            sidebarToggle.addEventListener('click', () => {
                sidebar.classList.toggle('collapsed');
                
                // On mobile, toggle mobile-open class
                if (window.innerWidth <= 768) {
                    sidebar.classList.toggle('mobile-open');
                }
            });
        }
        
        // Close sidebar on mobile when clicking outside
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                const sidebar = document.querySelector('.admin-sidebar');
                const sidebarToggle = document.querySelector('.sidebar-toggle');
                
                if (sidebar && !sidebar.contains(e.target) && !sidebarToggle.contains(e.target)) {
                    sidebar.classList.remove('mobile-open');
                }
            }
        });
    }
    
    setupSearch() {
        const searchInputs = document.querySelectorAll('.search-input');
        searchInputs.forEach(input => {
            input.addEventListener('input', debounce((e) => {
                this.performSearch(e.target.value, e.target.dataset.target);
            }, 300));
        });
    }
    
    setupFilters() {
        const filterSelects = document.querySelectorAll('.filter-select');
        filterSelects.forEach(select => {
            select.addEventListener('change', (e) => {
                this.applyFilter(e.target.value, e.target.dataset.filter);
            });
        });
    }
    
    setupEventListeners() {
        // Form submissions
        document.addEventListener('submit', (e) => {
            if (e.target.classList.contains('admin-form')) {
                this.handleFormSubmission(e);
            }
        });
        
        // Modal triggers
        document.addEventListener('click', (e) => {
            if (e.target.hasAttribute('data-modal')) {
                this.openModal(e.target.dataset.modal);
            }
            
            if (e.target.classList.contains('modal-close')) {
                this.closeModal(e.target.closest('.modal'));
            }
        });
        
        // Action buttons
        document.addEventListener('click', (e) => {
            if (e.target.hasAttribute('data-action')) {
                this.handleAction(e.target.dataset.action, e.target);
            }
        });
    }
    
    loadMockData() {
        // Load dashboard statistics
        this.updateDashboardStats();
        
        // Load recent activity
        this.loadRecentActivity();
        
        // Update charts with mock data
        this.updateCharts();
    }
    
    updateDashboardStats() {
        const stats = {
            totalClients: 127,
            activeBookings: 18,
            monthlyRevenue: 485000,
            responseTime: 12.5,
            clientSatisfaction: 98.7,
            activePPOs: 34
        };
        
        // Update stat cards
        document.querySelectorAll('.stat-card').forEach(card => {
            const statType = card.dataset.stat;
            if (stats[statType] !== undefined) {
                const valueElement = card.querySelector('.stat-value');
                if (valueElement) {
                    if (statType === 'monthlyRevenue') {
                        valueElement.textContent = `$${(stats[statType] / 1000).toFixed(0)}K`;
                    } else if (statType === 'responseTime') {
                        valueElement.textContent = `${stats[statType]} min`;
                    } else if (statType === 'clientSatisfaction') {
                        valueElement.textContent = `${stats[statType]}%`;
                    } else {
                        valueElement.textContent = stats[statType];
                    }
                }
            }
        });
    }
    
    loadRecentActivity() {
        const activities = [
            {
                type: 'booking',
                message: 'New Elite Daily Protection booking - Downtown Houston',
                time: '5 minutes ago',
                priority: 'high'
            },
            {
                type: 'client',
                message: 'VIP client consultation scheduled for tomorrow',
                time: '15 minutes ago',
                priority: 'medium'
            },
            {
                type: 'ppo',
                message: 'Level IV PPO certification renewal completed',
                time: '1 hour ago',
                priority: 'low'
            },
            {
                type: 'emergency',
                message: 'Emergency response completed - Memorial area',
                time: '2 hours ago',
                priority: 'high'
            },
            {
                type: 'payment',
                message: 'Monthly membership payment received - $25,000',
                time: '3 hours ago',
                priority: 'medium'
            }
        ];
        
        const activityContainer = document.getElementById('recent-activity');
        if (activityContainer) {
            activityContainer.innerHTML = activities.map(activity => `
                <div class="activity-item">
                    <div class="activity-content">
                        <div class="activity-message">${activity.message}</div>
                        <div class="activity-time text-muted">${activity.time}</div>
                    </div>
                    <span class="priority-${activity.priority}">${activity.priority.toUpperCase()}</span>
                </div>
            `).join('');
        }
    }
    
    initializeCharts() {
        // Mock chart initialization
        const chartContainers = document.querySelectorAll('.chart-container');
        chartContainers.forEach(container => {
            const chartType = container.dataset.chart;
            this.renderChart(chartType, container);
        });
    }
    
    renderChart(type, container) {
        // Placeholder for chart rendering
        const placeholder = container.querySelector('.chart-placeholder');
        if (placeholder) {
            placeholder.innerHTML = `
                <div style="text-align: center;">
                    <div style="font-size: 2rem; color: var(--champagne-gold); margin-bottom: 1rem;">📊</div>
                    <div>Chart: ${type.charAt(0).toUpperCase() + type.slice(1)}</div>
                    <div style="font-size: 0.875rem; color: var(--admin-text-light); margin-top: 0.5rem;">
                        Mock data visualization would appear here
                    </div>
                </div>
            `;
        }
    }
    
    updateCharts() {
        // Mock chart updates with sample data
        console.log('Charts updated with latest data');
    }
    
    performSearch(query, target) {
        console.log(`Searching for: ${query} in ${target}`);
        
        // Mock search implementation
        const tableRows = document.querySelectorAll(`${target} tbody tr`);
        tableRows.forEach(row => {
            const text = row.textContent.toLowerCase();
            const visible = text.includes(query.toLowerCase());
            row.style.display = visible ? '' : 'none';
        });
    }
    
    applyFilter(value, filterType) {
        console.log(`Applying filter: ${filterType} = ${value}`);
        
        // Mock filter implementation
        const items = document.querySelectorAll(`[data-${filterType}]`);
        items.forEach(item => {
            if (value === 'all' || item.dataset[filterType] === value) {
                item.style.display = '';
            } else {
                item.style.display = 'none';
            }
        });
    }
    
    handleFormSubmission(e) {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        
        console.log('Form submitted:', Object.fromEntries(formData));
        
        // Show loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.innerHTML = '<span class="spinner"></span> Processing...';
        submitBtn.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            this.showNotification('Success! Changes have been saved.', 'success');
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 2000);
    }
    
    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }
    }
    
    closeModal(modal) {
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }
    }
    
    handleAction(action, element) {
        console.log(`Handling action: ${action}`);
        
        switch (action) {
            case 'edit-client':
                this.editClient(element.dataset.clientId);
                break;
            case 'delete-client':
                this.deleteClient(element.dataset.clientId);
                break;
            case 'approve-booking':
                this.approveBooking(element.dataset.bookingId);
                break;
            case 'assign-ppo':
                this.assignPPO(element.dataset.bookingId);
                break;
            case 'emergency-response':
                this.triggerEmergencyResponse();
                break;
            default:
                console.log(`Unknown action: ${action}`);
        }
    }
    
    editClient(clientId) {
        console.log(`Editing client: ${clientId}`);
        this.openModal('edit-client-modal');
        // Populate form with client data
    }
    
    deleteClient(clientId) {
        if (confirm('Are you sure you want to delete this client? This action cannot be undone.')) {
            console.log(`Deleting client: ${clientId}`);
            this.showNotification('Client deleted successfully.', 'success');
        }
    }
    
    approveBooking(bookingId) {
        console.log(`Approving booking: ${bookingId}`);
        this.showNotification('Booking approved and PPO assigned.', 'success');
        // Update booking status in UI
    }
    
    assignPPO(bookingId) {
        console.log(`Assigning PPO to booking: ${bookingId}`);
        this.openModal('assign-ppo-modal');
    }
    
    triggerEmergencyResponse() {
        if (confirm('Trigger emergency response protocols?')) {
            console.log('Emergency response protocols activated');
            this.showNotification('Emergency response protocols activated. All available PPOs notified.', 'warning');
        }
    }
    
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }
    
    // Real-time updates simulation
    startRealTimeUpdates() {
        setInterval(() => {
            this.updateDashboardStats();
            this.loadRecentActivity();
        }, 30000); // Update every 30 seconds
    }
    
    // Export functionality
    exportData(type) {
        console.log(`Exporting ${type} data...`);
        this.showNotification(`${type} data exported successfully.`, 'success');
    }
    
    // Backup functionality
    createBackup() {
        console.log('Creating system backup...');
        this.showNotification('System backup initiated. You will receive confirmation upon completion.', 'info');
    }
}

// Client Management Module
class ClientManager {
    constructor() {
        this.clients = this.loadMockClients();
    }
    
    loadMockClients() {
        return [
            {
                id: 1,
                name: 'Marcus Rodriguez',
                type: 'Professional Athlete',
                status: 'Active',
                package: 'Monthly Elite Membership',
                joinDate: '2024-01-15',
                lastContact: '2024-12-01',
                riskLevel: 'High',
                ppoAssigned: 'James Mitchell'
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
                ppoAssigned: 'David Thompson'
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
                ppoAssigned: 'Pending Assignment'
            }
        ];
    }
    
    renderClientTable() {
        const tableBody = document.querySelector('#clients-table tbody');
        if (!tableBody) return;
        
        tableBody.innerHTML = this.clients.map(client => `
            <tr data-status="${client.status.toLowerCase()}">
                <td>
                    <div class="client-info">
                        <strong>${client.name}</strong><br>
                        <small class="text-muted">${client.type}</small>
                    </div>
                </td>
                <td><span class="status-badge status-${client.status.toLowerCase()}">${client.status}</span></td>
                <td>${client.package}</td>
                <td>${client.joinDate}</td>
                <td>${client.lastContact}</td>
                <td><span class="priority-${client.riskLevel.toLowerCase()}">${client.riskLevel}</span></td>
                <td>${client.ppoAssigned}</td>
                <td>
                    <div class="d-flex gap-2">
                        <button class="btn btn-sm btn-secondary" data-action="edit-client" data-client-id="${client.id}">Edit</button>
                        <button class="btn btn-sm btn-danger" data-action="delete-client" data-client-id="${client.id}">Delete</button>
                    </div>
                </td>
            </tr>
        `).join('');
    }
}

// Booking Management Module
class BookingManager {
    constructor() {
        this.bookings = this.loadMockBookings();
    }
    
    loadMockBookings() {
        return [
            {
                id: 1,
                client: 'Marcus Rodriguez',
                service: 'Monthly Elite Membership',
                date: '2024-12-05',
                duration: '30 days',
                status: 'Active',
                ppo: 'James Mitchell',
                amount: '$25,000',
                priority: 'High'
            },
            {
                id: 2,
                client: 'Corporate Event - Energy Corp',
                service: 'Elite Daily Protection',
                date: '2024-12-08',
                duration: '8 hours',
                status: 'Pending',
                ppo: 'Pending Assignment',
                amount: '$3,500',
                priority: 'Medium'
            },
            {
                id: 3,
                client: 'Sarah Chen',
                service: 'Weekly Executive Retainer',
                date: '2024-12-10',
                duration: '7 days',
                status: 'Confirmed',
                ppo: 'David Thompson',
                amount: '$12,000',
                priority: 'High'
            }
        ];
    }
    
    renderBookingTable() {
        const tableBody = document.querySelector('#bookings-table tbody');
        if (!tableBody) return;
        
        tableBody.innerHTML = this.bookings.map(booking => `
            <tr data-status="${booking.status.toLowerCase()}">
                <td>
                    <strong>B${booking.id.toString().padStart(4, '0')}</strong><br>
                    <small class="text-muted">${booking.client}</small>
                </td>
                <td>${booking.service}</td>
                <td>${booking.date}</td>
                <td>${booking.duration}</td>
                <td><span class="status-badge status-${booking.status.toLowerCase().replace(' ', '-')}">${booking.status}</span></td>
                <td>${booking.ppo}</td>
                <td><strong>${booking.amount}</strong></td>
                <td><span class="priority-${booking.priority.toLowerCase()}">${booking.priority}</span></td>
                <td>
                    <div class="d-flex gap-2">
                        <button class="btn btn-sm btn-success" data-action="approve-booking" data-booking-id="${booking.id}">Approve</button>
                        <button class="btn btn-sm btn-secondary" data-action="assign-ppo" data-booking-id="${booking.id}">Assign PPO</button>
                    </div>
                </td>
            </tr>
        `).join('');
    }
}

// PPO Management Module
class PPOManager {
    constructor() {
        this.ppos = this.loadMockPPOs();
    }
    
    loadMockPPOs() {
        return [
            {
                id: 1,
                name: 'James Mitchell',
                license: 'TX-PPO-L4-001234',
                status: 'Active',
                currentAssignment: 'Marcus Rodriguez',
                certifications: ['Level IV PPO', 'Advanced Tactical', 'VIP Protection'],
                experience: '12 years',
                rating: 4.9,
                availability: 'Assigned'
            },
            {
                id: 2,
                name: 'David Thompson',
                license: 'TX-PPO-L4-002345',
                status: 'Active',
                currentAssignment: 'Available',
                certifications: ['Level IV PPO', 'Executive Protection', 'Crisis Management'],
                experience: '8 years',
                rating: 4.8,
                availability: 'Available'
            },
            {
                id: 3,
                name: 'Maria Santos',
                license: 'TX-PPO-L4-003456',
                status: 'Active',
                currentAssignment: 'Corporate Event Standby',
                certifications: ['Level IV PPO', 'Digital Security', 'Emergency Response'],
                experience: '6 years',
                rating: 4.9,
                availability: 'On Call'
            }
        ];
    }
    
    renderPPOTable() {
        const tableBody = document.querySelector('#ppo-table tbody');
        if (!tableBody) return;
        
        tableBody.innerHTML = this.ppos.map(ppo => `
            <tr data-status="${ppo.status.toLowerCase()}">
                <td>
                    <div class="ppo-info">
                        <strong>${ppo.name}</strong><br>
                        <small class="text-muted">${ppo.license}</small>
                    </div>
                </td>
                <td><span class="status-badge status-${ppo.status.toLowerCase()}">${ppo.status}</span></td>
                <td>${ppo.currentAssignment}</td>
                <td>
                    ${ppo.certifications.map(cert => `<span class="badge">${cert}</span>`).join(' ')}
                </td>
                <td>${ppo.experience}</td>
                <td>
                    <div class="rating">
                        ${'★'.repeat(Math.floor(ppo.rating))}${'☆'.repeat(5 - Math.floor(ppo.rating))}
                        <span class="text-muted">${ppo.rating}</span>
                    </div>
                </td>
                <td><span class="status-badge status-${ppo.availability.toLowerCase().replace(' ', '-')}">${ppo.availability}</span></td>
                <td>
                    <div class="d-flex gap-2">
                        <button class="btn btn-sm btn-secondary">Edit</button>
                        <button class="btn btn-sm btn-primary">Assign</button>
                    </div>
                </td>
            </tr>
        `).join('');
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

function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

function formatDate(date) {
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    }).format(new Date(date));
}

// Initialize Admin Dashboard
document.addEventListener('DOMContentLoaded', function() {
    // Initialize main dashboard
    const dashboard = new AdminDashboard();
    
    // Initialize managers
    const clientManager = new ClientManager();
    const bookingManager = new BookingManager();
    const ppoManager = new PPOManager();
    
    // Render tables if containers exist
    if (document.querySelector('#clients-table')) {
        clientManager.renderClientTable();
    }
    
    if (document.querySelector('#bookings-table')) {
        bookingManager.renderBookingTable();
    }
    
    if (document.querySelector('#ppo-table')) {
        ppoManager.renderPPOTable();
    }
    
    // Start real-time updates
    dashboard.startRealTimeUpdates();
    
    console.log('Eula Elite Admin Dashboard initialized successfully');
});

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        AdminDashboard,
        ClientManager,
        BookingManager,
        PPOManager
    };
}