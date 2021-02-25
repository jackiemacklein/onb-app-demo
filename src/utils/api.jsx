import axios from "axios";
import Cookies from "js-cookie";

const api = axios.create({ baseURL: "https://onb-api-demo.agenciaonside.com.br" });
//const api = axios.create({ baseURL: "http://192.168.1.5:8080" });

api.interceptors.request.use(
  config => {
    config.headers["Authorization"] = "bearer " + Cookies.get("rui-auth-token");
    return config;
  },
  error => {
    Promise.reject(error);
  },
);

export default api;
