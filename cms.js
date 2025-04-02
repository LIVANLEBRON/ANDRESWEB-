document.addEventListener('DOMContentLoaded', function() {
    // Cargar datos del CMS desde localStorage
    function loadCmsData() {
        loadServicios();
        loadPortafolio();
        loadTestimonios();
        loadSobreMi();
    }
    
    // Cargar servicios
    function loadServicios() {
        const serviciosSection = document.querySelector('#servicios .grid');
        if (!serviciosSection) return;
        
        const servicios = JSON.parse(localStorage.getItem('servicios'));
        if (!servicios) return;
        
        serviciosSection.innerHTML = '';
        
        servicios.forEach(servicio => {
            const servicioItem = document.createElement('div');
            servicioItem.className = 'grid-item';
            servicioItem.innerHTML = `
                <h3>${servicio.titulo}</h3>
                <p>${servicio.descripcion}</p>
            `;
            serviciosSection.appendChild(servicioItem);
        });
    }
    
    // Cargar portafolio
    function loadPortafolio() {
        const portafolioSection = document.querySelector('#portafolio .gallery');
        if (!portafolioSection) return;
        
        const portafolio = JSON.parse(localStorage.getItem('portafolio'));
        if (!portafolio) return;
        
        portafolioSection.innerHTML = '';
        
        portafolio.forEach(item => {
            const portafolioItem = document.createElement('div');
            portafolioItem.className = 'gallery-item';
            portafolioItem.innerHTML = `
                <img src="${item.imagen}" alt="${item.titulo}">
                <div class="overlay"><p>${item.titulo}</p></div>
            `;
            portafolioSection.appendChild(portafolioItem);
        });
    }
    
    // Cargar testimonios
    function loadTestimonios() {
        const testimoniosSection = document.querySelector('#testimonios .grid');
        if (!testimoniosSection) return;
        
        const testimonios = JSON.parse(localStorage.getItem('testimonios'));
        if (!testimonios) return;
        
        testimoniosSection.innerHTML = '';
        
        testimonios.forEach(testimonio => {
            const testimonioItem = document.createElement('div');
            testimonioItem.className = 'grid-item';
            testimonioItem.innerHTML = `
                <img src="${testimonio.imagen}" alt="${testimonio.nombre}" class="testimonial-img">
                <h3>${testimonio.titulo}</h3>
                <p>"${testimonio.texto}" - ${testimonio.nombre}</p>
            `;
            testimoniosSection.appendChild(testimonioItem);
        });
    }
    
    // Cargar información de Sobre Mí
    function loadSobreMi() {
        const sobreMiSection = document.querySelector('#sobre-mi');
        if (!sobreMiSection) return;
        
        const sobreMi = JSON.parse(localStorage.getItem('sobreMi'));
        if (!sobreMi) return;
        
        const sobreMiContent = sobreMiSection.querySelector('.card-content p');
        if (sobreMiContent) {
            sobreMiContent.textContent = sobreMi.texto;
        }
        
        const sobreMiAccent = sobreMiSection.querySelector('.card-accent');
        if (sobreMiAccent && sobreMi.imagen) {
            sobreMiAccent.style.backgroundImage = `url('${sobreMi.imagen}')`;
        }
    }
    
    // Inicializar
    loadCmsData();
});