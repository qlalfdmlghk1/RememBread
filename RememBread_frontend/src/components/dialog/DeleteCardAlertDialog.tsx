import { Dispatch, SetStateAction } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Button from "@/components/common/Button";
import { deleteCards } from "@/services/card";

interface DeleteCardAlertDialogProps {
  selected: number[];
  setSelected: Dispatch<SetStateAction<number[]>>;
  onDeleteSuccess: () => void;
}

const DeleteCardAlertDialog = ({
  selected,
  setSelected,
  onDeleteSuccess,
}: DeleteCardAlertDialogProps) => {
  const handleDeleteCards = async () => {
    try {
      await deleteCards(selected);

      setSelected([]);

      onDeleteSuccess();
    } catch (e) {
      // console.error("카드 삭제 실패:", e);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="negative">삭제</Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="w-[80%] rounded-md">
        <AlertDialogHeader>
          <AlertDialogTitle>카드 삭제</AlertDialogTitle>
          <AlertDialogDescription>
            <span className="text-primary-500 font-bold">{selected.length}개</span>의 카드가
            선택되었어요
            <br />
            카드가 삭제되면 복구할 수 없어요
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>취소</AlertDialogCancel>
          <AlertDialogAction className="bg-negative-400" onClick={handleDeleteCards}>
            삭제
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteCardAlertDialog;
