import { Dispatch, SetStateAction } from "react";
import { X } from "lucide-react";

type RecentSearchListProps = {
  searchHistory: string[];
  setSearchHistory: Dispatch<SetStateAction<string[]>>;
  setQuery: Dispatch<SetStateAction<string>>;
  setInputText: Dispatch<SetStateAction<string>>;
  setIsFocused: Dispatch<SetStateAction<boolean>>;
};

const RecentSearchList = ({
  searchHistory,
  setSearchHistory,
  setQuery,
  setInputText,
  setIsFocused,
}: RecentSearchListProps) => {
  const handleClear = () => {
    localStorage.removeItem("searchHistory");
    setSearchHistory([]);
  };

  const handleDelete = (wordToDelete: string) => {
    const updated = searchHistory.filter((word) => word !== wordToDelete);
    localStorage.setItem("searchHistory", JSON.stringify(updated));
    setSearchHistory(updated);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <p className="text-lg">최근 검색어</p>
        <button className="text-sm text-neutral-400 hover:text-neutral-600" onClick={handleClear}>
          전체삭제
        </button>
      </div>
      <ul className="flex flex-wrap gap-2 text-sm text-neutral-600">
        {searchHistory.map((word, i) => (
          <li
            key={i}
            className="flex items-center px-3 py-1 bg-neutral-100 rounded-full gap-1 cursor-pointer"
            onClick={() => {
              setQuery(word);
              setInputText(word);
              setIsFocused(false);
            }}
          >
            <span>{word}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(word);
              }}
              className="text-neutral-400 hover:text-neutral-600 ml-1"
            >
              <X size={14} />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentSearchList;
