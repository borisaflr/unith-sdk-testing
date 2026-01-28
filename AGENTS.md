# AGENTS.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

This is a test/demo application for the UNITH AI Core Client SDK (`@unith-ai/core-client`), which provides digital human conversation capabilities with real-time audio and video streaming. The project is a simple browser-based interface that demonstrates connecting to, starting, and disconnecting from a UNITH digital human.

## Architecture

### Technology Stack
- **Frontend**: Vanilla JavaScript (ES modules), HTML5
- **Build Tool**: Vite (for development server and bundling)
- **Core SDK**: `@unith-ai/core-client` v1.10.4
- **Module System**: CommonJS (package.json specifies `"type": "commonjs"`)

### Key Files
- `index.html` - Main UI with video container, control buttons, and event log
- `main.js` - Application logic and UNITH SDK integration
- `package.json` - Dependencies and build scripts

### Application Flow
1. **Connect**: Establishes WebSocket connection to UNITH AI, initializes digital human with credentials (orgId, headId, apiKey)
2. **Start Session**: Begins audio/video playback (required after user interaction for browser audio context)
3. **Disconnect**: Ends session, cleans up resources, and resets UI state

### SDK Integration Pattern
The app uses the `Conversation.startDigitalHuman()` method with:
- Configuration object containing credentials and HTML element for video rendering
- Callback handlers: `onConnect`, `onStatusChange`, `onError`
- Session lifecycle methods: `startSession()`, `endSession()`

## Development Commands

### Install dependencies
```bash
npm install
```

### Run development server
```bash
npm run dev
```
This starts Vite dev server (typically on http://localhost:5173)

### Build for production
```bash
npm run build
```

### No test suite
The project currently has no tests configured. The test script in package.json is a placeholder.

## Credentials Management

The application contains hardcoded credentials in `main.js` (CONFIG object):
- `orgId`: Organization identifier
- `headId`: Specific digital human head identifier  
- `apiKey`: Authentication key

**Important**: When modifying or suggesting changes to credentials, never expose them in logs, console output, or command history. If credentials need to be moved to environment variables or a config file, ensure they are not committed to version control.

## Common Development Patterns

### Adding Event Handlers
When adding new SDK event callbacks, register them in the `Conversation.startDigitalHuman()` configuration object. Available callbacks include:
- `onConnect`, `onDisconnect`, `onStatusChange`, `onMessage`
- `onSpeakingStart`, `onSpeakingEnd`, `onMuteStatusChange`
- `onTimeout`, `onTimeoutWarning`, `onKeepSession`
- `onError`

### Logging Pattern
Use the `log(message, type)` helper function for consistent UI logging:
- `type`: "info" (blue), "success" (green), "error" (red), "message" (purple)
- Automatically appends to #log div with timestamp and scrolls to bottom

### UI State Management
Button states are managed based on conversation lifecycle:
- Initial: connect-btn enabled, others disabled
- After connect: start-btn and disconnect-btn enabled
- After disconnect: reset to initial state
