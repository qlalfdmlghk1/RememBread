import { forwardRef, ComponentPropsWithoutRef, ElementRef } from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "@/lib/utils";

interface SliderProps extends ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {
  variant?: "primary" | "positive" | "negative" | "neutral";
  range?: boolean;
}

const Slider = forwardRef<ElementRef<typeof SliderPrimitive.Root>, SliderProps>(
  ({ className, variant = "primary", range = false, ...props }, ref) => {
    const baseClasses = "relative flex w-full touch-none select-none items-center";

    const trackClasses = "relative h-1.5 w-full grow overflow-hidden rounded-full";
    const rangeClasses = "absolute h-full";
    const thumbClasses =
      "block h-4 w-4 rounded-full border bg-background shadow transition-colors focus:outline-none focus:ring-0";

    const stateClasses = {
      primary: {
        track: "bg-primary-100",
        range: "bg-primary-500",
        thumb: "border-primary-700",
      },
      positive: {
        track: "bg-positive-100",
        range: "bg-positive-500",
        thumb: "border-positive-700",
      },
      negative: {
        track: "bg-negative-100",
        range: "bg-negative-500",
        thumb: "border-negative-700",
      },
      neutral: {
        track: "bg-neutral-100",
        range: "bg-neutral-500",
        thumb: "border-neutral-700",
      },
    };

    return (
      <SliderPrimitive.Root ref={ref} className={cn(baseClasses, className)} {...props}>
        <SliderPrimitive.Track className={cn(trackClasses, stateClasses[variant].track)}>
          <SliderPrimitive.Range className={cn(rangeClasses, stateClasses[variant].range)} />
        </SliderPrimitive.Track>
        {range ? (
          <>
            <SliderPrimitive.Thumb className={cn(thumbClasses, stateClasses[variant].thumb)} />
            <SliderPrimitive.Thumb className={cn(thumbClasses, stateClasses[variant].thumb)} />
          </>
        ) : (
          <SliderPrimitive.Thumb className={cn(thumbClasses, stateClasses[variant].thumb)} />
        )}
      </SliderPrimitive.Root>
    );
  },
);

Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
