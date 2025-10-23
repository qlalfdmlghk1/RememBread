import { useEffect, useState } from "react";
import { indexCardSet } from "@/types/indexCard";
import { createEmptyCard } from "@/utils/createEmptyCard";
import InputBread from "@/components/svgs/breads/InputBread";
import Button from "@/components/common/Button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";

const CardTTSPage = () => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const [isFront, setIsFront] = useState<boolean>(true);
  const [isRotating, setIsRotating] = useState<boolean>(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(false);

  const [cardSet, setCardSet] = useState<indexCardSet>({
    folderId: Number(0),
    hashTags: [],
    breads: [createEmptyCard(), createEmptyCard(), createEmptyCard()],
  });

  const [api, setApi] = useState<CarouselApi>();

  useEffect(() => {
    if (!api) {
      return;
    }

    setCurrentIndex(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrentIndex(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  const handleFlip = () => {
    setIsFront((prev) => !prev);

    setIsButtonDisabled(true);

    setTimeout(() => {
      setIsRotating(!isRotating);
      setIsButtonDisabled(false);
    }, 310);
  };

  return (
    <div className="flex flex-col justify-between w-full text-center gap-4">
      <Button
        className="text-primary-500 text-2xl font-bold m-5 py-5"
        variant="primary-outline"
        onClick={handleFlip}
        disabled={isButtonDisabled}
      >
        {!isFront ? "concept" : "description"}
      </Button>

      <div className="">
        {currentIndex} / {cardSet.breads.length}
      </div>

      <Carousel
        setApi={setApi}
        opts={{
          align: "center",
          loop: false,
        }}
        className="w-full max-w-md mx-auto px-4 pc:px-0"
      >
        <CarouselContent className="aspect-square">
          {cardSet.breads.map((bread, index) => (
            <CarouselItem key={index} className={`relative`}>
              <div className="relative w-full h-full">
                <div
                  className={`relative transition-transform duration-1000 ${
                    isFront ? "rotate-y-0" : "rotate-y-180"
                  }`}
                >
                  <InputBread className="w-full h-full aspect-square" />

                  {!isRotating ? (
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl font-bold">
                      {bread?.concept || "제목 없음"}
                    </div>
                  ) : (
                    <textarea
                      className="absolute top-[17%] left-[17%] w-2/3 h-3/4 bg-inherit border-none outline-none focus:ring-0 shadow-none resize-none font-bold rotate-y-180"
                      value={bread?.description}
                      placeholder="여기에 텍스트를 입력하세요"
                      onChange={(e) => {
                        const updatedDescription = e.target.value;
                        setCardSet((prev) => {
                          const newBreads = [...prev.breads];
                          newBreads[index] = {
                            ...newBreads[index],
                            description: updatedDescription,
                          };
                          return { ...prev, breads: newBreads };
                        });
                      }}
                      style={{
                        scrollbarWidth: "none",
                      }}
                    />
                  )}
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden pc:flex pc:items-center pc:justify-center pc:w-10 pc:h-10" />
        <CarouselNext className="hidden pc:flex pc:items-center pc:justify-center pc:w-10 pc:h-10" />
      </Carousel>
    </div>
  );
};

export default CardTTSPage;
