import { useState } from "react";

import Button from "@/components/common/Button";
import { postFolder } from "@/services/folder";

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

interface CreateFolderDialogProps {
  selectedFolderName: string | null;
  selectedFolderId: number | null;
  onCreateFolder: () => void;
}

const CreateFolderDialog = ({
  selectedFolderName,
  selectedFolderId,
  onCreateFolder,
}: CreateFolderDialogProps) => {
  const [folderName, setFolderName] = useState<string>("");

  const handleCreateFolder = async () => {
    await postFolder(folderName, selectedFolderId);
    onCreateFolder();
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="primary">추가</Button>
      </DialogTrigger>
      <DialogContent className="max-w-xs rounded-lg">
        <DialogHeader>
          <DialogTitle>폴더 생성</DialogTitle>
          <DialogDescription>
            {selectedFolderName ? (
              <>
                <span className="text-primary-500 font-bold">{selectedFolderName}</span>폴더에
              </>
            ) : (
              ""
            )}{" "}
            새로운 폴더를 생성합니다.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-5 items-center gap-4">
            <span className="col-span-2">폴더 이름</span>

            <Input
              id="name"
              value={folderName}
              placeholder="새로운 폴더"
              onChange={(e) => setFolderName(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose>
            <div
              className="flex justify-center items-center text-sm font-bold rounded-lg transition-colors ease-in-out w-full h-9 bg-primary-500 hover:bg-primary-400 text-white"
              onClick={handleCreateFolder}
            >
              폴더 생성
            </div>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateFolderDialog;
