let permissions = require('./permissions.json')
const login = ({ body }) => {
  // console.log('body.username', body.username)
  if (body.username!=='admin') {
    return {
      code: 500,
      msg: `${body.username} 用户不存在`,
      data: {}
    };
  }
    // 根据参数做验证
    return {
      code: 200,
      msg: '登录成功',
      body: {
        access_token: '1111111111111111111111',
        refresh_token: '22222222222222222222',
        username: body.username,
        permissions,
        token: '@guid',
        refresh_token: '@guid',
        expires_in: 100000,
        sex: 1,
      }
    };
};
const refreshToken = {
  code: 200,
  msg: '',
  body: {
    token: '@guid',
    refresh_token: '@guid',
    expires_in: 100000,
  }
};



module.exports = [{
  url: '/auth/login',
  method: 'post',
  response: login
},{
  url: '/auth/refresh_token',
  method: 'post',
  response: refreshToken
}]
