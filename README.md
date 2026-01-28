# UNITH SDK Test

A test/demo application for the UNITH AI Core Client SDK, demonstrating digital human conversation capabilities with real-time audio and video streaming.

## GitHub Pages Deployment

This repository uses GitHub Actions to automatically build and deploy to GitHub Pages.

### Setup Instructions

1. Go to your GitHub repository: https://github.com/borisaflr/unith-sdk-testing
2. Navigate to **Settings** > **Pages**
3. Under **Source**, select:
   - **GitHub Actions**
4. Push any commit to the `main` branch to trigger deployment
5. Your site will be available at: `https://borisaflr.github.io/unith-sdk-testing/`

The deployment happens automatically on every push to `main` via the `.github/workflows/deploy.yml` workflow.
### Local Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

