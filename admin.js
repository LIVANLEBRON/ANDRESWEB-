// Importar las funciones de Firebase
import { auth, loginWithEmailAndPassword, logoutUser, onAuthChange, saveData, updateData, deleteData, getAllData, getData } from "./firebase-config.js";

document.addEventListener('DOMContentLoaded', function() {
    
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
    
    // Verificar si el usuario está autenticado usando Firebase Auth
    function checkAuth() {
        onAuthChange((user) => {
            if (user) {
                // Usuario autenticado
                loginSection.style.display = 'none';
                adminPanel.style.display = 'block';
                loadAllContent();
            } else {
                // Usuario no autenticado
                loginSection.style.display = 'block';
                adminPanel.style.display = 'none';
            }
        });
    }
    
    // Inicializar datos en Firebase si no existen
    async function initializeData() {
        try {
            // Verificar si ya existen datos en Firebase
            const serviciosResult = await getAllData('servicios');
            const portafolioResult = await getAllData('portafolio');
            const testimoniosResult = await getAllData('testimonios');
            const sobreMiResult = await getAllData('sobreMi');
            
            // Si no hay servicios, inicializar con datos predeterminados
            if (!serviciosResult.success || serviciosResult.data.length === 0) {
                const defaultServicios = [
                    { id: '1', titulo: 'Tapizado de Muebles', descripcion: 'Transformamos tus muebles con telas de alta calidad y atención al detalle.' },
                    { id: '2', titulo: 'Restauración de Sillas y Sofás', descripcion: 'Devolvemos la vida a tus muebles antiguos, conservando su encanto original.' },
                    { id: '3', titulo: 'Reparación de Tapicería', descripcion: 'Solucionamos cualquier daño en la tapicería de tus muebles.' },
                    { id: '4', titulo: 'Creación de Piezas Personalizadas', descripcion: 'Diseñamos y creamos muebles tapizados a medida según tus necesidades. Fabricamos tu mueble a la medida de tu espacio.' }
                ];
                
                for (const servicio of defaultServicios) {
                    await saveData('servicios', servicio.id, servicio);
                }
            }
            
            // Si no hay portafolio, inicializar con datos predeterminados
            if (!portafolioResult.success || portafolioResult.data.length === 0) {
                const defaultPortafolio = [
                    { id: '1', titulo: 'Silla Vintage Restaurada', imagen: 'https://cdn.gamma.app/bt4ezuzuwajpo7o/generated-images/QxMEpc58S8DzNhA1qvNup.jpg' },
                    { id: '2', titulo: 'Sofá Moderno', imagen: 'https://cdn.gamma.app/bt4ezuzuwajpo7o/generated-images/Ytf9xu4vUqSX5LbCFAhrB.jpg' },
                    { id: '3', titulo: 'Sillón Restaurado', imagen: 'https://cdn.gamma.app/bt4ezuzuwajpo7o/generated-images/p3ssEpNrPCC89Nu20UxOK.jpg' }
                ];
                
                for (const item of defaultPortafolio) {
                    await saveData('portafolio', item.id, item);
                }
            }
            
            // Si no hay testimonios, inicializar con datos predeterminados
            if (!testimoniosResult.success || testimoniosResult.data.length === 0) {
                const defaultTestimonios = [
                    { id: '1', nombre: 'María Pérez', titulo: 'Excelente Servicio', texto: '¡Estoy encantada con el trabajo! Mi sofá luce como nuevo y el servicio fue impecable.', imagen: 'https://cdn.gamma.app/bt4ezuzuwajpo7o/generated-images/eCj4BRzrPCDsYe2kGlXcc.jpg' },
                    { id: '2', nombre: 'Juan Rodríguez', titulo: 'Profesionales y Dedicados', texto: 'Recomiendo Vintage Tapicería. Cumplieron con mis expectativas y superaron mis sueños.', imagen: 'https://cdn.gamma.app/bt4ezuzuwajpo7o/generated-images/o5XP6lTV3KbOucPwcFQb1.jpg' }
                ];
                
                for (const testimonio of defaultTestimonios) {
                    await saveData('testimonios', testimonio.id, testimonio);
                }
            }
            
            // Si no hay información de Sobre Mí, inicializar con datos predeterminados
            if (!sobreMiResult.success || sobreMiResult.data.length === 0) {
                const defaultSobreMi = {
                    id: '1',
                    texto: 'Soy un tapicero apasionado con años de experiencia en el arte de transformar muebles. Mi objetivo es superar tus expectativas.',
                    imagen: 'https://cdn.gamma.app/bt4ezuzuwajpo7o/generated-images/6OKg0tL5R5dkfY0sjcAQE.jpg'
                };
                
                await saveData('sobreMi', defaultSobreMi.id, defaultSobreMi);
            }
        } catch (error) {
            console.error('Error al inicializar datos:', error);
        }
    }
    
    // Cargar todos los contenidos desde Firebase
    async function loadAllContent() {
        try {
            await Promise.all([
                loadServicios(),
                loadPortafolio(),
                loadTestimonios(),
                loadSobreMi()
            ]);
        } catch (error) {
            console.error('Error al cargar contenido:', error);
        }
    }
    
    // Cargar servicios desde Firebase
    async function loadServicios() {
        try {
            const result = await getAllData('servicios');
            if (!result.success) {
                console.error('Error al cargar servicios:', result.error);
                return;
            }
            
            const servicios = result.data || [];
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
    
    // Cargar portafolio desde Firebase
    async function loadPortafolio() {
        try {
            const result = await getAllData('portafolio');
            if (!result.success) {
                console.error('Error al cargar portafolio:', result.error);
                return;
            }
            
            const portafolio = result.data || [];
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
    
    // Cargar testimonios desde Firebase
    async function loadTestimonios() {
        try {
            const result = await getAllData('testimonios');
            if (!result.success) {
                console.error('Error al cargar testimonios:', result.error);
                return;
            }
            
            const testimonios = result.data || [];
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
    
    // Cargar información de Sobre Mí desde Firebase
    async function loadSobreMi() {
        try {
            const result = await getAllData('sobreMi');
            if (!result.success) {
                console.error('Error al cargar sobre mí:', result.error);
                return;
            }
            
            // Como sobreMi es un solo documento, tomamos el primero si existe
            const sobreMiArray = result.data || [];
            const sobreMi = sobreMiArray.length > 0 ? sobreMiArray[0] : {};
            
            document.getElementById('sobre-mi-texto').value = sobreMi.texto || '';
            document.getElementById('sobre-mi-imagen').value = sobreMi.imagen || '';
            
            const imagenPreview = document.getElementById('sobre-mi-imagen-preview');
            if (sobreMi.imagen) {
                imagenPreview.src = sobreMi.imagen;
                imagenPreview.style.display = 'block';
            } else {
                imagenPreview.style.display = 'none';
            }
        } catch (error) {
            console.error('Error al cargar sobre mí:', error);
        }
    }
    
    // Editar servicio
    async function editServicio(id) {
        try {
            const result = await getData('servicios', id);
            
            if (!result.success) {
                throw new Error(result.error);
            }
            
            const servicio = result.data;
            if (servicio) {
                document.getElementById('servicio-id').value = id;
                document.getElementById('servicio-titulo').value = servicio.titulo;
                document.getElementById('servicio-descripcion').value = servicio.descripcion;
                
                document.getElementById('servicio-form-title').textContent = 'Editar Servicio';
                servicioForm.style.display = 'block';
            }
        } catch (error) {
            console.error('Error al cargar servicio para editar:', error);
            alert('Error al cargar servicio: ' + error.message);
        }
    }
    
    // Eliminar servicio
    async function deleteServicio(id) {
        if (confirm('¿Estás seguro de que deseas eliminar este servicio?')) {
            try {
                // Eliminar de Firebase
                const deleteResult = await deleteData('servicios', id);
                
                if (!deleteResult.success) {
                    throw new Error(deleteResult.error);
                }
                
                await loadServicios();
            } catch (error) {
                console.error('Error al eliminar servicio:', error);
                alert('Error al eliminar servicio: ' + error.message);
            }
        }
    }
    
    // Editar portafolio
    async function editPortafolio(id) {
        try {
            const result = await getData('portafolio', id);
            
            if (!result.success) {
                throw new Error(result.error);
            }
            
            const item = result.data;
            if (item) {
                document.getElementById('portafolio-id').value = id;
                document.getElementById('portafolio-titulo').value = item.titulo;
                document.getElementById('portafolio-imagen').value = item.imagen;
                
                const imagenPreview = document.getElementById('portafolio-imagen-preview');
                imagenPreview.src = item.imagen;
                imagenPreview.style.display = 'block';
                
                document.getElementById('portafolio-form-title').textContent = 'Editar Proyecto';
                portafolioForm.style.display = 'block';
            }
        } catch (error) {
            console.error('Error al cargar proyecto para editar:', error);
            alert('Error al cargar proyecto: ' + error.message);
        }
    }
    
    // Eliminar portafolio
    async function deletePortafolio(id) {
        if (confirm('¿Estás seguro de que deseas eliminar este proyecto?')) {
            try {
                // Eliminar de Firebase
                const deleteResult = await deleteData('portafolio', id);
                
                if (!deleteResult.success) {
                    throw new Error(deleteResult.error);
                }
                
                await loadPortafolio();
            } catch (error) {
                console.error('Error al eliminar item de portafolio:', error);
                alert('Error al eliminar item de portafolio: ' + error.message);
            }
        }
    }
    
    // Editar testimonio
    async function editTestimonio(id) {
        try {
            const result = await getData('testimonios', id);
            
            if (!result.success) {
                throw new Error(result.error);
            }
            
            const testimonio = result.data;
            if (testimonio) {
                document.getElementById('testimonio-id').value = id;
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
        } catch (error) {
            console.error('Error al cargar testimonio para editar:', error);
            alert('Error al cargar testimonio: ' + error.message);
        }
    }
    
    // Eliminar testimonio de Firebase
    async function deleteTestimonio(id) {
        if (confirm('¿Estás seguro de que deseas eliminar este testimonio?')) {
            try {
                // Eliminar de Firebase
                const deleteResult = await deleteData('testimonios', id);
                
                if (!deleteResult.success) {
                    throw new Error(deleteResult.error);
                }
                
                await loadTestimonios();
            } catch (error) {
                console.error('Error al eliminar testimonio:', error);
                alert('Error al eliminar testimonio: ' + error.message);
            }
        }
    }
    
    // Event Listeners
    
    // Iniciar sesión con Firebase Auth
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const email = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        try {
            const result = await loginWithEmailAndPassword(email, password);
            
            if (result.success) {
                // La autenticación se maneja automáticamente con onAuthChange
                console.log('Inicio de sesión exitoso');
            } else {
                alert('Error de autenticación: ' + result.error);
            }
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
            alert('Error al iniciar sesión: ' + error.message);
        }
    });
    
    // Cerrar sesión con Firebase Auth
    logoutBtn.addEventListener('click', async function() {
        try {
            await logoutUser();
            // La redirección se maneja automáticamente con onAuthChange
            console.log('Cierre de sesión exitoso');
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
            alert('Error al cerrar sesión: ' + error.message);
        }
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
    document.getElementById('servicioForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const id = document.getElementById('servicio-id').value;
        const titulo = document.getElementById('servicio-titulo').value;
        const descripcion = document.getElementById('servicio-descripcion').value;
        
        if (!titulo || !descripcion) {
            alert('Por favor, completa todos los campos.');
            return;
        }
        
        try {
            if (id) {
                // Editar existente
                const servicioActualizado = { id, titulo, descripcion };
                const updateResult = await updateData('servicios', id, servicioActualizado);
                
                if (!updateResult.success) {
                    throw new Error(updateResult.error);
                }
            } else {
                // Obtener todos los servicios para generar un nuevo ID
                const result = await getAllData('servicios');
                const servicios = result.success ? result.data : [];
                const newId = servicios.length > 0 ? 
                    (Math.max(...servicios.map(s => parseInt(s.id))) + 1).toString() : '1';
                
                // Crear nuevo servicio
                const nuevoServicio = {
                    id: newId,
                    titulo,
                    descripcion
                };
                
                // Guardar en Firebase
                const saveResult = await saveData('servicios', newId, nuevoServicio);
                
                if (!saveResult.success) {
                    throw new Error(saveResult.error);
                }
            }
            
            servicioForm.style.display = 'none';
            await loadServicios();
        } catch (error) {
            console.error('Error al guardar servicio:', error);
            alert('Error al guardar servicio: ' + error.message);
        }
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
    document.getElementById('portafolioForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const id = document.getElementById('portafolio-id').value;
        const titulo = document.getElementById('portafolio-titulo').value;
        const imagen = document.getElementById('portafolio-imagen').value;
        
        if (!titulo || !imagen) {
            alert('Por favor, completa todos los campos.');
            return;
        }
        
        try {
            if (id) {
                // Editar existente
                const itemActualizado = { id, titulo, imagen };
                const updateResult = await updateData('portafolio', id, itemActualizado);
                
                if (!updateResult.success) {
                    throw new Error(updateResult.error);
                }
            } else {
                // Obtener todos los items para generar un nuevo ID
                const result = await getAllData('portafolio');
                const portafolio = result.success ? result.data : [];
                const newId = portafolio.length > 0 ? 
                    (Math.max(...portafolio.map(p => parseInt(p.id))) + 1).toString() : '1';
                
                // Crear nuevo item
                const nuevoItem = {
                    id: newId,
                    titulo,
                    imagen
                };
                
                // Guardar en Firebase
                const saveResult = await saveData('portafolio', newId, nuevoItem);
                
                if (!saveResult.success) {
                    throw new Error(saveResult.error);
                }
            }
            
            portafolioForm.style.display = 'none';
            await loadPortafolio();
        } catch (error) {
            console.error('Error al guardar item de portafolio:', error);
            alert('Error al guardar item de portafolio: ' + error.message);
        }
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
    
    // Guardar testimonio en Firebase
    document.getElementById('testimonioForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const id = document.getElementById('testimonio-id').value;
        const nombre = document.getElementById('testimonio-nombre').value;
        const titulo = document.getElementById('testimonio-titulo').value;
        const texto = document.getElementById('testimonio-texto').value;
        const imagen = document.getElementById('testimonio-imagen').value;
        
        if (!nombre || !titulo || !texto) {
            alert('Por favor, completa los campos obligatorios.');
            return;
        }
        
        try {
            if (id) {
                // Editar existente
                const testimonioActualizado = { id, nombre, titulo, texto, imagen };
                const updateResult = await updateData('testimonios', id, testimonioActualizado);
                
                if (!updateResult.success) {
                    throw new Error(updateResult.error);
                }
            } else {
                // Obtener todos los testimonios para generar un nuevo ID
                const result = await getAllData('testimonios');
                const testimonios = result.success ? result.data : [];
                const newId = testimonios.length > 0 ? 
                    (Math.max(...testimonios.map(t => parseInt(t.id))) + 1).toString() : '1';
                
                // Crear nuevo testimonio
                const nuevoTestimonio = {
                    id: newId,
                    nombre,
                    titulo,
                    texto,
                    imagen
                };
                
                // Guardar en Firebase
                const saveResult = await saveData('testimonios', newId, nuevoTestimonio);
                
                if (!saveResult.success) {
                    throw new Error(saveResult.error);
                }
            }
            
            testimonioForm.style.display = 'none';
            await loadTestimonios();
        } catch (error) {
            console.error('Error al guardar testimonio:', error);
            alert('Error al guardar testimonio: ' + error.message);
        }
    });
    
    // Guardar Sobre Mí en Firebase
    sobreMiForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const texto = document.getElementById('sobre-mi-texto').value;
        const imagen = document.getElementById('sobre-mi-imagen').value;
        
        if (!texto) {
            alert('Por favor, completa el campo de texto.');
            return;
        }
        
        try {
            // Obtener datos actuales para verificar si existe
            const result = await getAllData('sobreMi');
            const sobreMiArray = result.success ? result.data : [];
            
            // ID para el documento (usar el existente o crear uno nuevo)
            const id = sobreMiArray.length > 0 ? sobreMiArray[0].id : '1';
            
            // Datos actualizados
            const sobreMiActualizado = {
                id,
                texto,
                imagen
            };
            
            // Guardar en Firebase
            let saveResult;
            if (sobreMiArray.length > 0) {
                saveResult = await updateData('sobreMi', id, sobreMiActualizado);
            } else {
                saveResult = await saveData('sobreMi', id, sobreMiActualizado);
            }
            
            if (!saveResult.success) {
                throw new Error(saveResult.error);
            }
            
            alert('Información guardada correctamente.');
        } catch (error) {
            console.error('Error al guardar información Sobre Mí:', error);
            alert('Error al guardar información: ' + error.message);
        }
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