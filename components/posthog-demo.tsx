"use client";

import { Button } from "./ui/button";
import { captureEvent, captureFunnelStep } from "@/lib/posthog";

export function PosthogDemo() {
  // Capturar un evento simple al hacer clic en un botón
  const handleClickEvent = () => {
    captureEvent("button_clicked", {
      component: "PosthogDemo",
      buttonType: "primary",
      timestamp: new Date().toISOString(),
    });
  };

  // Capturar un paso en un embudo de conversión (funnel)
  const handleFunnelStep = (step: string) => {
    captureFunnelStep("conversion_funnel", step, {
      component: "PosthogDemo",
      timestamp: new Date().toISOString(),
    });
  };

  return (
    <div className="p-6 border rounded-lg bg-background">
      <h2 className="text-2xl font-bold mb-4">PostHog Demo</h2>
      <p className="mb-4 text-muted-foreground">
        Este componente demuestra cómo usar PostHog para el seguimiento de eventos.
        Haga clic en los botones para enviar eventos a PostHog.
      </p>
      
      <div className="flex flex-col gap-4 md:flex-row">
        <Button 
          onClick={handleClickEvent}
          variant="default"
        >
          Registrar Evento Simple
        </Button>
        
        <Button 
          onClick={() => handleFunnelStep("started")}
          variant="outline"
        >
          Iniciar Embudo
        </Button>
        
        <Button 
          onClick={() => handleFunnelStep("completed")}
          variant="secondary"
        >
          Completar Embudo
        </Button>
      </div>
      
      <div className="mt-4 text-sm text-muted-foreground">
        <p>
          Los eventos se enviarán a su cuenta de PostHog. 
          Verifique la consola del navegador para confirmar que los eventos se están registrando.
        </p>
      </div>
    </div>
  );
}
