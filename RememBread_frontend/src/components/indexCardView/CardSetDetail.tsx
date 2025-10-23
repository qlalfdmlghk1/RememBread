import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { indexCard } from "@/types/indexCard";
import { getCardSetById } from "@/services/cardSet";
import { getCardsByCardSet, patchCard, postCard } from "@/services/card";
import Button from "@/components/common/Button";
import DeleteCardAlertDialog from "@/components/dialog/DeleteCardAlertDialog";
import CardSetSettingDialog from "@/components/dialog/CardSetSettingDialog";
import TestSettingDialog from "@/components/dialog/TestSettingDialog";

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

interface CardSetDetailProps {
  nickname: string;
  isMyCardSet: boolean;
  selectedCardSetId: number;
  setSelectedCardSetId: (id: number | null) => void;
  setFolderSelect: (folderSelect: boolean) => void;
}

const CardSetDetail = ({
  nickname,
  isMyCardSet,
  selectedCardSetId,
  setSelectedCardSetId,
  setFolderSelect,
}: CardSetDetailProps) => {
  const navigate = useNavigate();

  const [name, setName] = useState<string>("");
  const [hashtags, setHashTags] = useState<string[]>([]);
  const [isPublic, setIsPublic] = useState<boolean>(false);
  const [totalCards, setTotalCards] = useState<number>(0);

  const [page, setPage] = useState<number>(0);
  const [hasNext, setHasNext] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const observerRef = useRef<HTMLDivElement | null>(null);

  const [cards, setCards] = useState<indexCard[]>([]);
  const [selected, setSelected] = useState<number[]>([]);

  const [inputText, setInputText] = useState<string>("");

  const [editingCardId, setEditingCardId] = useState<number | null>(null);
  const [editConcept, setEditConcept] = useState<string>("");
  const [editDescription, setEditDescription] = useState<string>("");

  const handleCheckboxChange = (index: number) => {
    setSelected((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
    );
  };

  const handleEditCard = (index: number) => {
    const card = cards[index];
    setEditingCardId(card.cardId!);
    setEditConcept(card.concept);
    setEditDescription(card.description);
  };

  const handleAddCard = async () => {
    try {
      await postCard(selectedCardSetId, editConcept, editDescription);

      toast({
        variant: "success",
        title: "저장 완료",
        description: "카드가 성공적으로 추가되었습니다.",
      });

      setCards([]);
      setPage(0);
      setHasNext(true);
      fetchCard();

      setEditingCardId(null);
    } catch (e) {
      toast({
        variant: "destructive",
        title: "저장 실패",
        description: "카드 추가 중 문제가 발생했습니다.",
      });
    }
  };

  const handleSaveCard = async () => {
    if (editingCardId === null) {
      return;
    }

    try {
      await patchCard(editingCardId, {
        concept: editConcept,
        description: editDescription,
      });

      toast({
        variant: "success",
        title: "수정 완료",
        description: "카드가 성공적으로 수정되었습니다.",
      });

      setCards([]);
      setPage(0);
      setHasNext(true);
      fetchCard();

      setEditingCardId(null);
    } catch {
      toast({
        variant: "destructive",
        title: "저장 실패",
        description: "카드 저장 중 문제가 발생했습니다.",
      });
    }
  };

  const onDeleteSuccess = () => {
    setCards([]);
    setPage(0);
    setHasNext(true);
    fetchCard();
  };

  const fetchCardSet = async () => {
    try {
      const { result } = await getCardSetById(selectedCardSetId);
      setName(result.name ?? "");
      setHashTags(result.hashtags ?? []);
      setIsPublic(result.isPublic ? true : false);
    } catch (e) {
      // console.error("카드셋 불러오기 실패:", e);
    }
  };

  const fetchCard = async () => {
    if (isLoading || !hasNext) return;

    setIsLoading(true);
    try {
      const response = await getCardsByCardSet(selectedCardSetId, page, 100, "asc");

      setCards((prev) => [...prev, ...response.result.cards]);
      setHasNext(response.result.hasNext);
      setTotalCards(response.result.total);
      setPage((prev) => prev + 1);
    } catch (e) {
      // console.error("카드 불러오기 실패:", e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    if (typeof editingCardId === "number") {
      setEditingCardId(null);
      return;
    }

    setSelectedCardSetId(null);
  };

  useEffect(() => {
    fetchCardSet();
    setPage(0);
    setHasNext(true);
    fetchCard();
  }, [selectedCardSetId]);

  useEffect(() => {
    if (!observerRef.current || !hasNext) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchCard();
        }
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 1.0,
      },
    );

    observer.observe(observerRef.current);

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [observerRef.current, hasNext, page]);

  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      e.preventDefault();

      handleBack();
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [editingCardId]);

  return (
    <>
      <header className="fixed w-full max-w-[600px] min-h-14 mx-auto bg-white pc:border-x border-b border-neutral-200 z-30 pt-env(safe-area-inset-top) top-0 left-0 right-0">
        <nav className="h-full mx-auto">
          <ul className="flex justify-between items-center w-full min-h-14 px-5 relative">
            <ArrowLeft className="cursor-pointer" onClick={handleBack} />
            <h1 className="text-xl font-bold">{name}</h1>
            <div className="flex justify-center items-center w-8 h-8">
              {isMyCardSet && (
                <CardSetSettingDialog
                  cardSetId={selectedCardSetId}
                  name={name}
                  setName={setName}
                  hashtags={hashtags}
                  setHashTags={setHashTags}
                  isPublic={isPublic}
                  setIsPublic={setIsPublic}
                  setFolderSelect={setFolderSelect}
                  setSelectedCardSetId={setSelectedCardSetId}
                />
              )}
            </div>
            {!isMyCardSet && (
              <div className="absolute right-5 bottom-0 text-neutral-400 text-sm">@{nickname}</div>
            )}
          </ul>
        </nav>
      </header>

      {typeof editingCardId === "number" ? (
        <div
          className="flex flex-col justify-between w-full text-center"
          style={{ minHeight: "calc(100vh - 146px)" }}
        >
          <div
            className="flex flex-col flex-grow overflow-hidden"
            style={{ maxHeight: "calc(100vh - 212px)" }}
          >
            <div className="text-start">
              <Label className="text-lg">앞면</Label>
              <Input
                className="focus-visible:ring-0"
                value={editConcept}
                onChange={(e) => setEditConcept(e.target.value)}
                maxLength={50}
                readOnly={!isMyCardSet}
              ></Input>
              <p
                className={`text-sm text-right ${
                  editConcept.length > 50 ? "text-red-500" : "text-muted-foreground"
                }`}
              >
                {editConcept.length} / 50
              </p>
            </div>
            <div className="flex-grow flex flex-col overflow-hidden text-start py-5">
              <Label className="text-lg">뒷면</Label>
              <Textarea
                className="h-full flex-grow scrollbar-hide focus-visible:ring-0"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                maxLength={1000}
                readOnly={!isMyCardSet}
              />
              <p
                className={`text-sm text-right ${
                  editDescription.length > 1000 ? "text-red-500" : "text-muted-foreground"
                }`}
              >
                {editDescription.length} / 1000
              </p>
            </div>
          </div>

          {isMyCardSet ? (
            editingCardId === -1 ? (
              <Button className="mb-5" variant="primary" onClick={handleAddCard}>
                추가
              </Button>
            ) : (
              <Button className="mb-5" variant="primary" onClick={handleSaveCard}>
                수정
              </Button>
            )
          ) : (
            <Button className="mb-5" variant="primary" onClick={() => setEditingCardId(null)}>
              확인
            </Button>
          )}
        </div>
      ) : (
        <div
          className="flex flex-col justify-between w-full text-center"
          style={{ minHeight: "calc(100vh - 146px)" }}
        >
          <div>
            {isMyCardSet ? (
              <div className="flex flex-col gap-5 mb-5">
                <div className="flex gap-5">
                  <Input
                    placeholder="내용을 입력하세요"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                  />

                  {selected.length > 0 ? (
                    <DeleteCardAlertDialog
                      selected={selected}
                      setSelected={setSelected}
                      onDeleteSuccess={onDeleteSuccess}
                    />
                  ) : (
                    <Button
                      variant="primary"
                      onClick={() => {
                        setEditingCardId(-1);
                        setEditConcept(inputText);
                        setEditDescription("");
                        setInputText("");
                      }}
                    >
                      추가
                    </Button>
                  )}
                </div>
                <div className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm overflow-x-auto whitespace-nowrap scrollbar-hide">
                  {hashtags.length > 0 ? (
                    hashtags.map((tag, index) => (
                      <span key={index} className="mr-2 text-neutral-400">
                        #{tag}
                      </span>
                    ))
                  ) : (
                    <span className="text-neutral-400">태그 없음</span>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex gap-5 mb-5">
                <div className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm overflow-x-auto whitespace-nowrap scrollbar-hide">
                  {hashtags.length > 0 ? (
                    hashtags.map((tag, index) => (
                      <span key={index} className="mr-2 text-neutral-400">
                        #{tag}
                      </span>
                    ))
                  ) : (
                    <span className="text-neutral-400">태그 없음</span>
                  )}
                </div>
                <Button variant="primary" onClick={() => setFolderSelect(true)}>
                  가져오기
                </Button>
              </div>
            )}

            <div
              className="overflow-auto scrollbar-hide"
              style={{ maxHeight: isMyCardSet ? "calc(100vh - 328px)" : "calc(100vh - 272px)" }}
            >
              <div className="text-left rounded-md border">
                <Table className="table-fixed">
                  <TableHeader>
                    <TableRow>
                      {isMyCardSet && <TableHead className="w-10 text-center p-0">선택</TableHead>}
                      <TableHead className="w-28">앞면</TableHead>
                      <TableHead className="w-full">뒷면</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cards.length > 0 ? (
                      cards.map((card, index) => (
                        <TableRow key={index} className="h-10">
                          {isMyCardSet && (
                            <TableCell className="text-center p-0">
                              <Checkbox
                                checked={selected.includes(card.cardId!)}
                                onCheckedChange={() => handleCheckboxChange(card.cardId!)}
                              />
                            </TableCell>
                          )}
                          <TableCell
                            className="truncate overflow-hidden whitespace-nowrap font-bold"
                            onClick={() => handleEditCard(index)}
                          >
                            {card.concept}
                          </TableCell>
                          <TableCell
                            className="truncate overflow-hidden whitespace-nowrap"
                            onClick={() => handleEditCard(index)}
                          >
                            {card.description}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center text-neutral-500 py-5">
                          표시할 카드가 없습니다
                        </TableCell>
                      </TableRow>
                    )}
                    {hasNext && (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center">
                          <div ref={observerRef} className="h-5" />
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>

          <div className="flex w-full mb-5 gap-5">
            <Button
              className="w-full"
              variant="primary-outline"
              disabled={totalCards === 0}
              onClick={() =>
                navigate(`/study/${selectedCardSetId}`, {
                  state: {
                    card: {
                      cardSetId: selectedCardSetId,
                    },
                  },
                })
              }
            >
              학습하기
            </Button>

            {isMyCardSet && (
              <TestSettingDialog indexCardId={selectedCardSetId} disabled={totalCards === 0} />
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default CardSetDetail;
