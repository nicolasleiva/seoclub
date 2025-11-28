"use client"

import { useState, useEffect, Suspense } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowUp, ChevronRight } from "lucide-react"
import Link from "next/link"
import { initStatsig, checkGate, getExperiment, logEvent } from "@/lib/statsig"

// TODO: Implementar integración con servicios de Strapi
// import { getNavigationData } from "@/services/navigation-service"
// import { getHeroContent } from "@/services/hero-service"
// import { getFooterContent } from "@/services/footer-service"
// import { submitContactForm } from "@/services/contact-service"

export const metadata = {
  title: "Add descriptive title (50-60 chars)",
  description: "Add SEO-optimized meta description (150-160 chars)"
}


// Componente interno que envolvemos con Suspense
function CacerolaContent() {
  // Estado para feature flags y experimentos de Statsig
  const [showNewFeatures, setShowNewFeatures] = useState(false)
  const [formVariant, setFormVariant] = useState("default")
  
  // Definimos la interface para el formulario
  interface FormData {
    email: string;
    firstName: string;
    lastName: string;
    company: string;
    website: string;
    industry: string;
    companySize: string;
    goals: string[];
    budget: string;
  }
  
  // Estados para el formulario de contacto
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<FormData>({
    email: "",
    firstName: "",
    lastName: "",
    company: "",
    website: "",
    industry: "",
    companySize: "",
    goals: [],
    budget: "",
  })
  
  // Estados para el análisis y resultados
  const [aiResult, setAiResult] = useState("")
  const [showResult, setShowResult] = useState(false)
  const [activeTab, setActiveTab] = useState("analisis")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [showEmailForm, setShowEmailForm] = useState(false)
  const [email, setEmail] = useState("")
  
  // Estado para notificaciones
  const [notification, setNotification] = useState({
    show: false,
    type: '', // 'success' o 'error'
    message: ''
  })

  // Cargar feature flags y experimentos al montar el componente
  useEffect(() => {
    // Inicializar Statsig antes de usar sus funciones
    const initializeStatsig = async () => {
      try {
        // Generamos un ID de usuario anónimo para fines de demostración
        const anonymousUserId = `anon-${Math.random().toString(36).substring(2, 15)}`
        
        // Inicializar Statsig con propiedades básicas
        await initStatsig(anonymousUserId, {
          platform: 'web',
          userAgent: navigator.userAgent,
          locale: navigator.language
        })
        
        // Una vez inicializado, verificar si debemos mostrar las nuevas características
        const newFeaturesEnabled = checkGate("new_features_enabled")
        setShowNewFeatures(newFeaturesEnabled)

        // Obtener la variante del experimento para el formulario
        const variant = getExperiment<string>("form_variant_test", "default")
        setFormVariant(variant)

        // Registrar vista de página
        logEvent("page_view", "1", { page: "landing" })
      } catch (error) {
        console.error('Error al inicializar Statsig:', error)
        // Establecer valores por defecto en caso de error
        setShowNewFeatures(false)
        setFormVariant("default")
      }
    }
    
    // Ejecutar la inicialización
    initializeStatsig()
  }, [])

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.email && formData.firstName && formData.lastName && formData.company
      case 2:
        return formData.website && formData.industry
      case 3:
        return formData.goals.length > 0
      default:
        return false
    }
  }

  const handleNextStep = () => {
    if (isStepValid() && currentStep < 3) {
      setCurrentStep(currentStep + 1)
      // Registrar evento de avance en el formulario
      logEvent("form_step_completed", "1", {
        step: currentStep.toString(),
        form_variant: formVariant
      })
    }
  }

  const handleSubmit = async () => {
    if (!isStepValid()) return

    // Registrar evento de envío de formulario
    logEvent("form_submitted", "1", {
      company: formData.company,
      industry: formData.industry,
      goals: formData.goals.join(","),
      form_variant: formVariant
    })

    setIsAnalyzing(true)
    
    // Ocultar notificaciones previas
    setNotification({ show: false, type: '', message: '' })

    try {
      // Enviar datos al webhook via nuestra API
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al enviar el formulario');
      }

      // Mostrar notificación de éxito
      setNotification({
        show: true,
        type: 'success',
        message: 'Datos enviados correctamente al webhook de n8n'
      })
      
      // Resetear el formulario para futuros envíos
      setFormData({
        email: "",
        firstName: "",
        lastName: "",
        company: "",
        website: "",
        industry: "",
        companySize: "",
        goals: [],
        budget: "",
      })

      // Generar análisis para mostrar al usuario
      const insights = [
        `Análisis para ${formData.company}: Oportunidades identificadas en ${formData.industry}`,
        "Historia de origen: Crear contenido sobre los fundadores y la misión que impulsa la empresa",
        "Casos de éxito de clientes: Desarrollar testimonios detallados que muestren transformaciones reales",
        "Behind the scenes: Mostrar el proceso de trabajo y la cultura empresarial",
        "Expertise técnico: Crear contenido educativo que demuestre conocimiento profundo del sector",
        `Optimización específica para ${formData.goals.join(", ").toLowerCase()}`,
      ]

      setAiResult(insights.join("\n"))
      setShowResult(true)
      
      // Registrar evento de análisis exitoso
      logEvent("analysis_success", "1", { url: formData.website })

      console.log('Datos enviados correctamente al webhook de n8n');
      
      // Ocultar la notificación después de 5 segundos
      setTimeout(() => {
        setNotification({ show: false, type: '', message: '' })
      }, 5000)
    } catch (error) {
      console.error("Error en envío o análisis:", error)
      
      // Mostrar notificación de error
      setNotification({
        show: true,
        type: 'error',
        message: error instanceof Error ? error.message : "Error desconocido al enviar datos"
      })
      
      // Registrar error en el análisis
      logEvent("analysis_error", "1", { 
        error_type: "api_error",
        message: error instanceof Error ? error.message : "Unknown error" 
      })
    } finally {
      setIsAnalyzing(false)
    }
  }

  const analyzeCompany = async () => {
    if (!formData.website || !formData.website.trim()) {
      alert("Por favor ingresa la URL de tu empresa")
      logEvent("analysis_error", "1", { error: "empty_url" })
      return
    }

    // Validate URL format
    try {
      new URL(formData.website)
    } catch {
      alert("Por favor ingresa una URL válida (ej: https://tuempresa.com)")
      logEvent("analysis_error", "1", { error: "invalid_url_format" })
      return
    }

    setIsAnalyzing(true)

    // TODO: En el futuro, aquí se llamará a una API de Strapi para análisis real
    // Por ahora, siempre usamos el análisis local para evitar errores
    try {
      // Simulamos un pequeño delay como si estuviéramos llamando a una API
      await new Promise((resolve) => setTimeout(resolve, 1500))
      
      // Usamos el generador local de insights para demo
      const insights = generateStorytellingInsights(formData.website)
      setAiResult(insights.join("\n"))
      setShowResult(true)
      
      // Registramos el éxito del análisis
      logEvent("analysis_success", "1", { url: formData.website })
    } catch (error) {
      console.error("Error en análisis:", error)
      logEvent("analysis_error", "1", { 
        error_type: "generation_error",
        message: error instanceof Error ? error.message : "Unknown error" 
      })
    } finally {
      setIsAnalyzing(false)
    }
  }

  const generateStorytellingInsights = (url: string) => {
    // Mock storytelling insights based on URL analysis
    const insights = [
      "Historia de origen: Crear contenido sobre los fundadores y la misión que impulsa la empresa",
      "Casos de éxito de clientes: Desarrollar testimonios detallados que muestren transformaciones reales",
      "Behind the scenes: Mostrar el proceso de trabajo y la cultura empresarial",
      "Evolución del producto/servicio: Contar cómo han mejorado y adaptado sus ofertas",
      "Impacto en la comunidad: Destacar contribuciones locales y responsabilidad social",
      "Expertise técnico: Crear contenido educativo que demuestre conocimiento profundo del sector",
    ]

    return insights
  }

  const sendReportByEmail = () => {
    if (!email.trim() || !email.includes("@")) {
      alert("Por favor ingresa un email válido")
      return
    }

    // Here would be the API call to send the email
    alert(`Reporte enviado a ${email}`)
    
    // Registrar evento de envío de email
    logEvent("report_email_sent", "1", { email_domain: email.split('@')[1] })
    
    setShowEmailForm(false)
  }

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

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
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">C</span>
              </div>
              <span className="text-xl font-bold text-slate-800">Cacerola</span>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <a href="#" className="text-slate-600 hover:text-slate-900 font-medium">
                Inicio
              </a>
              <a
                href="#servicios"
                className="text-slate-600 hover:text-slate-900 font-medium"
                onClick={(e) => {
                  e.preventDefault()
                  scrollToSection("servicios")
                }}
              >
                Servicios
              </a>
              <Link href="/como-hacer-growth" className="text-slate-600 hover:text-slate-900 font-medium" style={{ display: "none" }}>
                Como hacer Growth
              </Link>
              <a
                href="#roigo-banner"
                className="text-slate-600 hover:text-slate-900 font-medium"
                onClick={(e) => {
                  e.preventDefault()
                  scrollToSection("roigo-banner")
                }}
              >
                Conoce Roigo
              </a>
            </div>

            <div className="flex items-center">
              <Button
                className="bg-orange-500 hover:bg-orange-600 text-white rounded-lg px-6"
                onClick={() => scrollToSection("hero")}
                style={{ display: "none" }}
              >
                Contacto
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="hero" className="pt-20 pb-32 relative overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge - Condicionada por feature flag */}
            <Badge 
              className={`${showNewFeatures ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white' : 'bg-orange-100 text-orange-700'} border-orange-200 mb-8 px-4 py-2 text-sm font-medium`}
            >
              ✨ {showNewFeatures ? '¡NUEVO! Análisis IA Premium' : 'Nuevo: Análisis IA instantáneo para tu empresa'}
            </Badge>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-7xl font-bold text-slate-900 mb-8 leading-tight">
              Growth Orgánico para Empresas Que Piensan Diferente
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-slate-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              Mientras tu competencia compra clics, nosotros construimos confianza. Tu audiencia ya te está buscando...
              solo que aún no te encuentra.
            </p>

            {/* Multistep Form */}
            <div className="max-w-5xl mx-auto mb-8">
              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
                <div className="grid lg:grid-cols-2">
                  {/* Left Panel - Promotional */}
                  <div className="bg-orange-500 p-8 lg:p-12 text-white relative overflow-hidden">
                    <div className="relative z-10">
                      <h3 className="text-3xl lg:text-4xl font-bold mb-8 leading-tight">
                        Descubre el potencial oculto de tu empresa
                      </h3>

                      <div className="space-y-4 mb-8">
                        <div className="flex items-center space-x-3">
                          <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                            <svg className="w-4 h-4 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                          <span className="text-lg">Análisis IA de tu presencia digital</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                            <svg className="w-4 h-4 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                          <span className="text-lg">Estrategia personalizada de growth</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                            <svg className="w-4 h-4 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                          <span className="text-lg">Resultados medibles en 90 días</span>
                        </div>
                      </div>

                      <div className="pt-8 border-t border-orange-400">
                        <p className="text-orange-100 text-sm mb-4">Empresas que confían en nosotros:</p>
                        <div className="flex flex-wrap items-center gap-6 opacity-80">
                          <div className="bg-white/20 px-3 py-1 rounded text-sm font-medium">Kaufparts</div>
                          <div className="bg-white/20 px-3 py-1 rounded text-sm font-medium">AutoExpertos</div>
                          <div className="bg-white/20 px-3 py-1 rounded text-sm font-medium">Gestioncar</div>
                          <div className="bg-white/20 px-3 py-1 rounded text-sm font-medium">FacFast</div>
                        </div>
                      </div>
                    </div>

                    {/* Decorative elements */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
                  </div>

                  {/* Right Panel - Form */}
                  <div className="p-8 lg:p-12">
                    {!showResult ? (
                      <>
                        {/* Progress Bar */}
                        <div className="mb-8">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-slate-500">Paso {currentStep} de 3</span>
                            <span className="text-sm text-slate-500">{Math.round((currentStep / 3) * 100)}%</span>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-2">
                            <div
                              className="bg-orange-500 h-2 rounded-full transition-all duration-300 ease-out"
                              style={{ width: `${(currentStep / 3) * 100}%` }}
                            ></div>
                          </div>
                        </div>

                        {/* Form Header */}
                        <div className="mb-8">
                          <div className="flex items-center space-x-2 mb-4">
                            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                              <span className="text-white font-bold text-sm">C</span>
                            </div>
                            <span className="text-xl font-bold text-slate-800">Cacerola</span>
                          </div>
                          <h3 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-2">Comencemos tu análisis</h3>
                          <p className="text-slate-600">
                            Responde unas preguntas para crear tu estrategia personalizada
                          </p>
                        </div>

                        {/* Step 1: Company Info */}
                        {currentStep === 1 && (
                          <div className="space-y-6">
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-2">
                                Email empresarial <span className="text-red-500">*</span>
                              </label>
                              <Input
                                type="email"
                                placeholder="tu@empresa.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full"
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                  Nombre <span className="text-red-500">*</span>
                                </label>
                                <Input
                                  type="text"
                                  placeholder="Juan"
                                  value={formData.firstName}
                                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                  Apellido <span className="text-red-500">*</span>
                                </label>
                                <Input
                                  type="text"
                                  placeholder="Pérez"
                                  value={formData.lastName}
                                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                />
                              </div>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-2">
                                Empresa <span className="text-red-500">*</span>
                              </label>
                              <Input
                                type="text"
                                placeholder="Nombre de tu empresa"
                                value={formData.company}
                                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                className="w-full"
                              />
                            </div>
                          </div>
                        )}

                        {/* Step 2: Business Info */}
                        {currentStep === 2 && (
                          <div className="space-y-6">
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-2">
                                Sitio web de tu empresa <span className="text-red-500">*</span>
                              </label>
                              <Input
                                type="url"
                                placeholder="https://tuempresa.com"
                                value={formData.website}
                                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                                className="w-full"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-2">
                                ¿En qué industria opera tu empresa? <span className="text-red-500">*</span>
                              </label>
                              <select
                                value={formData.industry}
                                onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                              >
                                <option value="">Selecciona una industria</option>
                                <option value="tecnologia">Tecnología</option>
                                <option value="salud">Salud y Medicina</option>
                                <option value="finanzas">Finanzas</option>
                                <option value="educacion">Educación</option>
                                <option value="retail">Retail y E-commerce</option>
                                <option value="manufactura">Manufactura</option>
                                <option value="servicios">Servicios Profesionales</option>
                                <option value="inmobiliaria">Inmobiliaria</option>
                                <option value="turismo">Turismo y Hospitalidad</option>
                                <option value="otro">Otro</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-2">
                                Tamaño de la empresa
                              </label>
                              <select
                                value={formData.companySize}
                                onChange={(e) => setFormData({ ...formData, companySize: e.target.value })}
                                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                              >
                                <option value="">Selecciona el tamaño</option>
                                <option value="1-10">1-10 empleados</option>
                                <option value="11-50">11-50 empleados</option>
                                <option value="51-200">51-200 empleados</option>
                                <option value="201-1000">201-1000 empleados</option>
                                <option value="1000+">Más de 1000 empleados</option>
                              </select>
                            </div>
                          </div>
                        )}

                        {/* Step 3: Goals */}
                        {currentStep === 3 && (
                          <div className="space-y-6">
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-4">
                                ¿Cuáles son tus principales objetivos de crecimiento?{" "}
                                <span className="text-red-500">*</span>
                              </label>
                              <div className="space-y-3">
                                {[
                                  "Aumentar tráfico orgánico",
                                  "Generar más leads cualificados",
                                  "Mejorar conversiones",
                                  "Construir autoridad de marca",
                                  "Optimizar para búsquedas por IA",
                                  "Crear contenido que convierta",
                                ].map((goal) => (
                                  <label key={goal} className="flex items-center space-x-3 cursor-pointer">
                                    <input
                                      type="checkbox"
                                      checked={formData.goals.includes(goal)}
                                      onChange={(e) => {
                                        if (e.target.checked) {
                                          setFormData({ ...formData, goals: [...formData.goals, goal] })
                                        } else {
                                          setFormData({ ...formData, goals: formData.goals.filter((g) => g !== goal) })
                                        }
                                      }}
                                      className="w-4 h-4 text-orange-500 border-slate-300 rounded focus:ring-orange-500"
                                    />
                                    <span className="text-slate-700">{goal}</span>
                                  </label>
                                ))}
                              </div>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-2">
                                ¿Cuál es tu presupuesto mensual aproximado para marketing digital?
                              </label>
                              <select
                                value={formData.budget}
                                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                              >
                                <option value="">Selecciona un rango</option>
                                <option value="menos-1000">Menos de $1,000</option>
                                <option value="1000-5000">$1,000 - $5,000</option>
                                <option value="5000-10000">$5,000 - $10,000</option>
                                <option value="10000-25000">$10,000 - $25,000</option>
                                <option value="25000+">Más de $25,000</option>
                              </select>
                            </div>
                          </div>
                        )}

                        {/* Form Actions */}
                        <div className="flex justify-between mt-8 pt-6 border-t border-slate-200">
                          {currentStep > 1 && (
                            <Button variant="outline" onClick={() => setCurrentStep(currentStep - 1)} className="px-6">
                              Anterior
                            </Button>
                          )}

                          <div className="ml-auto">
                            {currentStep < 3 ? (
                              <Button
                                onClick={handleNextStep}
                                disabled={!isStepValid()}
                                className="bg-slate-900 hover:bg-slate-800 text-white px-8"
                              >
                                Continuar
                              </Button>
                            ) : (
                              <Button
                                onClick={handleSubmit}
                                disabled={!isStepValid() || isAnalyzing}
                                className="bg-orange-500 hover:bg-orange-600 text-white px-8"
                              >
                                {isAnalyzing ? "Analizando..." : "Obtener mi análisis"}
                              </Button>
                            )}
                          </div>
                        </div>
                      </>
                    ) : (
                      /* Success Message */
                      <div className="text-center py-12">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                          <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>

                        <div className="flex items-center space-x-2 mb-4 justify-center">
                          <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">C</span>
                          </div>
                          <span className="text-xl font-bold text-slate-800">Cacerola</span>
                        </div>

                        <h3 className="text-2xl font-bold text-slate-900 mb-4">¡Análisis en proceso!</h3>

                        <p className="text-slate-700 mb-6 leading-relaxed max-w-md mx-auto">
                          Dentro de poco enviaremos a tu correo{" "}
                          <span className="font-semibold text-orange-600">{formData.email}</span> el análisis completo
                          con las oportunidades de Growth Orgánico a implementar.
                        </p>

                        <p className="text-slate-600 font-medium">Te escribo pronto :)</p>

                        <div className="mt-8 p-4 bg-orange-50 rounded-lg">
                          <p className="text-sm text-orange-800 mb-3">¿Tienes una consulta urgente mientras tanto?</p>
                          <a href="https://calendar.app.google/hpZiZQtju1VURQ1b6" target="_blank" rel="noopener noreferrer">
                            <Button className="bg-orange-500 hover:bg-orange-600 text-white text-sm">
                              Agéndame una cita pronto
                            </Button>
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center justify-center space-x-8 text-sm text-slate-500 mb-16">
              <span className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                Simple
              </span>
              <span className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                Poderoso
              </span>
              <span className="flex items-center">
                <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
                Seguro
              </span>
            </div>

            {/* AI Result */}
          </div>
        </div>

        {/* Analytics Preview */}
        <div className="container mx-auto px-6 mt-20">
          <div className="max-w-5xl mx-auto">
            <Card className="bg-white border border-slate-200 shadow-2xl rounded-lg overflow-hidden">
              <CardContent className="p-8">
                <div className="grid lg:grid-cols-3 gap-8">
                  {/* Left Sidebar */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="w-8 h-8 bg-orange-500 rounded-lg"></div>
                      <span className="font-semibold text-slate-800">Cacerola</span>
                    </div>

                    <div className="space-y-2">
                      {[
                        { id: "analisis", label: "Análisis" },
                        { id: "seo", label: "SEO Analytics" },
                        { id: "content", label: "Content Hub" },
                        { id: "ai", label: "AI Insights" },
                        { id: "newsletter", label: "Newsletter" },
                      ].map((item, index) => (
                        <div
                          key={index}
                          className={`p-3 rounded-lg ${
                            activeTab === item.id ? "bg-orange-100 text-orange-700" : "text-slate-600 hover:bg-slate-50"
                          } cursor-pointer transition-colors`}
                          onClick={() => setActiveTab(item.id)}
                        >
                          {item.label}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Main Content */}
                  <div className="lg:col-span-2 space-y-6">
                    {activeTab === "analisis" && (
                      <div className="space-y-6">
                        <div className="border-l-4 border-orange-500 pl-6">
                          <h3 className="text-xl font-bold text-slate-800 mb-3">Análisis de Crecimiento Orgánico</h3>
                          <div className="prose prose-slate max-w-none">
                            <p className="text-slate-700 mb-4">
                              <strong>Transformamos empresas tradicionales</strong> en líderes digitales de su
                              industria. Nuestro enfoque se basa en <em>construir autoridad</em> a través de contenido
                              estratégico que responde las preguntas reales de tu audiencia.
                            </p>

                            <div className="bg-orange-50 p-6 rounded-lg my-6">
                              <h4 className="font-bold text-slate-800 mb-3">📊 Métricas que Importan:</h4>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="text-center">
                                  <div className="text-2xl font-bold text-orange-600">4,600</div>
                                  <div className="text-sm text-slate-600">Visitas Orgánicas</div>
                                  <div className="text-xs text-green-600">↗ +180% este mes</div>
                                </div>
                                <div className="text-center">
                                  <div className="text-2xl font-bold text-orange-600">15%</div>
                                  <div className="text-sm text-slate-600">Conversión</div>
                                  <div className="text-xs text-green-600">↗ +3x vs. pagado</div>
                                </div>
                              </div>
                            </div>

                            <blockquote className="border-l-4 border-slate-300 pl-4 italic text-slate-600 my-4">
                              "No se trata de generar más tráfico, sino de atraer a las personas correctas en el momento
                              correcto de su proceso de decisión."
                            </blockquote>

                            <div className="bg-orange-50 p-4 rounded-lg">
                              <p className="text-orange-800 font-medium">
                                💡 <strong>Próximo paso:</strong> Agenda una consulta gratuita para descubrir las
                                oportunidades específicas de tu empresa
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === "seo" && (
                      <div className="space-y-6">
                        <div className="border-l-4 border-orange-500 pl-6">
                          <h3 className="text-xl font-bold text-slate-800 mb-3">SEO Analytics</h3>
                          <div className="prose prose-slate max-w-none">
                            <p className="text-slate-700 mb-4">
                              <strong>Optimización estratégica</strong> que va más allá de las keywords tradicionales.
                              Nuestro enfoque se centra en entender la <em>intención real</em> de búsqueda de tu
                              audiencia.
                            </p>
                            <ul className="space-y-2 text-slate-600">
                              <li>
                                • <strong>Análisis de gaps de contenido:</strong> Identificamos qué busca tu audiencia y
                                no encuentra
                              </li>
                              <li>
                                • <strong>Optimización semántica:</strong> Contenido que responde preguntas reales
                              </li>
                              <li>
                                • <strong>Performance tracking:</strong> Métricas que importan para tu negocio
                              </li>
                            </ul>
                            <div className="bg-orange-50 p-4 rounded-lg mt-4">
                              <p className="text-orange-800 font-medium">
                                💡 <strong>Insight clave:</strong> El 73% de nuestros clientes ve resultados en los
                                primeros 90 días
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === "content" && (
                      <div className="space-y-6">
                        <div className="border-l-4 border-orange-500 pl-6">
                          <h3 className="text-xl font-bold text-slate-800 mb-3">Content Hub</h3>
                          <div className="prose prose-slate max-w-none">
                            <p className="text-slate-700 mb-4">
                              Tu <strong>centro de conocimiento</strong> que posiciona tu empresa como la autoridad en
                              tu industria. No es solo contenido, es <em>arquitectura de confianza</em>.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                              <div className="bg-orange-50 p-4 rounded-lg">
                                <h4 className="font-semibold text-slate-800 mb-2">📚 Recursos Educativos</h4>
                                <p className="text-slate-700 text-sm">
                                  Guías, tutoriales y herramientas que tu audiencia necesita
                                </p>
                              </div>
                              <div className="bg-blue-50 p-4 rounded-lg">
                                <h4 className="font-semibold text-slate-800 mb-2">🎯 Lead Magnets</h4>
                                <p className="text-slate-700 text-sm">
                                  Contenido premium que convierte visitantes en leads
                                </p>
                              </div>
                            </div>
                            <blockquote className="border-l-4 border-slate-300 pl-4 italic text-slate-600">
                              "El contenido de calidad no interrumpe, ayuda. Y cuando ayudas consistentemente, tu
                              audiencia te elige cuando está lista para comprar."
                            </blockquote>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === "ai" && (
                      <div className="space-y-6">
                        <div className="border-l-4 border-orange-500 pl-6">
                          <h3 className="text-xl font-bold text-slate-800 mb-3">AI Insights</h3>
                          <div className="prose prose-slate max-w-none">
                            <p className="text-slate-700 mb-4">
                              <strong>Optimización para el futuro</strong> que ya está aquí. Mientras otros optimizan
                              para Google de 2020, nosotros preparamos tu contenido para las{" "}
                              <em>IAs conversacionales</em>.
                            </p>
                            <div className="bg-slate-50 p-6 rounded-lg my-6">
                              <h4 className="font-bold text-slate-800 mb-3">🤖 Plataformas que Optimizamos:</h4>
                              <div className="grid grid-cols-2 gap-3 text-sm">
                                <div className="flex items-center space-x-2">
                                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                  <span>ChatGPT</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                  <span>Perplexity</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                                  <span>Claude</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <div className="w-2 h-2 bg-slate-500 rounded-full"></div>
                                  <span>Gemini</span>
                                </div>
                              </div>
                            </div>
                            <p className="text-slate-700">
                              <strong>El resultado:</strong> Cuando alguien pregunta sobre tu industria a una IA, tu
                              empresa aparece como <em>la solución recomendada</em>.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === "newsletter" && (
                      <div className="space-y-6">
                        <div className="border-l-4 border-orange-500 pl-6">
                          <h3 className="text-xl font-bold text-slate-800 mb-3">Newsletter Hiper-Personalizado</h3>
                          <div className="prose prose-slate max-w-none">
                            <p className="text-slate-700 mb-4">
                              No es otro newsletter genérico. Es <strong>la publicación</strong> que tu audiencia espera
                              cada semana porque les damos exactamente el contenido que necesitan para
                              <em>tomar mejores decisiones</em>.
                            </p>
                            <div className="space-y-4 my-6">
                              <div className="flex items-center space-x-3">
                                <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                                  <span className="text-orange-600 text-xs font-bold">1</span>
                                </div>
                                <div>
                                  <h4 className="font-semibold text-slate-800">Curación Inteligente</h4>
                                  <p className="text-slate-600 text-sm">
                                    Seleccionamos y contextualizamos las noticias más relevantes de tu industria
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-3">
                                <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                                  <span className="text-orange-600 text-xs font-bold">2</span>
                                </div>
                                <div>
                                  <h4 className="font-semibold text-slate-800">Insights Exclusivos</h4>
                                  <p className="text-slate-600 text-sm">
                                    Análisis y perspectivas que solo tu empresa puede ofrecer
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-3">
                                <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                                  <span className="text-orange-600 text-xs font-bold">3</span>
                                </div>
                                <div>
                                  <h4 className="font-semibold text-slate-800">Casos Reales</h4>
                                  <p className="text-slate-600 text-sm">
                                    Ejemplos anonimizados de tu experiencia que educan y construyen autoridad
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="bg-orange-50 p-4 rounded-lg">
                              <p className="text-orange-800 font-medium">
                                🎯 <strong>Objetivo:</strong> Que te vean como el referente indiscutible de tu sector
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
                El Problema Que Nadie Te Está Contando
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Las empresas tradicionales están perdiendo terreno porque siguen pensando en transacciones, no en
                relaciones.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-6">
                <div className="space-y-4 text-lg text-slate-700">
                  <p>
                    Mientras invierten miles en publicidad pagada para "empujar" sus productos, sus clientes potenciales
                    están en Google, Perplexity y ChatGPT haciendo preguntas como:
                  </p>

                  <div className="space-y-3 pl-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <span>"¿Cuál es la mejor opción para...?"</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>"¿Cómo elegir entre X y Y?"</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>"¿Qué debo saber antes de comprar...?"</span>
                    </div>
                  </div>

                  <p className="font-semibold text-slate-900">
                    ¿Quién está respondiendo esas preguntas? Tu competencia más inteligente.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {[
                  { number: "68%", text: "de las decisiones de compra comienzan con una búsqueda orgánica" },
                  { number: "3x", text: "más probabilidad de conversión tiene el tráfico orgánico vs. pagado" },
                  {
                    number: "47%",
                    text: "de los compradores consumen 3-5 piezas de contenido antes de contactar ventas",
                  },
                ].map((stat, index) => (
                  <Card key={index} className="bg-white border-slate-200">
                    <CardContent className="p-6">
                      <div className="text-3xl font-bold text-orange-500 mb-2">{stat.number}</div>
                      <p className="text-slate-700">{stat.text}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Servicios Section */}
      <section id="servicios" className="py-24 bg-slate-900 text-white">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">Nuestras 3 Verticales de Growth Orgánico</h2>
              <p className="text-xl text-slate-300 max-w-3xl mx-auto">
                Estrategias probadas que transforman la presencia digital de empresas tradicionales
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: "🎯",
                  title: "SEO Estratégico para Productos",
                  description:
                    "No más páginas genéricas. Creamos contenido que responde exactamente lo que tu cliente busca antes de comprar.",
                  features: [
                    "Optimización de páginas de producto",
                    "Content hubs especializados",
                    "Lead magnets estratégicos",
                  ],
                },
                {
                  icon: "🤖",
                  title: "GEO & AEO: El Futuro Ya Está Aquí",
                  description:
                    "Preparamos tu contenido para las IAs que ya están respondiendo las preguntas de tus clientes.",
                  features: ["Optimización para ChatGPT", "Presencia en Perplexity", "Menciones en Claude y Gemini"],
                },
                {
                  icon: "✉️",
                  title: "Newsletter Hiper-Personalizado",
                  description:
                    "Una publicación que tu audiencia espera cada semana porque les damos exactamente el contenido que necesitan.",
                  features: ["Curación inteligente", "Insights de industria", "Casos reales de tu empresa"],
                },
              ].map((service, index) => (
                <Card
                  key={index}
                  className="bg-white/5 border-white/10 hover:bg-white/10 transition-all duration-300 group"
                >
                  <CardContent className="p-8">
                    <div className="text-4xl mb-6">{service.icon}</div>
                    <h3 className="text-xl font-bold text-white mb-4 group-hover:text-orange-400 transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-slate-300 mb-6 leading-relaxed">{service.description}</p>
                    <div className="space-y-2 mb-6">
                      {service.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center space-x-3">
                          <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                          <span className="text-sm text-slate-400">{feature}</span>
                        </div>
                      ))}
                    </div>
                    <Button
                      className="bg-orange-500 hover:bg-orange-600 text-white w-full rounded-lg"
                      onClick={() =>
                        scrollToSection(
                          index === 0 ? "seo-estrategico" : index === 1 ? "geo-aeo" : "newsletter-hiper-personalizado",
                        )
                      }
                    >
                      Conocer más
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Blog Home Section */}
      <section className="py-24 bg-white" style={{ display: "none" }}>
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">Como hacer Growth</h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Artículos, guías y recursos para potenciar tu estrategia de crecimiento orgánico
              </p>
            </div>

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
                  {[
                    {
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
                      title: "Cómo implementar una estrategia de SEO efectiva en 2025",
                      excerpt:
                        "Descubre las técnicas más actualizadas para posicionar tu contenido en buscadores y plataformas de IA, incluyendo optimización semántica...",
                      author: "María González",
                      date: "Mayo 25, 2025",
                      readTime: "12 min",
                      category: "SEO",
                    },
                    {
                      title: "Optimización para IAs: El futuro del SEO",
                      excerpt:
                        "Las IAs conversacionales están cambiando radicalmente cómo las personas buscan información. Aprende a optimizar tu contenido para ChatGPT, Claude y más...",
                      author: "Carlos Ruiz",
                      date: "Mayo 22, 2025",
                      readTime: "10 min",
                      category: "AI",
                    },
                    {
                      title: "Casos de éxito: Empresas que triplicaron su tráfico orgánico",
                      excerpt:
                        "Analizamos las estrategias que permitieron a estas empresas multiplicar su visibilidad online y generar más leads cualificados...",
                      author: "Ana Martín",
                      date: "Mayo 20, 2025",
                      readTime: "15 min",
                      category: "Casos de Éxito",
                    },
                    {
                      title: "Newsletter Marketing: Cómo crear contenido que tu audiencia espere",
                      excerpt:
                        "No es otro newsletter genérico. Descubre cómo crear una publicación que tu audiencia espere cada semana porque les das exactamente lo que necesitan...",
                      author: "Luis Fernández",
                      date: "Mayo 18, 2025",
                      readTime: "9 min",
                      category: "Content",
                    },
                    {
                      title: "Análisis de datos para Growth: Métricas que realmente importan",
                      excerpt:
                        "Aprende a identificar y medir las métricas que realmente impulsan el crecimiento de tu negocio, más allá de las vanity metrics...",
                      author: "Sofia López",
                      date: "Mayo 15, 2025",
                      readTime: "11 min",
                      category: "Analytics",
                    },
                  ].map((post, index) => (
                    <Card
                      key={index}
                      className={`bg-white border-slate-200 hover:border-orange-200 transition-all duration-300 hover:shadow-lg cursor-pointer group ${post.featured ? "md:col-span-2" : ""}`}
                      onClick={() =>
                        (window.location.href = `/como-hacer-growth/metodologias-de-growth-conceptos-y-proceso`)
                      }
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

      {/* AI Platforms Section */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
                Optimización para Plataformas de IA
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Preparamos tu contenido para ser la respuesta preferida de las IAs más utilizadas
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="col-span-full lg:col-span-1">
                <Card className="h-full bg-white border-slate-200">
                  <CardContent className="p-8">
                    <h3 className="text-2xl font-bold text-slate-900 mb-6">¿Por qué optimizar para IAs?</h3>
                    <div className="space-y-4 text-slate-700">
                      <p>
                        Las IAs conversacionales están cambiando radicalmente cómo las personas buscan información. Ya
                        no se trata solo de aparecer en Google, sino de ser la fuente que las IAs citan cuando responden
                        preguntas.
                      </p>
                      <p>
                        Nuestro enfoque de <strong>AI Entity Optimization (AEO)</strong> asegura que tu contenido sea
                        reconocido como una fuente confiable y relevante por los modelos de lenguaje más avanzados.
                      </p>
                      <div className="pt-4">
                        <a href="https://calendar.app.google/hpZiZQtju1VURQ1b6" target="_blank" rel="noopener noreferrer">
                          <Button className="bg-orange-500 hover:bg-orange-600 text-white rounded-lg w-full">
                            Solicitar Análisis AEO
                          </Button>
                        </a>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="col-span-full lg:col-span-2">
                <div className="grid grid-cols-2 gap-6">
                  {[
                    {
                      name: "OpenAI",
                      description:
                        "Optimizamos tu contenido para ser citado por ChatGPT en respuestas relevantes para tu industria.",
                    },
                    {
                      name: "Claude",
                      description:
                        "Preparamos tu contenido para ser reconocido como fuente de autoridad por Claude de Anthropic.",
                    },
                    {
                      name: "Perplexity",
                      description:
                        "Estructuramos tu información para maximizar la visibilidad en los resultados de búsqueda de Perplexity.",
                    },
                    {
                      name: "Gemini",
                      description: "Adaptamos tu contenido para ser reconocido y citado por Gemini de Google.",
                    },
                  ].map((platform, index) => (
                    <Card key={index} className="bg-white border-slate-200">
                      <CardContent className="p-6">
                        <div className="flex items-center mb-4">
                          <div className="w-12 h-12 flex-shrink-0 mr-4 bg-slate-100 rounded-lg flex items-center justify-center">
                            <span className="font-bold text-slate-700">{platform.name.charAt(0)}</span>
                          </div>
                          <h3 className="text-xl font-bold text-slate-900">{platform.name}</h3>
                        </div>
                        <p className="text-slate-600 mb-4">{platform.description}</p>
                        <Button
                          variant="outline"
                          className="text-orange-500 border-orange-200 hover:bg-orange-50 hover:text-orange-600 rounded-lg w-full"
                          style={{ display: "none" }}
                        >
                          Ver estrategia
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vertical Detail Sections */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div id="seo-estrategico" className="mb-24">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <Badge className="bg-orange-100 text-orange-700 mb-4">Vertical 1</Badge>
                  <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">SEO Estratégico para Productos</h2>
                  <div className="space-y-4 text-slate-700">
                    <p>
                      No más páginas genéricas que nadie lee. Creamos contenido que responde exactamente lo que tu
                      cliente busca antes de comprar, posicionándote como la autoridad en tu nicho.
                    </p>
                    <p>
                      Nuestro enfoque combina la optimización técnica con una estrategia de contenido basada en la
                      intención de búsqueda real de tu audiencia.
                    </p>

                    <div className="grid grid-cols-2 gap-4 my-8">
                      <div className="bg-slate-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-slate-900 mb-2">Para ecommerce</h4>
                        <p className="text-sm">Optimización de páginas de producto que venden mientras informan</p>
                      </div>
                      <div className="bg-slate-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-slate-900 mb-2">Para servicios</h4>
                        <p className="text-sm">Content hubs que demuestran tu conocimiento y generan confianza</p>
                      </div>
                    </div>

                    <a href="https://calendar.app.google/hpZiZQtju1VURQ1b6" target="_blank" rel="noopener noreferrer">
                      <Button className="bg-orange-500 hover:bg-orange-600 text-white rounded-lg mt-4">
                        Conocer nuestra metodología SEO
                      </Button>
                    </a>
                  </div>
                </div>
                <div className="relative">
                  <div className="rounded-lg overflow-hidden">
                    <div className="relative">
                      <img
                        src="/images/perplexity-shop-feature-ai-powered-shopping.png"
                        alt="Búsqueda en Perplexity sobre SEO estratégico"
                        className="w-full rounded-lg"
                      />
                      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/70 to-transparent"></div>
                      <div className="absolute bottom-4 left-4 flex items-center">
                        <div className="h-6 w-6 mr-2 bg-white rounded-full flex items-center justify-center">
                          <span className="text-xs font-bold">P</span>
                        </div>
                        <span className="text-white text-sm">Resultados de Perplexity AI</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div id="geo-aeo" className="mb-24">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="order-2 md:order-1 relative">
                  <div className="rounded-lg overflow-hidden">
                    <div className="relative">
                      <img
                        src="/images/pantallazo.png"
                        alt="Búsqueda en Perplexity sobre optimización para IAs"
                        className="w-full rounded-lg"
                      />
                      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/70 to-transparent"></div>
                      <div className="absolute bottom-4 left-4 flex items-center">
                        <div className="h-6 w-6 mr-2 bg-white rounded-full flex items-center justify-center">
                          <span className="text-xs font-bold">P</span>
                        </div>
                        <span className="text-white text-sm">Resultados de Perplexity</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="order-1 md:order-2">
                  <Badge className="bg-orange-100 text-orange-700 mb-4">Vertical 2</Badge>
                  <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                    GEO & AEO: El Futuro Ya Está Aquí
                  </h2>
                  <div className="space-y-4 text-slate-700">
                    <p>
                      Mientras otros siguen optimizando para Google de 2020, nosotros preparamos tu contenido para las
                      IAs que ya están respondiendo las preguntas de tus clientes.
                    </p>
                    <p>
                      Nuestra estrategia de AI Entity Optimization (AEO) asegura que cuando alguien pregunte sobre tu
                      industria a una IA, tu empresa aparezca como la solución recomendada.
                    </p>

                    <div className="flex flex-wrap gap-3 my-6">
                      {["ChatGPT", "Claude", "Perplexity", "Gemini", "DeepSeek"].map((ai, index) => (
                        <Badge key={index} className="bg-slate-100 text-slate-700">
                          {ai}
                        </Badge>
                      ))}
                    </div>

                    <a href="https://calendar.app.google/hpZiZQtju1VURQ1b6" target="_blank" rel="noopener noreferrer">
                      <Button
                        className="bg-orange-500 hover:bg-orange-600 text-white rounded-lg mt-4"
                      >
                        Descubrir optimización para IAs
                      </Button>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div id="newsletter-hiper-personalizado">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <Badge className="bg-orange-100 text-orange-700 mb-4">Vertical 3</Badge>
                  <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">Newsletter Hiper-Personalizado</h2>
                  <div className="space-y-4 text-slate-700">
                    <p>
                      No es otro newsletter genérico. Creamos una publicación que tu audiencia espera cada semana porque
                      les damos exactamente el contenido que necesitan para tomar mejores decisiones.
                    </p>
                    <p>
                      Combinamos curación inteligente, insights exclusivos de tu industria y casos reales de tu empresa
                      para posicionarte como el referente indiscutible de tu sector.
                    </p>

                    <div className="bg-slate-50 p-6 rounded-lg my-6">
                      <h4 className="font-semibold text-slate-900 mb-3">Resultados típicos:</h4>
                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div>
                          <div className="text-2xl font-bold text-orange-500">85%</div>
                          <p className="text-sm text-slate-600">Tasa de apertura promedio</p>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-orange-500">32%</div>
                          <p className="text-sm text-slate-600">Tasa de click-through</p>
                        </div>
                      </div>
                    </div>

                    <a href="https://calendar.app.google/hpZiZQtju1VURQ1b6" target="_blank" rel="noopener noreferrer">
                      <Button
                        className="bg-orange-500 hover:bg-orange-600 text-white rounded-lg mt-4"
                      >
                        Conocer el sistema Hiperpersonalizado
                      </Button>
                    </a>
                  </div>
                </div>
                <div className="relative">
                  <div className="rounded-lg overflow-hidden">
                    <div className="relative">
                      <img
                        src="/images/ChatGPT.png"
                        alt="Búsqueda en Perplexity sobre newsletters efectivos"
                        className="w-full rounded-lg"
                      />
                      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/70 to-transparent"></div>
                      <div className="absolute bottom-4 left-4 flex items-center">
                        <div className="h-6 w-6 mr-2 bg-white rounded-full flex items-center justify-center">
                          <span className="text-xs font-bold">G</span>
                        </div>
                        <span className="text-white text-sm">Resultados de ChatGPT</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ROIgo Banner */}
      <section id="roigo-banner" className="py-24 bg-gradient-to-r from-slate-900 to-slate-800 text-white">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl md:text-5xl font-bold mb-6">Deja de Canibalizar tu Tráfico Orgánico</h2>
                <p className="text-xl text-slate-300 mb-8 leading-relaxed">
                  ¿Sabías que el 73% de las empresas están compitiendo contra sí mismas en Google? ROIgo identifica y
                  elimina la canibalización de keywords que está limitando tu crecimiento orgánico.
                </p>
                <div className="space-y-4 mb-8">
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <span className="text-lg">Detecta keywords canibalizadas automáticamente</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <span className="text-lg">Optimiza la arquitectura de contenido</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <span className="text-lg">Aumenta el ROI de tu contenido existente</span>
                  </div>
                </div>
                <Button
                  size="lg"
                  className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 text-lg font-semibold rounded-lg"
                >
                  Conoce ROIgo →
                </Button>
              </div>
              <div className="relative">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300">Páginas analizadas</span>
                      <span className="text-2xl font-bold text-orange-400">2,847</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300">Keywords canibalizadas</span>
                      <span className="text-2xl font-bold text-red-400">156</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300">Tráfico recuperable</span>
                      <span className="text-2xl font-bold text-green-400">+47%</span>
                    </div>
                    <div className="pt-4 border-t border-white/20">
                      <p className="text-sm text-slate-400">
                        "Recuperamos el 47% del tráfico que se estaba perdiendo por canibalización"
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-orange-500 text-white relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">¿Listo Para Dejar de Competir Solo en Precio?</h2>
            <p className="text-xl mb-8 opacity-90 max-w-3xl mx-auto">
              Tu audiencia ya está buscando soluciones como la tuya. La pregunta es: ¿van a encontrarte a ti o a tu
              competencia?
            </p>
            <Button
              size="lg"
              className="bg-white text-orange-500 hover:bg-slate-100 px-12 py-6 text-xl font-semibold rounded-lg shadow-xl"
              onClick={scrollToTop}
            >
              <ArrowUp className="mr-2 h-5 w-5" /> Empezar Mi Análisis Gratuito
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center space-x-2 mb-6">
                <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">C</span>
                </div>
                <span className="text-xl font-bold text-white">Cacerola</span>
              </div>
              <p className="text-slate-400 mb-6">
                Growth Orgánico para empresas que piensan diferente. Construimos confianza a través de contenido
                estratégico.
              </p>
              <div className="flex space-x-4">
                <a href="https://www.linkedin.com/company/10176120/" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-orange-400">
                  LinkedIn
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-white font-bold mb-4">Servicios</h3>
              <ul className="space-y-2">
                {[
                  "SEO Estratégico",
                  "Optimización para IAs",
                  "Newsletter",
                  "Content Marketing",
                  "Análisis de Datos",
                ].map((item, index) => (
                  <li key={index}>
                    <a href="#" className="text-slate-400 hover:text-orange-400">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div style={{ display: "none" }}>
              <h3 className="text-white font-bold mb-4">Recursos</h3>
              <ul className="space-y-2">
                {["Blog", "Guías", "Webinars", "Podcast", "Herramientas"].map((item, index) => (
                  <li key={index}>
                    <a href="#" className="text-slate-400 hover:text-orange-400">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div style={{ display: "none" }}>
              <h3 className="text-white font-bold mb-4">Empresa</h3>
              <ul className="space-y-2">
                {["Sobre Nosotros", "Casos de Éxito", "Equipo", "Contacto", "Trabaja con Nosotros"].map(
                  (item, index) => (
                    <li key={index}>
                      <a href="#" className="text-slate-400 hover:text-orange-400">
                        {item}
                      </a>
                    </li>
                  ),
                )}
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-slate-500 text-sm">
              © {new Date().getFullYear()} Cacerola Growth Marketing. Todos los derechos reservados.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-slate-500 hover:text-orange-400 text-sm" style={{ display: "none" }}>
                Política de Privacidad
              </a>
              <a href="#" className="text-slate-500 hover:text-orange-400 text-sm" style={{ display: "none" }}>
                Términos de Servicio
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

// Componente principal exportado que envuelve el contenido en Suspense
export default function CacerolaRedesigned() {
  return (
    <Suspense fallback={<div className="p-8 flex justify-center items-center">Cargando...</div>}>
      <CacerolaContent />
    </Suspense>
  )
}
