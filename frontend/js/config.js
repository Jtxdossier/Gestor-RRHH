// Configuración automática de entorno
(function() {
    // Detectar si estamos en local o en producción
    const isLocal = window.location.hostname === 'localhost' || 
                    window.location.hostname === '127.0.0.1' ||
                    window.location.hostname.includes('192.168.');
    
    // Configuración
    window.API_CONFIG = {
        // URL base de la API
        BASE_URL: isLocal ? 'https://hr-system-backend-n8xk.onrender.com/api' : 'https://hr-system-api.onrender.com/api',
        
        // Entorno
        ENV: isLocal ? 'development' : 'production',
        
        // Tiempo de espera para requests (ms)
        TIMEOUT: isLocal ? 10000 : 30000,
        
        // Intentos de reconexión
        RETRY_ATTEMPTS: isLocal ? 1 : 3
    };
    
    console.log(`🌍 Entorno: ${window.API_CONFIG.ENV}`);
    console.log(`🔗 API: ${window.API_CONFIG.BASE_URL}`);
    
    // Función para hacer requests
    window.makeRequest = async function(endpoint, options = {}) {
        const url = window.API_CONFIG.BASE_URL + endpoint;
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), window.API_CONFIG.TIMEOUT);
        
        try {
            const response = await fetch(url, {
                ...options,
                signal: controller.signal,
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                }
            });
            
            clearTimeout(timeoutId);
            return await response.json();
        } catch (error) {
            clearTimeout(timeoutId);
            throw error;
        }
    };
})();