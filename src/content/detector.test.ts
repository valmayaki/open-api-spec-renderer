import { describe, it, expect } from 'vitest';
import { isOpenApiSpec, isYamlOrJsonUrl, isGitHubBlobUrl, isGitHubRawUrl } from './detector';

describe('OpenAPI Detector', () => {
  describe('isOpenApiSpec', () => {
    it('should detect valid JSON OpenAPI 3.0', () => {
      const spec = JSON.stringify({ openapi: '3.0.0', info: { title: 'Test' } });
      expect(isOpenApiSpec(spec)).toBe(true);
    });

    it('should detect valid JSON Swagger 2.0', () => {
      const spec = JSON.stringify({ swagger: '2.0', info: { title: 'Test' } });
      expect(isOpenApiSpec(spec)).toBe(true);
    });

    it('should detect valid YAML OpenAPI 3.0', () => {
      const spec = `openapi: 3.0.0
info:
  title: Test`;
      expect(isOpenApiSpec(spec)).toBe(true);
    });

    it('should fail on invalid JSON', () => {
      expect(isOpenApiSpec('{ invalid }')).toBe(false);
    });

    it('should fail on missing openapi/swagger fields', () => {
      expect(isOpenApiSpec('{"foo":"bar"}')).toBe(false);
    });
  });

  describe('isYamlOrJsonUrl', () => {
    it('should identify .json', () => expect(isYamlOrJsonUrl('https://example.com/spec.json')).toBe(true));
    it('should identify .yaml', () => expect(isYamlOrJsonUrl('https://example.com/spec.yaml')).toBe(true));
    it('should identify .yml', () => expect(isYamlOrJsonUrl('https://example.com/spec.yml')).toBe(true));
    it('should fail on .html', () => expect(isYamlOrJsonUrl('https://example.com/index.html')).toBe(false));
  });

  describe('isGitHubBlobUrl', () => {
    it('should identify GitHub blob', () => {
      expect(isGitHubBlobUrl('https://github.com/owner/repo/blob/main/spec.json')).toBe(true);
    });
    it('should fail on GitHub root', () => {
      expect(isGitHubBlobUrl('https://github.com/owner/repo')).toBe(false);
    });
  });
});
