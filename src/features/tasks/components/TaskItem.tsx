import { useState } from 'react';
import { Task } from '@/features/tasks/types/task';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Pencil, Trash2, X, Check, Loader2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string, is_done: boolean) => Promise<{ error: string | null }>;
  onUpdate: (id: string, updates: { title?: string; description?: string | null }) => Promise<{ error: string | null }>;
  onDelete: (id: string) => Promise<{ error: string | null }>;
}

export const TaskItem: React.FC<TaskItemProps> = ({ task, onToggle, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleToggle = async () => {
    setLoading(true);
    const { error } = await onToggle(task.id, !task.is_done);
    if (error) setError(error);
    setLoading(false);
  };

  const handleSave = async () => {
    if (!editTitle.trim()) {
      setError('Title is required');
      return;
    }

    setLoading(true);
    const { error } = await onUpdate(task.id, {
      title: editTitle.trim(),
      description: editDescription.trim() || null,
    });

    if (error) {
      setError(error);
    } else {
      setIsEditing(false);
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    setLoading(true);
    const { error } = await onDelete(task.id);
    if (error) setError(error);
    setLoading(false);
  };

  const handleCancel = () => {
    setEditTitle(task.title);
    setEditDescription(task.description || '');
    setIsEditing(false);
    setError(null);
  };

  if (isEditing) {
    return (
      <div className="rounded-lg border bg-card p-4 space-y-3">
        {error && (
          <div className="text-sm text-destructive">{error}</div>
        )}
        <Input
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          placeholder="Task title"
          disabled={loading}
        />
        <Textarea
          value={editDescription}
          onChange={(e) => setEditDescription(e.target.value)}
          placeholder="Description (optional)"
          rows={2}
          disabled={loading}
        />
        <div className="flex gap-2">
          <Button size="sm" onClick={handleSave} disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
            Save
          </Button>
          <Button size="sm" variant="outline" onClick={handleCancel} disabled={loading}>
            <X className="h-4 w-4" />
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-lg border bg-card p-4 transition-opacity ${task.is_done ? 'opacity-60' : ''}`}>
      {error && (
        <div className="text-sm text-destructive mb-2">{error}</div>
      )}
      <div className="flex items-start gap-3">
        <Checkbox
          checked={task.is_done}
          onCheckedChange={handleToggle}
          disabled={loading}
          className="mt-1"
        />
        <div className="flex-1 min-w-0">
          <h3 className={`font-medium ${task.is_done ? 'line-through text-muted-foreground' : ''}`}>
            {task.title}
          </h3>
          {task.description && (
            <p className={`text-sm mt-1 ${task.is_done ? 'line-through text-muted-foreground' : 'text-muted-foreground'}`}>
              {task.description}
            </p>
          )}
          <p className="text-xs text-muted-foreground mt-2">
            {new Date(task.created_at).toLocaleDateString()}
          </p>
        </div>
        <div className="flex gap-1">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setIsEditing(true)}
            disabled={loading}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button size="icon" variant="ghost" disabled={loading}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Task</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete "{task.title}"? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
};
