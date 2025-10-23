import http from "@/services/httpCommon";
import { AUTH_END_POINT } from "@/services/endPoints";

interface SocialLoginParams {
  code: string;
  socialType: string;
  redirectUri?: string;
}

interface SocialLoginResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    accessToken: string;
    isAgreedTerms: boolean;
    userId: string;
  };
}

interface RefreshTokenResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    accessToken: string;
    isAgreedTerms: boolean;
    userId: string;
  };
}

interface LogoutResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {};
}

/**
 * 소셜 로그인
 *
 * 소셜 로그인 요청 및 응답 처리
 * socialType : kakao, google, naver
 * code : 소셜 로그인 응답 코드
 */
export const socialLogin = async ({
  code,
  socialType,
  redirectUri,
}: SocialLoginParams): Promise<SocialLoginResponse> => {
  try {
    const response = await http.get<SocialLoginResponse>(AUTH_END_POINT.SOCIAL_LOGIN(socialType), {
      params: { code, "redirect-uri": redirectUri },
    });
    return response.data;
  } catch (error) {
    // console.log("요청 Uri:", AUTH_END_POINT.SOCIAL_LOGIN(socialType), "params: ", {
    //   code,
    //   redirectUri,
    // });
    // console.error('소셜 로그인 실패:', error);
    throw error;
  }
};

/**
 * Access Token 재발급
 *
 * Refresh Token을 기반으로 새로운 Access Token을 발급받음.
 * refresh-token은 쿠키로 전송
 */
export const refreshToken = async (axiosInstance = http): Promise<RefreshTokenResponse> => {
  try {
    const response = await axiosInstance.post<RefreshTokenResponse>(AUTH_END_POINT.REFRESH_TOKEN);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * 로그아웃
 *
 * 로그아웃 요청 및 응답 처리
 */
export const logout = async (): Promise<LogoutResponse> => {
  try {
    const response = await http.post<LogoutResponse>(AUTH_END_POINT.LOGOUT);
    return response.data;
  } catch (error) {
    throw error;
  }
};
