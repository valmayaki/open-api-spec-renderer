export interface OpenApiInfo {
  openapi?: string;
  swagger?: string;
}

export function isOpenApiSpec(content: string): boolean {
  if (!content) return false;

  // JSON detection
  try {
    const data = JSON.parse(content) as OpenApiInfo;
    if (data.openapi || data.swagger) {
      return true;
    }
  } catch (e) {
    // Not JSON, continue to YAML check
  }

  // Basic YAML detection (without external lib to avoid ESM chunks in content script)
  const trimmed = content.trim();
  // Check for common OpenAPI/Swagger keys at start of lines
  const hasOpenApi = /^openapi\s*:/m.test(trimmed);
  const hasSwagger = /^swagger\s*:/m.test(trimmed);
  
  return hasOpenApi || hasSwagger;
}

export function isYamlOrJsonUrl(url: string): boolean {
  const urlParts = url.split('?')[0].split('/');
  const filename = urlParts[urlParts.length - 1];
  const extension = filename.split('.').pop()?.toLowerCase();
  return ['json', 'yaml', 'yml'].includes(extension || '');
}

export function isGitHubRawUrl(url: string): boolean {
  return url.startsWith('https://raw.githubusercontent.com/');
}

export function isGitHubBlobUrl(url: string): boolean {
  return url.startsWith('https://github.com/') && url.includes('/blob/');
}
