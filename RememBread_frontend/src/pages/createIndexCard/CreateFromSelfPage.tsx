import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import Button from "@/components/common/Button";
import { useCardStore } from "@/stores/cardStore";
import { createCard } from "@/utils/createEmptyCard";

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

const CreateFromSelfPage = () => {
  const navigate = useNavigate();
  const { cardSet, setCardSet } = useCardStore();

  const [selected, setSelected] = useState<number[]>([]);
  const isAllSelected = cardSet.length > 0 && selected.length === cardSet.length;

  const [inputText, setInputText] = useState<string>("");

  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editConcept, setEditConcept] = useState<string>("");
  const [editDescription, setEditDescription] = useState<string>("");

  const handleCheckboxChange = (index: number) => {
    setSelected((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
    );
  };

  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelected([]);
    } else {
      setSelected(cardSet.map((_, index) => index));
    }
  };

  const handleAddCard = () => {
    const updated = [...cardSet, createCard(inputText)];
    setCardSet(updated);
    setInputText("");
  };

  const handleDeleteCard = () => {
    const updated = cardSet.filter((_, index) => !selected.includes(index));
    setCardSet(updated);
    setSelected([]);
  };

  const handleEditCard = (index: number) => {
    const card = cardSet[index];
    setEditConcept(card.concept);
    setEditDescription(card.description);
    setEditingIndex(index);
  };

  const handelEditSave = () => {
    if (typeof editingIndex === "number") {
      const updated = [...cardSet];
      updated[editingIndex] = {
        ...updated[editingIndex],
        concept: editConcept,
        description: editDescription,
      };
      setCardSet(updated);
      setEditingIndex(null);
    }
  };

  const handeleSaveCard = () => {
    navigate("/save");
  };

  return (
    <>
      <header className="fixed w-full max-w-[600px] min-h-14 mx-auto bg-white pc:border-x border-b border-neutral-200 z-30 pt-[env(safe-area-inset-top)] top-0 left-0 right-0">
        <nav className="h-full mx-auto">
          <ul className="flex justify-between items-center w-full min-h-14 px-5 relative">
            {typeof editingIndex === "number" ? (
              <ArrowLeft className="cursor-pointer" onClick={() => setEditingIndex(null)} />
            ) : (
              <ArrowLeft className="cursor-pointer" onClick={() => navigate(-1)} />
            )}

            <h1 className="text-xl font-bold">카드 생성</h1>
            <div className="w-8 h-8"></div>
          </ul>
        </nav>
      </header>

      {typeof editingIndex === "number" ? (
        <div
          className="flex flex-col justify-between w-full mt-14 text-center"
          style={{ minHeight: "calc(100vh - 126px)" }}
        >
          <div
            className="flex flex-col flex-grow overflow-hidden pt-5"
            style={{ maxHeight: "calc(100vh - 190px)" }}
          >
            <div className="text-start mx-5">
              <Label className="text-lg">앞면</Label>
              <Input
                value={editConcept}
                onChange={(e) => setEditConcept(e.target.value)}
                maxLength={50}
              ></Input>
              <p
                className={`text-sm text-right ${
                  editConcept.length > 50 ? "text-red-500" : "text-muted-foreground"
                }`}
              >
                {editConcept.length} / 50
              </p>
            </div>
            <div className="flex-grow flex flex-col overflow-hidden text-start p-5">
              <Label className="text-lg">뒷면</Label>
              <Textarea
                className="h-full flex-grow scrollbar-hide"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                maxLength={1000}
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

          <Button className="mb-5 mx-5" variant="primary" onClick={handelEditSave}>
            수정
          </Button>
        </div>
      ) : (
        <div
          className="flex flex-col justify-between w-full mt-14 text-center"
          style={{ minHeight: "calc(100vh - 126px)" }}
        >
          <div>
            <div className="flex mt-5 mx-5 gap-5">
              <Input
                placeholder="내용을 입력하세요"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
              />
              {selected.length > 0 ? (
                <Button variant="negative" onClick={handleDeleteCard}>
                  삭제
                </Button>
              ) : (
                <Button variant="primary" onClick={handleAddCard}>
                  추가
                </Button>
              )}
            </div>
            <div
              className="m-5 overflow-auto scrollbar-hide"
              style={{ maxHeight: "calc(100vh - 278px)" }}
            >
              <div className="text-left rounded-md border">
                <Table className="table-fixed">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-10 text-center p-0">
                        <Checkbox checked={isAllSelected} onCheckedChange={handleSelectAll} />
                      </TableHead>
                      <TableHead className="w-28">앞면</TableHead>
                      <TableHead className="w-full">뒷면</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cardSet.length > 0 ? (
                      cardSet.map((card, index) => (
                        <TableRow key={index} className="h-10">
                          <TableCell className="text-center p-0">
                            <Checkbox
                              checked={selected.includes(index)}
                              onCheckedChange={() => handleCheckboxChange(index)}
                            />
                          </TableCell>
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
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>

          <Button className="mb-5 mx-5" variant="primary" onClick={handeleSaveCard}>
            생성
          </Button>
        </div>
      )}
    </>
  );
};

export default CreateFromSelfPage;
