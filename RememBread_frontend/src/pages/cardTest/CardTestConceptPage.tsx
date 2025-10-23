import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import StopTestAlertDialog from "@/components/dialog/StopTestAlertDialog";
import Button from "@/components/common/Button";
import { Input } from "@/components/ui/input";
import { getCardSetById } from "@/services/cardSet";
import { getNextCard, postAnswer, postStopTest, postLocation } from "@/services/study";
import { useLocationStore } from "@/stores/useLocationStore";

const CardTestConceptPage = () => {
  const navigate = useNavigate();
  const { indexCardId } = useParams();
  const cardSetId = Number(indexCardId);

  const [name, setName] = useState<string | undefined>("");
  const [answer, setAnswer] = useState<string>("");
  const [cardId, setCardId] = useState<number>(0);
  const [concept, setConcept] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [remainingCardCount, setRemainingCardCount] = useState<number>(101);

  const [isCorrect, setIsCorrect] = useState<null | boolean>(null);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [isAlertOpen, setIsAlertOpen] = useState<boolean>(false);

  const fetchCard = async () => {
    try {
      const data = await getNextCard(cardSetId);

      setCardId(data.cardId);
      setConcept(data.concept);
      setDescription(data.description);

      const response = await getCardSetById(cardSetId);

      setName(response.result.name);
    } catch (error) {
      // console.error(error);
    }
  };

  const handleStopTest = async () => {
    const { latitude: lat, longitude: lng } = useLocationStore.getState();

    try {
      await postStopTest(cardSetId, cardId, lat, lng);
    } catch (error) {
      // console.error(error);
    } finally {
      navigate("/card-view");
    }
  };

  const handleSubmitAnswer = async () => {
    if (isFlipped) return;

    const trimmedAnswer = answer.replace(/\s/g, "");
    const trimmedConcept = concept.replace(/\s/g, "");
    const correct = trimmedAnswer === trimmedConcept;

    setIsFlipped(true);

    // 결과 표시
    setTimeout(() => {
      setIsCorrect(correct);
    }, 1000);

    // 앞면으로 회전
    setTimeout(() => {
      setIsCorrect(null);
      setIsFlipped(false);
    }, 2000);

    // 다음 카드 불러오기
    setTimeout(async () => {
      setAnswer("");
      const response = await postAnswer(cardSetId, cardId, correct);
      if (remainingCardCount === 0) {
        handleStopTest();
        return;
      }
      setRemainingCardCount(response.remainingCardCount);
      await fetchCard();
    }, 2200);
  };

  const submitLocation = async () => {
    const { latitude: lat, longitude: lng } = useLocationStore.getState();
    try {
      await postLocation(cardSetId, lat, lng);
    } catch (error) {
      // console.error(error);
    }
  };

  useEffect(() => {
    fetchCard();
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      submitLocation();
    }, 2 * 60 * 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [cardSetId]);

  useEffect(() => {
    window.history.pushState(null, "", window.location.href);

    const onPopState = () => {
      window.history.pushState(null, "", window.location.href);
      setIsAlertOpen(true);
    };

    window.addEventListener("popstate", onPopState);

    return () => {
      window.removeEventListener("popstate", onPopState);
    };
  }, []);

  return (
    <>
      <header className="fixed w-full max-w-[600px] min-h-14 mx-auto bg-white pc:border-x border-b border-neutral-200 z-30 pt-env(safe-area-inset-top) top-0 left-0 right-0">
        <nav className="h-full mx-auto">
          <ul className="flex justify-center items-center w-full min-h-14 px-5 relative">
            <h1 className="text-xl font-bold">{name}</h1>
          </ul>
        </nav>
      </header>

      <div
        className="flex flex-col justify-between w-full h-full mt-14 text-center"
        style={{ minHeight: "calc(100vh - 56px)" }}
      >
        <div className="flex flex-col flex-1" style={{ maxHeight: "calc(100vh - 56px)" }}>
          <div className="flex justify-center p-5 text-xl font-bold">
            {remainingCardCount === 101
              ? "테스트가 시작됐어요"
              : `남은 문제: ${remainingCardCount}`}
          </div>

          <div className="flex flex-1 justify-center py-10 w-full overflow-auto rounded-xl perspective scrollbar-hide">
            <div
              className={`relative w-full mx-5 transition-transform duration-700 transform-style-preserve-3d ${
                isFlipped ? "rotate-y-180" : ""
              }`}
            >
              <div className="absolute w-full min-h-full backface-hidden bg-[#FDF0CF] border-8 border-[#F0A365] p-4 rounded-xl scrollbar-hide">
                <div className="w-full max-h-full overflow-auto scrollbar-hide">{description}</div>
              </div>

              {isCorrect !== null && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[200px] z-50 pointer-events-none select-none">
                  {isCorrect ? "⭕" : "❌"}
                </div>
              )}

              <div className="absolute w-full h-full backface-hidden bg-[#FDF0CF] border-8 border-[#F0A365] p-4 rounded-xl transform rotate-y-180 scrollbar-hide">
                <div className="w-full h-full flex items-center justify-center text-2xl font-bold">
                  {concept}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col m-5 gap-5">
            <div>
              <Input
                type="text"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleSubmitAnswer();
                  }
                }}
                placeholder="정답 입력"
              />
            </div>

            <div className="flex justify-between gap-5">
              <StopTestAlertDialog
                handleStopTest={handleStopTest}
                isOpen={isAlertOpen}
                setIsOpen={setIsAlertOpen}
              />
              <Button
                variant="primary"
                className="w-full"
                onClick={handleSubmitAnswer}
                disabled={remainingCardCount > 0 && isFlipped}
              >
                {remainingCardCount > 0 ? "제출하기" : "제출하고 종료하기"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CardTestConceptPage;
