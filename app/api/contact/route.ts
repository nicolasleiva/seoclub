import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    // Obtener el cuerpo de la petición
    const body = await request.json();
    
    // Validar que tenemos la URL del webhook configurada
    const webhookUrl = process.env.N8N_WEBHOOK_URL;
    if (!webhookUrl) {
      console.error('N8N_WEBHOOK_URL no está configurada');
      return NextResponse.json(
        { error: 'Webhook no configurado. Por favor configura N8N_WEBHOOK_URL en tu archivo .env.local' },
        { status: 500 }
      );
    }

    console.log(`Intentando enviar datos al webhook: ${webhookUrl}`);
    
    // Validar formato URL
    try {
      new URL(webhookUrl);
    } catch (urlError) {
      console.error('URL de webhook inválida:', webhookUrl);
      return NextResponse.json(
        { error: 'URL de webhook inválida. Revisa el formato en tu archivo .env.local' },
        { status: 500 }
      );
    }

    // Enviar los datos al webhook de n8n
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    console.log(`Respuesta del webhook: ${response.status} ${response.statusText}`);

    if (!response.ok) {
      // Intentar obtener detalles del error
      let errorDetails;
      try {
        errorDetails = await response.text();
        console.error('Detalles del error:', errorDetails);
      } catch (e) {
        console.error('No se pudieron obtener detalles del error');
      }

      if (response.status === 404) {
        throw new Error(`El webhook no fue encontrado (404). Verifica que la URL sea correcta en .env.local`);
      } else {
        throw new Error(`Error al enviar datos: ${response.status} ${response.statusText}`);
      }
    }

    // Procesar la respuesta del webhook
    let responseData;
    try {
      responseData = await response.json();
    } catch (e) {
      // Si la respuesta no es JSON, usar un objeto genérico
      console.warn('La respuesta del webhook no es JSON válido:', e);
      responseData = { message: 'Datos recibidos (formato no-JSON)' };
    }

    // Devolver la respuesta al cliente
    return NextResponse.json({ 
      success: true, 
      message: 'Datos enviados correctamente al webhook',
      data: responseData
    });

  } catch (error) {
    console.error('Error en el envío al webhook:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Error desconocido' 
      },
      { status: 500 }
    );
  }
}
