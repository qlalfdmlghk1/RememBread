import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Button from "@/components/common/Button";
import KakaoLogo from "@/components/svgs/login/KakaoLogo";
import NaverLogo from "@/components/svgs/login/NaverLogo";
import GoogleLogo from "@/components/svgs/login/GoogleLogo";
import DefaultBread from "@/components/svgs/breads/DefaultBread";
import { tokenUtils } from "@/lib/queryClient";
import Loading from "@/components/common/Loading";

const LoginPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // 토큰 재발급 시도
    const tryRefreshToken = async () => {
      const currentToken = tokenUtils.getToken();
      if (!currentToken) {
        const isRefreshed = await tokenUtils.tryRefreshToken();
        if (isRefreshed) {
          // 이전 경로가 있으면 해당 경로로, 없으면 기본 경로로 이동
          const from = location.state?.from || "/card-view";
          navigate(from);
        } else {
          setIsLoading(false);
        }
      } else {
        // 이전 경로가 있으면 해당 경로로, 없으면 기본 경로로 이동
        const from = location.state?.from || "/card-view";
        navigate(from);
      }
    };

    tryRefreshToken();

    // state로 전달된 에러 메시지가 있다면 alert로 표시
    if (location.state?.message) {
      alert(`[${location.state.socialType} 로그인 실패]\n${location.state.message}`);
      // alert 표시 후 state 초기화 (뒤로 가기 시 다시 alert가 뜨는 것을 방지)
      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate]);

  if (isLoading) {
    return (
        <Loading />
    );
  }

  const FRONT_BASE_URL = import.meta.env.VITE_FRONT_BASE_URL || "http://localhost:5173";

  const REDIRECT_URIS = {
    kakao: `${FRONT_BASE_URL}/account/login/kakao`,
    naver: `${FRONT_BASE_URL}/account/login/naver`,
    google: `${FRONT_BASE_URL}/account/login/google`,
  };

  const OAUTH_URLS = {
    kakao: `https://kauth.kakao.com/oauth/authorize?client_id=${
      import.meta.env.VITE_KAKAO_CLIENT_ID
    }&redirect_uri=${REDIRECT_URIS.kakao}&response_type=code`,
    naver: `https://nid.naver.com/oauth2.0/authorize?client_id=${
      import.meta.env.VITE_NAVER_CLIENT_ID
    }&redirect_uri=${REDIRECT_URIS.naver}&response_type=code&state=test`,
    google: `https://accounts.google.com/o/oauth2/v2/auth?client_id=${
      import.meta.env.VITE_GOOGLE_CLIENT_ID
    }&redirect_uri=${REDIRECT_URIS.google}&response_type=code&scope=profile`,
  };

  const handleSocialLogin = (type: string) => {
    window.location.href = OAUTH_URLS[type as keyof typeof OAUTH_URLS];
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 no-scrollbar">
      <div className="text-center mb-8 sm:mb-20">
        <h1 className="text-xl sm:text-2xl font-bold mb-4">"출근길에 굽는 지식 한 조각"</h1>
        <DefaultBread className="w-[150px] h-[150px] sm:w-[200px] sm:h-[200px] mx-auto" />
      </div>
      <div className="text-center mb-2 text-neutral-500">
        <p>sns 계정으로 간편하게 로그인 하세요</p>
      </div>

      <div className="flex flex-col items-center gap-3 sm:gap-4 w-full max-w-[384px] px-4">
        <Button
          variant="shadow"
          className="w-full h-12 px-6 flex justify-center items-center gap-2.5 bg-[#FEE500] hover:bg-[#E6CE00] text-black transition-colors border-none"
          onClick={() => handleSocialLogin("kakao")}
        >
          <div className="w-6">
            <KakaoLogo className="w-6 h-6" />
          </div>
          <span className="flex-1 text-center text-md font-bold">카카오 로그인</span>
        </Button>

        <Button
          variant="shadow"
          className="w-full h-12 px-6 flex justify-center items-center gap-2.5 bg-[#03C75A] hover:bg-[#02B04E] text-white transition-colors border-none"
          onClick={() => handleSocialLogin("naver")}
        >
          <div className="w-6">
            <NaverLogo className="w-6 h-6" />
          </div>
          <span className="flex-1 text-center text-md font-bold">네이버 로그인</span>
        </Button>

        <Button
          variant="shadow"
          className="w-full h-12 px-6 flex justify-center items-center gap-2.5 bg-[#F2F2F2] hover:bg-[#E0E0E0] text-neutral-500 transition-colors border-none"
          onClick={() => handleSocialLogin("google")}
        >
          <div className="w-6">
            <GoogleLogo className="w-6 h-6" />
          </div>
          <span className="flex-1 text-center text-md font-bold">구글 로그인</span>
        </Button>
      </div>

      <p className="mt-6 text-sm text-neutral-500">© 2025, Remembread. All rights reserved.</p>
    </div>
  );
};

export default LoginPage;
