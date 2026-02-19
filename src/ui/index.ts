import SwaggerUI from 'swagger-ui-dist';
import 'swagger-ui-dist/swagger-ui.css';
import yaml from 'js-yaml';

function getSpecUrl(): string | null {
  const urlParams = new URLSearchParams(window.location.search);
  const spec = urlParams.get('spec');
  if (spec?.startsWith('/')) {
    return `https://github.com${spec}`;
  }
  return spec;
}

const specUrl = getSpecUrl();

function renderError(message: string) {
  const container = document.getElementById('swagger-ui');
  if (container) {
    container.innerHTML = `<div style="padding: 20px; font-family: sans-serif; color: #d32f2f;">
      <h3>Failed to load OpenAPI spec</h3>
      <p>${message}</p>
      <p style="font-size: 0.8em; color: #666;">URL: ${specUrl}</p>
    </div>`;
  }
}

async function init() {
  const container = document.getElementById('swagger-ui');
  if (!container) return;

  if (!specUrl) {
    container.innerHTML = '<div style="padding: 20px; font-family: sans-serif; color: #333;">No OpenAPI spec URL provided. Pass it in the URL as ?spec=URL.</div>';
    return;
  }

  try {
    chrome.runtime.sendMessage({ type: 'FETCH_SPEC', url: specUrl }, (response) => {
      if (chrome.runtime.lastError) {
        renderError(chrome.runtime.lastError.message || 'Unknown error communicating with background script.');
        return;
      }

      if (response && response.data) {
        const bundle = (SwaggerUI as any).SwaggerUIBundle || SwaggerUI;
        const presets = bundle.presets || (SwaggerUI as any).presets;

        if (typeof bundle !== 'function') {
          renderError('SwaggerUIBundle is not a function. Check your imports.');
          return;
        }

        let specData: any;
        try {
          // Use js-yaml to parse (it handles both JSON and YAML)
          specData = yaml.load(response.data);
        } catch (e: any) {
          console.error('Failed to parse spec:', e);
          renderError(`Failed to parse specification: ${e.message}`);
          return;
        }

        if (!specData || typeof specData !== 'object') {
          renderError('Parsed specification is not a valid object.');
          return;
        }

        bundle({
          dom_id: '#swagger-ui',
          spec: specData,
          deepLinking: true,
          presets: [
            presets?.apis,
            (SwaggerUI as any).SwaggerUIStandalonePreset || (bundle as any).SwaggerUIStandalonePreset
          ].filter(Boolean),
          layout: "BaseLayout"
        });
      } else {
        renderError(response?.error || 'Failed to fetch spec content.');
      }
    });
  } catch (error: any) {
    renderError(error.message);
  }
}

init();
