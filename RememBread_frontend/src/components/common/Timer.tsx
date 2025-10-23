import { useEffect, useState, ReactNode, useRef, useCallback } from "react";

interface TimerProps {
  initial: number;
  onEnd?: () => void;
  children?: (value: number) => ReactNode;
}

const Timer = ({ initial, onEnd, children }: TimerProps) => {
  const [value, setValue] = useState(initial);
  const intervalRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const onEndRef = useRef(onEnd);
  const initialRef = useRef(initial);

  // onEnd가 변경될 때마다 ref 업데이트
  useEffect(() => {
    onEndRef.current = onEnd;
  }, [onEnd]);

  // initial이 변경될 때마다 ref 업데이트
  useEffect(() => {
    initialRef.current = initial;
  }, [initial]);

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = undefined;
    }
  }, []);

  useEffect(() => {
    // 이전 타이머 정리
    clearTimer();
    
    // 초기값 설정
    setValue(initialRef.current);

    // 새 타이머 시작
    intervalRef.current = setInterval(() => {
      setValue((prev) => {
        if (prev <= 1) {
          clearTimer();
          setTimeout(() => {
            onEndRef.current?.();
          }, 0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return clearTimer;
  }, [clearTimer]);

  return <>{children ? children(value) : value}</>;
};

export default Timer; 