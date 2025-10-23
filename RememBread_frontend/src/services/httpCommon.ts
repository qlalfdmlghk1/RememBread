import axios, { InternalAxiosRequestConfig, AxiosResponse, AxiosError } from "axios";
import { tokenUtils } from "@/lib/queryClient";

// 토큰 재발급을 위한 별도의 axios 인스턴스
const refreshHttp = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

const http = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // refreshToken을 쿠키로 보낼 수 있게 설정
});

// 토큰 재발급 관련 상태 관리
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];
let originalRetry = false;

// 토큰 재발급 후 대기 중인 요청들 처리
const onRefreshed = (token: string) => {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
};

// 대기열에 요청 추가
const addRefreshSubscriber = (callback: (token: string) => void) => {
  refreshSubscribers.push(callback);
};

// 요청 인터셉터: accessToken 자동 추가
http.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const accessToken = tokenUtils.getToken();

  // headers가 undefined일 수 있으므로 기본값 설정
  config.headers = config.headers || {};

  // accessToken이 있으면 Bearer 토큰으로 설정, 없으면 빈 문자열로 설정
  config.headers["Authorization"] = accessToken
    ? `Bearer ${accessToken}`
    : "Bearer idonthaveaccesstoken";

  return config;
});

// 응답 인터셉터: accessToken 만료되었을 때 자동 재발급
http.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    // console.log("응답 인터셉터 실행");
    // console.log(error);
    // console.log("error.response", error.response);

    const originalRequest = error.config as InternalAxiosRequestConfig;

    if (error.response?.status === 401 || error.request?.status === 401) {
      //   console.log("401 에러 발생", error.response?.status);
      //   console.log("isRefreshing", isRefreshing);
      if (isRefreshing) {
        // 이미 재발급 진행 중이면 대기열에 추가
        return new Promise((resolve) => {
          addRefreshSubscriber((token: string) => {
            originalRequest.headers = originalRequest.headers || {};
            originalRequest.headers["Authorization"] = `Bearer ${token}`;
            resolve(http(originalRequest));
          });
        });
      }
      isRefreshing = true;
      originalRetry = true;

      try {
        // console.log("토큰 재발급 시도");
        // 토큰 재발급 요청은 refreshHttp 인스턴스를 사용
        const isRefreshed = await tokenUtils.tryRefreshToken(refreshHttp);
        // console.log("토큰 재발급 결과:", isRefreshed);

        if (isRefreshed) {
          const newAccessToken = tokenUtils.getToken();
          // 새로운 토큰으로 대기 중인 요청들 처리
          onRefreshed(newAccessToken as any);

          // 현재 요청 재시도
          originalRequest.headers = originalRequest.headers || {};
          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          isRefreshing = false;
          return http(originalRequest);
        } else {
          //   console.log("토큰 재발급 실패, 로그아웃 처리");
          isRefreshing = false;
          tokenUtils.removeToken();
          refreshSubscribers = []; // 대기열 초기화
          originalRetry = false;
          return Promise.reject(error);
        }
      } catch (refreshError) {
        // console.error('토큰 재발급 중 에러 발생:', refreshError);
        isRefreshing = false;
        tokenUtils.removeToken();
        refreshSubscribers = []; // 대기열 초기화
        originalRetry = false;
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  },
);

export default http;
