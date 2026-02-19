import yaml from 'js-yaml';

export interface OpenApiInfo {
  openapi?: string;
  swagger?: string;
  info?: {
    title?: string;
    version?: string;
  };
}

export function isOpenApiSpec(content: string): boolean {
  try {
    const data = JSON.parse(content) as OpenApiInfo;
    return !!(data.openapi || data.swagger);
  } catch (e) {
    try {
      const data = yaml.load(content) as OpenApiInfo;
      return !!(data.openapi || data.swagger);
    } catch (e2) {
      return false;
    }
  }
}

export function isYamlOrJsonUrl(url: string): boolean {
  const extension = url.split('.').pop()?.toLowerCase();
  return ['json', 'yaml', 'yml'].includes(extension || '');
}

export function isGitHubRawUrl(url: string): boolean {
  return url.startsWith('https://raw.githubusercontent.com/');
}

export function isGitHubBlobUrl(url: string): boolean {
  return url.startsWith('https://github.com/') && url.includes('/blob/');
}
