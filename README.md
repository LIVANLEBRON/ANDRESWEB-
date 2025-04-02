# Vintage Tapicería - Sitio Web

Este es el sitio web para Vintage Tapicería, un servicio profesional de tapicería y restauración de muebles.

## Estructura del Proyecto

- `index.html` - Página principal del sitio
- `contact.html` - Página de contacto
- `admin.html` - Panel de administración (protegido con contraseña)
- `style.css` - Estilos del sitio
- `script.js` - JavaScript principal
- `admin.js` - JavaScript para el panel de administración
- `cms.js` - Sistema de gestión de contenido
- `vercel.json` - Configuración para despliegue en Vercel

## Acceso al Panel de Administración

Para acceder al panel de administración:

1. Navega a `/admin.html`
2. Utiliza las siguientes credenciales:
   - Usuario: `admin`
   - Contraseña: `Vintage@2025!`

## Despliegue en Vercel

Este sitio está configurado para funcionar correctamente en Vercel. Para desplegarlo:

1. Crea una cuenta en [Vercel](https://vercel.com) si aún no tienes una
2. Conecta tu repositorio de GitHub, GitLab o Bitbucket que contenga este proyecto
3. Vercel detectará automáticamente la configuración en `vercel.json`
4. Haz clic en "Deploy" y el sitio estará disponible en unos minutos

## Características

- Diseño responsive adaptado a dispositivos móviles y de escritorio
- Modo oscuro/claro con persistencia de preferencia
- Panel de administración para gestionar contenido
- Formulario de contacto en página separada
- Optimizado para SEO

## Notas Importantes

- La autenticación del panel de administración expira después de 24 horas por seguridad
- El contenido se almacena en localStorage, lo que significa que es específico para cada navegador
- Para un sistema de gestión de contenido más robusto, considera implementar una base de datos en el futuro