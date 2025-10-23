import {
  AlertDialog,
  AlertDialogPortal,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

interface StopStudyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cardSetId: number;
  onConfirm: () => void;
}

const StopStudyModal = ({ open, onOpenChange, cardSetId, onConfirm }: StopStudyModalProps) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogPortal>
        <AlertDialogContent className="w-[90%] max-w-sm rounded-md p-6">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-center text-lg font-semibold">
              학습 종료 확인
            </AlertDialogTitle>
          </AlertDialogHeader>

          <div className="pc:my-5 my-2 text-center text-sm text-muted-foreground">
            <span className="font-medium text-primary-700">학습을 종료하시겠습니까?</span>
          </div>

          <AlertDialogFooter className="">
            <AlertDialogCancel className="w-full rounded-md bg-neutral-300 text-black hover:bg-neutral-400">
              취소
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={onConfirm}
              className="w-full rounded-md bg-primary-700 text-white hover:bg-primary-800"
            >
              확인
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogPortal>
    </AlertDialog>
  );
};

export default StopStudyModal;
