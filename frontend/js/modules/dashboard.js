class DashboardModule {
    constructor() {
        this.charts = {};
    }

    async load(stats, activity, chartData) {
        return `
            <div class="dashboard">
                <!-- Stats Cards -->
                <div class="stats-grid">
                    <div class="stat-card employees">
                        <div class="stat-card-header">
                            <div class="stat-card-icon">
                                <i class="fas fa-users"></i>
                            </div>
                            <div class="stat-card-trend trend-up">
                                <i class="fas fa-arrow-up"></i>
                                <span>12%</span>
                            </div>
                        </div>
                        <div class="stat-card-value">${stats?.total_employees || 0}</div>
                        <div class="stat-card-label">Empleados Totales</div>
                        <div class="stat-card-change">+${stats?.new_employees || 0} este mes</div>
                    </div>

                    <div class="stat-card attendance">
                        <div class="stat-card-header">
                            <div class="stat-card-icon">
                                <i class="fas fa-clock"></i>
                            </div>
                            <div class="stat-card-trend trend-up">
                                <i class="fas fa-arrow-up"></i>
                                <span>5%</span>
                            </div>
                        </div>
                        <div class="stat-card-value">${stats?.attendance_rate || 0}%</div>
                        <div class="stat-card-label">Tasa de Asistencia</div>
                        <div class="stat-card-change">${stats?.present_today || 0} presentes hoy</div>
                    </div>

                    <div class="stat-card leave">
                        <div class="stat-card-header">
                            <div class="stat-card-icon">
                                <i class="fas fa-umbrella-beach"></i>
                            </div>
                            <div class="stat-card-trend trend-down">
                                <i class="fas fa-arrow-down"></i>
                                <span>8%</span>
                            </div>
                        </div>
                        <div class="stat-card-value">${stats?.on_leave || 0}</div>
                        <div class="stat-card-label">Empleados Ausentes</div>
                        <div class="stat-card-change">${stats?.leave_requests || 0} solicitudes pendientes</div>
                    </div>

                    <div class="stat-card cases">
                        <div class="stat-card-header">
                            <div class="stat-card-icon">
                                <i class="fas fa-headset"></i>
                            </div>
                            <div class="stat-card-trend trend-up">
                                <i class="fas fa-arrow-up"></i>
                                <span>15%</span>
                            </div>
                        </div>
                        <div class="stat-card-value">${stats?.open_cases || 0}</div>
                        <div class="stat-card-label">Casos Abiertos</div>
                        <div class="stat-card-change">${stats?.urgent_cases || 0} urgentes</div>
                    </div>

                    <div class="stat-card training">
                        <div class="stat-card-header">
                            <div class="stat-card-icon">
                                <i class="fas fa-graduation-cap"></i>
                            </div>
                            <div class="stat-card-trend trend-up">
                                <i class="fas fa-arrow-up"></i>
                                <span>22%</span>
                            </div>
                        </div>
                        <div class="stat-card-value">${stats?.training_completed || 0}</div>
                        <div class="stat-card-label">Capacitaciones Completadas</div>
                        <div class="stat-card-change">${stats?.ongoing_training || 0} en progreso</div>
                    </div>
                </div>

                <!-- Charts Section -->
                <div class="charts-section">
                    <div class="chart-card">
                        <div class="chart-header">
                            <h3>Asistencia por Departamento</h3>
                            <div class="chart-actions">
                                <select class="chart-period" id="attendancePeriod">
                                    <option value="week">Esta semana</option>
                                    <option value="month" selected>Este mes</option>
                                    <option value="quarter">Este trimestre</option>
                                    <option value="year">Este año</option>
                                </select>
                            </div>
                        </div>
                        <div class="chart-container">
                            <canvas id="attendanceChart"></canvas>
                        </div>
                    </div>

                    <div class="chart-card">
                        <div class="chart-header">
                            <h3>Tendencias de Contratación</h3>
                            <div class="chart-actions">
                                <select class="chart-period" id="hiringPeriod">
                                    <option value="6m">Últimos 6 meses</option>
                                    <option value="1y" selected>Último año</option>
                                    <option value="2y">Últimos 2 años</option>
                                </select>
                            </div>
                        </div>
                        <div class="chart-container">
                            <canvas id="hiringChart"></canvas>
                        </div>
                    </div>
                </div>

                <!-- Recent Activity -->
                <div class="activity-section">
                    <div class="activity-card">
                        <div class="chart-header">
                            <h3>Actividad Reciente</h3>
                            <button class="btn btn-sm btn-outline">Ver todo</button>
                        </div>
                        <div class="activity-list" id="recentActivity">
                            ${this.renderActivity(activity)}
                        </div>
                    </div>
                </div>

                <!-- Calendar Widget -->
                <div class="calendar-widget">
                    <div class="calendar-card">
                        <div class="calendar-header">
                            <h3>Calendario HR</h3>
                            <div class="calendar-nav">
                                <button class="icon-btn btn-sm" id="prevMonth">
                                    <i class="fas fa-chevron-left"></i>
                                </button>
                                <span id="currentMonth">${this.getCurrentMonth()}</span>
                                <button class="icon-btn btn-sm" id="nextMonth">
                                    <i class="fas fa-chevron-right"></i>
                                </button>
                            </div>
                        </div>
                        <div class="calendar" id="calendarWidget">
                            ${this.renderCalendar()}
                        </div>
                        <div class="calendar-events">
                            <h4>Próximos Eventos</h4>
                            ${this.renderUpcomingEvents()}
                        </div>
                    </div>
                </div>

                <!-- Quick Stats -->
                <div class="quick-stats">
                    <div class="department-stats">
                        <h3>Distribución por Departamento</h3>
                        <div class="stats-list" id="departmentStats">
                            ${this.renderDepartmentStats(stats?.departments)}
                        </div>
                    </div>

                    <div class="attendance-stats">
                        <h3>Estado de Asistencia Hoy</h3>
                        <div class="stats-list" id="attendanceStats">
                            ${this.renderAttendanceStats(stats?.attendance_today)}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    renderActivity(activity = []) {
        if (!activity || activity.length === 0) {
            return `
                <div class="empty-state">
                    <div class="empty-state-icon">
                        <i class="fas fa-bell-slash"></i>
                    </div>
                    <p>No hay actividad reciente</p>
                </div>
            `;
        }

        const icons = {
            employee: 'user-plus',
            attendance: 'clock',
            leave: 'umbrella-beach',
            document: 'file',
            performance: 'chart-line',
            training: 'graduation-cap',
            case: 'headset'
        };

        return activity.slice(0, 5).map(item => `
            <div class="activity-item">
                <div class="activity-icon ${item.type}">
                    <i class="fas fa-${icons[item.type] || 'bell'}"></i>
                </div>
                <div class="activity-content">
                    <div class="activity-title">${item.title}</div>
                    <div class="activity-description">${item.description}</div>
                    <div class="activity-time">${HRSystem.formatTimeAgo(item.timestamp)}</div>
                </div>
            </div>
        `).join('');
    }

    renderDepartmentStats(departments = {}) {
        if (!departments || Object.keys(departments).length === 0) {
            return '<p class="text-muted">No hay datos disponibles</p>';
        }

        const colors = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe'];
        let colorIndex = 0;

        return Object.entries(departments).map(([dept, count]) => {
            const color = colors[colorIndex++ % colors.length];
            const percentage = Math.round((count / Object.values(departments).reduce((a, b) => a + b, 0)) * 100);
            
            return `
                <div class="stat-row">
                    <div class="stat-label">
                        <span class="stat-color" style="background: ${color}"></span>
                        <span>${dept}</span>
                    </div>
                    <div class="stat-value">${count}</div>
                    <div class="stat-percentage">${percentage}%</div>
                </div>
            `;
        }).join('');
    }

    renderAttendanceStats(attendance = {}) {
        const defaultStats = {
            present: 0,
            absent: 0,
            late: 0,
            remote: 0,
            leave: 0
        };

        const stats = { ...defaultStats, ...attendance };
        
        return `
            <div class="stat-row">
                <div class="stat-label">
                    <span class="stat-color" style="background: #27ae60"></span>
                    <span>Presentes</span>
                </div>
                <div class="stat-value">${stats.present}</div>
            </div>
            <div class="stat-row">
                <div class="stat-label">
                    <span class="stat-color" style="background: #e74c3c"></span>
                    <span>Ausentes</span>
                </div>
                <div class="stat-value">${stats.absent}</div>
            </div>
            <div class="stat-row">
                <div class="stat-label">
                    <span class="stat-color" style="background: #f39c12"></span>
                    <span>Tardíos</span>
                </div>
                <div class="stat-value">${stats.late}</div>
            </div>
            <div class="stat-row">
                <div class="stat-label">
                    <span class="stat-color" style="background: #3498db"></span>
                    <span>Remotos</span>
                </div>
                <div class="stat-value">${stats.remote}</div>
            </div>
            <div class="stat-row">
                <div class="stat-label">
                    <span class="stat-color" style="background: #9b59b6"></span>
                    <span>De permiso</span>
                </div>
                <div class="stat-value">${stats.leave}</div>
            </div>
        `;
    }

    renderCalendar() {
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth();
        
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDay = firstDay.getDay();
        
        const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
        const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
                       'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
        
        let calendarHTML = `
            <div class="calendar-days">
                ${days.map(day => `<div class="day-header">${day}</div>`).join('')}
            </div>
            <div class="calendar-cells">
        `;
        
        // Empty cells for days before the first day of the month
        for (let i = 0; i < startingDay; i++) {
            calendarHTML += '<div class="calendar-cell"></div>';
        }
        
        // Days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const isToday = day === today.getDate() && month === today.getMonth();
            const hasEvent = this.hasEvent(year, month, day);
            
            calendarHTML += `
                <div class="calendar-cell ${isToday ? 'today' : ''} ${hasEvent ? 'event' : ''}">
                    ${day}
                </div>
            `;
        }
        
        calendarHTML += '</div>';
        return calendarHTML;
    }

    hasEvent(year, month, day) {
        // This would typically come from an API
        const events = [
            { date: new Date(year, month, 15), type: 'meeting' },
            { date: new Date(year, month, 20), type: 'holiday' },
            { date: new Date(year, month, 25), type: 'deadline' }
        ];
        
        const checkDate = new Date(year, month, day);
        return events.some(event => 
            event.date.getDate() === checkDate.getDate() &&
            event.date.getMonth() === checkDate.getMonth() &&
            event.date.getFullYear() === checkDate.getFullYear()
        );
    }

    renderUpcomingEvents() {
        const events = [
            { title: 'Revisión Trimestral', date: new Date(), type: 'meeting' },
            { title: 'Día Festivo', date: new Date(Date.now() + 86400000 * 5), type: 'holiday' },
            { title: 'Entrega Evaluaciones', date: new Date(Date.now() + 86400000 * 10), type: 'deadline' }
        ];
        
        return events.map(event => `
            <div class="calendar-event">
                <div class="event-dot ${event.type}"></div>
                <div class="event-content">
                    <div class="event-title">${event.title}</div>
                    <div class="event-time">${HRSystem.formatDate(event.date, 'short')}</div>
                </div>
            </div>
        `).join('');
    }

    getCurrentMonth() {
        const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
                       'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
        const today = new Date();
        return `${months[today.getMonth()]} ${today.getFullYear()}`;
    }

    renderCharts(chartData) {
        this.renderAttendanceChart(chartData?.attendance || {});
        this.renderHiringChart(chartData?.hiring || {});
    }

    renderAttendanceChart(data) {
        const ctx = document.getElementById('attendanceChart')?.getContext('2d');
        if (!ctx) return;

        if (this.charts.attendance) {
            this.charts.attendance.destroy();
        }

        const departments = Object.keys(data);
        const rates = Object.values(data);

        this.charts.attendance = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: departments,
                datasets: [{
                    label: 'Tasa de Asistencia (%)',
                    data: rates,
                    backgroundColor: [
                        'rgba(102, 126, 234, 0.7)',
                        'rgba(118, 75, 162, 0.7)',
                        'rgba(240, 147, 251, 0.7)',
                        'rgba(245, 87, 108, 0.7)',
                        'rgba(79, 172, 254, 0.7)'
                    ],
                    borderColor: [
                        'rgb(102, 126, 234)',
                        'rgb(118, 75, 162)',
                        'rgb(240, 147, 251)',
                        'rgb(245, 87, 108)',
                        'rgb(79, 172, 254)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `${context.dataset.label}: ${context.raw}%`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            callback: function(value) {
                                return value + '%';
                            }
                        }
                    }
                }
            }
        });
    }

    renderHiringChart(data) {
        const ctx = document.getElementById('hiringChart')?.getContext('2d');
        if (!ctx) return;

        if (this.charts.hiring) {
            this.charts.hiring.destroy();
        }

        const months = data.months || ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
        const hires = data.hires || [5, 8, 12, 7, 15, 18, 22, 20, 17, 14, 10, 8];

        this.charts.hiring = new Chart(ctx, {
            type: 'line',
            data: {
                labels: months,
                datasets: [{
                    label: 'Contrataciones',
                    data: hires,
                    borderColor: 'rgb(102, 126, 234)',
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Número de Contrataciones'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Meses'
                        }
                    }
                }
            }
        });
    }

    initEvents() {
        // Period selectors
        document.getElementById('attendancePeriod')?.addEventListener('change', (e) => {
            this.updateAttendanceChart(e.target.value);
        });

        document.getElementById('hiringPeriod')?.addEventListener('change', (e) => {
            this.updateHiringChart(e.target.value);
        });

        // Calendar navigation
        document.getElementById('prevMonth')?.addEventListener('click', () => {
            this.navigateCalendar(-1);
        });

        document.getElementById('nextMonth')?.addEventListener('click', () => {
            this.navigateCalendar(1);
        });
    }

    async updateAttendanceChart(period) {
        try {
            const response = await fetch(`/api/dashboard/attendance?period=${period}`);
            const data = await response.json();
            this.renderAttendanceChart(data);
        } catch (error) {
            console.error('Error updating attendance chart:', error);
        }
    }

    async updateHiringChart(period) {
        try {
            const response = await fetch(`/api/dashboard/hiring?period=${period}`);
            const data = await response.json();
            this.renderHiringChart(data);
        } catch (error) {
            console.error('Error updating hiring chart:', error);
        }
    }

    navigateCalendar(direction) {
        // Implementation for calendar navigation
        console.log('Navigate calendar:', direction);
    }
}