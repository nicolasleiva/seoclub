"use client";

import { useEffect, useState } from "react";
import { initStatsig, logEvent } from "@/lib/statsig";

interface StatsigProviderProps {
  children: React.ReactNode;
}

export const StatsigProvider = ({ children }: StatsigProviderProps) => {
  const [isStatsigReady, setIsStatsigReady] = useState(false);

  useEffect(() => {
    // Prevenir múltiples inicializaciones
    if (isStatsigReady) return;
    
    const initStats = async () => {
      try {
        // Información del navegador para mejores datos
        const userProperties = {
          userAgent: navigator.userAgent,
          language: navigator.language,
          screenWidth: window.innerWidth,
          screenHeight: window.innerHeight,
          referrer: document.referrer || "direct",
          timestamp: new Date().toISOString(),
          // Añadir pathname para seguimiento de páginas
          path: window.location.pathname
        };

        // Inicializa Statsig con propiedades del usuario
        const success = await initStatsig("anonymous-user", userProperties);
        
        if (success) {
          // Registra evento de inicialización exitosa
          logEvent("statsig_initialized", "1", { version: "1.0.0" });
          setIsStatsigReady(true);
          console.log("✅ Statsig inicializado correctamente");
        } else {
          console.warn("⚠️ Statsig no pudo inicializarse correctamente");
        }
      } catch (error) {
        console.error("❌ Error crítico al inicializar Statsig:", error);
        // Registrar el error para análisis
        try {
          // Intentar registrar el error incluso si la inicialización falló
          logEvent("statsig_initialization_error", "1", { 
            error: error instanceof Error ? error.message : "Unknown error" 
          });
        } catch (e) {
          console.error("No se pudo registrar el error de inicialización", e);
        }
      }
    };

    // Iniciar con un pequeño retraso para permitir que la página se cargue completamente
    const timerId = setTimeout(() => {
      initStats();
    }, 100);

    // Limpiar el timeout si el componente se desmonta
    return () => clearTimeout(timerId);
  }, []);

  return (
    <>
      {children}
    </>
  );
}
