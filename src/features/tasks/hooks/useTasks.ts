import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/AuthContext';
import { Task, TaskInsert, TaskUpdate } from '@/features/tasks/types/task';

export const useTasks = () => {
  const { user, signOut } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      setError(error.message);
    } else {
      setTasks(data || []);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const createTask = async (title: string, description?: string) => {
    if (!user) return { error: 'Not authenticated' };

    const newTask: TaskInsert = {
      user_id: user.id,
      title: title.trim(),
      description: description?.trim() || null,
      is_done: false,
    };

    const { data, error } = await supabase
      .from('tasks')
      .insert(newTask)
      .select()
      .single();

    if (error) {
      if (error.code === '23503') { // Foreign key violation
        console.error("Stale user detected. Signing out.");
        await signOut();
        return { error: 'Session expired. Please log in again.' };
      }
      return { error: error.message };
    }

    setTasks((prev) => [data, ...prev]);
    return { error: null };
  };

  const updateTask = async (id: string, updates: TaskUpdate) => {
    const { data, error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return { error: error.message };
    }

    setTasks((prev) => prev.map((t) => (t.id === id ? data : t)));
    return { error: null };
  };

  const deleteTask = async (id: string) => {
    const { error } = await supabase.from('tasks').delete().eq('id', id);

    if (error) {
      return { error: error.message };
    }

    setTasks((prev) => prev.filter((t) => t.id !== id));
    return { error: null };
  };

  const toggleTask = async (id: string, is_done: boolean) => {
    return updateTask(id, { is_done });
  };

  return {
    tasks,
    loading,
    error,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    toggleTask,
  };
};
