import { useEffect, useState } from "react";
import { formatTime } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

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
    <Card className={cn(
      "transition-all duration-300",
      hasActiveTasks && "border-primary shadow-lg"
    )}>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Weekly Time Left</CardTitle>
      </CardHeader>
      <CardContent>
        <div className={cn(
          "text-4xl font-mono",
          hasActiveTasks ? "text-primary animate-pulse" : "text-muted-foreground"
        )}>
          {formatTime(timeLeft)}
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          {hasActiveTasks ? "Timer running..." : "Start a task to begin countdown"}
        </p>
      </CardContent>
    </Card>
  );
}