import { useRef, useEffect, RefObject, useState } from "react";
import { AMPM, HOURS, MINUTES } from "@/constants/time";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog"; // shadcn/ui Dialog 컴포넌트 임포트
import Button from "@/components/common/Button";

interface TimePickerProps {
  ampm: string;
  hour: string;
  minute: string;
  onChange: (ampm: string, hour: string, minute: string) => void;
  isOpen: boolean; // Dialog open/close 상태
  onClose: () => void; // Dialog close 핸들러
}

const TimePicker = ({
  ampm: initialAmpm,
  hour: initialHour,
  minute: initialMinute,
  onChange,
  isOpen,
  onClose,
}: TimePickerProps) => {
  // 로컬 상태 추가
  const [localAmpm, setLocalAmpm] = useState(initialAmpm);
  const [localHour, setLocalHour] = useState(initialHour);
  const [localMinute, setLocalMinute] = useState(initialMinute);

  // 모달이 열릴 때마다 초기값으로 로컬 상태 초기화
  useEffect(() => {
    if (isOpen) {
      setLocalAmpm(initialAmpm);
      setLocalHour(initialHour);
      setLocalMinute(initialMinute);
    }
  }, [isOpen, initialAmpm, initialHour, initialMinute]);

  const ampmRef = useRef<HTMLDivElement>(null);
  const hourRef = useRef<HTMLDivElement>(null);
  const minuteRef = useRef<HTMLDivElement>(null);

  // 사용자가 스크롤 이벤트를 처리할 준비가 되었는지 나타내는 상태 (초기 스크롤 완료 후 true)
  const [isReadyForUserScroll, setIsReadyForUserScroll] = useState(false);

  // Effect for initial scrolling to selected items when the dialog opens
  useEffect(() => {
    if (!isOpen) {
      // 모달이 닫히면 준비 상태 초기화
      setIsReadyForUserScroll(false);
      return;
    }

    const scrollToSelectedItemWithSnapRestore = (
      ref: RefObject<HTMLDivElement | null>,
      selectedValue: string,
    ) => {
      if (!ref.current || !selectedValue) return;

      const container = ref.current;
      const items = Array.from(container.children) as HTMLDivElement[];
      const targetItem = items.find(
        (item) => item.innerText.trim() === selectedValue && item.offsetParent !== null,
      );

      if (targetItem) {
        targetItem.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    };

    // DOM 렌더링 후 스크롤이 실행되도록 setTimeout(..., 0)을 사용
    const initialScrollTimer = setTimeout(() => {
      scrollToSelectedItemWithSnapRestore(ampmRef, localAmpm);
      scrollToSelectedItemWithSnapRestore(hourRef, localHour);
      scrollToSelectedItemWithSnapRestore(minuteRef, localMinute);

      // 모든 스크롤이 완료될 것으로 예상되는 시간 이후에 플래그 설정
      const readyFlagTimer = setTimeout(() => {
        setIsReadyForUserScroll(true);
      }, 100); // 초기 스크롤 완료 시간을 100ms로 줄임

      return () => clearTimeout(readyFlagTimer);
    }, 0);

    // 이 useEffect의 클린업 함수
    return () => {
      clearTimeout(initialScrollTimer);
      setIsReadyForUserScroll(false); // 모달이 닫히거나 의존성 변경 시 준비 상태 초기화
    };
  }, [isOpen]); // isOpen 또는 초기 시간값이 변경될 때마다 실행

  // Effect for handling user scroll to update selected value (스크롤 이벤트 리스너 등록)
  useEffect(() => {
    // 모달이 열려있지 않거나 초기 스크롤 준비가 되지 않았다면 리스너 등록 안 함
    if (!isOpen || !isReadyForUserScroll) {
      return;
    }

    const handleScroll = (
      ref: RefObject<HTMLDivElement | null>,
      currentPropValue: string, // 리스너가 첨부될 때의 prop 값
      type: "ampm" | "hour" | "minute",
    ) => {
      if (!ref.current) return;
      const container = ref.current;

      const items = Array.from(container.children) as HTMLDivElement[];
      // 컨테이너의 Y축 중앙값 계산
      const containerCenter = container.getBoundingClientRect().top + container.clientHeight / 2;
      let minDiff = Infinity;
      let selectedValue = currentPropValue; // 현재 prop 값으로 초기화

      items.forEach((item) => {
        const rect = item.getBoundingClientRect();
        // 높이가 0인 아이템 (예: 숨겨진 spacer)은 건너뛰고, offsetParent가 없는 경우도 건너뜀
        if (rect.height === 0 || item.offsetParent === null) return;

        const itemCenter = rect.top + rect.height / 2;
        const centerDiff = Math.abs(itemCenter - containerCenter);

        // 가장 중앙에 가까운 아이템을 찾습니다.
        if (centerDiff < minDiff && item.innerText.trim()) {
          minDiff = centerDiff;
          selectedValue = item.innerText.trim();
        }
      });

      // 실제로 중앙에 위치한 값이 현재 prop 값과 다를 경우에만 onChange 호출
      if (selectedValue !== currentPropValue) {
        if (type === "ampm") setLocalAmpm(selectedValue);
        if (type === "hour") setLocalHour(selectedValue);
        if (type === "minute") setLocalMinute(selectedValue);
      }
    };

    // 스크롤 이벤트 리스너 함수 정의 (의존성 배열이 변경될 때마다 재생성됨)
    const ampmScrollHandler = () => handleScroll(ampmRef, localAmpm, "ampm");
    const hourScrollHandler = () => handleScroll(hourRef, localHour, "hour");
    const minuteScrollHandler = () => handleScroll(minuteRef, localMinute, "minute");

    const ampmEl = ampmRef.current;
    const hourEl = hourRef.current;
    const minuteEl = minuteRef.current;

    // 이벤트 리스너 직접 추가
    ampmEl?.addEventListener("scroll", ampmScrollHandler);
    hourEl?.addEventListener("scroll", hourScrollHandler);
    minuteEl?.addEventListener("scroll", minuteScrollHandler);

    // Cleanup 함수: 컴포넌트 unmount 시 또는 의존성 배열의 값이 변경되어 effect가 재실행되기 전에 호출
    return () => {
      ampmEl?.removeEventListener("scroll", ampmScrollHandler);
      hourEl?.removeEventListener("scroll", hourScrollHandler);
      minuteEl?.removeEventListener("scroll", minuteScrollHandler);
    };
  }, [isOpen, isReadyForUserScroll, localAmpm, localHour, localMinute, onChange]);

  // 확인 버튼 클릭 시 변경 내용 전달
  const handleConfirm = () => {
    onChange(localAmpm, localHour, localMinute);
    onClose();
  };

  // 취소 버튼 클릭 시 변경 내용 폐기
  const handleCancel = () => {
    setLocalAmpm(initialAmpm);
    setLocalHour(initialHour);
    setLocalMinute(initialMinute);
    onClose();
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          // Dialog가 닫힐 때 로컬 상태를 초기값으로 리셋
          setLocalAmpm(initialAmpm);
          setLocalHour(initialHour);
          setLocalMinute(initialMinute);
        }
        onClose();
      }}
    >
      <DialogContent className="w-[90%] rounded-lg">
        <DialogTitle className="text-center mb-2">알람 시간 설정</DialogTitle>
        <DialogDescription className="text-center mb-4">
          원하는 시간을 선택해주세요
        </DialogDescription>
        <div className="w-full">
          <div className="w-full flex gap-4 justify-between">
            {/* AM/PM 선택 */}
            <div
              ref={ampmRef}
              className="flex flex-col w-full overflow-y-auto max-h-44 snap-y snap-mandatory scrollbar-hide scroll-smooth"
            >
              {/* 상단 스페이서 (중앙 정렬을 위함) */}
              <div className="min-h-11 mt-10 shrink-0"></div>
              <div className="min-h-11 shrink-0"></div>
              {AMPM.map((item, idx) => (
                <div
                  key={`ampm-${idx}`}
                  className={`p-1 text-center snap-center cursor-pointer min-h-11 flex items-center justify-center shrink-0 
                    transition-all duration-300 ease-in-out
                    ${
                      item === localAmpm
                        ? "text-xl font-bold text-primary-500 scale-110"
                        : "text-gray-500 scale-90 opacity-70"
                    }`}
                  onClick={() => setLocalAmpm(item)}
                >
                  {item}
                </div>
              ))}
              {/* 하단 스페이서 (중앙 정렬을 위함) */}
              <div className="min-h-11 shrink-0"></div>
              <div className="min-h-11 mb-10 shrink-0"></div>
            </div>

            {/* 시간 선택 */}
            <div
              ref={hourRef}
              className="flex flex-col w-full overflow-y-auto max-h-44 snap-y snap-mandatory scrollbar-hide scroll-smooth"
            >
              {/* 상단 스페이서 (중앙 정렬을 위함) */}
              <div className="min-h-11 mt-10 shrink-0"></div>
              <div className="min-h-11 shrink-0"></div>
              {HOURS.map((h, idx) => (
                <div
                  key={`hour-${idx}`}
                  className={`p-1 text-center snap-center cursor-pointer min-h-11 flex items-center justify-center shrink-0 
                    transition-all duration-300 ease-in-out
                    ${
                      h === localHour
                        ? "text-xl font-bold text-primary-500 scale-110"
                        : "text-gray-500 scale-90 opacity-70"
                    }`}
                  onClick={() => setLocalHour(h)}
                >
                  {h}
                </div>
              ))}
              {/* 하단 스페이서 (중앙 정렬을 위함) */}
              <div className="min-h-11 shrink-0"></div>
              <div className="min-h-11 mb-10 shrink-0"></div>
            </div>

            {/* 분 선택 */}
            <div
              ref={minuteRef}
              className="flex flex-col w-full overflow-y-auto max-h-44 snap-y snap-mandatory scrollbar-hide scroll-smooth"
            >
              {/* 상단 스페이서 (중앙 정렬을 위함) */}
              <div className="min-h-11 mt-10 shrink-0"></div>
              <div className="min-h-11 shrink-0"></div>
              {MINUTES.map((m, idx) => (
                <div
                  key={`minute-${idx}`}
                  className={`p-1 text-center snap-center cursor-pointer min-h-11 flex items-center justify-center shrink-0 
                    transition-all duration-300 ease-in-out
                    ${
                      m === localMinute
                        ? "text-xl font-bold text-primary-500 scale-110"
                        : "text-gray-500 scale-90 opacity-70"
                    }`}
                  onClick={() => setLocalMinute(m)}
                >
                  {m}
                </div>
              ))}
              {/* 하단 스페이서 (중앙 정렬을 위함) */}
              <div className="min-h-11 shrink-0"></div>
              <div className="min-h-11 mb-10 shrink-0"></div>
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-6">
            <Button variant="neutral" onClick={handleCancel}>
              취소
            </Button>
            <Button variant="primary" onClick={handleConfirm}>
              확인
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TimePicker;
