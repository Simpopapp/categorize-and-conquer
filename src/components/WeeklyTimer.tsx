import { useEffect, useState } from "react";
import { formatTime } from "@/lib/utils";

interface WeeklyTimerProps {
  hasActiveTasks: boolean;
}

const WEEKLY_TIME = 24 * 60 * 60; // 24 hours in seconds

export function WeeklyTimer({ hasActiveTasks }: WeeklyTimerProps) {
  const [timeLeft, setTimeLeft] = useState(WEEKLY_TIME);

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;

    if (hasActiveTasks && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => Math.max(0, prev - 1));
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [hasActiveTasks, timeLeft]);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
      <h2 className="text-lg font-semibold text-gray-700 mb-2">Weekly Time Left</h2>
      <div className="text-4xl font-mono text-primary-DEFAULT">
        {formatTime(timeLeft)}
      </div>
    </div>
  );
}