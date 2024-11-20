import { useState, useEffect } from "react";
import { Task, TaskStatus } from "@/lib/types";
import { WeeklyTimer } from "@/components/WeeklyTimer";
import { TaskList } from "@/components/TaskList";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";

const Index = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const { user, signOut } = useAuth();

  useEffect(() => {
    fetchTasks();
  }, [user]);

  const fetchTasks = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Erro ao carregar tarefas");
      return;
    }

    setTasks(
      data.map((task) => ({
        ...task,
        status: (task.status || "pending") as TaskStatus,
        timeSpent: 0,
        createdAt: new Date(task.created_at || new Date()),
      }))
    );
  };

  const handleAddTask = async () => {
    if (!newTaskTitle.trim() || !user) {
      toast.error("Por favor, insira um título para a tarefa");
      return;
    }

    const { data, error } = await supabase
      .from("tasks")
      .insert([
        {
          title: newTaskTitle,
          created_by: user.id,
          status: "pending" as TaskStatus,
        },
      ])
      .select()
      .single();

    if (error) {
      toast.error("Erro ao criar tarefa");
      return;
    }

    const newTask: Task = {
      ...data,
      status: (data.status || "pending") as TaskStatus,
      timeSpent: 0,
      createdAt: new Date(data.created_at || new Date()),
    };

    setTasks((prev) => [newTask, ...prev]);
    setNewTaskTitle("");
    toast.success("Tarefa criada com sucesso!");
  };

  const handleUpdateTask = async (updatedTask: Task) => {
    const { error } = await supabase
      .from("tasks")
      .update({
        status: updatedTask.status,
        description: updatedTask.description,
      })
      .eq("id", updatedTask.id);

    if (error) {
      toast.error("Erro ao atualizar tarefa");
      return;
    }

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
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Task Timer</h1>
          <Button variant="outline" onClick={signOut}>
            Sair
          </Button>
        </div>

        <WeeklyTimer hasActiveTasks={hasActiveTasks} />

        <div className="flex space-x-4 mb-8">
          <Input
            placeholder="Adicionar nova tarefa..."
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleAddTask()}
            className="flex-1"
          />
          <Button onClick={handleAddTask}>Adicionar</Button>
        </div>

        <Tabs defaultValue="current" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="current">Tarefas Atuais</TabsTrigger>
            <TabsTrigger value="completed">Tarefas Concluídas</TabsTrigger>
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