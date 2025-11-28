import { PosthogDemo } from "@/components/posthog-demo";
import { Suspense } from "react";

export const metadata = {
  title: "PostHog Analytics Demo en Vivo – Configura y Prueba Gratis",
  description: "Ve cómo funciona PostHog en tiempo real: captura eventos, funnels y dashboards sin código. Configura en 2 min y empieza a optimizar tu producto hoy."
}


// Componente de carga para usar con Suspense
function PostHogDemoLoading() {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-t-primary border-r-primary border-b-transparent border-l-transparent rounded-full animate-spin mx-auto"></div>
        <p className="mt-4 text-muted-foreground">Cargando demostración...</p>
      </div>
    </div>
  );
}

export default function PostHogDemoPage() {
  return (
    <main className="container mx-auto py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">PostHog Analytics Demo</h1>
        
        <div className="mb-8">
          <p className="text-lg mb-4">
            Esta página muestra la integración de PostHog con la aplicación Cacerola Landing.
            El seguimiento de páginas se realiza automáticamente a través del PostHogProvider.
          </p>
          
          <p className="text-lg mb-4">
            Además de capturar automáticamente las visitas a páginas, PostHog puede rastrear eventos personalizados
            como los que se muestran en el siguiente componente.
          </p>
        </div>
        
        <Suspense fallback={<PostHogDemoLoading />}>
          <PosthogDemo />
        </Suspense>
        
        <div className="mt-8 p-6 border rounded-lg bg-background">
          <h2 className="text-2xl font-bold mb-4">Configuración de PostHog</h2>
          <p className="mb-4">
            Para que PostHog funcione correctamente, asegúrese de configurar las siguientes variables en su archivo .env.local:
          </p>
          
          <pre className="p-4 bg-gray-100 rounded-md overflow-auto">
{`# Variables para PostHog
NEXT_PUBLIC_POSTHOG_KEY=your_key_here
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com # o su host personalizado`}
          </pre>
        </div>
      </div>
    </main>
  );
}
