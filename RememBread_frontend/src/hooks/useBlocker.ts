// hooks/useBlocker.ts
import { useContext, useEffect } from "react";
import { UNSAFE_NavigationContext as NavigationContext } from "react-router-dom";

export function useBlocker(when: boolean, blocker: (tx: any) => void) {
  const navigator = useContext(NavigationContext).navigator as any;

  useEffect(() => {
    if (!when) return;

    const unblock = navigator.block((tx: any) => {
      blocker(tx);
    });

    return () => unblock();
  }, [navigator, when, blocker]);
}
