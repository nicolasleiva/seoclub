from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, HttpUrl
import asyncio
import httpx
from bs4 import BeautifulSoup
import base64
from urllib.parse import urljoin, urlparse
import re
import logging
from typing import Optional
import uuid
from datetime import datetime

# Configurar logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Web Scraper API",
    description="API para descargar páginas web completas con todos sus recursos embebidos",
    version="1.0.0"
)

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Almacenamiento temporal de resultados
results_storage = {}

class DownloadRequest(BaseModel):
    url: HttpUrl
    inline_css: bool = True
    inline_images: bool = True
    inline_scripts: bool = True
    timeout: int = 30
    max_retries: int = 3

class DownloadResponse(BaseModel):
    task_id: str
    status: str
    message: str

class ResultResponse(BaseModel):
    task_id: str
    status: str
    url: Optional[str] = None
    html_content: Optional[str] = None
    error: Optional[str] = None
    timestamp: str

async def fetch_resource(client, url, is_binary=False, timeout=30, max_retries=3):
    for attempt in range(max_retries):
        try:
            response = await client.get(url, timeout=timeout, follow_redirects=True)
            if response.status_code == 200:
                if is_binary:
                    content = response.content
                    content_type = response.headers.get('Content-Type', 'application/octet-stream')
                    return f"data:{content_type};base64,{base64.b64encode(content).decode('utf-8')}"
                else:
                    return response.text
            elif response.status_code == 404:
                logger.error(f"Recurso no encontrado: {url}")
                return None
            else:
                logger.warning(f"Error al obtener recurso: {url}. Estado: {response.status_code}")
        except httpx.TimeoutException:
            logger.warning(f'Timeout fetching resource: {url}. Intento {attempt + 1} de {max_retries}')
        except Exception as e:
            logger.error(f'Error al obtener recurso: {url}. Error: {e}. Intento {attempt + 1} de {max_retries}')
        
        if attempt < max_retries - 1:
            await asyncio.sleep(2 ** attempt)
    
    return None

async def inline_css(client, link_element, base_url, timeout, max_retries):
    href = urljoin(base_url, link_element['href'])
    css_content = await fetch_resource(client, href, timeout=timeout, max_retries=max_retries)
    if css_content:
        resolved_css = re.sub(
            r'url\((?![\'"]?(?:data:|https?:|ftp:))[\'"]?([^\'"]+)[\'"]?\)',
            lambda m: f'url({urljoin(href, m.group(1))})',
            css_content
        )
        return f'<style>{resolved_css}</style>'
    return ''

async def inline_images(client, soup, base_url, timeout, max_retries):
    images = soup.find_all('img')
    tasks = []
    for img in images:
        if img.get('src'):
            src = urljoin(base_url, img['src'])
            task = asyncio.create_task(fetch_resource(client, src, is_binary=True, timeout=timeout, max_retries=max_retries))
            tasks.append((img, task))
    
    for img, task in tasks:
        data_uri = await task
        if data_uri:
            img['src'] = data_uri

async def inline_scripts(client, soup, base_url, timeout, max_retries):
    scripts = soup.find_all('script', src=True)
    for script in scripts:
        src = urljoin(base_url, script['src'])
        script_content = await fetch_resource(client, src, timeout=timeout, max_retries=max_retries)
        if script_content:
            new_script = soup.new_tag('script')
            new_script.string = script_content
            script.replace_with(new_script)

async def download_complete_html(client, url, config: DownloadRequest):
    logger.info(f"Descargando HTML de {url}")
    html_content = await fetch_resource(client, url, timeout=config.timeout, max_retries=config.max_retries)
    if not html_content:
        logger.error(f"No se pudo obtener el contenido HTML de {url}")
        return None

    soup = BeautifulSoup(html_content, 'html.parser')

    # Inline CSS
    if config.inline_css:
        logger.info("Incrustando CSS")
        css_tasks = []
        for link in soup.find_all('link', rel='stylesheet'):
            css_tasks.append(inline_css(client, link, url, config.timeout, config.max_retries))
        inlined_css = await asyncio.gather(*css_tasks)
        for link, style in zip(soup.find_all('link', rel='stylesheet'), inlined_css):
            if style:
                link.replace_with(BeautifulSoup(style, 'html.parser'))

    # Inline images
    if config.inline_images:
        logger.info("Incrustando imágenes")
        await inline_images(client, soup, url, config.timeout, config.max_retries)

    # Inline scripts
    if config.inline_scripts:
        logger.info("Incrustando scripts")
        await inline_scripts(client, soup, url, config.timeout, config.max_retries)

    # Add base tag to ensure relative links work correctly
    base_tag = soup.new_tag('base', href=url)
    if soup.head:
        soup.head.insert(0, base_tag)

    return str(soup)

