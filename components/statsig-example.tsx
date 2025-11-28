"use client";

import { useState, useEffect } from "react";
import { checkGate, getExperiment, logEvent } from "@/lib/statsig";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function StatsigExample() {
  const [featureEnabled, setFeatureEnabled] = useState(false);
  const [experimentVariant, setExperimentVariant] = useState("");
  const [eventLogged, setEventLogged] = useState(false);

  useEffect(() => {
    // Verificar si una feature flag está activa
    const isFeatureEnabled = checkGate("new_feature_enabled");
    setFeatureEnabled(isFeatureEnabled);

    // Obtener un experimento (por ejemplo, una prueba A/B)
    const variant = getExperiment<string>("button_color_test", "default");
    setExperimentVariant(variant);
  }, []);

  const handleButtonClick = () => {
    // Registrar un evento cuando el usuario hace clic en el botón
    logEvent("example_button_clicked", 1, { 
      location: "statsig_example_component" 
    });
    setEventLogged(true);

    // Resetear el estado después de 2 segundos
    setTimeout(() => {
      setEventLogged(false);
    }, 2000);
  };

  // Determinar el color del botón basado en el experimento
  const getButtonColorClass = () => {
    switch (experimentVariant) {
      case "blue":
        return "bg-blue-500 hover:bg-blue-600";
      case "green":
        return "bg-green-500 hover:bg-green-600";
      case "purple":
        return "bg-purple-500 hover:bg-purple-600";
      default:
        return "bg-orange-500 hover:bg-orange-600";
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Ejemplo de Statsig</CardTitle>
        <CardDescription>Demostración de cómo funciona Statsig en tu aplicación</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span>Feature Flag: "new_feature_enabled"</span>
          <Badge variant={featureEnabled ? "default" : "outline"}>
            {featureEnabled ? "Activado" : "Desactivado"}
          </Badge>
        </div>

        <div className="flex items-center justify-between">
          <span>Experimento: "button_color_test"</span>
          <Badge variant="secondary">{experimentVariant || "default"}</Badge>
        </div>

        {featureEnabled && (
          <div className="p-3 bg-green-50 text-green-700 rounded-md mt-2">
            ¡Esta es una nueva característica que solo ven algunos usuarios!
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          className={`w-full ${getButtonColorClass()}`} 
          onClick={handleButtonClick}
        >
          {eventLogged ? "¡Evento registrado!" : "Registrar evento"}
        </Button>
      </CardFooter>
    </Card>
  );
}
