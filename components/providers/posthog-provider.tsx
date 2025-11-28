"use client";

import { useEffect, useState, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { initPostHog, capturePageview } from "@/lib/posthog";

interface PostHogProviderProps {
  children: React.ReactNode;
}

// Componente interno que usa hooks de cliente
function PostHogAnalytics({ children }: PostHogProviderProps) {
  const [isPostHogReady, setIsPostHogReady] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Inicializa PostHog una sola vez al montar el componente
  useEffect(() => {
    // Prevenir múltiples inicializaciones
    if (isPostHogReady) return;
    
    const initAnalytics = async () => {
      try {
        // Inicializa PostHog
        const success = initPostHog();
        
        if (success) {
          setIsPostHogReady(true);
          console.log("✅ PostHog inicializado correctamente");
        } else {
          console.warn("⚠️ PostHog no pudo inicializarse correctamente");
        }
      } catch (error) {
        console.error("❌ Error crítico al inicializar PostHog:", error);
      }
    };

    // Iniciar con un pequeño retraso para permitir que la página se cargue completamente
    const timerId = setTimeout(() => {
      initAnalytics();
    }, 100);

    // Limpiar el timeout si el componente se desmonta
    return () => clearTimeout(timerId);
  }, []);

  // Captura de pageview en cada cambio de ruta
  useEffect(() => {
    if (!isPostHogReady) return;

    // Construye la URL completa incluyendo los parámetros de búsqueda
    const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : "");
    
    // Captura el evento de pageview con información adicional
    capturePageview(url, {
      page_title: document.title,
      referrer: document.referrer || "direct",
      timestamp: new Date().toISOString(),
    });
    
  }, [pathname, searchParams, isPostHogReady]);

  return (
    <>
      {children}
    </>
  );
}

// Componente exportado que envuelve el componente interno con Suspense
export const PostHogProvider = ({ children }: PostHogProviderProps) => {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <PostHogAnalytics children={children} />
    </Suspense>
  );
};
