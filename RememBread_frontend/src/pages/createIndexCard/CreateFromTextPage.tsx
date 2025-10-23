import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import Button from "@/components/common/Button";
import { Textarea } from "@/components/ui/textarea";
import { postCardsByText } from "@/services/card";
import { useToast } from "@/hooks/use-toast";

const MAX_LENGTH = 10000;

const CreateFromTextPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [inputText, setInputText] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const remainingChars = MAX_LENGTH - inputText.length;

  const handleCreateCard = async () => {
    setIsLoading(true);

    try {
      toast({
        title: "카드를 생성하는 중입니다.",
        description: "카드 생성이 완료되면 알려드릴게요",
      });

      postCardsByText(inputText)
        .then(() => {
          toast({
            variant: "success",
            title: "카드 생성 완료",
            description: "카드 생성이 완료됐어요!",
          });
        })
        .catch((error) => {
          // console.error("카드 생성 중 오류:", error);
          toast({
            variant: "destructive",
            title: "카드 생성 실패",
            description: "카드 생성중 오류가 발생했어요",
          });

          setIsLoading(false);
        });
    } catch (error) {
      // console.error("카드 생성 중 오류:", error);
    } finally {
      setTimeout(() => {
        navigate("/create");
      }, 1500);
    }
  };

  return (
    <>
      <header className="fixed w-full max-w-[600px] min-h-14 mx-auto bg-white pc:border-x border-b border-neutral-200 z-30 pt-[env(safe-area-inset-top)] top-0 left-0 right-0">
        <nav className="h-full mx-auto">
          <ul className="flex justify-between items-center w-full min-h-14 px-5 relative">
            <ArrowLeft className="cursor-pointer" onClick={() => navigate(-1)} />
            <h1 className="text-xl font-bold">카드 생성</h1>
            <div className="w-8 h-8"></div>
          </ul>
        </nav>
      </header>

      <div
        className="flex flex-col justify-between w-full mt-14 text-center"
        style={{ minHeight: "calc(100vh - 126px)" }}
      >
        <div className="flex justify-center p-5 text-xl font-bold">텍스트를 재료로 넣어주세요</div>

        <div className="flex flex-col flex-1" style={{ maxHeight: "calc(100vh - 126px)" }}>
          <div className="flex flex-1 justify-center w-full overflow-auto rounded-xl">
            <div className="flex w-full min-h-full mx-5 p-2 bg-[#BA7E4E] rounded-2xl">
              <div className="flex flex-col w-full min-h-full bg-[#FDF0CF] border-8 border-[#F0A365] rounded-xl">
                <Textarea
                  maxLength={MAX_LENGTH}
                  className="w-full h-full overflow-auto scrollbar-hide focus-visible:ring-0 shadow-none border-none"
                  value={inputText}
                  placeholder="여기에 텍스트를 입력하세요"
                  onChange={(e) => setInputText(e.target.value)}
                />
                <div
                  className={`text-right text-sm ${
                    remainingChars <= 0 ? "text-negative-500" : "text-neutral-500"
                  }`}
                >
                  {inputText.length}/{MAX_LENGTH}
                </div>
              </div>
            </div>
          </div>

          <Button className="m-5" variant="primary" onClick={handleCreateCard} disabled={isLoading}>
            카드 생성하기
          </Button>
        </div>
      </div>
    </>
  );
};

export default CreateFromTextPage;
