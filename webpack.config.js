const { resolve } = require('path');
module.exports = {
  entry: './src/index.js',
  target: 'node',
  output: {
    path: resolve('./dist'),
    filename: 'index.js',
    library: 'mockTool',
    sourceMapFilename: '[file].map',
    libraryTarget: 'commonjs2'
  },
  devtool: 'source-map',
  module: {
    rules: [
      // {
      //   test: /\.tsx?$/i,
      //   loader: 'ts-loader',
      //   exclude: /node_modules/
      // },
       {
        test: /\.js$/i,
        loader: 'babel-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.json', '.jsx', '.ts', '.tsx']
  },
  externals: {
    mockjs: 'Mock',
    glob: 'glob',
    chokidar: 'chokidar',
    chalk: 'chalk',
    'body-parser':'bodyParser'
  }
};
