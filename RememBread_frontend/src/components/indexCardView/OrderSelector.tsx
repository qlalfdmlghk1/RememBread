import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface OrderSelectorProps {
  sortType: "latest" | "popularity" | "fork";
  setSortType: (value: "latest" | "popularity" | "fork") => void;
}

const OrderSelector = ({ sortType, setSortType }: OrderSelectorProps) => {
  return (
    <Select value={sortType} onValueChange={setSortType}>
      <SelectTrigger className="w-1/8 pc:px-3 px-2 border-primary-700 focus:ring-primary-700 focus:border-primary-700 h-full">
        <SelectValue placeholder="정렬 기준" />
      </SelectTrigger>
      <SelectContent className="w-1/8 right-0">
        <SelectItem value="latest">최신순</SelectItem>
        <SelectItem value="popularity">인기순</SelectItem>
        <SelectItem value="fork">포크순</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default OrderSelector;
