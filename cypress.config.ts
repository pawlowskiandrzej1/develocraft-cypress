import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'https://xstore.8theme.com/elementor3/electronic-mega-market',
    specPattern: 'cypress/e2e/**/*.cy.ts',
    supportFile: 'cypress/support/e2e.ts',
    viewportWidth: 1280,
    viewportHeight: 720,
    video: false,
    retries: {
      runMode: 1,
      openMode: 0,
    },
  },
});
