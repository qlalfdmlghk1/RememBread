import { useContext, useEffect } from "react";
import { UNSAFE_NavigationContext as NavigationContext } from "react-router-dom";

export function useConfirmNavigation(confirmFn: () => boolean | Promise<boolean>) {
  const { navigator } = useContext(NavigationContext);

  useEffect(() => {
    const unblock = (navigator as any).block((tx: any) => {
      const result = confirmFn();

      if (typeof result === "boolean") {
        if (result) tx.retry(); // 이동 허용
        // 아니면 아무 것도 하지 않음 (이동 차단)
      } else {
        result.then((ok) => {
          if (ok) tx.retry();
        });
      }
    });

    return () => unblock();
  }, [navigator, confirmFn]);
}
