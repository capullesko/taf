/* WEB 2/js/tiendaScript.js */

document.addEventListener('DOMContentLoaded', () => {

    // --------------------------------------------------------------------------
    // Lógica del Navbar (Menú Móvil) - Tomada de indexScript.js para consistencia
    // --------------------------------------------------------------------------
    const menuBtn = document.querySelector('.menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (menuBtn && navLinks) {
        menuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // --------------------------------------------------------------------------
    // Lógica para la redirección al checkout (Clic en artículo/botón)
    // --------------------------------------------------------------------------
    const checkoutURL = 'checkout.html';

    // Selecciona todas las tarjetas de producto
    const productCards = document.querySelectorAll('.card');
    
    productCards.forEach(card => {
        // 1. Redirigir al hacer clic en cualquier parte de la tarjeta de producto
        card.addEventListener('click', (event) => {
            event.preventDefault(); 
            window.location.href = checkoutURL;
        });
        
        // 2. Redirigir al hacer clic específicamente en el botón "Añadir al carrito"
        const addButton = card.querySelector('.btn-primary');
        if (addButton) {
            addButton.addEventListener('click', (event) => {
                event.stopPropagation(); // Evitar que el clic se propague a la tarjeta padre
                window.location.href = checkoutURL;
            });
        }
    });

    // 3. Lógica para el enlace "Añadir al carrito" en el diseño Bento
    const bentoLink = document.querySelector('#TEXTO a, #TEXTO2 a');
    if (bentoLink) {
        bentoLink.addEventListener('click', (event) => {
            event.preventDefault();
            window.location.href = checkoutURL;
        });
    }

});