import { useAuth } from '@/contexts/AuthContext';
import { useTasks } from '@/features/tasks/hooks/useTasks';
import { TaskItem } from '@/features/tasks/components/TaskItem';
import { CreateTaskForm } from '@/features/tasks/components/CreateTaskForm';
import { Button } from '@/components/ui/button';
import { LogOut, CheckSquare, Loader2 } from 'lucide-react';

const Index = () => {
  const { user, signOut } = useAuth();
  const { tasks, loading, error, createTask, updateTask, deleteTask, toggleTask } = useTasks();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckSquare className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">TaskVault</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden sm:inline">
              {user?.email}
            </span>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="space-y-6">
          {/* Create Task Form */}
          <section>
            <h2 className="text-lg font-semibold mb-3">Create New Task</h2>
            <CreateTaskForm onCreate={createTask} />
          </section>

          {/* Task List */}
          <section>
            <h2 className="text-lg font-semibold mb-3">
              Your Tasks {tasks.length > 0 && `(${tasks.length})`}
            </h2>

            {error && (
              <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive mb-4">
                {error}
              </div>
            )}

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : tasks.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <CheckSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No tasks yet. Create your first task above!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {tasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onToggle={toggleTask}
                    onUpdate={updateTask}
                    onDelete={deleteTask}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default Index;
