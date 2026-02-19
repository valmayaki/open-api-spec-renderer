# OpenAPI Spec Renderer

A Chrome extension that detects OpenAPI (Swagger) specifications on GitHub and other websites, and renders them using Swagger UI.

## Features

- **Automatic Detection:** Identifies JSON and YAML OpenAPI specifications.
- **GitHub Integration:** Adds a "View in Swagger UI" button next to "Raw" on GitHub file views.
- **Direct Rendering:** Shows a banner to render when viewing raw JSON/YAML files identified as OpenAPI.
- **Sandboxed Frame Support:** Opens viewer in a new tab via background script to bypass iframe restrictions.

## Installation

### From Source
1. Clone this repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Build the extension:
   ```bash
   npm run build
   ```
4. Load the extension in Chrome:
   - Go to `chrome://extensions/`.
   - Enable **Developer mode**.
   - Click **Load unpacked** and select the `dist` directory.

## Development

- `npm run dev`: Start Vite development server.
- `npm run build`: Build the extension for production.
- `npm test`: Run unit tests with Vitest.
- `npm run test:e2e`: Run end-to-end tests with Playwright.

## Project Structure

- `src/background/`: Service worker for handling messages and tab operations.
- `src/content/`: Scripts injected into web pages to detect specs.
- `src/ui/`: The Swagger UI renderer page.
- `src/storage/`: Utility for extension settings.
- `src/utils/`: Helper functions.

## License

ISC
