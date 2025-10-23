import { useNavigate } from "react-router-dom";

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
import { useCardStore } from "@/stores/cardStore";
import { indexCardSet } from "@/types/indexCard";
import { postCards } from "@/services/card";

interface MergeCardAlertDialogProps {
  selectedCardSet: indexCardSet;
}

const MergeCardAlertDialog = ({ selectedCardSet }: MergeCardAlertDialogProps) => {
  const navigate = useNavigate();
  const cardSet = useCardStore((state) => state.cardSet);
  const resetCardSet = useCardStore((state) => state.resetCardSet);

  const handleMerge = async () => {
    try {
      await postCards(selectedCardSet.cardSetId, cardSet);
    } catch (error) {
      // console.error("카드셋 병합 실패:", error);
      return;
    } finally {
      resetCardSet();

      navigate("/card-view");
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="primary" className="m-5">
          병합하기
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="w-[80%] rounded-md">
        <AlertDialogHeader>
          <AlertDialogTitle>병합하기</AlertDialogTitle>
          <AlertDialogDescription>
            <span className="text-primary-500 font-bold">{selectedCardSet.name}</span> 카드셋과 현재
            카드셋을 병합합니다. <br />
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>취소</AlertDialogCancel>
          <AlertDialogAction className="bg-primary-500" onClick={handleMerge}>
            확인
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default MergeCardAlertDialog;
