"use client"
import TodoTable from "@/components/TodoTable"; 
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import CreateTodo from "@/lib/createTodo";
import DeleteTodo from "@/lib/deleteTodo";
import GetUserTodo from "@/lib/getUserTodo";
import UpdateTodo from "@/lib/updateTodo";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";

export default function Home() {

  interface Todo {
        id: string;
        todo: string;
        description: string;
        isPending: boolean;
        authorId: string;
      }
  const { data: session } = useSession();
  const [todo, setTodo] = useState("");
  const [description, setDescription] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [editingTodoId, setEditingTodoId] = useState<string | null>(null);

  // Fetch Todos
  const { data: todosData, isLoading: todosLoading, refetch } = useQuery({
    queryKey: ["getUserTodo"],
    queryFn: () => GetUserTodo(session?.user?.id || ""),
    enabled: !!session?.user?.id, // Ensure query doesn't run without user ID
  });

  // Create Todo Mutation
  const { mutate: createTodo, status: createTodoLoading } = useMutation({
    mutationFn: ({ todo, description, authorId }: Omit<Todo, "id" | "isPending">) =>
      CreateTodo(todo, description, authorId),
    onSuccess: () => {
      setTodo("");
      setDescription("");
      refetch();
    },
    onError: (err: Error) => {
      console.error("Error creating todo:", err.message);
    },
  });

  // Update Todo Mutation
  const { mutate: updateTodo, status: updateTodoLoading } = useMutation({
    mutationFn: ({ id, todo, description, isPending }: Todo) =>
      UpdateTodo(id, todo, description, isPending),
    onSuccess: () => {
      setTodo("");
      setDescription("");
      setEditingTodoId(null);
      refetch();
    },
    onError: (err: Error) => {
      console.error("Error updating todo:", err.message);
    },
  });

  // Delete Todo Mutation
  const { mutate: deleteTodo, status: deleteTodoLoading } = useMutation({
    mutationFn: (id: string) =>
      DeleteTodo(id),
    onSuccess: () => refetch(),
    onError: (err: Error) => {
      console.error("Error deleting todo:", err.message);
    },
  });

  // Handle Submit (Create or Update)
  const handleSubmit = () => {
    if (!todo || !description) {
      alert("Please fill in both fields!");
      return;
    }
    if (editingTodoId) {
      updateTodo({ id: editingTodoId, todo, description, isPending, authorId: session?.user?.id || "" });
    }
    else {
      createTodo({ todo, description, authorId: session?.user?.id || "" });
    }
  };

  // Handle Delete
  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this todo?")) {
      deleteTodo(id);
    }
  };

  // Handle Edit
  const handleEdit = (todo: Todo) => {
    setTodo(todo.todo);
    setDescription(todo.description);
    setIsPending(todo.isPending);
    setEditingTodoId(todo.id);
  };

  if (!session) return null;

return (
  <div className="flex flex-col items-center gap-10">
    {/* Form Section */}
    <div className="flex flex-col gap-4 w-full sm:w-2/4">
      <Input
        placeholder="Enter your Todo"
        value={todo}
        onChange={(e) => setTodo(e.target.value)}
      />
      <Textarea
        placeholder="Enter the description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <div className="flex gap-2">
        <Checkbox
          id="status"
          checked={!isPending}
          onCheckedChange={(checked) => setIsPending(!checked)} />
        <label htmlFor="status" className="text-sm font-medium leading-none">
          Completed?
        </label>
      </div>
      <Button onClick={handleSubmit}>Submit</Button>
    </div>

    {/* Todos Section */}
    <div>
      <h2 className="text-xl font-semibold mb-4">Your Todos</h2>
      <TodoTable
        todos={todosData?.getUserTodos || []}
        isLoading={todosLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  </div>
);
}