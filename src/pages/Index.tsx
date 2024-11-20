import { useState } from "react";
import { Task } from "@/lib/types";
import { generateId } from "@/lib/utils";
import { WeeklyTimer } from "@/components/WeeklyTimer";
import { TaskList } from "@/components/TaskList";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

const Index = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");

  const handleAddTask = () => {
    if (!newTaskTitle.trim()) {
      toast.error("Please enter a task title");
      return;
    }

    const newTask: Task = {
      id: generateId(),
      title: newTaskTitle,
      status: "pending",
      timeSpent: 0,
      createdAt: new Date(),
    };

    setTasks((prev) => [newTask, ...prev]);
    setNewTaskTitle("");
    toast.success("Task added successfully");
  };

  const handleUpdateTask = (updatedTask: Task) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    );
  };

  const currentTasks = tasks.filter((task) => task.status !== "completed");
  const completedTasks = tasks.filter((task) => task.status === "completed");
  const hasActiveTasks = tasks.some((task) => task.status === "in_progress");

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Task Timer</h1>

        <WeeklyTimer hasActiveTasks={hasActiveTasks} />

        <div className="flex space-x-4 mb-8">
          <Input
            placeholder="Add a new task..."
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleAddTask()}
            className="flex-1"
          />
          <Button onClick={handleAddTask}>Add Task</Button>
        </div>

        <Tabs defaultValue="current" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="current">Current Tasks</TabsTrigger>
            <TabsTrigger value="completed">Completed Tasks</TabsTrigger>
          </TabsList>
          
          <TabsContent value="current">
            <TaskList tasks={currentTasks} onUpdateTask={handleUpdateTask} />
          </TabsContent>
          
          <TabsContent value="completed">
            <TaskList tasks={completedTasks} onUpdateTask={handleUpdateTask} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;