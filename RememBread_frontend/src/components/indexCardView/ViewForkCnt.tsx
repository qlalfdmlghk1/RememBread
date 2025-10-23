import { Eye, Utensils } from "lucide-react";

interface CardStatProps {
  viewCount?: number;
  forkCount?: number;
}

const ViewForkCnt = ({ viewCount, forkCount }: CardStatProps) => {
  return (
    <div className="flex justify-end items-center w-full gap-1">
      <div className="flex justify-end items-center gap-x-0.5">
        <Eye className="pc:w-5 w-4 pc:h-5 h-4" />
        <span className="block pc:text-sm text-xs truncate overflow-hidden whitespace-nowrap">
          {viewCount}
        </span>
      </div>
      <div className="flex justify-end items-center gap-x-0.5">
        <Utensils className="pc:w-5 w-4 pc:h-4 h-3" />
        <span className="block pc:text-sm text-xs truncate overflow-hidden whitespace-nowrap">
          {forkCount}
        </span>
      </div>
    </div>
  );
};

export default ViewForkCnt;
