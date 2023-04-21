// import { arrayFind } from './util';

let users = [
  {
    id: 1,
    username: 'admin',
    // password: '11111',
    password: '',
    name: 'vue master'
  },
  {
    id: 2,
    username: '张三',
    // password: '11111',
    password: '',
    name: 'another one'
  }
]

export default {
  'post|/ms-base-server/jwt/token': options => {
    let token = ''
    let status = 401
    const user = JSON.parse(options.body)
    for (let i = 0; i < users.length; i++) {
      if (users[i]['username'] === user['username']) {
        users[i]['password'] = user['password']
        token =
          'eyJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJkMTAxNDY4YWNhZjM0ZGRhYmFjOTY0NmQyZDkyMDExMyIsImlkIjoiZDEwMTQ2OGFjYWYzNGRkYWJhYzk2NDZkMmQ5MjAxMTMiLCJjb2RlIjoiYWRtaW4iLCJuYW1lIjoi6LaF57qn566h55CG5ZGYIiwiZXhwIjoxNTcxOTg4MzkwfQ.etLx6wELsJwWAHn8fxgz4qLjfuuPHlMiZpc1d2eULt1zpIdIEZulljbSreOcf60mUsNB_yXTHeJR6-tMAYB9hIRNy6-UeKipJ12xxv4S-3JLg7NceQ84-N30IA6RaODAPTk6YyZ5DGUyWmvGJGlYY0f0JR304c41twgJ1zfgwCI'
        status = 200
        break
      }
    }
    return {
      status: status,
      message: 'success',
      data: {
        state: 20101,
        token,
        userInfo: { name: '张三' }
      }
    }
  },
  'post|/ms-base-server/jwt/logout': () => {
    return {
      status: 200,
      message: 'success',
      data: 'ok'
    }
  }
}
