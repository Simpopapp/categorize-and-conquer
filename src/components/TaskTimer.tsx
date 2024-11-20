import { useEffect, useState } from "react";
import { formatTime } from "@/lib/utils";

interface TaskTimerProps {
  isActive: boolean;
  onTick?: (seconds: number) => void;
  initialTime?: number;
}

export function TaskTimer({ isActive, onTick, initialTime = 0 }: TaskTimerProps) {
  const [time, setTime] = useState(initialTime);

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;

    if (isActive) {
      interval = setInterval(() => {
        setTime((prev) => {
          const newTime = prev + 1;
          onTick?.(newTime);
          return newTime;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, onTick]);

  return (
    <div className="font-mono text-sm">
      {formatTime(time)}
    </div>
  );
}