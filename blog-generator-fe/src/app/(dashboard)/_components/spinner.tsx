import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { cva, VariantProps } from "class-variance-authority";
import { Loader } from "lucide-react";

const spinnerVariants = cva("text-muted-foreground animate-spin", {
  variants: {
    size: {
      default: "h-4 w-4",
      sm: "h-2 w-2",
      lg: "h-6 w-6",
      icon: "h-10 w-10",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

interface SpinnerProps extends VariantProps<typeof spinnerVariants> {
  title?: string;
  className?: string;
  /** Total wait time in seconds for the loading countdown */
  waitTime?: number;
}

const Spinner: React.FC<SpinnerProps> = ({
  size,
  className,
  title,
  waitTime = 40,
}) => {
  const [secondsLeft, setSecondsLeft] = useState(waitTime);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const interval = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [secondsLeft]);

  return (
    <div className={cn("inline-flex items-center space-x-2", className)}>
      <Loader className={cn(spinnerVariants({ size }))} />
      <div className="flex flex-col leading-tight">
        {title && <span className="text-sm font-medium">{title}</span>}
        <span className="text-xs text-muted-foreground">
          {secondsLeft > 0 ? `Loading... (${secondsLeft}s)` : "Almost done..."}
        </span>
      </div>
    </div>
  );
};

export default Spinner;
