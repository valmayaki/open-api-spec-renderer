import { isOpenApiSpec, isGitHubBlobUrl } from './detector';

function openInSwagger(specUrl: string) {
  const uiUrl = chrome.runtime.getURL(`src/ui/index.html?spec=${encodeURIComponent(specUrl)}`);
  chrome.runtime.sendMessage({ type: 'OPEN_TAB', url: uiUrl });
}

async function init() {
  try {
    const currentUrl = window.location.href;

    // GitHub Blob detection
    if (isGitHubBlobUrl(currentUrl)) {
      const rawButton = document.querySelector('a#raw-url, a[data-testid="raw-button"]');
      if (rawButton && !document.getElementById('swagger-view-btn')) {
        const btn = document.createElement('button');
        btn.id = 'swagger-view-btn';
        btn.className = 'btn btn-sm BtnGroup-item';
        btn.innerText = 'View in Swagger UI';
        btn.style.marginLeft = '4px';

        const href = rawButton.getAttribute('href') || '';
        const specUrl = href.startsWith('http') ? href : `https://github.com${href}`;

        btn.addEventListener('click', (e) => {
          e.preventDefault();
          openInSwagger(specUrl);
        });

        rawButton.parentElement?.appendChild(btn);
      }
      return;
    }

    // Direct JSON/YAML view detection
    const isRawView = document.contentType === 'application/json' || 
                      currentUrl.includes('raw.githubusercontent.com');

    if (isRawView) {
      const content = document.body.innerText;
      if (isOpenApiSpec(content) && !document.getElementById('swagger-view-bar')) {
        const bar = document.createElement('div');
        bar.id = 'swagger-view-bar';
        bar.style.cssText = `
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          background: #333;
          color: white;
          padding: 10px;
          z-index: 999999;
          text-align: center;
          font-family: sans-serif;
        `;

        const btn = document.createElement('button');
        btn.innerText = 'Render in Swagger UI';
        btn.style.cssText = `
          background: #49cc90;
          color: white;
          border: none;
          margin-left: 10px;
          font-weight: bold;
          padding: 4px 12px;
          border-radius: 4px;
          cursor: pointer;
        `;
        btn.onclick = () => openInSwagger(currentUrl);

        const dismiss = document.createElement('button');
        dismiss.innerText = 'Dismiss';
        dismiss.style.cssText = `
          margin-left: 20px;
          background: none;
          border: 1px solid white;
          color: white;
          cursor: pointer;
          padding: 2px 8px;
          border-radius: 4px;
        `;
        dismiss.onclick = () => bar.remove();

        bar.appendChild(document.createTextNode('This appears to be an OpenAPI spec. '));
        bar.appendChild(btn);
        bar.appendChild(dismiss);
        document.body.prepend(bar);
      }
    }
  } catch (err) {
    console.debug('OpenAPI Spec Renderer: Skipping init due to environment restrictions', err);
  }
}

// Initial run
init();

// Support GitHub's soft navigation
document.addEventListener('pjax:end', init);
document.addEventListener('turbo:load', init);
