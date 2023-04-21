import SockJS from 'sockjs-client';
import {
  getSessionStorage
} from '@utils/storage';
const Stmop = require('stompjs');

let _instance;

/**
 * 将后台传过来的json字符串转换为object
 * @param data
 * @param callback
 */
function transJson(data) {
  if (typeof data === 'string') {
    data = JSON.parse(data);
  }
  return data;
}

class SocketClient {
  constructor(socketHost) {
    this.url = socketHost;
    this.socket = new SockJS(
      `${this.url}?token=${getSessionStorage('auth_token')}`
    );
  }

  init() {
    return new Promise((resolve, reject) => {
      // if (!_instance) {
      _instance = Stmop.over(this.socket);
      _instance.debug = false;
      _instance.connect({
          Authorization: getSessionStorage('auth_token')
        },
        // success
        () => {
          // console.log('连接已建立');
          resolve();
        },
        // error
        (error) => {
          if (_instance) {
            _instance.disconnect();
            if (this.socket) {
              this.socket.close();
            }
          }
          reject(error);
        }
      );
      // }
    });
  }

  // 关闭连接
  close() {
    if (_instance) {
      _instance.disconnect();
      if (this.socket) {
        this.socket.close();
      }
    }
  }

  getMessage(subscribe, callback) {
    _instance.subscribe(subscribe, (response) => {
      callback(transJson(response.body));
    });
  }

  sendMessage(destination, body) {
    const headers = {
      Authorization: getSessionStorage('auth_token')
    };
    _instance.send(destination, headers, body);
  }
}

export default SocketClient;
