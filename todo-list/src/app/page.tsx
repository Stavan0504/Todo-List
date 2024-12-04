"use client"
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useMutation, useQuery } from '@apollo/client';
import { CREATE_TODO, DELETE_TODO, UPDATE_TODO } from '@/app/graphQl/mutations/todoMutations';
import { GET_USER_TODOS } from './graphQl/queries/todoQueries';
import { Checkbox } from '@/components/ui/checkbox';



const HomePage = () => {
  interface Todo {
    id: string;
    todo: string;
    description: string;
    isPending: boolean;
    authorId: string;
  }

  const { data: session } = useSession();
  const [todo, setTodo] = useState('');
  const [description, setDescription] = useState('');
  const [isPending, setIsPending] = useState(true); // State for checkbox
  const [editingTodoId, setEditingTodoId] = useState(null);

  const { data: todosData, loading: todosLoading, refetch } = useQuery(GET_USER_TODOS, {
    variables: { userId: session?.user?.id },
  });

  // Create Todo
  const [createTodo, { loading, error, data }] = useMutation(CREATE_TODO, {
    onCompleted: () => {
      refetch();
    },
  });

  // Delete Todo
  const [deleteTodo] = useMutation(DELETE_TODO, {
    onCompleted: () =>
      refetch(),
  });

  // Update Todo
  const [updateTodo, { loading: updateLoading }] = useMutation(UPDATE_TODO, {
    onCompleted: () => {
      setTodo("");
      setDescription("");
      setEditingTodoId(null);
      refetch();
    },
  });

  // create a new todo
  const handleSubmit = async () => {
    if (!todo || !description) {
      alert("Please fill in both fields!");
      return;
    }
    if (editingTodoId) {

      try {
        const response = await updateTodo({
          variables: { id: editingTodoId, todo, description, isPending },
        });
      } catch (err: any) {
        console.error("Error updating todo:", err);
        console.error("GraphQL Error:", err.graphQLErrors);
        console.error("Network Error:", err.networkError);
      }
    }
    else {
      try {
        const response = await createTodo({
          variables: {
            todo: todo,
            description: description,
            authorId: session?.user?.id,
          },
        });
        // Reset the form after submission
        setTodo("");
        setDescription("");
      }
      catch (err: any) {
        console.error("Error submitting todo:", err);
        console.error("GraphQL Error:", err.graphQLErrors);
        console.error("Network Error:", err.networkError);
      }
    }
  };


  const handleDelete = async (id: any) => {
    if (confirm("Are you sure you want to delete this todo?")) {
      await deleteTodo({ variables: { id } });
    }
  };

  const handleEdit = (todo: any) => {
    setTodo(todo.todo);
    setDescription(todo.description);
    setIsPending(!todo.isPending); // Convert to checkbox state
    setEditingTodoId(todo.id);
  };

  if (!session) return null;

  return (
    <div className='flex flex-col items-center gap-10'>


      <div className='flex flex-col gap-4 w-full sm:w-2/4'>

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

        <div className='flex gap-2'>
          <Checkbox
            id="status"
            checked={!isPending}
            onCheckedChange={(checked) => setIsPending(!checked)} />
          <label
            htmlFor="status"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Completed ?...
          </label>
        </div>

        <Button
          className='self-start'
          onClick={handleSubmit}
          disabled={loading}> {loading ? "Submitting..." : "Submit"}
        </Button>
        {error && <p className="text-red-500">Error: {error.message}</p>}
        {data && <p className="text-green-500">Todo successfully submitted!</p>}

      </div>


      <div>
        <h2 className="text-xl font-semibold mb-4">Your Todos</h2>
        {todosLoading ? (
          <p>Loading...</p>
        ) : (
          <table className="table-auto w-full shadow-md rounded-lg">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left">Todo</th>
                <th className="px-4 py-2 text-left">Description</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {todosData?.getUserTodos.map((todo: Todo) => (

                <tr key={todo.id} className="border-b">
                  <td className="px-4 py-2">{todo.todo}</td>
                  <td className="px-4 py-2">{todo.description}</td>
                  <td className="px-4 py-2">{todo.isPending ? "Pending" : "Completed"}</td>
                  <td className="px-4 py-2 space-x-2">
                    {/* Add Delete/Edit functionality */}

                    <Button
                      className=" px-2 py-1 rounded"
                      onClick={() => handleDelete(todo.id)}
                    >Delete
                      <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 30 30">
                        <path d="M 14.984375 2.4863281 A 1.0001 1.0001 0 0 0 14 3.5 L 14 4 L 8.5 4 A 1.0001 1.0001 0 0 0 7.4863281 5 L 6 5 A 1.0001 1.0001 0 1 0 6 7 L 24 7 A 1.0001 1.0001 0 1 0 24 5 L 22.513672 5 A 1.0001 1.0001 0 0 0 21.5 4 L 16 4 L 16 3.5 A 1.0001 1.0001 0 0 0 14.984375 2.4863281 z M 6 9 L 7.7929688 24.234375 C 7.9109687 25.241375 8.7633438 26 9.7773438 26 L 20.222656 26 C 21.236656 26 22.088031 25.241375 22.207031 24.234375 L 24 9 L 6 9 z"></path>
                      </svg>
                    </Button>




                    <Button
                      className=" px-2 py-1 rounded"
                      onClick={() => handleEdit(todo)}
                    >Edit
                      <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 30 30">
                        <path d="M 22.828125 3 C 22.316375 3 21.804562 3.1954375 21.414062 3.5859375 L 19 6 L 24 11 L 26.414062 8.5859375 C 27.195062 7.8049375 27.195062 6.5388125 26.414062 5.7578125 L 24.242188 3.5859375 C 23.851688 3.1954375 23.339875 3 22.828125 3 z M 17 8 L 5.2597656 19.740234 C 5.2597656 19.740234 6.1775313 19.658 6.5195312 20 C 6.8615312 20.342 6.58 22.58 7 23 C 7.42 23.42 9.6438906 23.124359 9.9628906 23.443359 C 10.281891 23.762359 10.259766 24.740234 10.259766 24.740234 L 22 13 L 17 8 z M 4 23 L 3.0566406 25.671875 A 1 1 0 0 0 3 26 A 1 1 0 0 0 4 27 A 1 1 0 0 0 4.328125 26.943359 A 1 1 0 0 0 4.3378906 26.939453 L 4.3632812 26.931641 A 1 1 0 0 0 4.3691406 26.927734 L 7 26 L 5.5 24.5 L 4 23 z"></path>
                      </svg>
                    </Button>

                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>


    </div>
  );
};

export default HomePage;

