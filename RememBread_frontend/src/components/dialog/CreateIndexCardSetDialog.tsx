import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { postCards } from "@/services/card";
import { postCardSet } from "@/services/cardSet";
import { useCardStore } from "@/stores/cardStore";

import Button from "@/components/common/Button";
import HashtagInput from "@/components/common/HashtagInput";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Folder } from "@/types/folder";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

interface CreateIndexCardSetDialogProps {
  selectedFolder: Folder;
}
const CreateIndexCardSetDialog = ({ selectedFolder }: CreateIndexCardSetDialogProps) => {
  const navigate = useNavigate();
  const cardSet = useCardStore((state) => state.cardSet);
  const resetCardSet = useCardStore((state) => state.resetCardSet);

  const [hashtags, setHashtags] = useState<string[]>([]);
  const [hashtagInput, setHashtagInput] = useState<string>("");
  const [cardSetName, setCardSetName] = useState<string>("");
  const [isPublic, setIsPublic] = useState<boolean>(false);

  const handleCreateCardSet = async () => {
    // 빈 카드셋 생성
    try {
      const response = await postCardSet({
        folderId: selectedFolder.id,
        name: cardSetName,
        hashtags,
        isPublic: isPublic,
      });

      const cardSetId = response.result.cardSetId;

      await postCards(cardSetId, cardSet);
    } catch (error) {
      // console.error("카드셋 생성 실패:", error);
      return;
    } finally {
      // 카드셋 초기화
      resetCardSet();

      navigate("/card-view");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="primary" className="m-5">
          빵 만들기
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-xs rounded-lg">
        <DialogHeader>
          <DialogTitle>빵 만들기</DialogTitle>
          <DialogDescription>
            <span className="text-primary-500 font-bold">{selectedFolder.name}</span> 폴더에 새로운
            빵을 생성합니다.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          <div className="grid grid-cols-4 items-center gap-4">
            <span>빵 이름</span>

            <Input
              id="name"
              value={cardSetName}
              placeholder="새로운 빵"
              onChange={(e) => setCardSetName(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>

        <div className="flex justify-between py-2">
          {isPublic ? <span>공개</span> : <span>비공개</span>}

          <Switch checked={isPublic} onCheckedChange={setIsPublic} />
        </div>

        <div className="pt-2">
          <HashtagInput
            hashtags={hashtags}
            hashtagInput={hashtagInput}
            setHashTags={setHashtags}
            setHashtagInput={setHashtagInput}
          />
        </div>

        <DialogFooter>
          <DialogClose>
            <Button variant="primary" className="w-full" onClick={handleCreateCardSet}>
              생성
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateIndexCardSetDialog;
