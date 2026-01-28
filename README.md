# UNITH SDK Test

A test/demo application for the UNITH AI Core Client SDK, demonstrating digital human conversation capabilities with real-time audio and video streaming.

## GitHub Pages Deployment

This repository is configured to be deployed via GitHub Pages using the `/dist` folder.

### Setup Instructions

1. Go to your GitHub repository: https://github.com/borisaflr/unith-sdk-testing
2. Navigate to **Settings** > **Pages**
3. Under **Source**, select:
   - **Deploy from a branch**
   - Branch: `main`
   - Folder: `/dist`
4. Click **Save**
5. Wait a few minutes for the deployment to complete
6. Your site will be available at: `https://borisaflr.github.io/unith-sdk-testing/`

### Local Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## Technology Stack

- **Frontend**: Vanilla JavaScript (ES modules), HTML5
- **Build Tool**: Vite
- **SDK**: `@unith-ai/core-client` v1.10.4

## Features

- Connect to UNITH AI digital human
- Real-time audio/video streaming
- Session management (start/stop)
- Event logging interface
