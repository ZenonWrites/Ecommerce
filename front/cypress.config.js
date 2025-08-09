const { defineConfig } = require('cypress')
const { configureVisualRegression } = require('cypress-mochawesome-reporter/plugin');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://192.168.0.146:3000',
    viewportWidth: 1280,
    viewportHeight: 800,
    defaultCommandTimeout: 10000,
    video: false,
    screenshotOnRunFailure: true,
    setupNodeEvents(on, config) {
      // Implement node event listeners here
      configureVisualRegression(on);
    },
  },
})
