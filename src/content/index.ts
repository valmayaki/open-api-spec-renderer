import { isOpenApiSpec, isGitHubBlobUrl } from './detector';

function openSwaggerUI(specUrl: string) {
  const viewerUrl = chrome.runtime.getURL(`src/ui/index.html?spec=${encodeURIComponent(specUrl)}`);
  chrome.runtime.sendMessage({ type: 'OPEN_TAB', url: viewerUrl });
}

async function init() {
  try {
    const url = window.location.href;
    
    // GitHub Blob Page (Normal HTML)
    if (isGitHubBlobUrl(url)) {
      const rawButton = document.querySelector('a#raw-url, a[data-testid="raw-button"]');
      if (rawButton && !document.getElementById('swagger-view-btn')) {
        const swaggerBtn = document.createElement('button');
        swaggerBtn.id = 'swagger-view-btn';
        swaggerBtn.className = 'btn btn-sm BtnGroup-item';
        swaggerBtn.innerText = 'View in Swagger UI';
        swaggerBtn.style.marginLeft = '4px';
        
        const rawHref = rawButton.getAttribute('href') || '';
        const fullRawUrl = rawHref.startsWith('http') ? rawHref : `https://github.com${rawHref}`;
        
        swaggerBtn.addEventListener('click', (e) => {
          e.preventDefault();
          openSwaggerUI(fullRawUrl);
        });
        rawButton.parentElement?.appendChild(swaggerBtn);
      }
      return;
    }

    // For raw pages, GitHub often sandboxes JSON views or uses a built-in viewer.
    // If we are in a sandboxed frame without 'allow-scripts', this script might be restricted.
    // We check if we can actually manipulate the DOM and if it's likely a spec.
    
    // Skip if it's a known non-HTML response that might be sandboxed or if we're in a weird state
    if (document.contentType === 'application/json' || url.includes('raw.githubusercontent.com')) {
      // We still try to detect, but we are careful.
      const content = document.body.innerText;
      if (isOpenApiSpec(content)) {
        if (!document.getElementById('swagger-view-bar')) {
          const banner = document.createElement('div');
          banner.id = 'swagger-view-bar';
          banner.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; background: #333; color: white; padding: 10px; z-index: 999999; text-align: center; font-family: sans-serif;';
          
          const btn = document.createElement('button');
          btn.innerText = 'Render in Swagger UI';
          btn.style.cssText = 'background: #49cc90; color: white; border: none; margin-left: 10px; font-weight: bold; padding: 4px 12px; border-radius: 4px; cursor: pointer;';
          btn.onclick = () => openSwaggerUI(url);
          
          const closeBtn = document.createElement('button');
          closeBtn.innerText = 'Dismiss';
          closeBtn.style.cssText = 'margin-left: 20px; background: none; border: 1px solid white; color: white; cursor: pointer; padding: 2px 8px; border-radius: 4px;';
          closeBtn.onclick = () => banner.remove();

          banner.appendChild(document.createTextNode('This appears to be an OpenAPI spec. '));
          banner.appendChild(btn);
          banner.appendChild(closeBtn);
          
          document.body.prepend(banner);
        }
      }
    }
  } catch (e) {
    console.debug('OpenAPI Spec Renderer: Skipping init due to environment restrictions', e);
  }
}

// Run init
init();

// Handle GitHub navigation
document.addEventListener('pjax:end', init);
document.addEventListener('turbo:load', init);
