import { useState, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, X } from "lucide-react";

import Button from "@/components/common/Button";
import { Input } from "@/components/ui/input";
import { postCardsByImage } from "@/services/card";
import { useToast } from "@/hooks/use-toast";

const CreateFromImagePage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    if (files) {
      const validImageTypes = ["image/jpeg", "image/png", "image/gif"];
      const selectedFiles: File[] = [];

      Array.from(files).forEach((file) => {
        if (validImageTypes.includes(file.type)) {
          selectedFiles.push(file);
        } else {
          // console.error(`"${file.name}" 파일은 이미지 파일이 아닙니다.`);
        }
      });

      if (selectedFiles.length > 0) {
        setSelectedFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
      }
    }
  };

  const handleRemoveFile = (fileToRemove: File) => {
    setSelectedFiles(selectedFiles.filter((file) => file !== fileToRemove));
  };
  const handleCreateCard = () => {
    setIsLoading(true);

    try {
      toast({
        title: "카드를 생성하는 중입니다.",
        description: "카드 생성이 완료되면 알려드릴게요",
      });

      postCardsByImage(selectedFiles)
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
        <div className="flex justify-center p-5 text-xl font-bold">
          이미지 파일을 재료로 넣어주세요
        </div>

        <div className="flex flex-col flex-1" style={{ maxHeight: "calc(100vh - 126px)" }}>
          <div className="p-5">
            <Input className="" type="file" onChange={handleFileChange} />
          </div>

          {selectedFiles.length > 0 && (
            <div className="mx-5 gap-2">
              <h2 className="text-lg font-semibold">업로드된 이미지</h2>
              <div
                className="grid grid-cols-3 pc:grid-cols-5 gap-2 gap-y-2 overflow-auto scrollbar-hide"
                style={{ maxHeight: "calc(100vh - 374px)" }}
              >
                {selectedFiles.map((file, index) => (
                  <div>
                    <div key={index} className="relative flex justify-center rounded-xl">
                      <div className="flex p-1 bg-[#BA7E4E] rounded-2xl">
                        <div className="flex flex-col p-1 bg-[#FDF0CF] border-8 border-[#F0A365] rounded-xl">
                          <img
                            src={URL.createObjectURL(file)}
                            alt={file.name}
                            className="object-fill w-16 h-16 rounded"
                          />
                        </div>
                      </div>

                      <X
                        className="absolute top-1 right-2 stroke-gray-500 cursor-pointer"
                        onClick={() => handleRemoveFile(file)}
                      />
                    </div>
                    <p className="w-full text-xs text-center font-bold truncate">{file.name}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <Button
          className="m-5"
          variant="primary"
          onClick={handleCreateCard}
          disabled={isLoading || selectedFiles.length === 0}
        >
          카드 생성하기
        </Button>
      </div>
    </>
  );
};

export default CreateFromImagePage;
