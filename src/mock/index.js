const Mock = require('mockjs');
Mock.setup({
  timeout: '200-600'
});
Mock.XHR.prototype.proxy_send = Mock.XHR.prototype.send;
Mock.XHR.prototype.send = function () {
  if (this.custom.xhr) {
    this.custom.xhr.withCredentials = this.withCredentials || false;
    if (this.responseType) {
      this.custom.xhr['responseType'] = this['responseType'];
    }
  }
  this.proxy_send(...arguments);
};

// 获取所有mock文件
let configArray = [];
const files = require.context('.', true, /\.js$/);
files.keys().forEach(key => {
  if (key === './index.js' || key === '.util.js') return;
  configArray = configArray.concat(files(key).default);
});

// 注册所有mock服务
configArray.forEach(item => {
  for (let [path, target] of Object.entries(item)) {
    let protocol = path.split('|');
    Mock.mock(new RegExp('^' + protocol[1]), protocol[0], target);
  }
});