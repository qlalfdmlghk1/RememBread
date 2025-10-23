import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import StopTestAlertDialog from "@/components/dialog/StopTestAlertDialog";
import Button from "@/components/common/Button";
import { getCardSetById } from "@/services/cardSet";
import { getNextCard, postAnswer, postStopTest, postLocation } from "@/services/study";
import { useLocationStore } from "@/stores/useLocationStore";

const CardTestExplainPage = () => {
  const navigate = useNavigate();
  const { indexCardId } = useParams();
  const cardSetId = Number(indexCardId);

  const [name, setName] = useState<string | undefined>("");
  const [cardId, setCardId] = useState<number>(0);
  const [concept, setConcept] = useState<string>("");
  const [remainingCardCount, setRemainingCardCount] = useState<number>(101);

  const [isCorrect, setIsCorrect] = useState<null | boolean>(null);
  const [isAlertOpen, setIsAlertOpen] = useState<boolean>(false);

  const fetchCard = async () => {
    try {
      const data = await getNextCard(cardSetId);

      setCardId(data.cardId);
      setConcept(data.concept);

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

  const handleSubmitAnswer = async (correct: boolean) => {
    setIsCorrect(correct);

    setTimeout(() => {
      setIsCorrect(null);
    }, 1000);

    const response = await postAnswer(cardSetId, cardId, correct);

    if (remainingCardCount === 0) {
      handleStopTest();
      return;
    }

    setRemainingCardCount(response.remainingCardCount);

    await fetchCard();
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

          <div className="flex flex-1 justify-center py-10 w-full overflow-auto rounded-xl">
            <div className="relative flex w-full min-h-full mx-5 p-2 bg-[#BA7E4E] rounded-2xl">
              <div className="flex items-center justify-center w-full min-h-full bg-[#FDF0CF] border-8 border-[#F0A365] p-4 rounded-xl">
                <div className="flex items-center justify-center w-full max-h-full overflow-auto scrollbar-hide text-2xl font-bold">
                  {concept}
                </div>
                {isCorrect !== null && (
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[200px] z-50 pointer-events-none select-none">
                    {isCorrect ? "⭕" : "❌"}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col m-5 gap-5">
            <div className="flex justify-between gap-5">
              <Button
                variant="negative"
                className="w-full"
                onClick={() => handleSubmitAnswer(false)}
                disabled={isCorrect === null ? false : true}
              >
                몰라요
              </Button>
              <Button
                variant="positive"
                className="w-full"
                onClick={() => handleSubmitAnswer(true)}
                disabled={isCorrect === null ? false : true}
              >
                알아요
              </Button>
            </div>
            <StopTestAlertDialog
              handleStopTest={handleStopTest}
              isOpen={isAlertOpen}
              setIsOpen={setIsAlertOpen}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default CardTestExplainPage;
