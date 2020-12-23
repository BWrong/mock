const menus = ({ query }) => {
  return {
    code: 200,
    msg: '',
    body: {
      menus: require('./menu.json'),
      btnPermissions: require('./permissions.json'),
      detail: {
        birthday: '19940226',
        createAt: null,
        createTime: '2017-07-14 15:53:15',
        createUser: 'sysem',
        delFlag: 0,
        deptCode: '001',
        deptId: '8a929fcc644931a80164493599af0004',
        email: '8888888@qq.com',
        headPic: '',
        id: '12341234',
        idNumber: '410221199402261',
        name: '超级管理员',
        nickName: '超级管理员',
        originPlace: null,
        perLoginDate: null,
        remark: 'vvv',
        resideAddress: null,
        sex: 1,
        status: 0,
        sysRole: '0',
        telphone: '15528308524',
        updateAt: 'admin',
        updateTime: '2018-08-06 10:20:28',
        userId: '4',
        username: 'admin'
      }
    }
  };
};
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
        access_token: 'ewkjrhwekrnwkernwjeknrjewkrnwskdzvkfnvdkfvsdfsdf',
        refresh_token: 'qazewkjrhwekrnwkernwjeknrjewkrnwskdzvkfnvdkfvsdfsdf',
        username: body.username,
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
const unloadCount = {
  code: 200,
  msg: '请求成功',
  body: 2019
};


module.exports = [{
  url: '/auth/login',
  method: 'post',
  response: login
},{
  url: '/auth/menus',
  method: 'get',
  response: menus
},{
  url: '/auth/refresh_token',
  method: 'post',
  response: refreshToken
},{
  url: '/auth/unreadCount',
  method: 'post',
  response: unloadCount
}]
// module.exports = {
//   'post|auth/login': login,
//   'get|auth/menus': menus,
//   'post|auth/refresh_token': refreshToken,
//   'get|auth/unreadCount': unloadCount
// };
