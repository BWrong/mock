const { resolve } = require('path');
const Mock = require('mockjs');
const glob = require('glob');
const chokidar = require('chokidar');
const chalk = require('chalk');
const bodyParser = require('body-parser');

let mockServer = (app, mockFolder, options) => {
  // 判断是否设置监听目录
  if (!mockFolder) {
    return console.log(chalk.red('[@bwrong/mock] Please set mockFolder'));
  }
  // 获取配置
  const delay = options.delay || 0;
  const watchOptions = options.watchOptions || {};
  const headers = options.headers || {};
  const prefix = options.prefix || '';
  const pattern = options.pattern || '**/[^_]*.js'
  const debug = options.debug || false
  // 获取监听文件
  const watchFiles = getWatchFiles(mockFolder, pattern);
  // 解析body
  app.use(bodyParser.json());
  app.use(
    bodyParser.urlencoded({
      extended: true
    })
  );
  // 设置header
  app.use((req, res, next) => {
    let globalHeaders = {
      'Access-Control-Allow-Origin': req.get('Origin') || '*',
      'Access-Control-Allow-Methods': 'POST, GET, PATCH, OPTIONS, PUT, DELETE',
      'Access-Control-Allow-Headers': 'Content-Type, X-Requested-With,' + (req.header('access-control-request-headers') || ''),
      'Access-Control-Allow-Credentials': 'true',
      ...headers
    };
    setHeaders(globalHeaders,res)
    next();
  });
  // 延迟响应
  app.use(async (req, res, next) => {
    await sleep(delay);
    next();
  });
  // 注册路由
  let { mockRoutesLength, mockStartIndex } = genarRoutes(watchFiles, app, prefix);
  // 监听
  const watcher = chokidar.watch(mockFolder, watchOptions);
  watcher.on('all', (event, path) => {
    if (event === 'change' || event === 'add') {
      try {
        // 移除路由
        app._router.stack.splice(mockStartIndex, mockRoutesLength);
        // 移除模块
        clearCache(path);
        watchFiles.forEach(file => clearCache(file));
        // 重新注册路由
        ({mockRoutesLength,mockStartIndex} = genarRoutes(watchFiles,app,prefix));
        debug && console.log(`${chalk.green('[@bwrong/mock]')} ${chalk.green(path.replace(process.cwd(), ''))} load success！`);
      } catch (ex) {
        console.error(ex);
        console.error(`${chalk.red('[@bwrong/mock]')} ${chalk.red(path.replace(process.cwd(), ''))} load filed！`);
      }
    }
  });
  return (req, res, next) => {
    next();
  };
};
/**
 * 设置headers
 * @param {*} headers
 * @param {*} res
 */
function setHeaders(headers = {},res) {
  Object.keys(headers).forEach((key) => res.setHeader(key, headers[key]));
}
/**
 * 获取监听文件
 * @param {*} mockFolder
 * @param {*} pattern
 */
function getWatchFiles(mockFolder, pattern) {
  return glob.sync(resolve(mockFolder, pattern));
}
/**
 * 创建路由
 * @param {*} watchFiles
 * @param {*} app
 * @param {*} prefix
 */
function genarRoutes(watchFiles, app, prefix) {
  let lastIndex;
  // 获取mock数据集合
  let mockData = watchFiles.reduce((temp, file) => {
    let fileData = require(file) || [];
    temp.push(...fileData);
    return temp;
  }, []);
  // 将mock数据注册为路由
  for (const routerOne of mockData) {
    let method = routerOne.method || 'get';
    let url = routerOne.url.trim().replace(/^\//, '');
    app[method](`${prefix}/${url}`, (req, res, next) => {
      // 设置当前路由的headers
      setHeaders(routerOne.headers,res)
      let data = getMockData(routerOne.response, req, res);
      res.json(data);
      next();
    });
    lastIndex = app._router.stack.length;
  }
  const mockRoutesLength = Object.keys(mockData).length;
  return {
    mockRoutesLength,
    mockStartIndex: lastIndex - mockRoutesLength
  };
}

/**
 * 生成mock数据
 * @param {*} result
 * @param {*} req
 * @param {*} res
 */
function getMockData(result, req, res) {
  return Mock.mock(typeof result === 'function' ? result(req) : result);
}
/**
 * 延迟
 * @param {*} delay
 */
function sleep(delay) {
  return new Promise((resolve) => setTimeout(resolve, delay));
}
/**
 * 清除模块
 * @param {*} modulePath
 */
function clearCache(modulePath) {
  try {
    modulePath = require.resolve(modulePath);
  } catch (e) {}
  let module = require.cache[modulePath];
  if (!module) return;
  if (module.main) {
    module.main.children.splice(module.main.children.indexOf(module), 1);
  }
  delete require.cache[require.resolve(modulePath)];
}
module.exports = mockServer