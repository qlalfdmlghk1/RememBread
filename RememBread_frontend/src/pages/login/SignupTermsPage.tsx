import { useNavigate, Outlet, useLocation } from "react-router-dom";
import { completeAgree } from "@/services/userService";
import { tokenUtils } from "@/lib/queryClient";
import TermItem from "@/components/signup/TermItem";
import Button from "@/components/common/Button";
import useTermsStore from "@/stores/termsStore";
import WelcomeCroissant from "@/components/svgs/login/WelcomeCroissant";

const SignupTermsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isDetailPage = location.pathname.includes("/signup/terms/");

  const { checkboxes, handleAllCheck, isAllTermsChecked } = useTermsStore();

  const handleTermDetail = (termId: number) => {
    navigate(`/signup/terms/${termId}`);
  };

  const handleNextClick = async () => {
    try {
      await completeAgree();
      navigate("/card-view");
    } catch (error) {
      // console.error("약관 동의 처리 중 오류:", error);
      tokenUtils.removeToken();
      navigate("/login");
    }
  };

  return (
    <>
      {!isDetailPage && (
        <div className="flex flex-col items-center min-h-screen p-4 no-scrollbar">
          <div className="w-full max-w-md text-center mt-10 sm:mt-20">
            <WelcomeCroissant className="w-1/2 aspect-square mx-auto sm:mb-6" />
            <h1 className="text-xl sm:text-2xl font-bold mb-1">암기빵이 처음이시군요</h1>
            <p className="text-xl sm:text-2xl font-bold mb-10 sm:mb-16">
              <span className="text-primary-500">약관내용에</span>
              <span className="text-black"> 동의해주세요</span>
            </p>

            <div className="rounded-lg mb-16 sm:mb-28">
              <label className="flex items-center gap-2 mb-4 rounded-lg">
                <input
                  type="checkbox"
                  className="relative w-5 h-5 rounded appearance-none bg-neutral-100 checked:bg-primary-500 checked:border-primary-500 after:content-['✓'] after:absolute after:text-white checked:after:text-white after:opacity-100 after:top-1/2 after:left-1/2 after:-translate-x-1/2 after:-translate-y-1/2"
                  checked={checkboxes.all}
                  onChange={(e) => handleAllCheck(e.target.checked)}
                />
                <span className="text-base sm:text-lg">약관 전체 동의</span>
              </label>
              <div className="space-y-4 text-left">
                <TermItem
                  id="term1"
                  label="암기빵 이용약관 동의(필수)"
                  termId={1}
                  onDetailClick={handleTermDetail}
                />
                <TermItem
                  id="term2"
                  label="개인정보 처리방침 동의(필수)"
                  termId={2}
                  onDetailClick={handleTermDetail}
                />
                <TermItem
                  id="term3"
                  label="위치기반 서비스 이용약관 동의(필수)"
                  termId={3}
                  onDetailClick={handleTermDetail}
                />
              </div>
            </div>

            <Button
              variant={isAllTermsChecked ? "primary" : "primary-outline"}
              className="w-full max-w-[28rem] py-3"
              disabled={!isAllTermsChecked}
              onClick={handleNextClick}
            >
              다음
            </Button>
          </div>
        </div>
      )}
      <Outlet />
    </>
  );
};

export default SignupTermsPage;