async def process_download(task_id: str, url: str, config: DownloadRequest):
    try:
        results_storage[task_id] = {
            "status": "processing",
            "url": url,
            "timestamp": datetime.now().isoformat()
        }
        
        async with httpx.AsyncClient(follow_redirects=True) as client:
            html_content = await download_complete_html(client, url, config)
            
            if html_content:
                results_storage[task_id] = {
                    "status": "completed",
                    "url": url,
                    "html_content": html_content,
                    "timestamp": datetime.now().isoformat()
                }
                logger.info(f"Descarga completada para task_id: {task_id}")
            else:
                results_storage[task_id] = {
                    "status": "failed",
                    "url": url,
                    "error": "No se pudo descargar el HTML",
                    "timestamp": datetime.now().isoformat()
                }
    except Exception as e:
        logger.error(f"Error procesando descarga para {task_id}: {e}")
        results_storage[task_id] = {
            "status": "failed",
            "url": url,
            "error": str(e),
            "timestamp": datetime.now().isoformat()
        }

@app.get("/")
async def root():
    return {
        "message": "Web Scraper API",
        "version": "1.0.0",
        "endpoints": {
            "POST /download": "Iniciar descarga de página web",
            "GET /result/{task_id}": "Obtener resultado de descarga",
            "GET /status/{task_id}": "Verificar estado de descarga",
            "GET /docs": "Documentación interactiva"
        }
    }

@app.post("/download", response_model=DownloadResponse)
async def download_page(request: DownloadRequest, background_tasks: BackgroundTasks):
    """
    Inicia la descarga de una página web con todos sus recursos embebidos.
    
    - **url**: URL de la página a descargar
    - **inline_css**: Incrustar CSS (default: true)
    - **inline_images**: Incrustar imágenes (default: true)
    - **inline_scripts**: Incrustar scripts (default: true)
    - **timeout**: Timeout en segundos (default: 30)
    - **max_retries**: Número máximo de reintentos (default: 3)
    """
    task_id = str(uuid.uuid4())
    
    background_tasks.add_task(process_download, task_id, str(request.url), request)
    
    return DownloadResponse(
        task_id=task_id,
        status="pending",
        message=f"Descarga iniciada para {request.url}"
    )

@app.get("/status/{task_id}")
async def get_status(task_id: str):
    """
    Verifica el estado de una descarga sin retornar el contenido HTML completo.
    """
    if task_id not in results_storage:
        raise HTTPException(status_code=404, detail="Task ID no encontrado")
    
    result = results_storage[task_id]
    return {
        "task_id": task_id,
        "status": result["status"],
        "url": result.get("url"),
        "timestamp": result.get("timestamp"),
        "has_content": "html_content" in result
    }

@app.get("/result/{task_id}", response_model=ResultResponse)
async def get_result(task_id: str):
    """
    Obtiene el resultado completo de una descarga, incluyendo el HTML.
    """
    if task_id not in results_storage:
        raise HTTPException(status_code=404, detail="Task ID no encontrado")
    
    result = results_storage[task_id]
    return ResultResponse(
        task_id=task_id,
        status=result["status"],
        url=result.get("url"),
        html_content=result.get("html_content"),
        error=result.get("error"),
        timestamp=result.get("timestamp")
    )

@app.get("/result/{task_id}/html", response_class=HTMLResponse)
async def get_html(task_id: str):
    """
    Obtiene directamente el HTML descargado para visualización.
    """
    if task_id not in results_storage:
        raise HTTPException(status_code=404, detail="Task ID no encontrado")
    
    result = results_storage[task_id]
    
    if result["status"] != "completed":
        raise HTTPException(
            status_code=400, 
            detail=f"La descarga está en estado: {result['status']}"
        )
    
    return HTMLResponse(content=result.get("html_content", ""))

@app.delete("/result/{task_id}")
async def delete_result(task_id: str):
    """
    Elimina un resultado del almacenamiento.
    """
    if task_id not in results_storage:
        raise HTTPException(status_code=404, detail="Task ID no encontrado")
    
    del results_storage[task_id]
    return {"message": f"Resultado {task_id} eliminado"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)