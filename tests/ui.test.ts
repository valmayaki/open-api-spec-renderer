import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  // Mock chrome API for the UI page
  await page.addInitScript(() => {
    (window as any).chrome = {
      runtime: {
        lastError: null,
        sendMessage: (message: any, callback: (response: any) => void) => {
          if (message.type === 'FETCH_SPEC') {
            // Mock a successful fetch of a spec with an external server
            const mockSpec = {
              openapi: "3.0.0",
              info: {
                title: "External API Test",
                version: "1.0.0"
              },
              servers: [
                { url: "https://api.external.com/v1" }
              ],
              paths: {
                "/users": {
                  get: {
                    responses: {
                      "200": { description: "OK" }
                    }
                  }
                }
              }
            };
            setTimeout(() => callback({ data: JSON.stringify(mockSpec) }), 100);
          }
        }
      }
    };
  });
});

test('UI renders placeholder when no spec provided', async ({ page }) => {
  await page.goto('/src/ui/index.html');
  await expect(page.locator('#swagger-ui')).toContainText('No OpenAPI spec URL provided.');
});

test('UI renders Swagger with external server URL', async ({ page }) => {
  const specUrl = 'https://example.com/external-spec.json';
  await page.goto(`/src/ui/index.html?spec=${specUrl}`);
  
  await page.waitForSelector('.swagger-ui', { timeout: 10000 });
  
  // Check for the title
  await expect(page.locator('.title')).toContainText('External API Test');
  
  // Check if the external server is listed
  const serverUrl = await page.locator('.servers option').first().textContent();
  expect(serverUrl).toContain('https://api.external.com/v1');
});
