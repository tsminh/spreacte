import axios, { InternalAxiosRequestConfig } from "axios";
import { isDev } from "./utils";
import toast from "react-hot-toast";

const axiosIns = axios.create({
  baseURL:
    process.env.REACT_APP_BUILD_ENV === "dev"
      ? "https://games-dev.yeah1games.vn/landing-page-be/api/"
      : "https://event.mangoplus.vn/landing-page-be/api/",
  timeout: 10000,
});

axiosIns.interceptors.request.use(function (config) {
  const token = localStorage.getItem("token") || "XXX";
  if (!token || config.url?.includes("login"))
    return {
      ...config,
      data: {
        ...config.data,
        campaign_slug: "yconcert-landing-page",
      },
    };
  return {
    ...config,
    headers: {
      Authorization: `JWT ${token}`,
    },
  } as InternalAxiosRequestConfig<any>;
});

if (isDev()) {
  axiosIns.interceptors.response.use(
    (config) => config,
    (error) => {
      return Promise.resolve({
        data: {
          code: 0,
          data: {
            idol: "CC",
          },
        },
      });
    }
  );
}

axiosIns.interceptors.response.use(
  (response) => {
    if (response.data.code !== undefined && response.data.code !== 0) {
      toast.error("Có lỗi xảy ra.");
    }
    return response;
  },
  (error) => {
    toast.error("Có lỗi xảy ra..");
    return Promise.reject(error);
  }
);

export default axiosIns;
