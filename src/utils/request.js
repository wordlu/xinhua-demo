import axios from 'axios';
import qs from 'qs';

const service = axios.create({ 
	baseUrl: '/api',
	timeout: 3 * 1000,
  header: {
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  paramsSerializer: (params) => {
    return qs.stringify(params, {
      arrayFormat: 'repeat'
    });
  }
});

const http = {
  get(url, params) {
    const config = {
      method: 'GET',
      url: url,
      params: params || {}
    };
    return service(config);
  },
  post (url, params) {
    const config = {
      method: 'POST',
      url: url,
      data: params || {}
    };
    return service(config);
  }
};

export default http;