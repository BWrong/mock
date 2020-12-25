const URL = require('url');
const chokidar = require('chokidar');
const chalk = require('chalk');
const bodyParser = require('body-parser');
const { pathToRegexp } = require('path-to-regexp');
const { getWatchFiles, genarMockData, setHeaders, getMockData, sleep, clearCache,pathMatch } = require('./util');
const { captureOptionsMW, setHeadersMW} = require('./middlewares');

module.exports = (app, mockFolder, options) => {
  // 判断是否设置监听目录
  if (!mockFolder) {
    return console.log(chalk.red('[@bwrong/mock] Please set mockFolder'));
  }
  // 获取配置
  const delay = options.delay || 0;
  const watchOptions = options.watchOptions || {};
  const headers = options.headers || {};
  const prefix = options.prefix || '';
  const pattern = options.pattern || '**/[^_]*.js';
  const debug = options.debug || true;
  // 获取监听文件
  const watchFiles = getWatchFiles(mockFolder, pattern);
  // 注册路由
  let mockData = genarMockData(watchFiles, prefix);
  app.all(
    `${prefix}/*`,
    [
      bodyParser.json(),
      bodyParser.urlencoded({ extended: true }),
      captureOptionsMW,
      setHeadersMW(headers)
    ],
    async (req, res, next) => {
      const mocker = Object.values(mockData).find((mockItem) => req.method === mockItem.method && pathToRegexp(mockItem.url).exec(req.path));
      if (mocker) {
        req.params = pathMatch({ sensitive: false, strict: false, end: false })(mocker.url)(URL.parse(req.url).pathname);
        let resData = getMockData(mocker?.response, req, res);
        if (resData) {
          await sleep(delay);
          mocker.headers && setHeaders(mocker.headers, res);
          return res.send(resData);
        }
      }
      next()
    }
  );
  // 监听
  chokidar.watch(mockFolder, {
    ignoreInitial: true,
    ...watchOptions
  }).on('all', (event, path) => {
    if (event === 'change' || event === 'add' || event === 'unlink') {
      try {
        // 移除模块
        clearCache(path);
        watchFiles.forEach((file) => clearCache(file));
        // 重新注册路由
        mockData = genarMockData(watchFiles, prefix);
        debug && console.log(`${chalk.green('[@bwrong/mock]')} ${chalk.green(path.replace(process.cwd(), ''))} load success！`);
      } catch (ex) {
        console.error(ex);
        console.error(`${chalk.red('[@bwrong/mock]')} ${chalk.red(path.replace(process.cwd(), ''))} load filed！`);
      }
    }
  });
};
