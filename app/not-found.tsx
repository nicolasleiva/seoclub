// La página 404 completamente estática sin hooks de cliente ni useSearchParams()
// Esta versión es compatible con exportación estática

// Marcamos explícitamente el componente como generado estáticamente
export const dynamic = 'force-static';
export const dynamicParams = false;

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white px-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-12 h-12 text-orange-500"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h1 className="text-4xl font-bold text-slate-900 mb-4">Página no encontrada</h1>
        <p className="text-lg text-slate-600 mb-8">
          Lo sentimos, la página que estás buscando no existe o ha sido trasladada.
        </p>
        <div className="space-y-4">
          <a href="/" className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-6 rounded-lg transition-colors inline-block">
            Volver al inicio
          </a>
          <div className="block text-slate-500 mt-4">
            ¿Necesitas ayuda? <a href="/contacto" className="text-orange-500 hover:underline">Contáctanos</a>
          </div>
        </div>
      </div>
    </div>
  );
}
