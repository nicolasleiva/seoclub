"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronRight, Clock, Calendar, Share2, Bookmark, Heart } from "lucide-react"

export const metadata = {
  title: "Add descriptive title (50-60 chars)",
  description: "Add SEO-optimized meta description (150-160 chars)"
}


// Componente de carga para usar con Suspense
function BlogPostLoading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-t-orange-500 border-r-orange-500 border-b-transparent border-l-transparent rounded-full animate-spin mx-auto"></div>
        <p className="mt-4 text-slate-600">Cargando contenido...</p>
      </div>
    </div>
  );
}

// Componente con el contenido principal del blog post
function BlogPostContent() {
  // Añadimos useSearchParams que es lo que requiere Suspense
  const searchParams = useSearchParams();
  const [activeSection, setActiveSection] = useState("")

  // Mock data - in a real app, this would come from a CMS or API
  const post = {
    title: "Metodologías de Growth: Conceptos y Proceso",
    subtitle:
      "La metodología de growth es un enfoque sistemático y creativo para lograr el crecimiento acelerado y sostenible de productos, servicios o empresas",
    author: "Equipo Cacerola",
    date: "Mayo 28, 2025",
    readTime: "8 min",
    category: "Growth",
    image: "/placeholder.svg?height=400&width=800&text=Metodologías+de+Growth",
  }

  // Table of contents
  const tableOfContents = [
    { id: "introduccion", title: "Introducción al Growth Marketing", level: 1 },
    { id: "que-es", title: "¿Qué es Growth Marketing?", level: 2 },
    { id: "pilares", title: "Los Pilares del Growth Marketing", level: 2 },
    { id: "experimentacion", title: "1. Experimentación Constante", level: 3 },
    { id: "analisis", title: "2. Análisis de Datos", level: 3 },
    { id: "optimizacion", title: "3. Optimización del Funnel Completo", level: 3 },
    { id: "metodologias", title: "Metodologías Específicas", level: 2 },
    { id: "aarrr", title: "Framework AARRR", level: 3 },
    { id: "north-star", title: "North Star Framework", level: 3 },
    { id: "implementacion", title: "Implementación Práctica", level: 2 },
    { id: "herramientas", title: "Herramientas Esenciales", level: 2 },
    { id: "casos", title: "Casos de Estudio", level: 2 },
    { id: "errores", title: "Errores Comunes", level: 2 },
    { id: "futuro", title: "El Futuro del Growth Marketing", level: 2 },
    { id: "conclusion", title: "Conclusión", level: 2 },
  ]

  useEffect(() => {
    const handleScroll = () => {
      const sections = tableOfContents.map((item) => document.getElementById(item.id))
      const scrollPosition = window.scrollY + 100

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i]
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(tableOfContents[i].id)
          break
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">C</span>
              </div>
              <span className="text-xl font-bold text-slate-800">Cacerola</span>
            </Link>

            <div className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-slate-600 hover:text-slate-900 font-medium">
                Inicio
              </Link>
              <a href="/#servicios" className="text-slate-600 hover:text-slate-900 font-medium">
                Servicios
              </a>
              <Link href="/como-hacer-growth" className="text-orange-500 hover:text-orange-600 font-medium">
                Como hacer Growth
              </Link>
              <a href="/#roigo-banner" className="text-slate-600 hover:text-slate-900 font-medium">
                Conoce Roigo
              </a>
            </div>

            <div className="flex items-center">
              <Button className="bg-orange-500 hover:bg-orange-600 text-white rounded-lg px-6">Contacto</Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Table of Contents - Left Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <div className="bg-slate-50 rounded-lg p-6 mb-8">
                  <h3 className="font-bold text-slate-900 mb-4">Índice del artículo</h3>
                  <nav className="space-y-2">
                    {tableOfContents.map((item, index) => (
                      <button
                        key={index}
                        onClick={() => scrollToSection(item.id)}
                        className={`block w-full text-left py-2 px-3 rounded-lg text-sm transition-colors ${
                          activeSection === item.id
                            ? "bg-orange-100 text-orange-700 font-medium"
                            : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                        } ${item.level === 3 ? "ml-4" : ""}`}
                      >
                        {item.title}
                      </button>
                    ))}
                  </nav>
                </div>

                <div className="bg-slate-50 rounded-lg p-6">
                  <h3 className="font-bold text-slate-900 mb-4">Newsletter</h3>
                  <p className="text-sm text-slate-600 mb-4">
                    Recibe nuestros mejores artículos directamente en tu email
                  </p>
                  <div className="space-y-3">
                    <Input placeholder="tu@email.com" className="text-sm" />
                    <Button className="bg-orange-500 hover:bg-orange-600 text-white w-full text-sm">Suscribirse</Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2">
              <article className="prose prose-slate max-w-none">
                {/* Article Header */}
                <div className="mb-8">
                  <div className="mb-4">
                    <Link
                      href="/como-hacer-growth"
                      className="inline-flex items-center text-orange-500 hover:text-orange-600 text-sm font-medium"
                    >
                      <ChevronRight className="h-4 w-4 mr-1 rotate-180" />
                      Volver al blog
                    </Link>
                  </div>

                  <Badge className="bg-orange-100 text-orange-700 mb-4">{post.category}</Badge>

                  <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 leading-tight">{post.title}</h1>

                  <p className="text-xl text-slate-600 mb-6 leading-relaxed">{post.subtitle}</p>

                  <div className="flex items-center justify-between mb-8 pb-8 border-b border-slate-200">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-full bg-slate-200"></div>
                      <div>
                        <div className="font-medium text-slate-900">{post.author}</div>
                        <div className="flex items-center space-x-4 text-sm text-slate-500">
                          <span className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {post.date}
                          </span>
                          <span className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {post.readTime} de lectura
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Share2 className="h-4 w-4 mr-2" />
                        Compartir
                      </Button>
                      <Button variant="outline" size="sm">
                        <Bookmark className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Heart className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Featured Image */}
                <div className="mb-8">
                  <img
                    src={post.image || "/placeholder.svg"}
                    alt={post.title}
                    className="w-full h-64 md:h-80 object-cover rounded-lg"
                  />
                </div>

                {/* Article Content */}
                <div className="prose prose-slate prose-lg max-w-none">
                  <div id="introduccion">
                    <h1>Introducción al Growth Marketing</h1>
                    <p>
                      El growth marketing ha revolucionado la forma en que las empresas abordan el crecimiento. No se
                      trata solo de marketing tradicional, sino de un enfoque holístico que combina datos,
                      experimentación y creatividad.
                    </p>
                  </div>

                  <div id="que-es">
                    <h2>¿Qué es Growth Marketing?</h2>
                    <p>
                      Growth marketing es una metodología que se centra en el crecimiento rápido y sostenible a través
                      de experimentos creativos, análisis de datos y optimización continua. A diferencia del marketing
                      tradicional, el growth marketing:
                    </p>
                    <ul>
                      <li>Se basa en datos y métricas específicas</li>
                      <li>Utiliza experimentación constante</li>
                      <li>Se enfoca en todo el funnel de conversión</li>
                      <li>Busca crecimiento exponencial, no lineal</li>
                    </ul>
                  </div>

                  <div id="pilares">
                    <h2>Los Pilares del Growth Marketing</h2>

                    <div id="experimentacion">
                      <h3>1. Experimentación Constante</h3>
                      <p>
                        La experimentación es el corazón del growth marketing. Cada hipótesis debe ser probada con rigor
                        científico:
                      </p>
                      <ul>
                        <li>
                          <strong>Formulación de hipótesis</strong>: Basada en datos y observaciones
                        </li>
                        <li>
                          <strong>Diseño de experimentos</strong>: A/B tests, tests multivariados
                        </li>
                        <li>
                          <strong>Medición de resultados</strong>: Métricas claras y objetivas
                        </li>
                        <li>
                          <strong>Iteración</strong>: Aprender y mejorar continuamente
                        </li>
                      </ul>
                    </div>

                    <div id="analisis">
                      <h3>2. Análisis de Datos</h3>
                      <p>Los datos son la brújula que guía todas las decisiones:</p>
                      <ul>
                        <li>
                          <strong>Métricas del funnel</strong>: Desde awareness hasta retención
                        </li>
                        <li>
                          <strong>Cohort analysis</strong>: Entender el comportamiento a lo largo del tiempo
                        </li>
                        <li>
                          <strong>Attribution modeling</strong>: Saber qué canales realmente funcionan
                        </li>
                        <li>
                          <strong>Predictive analytics</strong>: Anticipar comportamientos futuros
                        </li>
                      </ul>
                    </div>

                    <div id="optimizacion">
                      <h3>3. Optimización del Funnel Completo</h3>
                      <p>No se trata solo de adquisición, sino de optimizar cada etapa:</p>
                      <ul>
                        <li>
                          <strong>Awareness</strong>: Hacer que te conozcan
                        </li>
                        <li>
                          <strong>Acquisition</strong>: Convertir visitantes en usuarios
                        </li>
                        <li>
                          <strong>Activation</strong>: Lograr que experimenten valor
                        </li>
                        <li>
                          <strong>Retention</strong>: Mantener a los usuarios activos
                        </li>
                        <li>
                          <strong>Revenue</strong>: Monetizar efectivamente
                        </li>
                        <li>
                          <strong>Referral</strong>: Convertir usuarios en promotores
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div id="metodologias">
                    <h2>Metodologías Específicas</h2>

                    <div id="aarrr">
                      <h3>Framework AARRR (Pirate Metrics)</h3>
                      <p>
                        Desarrollado por Dave McClure, este framework divide el customer journey en cinco etapas clave:
                      </p>
                      <ol>
                        <li>
                          <strong>Acquisition</strong>: ¿Cómo llegan los usuarios?
                        </li>
                        <li>
                          <strong>Activation</strong>: ¿Tienen una buena primera experiencia?
                        </li>
                        <li>
                          <strong>Retention</strong>: ¿Vuelven los usuarios?
                        </li>
                        <li>
                          <strong>Revenue</strong>: ¿Cómo monetizas?
                        </li>
                        <li>
                          <strong>Referral</strong>: ¿Los usuarios refieren a otros?
                        </li>
                      </ol>
                    </div>

                    <div id="north-star">
                      <h3>North Star Framework</h3>
                      <p>Identifica la métrica más importante que refleja el valor que entregas:</p>
                      <ul>
                        <li>
                          <strong>Definición clara</strong>: Una métrica que refleje valor real
                        </li>
                        <li>
                          <strong>Medible</strong>: Debe poder ser tracked consistentemente
                        </li>
                        <li>
                          <strong>Accionable</strong>: El equipo debe poder influir en ella
                        </li>
                        <li>
                          <strong>Relevante</strong>: Debe correlacionar con el éxito del negocio
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div id="implementacion">
                    <h2>Implementación Práctica</h2>
                    <p>
                      La implementación exitosa de growth marketing requiere un enfoque estructurado y metodológico.
                    </p>
                  </div>

                  <div id="herramientas">
                    <h2>Herramientas Esenciales</h2>
                    <p>
                      Las herramientas correctas pueden hacer la diferencia entre el éxito y el fracaso en growth
                      marketing.
                    </p>
                  </div>

                  <div id="casos">
                    <h2>Casos de Estudio</h2>
                    <p>Aprender de casos reales es fundamental para entender cómo aplicar estas metodologías.</p>
                  </div>

                  <div id="errores">
                    <h2>Errores Comunes</h2>
                    <p>Conocer los errores más frecuentes te ayudará a evitarlos en tu implementación.</p>
                  </div>

                  <div id="futuro">
                    <h2>El Futuro del Growth Marketing</h2>
                    <p>
                      El growth marketing continúa evolucionando con nuevas tecnologías y cambios en el comportamiento
                      del consumidor.
                    </p>
                  </div>

                  <div id="conclusion">
                    <h2>Conclusión</h2>
                    <p>
                      El growth marketing no es una táctica, es una mentalidad. Requiere cultura de experimentación,
                      obsesión por los datos, enfoque holístico y paciencia. El éxito viene de la combinación de
                      creatividad, rigor analítico y ejecución consistente.
                    </p>
                    <p>
                      ¿Estás listo para implementar una estrategia de growth marketing en tu empresa? El primer paso es
                      siempre el más importante: comenzar a medir y experimentar.
                    </p>
                  </div>
                </div>
              </article>

              {/* Article Footer */}
              <div className="mt-12 pt-8 border-t border-slate-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <span className="text-slate-600">¿Te gustó este artículo?</span>
                    <Button variant="outline" size="sm">
                      <Heart className="h-4 w-4 mr-2" />
                      Me gusta
                    </Button>
                    <Button variant="outline" size="sm">
                      <Share2 className="h-4 w-4 mr-2" />
                      Compartir
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-8">
                {/* Author Info */}
                <Card className="bg-slate-50">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-16 h-16 rounded-full bg-slate-200"></div>
                      <div>
                        <h3 className="font-bold text-slate-900">{post.author}</h3>
                        <p className="text-sm text-slate-600">Growth Marketing Expert</p>
                      </div>
                    </div>
                    <p className="text-sm text-slate-700 mb-4">
                      Especialistas en growth marketing con más de 5 años de experiencia ayudando a empresas a escalar
                      sus operaciones digitales.
                    </p>
                    <Button className="bg-orange-500 hover:bg-orange-600 text-white w-full text-sm">Seguir</Button>
                  </CardContent>
                </Card>

                {/* Related Articles */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-bold text-slate-900 mb-4">Artículos relacionados</h3>
                    <div className="space-y-4">
                      {[
                        {
                          title: "Cómo implementar una estrategia de SEO efectiva en 2025",
                          readTime: "12 min",
                        },
                        {
                          title: "Optimización para IAs: El futuro del SEO",
                          readTime: "10 min",
                        },
                        {
                          title: "Newsletter Marketing: Cómo crear contenido que tu audiencia espere",
                          readTime: "9 min",
                        },
                      ].map((article, index) => (
                        <div key={index} className="pb-4 border-b border-slate-200 last:border-b-0">
                          <h4 className="font-medium text-slate-900 mb-2 text-sm leading-tight hover:text-orange-600 cursor-pointer">
                            {article.title}
                          </h4>
                          <p className="text-xs text-slate-500">{article.readTime} de lectura</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* CTA */}
                <Card className="bg-orange-50 border-orange-200">
                  <CardContent className="p-6">
                    <h3 className="font-bold text-slate-900 mb-2">¿Necesitas ayuda con tu estrategia de growth?</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
