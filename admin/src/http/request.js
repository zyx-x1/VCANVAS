//引入axios
import axios from "axios";
import { Message } from "element-ui";

//axios基础配置
const instance = axios.create({
  baseURL: "http://localhost:3000", //基准URL
  timeout: 60000, //超时时间，单位毫秒
});

//请求拦截.
instance.interceptors.request.use(
  (config) => {
    return config;
  },
  (err) => {
    //请求失败时返回error
    return Promise.reject(err);
  }
);

//响应拦截
instance.interceptors.response.use(
  res=> {
    if (res.data.stautus == "fail") {
      Message.error(res.data.msg);
    }
    return res;
  },
  err => {
    //请求失败时返回error
    return Promise.reject(err);
  }
);

//向外暴露出instance
export default instance;
