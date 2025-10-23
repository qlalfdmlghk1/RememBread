import { useState, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";
// import pdfWorkerPath from "pdfjs-dist/build/pdf.worker.min.mjs?url";

// GlobalWorkerOptions.workerSrc = pdfWorkerPath;
// GlobalWorkerOptions.workerSrc = "/pdf.worker.js";
// GlobalWorkerOptions.workerSrc = undefined as unknown as string;
GlobalWorkerOptions.workerSrc = "/pdf.worker.js";

import Button from "@/components/common/Button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { postCardsPageByPDF } from "@/services/card";
import { useToast } from "@/hooks/use-toast";

const CreateFromPDFPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [pageCount, setPageCount] = useState<number>(1);
  const [pageRange, setPageRange] = useState<[number, number]>([1, 1]);
  const [startPage, endPage] = pageRange;

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      if (file.type === "application/pdf") {
        setSelectedFile(file);

        const fileReader = new FileReader();

        fileReader.onload = async () => {
          if (fileReader.result) {
            const typedarray = new Uint8Array(fileReader.result as ArrayBuffer);

            try {
              const pdf = await getDocument(typedarray).promise;
              setPageCount(pdf.numPages);
              setPageRange([1, pdf.numPages]);
            } catch (error) {
              // console.error("PDF 로딩 실패", error);
            }
          }
        };

        fileReader.readAsArrayBuffer(file);
      } else {
        // console.error("PDF 파일만 업로드할 수 있습니다.");
      }
    }
  };

  const handleSliderChange = (value: number[]) => {
    setPageRange([value[0], value[1]]);
  };

  const handleCreateCard = async () => {
    setIsLoading(true);

    try {
      toast({
        title: "카드를 생성하는 중입니다.",
        description: "카드 생성이 완료되면 알려드릴게요",
      });
      postCardsPageByPDF(selectedFile!, startPage, endPage)
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
        <div className="flex justify-center p-5 text-xl font-bold">PDF파일을 재료로 넣어주세요</div>

        <div className="flex flex-col flex-1" style={{ maxHeight: "calc(100vh - 126px)" }}>
          <div className="p-5">
            <Input className="" type="file" onChange={handleFileChange} />
          </div>
          {selectedFile && (
            <div className="m-5 gap-2">
              <>
                <div className="flex flex-col gap-2 text-start">
                  <span>
                    페이지 설정 {startPage} - {endPage}
                  </span>
                  <Slider
                    defaultValue={[1, pageCount]}
                    min={1}
                    max={pageCount}
                    step={1}
                    range={true}
                    value={pageRange}
                    onValueChange={handleSliderChange}
                  />
                </div>
              </>
            </div>
          )}
        </div>
        <Button
          className="m-5"
          variant="primary"
          onClick={handleCreateCard}
          disabled={isLoading || selectedFile === null}
        >
          카드 생성하기
        </Button>
      </div>
    </>
  );
};

export default CreateFromPDFPage;
