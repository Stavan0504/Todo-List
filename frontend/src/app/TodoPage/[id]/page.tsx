"use client";

import React, { useState, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import GetTodo from "@/lib/getTodo";
import UpdateTodo from "@/lib/updateTodo";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

const Todo = () => {
  interface Todo {
    id: string;
    todo: string;
    description: string;
    isPending: boolean;
  }
  const params = useParams<{ id: string }>();
  const [flag, setFlag] = useState(false);
  const [todo, setTodo] = useState("");
  const [description, setDescription] = useState("");
  const [isPending, setIsPending] = useState(false);

  // Fetch Todo
  const { data: TodoVisit, error, refetch } = useQuery({
    queryKey: ["getTodo", params.id],
    queryFn: () => GetTodo(params.id as string),
    enabled: !!params.id,
  });

  // Sync state with fetched data
  useEffect(() => {
    if (TodoVisit) {
      setTodo(TodoVisit.getTodo.todo || "");
      setDescription(TodoVisit.getTodo.description || "");
      setIsPending(TodoVisit.getTodo.isPending || false);
    }
  }, [TodoVisit]);

  // Update Mutation
  const { mutate: updateTodo } = useMutation({
    mutationFn: ({ id, todo, description, isPending }:Todo) =>
      UpdateTodo(id, todo, description, isPending),
    onSuccess: () => {
      refetch();
      setFlag(false);
    },
    onError: (err: Error) => {
      console.error("Error updating todo:", err.message);
    },
  });

  if (error) {
    return <p>Error fetching todo: {error.message}</p>;
  }

  if (!TodoVisit) {
    return <p>Todo not found</p>;
  }

  return (
    <div>
      <h1>Todo Details</h1>
      <p>ID: {TodoVisit.getTodo?.id}</p>
      <p>Title: {TodoVisit.getTodo?.todo}</p>
      <p>Description: {TodoVisit.getTodo?.description}</p>
      <p>Status: {TodoVisit.getTodo?.isPending ? "Pending" : "Completed"}</p>
      <Button onClick={() => setFlag(true)}>Edit Todo</Button>

      {flag && (
        <div>
          <Input
            required
            placeholder="Enter your Todo"
            className="mb-2"
            value={todo}
            onChange={(e) => setTodo(e.target.value)}
          />
          <Textarea
            required
            className="mb-2"
            placeholder="Enter the description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <div className="flex items-center space-x-2">
            <Checkbox
            className="mb-2"
              id="status"
              checked={!isPending}
              onCheckedChange={(checked) => setIsPending(!checked)}
            />
            <label htmlFor="status" className="text-sm font-medium leading-none">
              Completed?
            </label>
          </div>
          <Button
            onClick={() =>
              updateTodo({
                id: params.id,
                todo,
                description,
                isPending,
              })
            }
          >
            Save Changes
          </Button>
        </div>
      )}
    </div>
  );
};

export default Todo;
