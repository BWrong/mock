const express = require('express');
const { resolve } = require('path');
const mockServer = require('../src/index');
const app = express();
mockServer(app, resolve(__dirname, '../mock/'), {
  pattern: '**/[^_]*.js',
  delay: 0,
  prefix: '/api',
  debug: true,
  headers:{}
});
app.listen(3000);