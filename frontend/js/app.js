class HRSystem {
    constructor() {
        this.currentModule = 'dashboard';
        this.modules = {};
        this.init();
    }

    init() {
        this.initUI();
        this.initModules();
        this.loadDashboard();
        this.setupEventListeners();
    }

    initUI() {
        // Initialize theme
        this.initTheme();
        
        // Initialize sidebar
        this.initSidebar();
        
        // Initialize notifications
        this.initNotifications();
        
        // Update sidebar stats
        this.updateSidebarStats();
    }

    initTheme() {
        const theme = localStorage.getItem('hr-theme') || 'light';
        document.documentElement.setAttribute('data-theme', theme);
    }

    initSidebar() {
        const sidebarToggle = document.getElementById('sidebarToggle');
        const sidebar = document.getElementById('sidebar');
        
        sidebarToggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
            document.querySelector('.main-content').classList.toggle('sidebar-collapsed');
        });

        // Handle module navigation
        document.querySelectorAll('.module-link, .nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const module = link.getAttribute('data-module') || 
                              link.getAttribute('href').replace('#', '');
                
                this.switchModule(module);
                
                // Update active states
                document.querySelectorAll('.module-link.active, .nav-link.active')
                    .forEach(el => el.classList.remove('active'));
                link.classList.add('active');
                
                // Close sidebar on mobile
                if (window.innerWidth < 1200) {
                    sidebar.classList.remove('active');
                }
            });
        });
    }

    initNotifications() {
        // Load notifications from API
        this.loadNotifications();
        
        // Setup notification bell
        const notificationBtn = document.getElementById('notificationsBtn');
        const notificationPanel = document.querySelector('.notifications-panel');
        
        notificationBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            notificationPanel.classList.toggle('active');
        });

        // Close notifications when clicking outside
        document.addEventListener('click', (e) => {
            if (!notificationPanel.contains(e.target) && !notificationBtn.contains(e.target)) {
                notificationPanel.classList.remove('active');
            }
        });
    }

    async loadNotifications() {
        try {
            const response = await fetch('/api/notifications');
            const notifications = await response.json();
            
            this.renderNotifications(notifications);
        } catch (error) {
            console.error('Error loading notifications:', error);
        }
    }

    renderNotifications(notifications) {
        const container = document.querySelector('.notifications-list');
        if (!container) return;

        if (notifications.length === 0) {
            container.innerHTML = `
                <div class="empty-notifications">
                    <i class="fas fa-bell-slash"></i>
                    <p>No hay notificaciones nuevas</p>
                </div>
            `;
            return;
        }

        container.innerHTML = notifications.map(notif => `
            <div class="notification-item ${notif.unread ? 'unread' : ''}">
                <div class="notification-icon">
                    <i class="fas fa-${notif.icon}"></i>
                </div>
                <div class="notification-content">
                    <p class="notification-text">${notif.message}</p>
                    <span class="notification-time">${this.formatTimeAgo(notif.timestamp)}</span>
                </div>
            </div>
        `).join('');
    }

    initModules() {
        // Register all modules
        this.modules = {
            dashboard: DashboardModule,
            employees: EmployeesModule,
            attendance: AttendanceModule,
            performance: PerformanceModule,
            leave: LeaveModule,
            documents: DocumentsModule,
            cases: CasesModule,
            reports: ReportsModule,
            training: TrainingModule,
            onboarding: OnboardingModule,
            payroll: PayrollModule,
            calendar: CalendarModule,
            // Add more modules as needed
        };
    }

    switchModule(moduleName) {
        this.currentModule = moduleName;
        
        // Update module header
        this.updateModuleHeader(moduleName);
        
        // Load module content
        this.loadModuleContent(moduleName);
        
        // Update URL
        history.pushState({ module: moduleName }, '', `#${moduleName}`);
    }

    updateModuleHeader(moduleName) {
        const titles = {
            dashboard: 'Dashboard',
            employees: 'Gestión de Empleados',
            attendance: 'Control de Asistencia',
            performance: 'Evaluación de Desempeño',
            leave: 'Gestión de Permisos y Vacaciones',
            documents: 'Gestión Documental',
            cases: 'Casos de Recursos Humanos',
            reports: 'Reportes y Analytics',
            training: 'Capacitación y Desarrollo',
            onboarding: 'Proceso de Incorporación',
            payroll: 'Gestión de Nómina',
            calendar: 'Calendario HR'
        };

        const descriptions = {
            dashboard: 'Resumen general del departamento de recursos humanos',
            employees: 'Administra la información de todos los empleados',
            attendance: 'Control y seguimiento de asistencia y tiempos',
            performance: 'Seguimiento de evaluaciones y objetivos',
            leave: 'Gestión de solicitudes de permisos y vacaciones',
            documents: 'Almacén central de documentos HR',
            cases: 'Seguimiento de casos y solicitudes HR',
            reports: 'Reportes avanzados y análisis de datos',
            training: 'Programas de capacitación y desarrollo',
            onboarding: 'Proceso estructurado de incorporación',
            payroll: 'Gestión integral de nómina',
            calendar: 'Calendario de eventos y recordatorios HR'
        };

        const actions = {
            employees: `
                <button class="btn btn-primary" id="addEmployee">
                    <i class="fas fa-user-plus"></i> Nuevo Empleado
                </button>
                <button class="btn btn-secondary" id="exportEmployees">
                    <i class="fas fa-file-export"></i> Exportar
                </button>
                <button class="btn btn-secondary" id="bulkActions">
                    <i class="fas fa-tasks"></i> Acciones Masivas
                </button>
            `,
            attendance: `
                <button class="btn btn-primary" id="manualCheckIn">
                    <i class="fas fa-fingerprint"></i> Registro Manual
                </button>
                <button class="btn btn-secondary" id="generateTimesheet">
                    <i class="fas fa-calendar-alt"></i> Generar Hoja de Tiempo
                </button>
            `,
            reports: `
                <button class="btn btn-primary" id="createReport">
                    <i class="fas fa-plus"></i> Nuevo Reporte
                </button>
                <div class="dropdown">
                    <button class="btn btn-secondary dropdown-toggle" id="reportTypes">
                        <i class="fas fa-download"></i> Exportar
                    </button>
                    <div class="dropdown-menu">
                        <a href="#" class="dropdown-item">PDF</a>
                        <a href="#" class="dropdown-item">Excel</a>
                        <a href="#" class="dropdown-item">CSV</a>
                    </div>
                </div>
            `
        };

        document.getElementById('moduleTitle').textContent = titles[moduleName] || moduleName;
        document.getElementById('moduleDescription').textContent = descriptions[moduleName] || '';
        document.getElementById('moduleActions').innerHTML = actions[moduleName] || '';
    }

    async loadModuleContent(moduleName) {
        const container = document.getElementById('moduleContent');
        
        // Show loading state
        container.innerHTML = `
            <div class="module-loading">
                <div class="loading-spinner"></div>
                <p>Cargando ${moduleName}...</p>
            </div>
        `;

        try {
            // Load module data
            const moduleClass = this.modules[moduleName];
            if (moduleClass) {
                const moduleInstance = new moduleClass();
                const content = await moduleInstance.load();
                container.innerHTML = content;
                moduleInstance.initEvents();
            } else {
                // Fallback to basic module
                const response = await fetch(`/api/${moduleName}`);
                const data = await response.json();
                container.innerHTML = this.renderBasicModule(moduleName, data);
            }
        } catch (error) {
            console.error(`Error loading module ${moduleName}:`, error);
            container.innerHTML = `
                <div class="error-state">
                    <i class="fas fa-exclamation-triangle"></i>
                    <h3>Error al cargar el módulo</h3>
                    <p>${error.message}</p>
                    <button class="btn btn-primary" onclick="hrSystem.switchModule('${moduleName}')">
                        Reintentar
                    </button>
                </div>
            `;
        }
    }

    async loadDashboard() {
        try {
            const [stats, activity, chartData] = await Promise.all([
                fetch('/api/dashboard/stats').then(r => r.json()),
                fetch('/api/dashboard/activity').then(r => r.json()),
                fetch('/api/dashboard/charts').then(r => r.json())
            ]);

            // Update sidebar stats
            this.updateSidebarStats(stats);

            // Load dashboard module
            if (this.currentModule === 'dashboard') {
                const dashboard = new DashboardModule();
                const content = await dashboard.load(stats, activity, chartData);
                document.getElementById('moduleContent').innerHTML = content;
                dashboard.initEvents();
                dashboard.renderCharts(chartData);
            }
        } catch (error) {
            console.error('Error loading dashboard:', error);
        }
    }

    updateSidebarStats(stats) {
        if (stats) {
            document.getElementById('totalEmployees').textContent = stats.total_employees || 0;
            document.getElementById('presentToday').textContent = stats.present_today || 0;
        }
    }

    setupEventListeners() {
        // Quick add modal
        const quickAddBtn = document.getElementById('quickAdd');
        const quickAddModal = document.getElementById('quickAddModal');
        const quickAddClose = quickAddModal.querySelector('.modal-close');

        quickAddBtn.addEventListener('click', () => {
            quickAddModal.classList.add('active');
        });

        quickAddClose.addEventListener('click', () => {
            quickAddModal.classList.remove('active');
        });

        // Global search
        const searchBtn = document.getElementById('globalSearchBtn');
        const searchModal = document.getElementById('globalSearchModal');
        const searchClose = searchModal.querySelector('.search-close');

        searchBtn.addEventListener('click', () => {
            searchModal.classList.add('active');
            searchModal.querySelector('input').focus();
        });

        searchClose.addEventListener('click', () => {
            searchModal.classList.remove('active');
        });

        // Quick action buttons
        document.querySelectorAll('.quick-action-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.currentTarget.getAttribute('data-action');
                this.handleQuickAction(action);
                quickAddModal.classList.remove('active');
            });
        });

        // Handle browser back/forward
        window.addEventListener('popstate', (e) => {
            if (e.state && e.state.module) {
                this.switchModule(e.state.module);
            }
        });
    }

    handleQuickAction(action) {
        switch(action) {
            case 'new-employee':
                this.switchModule('employees');
                setTimeout(() => {
                    document.getElementById('addEmployee')?.click();
                }, 500);
                break;
            case 'new-leave':
                this.switchModule('leave');
                break;
            case 'new-case':
                this.switchModule('cases');
                break;
            case 'send-announcement':
                this.showAnnouncementModal();
                break;
            case 'generate-report':
                this.switchModule('reports');
                break;
            case 'schedule-meeting':
                this.scheduleMeeting();
                break;
        }
    }

    showAnnouncementModal() {
        // Implementation for announcement modal
        console.log('Show announcement modal');
    }

    scheduleMeeting() {
        // Implementation for meeting scheduling
        console.log('Schedule meeting');
    }

    formatTimeAgo(timestamp) {
        const now = new Date();
        const past = new Date(timestamp);
        const diff = Math.floor((now - past) / 1000);

        if (diff < 60) return 'Hace unos segundos';
        if (diff < 3600) return `Hace ${Math.floor(diff / 60)} minutos`;
        if (diff < 86400) return `Hace ${Math.floor(diff / 3600)} horas`;
        if (diff < 2592000) return `Hace ${Math.floor(diff / 86400)} días`;
        return past.toLocaleDateString();
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification-toast notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : 
                                  type === 'error' ? 'exclamation-circle' : 
                                  type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close">&times;</button>
        `;

        document.body.appendChild(notification);

        // Auto remove after 5 seconds
        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => notification.remove(), 300);
        }, 5000);

        // Close button
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.remove();
        });
    }

    // Utility method to format numbers
    formatNumber(num) {
        return new Intl.NumberFormat('es-ES').format(num);
    }

    // Utility method to format currency
    formatCurrency(amount, currency = 'USD') {
        return new Intl.NumberFormat('es-ES', {
            style: 'currency',
            currency: currency
        }).format(amount);
    }

    // Utility method to format date
    formatDate(date, format = 'medium') {
        const options = {
            short: { day: 'numeric', month: 'short' },
            medium: { day: 'numeric', month: 'long', year: 'numeric' },
            long: { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }
        };

        return new Date(date).toLocaleDateString('es-ES', options[format] || options.medium);
    }
}

// Initialize the HR System
window.HRSystem = new HRSystem();