"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronRight } from "lucide-react"
import { Suspense } from "react"

export const metadata = {
  title: "Cómo Hacer Growth por Cacerola: Receta Paso a Paso",
  description: "Aprende a preparar growth por cacerola en 30 min. Ingredientes fáciles, trucos chef y sabor garantizado. ¡Cocina ya y sorprende!"
}


// Componente de carga para usar con Suspense
function ComoHacerGrowthLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-t-orange-500 border-r-orange-500 border-b-transparent border-l-transparent rounded-full animate-spin mx-auto"></div>
        <p className="mt-4 text-slate-600">Cargando contenido...</p>
      </div>
    </div>
  );
}

export default function ComoHacerGrowthPage() {
  const blogPosts = [
    {
      slug: "metodologias-de-growth-conceptos-y-proceso",
      title: "Metodologías de Growth: Conceptos y Proceso",
      excerpt:
        "La metodología de growth es un enfoque sistemático y creativo para lograr el crecimiento acelerado y sostenible de productos, servicios o empresas...",
      author: "Equipo Cacerola",
      date: "Mayo 28, 2025",
      readTime: "8 min",
      category: "Growth",
      featured: true,
    },
    {
      slug: "como-implementar-estrategia-seo-efectiva-2025",
      title: "Cómo implementar una estrategia de SEO efectiva en 2025",
      excerpt:
        "Descubre las técnicas más actualizadas para posicionar tu contenido en buscadores y plataformas de IA, incluyendo optimización semántica...",
      author: "María González",
      date: "Mayo 25, 2025",
      readTime: "12 min",
      category: "SEO",
    },
    {
      slug: "optimizacion-para-ias-futuro-del-seo",
      title: "Optimización para IAs: El futuro del SEO",
      excerpt:
        "Las IAs conversacionales están cambiando radicalmente cómo las personas buscan información. Aprende a optimizar tu contenido para ChatGPT, Claude y más...",
      author: "Carlos Ruiz",
      date: "Mayo 22, 2025",
      readTime: "10 min",
      category: "AI",
    },
    {
      slug: "casos-de-exito-empresas-triplicaron-trafico-organico",
      title: "Casos de éxito: Empresas que triplicaron su tráfico orgánico",
      excerpt:
        "Analizamos las estrategias que permitieron a estas empresas multiplicar su visibilidad online y generar más leads cualificados...",
      author: "Ana Martín",
      date: "Mayo 20, 2025",
      readTime: "15 min",
      category: "Casos de Éxito",
    },
    {
      slug: "newsletter-marketing-crear-contenido-audiencia-espere",
      title: "Newsletter Marketing: Cómo crear contenido que tu audiencia espere",
      excerpt:
        "No es otro newsletter genérico. Descubre cómo crear una publicación que tu audiencia espere cada semana porque les das exactamente lo que necesitan...",
      author: "Luis Fernández",
      date: "Mayo 18, 2025",
      readTime: "9 min",
      category: "Content",
    },
    {
      slug: "analisis-datos-growth-metricas-realmente-importan",
      title: "Análisis de datos para Growth: Métricas que realmente importan",
      excerpt:
        "Aprende a identificar y medir las métricas que realmente impulsan el crecimiento de tu negocio, más allá de las vanity metrics...",
      author: "Sofia López",
      date: "Mayo 15, 2025",
      readTime: "11 min",
      category: "Analytics",
    },
  ]

  return (
    <Suspense fallback={<ComoHacerGrowthLoading />}>
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

      {/* Blog Header */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">Como hacer Growth por Cacerola</h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Artículos, guías y recursos para potenciar tu estrategia de crecimiento orgánico
            </p>
          </div>
        </div>
      </section>

      {/* Blog Content */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-4 gap-8">
              {/* Sidebar */}
              <div className="lg:col-span-1">
                <div className="sticky top-24">
                  <h3 className="text-lg font-bold text-slate-900 mb-4">Categorías</h3>
                  <div className="space-y-2">
                    {[
                      "Metodologías de Growth",
                      "SEO Estratégico",
                      "Optimización para IAs",
                      "Content Marketing",
                      "Análisis de Datos",
                      "Casos de Éxito",
                    ].map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-2 text-slate-600 hover:text-orange-500 cursor-pointer py-2 px-3 rounded-lg hover:bg-orange-50 transition-colors"
                      >
                        <ChevronRight className="h-4 w-4" />
                        <span className="text-sm">{item}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 pt-8 border-t border-slate-200">
                    <h3 className="text-lg font-bold text-slate-900 mb-4">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {["Growth", "SEO", "Content", "AI", "Analytics", "Marketing", "Strategy"].map((tag, index) => (
                        <Badge
                          key={index}
                          className="bg-slate-100 text-slate-700 hover:bg-orange-100 hover:text-orange-700 cursor-pointer"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="mt-8 pt-8 border-t border-slate-200">
                    <h3 className="text-lg font-bold text-slate-900 mb-4">Newsletter</h3>
                    <p className="text-sm text-slate-600 mb-4">
                      Recibe nuestros mejores artículos directamente en tu email
                    </p>
                    <div className="space-y-3">
                      <Input placeholder="tu@email.com" className="text-sm" />
                      <Button className="bg-orange-500 hover:bg-orange-600 text-white w-full text-sm">
                        Suscribirse
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Blog Posts Grid */}
              <div className="lg:col-span-3">
                <div className="grid md:grid-cols-2 gap-8">
                  {blogPosts.map((post, index) => (
                    <Link key={index} href={`/como-hacer-growth/${post.slug}`}>
                      <Card
                        className={`bg-white border-slate-200 hover:border-orange-200 transition-all duration-300 hover:shadow-lg cursor-pointer group ${post.featured ? "md:col-span-2" : ""}`}
                      >
                        <CardContent className="p-0">
                          <div className="relative">
                            <img
                              src={`/generic-placeholder-icon.png?height=${post.featured ? "300" : "200"}&width=${post.featured ? "800" : "400"}&text=${encodeURIComponent(post.title)}`}
                              alt={post.title}
                              className="w-full h-48 md:h-56 object-cover rounded-t-lg"
                            />
                            <Badge className="absolute top-4 left-4 bg-orange-500 text-white">{post.category}</Badge>
                          </div>

                          <div className="p-6">
                            <h3
                              className={`font-bold text-slate-900 mb-3 group-hover:text-orange-600 transition-colors ${post.featured ? "text-2xl" : "text-xl"}`}
                            >
                              {post.title}
                            </h3>

                            <p className="text-slate-600 mb-4 line-clamp-3">{post.excerpt}</p>

                            <div className="flex items-center justify-between text-sm text-slate-500">
                              <div className="flex items-center space-x-2">
                                <div className="w-8 h-8 rounded-full bg-slate-200"></div>
                                <div>
                                  <div className="font-medium text-slate-700">{post.author}</div>
                                  <div>{post.date}</div>
                                </div>
                              </div>
                              <div className="text-slate-400">{post.readTime} de lectura</div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>

                {/* Load More Button */}
                <div className="text-center mt-12">
                  <Button
                    variant="outline"
                    className="text-orange-500 border-orange-200 hover:bg-orange-50 hover:text-orange-600 px-8 py-3"
                  >
                    Cargar más artículos
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
    </Suspense>
  )
}
