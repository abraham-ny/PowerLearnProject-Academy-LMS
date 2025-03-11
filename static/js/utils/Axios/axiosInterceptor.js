/* eslint-disable no-param-reassign */
import axios from 'axios';

// set up config for courses api calls
// eslint-disable-next-line import/prefer-default-export
export const axiosInterceptor = axios.create({
  baseURL:
    process.env.REACT_APP_BASE_URL ||
    'https://api.lms.v2.powerlearnprojectafrica.org/gateway/api',
});

// intercept every request and add the bearer token
axiosInterceptor.interceptors.request.use(
  (requestConfig) => {
    requestConfig.headers.post['Access-Control-Allow-Origin'] = '*';
    requestConfig.headers.authorization = `Bearer ${localStorage.getItem(
      'token'
    )}`;
    return requestConfig;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInterceptor.interceptors.response.use(
  (responseConfig) => {
    return responseConfig;
  },
  (error) => {
    // check if error from server is 401 then logout user

    if (error.response?.status === 401) {
      localStorage.clear();
      window.location = '/login';
    }
    return Promise.reject(error);
  }
);
