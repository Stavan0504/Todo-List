"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import GetTodo from "@/lib/getTodo";
import { useParams } from "next/navigation";

const Todo = () => {
  const params = useParams<{ id: string; }>()

  const { data: todo, error } = useQuery({
    queryKey: ["getTodo", params.id ],
    queryFn: () => GetTodo(params.id as string),
    enabled: !!params.id,
  });

  if (error) {
    return <p>Error fetching todo: {error.message}</p>;
  }

  if (!todo) {
    return <p>Todo not found</p>;
  }

  return (
    <div>
      <h1>Todo Details</h1>
      <p>ID: {todo.getTodo.id}</p>
      <p>Title: {todo.getTodo.todo}</p>
      <p>Description: {todo.getTodo.description}</p>
      <p>Status: {todo.getTodo.isPending ? "Pending" : "Completed"}</p>
    </div>
  );
};

export default Todo;
