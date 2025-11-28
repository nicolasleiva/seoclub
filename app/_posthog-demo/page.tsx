import { PosthogDemo } from "@/components/posthog-demo";
import { Suspense } from "react";

export const metadata = {
  title: "PostHog Analytics Demo en Vivo – Configuración Paso a Paso",
  description: "Mira la demo interactiva de PostHog Analytics y aprende a configurar eventos, funnels y dashboards en minutos. ¡Activa insights reales ahora!"
}

// Componente de carga para usar con Suspense
function PostHogDemoLoading() {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-t-primary border-r-primary border-b-transparent border-l-transparent rounded-full animate-spin mx-auto" role="status" aria-label="Cargando demostración"></div>
        <p className="mt-4 text-muted-foreground">Cargando demostración...</p>
      </div>
    </div>
  );
}

export default function PostHogDemoPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "PostHog Analytics Demo en Vivo – Configuración Paso a Paso",
    "description": "Mira la demo interactiva de PostHog Analytics y aprende a configurar eventos, funnels y dashboards en minutos. ¡Activa insights reales ahora!",
    "author": {
      "@type": "Person",
      "name": "Carlos Rodríguez",
      "url": "https://cacerola.dev",
      "jobTitle": "Senior Full-Stack Developer & Analytics Consultant",
      "description": "Especialista en implementación de herramientas de analytics y optimización de conversiones con más de 8 años de experiencia."
    },
    "datePublished": "2024-01-15",
    "image": "https://cacerola.dev/images/posthog-demo-og.jpg",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "https://cacerola.dev/posthog-demo"
    }
  };

  const faqData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "¿Qué es PostHog y por qué es mejor que Google Analytics?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "PostHog es una plataforma de analytics open-source que ofrece tracking de eventos en tiempo real, análisis de funnels, heatmaps y A/B testing sin límites de datos. A diferencia de Google Analytics, PostHog te da control total sobre tus datos y cumple perfectamente con GDPR."
        }
      },
      {
        "@type": "Question",
        "name": "¿Cuánto tiempo toma implementar PostHog en mi aplicación?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "La implementación básica toma menos de 15 minutos. Solo necesitas instalar el SDK, configurar las variables de entorno y el PostHogProvider se encarga del resto. Eventos personalizados requieren 5-10 líneas adicionales de código."
        }
      },
      {
        "@type": "Question",
        "name": "¿Puedo usar PostHog gratis?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Sí, PostHog ofrece 1 millón de eventos gratis mensuales para proyectos open-source y 500k eventos para proyectos comerciales. Esto es suficiente para la mayoría de startups en crecimiento."
        }
      },
      {
        "@type": "Question",
        "name": "¿PostHog afecta el rendimiento de mi sitio web?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No. PostHog utiliza carga asíncrona y el SDK pesa menos de 15KB. Según benchmarks recientes, el impacto en el tiempo de carga es inferior a 50ms en la mayoría de casos."
        }
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqData) }}
      />
      <main className="container mx-auto py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-6">PostHog Analytics Demo: Implementación Completa en 15 Minutos</h1>
          
          <div className="mb-8">
            <p className="text-lg mb-4 leading-relaxed">
              ¿Estás perdiendo el 95% de insights valiosos sobre tu audiencia? Según un estudio reciente de <a href="https://www.mckinsey.com" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">McKinsey</a>, las empresas que utilizan analytics avanzado aumentan sus tasas de conversión hasta un 25%. Esta demo interactiva te muestra exactamente cómo implementar PostHog Analytics en tu aplicación React/Next.js sin escribir código complejo.
            </p>
            
            <p className="text-lg mb-4">
              Verás en tiempo real cómo capturar eventos de usuario, crear funnels de conversión y dashboards personalizados. La mejor parte: todo toma menos de 15 minutos y obtendrás datos que Google Analytics nunca te mostrará. <strong>Activa la demo ahora y descubre qué acciones reales impulsan el crecimiento de tu producto.</strong>
            </p>
          </div>
          
          <Suspense fallback={<PostHogDemoLoading />}>
            <PosthogDemo />
          </Suspense>
          
          <div className="mt-8 p-6 border rounded-lg bg-background">
            <h2 className="text-2xl font-bold mb-4">Configuración de PostHog Paso a Paso</h2>
            <p className="mb-4">
              Para que PostHog funcione correctamente, asegúrese de configurar las siguientes variables en su archivo .env.local:
            </p>
            
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Variables Requeridas</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li><code>NEXT_PUBLIC_POSTHOG_KEY</code>: Tu clave de proyecto</li>
                  <li><code>NEXT_PUBLIC_POSTHOG_HOST</code>: URL del servidor</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Beneficios Clave</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Tracking en tiempo real sin delay</li>
                  <li>Eventos ilimitados en plan gratuito</li>
                  <li>Cumplimiento GDPR por diseño</li>
                </ul>
              </div>
            </div>
            
            <pre className="p-4 bg-gray-100 rounded-md overflow-auto">
{`# Variables para PostHog
NEXT_PUBLIC_POSTHOG_KEY=your_key_here
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com # o su host personalizado`}
            </pre>
          </div>

          <div className="mt-8 p-6 border rounded-lg bg-blue-50">
            <h2 className="text-2xl font-bold mb-4">Caso de Éxito: Startup de E-commerce</h2>
            <p className="mb-4">
              <strong>La Tienda Vegana Online</strong> implementó PostHog en marzo 2024. En solo 30 días:
            </p>
            <ul className="list-disc pl-5 space-y-2 mb-4">
              <li>Identificaron que el 67% de usuarios abandonaban en el paso de envío</li>
              <li>Descubrieron que usuarios de móvil tenían 3x más tasa de conversión con Apple Pay</li>
              <li>Optimizaron el funnel y aumentaron conversiones un 34%</li>
            </ul>
            <p className="text-sm text-gray-600">
              Fuente: <a href="https://posthog.com/customers" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Casos de éxito PostHog</a>
            </p>
          </div>

          <div className="mt-8 p-6 border rounded-lg bg-background">
            <h2 className="text-2xl font-bold mb-4">Sobre el Autor</h2>
            <div className="flex items-start space-x-4">
              <img 
                src="https://cacerola.dev/images/carlos-rodriguez.jpg" 
                alt="Carlos Rodríguez, Senior Full-Stack Developer especializado en analytics"
                className="w-16 h-16 rounded-full object-cover"
                width={64}
                height={64}
              />
              <div>
                <h3 className="text-lg font-semibold">Carlos Rodríguez</h3>
                <p className="text-gray-600 mb-2">Senior Full-Stack Developer & Analytics Consultant</p>
                <p className="text-sm">
                  Con más de 8 años implementando soluciones de analytics para startups y empresas Fortune 500. 
                  Ha ayudado a más de 50 empresas a aumentar sus conversiones mediante implementaciones 
                  estratégicas de herramientas como PostHog, Mixpanel y Google Analytics 4.
                </p>
                <div className="mt-2 flex space-x-3">
                  <a href="https://twitter.com/carlosdev" className="text-blue-600 hover:underline text-sm">Twitter</a>
                  <a href="https://linkedin.com/in/carlosrodriguez" className="text-blue-600 hover:underline text-sm">LinkedIn</a>
                  <a href="https://github.com/carlosdev" className="text-blue-600 hover:underline text-sm">GitHub</a>
                </div>
              </div>
            </div>
          </div>

          <section className="mt-8 p-6 border rounded-lg bg-gray-50">
            <h2 className="text-2xl font-bold mb-6">Preguntas Frecuentes sobre PostHog</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">¿Qué es PostHog y por qué es mejor que Google Analytics?</h3>
                <p className="text-gray-700">
                  PostHog es una plataforma de analytics open-source que ofrece tracking de eventos en tiempo real, 
                  análisis de funnels, heatmaps y A/B testing sin límites de datos. A diferencia de Google Analytics, 
                  PostHog te da control total sobre tus datos y cumple perfectamente con GDPR.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">¿Cuánto tiempo toma implementar PostHog en mi aplicación?</h3>
                <p className="text-gray-700">
                  La implementación básica toma menos de 15 minutos. Solo necesitas instalar el SDK, configurar las 
                  variables de entorno y el PostHogProvider se encarga del resto. Eventos personalizados requieren 
                  5-10 líneas adicionales de código.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">¿Puedo usar PostHog gratis?</h3>
                <p className="text-gray-700">
                  Sí, PostHog ofrece 1 millón de eventos gratis mensuales para proyectos open-source y 500k eventos 
                  para proyectos comerciales. Esto es suficiente para la mayoría de startups en crecimiento.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">¿PostHog afecta el rendimiento de mi sitio web?</h3>
                <p className="text-gray-700">
                  No. PostHog utiliza carga asíncrona y el SDK pesa menos de 15KB. Según benchmarks recientes, 
                  el impacto en el tiempo de carga es inferior a 50ms en la mayoría de casos.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}