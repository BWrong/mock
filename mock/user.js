// import { ResponseData } from '../types/responseData';
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
    department: '中医内科',
    jibTitle: '主治医生',
    org: '互联网门诊',
    count: {
      sum: '@integer(0,10000)',
      score: '@float(0,5,0,2)',
      today: '@integer(0,200)',
      reservation: '@integer(0,200)'
    }
  }
};
// module.exports = {
//   'get|user': list,
//   'get|user/info': info
// };
module.exports = [
  {
    url: '/user',
    response: list
  },
  {
    url: '/user/info',
    response: info
  },
  {
    url: '/user/html',
    method: 'get',
    headers: {
      'Content-Type': 'text/html'
    },
    response: '<html><h1>html测试</h1><a href="https://www.baidu.com">百度</a></html>'
  },
  {
    url: '/user/info/:id',
    response: (req) => {
      console.log(req.params)
      return {
        aaa:345
      }
    }
  }
];
