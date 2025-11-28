import posthog from 'posthog-js';

/**
 * Inicializa PostHog con la API key y la URL del host configurados
 * @returns {boolean} True si PostHog se inicializó correctamente, false en caso contrario
 */
export const initPostHog = (): boolean => {
  try {
    const apiKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    const host = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com';
    
    if (!apiKey) {
      console.warn('⚠️ PostHog key no encontrada. El seguimiento no estará disponible.');
      return false;
    }
    
    // Inicializa PostHog
    posthog.init(apiKey, {
      api_host: host,
      // Opciones recomendadas para sitios de alto rendimiento
      capture_pageview: false, // Manejaremos esto manualmente para mayor control
      loaded: (posthog) => {
        console.log('✅ PostHog cargado correctamente');
      },
      autocapture: true, // Captura automática de clics y envíos de formularios
      persistence: 'localStorage',
      capture_pageleave: true,
      // Configura el muestreo si es necesario (por ejemplo, para sitios de alto tráfico)
      // sample_rate: 0.5, // Muestra solo el 50% del tráfico
    });
    
    return true;
  } catch (error) {
    console.error('❌ Error al inicializar PostHog:', error);
    return false;
  }
};

/**
 * Registra una visita de página en PostHog
 * @param {string} url - URL de la página vista
 * @param {object} properties - Propiedades adicionales a registrar
 */
export const capturePageview = (url: string, properties: Record<string, any> = {}) => {
  if (!posthog.__loaded) return;
  
  try {
    posthog.capture('$pageview', {
      current_url: url,
      ...properties,
    });
  } catch (error) {
    console.error('Error al registrar pageview en PostHog:', error);
  }
};

/**
 * Registra un evento personalizado en PostHog
 * @param {string} eventName - Nombre del evento
 * @param {object} properties - Propiedades del evento
 */
export const captureEvent = (eventName: string, properties: Record<string, any> = {}) => {
  if (!posthog.__loaded) return;
  
  try {
    posthog.capture(eventName, properties);
  } catch (error) {
    console.error(`Error al registrar evento '${eventName}' en PostHog:`, error);
  }
};

/**
 * Identifica a un usuario en PostHog
 * @param {string} userId - ID del usuario
 * @param {object} properties - Propiedades del usuario
 */
export const identifyUser = (userId: string, properties: Record<string, any> = {}) => {
  if (!posthog.__loaded) return;
  
  try {
    posthog.identify(userId, properties);
  } catch (error) {
    console.error('Error al identificar usuario en PostHog:', error);
  }
};

/**
 * Obtiene el ID de usuario distintivo actual de PostHog
 * @returns {string} ID distintivo del usuario actual
 */
export const getDistinctId = (): string => {
  if (!posthog.__loaded) return '';
  return posthog.get_distinct_id();
};

/**
 * Registra una conversión en un embudo
 * @param {string} funnelName - Nombre del embudo
 * @param {string} step - Paso del embudo
 * @param {object} properties - Propiedades adicionales
 */
export const captureFunnelStep = (funnelName: string, step: string, properties: Record<string, any> = {}) => {
  if (!posthog.__loaded) return;
  
  captureEvent(`${funnelName}_${step}`, {
    funnel: funnelName,
    step: step,
    ...properties
  });
};

/**
 * Desactiva el seguimiento para el usuario actual (para cumplimiento de privacidad)
 */
export const optOut = () => {
  if (!posthog.__loaded) return;
  // Usando una aserción de tipo para evitar errores
  (posthog as any).optOut();
};

/**
 * Reactiva el seguimiento para el usuario actual
 */
export const optIn = () => {
  if (!posthog.__loaded) return;
  // Usando una aserción de tipo para evitar errores
  (posthog as any).optIn();
};
