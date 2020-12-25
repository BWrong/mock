const express = require('express');
const { resolve } = require('path');
const mockServer = require('../src/index');
const app = express();
mockServer(app, resolve(__dirname, './mock/'), {
  pattern: '**/[^_]*.js',
  delay: 0,
  prefix: '/api',
  headers: {},
  watchOptions: {},
  debug: true
});
app.listen(3000);