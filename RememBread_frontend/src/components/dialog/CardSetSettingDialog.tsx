import { useEffect, useState } from "react";
import { Settings } from "lucide-react";

import HashtagInput from "@/components/common/HashtagInput";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { updateCardSet, deleteCardSet } from "@/services/cardSet";

interface CardSetSettingDialogProps {
  cardSetId: number;
  name: string;
  setName: (name: string) => void;
  hashtags: string[];
  setHashTags: (hashTags: string[]) => void;
  isPublic: boolean;
  setIsPublic: (isPublic: boolean) => void;
  setFolderSelect: (folderSelect: boolean) => void;
  setSelectedCardSetId: (id: number | null) => void;
}

const CardSetSettingDialog = ({
  cardSetId,
  name,
  setName,
  hashtags,
  setHashTags,
  isPublic,
  setIsPublic,
  setFolderSelect,
  setSelectedCardSetId,
}: CardSetSettingDialogProps) => {
  const [newName, setNewName] = useState<string>("");
  const [newHashtags, setNewHashtags] = useState<string[]>([]);
  const [newIsPublic, setNewIsPublic] = useState<boolean>(false);
  const [hashtagInput, setHashtagInput] = useState<string>("");

  const [deleteCheck, setDeleteCheck] = useState<boolean>(false);

  const handleSave = async () => {
    try {
      await updateCardSet({
        cardSetId,
        name: newName,
        hashtags: newHashtags,
        isPublic: newIsPublic ? 1 : 0,
      });

      setName(newName);
      setHashTags(newHashtags);
      setIsPublic(newIsPublic ? true : false);
    } catch (e) {
      // console.error("카드셋 수정 실패:", e);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteCardSet(cardSetId);

      setSelectedCardSetId(null);
    } catch (e) {
      // console.error("카드셋 삭제 실패:", e);
    }
  };

  useEffect(() => {
    setNewName(name);
    setNewHashtags(hashtags);
    setNewIsPublic(isPublic);
  }, [name, hashtags, isPublic]);

  return (
    <Dialog aaria-hidden="false">
      <DialogTrigger asChild>
        <Settings />
      </DialogTrigger>

      <DialogContent className="max-w-xs rounded-lg">
        <DialogHeader>
          {deleteCheck ? (
            <DialogTitle>카드셋 삭제</DialogTitle>
          ) : (
            <DialogTitle>카드셋 설정</DialogTitle>
          )}

          <DialogDescription></DialogDescription>
        </DialogHeader>

        {deleteCheck ? (
          <>
            <div className="text-center text-sm">
              <span className="text-primary-500 font-bold">{name}</span>카드셋을 삭제할게요
              <br />
              카드셋이 삭제되면 복구할 수 없어요
            </div>
          </>
        ) : (
          <>
            <div className="grid gap-4 py-2">
              <div className="grid grid-cols-4 items-center gap-4">
                <span>빵 이름</span>

                <Input
                  id="newName"
                  value={newName}
                  placeholder="이름을 입력해주세요"
                  onChange={(e) => setNewName(e.target.value)}
                  className="col-span-3"
                />
              </div>
            </div>

            <div className="flex justify-between py-2">
              {newIsPublic ? <span>공개</span> : <span>비공개</span>}

              <Switch checked={newIsPublic} onCheckedChange={setNewIsPublic} />
            </div>

            <div className="pt-2">
              <HashtagInput
                hashtags={newHashtags}
                hashtagInput={hashtagInput}
                setHashTags={setNewHashtags}
                setHashtagInput={setHashtagInput}
              />
            </div>
          </>
        )}

        <DialogFooter>
          <DialogClose className="flex w-full gap-5">
            {deleteCheck ? (
              <>
                <div
                  className="flex justify-center items-center text-sm font-bold rounded-lg transition-colors ease-in-out w-full px-4 h-9 bg-negative-500 hover:bg-negative-400 text-white"
                  onClick={handleDelete}
                >
                  삭제
                </div>
              </>
            ) : (
              <>
                <div
                  className="flex justify-center items-center text-sm font-bold rounded-lg transition-colors ease-in-out w-full px-4 h-9 bg-primary-500 hover:bg-primary-400 text-white"
                  onClick={() => setFolderSelect(true)}
                >
                  이동
                </div>
                <div
                  className="flex justify-center items-center text-sm font-bold rounded-lg transition-colors ease-in-out w-full px-4 h-9 bg-primary-500 hover:bg-primary-400 text-white"
                  onClick={handleSave}
                >
                  설정 완료
                </div>
              </>
            )}
          </DialogClose>
        </DialogFooter>

        {!deleteCheck ? (
          <div
            className="text-center text-sm text-neutral-500 underline cursor-pointer"
            onClick={() => setDeleteCheck(true)}
          >
            삭제하기
          </div>
        ) : (
          <div
            className="flex justify-center items-center text-sm font-bold rounded-lg transition-colors ease-in-out w-full px-4 h-9 bg-neutral-500 hover:bg-neutral-400 text-white"
            onClick={() => setDeleteCheck(false)}
          >
            취소
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CardSetSettingDialog;
