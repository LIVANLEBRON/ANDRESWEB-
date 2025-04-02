// Importar las funciones de Firebase
import { getAllData } from "./firebase-config.js";

document.addEventListener('DOMContentLoaded', function() {
    // Cargar datos del CMS desde Firebase
    async function loadCmsData() {
        await Promise.all([
            loadServicios(),
            loadPortafolio(),
            loadTestimonios(),
            loadSobreMi()
        ]);
    }
    
    // Cargar servicios desde Firebase
    async function loadServicios() {
        const serviciosSection = document.querySelector('#servicios .grid');
        if (!serviciosSection) return;
        
        const result = await getAllData('servicios');
        if (!result.success) {
            console.error('Error al cargar servicios:', result.error);
            return;
        }
        
        const servicios = result.data;
        if (!servicios || servicios.length === 0) return;
        
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
    
    // Cargar portafolio desde Firebase
    async function loadPortafolio() {
        const portafolioSection = document.querySelector('#portafolio .gallery');
        if (!portafolioSection) return;
        
        const result = await getAllData('portafolio');
        if (!result.success) {
            console.error('Error al cargar portafolio:', result.error);
            return;
        }
        
        const portafolio = result.data;
        if (!portafolio || portafolio.length === 0) return;
        
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
    
    // Cargar testimonios desde Firebase
    async function loadTestimonios() {
        const testimoniosSection = document.querySelector('#testimonios .grid');
        if (!testimoniosSection) return;
        
        const result = await getAllData('testimonios');
        if (!result.success) {
            console.error('Error al cargar testimonios:', result.error);
            return;
        }
        
        const testimonios = result.data;
        if (!testimonios || testimonios.length === 0) return;
        
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
    
    // Cargar información de Sobre Mí desde Firebase
    async function loadSobreMi() {
        const sobreMiSection = document.querySelector('#sobre-mi');
        if (!sobreMiSection) return;
        
        const result = await getAllData('sobreMi');
        if (!result.success) {
            console.error('Error al cargar sobre mí:', result.error);
            return;
        }
        
        // Como sobreMi es un solo documento, tomamos el primero si existe
        const sobreMiArray = result.data;
        if (!sobreMiArray || sobreMiArray.length === 0) return;
        
        const sobreMi = sobreMiArray[0];
        
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
    loadCmsData().catch(error => {
        console.error('Error al cargar datos del CMS:', error);
    });
});