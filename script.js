document.addEventListener('DOMContentLoaded', function() {
    AOS.init({ duration: 800, once: true });

    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const nombre = document.querySelector('#contactForm [name="nombre"]').value;
            const correo = document.querySelector('#contactForm [name="correo"]').value;
            const mensaje = document.querySelector('#contactForm [name="mensaje"]').value;

            if (!nombre || !correo || !mensaje) {
                alert('Por favor, completa todos los campos.');
                return;
            }

            const data = { nombre, correo, mensaje };
            fetch('https://script.google.com/macros/s/AKfycbxNP4un3yg8IitI_Wud-LMzr69KmzERYlOqfbJZyuy3dHTUEw14nEjkOF4PvSR2ZjG1aA/exec', {
                method: 'POST',
                body: JSON.stringify(data),
                headers: { 'Content-Type': 'application/json' }
            })
            .then(response => response.text())
            .then(result => {
                // Muestra el mensaje de éxito o error basado en la respuesta
                alert(result); // Aquí es donde mostrará el mensaje
                contactForm.reset();
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Hubo un error al enviar el mensaje. Intenta de nuevo.');
            });
        });
    }
});
