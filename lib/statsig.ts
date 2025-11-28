import statsig from 'statsig-js';

type User = {
  userID: string;
  [key: string]: any;
};

// Inicializa el cliente con la clave de Statsig
export const initStatsig = async (userId?: string, userProperties?: Record<string, any>) => {
  try {
    // Configura el objeto de usuario
    const user: User = {
      userID: userId || 'anonymous-user',
      ...userProperties,
    };

    // Inicializa el cliente
    await statsig.initialize(
      process.env.NEXT_PUBLIC_STATSIG_CLIENT_KEY || 'client-test-key', // Usa una clave real en producción
      user
    );
    
    console.log('Statsig inicializado correctamente');
    return true;
  } catch (error) {
    console.error('Error al inicializar Statsig:', error);
    return false;
  }
};

// Función para verificar si una feature flag está activa
export const checkGate = (gateName: string): boolean => {
  try {
    return statsig.checkGate(gateName);
  } catch (error) {
    console.error(`Error al verificar gate ${gateName}:`, error);
    return false;
  }
};

// Función para obtener un experimento de Statsig
export const getExperiment = <T>(experimentName: string, defaultValue: T): T => {
  try {
    const experiment = statsig.getExperiment(experimentName);
    return experiment.get('value', defaultValue) as T;
  } catch (error) {
    console.error(`Error al obtener experimento ${experimentName}:`, error);
    return defaultValue;
  }
};

// Función para registrar un evento personalizado
export const logEvent = (eventName: string, value?: string | number, metadata?: Record<string, string> | null) => {
  try {
    statsig.logEvent(eventName, value, metadata || null);
  } catch (error) {
    console.error(`Error al registrar evento ${eventName}:`, error);
  }
};

// Función para actualizar el usuario
export const updateUser = (userId: string, userProperties?: Record<string, any>) => {
  try {
    const user: User = {
      userID: userId,
      ...userProperties,
    };
    
    statsig.updateUser(user);
    return true;
  } catch (error) {
    console.error('Error al actualizar el usuario en Statsig:', error);
    return false;
  }
};

// Función para limpiar Statsig (útil cuando el usuario cierra sesión)
export const shutdownStatsig = () => {
  try {
    statsig.shutdown();
    return true;
  } catch (error) {
    console.error('Error al cerrar Statsig:', error);
    return false;
  }
};
