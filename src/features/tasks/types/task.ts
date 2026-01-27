export interface Task {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  is_done: boolean;
  created_at: string;
}

export type TaskInsert = Omit<Task, 'id' | 'created_at'>;
export type TaskUpdate = Partial<Omit<Task, 'id' | 'user_id' | 'created_at'>>;
