
const { setHeaders } = require('./util');
// OPTIONS请求全部成功
exports.captureOptionsMW = (req, res, next) => {
  if (req.method.toLocaleUpperCase() === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
};
// 设置header
exports.setHeadersMW = (headers) => {
  return (req, res, next) => {
    let globalHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, GET, PATCH, OPTIONS, PUT, DELETE',
      'Access-Control-Allow-Headers': 'Content-Type, X-Requested-With,' + (req.header('access-control-request-headers') || ''),
      'Access-Control-Allow-Credentials': 'true',
      ...headers
    };
    setHeaders(globalHeaders, res);
    next();
  };
};
