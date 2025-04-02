document.addEventListener('DOMContentLoaded', function() {
    // Credenciales de administrador (en un entorno real, esto debería estar en el servidor)
    const adminCredentials = {
        username: 'admin',
        // Contraseña más segura con combinación de letras, números y caracteres especiales
        password: 'Vintage@2025!'
    };
    
    // Referencias a elementos del DOM
    const loginSection = document.getElementById('login-section');
    const adminPanel = document.getElementById('admin-panel');
    const loginForm = document.getElementById('loginForm');
    const logoutBtn = document.getElementById('logoutBtn');
    const navButtons = document.querySelectorAll('.nav-btn');
    const adminSections = document.querySelectorAll('.admin-section');
    
    // Formularios y botones
    const addServicioBtn = document.getElementById('add-servicio-btn');
    const servicioForm = document.getElementById('servicio-form');
    const serviciosList = document.getElementById('servicios-list');
    
    const addPortafolioBtn = document.getElementById('add-portafolio-btn');
    const portafolioForm = document.getElementById('portafolio-form');
    const portafolioList = document.getElementById('portafolio-list');
    
    const addTestimonioBtn = document.getElementById('add-testimonio-btn');
    const testimonioForm = document.getElementById('testimonio-form');
    const testimoniosList = document.getElementById('testimonios-list');
    
    const sobreMiForm = document.getElementById('sobreMiForm');
    
    // Verificar si el usuario está autenticado y la sesión no ha expirado
    function checkAuth() {
        const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
        const authExpiration = localStorage.getItem('authExpiration');
        const currentTime = new Date().getTime();
        
        // Verificar si la autenticación es válida y no ha expirado
        if (isAuthenticated && authExpiration && currentTime < parseInt(authExpiration)) {
            loginSection.style.display = 'none';
            adminPanel.style.display = 'block';
            loadAllContent();
        } else {
            // Si la sesión expiró, limpiar datos de autenticación
            if (isAuthenticated) {
                localStorage.removeItem('isAuthenticated');
                localStorage.removeItem('authExpiration');
            }
            loginSection.style.display = 'block';
            adminPanel.style.display = 'none';
        }
    }
    
    // Inicializar datos si no existen
    function initializeData() {
        if (!localStorage.getItem('servicios')) {
            const defaultServicios = [
                { id: 1, titulo: 'Tapizado de Muebles', descripcion: 'Transformamos tus muebles con telas de alta calidad y atención al detalle.' },
                { id: 2, titulo: 'Restauración de Sillas y Sofás', descripcion: 'Devolvemos la vida a tus muebles antiguos, conservando su encanto original.' },
                { id: 3, titulo: 'Reparación de Tapicería', descripcion: 'Solucionamos cualquier daño en la tapicería de tus muebles.' },
                { id: 4, titulo: 'Creación de Piezas Personalizadas', descripcion: 'Diseñamos y creamos muebles tapizados a medida según tus necesidades. Fabricamos tu mueble a la medida de tu espacio.' }
            ];
            localStorage.setItem('servicios', JSON.stringify(defaultServicios));
        }
        
        if (!localStorage.getItem('portafolio')) {
            const defaultPortafolio = [
                { id: 1, titulo: 'Silla Vintage Restaurada', imagen: 'https://cdn.gamma.app/bt4ezuzuwajpo7o/generated-images/QxMEpc58S8DzNhA1qvNup.jpg' },
                { id: 2, titulo: 'Sofá Moderno', imagen: 'https://cdn.gamma.app/bt4ezuzuwajpo7o/generated-images/Ytf9xu4vUqSX5LbCFAhrB.jpg' },
                { id: 3, titulo: 'Sillón Restaurado', imagen: 'https://cdn.gamma.app/bt4ezuzuwajpo7o/generated-images/p3ssEpNrPCC89Nu20UxOK.jpg' }
            ];
            localStorage.setItem('portafolio', JSON.stringify(defaultPortafolio));
        }
        
        if (!localStorage.getItem('testimonios')) {
            const defaultTestimonios = [
                { id: 1, nombre: 'María Pérez', titulo: 'Excelente Servicio', texto: '¡Estoy encantada con el trabajo! Mi sofá luce como nuevo y el servicio fue impecable.', imagen: 'https://cdn.gamma.app/bt4ezuzuwajpo7o/generated-images/eCj4BRzrPCDsYe2kGlXcc.jpg' },
                { id: 2, nombre: 'Juan Rodríguez', titulo: 'Profesionales y Dedicados', texto: 'Recomiendo Vintage Tapicería. Cumplieron con mis expectativas y superaron mis sueños.', imagen: 'https://cdn.gamma.app/bt4ezuzuwajpo7o/generated-images/o5XP6lTV3KbOucPwcFQb1.jpg' }
            ];
            localStorage.setItem('testimonios', JSON.stringify(defaultTestimonios));
        }
        
        if (!localStorage.getItem('sobreMi')) {
            const defaultSobreMi = {
                texto: 'Soy un tapicero apasionado con años de experiencia en el arte de transformar muebles. Mi objetivo es superar tus expectativas.',
                imagen: 'https://cdn.gamma.app/bt4ezuzuwajpo7o/generated-images/6OKg0tL5R5dkfY0sjcAQE.jpg'
            };
            localStorage.setItem('sobreMi', JSON.stringify(defaultSobreMi));
        }
    }
    
    // Cargar todos los contenidos
    function loadAllContent() {
        loadServicios();
        loadPortafolio();
        loadTestimonios();
        loadSobreMi();
    }
    
    // Cargar servicios
    function loadServicios() {
        const servicios = JSON.parse(localStorage.getItem('servicios')) || [];
        serviciosList.innerHTML = '';
        
        servicios.forEach(servicio => {
            const servicioItem = document.createElement('div');
            servicioItem.className = 'content-item';
            servicioItem.innerHTML = `
                <h3>${servicio.titulo}</h3>
                <p>${servicio.descripcion}</p>
                <div class="content-actions">
                    <button class="btn btn-secondary edit-servicio" data-id="${servicio.id}">Editar</button>
                    <button class="btn btn-danger delete-servicio" data-id="${servicio.id}">Eliminar</button>
                </div>
            `;
            serviciosList.appendChild(servicioItem);
        });
        
        // Agregar event listeners a los botones de editar y eliminar
        document.querySelectorAll('.edit-servicio').forEach(btn => {
            btn.addEventListener('click', function() {
                editServicio(this.getAttribute('data-id'));
            });
        });
        
        document.querySelectorAll('.delete-servicio').forEach(btn => {
            btn.addEventListener('click', function() {
                deleteServicio(this.getAttribute('data-id'));
            });
        });
    }
    
    // Cargar portafolio
    function loadPortafolio() {
        const portafolio = JSON.parse(localStorage.getItem('portafolio')) || [];
        portafolioList.innerHTML = '';
        
        portafolio.forEach(item => {
            const portafolioItem = document.createElement('div');
            portafolioItem.className = 'content-item';
            portafolioItem.innerHTML = `
                <h3>${item.titulo}</h3>
                <img src="${item.imagen}" alt="${item.titulo}" style="max-width: 200px; margin: 10px 0;">
                <div class="content-actions">
                    <button class="btn btn-secondary edit-portafolio" data-id="${item.id}">Editar</button>
                    <button class="btn btn-danger delete-portafolio" data-id="${item.id}">Eliminar</button>
                </div>
            `;
            portafolioList.appendChild(portafolioItem);
        });
        
        // Agregar event listeners a los botones de editar y eliminar
        document.querySelectorAll('.edit-portafolio').forEach(btn => {
            btn.addEventListener('click', function() {
                editPortafolio(this.getAttribute('data-id'));
            });
        });
        
        document.querySelectorAll('.delete-portafolio').forEach(btn => {
            btn.addEventListener('click', function() {
                deletePortafolio(this.getAttribute('data-id'));
            });
        });
    }
    
    // Cargar testimonios
    function loadTestimonios() {
        const testimonios = JSON.parse(localStorage.getItem('testimonios')) || [];
        testimoniosList.innerHTML = '';
        
        testimonios.forEach(testimonio => {
            const testimonioItem = document.createElement('div');
            testimonioItem.className = 'content-item';
            testimonioItem.innerHTML = `
                <h3>${testimonio.titulo}</h3>
                <p><strong>${testimonio.nombre}</strong>: "${testimonio.texto}"</p>
                ${testimonio.imagen ? `<img src="${testimonio.imagen}" alt="${testimonio.nombre}" style="max-width: 100px; margin: 10px 0;">` : ''}
                <div class="content-actions">
                    <button class="btn btn-secondary edit-testimonio" data-id="${testimonio.id}">Editar</button>
                    <button class="btn btn-danger delete-testimonio" data-id="${testimonio.id}">Eliminar</button>
                </div>
            `;
            testimoniosList.appendChild(testimonioItem);
        });
        
        // Agregar event listeners a los botones de editar y eliminar
        document.querySelectorAll('.edit-testimonio').forEach(btn => {
            btn.addEventListener('click', function() {
                editTestimonio(this.getAttribute('data-id'));
            });
        });
        
        document.querySelectorAll('.delete-testimonio').forEach(btn => {
            btn.addEventListener('click', function() {
                deleteTestimonio(this.getAttribute('data-id'));
            });
        });
    }
    
    // Cargar información de Sobre Mí
    function loadSobreMi() {
        const sobreMi = JSON.parse(localStorage.getItem('sobreMi')) || {};
        document.getElementById('sobre-mi-texto').value = sobreMi.texto || '';
        document.getElementById('sobre-mi-imagen').value = sobreMi.imagen || '';
        
        const imagenPreview = document.getElementById('sobre-mi-imagen-preview');
        if (sobreMi.imagen) {
            imagenPreview.src = sobreMi.imagen;
            imagenPreview.style.display = 'block';
        } else {
            imagenPreview.style.display = 'none';
        }
    }
    
    // Editar servicio
    function editServicio(id) {
        const servicios = JSON.parse(localStorage.getItem('servicios')) || [];
        const servicio = servicios.find(s => s.id == id);
        
        if (servicio) {
            document.getElementById('servicio-id').value = servicio.id;
            document.getElementById('servicio-titulo').value = servicio.titulo;
            document.getElementById('servicio-descripcion').value = servicio.descripcion;
            
            document.getElementById('servicio-form-title').textContent = 'Editar Servicio';
            servicioForm.style.display = 'block';
        }
    }
    
    // Eliminar servicio
    function deleteServicio(id) {
        if (confirm('¿Estás seguro de que deseas eliminar este servicio?')) {
            let servicios = JSON.parse(localStorage.getItem('servicios')) || [];
            servicios = servicios.filter(s => s.id != id);
            localStorage.setItem('servicios', JSON.stringify(servicios));
            loadServicios();
        }
    }
    
    // Editar portafolio
    function editPortafolio(id) {
        const portafolio = JSON.parse(localStorage.getItem('portafolio')) || [];
        const item = portafolio.find(p => p.id == id);
        
        if (item) {
            document.getElementById('portafolio-id').value = item.id;
            document.getElementById('portafolio-titulo').value = item.titulo;
            document.getElementById('portafolio-imagen').value = item.imagen;
            
            const imagenPreview = document.getElementById('portafolio-imagen-preview');
            imagenPreview.src = item.imagen;
            imagenPreview.style.display = 'block';
            
            document.getElementById('portafolio-form-title').textContent = 'Editar Proyecto';
            portafolioForm.style.display = 'block';
        }
    }
    
    // Eliminar portafolio
    function deletePortafolio(id) {
        if (confirm('¿Estás seguro de que deseas eliminar este proyecto?')) {
            let portafolio = JSON.parse(localStorage.getItem('portafolio')) || [];
            portafolio = portafolio.filter(p => p.id != id);
            localStorage.setItem('portafolio', JSON.stringify(portafolio));
            loadPortafolio();
        }
    }
    
    // Editar testimonio
    function editTestimonio(id) {
        const testimonios = JSON.parse(localStorage.getItem('testimonios')) || [];
        const testimonio = testimonios.find(t => t.id == id);
        
        if (testimonio) {
            document.getElementById('testimonio-id').value = testimonio.id;
            document.getElementById('testimonio-nombre').value = testimonio.nombre;
            document.getElementById('testimonio-titulo').value = testimonio.titulo;
            document.getElementById('testimonio-texto').value = testimonio.texto;
            document.getElementById('testimonio-imagen').value = testimonio.imagen || '';
            
            const imagenPreview = document.getElementById('testimonio-imagen-preview');
            if (testimonio.imagen) {
                imagenPreview.src = testimonio.imagen;
                imagenPreview.style.display = 'block';
            } else {
                imagenPreview.style.display = 'none';
            }
            
            document.getElementById('testimonio-form-title').textContent = 'Editar Testimonio';
            testimonioForm.style.display = 'block';
        }
    }
    
    // Eliminar testimonio
    function deleteTestimonio(id) {
        if (confirm('¿Estás seguro de que deseas eliminar este testimonio?')) {
            let testimonios = JSON.parse(localStorage.getItem('testimonios')) || [];
            testimonios = testimonios.filter(t => t.id != id);
            localStorage.setItem('testimonios', JSON.stringify(testimonios));
            loadTestimonios();
        }
    }
    
    // Event Listeners
    
    // Login con mejor manejo de errores y seguridad
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        // Verificación de credenciales
        if (username === adminCredentials.username && password === adminCredentials.password) {
            // Guardar estado de autenticación con tiempo de expiración (24 horas)
            const expirationTime = new Date().getTime() + (24 * 60 * 60 * 1000);
            localStorage.setItem('isAuthenticated', 'true');
            localStorage.setItem('authExpiration', expirationTime);
            checkAuth();
        } else {
            alert('Usuario o contraseña incorrectos. Por favor, inténtalo de nuevo.');
        }
    });
    
    // Logout
    logoutBtn.addEventListener('click', function() {
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('authExpiration');
        checkAuth();
    });
    
    // Navegación entre secciones
    navButtons.forEach(button => {
        button.addEventListener('click', function() {
            const sectionId = this.getAttribute('data-section');
            
            // Actualizar botones activos
            navButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Mostrar sección correspondiente
            adminSections.forEach(section => {
                section.classList.remove('active');
                if (section.id === `${sectionId}-section`) {
                    section.classList.add('active');
                }
            });
        });
    });
    
    // Agregar servicio
    addServicioBtn.addEventListener('click', function() {
        document.getElementById('servicio-id').value = '';
        document.getElementById('servicio-titulo').value = '';
        document.getElementById('servicio-descripcion').value = '';
        document.getElementById('servicio-form-title').textContent = 'Agregar Servicio';
        servicioForm.style.display = 'block';
    });
    
    // Guardar servicio
    document.getElementById('servicioForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const id = document.getElementById('servicio-id').value;
        const titulo = document.getElementById('servicio-titulo').value;
        const descripcion = document.getElementById('servicio-descripcion').value;
        
        let servicios = JSON.parse(localStorage.getItem('servicios')) || [];
        
        if (id) {
            // Editar existente
            const index = servicios.findIndex(s => s.id == id);
            if (index !== -1) {
                servicios[index] = { id: parseInt(id), titulo, descripcion };
            }
        } else {
            // Agregar nuevo
            const newId = servicios.length > 0 ? Math.max(...servicios.map(s => s.id)) + 1 : 1;
            servicios.push({ id: newId, titulo, descripcion });
        }
        
        localStorage.setItem('servicios', JSON.stringify(servicios));
        servicioForm.style.display = 'none';
        loadServicios();
    });
    
    // Agregar proyecto al portafolio
    addPortafolioBtn.addEventListener('click', function() {
        document.getElementById('portafolio-id').value = '';
        document.getElementById('portafolio-titulo').value = '';
        document.getElementById('portafolio-imagen').value = '';
        document.getElementById('portafolio-imagen-preview').style.display = 'none';
        document.getElementById('portafolio-form-title').textContent = 'Agregar Proyecto';
        portafolioForm.style.display = 'block';
    });
    
    // Guardar proyecto
    document.getElementById('portafolioForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const id = document.getElementById('portafolio-id').value;
        const titulo = document.getElementById('portafolio-titulo').value;
        const imagen = document.getElementById('portafolio-imagen').value;
        
        let portafolio = JSON.parse(localStorage.getItem('portafolio')) || [];
        
        if (id) {
            // Editar existente
            const index = portafolio.findIndex(p => p.id == id);
            if (index !== -1) {
                portafolio[index] = { id: parseInt(id), titulo, imagen };
            }
        } else {
            // Agregar nuevo
            const newId = portafolio.length > 0 ? Math.max(...portafolio.map(p => p.id)) + 1 : 1;
            portafolio.push({ id: newId, titulo, imagen });
        }
        
        localStorage.setItem('portafolio', JSON.stringify(portafolio));
        portafolioForm.style.display = 'none';
        loadPortafolio();
    });
    
    // Agregar testimonio
    addTestimonioBtn.addEventListener('click', function() {
        document.getElementById('testimonio-id').value = '';
        document.getElementById('testimonio-nombre').value = '';
        document.getElementById('testimonio-titulo').value = '';
        document.getElementById('testimonio-texto').value = '';
        document.getElementById('testimonio-imagen').value = '';
        document.getElementById('testimonio-imagen-preview').style.display = 'none';
        document.getElementById('testimonio-form-title').textContent = 'Agregar Testimonio';
        testimonioForm.style.display = 'block';
    });
    
    // Guardar testimonio
    document.getElementById('testimonioForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const id = document.getElementById('testimonio-id').value;
        const nombre = document.getElementById('testimonio-nombre').value;
        const titulo = document.getElementById('testimonio-titulo').value;
        const texto = document.getElementById('testimonio-texto').value;
        const imagen = document.getElementById('testimonio-imagen').value;
        
        let testimonios = JSON.parse(localStorage.getItem('testimonios')) || [];
        
        if (id) {
            // Editar existente
            const index = testimonios.findIndex(t => t.id == id);
            if (index !== -1) {
                testimonios[index] = { id: parseInt(id), nombre, titulo, texto, imagen };
            }
        } else {
            // Agregar nuevo
            const newId = testimonios.length > 0 ? Math.max(...testimonios.map(t => t.id)) + 1 : 1;
            testimonios.push({ id: newId, nombre, titulo, texto, imagen });
        }
        
        localStorage.setItem('testimonios', JSON.stringify(testimonios));
        testimonioForm.style.display = 'none';
        loadTestimonios();
    });
    
    // Guardar Sobre Mí
    sobreMiForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const texto = document.getElementById('sobre-mi-texto').value;
        const imagen = document.getElementById('sobre-mi-imagen').value;
        
        const sobreMi = { texto, imagen };
        localStorage.setItem('sobreMi', JSON.stringify(sobreMi));
        
        alert('Información guardada correctamente');
    });
    
    // Cancelar formularios
    document.querySelectorAll('.cancel-form').forEach(btn => {
        btn.addEventListener('click', function() {
            this.closest('.content-item').style.display = 'none';
        });
    });
    
    // Vista previa de imágenes
    document.getElementById('portafolio-imagen').addEventListener('input', function() {
        const preview = document.getElementById('portafolio-imagen-preview');
        if (this.value) {
            preview.src = this.value;
            preview.style.display = 'block';
        } else {
            preview.style.display = 'none';
        }
    });
    
    document.getElementById('testimonio-imagen').addEventListener('input', function() {
        const preview = document.getElementById('testimonio-imagen-preview');
        if (this.value) {
            preview.src = this.value;
            preview.style.display = 'block';
        } else {
            preview.style.display = 'none';
        }
    });
    
    document.getElementById('sobre-mi-imagen').addEventListener('input', function() {
        const preview = document.getElementById('sobre-mi-imagen-preview');
        if (this.value) {
            preview.src = this.value;
            preview.style.display = 'block';
        } else {
            preview.style.display = 'none';
        }
    });
    
    // Inicializar
    initializeData();
    checkAuth();
});