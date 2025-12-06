/* js/checkout.js */

// Estado global del paso actual, inicializado en 1
window.currentStep = 1; 

// --------------------------------------------------------------------------
// Funciones de Navegación y Lógica Principal (Definidas globalmente)
// --------------------------------------------------------------------------

/**
 * Función interna para cambiar la vista de pasos y gestionar la visibilidad del resumen.
 * @param {number} newStep - El número del paso al que se desea navegar.
 */
function changeStep(newStep) {
    // Ocultar el paso actual
    const currentCard = document.getElementById(`step-${window.currentStep}`);
    if (currentCard) currentCard.classList.add('hidden');
    
    // Desactivar el indicador de paso actual
    const currentIndicator = document.getElementById(`indicator-${window.currentStep}`);
    if (currentIndicator) currentIndicator.classList.remove('active');

    // Mostrar el nuevo paso
    const newCard = document.getElementById(`step-${newStep}`);
    if (newCard) newCard.classList.remove('hidden');

    // Activar el indicador de paso nuevo (si está entre 1 y 5)
    if (newStep >= 1 && newStep <= 5) {
        const newIndicator = document.getElementById(`indicator-${newStep}`);
        if (newIndicator) newIndicator.classList.add('active');
    }

    // Obtener el contenedor principal para la disposición en dos columnas
    const mainContainer = document.querySelector('.checkout-pasos'); 
    const summaryCard = document.querySelector('.order-summary-card');

    // Manejar visibilidad y layout del resumen del pedido (Solo visible en el Paso 5)
    if (summaryCard) {
        if (newStep === 5) { // Solo para el paso 5
            summaryCard.classList.remove('hidden');
            if (mainContainer) mainContainer.classList.add('step-5-active'); // Activar diseño de dos columnas
        } else {
            summaryCard.classList.add('hidden'); 
            if (mainContainer) mainContainer.classList.remove('step-5-active'); // Desactivar diseño de dos columnas
        }
    }

    // Actualizar el paso actual
    window.currentStep = newStep;
}

/**
 * Función de simulación de logueo.
 */
function loginAndContinue() {
    const correo = document.getElementById('login-correo').value.trim();
    const pass = document.getElementById('login-pass').value.trim();

    if (correo && pass) {
        alert('Sesión Iniciada (Simulación). Continuar al Paso 2.');
        // Precargar datos en el Paso 2 (simulado)
        document.getElementById('contact-nombre').value = "Usuario Registrado";
        document.getElementById('contact-correo').value = correo;
        nextStep(2);
    } else {
        alert('Por favor, ingresa tu correo y contraseña.');
    }
}

/**
 * Función principal para navegar al paso siguiente, con validación y autocompletado.
 * @param {number} next - El número del paso siguiente.
 */
function nextStep(next) {
    
    // Lógica para auto-rellenar como invitado (Paso 1 -> Paso 2)
    if (window.currentStep === 1 && next === 2) {
        // Autocompletado con usuario ramdon/ejemplo verificado
        document.getElementById('contact-nombre').value = "Invitado TaF";
        document.getElementById('contact-correo').value = "invitado-ramdon@tafanime.com";
        // No alertamos para una experiencia de usuario más fluida
    }
    
    // Validación Paso 2 (Información de Contacto)
    if (window.currentStep === 2) {
        const nombre = document.getElementById('contact-nombre').value.trim();
        const correo = document.getElementById('contact-correo').value.trim();

        if (!nombre || !correo) {
            alert('Por favor, completa Nombre y Correo.');
            return;
        }
    }
    
    // Validación Paso 3 (Dirección de Envío)
    if (window.currentStep === 3) {
        const direccion = document.getElementById('direccion').value.trim();
        const ciudad = document.getElementById('ciudad').value.trim();

        if (!direccion || !ciudad) {
            alert('Por favor, completa la Dirección de Envío.');
            return;
        }
    }

    // Validación Paso 4 (Información de Pago)
    if (window.currentStep === 4) {
        const paymentRadio = document.querySelector('input[name="payment"]:checked');
        
        // Verifica si se seleccionó un método de pago
        if (!paymentRadio) {
            alert('Por favor, selecciona un Método de Pago.');
            return;
        }
        
        // Si el método seleccionado es Tarjeta de Crédito/Débito, valida los campos
        if (paymentRadio.value === 'card') {
            const cardNumber = document.getElementById('card-number').value.trim();
            const expiry = document.getElementById('expiry').value.trim();
            const cvv = document.getElementById('cvv').value.trim();

            // Validación simple de que los campos no estén vacíos
            if (!cardNumber || !expiry || !cvv) {
                alert('Por favor, completa todos los detalles de la Tarjeta (Número, Fecha de Exp. y CVV).');
                return; // Detiene la navegación si faltan datos de la tarjeta
            }

            // Validación de longitud y tipo: El número de tarjeta debe tener exactamente 16 dígitos numéricos.
            if (cardNumber.length !== 16 || isNaN(cardNumber)) {
                alert('El Número de Tarjeta debe contener exactamente 16 dígitos numéricos.');
                return;
            }
        }
        // Para otros métodos (transferencia, PayPal), no se requiere validación adicional en este punto
    }

    // Actualizar resumen en Paso 5 antes de mostrarlo
    if (next === 5) {
        updateReviewStep();
    }

    changeStep(next);
}

