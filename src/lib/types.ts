export type TaskStatus = "pending" | "in_progress" | "completed";

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  timeSpent: number;
  createdAt: Date;
  created_by?: string;
  assignee?: string;
  priority?: string;
  due_date?: string;
}