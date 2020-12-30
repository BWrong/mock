/* libName: mockTool version: 0.0.10 author: bwrong<ibwrong@foxmail.com> */
import URL from 'url';
import chokidar from 'chokidar';
import chalk from 'chalk';
import bodyParser from 'body-parser';
import require$$1 from 'path-to-regexp';
import require$$0 from 'path';
import Mock from 'mockjs';
import glob from 'glob';

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

function commonjsRequire (target) {
	throw new Error('Could not dynamically require "' + target + '". Please configure the dynamicRequireTargets option of @rollup/plugin-commonjs appropriately for this require call to behave properly.');
}

var resolve = require$$0.resolve;
var pathToRegexp = require$$1.pathToRegexp;
/**
 * 获取监听文件
 * @param {*} mockFolder
 * @param {*} pattern
 */

var getWatchFiles = function getWatchFiles(mockFolder, pattern) {
  return glob.sync(resolve(mockFolder, pattern));
};
/**
 * 创建mock集合
 * @param {*} watchFiles
 * @param {*} app
 * @param {*} prefix
 */


var genarMockData = function genarMockData() {
  var watchFiles = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var prefix = arguments.length > 1 ? arguments[1] : undefined;
  var mockData = {};
  watchFiles.map(function (file) {
    var fileData = commonjsRequire(file) || [];
    fileData.map(function (item) {
      var _item$url, _item$url$trim, _item$method, _item$method$trim;

      var url = ((_item$url = item.url) === null || _item$url === void 0 ? void 0 : (_item$url$trim = _item$url.trim()) === null || _item$url$trim === void 0 ? void 0 : _item$url$trim.toLowerCase()) || '';
      url = url.replace(/^\//, '');
      url = "".concat(prefix, "/").concat(url);
      var method = ((_item$method = item.method) === null || _item$method === void 0 ? void 0 : (_item$method$trim = _item$method.trim()) === null || _item$method$trim === void 0 ? void 0 : _item$method$trim.toUpperCase()) || 'GET';
      mockData[url] = _objectSpread2(_objectSpread2({}, item), {}, {
        url: url,
        method: method
      });
    });
  });
  return mockData;
};
/**
 * 设置headers
 * @param {*} headers
 * @param {*} res
 */


var setHeaders = function setHeaders() {
  var headers = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var res = arguments.length > 1 ? arguments[1] : undefined;
  Object.keys(headers).forEach(function (key) {
    return res.setHeader(key, headers[key]);
  });
};
/**
 * 生成mock数据
 * @param {*} result
 * @param {*} req
 * @param {*} res
 */


var getMockData = function getMockData(result, req, res) {
  return Mock.mock(typeof result === 'function' ? result(req, res) : result);
};
/**
 * 延迟
 * @param {*} delay
 */


var sleep = function sleep(delay) {
  return new Promise(function (resolve) {
    return setTimeout(resolve, delay);
  });
};
/**
 * 清除模块
 * @param {*} modulePath
 */


var clearCache = function clearCache(modulePath) {
  try {
    modulePath = require.resolve(modulePath);
  } catch (e) {
    console.error(e);
  }

  var module = require.cache[modulePath];
  if (!module) return;

  if (module.main) {
    module.main.children.splice(module.main.children.indexOf(module), 1);
  }

  delete require.cache[require.resolve(modulePath)];
};
/**
 * 获取路由参数
 * @param {*} options
 */


var pathMatch = function pathMatch(options) {
  options = options || {};
  return function (path) {
    var keys = [];
    var re = pathToRegexp(path, keys, options);
    return function (pathname, params) {
      var m = re.exec(pathname);
      if (!m) return false;
      params = params || {};
      var key, param;

      for (var i = 0; i < keys.length; i++) {
        key = keys[i];
        param = m[i + 1];
        if (!param) continue;
        params[key.name] = decodeURIComponent(param);
        if (key.repeat) params[key.name] = params[key.name].split(key.delimiter);
      }

      return params;
    };
  };
};

var util = {
  getWatchFiles: getWatchFiles,
  genarMockData: genarMockData,
  setHeaders: setHeaders,
  getMockData: getMockData,
  sleep: sleep,
  clearCache: clearCache,
  pathMatch: pathMatch
};

var setHeaders$1 = util.setHeaders; // OPTIONS请求全部成功

var captureOptionsMW = function captureOptionsMW(req, res, next) {
  if (req.method.toLocaleUpperCase() === 'OPTIONS') {
    return res.sendStatus(200);
  }

  next();
}; // 设置header


var setHeadersMW = function setHeadersMW(headers) {
  return function (req, res, next) {
    var globalHeaders = _objectSpread2({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, GET, PATCH, OPTIONS, PUT, DELETE',
      'Access-Control-Allow-Headers': 'Content-Type, X-Requested-With,' + (req.header('access-control-request-headers') || ''),
      'Access-Control-Allow-Credentials': 'true'
    }, headers);

    setHeaders$1(globalHeaders, res);
    next();
  };
};

var middlewares = {
  captureOptionsMW: captureOptionsMW,
  setHeadersMW: setHeadersMW
};

var pathToRegexp$1 = require$$1.pathToRegexp;
var getWatchFiles$1 = util.getWatchFiles,
    genarMockData$1 = util.genarMockData,
    setHeaders$2 = util.setHeaders,
    getMockData$1 = util.getMockData,
    sleep$1 = util.sleep,
    clearCache$1 = util.clearCache,
    pathMatch$1 = util.pathMatch;
var captureOptionsMW$1 = middlewares.captureOptionsMW,
    setHeadersMW$1 = middlewares.setHeadersMW;

var src = function src(app, mockFolder, options) {
  // 判断是否设置监听目录
  if (!mockFolder) {
    return console.log(chalk.red('[@bwrong/mock] Please set mockFolder'));
  } // 获取配置


  var delay = options.delay || 0;
  var watchOptions = options.watchOptions || {};
  var headers = options.headers || {};
  var prefix = options.prefix || '';
  var pattern = options.pattern || '**/[^_]*.js';
  var debug = options.debug || true; // 获取监听文件

  var watchFiles = getWatchFiles$1(mockFolder, pattern); // 注册路由

  var mockData = genarMockData$1(watchFiles, prefix);
  app.all("".concat(prefix, "/*"), [bodyParser.json(), bodyParser.urlencoded({
    extended: true
  }), captureOptionsMW$1, setHeadersMW$1(headers)], /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, res, next) {
      var mocker, resData;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              mocker = Object.values(mockData).find(function (mockItem) {
                return req.method === mockItem.method && pathToRegexp$1(mockItem.url).exec(req.path);
              });

              if (!mocker) {
                _context.next = 9;
                break;
              }

              req.params = pathMatch$1({
                sensitive: false,
                strict: false,
                end: false
              })(mocker.url)(URL.parse(req.url).pathname);
              resData = getMockData$1(mocker === null || mocker === void 0 ? void 0 : mocker.response, req, res);

              if (!resData) {
                _context.next = 9;
                break;
              }

              _context.next = 7;
              return sleep$1(delay);

            case 7:
              mocker.headers && setHeaders$2(mocker.headers, res);
              return _context.abrupt("return", res.send(resData));

            case 9:
              next();

            case 10:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    return function (_x, _x2, _x3) {
      return _ref.apply(this, arguments);
    };
  }()); // 监听

  chokidar.watch(mockFolder, _objectSpread2({
    ignoreInitial: true
  }, watchOptions)).on('all', function (event, path) {
    if (event === 'change' || event === 'add' || event === 'unlink') {
      try {
        // 移除模块
        clearCache$1(path);
        watchFiles.forEach(function (file) {
          return clearCache$1(file);
        }); // 重新注册路由

        mockData = genarMockData$1(watchFiles, prefix);
        debug && console.log("".concat(chalk.green('[@bwrong/mock]'), " ").concat(chalk.green(path.replace(process.cwd(), '')), " load success\uFF01"));
      } catch (ex) {
        console.error(ex);
        console.error("".concat(chalk.red('[@bwrong/mock]'), " ").concat(chalk.red(path.replace(process.cwd(), '')), " load filed\uFF01"));
      }
    }
  });
};

export default src;
