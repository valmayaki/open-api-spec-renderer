# Changelog

All notable changes to this project will be documented in this file.

## [1.0.0] - 2026-02-19

### Added
- Initial release of OpenAPI Spec Renderer.
- Automatic detection of OpenAPI 3.x and Swagger 2.0 specs (JSON/YAML).
- GitHub integration: "View in Swagger UI" button on file blob pages.
- Banner notification for raw spec files on GitHub and other domains.
- Swagger UI integration for rendering specs in a clean, dedicated interface.
- Support for `<all_urls>` to bypass CORS for spec fetching and "Try it out" API requests.
- Background script proxying for robust spec retrieval in sandboxed environments.

### Fixed
- Fixed "Blocked opening window" error in sandboxed frames (GitHub Raw views) by using `chrome.tabs.create` via background script.
- Fixed "Blocked script execution" error in sandboxed JSON frames.
- Improved Swagger UI initialization to handle various bundle export patterns.
- Resolved E2E test timeouts by configuring Vite dev server with explicit host (`127.0.0.1`).
- Fixed "No API definition provided" error by explicitly parsing YAML/JSON content with `js-yaml` before rendering.

### Testing
- Comprehensive unit tests for spec detection logic.
- Playwright E2E tests for UI rendering and external API server support.
