var fs = require('fs');
var defaultCapabilities = {
  name: 'js-hierarchy',
  build: JSON.parse(fs.readFileSync('package.json')).version,
  screenrecorder: false,
  public: true,
  groups: "js-hierarchy"
}
exports.config = {

  /**
   * specify test files
   */
  specs: [
    './test/test.browser.js'
  ],

  /**
   * capabilities
   */
  capabilities: [
    Object.assign(
      {}, defaultCapabilities, {
        browserName: 'firefox',
        platform: 'WIN10',
        version: 'latest'
      }),
    Object.assign(
      {}, defaultCapabilities, {
        browserName: 'firefox',
        platform: 'WIN10',
        version: 'latest-1'
      }),
    Object.assign(
      {}, defaultCapabilities, {
        browserName: 'firefox',
        platform: 'WIN10',
        version: 'latest-2'
      }),
    Object.assign(
      {}, defaultCapabilities, {
        browserName: 'googlechrome',
        platform: 'WIN10',
        version: 'latest'
      }),
    Object.assign(
      {}, defaultCapabilities, {
        browserName: 'googlechrome',
        platform: 'WIN10',
        version: 'latest-1'
      }),
    Object.assign(
      {}, defaultCapabilities, {
        browserName: 'googlechrome',
        platform: 'WIN10',
        version: 'latest-2'
      }),
    Object.assign(
      {}, defaultCapabilities, {
        browserName: 'MicrosoftEdge',
        platform: 'WIN10',
        version: 'latest'
      }),
    Object.assign(
      {}, defaultCapabilities, {
        browserName: 'MicrosoftEdge',
        platform: 'WIN10',
        version: 'latest-1'
      }),
    Object.assign(
      {}, defaultCapabilities, {
        browserName: 'safari',
        platform: 'HIGH-SIERRA',
        version: '11'
      })
  ],

  /**
   * test configurations
   */
  logLevel: 'silent',
  coloredLogs: true,
  screenshotPath: 'screenshots',
  waitforTimeout: 10000,
  framework: 'mocha',
  services: ['testingbot'],
  user: '190e841358e8e595f6f7c007e8196dd4',
  key: process.env['TESTINGBOT_SECRET'],

  reporters: ['dot'],
  reporterOptions: {
    outputDir: './'
  },

  mochaOpts: {
    ui: 'bdd'
  }
}
