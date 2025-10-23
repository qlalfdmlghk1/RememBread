import { QueryClient } from "@tanstack/react-query";
import { refreshToken } from "@/services/authService";
import { AxiosInstance } from "axios";

// accessToken을 관리할 키
export const ACCESS_TOKEN_KEY = 'access-token';

// 토큰의 신선도를 체크하기 위한 타임스탬프 키
const TOKEN_TIMESTAMP_KEY = 'token-timestamp';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 60, // 1시간
      gcTime: Infinity,
    },
  },
});

// accessToken 관련 유틸리티 함수들
export const tokenUtils = {
  // access token 가져오기
  getToken: () => {
    const token = queryClient.getQueryData<string | null>([ACCESS_TOKEN_KEY]);
    return token;
  },

  // access token 설정
  setToken: (token: string) => {
    queryClient.setQueryData([ACCESS_TOKEN_KEY], token);
    queryClient.setQueryData([TOKEN_TIMESTAMP_KEY], Date.now());
  },

  // access token 제거
  removeToken: () => {
    queryClient.setQueryData([ACCESS_TOKEN_KEY], null);
    queryClient.setQueryData([TOKEN_TIMESTAMP_KEY], null);
  },

  // refresh token으로 access token 갱신 시도
  tryRefreshToken: async (axiosInstance?: AxiosInstance) => {
    try {
      const response = await refreshToken(axiosInstance);
      tokenUtils.setToken(response.result.accessToken);
      return true;
    } catch (error) {
      tokenUtils.removeToken();
      return false;
    }
  },
};
