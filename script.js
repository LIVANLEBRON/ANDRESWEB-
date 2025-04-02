// Función para cambiar el tema de color (claro/oscuro)
function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    localStorage.setItem('theme', document.body.classList.contains('dark-theme') ? 'dark' : 'light');
}

document.addEventListener('DOMContentLoaded', function() {
    // Verificar tema guardado
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-theme');
    }
    
    // Inicializar AOS con opciones mejoradas
    AOS.init({ 
        duration: 800, 
        once: false,
        mirror: true,
        offset: 120,
        easing: 'ease-in-out'
    });
    
    // Funcionalidad de la barra de navegación
    const navbar = document.querySelector('.navbar');
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    // Cambiar estilo de la barra de navegación al hacer scroll
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Menú móvil toggle
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            menuToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
        
        // Cerrar menú al hacer clic en un enlace
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', function() {
                menuToggle.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }

    // Navegación suave al hacer clic en enlaces internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 70,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Galería de imágenes interactiva
    const galleryItems = document.querySelectorAll('.gallery-item');
    if (galleryItems.length > 0) {
        galleryItems.forEach(item => {
            item.addEventListener('click', function() {
                const imgSrc = this.querySelector('img').src;
                const imgAlt = this.querySelector('img').alt;
                const overlay = document.createElement('div');
                overlay.className = 'fullscreen-overlay';
                overlay.innerHTML = `
                    <div class="fullscreen-content">
                        <img src="${imgSrc}" alt="${imgAlt}">
                        <p>${imgAlt}</p>
                        <button class="close-button">×</button>
                    </div>
                `;
                document.body.appendChild(overlay);
                document.body.style.overflow = 'hidden';
                
                overlay.querySelector('.close-button').addEventListener('click', function() {
                    document.body.removeChild(overlay);
                    document.body.style.overflow = 'auto';
                });
                
                overlay.addEventListener('click', function(e) {
                    if (e.target === overlay) {
                        document.body.removeChild(overlay);
                        document.body.style.overflow = 'auto';
                    }
                });
            });
        });
    }

    // Animación de números para estadísticas (si se añaden)
    function animateNumbers() {
        const numberElements = document.querySelectorAll('.animate-number');
        numberElements.forEach(el => {
            const target = parseInt(el.getAttribute('data-target'));
            const duration = 2000; // ms
            const step = target / (duration / 16); // 60fps
            let current = 0;
            const timer = setInterval(() => {
                current += step;
                if (current >= target) {
                    el.textContent = target;
                    clearInterval(timer);
                } else {
                    el.textContent = Math.floor(current);
                }
            }, 16);
        });
    }

    // Observador de intersección para activar animaciones cuando son visibles
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (entry.target.classList.contains('stats-section')) {
                    animateNumbers();
                }
                entry.target.classList.add('animated');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.card').forEach(section => {
        observer.observe(section);
    });

    // Validación de formulario en tiempo real
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        const formInputs = contactForm.querySelectorAll('input, textarea');
        
        // Validación en tiempo real mientras se escribe
        formInputs.forEach(input => {
            input.addEventListener('input', function() {
                validateInput(this);
            });
            
            input.addEventListener('blur', function() {
                validateInput(this, true);
            });
        });
        
        function validateInput(input, showError = false) {
            const errorElement = input.nextElementSibling?.classList.contains('error-message') 
                ? input.nextElementSibling 
                : null;
                
            if (!input.value.trim()) {
                input.classList.add('invalid');
                if (showError) {
                    if (!errorElement) {
                        const error = document.createElement('div');
                        error.className = 'error-message';
                        error.textContent = 'Este campo es obligatorio';
                        input.insertAdjacentElement('afterend', error);
                    }
                }
                return false;
            } else if (input.type === 'email' && !/^\S+@\S+\.\S+$/.test(input.value)) {
                input.classList.add('invalid');
                if (showError) {
                    if (!errorElement) {
                        const error = document.createElement('div');
                        error.className = 'error-message';
                        error.textContent = 'Ingresa un correo electrónico válido';
                        input.insertAdjacentElement('afterend', error);
                    }
                }
                return false;
            } else {
                input.classList.remove('invalid');
                if (errorElement) {
                    errorElement.remove();
                }
                return true;
            }
        }
        
        // Manejo del envío del formulario
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();
            let isValid = true;
            
            formInputs.forEach(input => {
                if (!validateInput(input, true)) {
                    isValid = false;
                }
            });
            
            if (!isValid) return;
            
            const name = document.querySelector('#contactForm [name="name"]').value;
            const email = document.querySelector('#contactForm [name="email"]').value;
            const message = document.querySelector('#contactForm [name="message"]').value;
            
            // Mostrar indicador de carga
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="spinner"></span> Enviando...';
            
            const data = { name, email, message };
            fetch('https://script.google.com/macros/s/AKfycbxNP4un3yg8IitI_Wud-LMzr69KmzERYlOqfbJZyuy3dHTUEw14nEjkOF4PvSR2ZjG1aA/exec', {
                method: 'POST',
                body: JSON.stringify(data),
                headers: { 'Content-Type': 'application/json' }
            })
            .then(response => response.text())
            .then(result => {
                // Crear notificación personalizada en lugar de alert
                const notification = document.createElement('div');
                notification.className = 'notification success';
                notification.innerHTML = `
                    <div class="notification-content">
                        <span class="notification-icon">✓</span>
                        <p>${result || 'Mensaje enviado con éxito'}</p>
                        <button class="notification-close">×</button>
                    </div>
                `;
                document.body.appendChild(notification);
                
                // Cerrar notificación
                notification.querySelector('.notification-close').addEventListener('click', function() {
                    document.body.removeChild(notification);
                });
                
                // Auto-cerrar después de 5 segundos
                setTimeout(() => {
                    if (document.body.contains(notification)) {
                        document.body.removeChild(notification);
                    }
                }, 5000);
                
                contactForm.reset();
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
            })
            .catch(error => {
                console.error('Error:', error);
                
                // Notificación de error
                const notification = document.createElement('div');
                notification.className = 'notification error';
                notification.innerHTML = `
                    <div class="notification-content">
                        <span class="notification-icon">✕</span>
                        <p>Hubo un error al enviar el mensaje. Intenta de nuevo.</p>
                        <button class="notification-close">×</button>
                    </div>
                `;
                document.body.appendChild(notification);
                
                notification.querySelector('.notification-close').addEventListener('click', function() {
                    document.body.removeChild(notification);
                });
                
                setTimeout(() => {
                    if (document.body.contains(notification)) {
                        document.body.removeChild(notification);
                    }
                }, 5000);
                
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
            });
        });
    }
    
    // Efecto de aparición para el botón de WhatsApp
    const whatsappButton = document.querySelector('.whatsapp-float');
    if (whatsappButton) {
        setTimeout(() => {
            whatsappButton.classList.add('visible');
        }, 1500);
    }
});

// Esta función ya está definida al inicio del archivo y no necesita duplicarse
