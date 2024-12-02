import prisma from "../../prisma/index";
import { GraphQLError } from "graphql";

interface GetTodosArgs {
    id: string;
    todo: string;
    description: string;
    isPending: boolean;
    authorId: string;
  }

export const todoResolvers = {

    Query: {
        getTodos: async () => {
            const todos = await prisma.todoList.findMany();
            return todos;
        },

        getTodo: async (_: unknown, { id }: { id: string }) => {
            const todo = await prisma.todoList.findUnique({
                where: {
                    id: id,
                },
            });
            return todo;
        },

        getUserTodos: async (_: unknown, { userId }: { userId: string }) => {
            const todos = await prisma.todoList.findMany({
                where: {
                    authorId: userId,
                },
                include: {
                    author: true
                }
            });
            return todos;
            }
    },
    
    Mutation: {

        createTodo: async (_:unknown, { todo, description, authorId }: GetTodosArgs) => {
            try {
                const newTodo = await prisma.todoList.create({
                    data: {
                        todo,
                        description,
                        authorId,
                    },
                });
                return newTodo;
            } catch (error) {
                throw new GraphQLError((error as Error).message);
            }
        },

        updateTodo: async (_:unknown, { id, todo, description, isPending }: GetTodosArgs) => {
            try {
                const updatedTodo = await prisma.todoList.update({
                    where: {
                        id: id,
                    },
                    data: {
                        todo,
                        description,
                        isPending,
                    },
                });
                return updatedTodo;
            } catch (error) {
                throw new GraphQLError((error as Error).message);
            }
        },

        deleteTodo: async (_: unknown, { id }: { id: string }) => {
            try {
                const deletedTodo = await prisma.todoList.delete({
                    where: {
                        id: id,
                    },
                });
                return deletedTodo;
            } catch (error) {
                throw new GraphQLError((error as Error).message);
            }
        },
    }
}