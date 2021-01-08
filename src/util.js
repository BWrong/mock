const { resolve } = require('path');
const Mock = require('mockjs');
const glob = require('glob');
const { pathToRegexp } = require('path-to-regexp');
/**
 * 获取监听文件
 * @param {*} mockFolder
 * @param {*} pattern
 */
exports.getWatchFiles = (mockFolder, pattern) => {
  return glob.sync(resolve(mockFolder, pattern));
};

/**
 * 创建mock集合
 * @param {*} watchFiles
 * @param {*} app
 * @param {*} prefix
 */
exports.genarMockData = (watchFiles = [], prefix) => {
  let mockData = [];
  watchFiles.map((file) => {
    let fileData = require(file) || [];
    fileData.map((item) => {
      let url = item.url || '';
      url = url.trim().toLowerCase();
      url = url.replace(/^\//, '');
      url = `${prefix}/${url}`;
      let method = item.method || 'GET';
      method = method.trim().toUpperCase();
      mockData.push({
        ...item,
        url,
        method
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
exports.setHeaders = (headers = {}, res) => {
  Object.keys(headers).forEach((key) => res.setHeader(key, headers[key]));
};

/**
 * 生成mock数据
 * @param {*} result
 * @param {*} req
 * @param {*} res
 */
exports.getMockData = (result, req, res) => {
  return Mock.mock(typeof result === 'function' ? result(req, res) : result);
};
/**
 * 延迟
 * @param {*} delay
 */
exports.sleep = (delay) => {
  return new Promise((resolve) => setTimeout(resolve, delay));
};
/**
 * 清除模块
 * @param {*} modulePath
 */
exports.clearCache = (modulePath) => {
  try {
    modulePath = require.resolve(modulePath);
  } catch (e) {
    console.error(e);
  }
  let module = require.cache[modulePath];
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
exports.pathMatch = (options) => {
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
