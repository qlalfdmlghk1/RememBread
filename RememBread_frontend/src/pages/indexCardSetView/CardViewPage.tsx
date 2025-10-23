import { useEffect, useState } from "react";
import { ArrowLeft, HelpCircle, Search } from "lucide-react";

import Button from "@/components/common/Button";
import { Input } from "@/components/ui/input";
import DefaultBread from "@/components/svgs/breads/DefaultBread";
import SelectFolder from "@/components/indexCardView/SelectFolder";
import CardSetList from "@/components/indexCardView/CardSetList";
import CardSetDetail from "@/components/indexCardView/CardSetDetail";
import OrderSelector from "@/components/indexCardView/OrderSelector";
import RecentSearchList from "@/components/indexCardView/RecentSearchList";
import TutorialModal from "@/components/tutorial/TutorialModal";

const tabs = ["내카드", "카드 둘러보기"];

const CardViewPage = () => {
  const [nickname, setNickname] = useState<string>("");
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [folderSelect, setFolderSelect] = useState<boolean>(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  const [query, setQuery] = useState<string>("");
  const [inputText, setInputText] = useState<string>("");
  const [isMyCardSet, setIsMyCardSet] = useState<number>(0);
  const [selectedFolderId, setSelectedFolderId] = useState<number | null>(null);
  const [selectedCardSetId, setSelectedCardSetId] = useState<number | null>(null);
  const [sortType, setSortType] = useState<"latest" | "popularity" | "fork">("latest");
  const [isTutorialOpen, setIsTutorialOpen] = useState<boolean>(false);

  const saveSearchKeyword = (keyword: string) => {
    if (!keyword.trim()) return;

    const stored = localStorage.getItem("searchHistory");
    const parsed: string[] = stored ? JSON.parse(stored) : [];

    const updated = [keyword, ...parsed.filter((item) => item !== keyword)];
    localStorage.setItem("searchHistory", JSON.stringify(updated.slice(0, 10)));
  };

  useEffect(() => {
    if (isFocused) {
      const stored = localStorage.getItem("searchHistory");
      if (stored) {
        setSearchHistory(JSON.parse(stored));
      }
    }
  }, [isFocused]);

  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      e.preventDefault();
      setIsFocused(false);
      window.history.pushState(null, "", window.location.href);
    };

    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  return (
    <>
      <header className="fixed w-full max-w-[600px] min-h-14 mx-auto bg-white pc:border-x border-b border-neutral-200 z-30 pt-env(safe-area-inset-top) top-0 left-0 right-0">
        <nav className="h-full mx-auto">
          <div className="flex justify-between items-center w-full min-h-14 px-5 relative">
            {/* 가운데 로고를 absolute로 배치 */}
            <div className="absolute left-1/2 transform -translate-x-1/2">
              <DefaultBread className="hover:cursor-pointer" />
            </div>

            {/* 오른쪽 물음표 버튼 */}
            <button onClick={() => setIsTutorialOpen(true)} className="ml-auto">
              <HelpCircle size={24} className="text-neutral-400" />
            </button>
          </div>
        </nav>
      </header>

      <TutorialModal isOpen={isTutorialOpen} onClose={() => setIsTutorialOpen(false)} />
      <div
        className={`flex flex-col items-start fixed max-w-[598px] w-full mx-auto p-5 bg-white z-40 ${
          isFocused && !folderSelect ? "transition-all duration-300" : ""
        } ${isFocused || folderSelect ? "h-full top-0 py-0" : "pb-0 top-[57px]"}`}
      >
        <div className="flex w-full">
          {isFocused ? (
            <div className="flex items-center h-14">
              <ArrowLeft
                className="cursor-pointer"
                onClick={() => {
                  setIsFocused(false);
                  setFolderSelect(false);
                }}
              />
            </div>
          ) : null}

          {selectedCardSetId === null && !folderSelect && (
            <Input
              placeholder={isFocused ? "검색어 | @작성자 | #해시태그" : "검색어를 입력해주세요"}
              onFocus={() => setIsFocused(true)}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setQuery(inputText);
                  saveSearchKeyword(inputText);
                  setIsFocused(false);
                  e.currentTarget.blur();
                }
              }}
              className={`${
                isFocused ? "border-0 ring-0 shadow-none focus-visible:ring-0 h-14" : "bg-white"
              }`}
            />
          )}

          {isMyCardSet === 0 && !isFocused && !folderSelect && !selectedCardSetId && (
            <Button className="ml-5" variant="primary" onClick={() => setFolderSelect(true)}>
              폴더 선택
            </Button>
          )}

          {folderSelect && (
            <SelectFolder
              isMyCardSet={isMyCardSet === 0 ? true : false}
              selectedCardSetId={selectedCardSetId}
              setFolderSelect={setFolderSelect}
              setSelectedFolderId={setSelectedFolderId}
            />
          )}

          {selectedCardSetId !== null && !folderSelect && (
            <CardSetDetail
              nickname={nickname}
              isMyCardSet={isMyCardSet === 0 ? true : false}
              selectedCardSetId={selectedCardSetId}
              setSelectedCardSetId={setSelectedCardSetId}
              setFolderSelect={setFolderSelect}
            />
          )}

          {isFocused ? (
            <div className="flex items-center h-14">
              <Search
                className="cursor-pointer"
                onClick={(e) => {
                  setQuery(inputText);
                  saveSearchKeyword(inputText);
                  setIsFocused(false);
                  e.currentTarget.blur();
                }}
              />
            </div>
          ) : null}
        </div>

        {!selectedCardSetId &&
          !folderSelect &&
          (isFocused ? (
            <div className="flex flex-col w-full gap-5">
              <OrderSelector sortType={sortType} setSortType={setSortType} />
              {searchHistory.length > 0 && (
                <RecentSearchList
                  searchHistory={searchHistory}
                  setSearchHistory={setSearchHistory}
                  setQuery={setQuery}
                  setInputText={setInputText}
                  setIsFocused={setIsFocused}
                />
              )}
            </div>
          ) : (
            <div className="relative w-full flex gap-1 border-b">
              {tabs.map((tab, index) => (
                <div
                  key={index}
                  className={`flex-1 p-2 text-center cursor-pointer ${
                    isMyCardSet === index ? "font-bold text-primary-500" : "text-neutral-500"
                  }`}
                  onClick={() => setIsMyCardSet(index)}
                >
                  {tab}
                </div>
              ))}
              <div
                className="absolute bottom-0 h-1 bg-primary-500 transition-all duration-300"
                style={{ width: "50%", left: `${isMyCardSet * 50}%` }}
              />
            </div>
          ))}
      </div>

      {!selectedCardSetId && (
        <div
          className="flex flex-col justify-start w-full mt-[190px]"
          style={{ minHeight: "calc(100vh - 260px)" }}
        >
          <div className="relative flex-1 overflow-hidden">
            <div
              className="flex w-[200%] h-full transition-transform duration-300"
              style={{ transform: `translateX(-${isMyCardSet * 50}%)` }}
            >
              <div className="w-1/2 shrink-0 overflow-y-auto">
                <CardSetList
                  isMyCardSet={true}
                  folderId={selectedFolderId ?? 0}
                  query={query}
                  sortType={sortType}
                  setNickname={setNickname}
                  setSelectedCardSetId={setSelectedCardSetId}
                />
              </div>
              <div
                className={`w-1/2 shrink-0 overflow-y-auto transition-all duration-300 ${
                  isMyCardSet === 0 ? "max-h-0" : ""
                }`}
              >
                <CardSetList
                  isMyCardSet={false}
                  folderId={selectedFolderId ?? 0}
                  query={query}
                  sortType={sortType}
                  setNickname={setNickname}
                  setSelectedCardSetId={setSelectedCardSetId}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CardViewPage;
