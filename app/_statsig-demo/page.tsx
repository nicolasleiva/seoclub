import StatsigExample from "@/components/statsig-example";

export const metadata = {
  title: "Demostración de Statsig - Comprehensive Guide",
  description: "Demostración de Statsig: Esta página demuestra cómo Statsig se integra en la aplicación Cacerola para proporcionar 
        funcionalidades como feature flags, "
}


export default function StatsigDemoPage() {
  return (
    <div className="container mx-auto py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">Demostración de Statsig</h1>
      <p className="text-center mb-10 max-w-2xl mx-auto">
        Esta página demuestra cómo Statsig se integra en la aplicación Cacerola para proporcionar 
        funcionalidades como feature flags, experimentos A/B y análisis de eventos.
      </p>
      <div className="max-w-md mx-auto">
        <StatsigExample />
      </div>
    </div>
  );
}