/**
 * Función para navegar al paso anterior.
 * @param {number} prev - El número del paso anterior.
 */
function prevStep(prev) {
    changeStep(prev);
}

/**
 * Función para actualizar los datos del Paso 5 (Revisión).
 */
function updateReviewStep() {
    const nombre = document.getElementById('contact-nombre').value.trim() || 'No Proporcionado';
    const direccion = `${document.getElementById('direccion').value.trim() || 'No Proporcionada'}, ${document.getElementById('ciudad').value.trim() || ''}, ${document.getElementById('pais').value.trim() || ''}`;
    const shippingRadio = document.querySelector('input[name="shipping"]:checked');
    const paymentRadio = document.querySelector('input[name="payment"]:checked');

    const shippingType = shippingRadio.value === 'express' ? 'Express - ¥1.700' : 'Estándar - ¥800';
    
    let paymentMethod = 'Tarjeta (Terminada en XXXX)';
    // Si el método es tarjeta y tiene datos, podríamos simular las XXXX aquí.
    if (paymentRadio.value === 'card') {
        const cardNumber = document.getElementById('card-number').value.trim();
        if (cardNumber.length >= 4) {
            // Usa los últimos 4 dígitos reales de la simulación
            paymentMethod = `Tarjeta (Terminada en ${cardNumber.slice(-4)})`;
        }
    } else if (paymentRadio.value === 'paypal') {
        paymentMethod = 'PayPal';
    } else if (paymentRadio.value === 'bank') {
        paymentMethod = 'Transferencia Bancaria';
    }
    
    // Cálculo correcto del total basado en el envío seleccionado.
    // Subtotal fijo en el HTML es ¥3.300 (1200 + 900 + 1200)
    const baseTotal = 3300; 
    const shippingCost = shippingRadio.value === 'express' ? 1700 : 800;
    const finalTotal = `¥${baseTotal + shippingCost}`;


    document.getElementById('conf-nombre').querySelector('strong').textContent = nombre;
    document.getElementById('conf-direccion').querySelector('strong').textContent = direccion;
    document.getElementById('conf-envio').querySelector('strong').textContent = shippingType;
    document.getElementById('conf-pago').querySelector('strong').textContent = paymentMethod;
    document.getElementById('conf-total').querySelector('strong').textContent = finalTotal;
    
    // Actualizar el resumen global
    const totalFinalStrong = document.querySelector('.order-summary-card .total-final p:last-child strong');
    if (totalFinalStrong) totalFinalStrong.textContent = finalTotal;
    
    // Actualizar el costo de envío en el resumen
    const envioLine = document.querySelector('.order-summary-card .total-line:nth-child(2) p:last-child');
    if (envioLine) envioLine.textContent = `¥${shippingCost}`;
    
    // Actualizar la descripción del envío
    const envioDesc = document.querySelector('.order-summary-card .total-line:nth-child(2) p:first-child');
    if (envioDesc) envioDesc.innerHTML = `Envío (${shippingRadio.value === 'express' ? 'Express' : 'Estándar'}):`;
}


/**
 * Función para finalizar el pedido (simulación de procesamiento y éxito).
 */
