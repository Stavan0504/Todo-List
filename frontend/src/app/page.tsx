"use client"
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import CreateTodo from "@/lib/createTodo";
import DeleteTodo from "@/lib/deleteTodo";
import GetUserTodo from "@/lib/getUserTodo";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableRow,
} from "@/components/ui/table"


export default function Home() {
  const router = useRouter();
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

  // Fetch Todos
  const { data: todosData,refetch } = useQuery({
    queryKey: ["getUserTodo"],
    queryFn: () => GetUserTodo(session?.user?.id || ""),
    enabled: !!session?.user?.id, // Ensure query doesn't run without user ID
  });
  
  // Create Todo Mutation
  const { mutate: createTodo} = useMutation({
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
 

  // Delete Todo Mutation
  const { mutate: deleteTodo} = useMutation({
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
    else {
      createTodo({ todo, description, authorId: session?.user?.id || "" });
    }
  };

  // Handle Delete
  const handleDelete = (id: string) => {
    
      deleteTodo(id);
  };

  const handleView = (id:string) => {
    router.push(`/TodoPage/${id}`);
  }

  // Handle Edit

  if (!session) return null;

return (
  <div className="flex flex-col items-center gap-10">
    {/* Form Section */}
    <div className="flex flex-col gap-4 w-full sm:w-2/4">
      <Input
        required
        placeholder="Enter your Todo"
        value={todo}
        onChange={(e) => setTodo(e.target.value)}
      />
      <Textarea
        required
        placeholder="Enter the description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <Button onClick={handleSubmit}>Submit</Button>
    </div>


    {/* Todos Section */}
    <Table>
          <TableCaption>Todo List</TableCaption>
          <TableBody> 
            <TableRow className='bg-gray-800'>
              <TableCell ><b>Name</b></TableCell>
              <TableCell><b>Description</b></TableCell>
              <TableCell><b>Status</b></TableCell>
              <TableCell><b>Update/Delete/Visit</b></TableCell>
            </TableRow>
            {todosData && todosData.getUserTodos.map((todoItem: Todo) => (
              <TableRow className='bg-gray-600 justify-center items-center align-center' key={todoItem.id}>
                <TableCell>{todoItem.todo}</TableCell>
                <TableCell>{todoItem.description}</TableCell>
                <TableCell className={todoItem.isPending ?` bg-red-500`:`bg-green-500 `} >{todoItem.isPending ? 'Pending' : 'Completed'}</TableCell>
                <TableCell>
                  <Button onClick={() => handleDelete(todoItem.id)} className="mr-2" variant="destructive">
                    Delete
                  </Button>
                  <Button variant="secondary" onClick={() =>  {handleView(todoItem.id)}}>
                    Visit
                  </Button>
                </TableCell>
              </TableRow> 
            ))}
          </TableBody>
        </Table>
  </div>
);
}