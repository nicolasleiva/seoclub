import type { Metadata } from 'next'
import './globals.css'
import { StatsigProvider } from '@/components/providers/statsig-provider'
import { PostHogProvider } from '@/components/providers/posthog-provider'
import Script from 'next/script'

export const metadata: Metadata = {
  title: 'Cacerola | Growth Orgánico para Empresas',
  description: 'Especialistas en growth orgánico que construye confianza y autoridad de marca a través de estrategias de contenido personalizado para empresas innovadoras.',
  keywords: 'growth orgánico, marketing digital, estrategia de contenido, análisis IA, autoridad de marca',
  authors: [{ name: 'Cacerola' }],
  openGraph: {
    title: 'Cacerola | Growth Orgánico para Empresas',
    description: 'Especialistas en growth orgánico que construye confianza y autoridad de marca a través de estrategias de contenido personalizado.',
    url: 'https://www.cacerola.com',
    siteName: 'Cacerola',
    images: [{
      url: '/og-image.jpg',
      width: 1200,
      height: 630,
      alt: 'Cacerola Growth'
    }],
    locale: 'es_ES',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cacerola | Growth Orgánico para Empresas',
    description: 'Especialistas en growth orgánico que construye confianza y autoridad de marca.',
    images: ['/twitter-image.jpg'],
    creator: '@cacerola'
  },
  alternates: {
    canonical: 'https://www.cacerola.com',
  },
  robots: 'index, follow',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <head>
        <link rel="llms" href="/llms.txt" type="text/markdown" />
      </head>
      <body>
        <PostHogProvider>
          <StatsigProvider>
            {children}
          </StatsigProvider>
        </PostHogProvider>
        <Script id="schema-org" type="application/ld+json">
          {`
          {
            "@context": "https://schema.org",
            "@type": "ProfessionalService",
            "name": "Cacerola",
            "description": "Agencia especializada en growth orgánico para empresas que piensan diferente.",
            "url": "https://www.cacerola.com",
            "areaServed": "Global",
            "serviceType": ["Growth Orgánico", "Análisis IA", "Desarrollo de Contenido"],
            "potentialAction": {
              "@type": "ReservationAction",
              "target": {
                "@type": "EntryPoint",
                "urlTemplate": "https://www.cacerola.com/#contacto"
              },
              "result": {
                "@type": "Reservation",
                "name": "Consulta de Growth"
              }
            }
          }
          `}
        </Script>
      </body>
    </html>
  )
}
