class HRSystem {
    constructor() {
        this.init();
    }

    init() {
        this.initSidebar();
        this.initModals();
        this.initNavigation();
        this.loadDashboard();
    }

    initSidebar() {
        const toggleBtn = document.getElementById('toggleSidebar');
        const sidebar = document.getElementById('sidebar');
        
        toggleBtn.addEventListener('click', () => {
            sidebar.classList.toggle('active');
            document.querySelector('.main-content').classList.toggle('expanded');
        });

        // Cerrar sidebar en móvil al hacer clic fuera
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 768 && 
                !sidebar.contains(e.target) && 
                !toggleBtn.contains(e.target) &&
                sidebar.classList.contains('active')) {
                sidebar.classList.remove('active');
            }
        });
    }

    initNavigation() {
        const navLinks = document.querySelectorAll('.nav-menu a');
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const sectionId = link.getAttribute('data-section');
                
                // Remover clase active de todos los enlaces
                navLinks.forEach(l => l.classList.remove('active'));
                // Agregar clase active al enlace clickeado
                link.classList.add('active');
                
                // Mostrar sección correspondiente
                this.showSection(sectionId);
            });
        });
    }

    showSection(sectionId) {
        // Ocultar todas las secciones
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });
        
        // Mostrar sección seleccionada
        const activeSection = document.getElementById(sectionId);
        if (activeSection) {
            activeSection.classList.add('active');
            
            // Cargar datos específicos de la sección
            this.loadSectionData(sectionId);
        }
    }

    loadSectionData(sectionId) {
        switch(sectionId) {
            case 'employees':
                this.loadEmployees();
                break;
            case 'attendance':
                this.loadAttendance();
                break;
            case 'dashboard':
                this.loadDashboard();
                break;
            // Agregar más casos para otras secciones
        }
    }

    initModals() {
        const modal = document.getElementById('employeeModal');
        const closeBtn = modal.querySelector('.close-modal');
        const addBtn = document.getElementById('addEmployeeBtn');

        addBtn.addEventListener('click', () => {
            this.openModal('employeeModal');
        });

        closeBtn.addEventListener('click', () => {
            this.closeModal('employeeModal');
        });

        // Cerrar modal al hacer clic fuera
        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeModal('employeeModal');
            }
        });
    }

    openModal(modalId) {
        const modal = document.getElementById(modalId);
        modal.style.display = 'flex';
        setTimeout(() => modal.classList.add('active'), 10);
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        modal.classList.remove('active');
        setTimeout(() => modal.style.display = 'none', 300);
    }

    async loadDashboard() {
        try {
            const response = await fetch('/api/reports/dashboard');
            const data = await response.json();
            this.displayDashboard(data);
        } catch (error) {
            console.error('Error loading dashboard:', error);
        }
    }

    displayDashboard(data) {
        const dashboardSection = document.getElementById('dashboard');
        // Crear widgets dinámicamente con los datos
    }

    async loadEmployees() {
        try {
            const response = await fetch('/api/employees');
            const employees = await response.json();
            this.displayEmployees(employees);
        } catch (error) {
            console.error('Error loading employees:', error);
        }
    }

    displayEmployees(employees) {
        const tableBody = document.getElementById('employeesTableBody');
        tableBody.innerHTML = '';
        
        employees.forEach(employee => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${employee.employee_id}</td>
                <td>${employee.first_name} ${employee.last_name}</td>
                <td>${employee.department}</td>
                <td>${employee.position}</td>
                <td><span class="status-badge ${employee.status}">${employee.status}</span></td>
                <td>
                    <button class="btn-action" onclick="hrSystem.viewEmployee(${employee.id})">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-action" onclick="hrSystem.editEmployee(${employee.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-action delete" onclick="hrSystem.deleteEmployee(${employee.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    }
}

// Inicializar sistema cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.hrSystem = new HRSystem();
});