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

interface StopTestAlertDialogProps {
  handleStopTest: () => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const StopTestAlertDialog = ({ handleStopTest, isOpen, setIsOpen }: StopTestAlertDialogProps) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="neutral" className="w-full">
          그만하기
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="w-[80%] rounded-md">
        <AlertDialogHeader>
          <AlertDialogTitle>테스트 종료</AlertDialogTitle>
          <AlertDialogDescription>테스트를 그만할까요?</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>취소</AlertDialogCancel>
          <AlertDialogAction
            className="bg-primary-500 text-white hover:bg-primary-600"
            onClick={handleStopTest}
          >
            확인
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default StopTestAlertDialog;