function finalizeOrder() {
    const finalMessageCard = document.getElementById('step-6');
    const content = finalMessageCard.querySelector('.checkout-content');
    
    // 1. Mostrar pantalla de procesamiento (Paso 6)
    changeStep(6);
    content.innerHTML = `
        <div class="processing-content">
            <i class="fas fa-spinner"></i>
            <h3>PROCESANDO PAGO...</h3>
            <p class="final-text">Tu transacción está siendo verificada. Por favor, no cierres esta ventana.</p>
        </div>
    `;

    // 2. Simular un retraso de 3 segundos para el procesamiento
    setTimeout(() => {
    
        content.innerHTML = `
            <h3 style="text-align: center;">¡COMPRA EXITOSA!</h3>
            <p>Gracias por tu compra. Tu pedido <strong>#TAF2025-74852</strong> ha sido procesado con éxito y se enviará a la brevedad.</p>
            <p class="final-text" style="text-align: center; width:100%">Revisa el estado de tu orden en el Historial de Pedidos.</p>
            <div class="actions" style="justify-content: center;">
                <a href="index.html" class="cta-button">VOLVER AL INICIO</a>
            </div>
        `;
        finalMessageCard.style.border = '2px solid #eadbae';
    }, 3000); // 3 segundos de simulación
}


// --------------------------------------------------------------------------
// Lógica que requiere que el DOM esté cargado (Eventos, listeners, inicialización)
// --------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {

    // Lógica del Navbar (Hamburger Menu)
    const menuBtn = document.querySelector('.menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (menuBtn && navLinks) {
        menuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = menuBtn.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    // Lógica del Acordeón para el Historial de Órdenes (Usado en historial.html)
    const accordionToggles = document.querySelectorAll('.accordion-toggle');

    accordionToggles.forEach(toggle => {
        toggle.addEventListener('click', (event) => {
            const targetId = event.currentTarget.getAttribute('data-target');
            const targetDetails = document.getElementById(targetId);
            
            if (targetDetails) {
                const isHidden = targetDetails.classList.contains('hidden');

                // Cerrar todos los demás detalles abiertos
                document.querySelectorAll('.order-details').forEach(detail => {
                    if (detail.id !== targetId && !detail.classList.contains('hidden')) {
                        detail.classList.add('hidden');
                        const associatedToggle = document.querySelector(`[data-target="${detail.id}"]`);
                        if (associatedToggle) {
                            associatedToggle.setAttribute('aria-expanded', 'false');
                        }
                    }
                });
                
                // Abrir/Cerrar el detalle actual
                if (isHidden) {
                    targetDetails.classList.remove('hidden');
                    event.currentTarget.setAttribute('aria-expanded', 'true');
                } else {
                    targetDetails.classList.add('hidden');
                    event.currentTarget.setAttribute('aria-expanded', 'false');
                }
            }
        });
    });

    // Inicialización de la visibilidad de los detalles de la tarjeta y radios de pago/envío
    document.querySelectorAll('input[name="payment"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            const cardDetails = document.querySelector('.card-details');
            if (e.target.value === 'card') {
                // Muestra los campos de tarjeta solo si se selecciona 'card'
                if (cardDetails) cardDetails.classList.remove('hidden');
            } else {
                // Oculta los campos de tarjeta para otros métodos
                if (cardDetails) cardDetails.classList.add('hidden');
            }
        });
    });
    
    document.querySelectorAll('input[name="shipping"]').forEach(radio => {
        radio.addEventListener('change', () => {
            // Recalcula el total del resumen en la barra lateral cuando cambia el envío
            const subtotal = 3300; 
            const shippingCost = radio.value === 'express' ? 1700 : 800;
            const finalTotal = `¥${subtotal + shippingCost}`;
            const shippingText = radio.value === 'express' ? 'Envío (Express):' : 'Envío (Estándar):';
            
            const totalFinalStrong = document.querySelector('.order-summary-card .total-final p:last-child strong');
            if (totalFinalStrong) totalFinalStrong.textContent = finalTotal;
            
            const totalLineEnvioP2 = document.querySelector('.order-summary-card .total-line:nth-child(2) p:last-child');
            if (totalLineEnvioP2) totalLineEnvioP2.textContent = `¥${shippingCost}`;
            
            const totalLineEnvioP1 = document.querySelector('.order-summary-card .total-line:nth-child(2) p:first-child');
            if (totalLineEnvioP1) totalLineEnvioP1.textContent = shippingText;
        });
    });

    // Ocultar los detalles de la tarjeta al inicio si no está seleccionado el pago con tarjeta
    const initialPaymentRadio = document.querySelector('input[name="payment"]:checked');
    if (initialPaymentRadio && initialPaymentRadio.value !== 'card') {
        const cardDetails = document.querySelector('.card-details');
        if (cardDetails) cardDetails.classList.add('hidden');
    }
    
    // Al cargar la página, asegura que el resumen está oculto si el paso es menor a 5
    const summaryCard = document.querySelector('.order-summary-card');
    if (summaryCard && window.currentStep < 5) {
        summaryCard.classList.add('hidden');
    }

});