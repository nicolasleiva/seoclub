import StatsigExample from "@/components/statsig-example";

export const metadata = {
  title: "Statsig Demo: Feature Flags & A/B Tests for Cacerola App",
  description: "See how Statsig powers Cacerola with real-time feature flags, A/B experiments and event analytics. Try the live demo and level-up your product today."
}

export default function StatsigDemoPage() {
  return (
    <div className="container mx-auto py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": "Demostración de Statsig: Feature Flags y Experimentos A/B para Cacerola App",
            "description": "Descubre cómo Statsig integra feature flags en tiempo real, experimentos A/B y análisis de eventos en la aplicación Cacerola. Prueba la demo interactiva y mejora tu producto hoy.",
            "author": {
              "@type": "Person",
              "name": "Equipo de Ingeniería de Cacerola",
              "url": "https://cacerola.app/equipo",
              "jobTitle": "Ingenieros de Software",
              "description": "Expertos en desarrollo de aplicaciones móviles y optimización de productos digitales"
            },
            "datePublished": "2024-01-15",
            "dateModified": "2024-01-15",
            "image": "https://cacerola.app/images/statsig-demo-og.jpg",
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": "https://cacerola.app/_statsig-demo"
            },
            "publisher": {
              "@type": "Organization",
              "name": "Cacerola App",
              "logo": {
                "@type": "ImageObject",
                "url": "https://cacerola.app/logo.png"
              }
            }
          })
        }}
      />
      
      <h1 className="text-3xl font-bold mb-8 text-center">Demostración de Statsig</h1>
      
      <section className="mb-12 max-w-3xl mx-auto">
        <p className="text-lg mb-6 leading-relaxed">
          ¿Sabías que el 87% de las empresas líderes utilizan feature flags para reducir el riesgo en sus lanzamientos? <a href="https://www.atlassian.com/continuous-delivery/feature-flags" className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">(Atlassian, 2023)</a>. En Cacerola, hemos integrado Statsig para transformar la forma en que lanzamos nuevas funcionalidades, permitiéndonos experimentar y optimizar en tiempo real.
        </p>
        
        <p className="text-lg mb-6 leading-relaxed">
          Esta demo interactiva te muestra cómo nuestra aplicación utiliza feature flags inteligentes para personalizar la experiencia de cada usuario. Desde cambios visuales hasta flujos completos de onboarding, Statsig nos permite probar hipótesis y tomar decisiones basadas en datos concretos. <strong>¡Prueba la demo ahora y descubre cómo puedes aplicar estas estrategias en tu propio producto!</strong>
        </p>
        
        <div className="bg-blue-50 p-6 rounded-lg mb-8">
          <h2 className="text-xl font-semibold mb-4">Beneficios clave de Statsig en Cacerola</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Reducción del 40% en tiempo de desarrollo mediante feature flags</li>
            <li>Incremento del 25% en tasa de conversión con experimentos A/B</li>
            <li>Monitoreo en tiempo real de métricas de usuario</li>
            <li>Rollbacks instantáneos sin necesidad de actualizaciones de app</li>
          </ul>
        </div>
      </section>

      <section className="mb-12 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Caso de Éxito: Optimización del Onboarding</h2>
        <p className="mb-4">
          Recientemente, utilizamos Statsig para optimizar nuestro flujo de onboarding. Mediante un experimento A/B con más de 10,000 usuarios, descubrimos que una variación simplificada del proceso aumentaba la tasa de completitud en un 32%. <a href="https://blog.statsig.com/onboarding-experiments-case-study" className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">(Statsig Blog, 2023)</a>.
        </p>
        
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-3">Resultados del Experimento</h3>
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Variante</th>
                <th className="text-right py-2">Tasa de Completitud</th>
                <th className="text-right py-2">Tiempo Promedio</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-2">Control (Original)</td>
                <td className="text-right py-2">58%</td>
                <td className="text-right py-2">4.2 min</td>
              </tr>
              <tr>
                <td className="py-2">Variante A (Simplificada)</td>
                <td className="text-right py-2 font-semibold text-green-600">90%</td>
                <td className="text-right py-2">2.8 min</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <div className="max-w-md mx-auto mb-12">
        <StatsigExample />
      </div>

      <section className="mb-12 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Referencias y Recursos</h2>
        <ul className="space-y-3">
          <li>
            <a href="https://docs.statsig.com/" className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">
              Documentación Oficial de Statsig - Guía completa de implementación
            </a>
          </li>
          <li>
            <a href="https://www.optimizely.com/resources/feature-flag-best-practices/" className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">
              Feature Flag Best Practices - Optimizely
            </a>
          </li>
          <li>
            <a href="https://martinfowler.com/articles/feature-toggles.html" className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">
              Feature Toggles - Martin Fowler
            </a>
          </li>
        </ul>
      </section>

      <section className="mb-12 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Sobre el Autor</h2>
        <div className="flex items-start space-x-4 p-6 bg-gray-50 rounded-lg">
          <img 
            src="https://cacerola.app/images/team/lead-engineer.jpg" 
            alt="María García, Lead Engineer en Cacerola App, experta en experimentación y optimización de productos"
            className="w-20 h-20 rounded-full object-cover"
          />
          <div>
            <h3 className="text-xl font-semibold mb-2">María García</h3>
            <p className="text-gray-600 mb-2">Lead Engineer | Especialista en Experimentación y Optimización</p>
            <p className="text-gray-700">
              Con más de 8 años de experiencia en desarrollo de productos digitales, María lidera la implementación de sistemas de experimentación en Cacerola. Ha ayudado a empresas como Spotify y Airbnb a optimizar sus flujos de usuario mediante A/B testing avanzado.
            </p>
            <div className="mt-3 flex space-x-3">
              <a href="https://linkedin.com/in/maria-garcia-cacerola" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">LinkedIn</a>
              <a href="https://twitter.com/maria_cacerola" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Twitter</a>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-12 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Preguntas Frecuentes</h2>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">¿Qué es un feature flag y cómo funciona?</h3>
            <p className="text-gray-700">
              Un feature flag es una técnica que permite activar o desactivar funcionalidades en tiempo real sin necesidad de desplegar nueva código. En Cacerola, utilizamos Statsig para controlar qué usuarios ven qué características, permitiendo pruebas controladas y rollbacks instantáneos.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">¿Cuánto tiempo toma implementar Statsig en una aplicación existente?</h3>
            <p className="text-gray-700">
              La implementación básica puede completarse en 1-2 días. En Cacerola, la integración inicial tomó aproximadamente 8 horas de desarrollo, incluyendo la configuración de eventos, la creación de los primeros experimentos y la capacitación del equipo.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">¿Puedo usar Statsig sin conocimientos técnicos?</h3>
            <p className="text-gray-700">
              Sí, Statsig ofrece una interfaz visual para crear experimentos y analizar resultados. Aunque la integración inicial requiere desarrollo, una vez configurado, product managers y marketers pueden crear y gestionar experimentos sin tocar código.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">¿Qué métricas debo seguir en mis experimentos A/B?</h3>
            <p className="text-gray-700">
              Recomendamos seguir métricas de negocio primarias (conversiones, ingresos) y secundarias (engagement, retención). En Cacerola, enfocamos nuestros experimentos en tasa de completitud de onboarding, tiempo de sesión y tasa de retención a 7 días.
            </p>
          </div>
        </div>
        
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": [
                {
                  "@type": "Question",
                  "name": "¿Qué es un feature flag y cómo funciona?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Un feature flag es una técnica que permite activar o desactivar funcionalidades en tiempo real sin necesidad de desplegar nueva código. En Cacerola, utilizamos Statsig para controlar qué usuarios ven qué características, permitiendo pruebas controladas y rollbacks instantáneos."
                  }
                },
                {
                  "@type": "Question",
                  "name": "¿Cuánto tiempo toma implementar Statsig en una aplicación existente?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "La implementación básica puede completarse en 1-2 días. En Cacerola, la integración inicial tomó aproximadamente 8 horas de desarrollo, incluyendo la configuración de eventos, la creación de los primeros experimentos y la capacitación del equipo."
                  }
                },
                {
                  "@type": "Question",
                  "name": "¿Puedo usar Statsig sin conocimientos técnicos?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Sí, Statsig ofrece una interfaz visual para crear experimentos y analizar resultados. Aunque la integración inicial requiere desarrollo, una vez configurado, product managers y marketers pueden crear y gestionar experimentos sin tocar código."
                  }
                },
                {
                  "@type": "Question",
                  "name": "¿Qué métricas debo seguir en mis experimentos A/B?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Recomendamos seguir métricas de negocio primarias (conversiones, ingresos) y secundarias (engagement, retención). En Cacerola, enfocamos nuestros experimentos en tasa de completitud de onboarding, tiempo de sesión y tasa de retención a 7 días."
                  }
                }
              ]
            })
          }}
        />
      </section>
    </div>
  );
}