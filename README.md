# MOCK
![npm](https://img.shields.io/npm/dt/@bwrong/mock)
![npm](https://img.shields.io/npm/v/@bwrong/mock)
![NPM](https://img.shields.io/npm/l/@bwrong/mock)
![GitHub stars](https://img.shields.io/github/stars/bwrong/mock?style=social)

数据mock工具，可在express和webpack环境下使用。有如下功能：
- 自动更新：该工具会监听响应mock文件，当文件改动时自动更新mock数据。
- 延迟响应：可以设置延迟响应时间，应对调试loading的场景。
- 自定义header：可以全局设置header，也可以为某个mock接口设置header。
## 使用方法
1. 安装
```bash
npm i -D @bwrong/mock
```
2. 使用
webpack:
```js
devServer: {
  before(app) {
    const mockServer = require('@bwrong/mock');
    mockServer(app, resolve('./mock/'), {
      pattern: '**/[^_]*.js',
      delay: 0,
      prefix: '/api',
      debug: true,
      headers: {},
      watchOptions: {}
    });
  }
}
```
express:
```js
const express = require('express');
const { resolve } = require('path');
const mockServer = require('@bwrong/mock');
const app = express();
mockServer(app, resolve(__dirname, './mock/'), {
  pattern: '**/[^_]*.js',
  delay: 0,
  prefix: '/api',
  debug: true,
  headers: {},
  watchOptions: {}
});
app.listen(3000);
```
## 参数说明
`mockServer(app, mockFolder,options)`:
- `app`: express实例
- `mockFolder`: 设置mock的数据文件，该目录下面所有的非`_`开头的js文件都会被载入，并根据文件内容创建mock数据和对应路由。
文件格式如下：
```js
const list = {
  code: 0,
  msg: '',
  'data|10': [
    {
      id: '@id',
      name: '@cname',
      des: '@csentence',
      web: '@url',
      photo: '@image',
      address: '@county(true)',
      email: '@email',
      lastIp: '@ip',
      date: '@datetime(yyyy-MM-dd hh:mm:ss)'
    }
  ]
};
const info = {
  code: 0,
  msg: '',
  data: {
    id: '@id',
    name: '@cname',
    department: 'xxx',
    jibTitle: 'yyy',
    org: 'zzzzz',
    count: {
      sum: '@integer(0,10000)',
      score: '@float(0,5,0,2)',
      today: '@integer(0,200)',
      reservation: '@integer(0,200)'
    }
  }
};
module.exports = [
  {
    url: '/user',
    response: list
  },
  {
    url: '/user/html',
    method: 'get',
    headers: {
      'Content-Type': 'text/html'
    },
    response: '<html><h1>html测试</h1><a href="https://www.bwrong.com">bwrong</a></html>'
  },
  {
    url: '/user/info/:id',
    response: (req,res) => {
      return {
        ...info,
        id: req.params.id
      }
    }
  }
];
```
**注意：**
1. 需要导出一个数组，数组每一项会根据其内容创建对应的mock路由及返回数据。
    - `url`：mock的路由，最后生成的路由是`options.prefix`拼接上这里的url。
    - `method`：请求方法，默认为get，为get时可以不设置。
    - `headers`：当前mock路由的header，优先级比全局设置高，不需要可以不设置。
    - `response`：返回的数据，支持object和function两种形式，function时接收两个参数（req,res），req中可以取到query、params、body等数据，返回值会作为最后接口的响应数据。支持[mockjs](http://mockjs.com/)语法。
2. 一般情况建议使用mockjs语法生成数据，如果数据较多，可以将数据分离到一个单独的json文件中，在载入的文件中导入引用即可。
3. 如果目录下有些文件中的内容不希望被注册为mock路由，可将文件名称改为`_`开头，也可也以修改`options.pattern`文件匹配规则。
- `options`: 配置
    - `pattern:'**/[^_]*.js'`: 文件匹配规则，被规则命中的文件才会载入，使用[glob](https://www.npmjs.com/package/glob)语法。
    - `delay:0`: 接口响应延迟时间。
    - `prefix:''`: 接口baseurl，会在所有接口url前面拼接上此路径。
    - `headers:{}`: 全局header设置，默认设置如下，如下修改覆盖即可。
    ```js
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, GET, PATCH, OPTIONS, PUT, DELETE',
    'Access-Control-Allow-Headers': 'Content-Type, X-Requested-With,' + (req.header('access-control-request-headers') || ''),
    'Access-Control-Allow-Credentials': 'true',
    ```
    - `watchOptions:{}`: 文件监听设置，请查看[chokidar](https://github.com/paulmillr/chokidar)。
    - `debug: true`: 是否开启debug模式，开启后当文件有变动，会在终端进行提示。
    ![](https://gitee.com/letwrong/Picture/raw/master/20201225150530.png)
