import { useState } from "react";
import { Task } from "@/lib/types";
import { cn } from "@/lib/utils";
import { TaskTimer } from "./TaskTimer";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface TaskListProps {
  tasks: Task[];
  onUpdateTask: (task: Task) => void;
}

export function TaskList({ tasks, onUpdateTask }: TaskListProps) {
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);

  const handleStatusChange = (task: Task) => {
    const newStatus = task.status === "pending" ? "in_progress" : 
                     task.status === "in_progress" ? "completed" : "pending";
    
    onUpdateTask({ ...task, status: newStatus });
    toast.success(`Task marked as ${newStatus.replace("_", " ")}`);
  };

  const handleDescriptionChange = (task: Task, description: string) => {
    onUpdateTask({ ...task, description });
  };

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <div
          key={task.id}
          className={cn(
            "bg-white rounded-lg shadow-sm p-4 transition-all duration-200",
            "hover:shadow-md cursor-pointer"
          )}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleStatusChange(task)}
                className={cn(
                  "min-w-[100px]",
                  task.status === "completed" && "bg-green-100 text-green-700",
                  task.status === "in_progress" && "bg-blue-100 text-blue-700"
                )}
              >
                {task.status.replace("_", " ")}
              </Button>
              <h3 className="font-medium">{task.title}</h3>
            </div>
            <div className="flex items-center space-x-4">
              <TaskTimer
                isActive={task.status === "in_progress"}
                initialTime={task.timeSpent}
                onTick={(time) => onUpdateTask({ ...task, timeSpent: time })}
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setExpandedTaskId(expandedTaskId === task.id ? null : task.id)}
              >
                {expandedTaskId === task.id ? "Hide" : "Show"} Details
              </Button>
            </div>
          </div>

          {expandedTaskId === task.id && (
            <div className="mt-4 animate-slide-down">
              <Textarea
                placeholder="Add a description..."
                value={task.description || ""}
                onChange={(e) => handleDescriptionChange(task, e.target.value)}
                className="min-h-[100px]"
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}