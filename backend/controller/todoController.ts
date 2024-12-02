import prisma from "../prisma/index";
import { Request, Response } from "express";

// Create Todo List 
export const createTodo = async (req:Request, res:Response) => {
    const {todo, description, authorId}= req.body;

    try {
        const result = await prisma.todoList.create({
        data: {
                todo, 
                description,  
                author: {
                    connect: {
                        id: authorId,
                    },
                }
            }
        });

        res.status(200).json(result);
    } 
    catch (error) {
        console.log(error);
    }
}

// Update Todo List 
export const updateTodo = async (req:Request, res:Response) => {

    const { id } = req.params;
    const { todo, description, isPending } = req.body;

    try {
        const result = await prisma.todoList.update({
        where: { id: id },
        data: {
            todo,
            description,
            isPending,
        }
        });

        res.status(200).json(result);
    } 
    catch (error) {
        res.json({error: `Todo with id ${id} not found`});
    }
}

// Delete Todo List
export const deleteTodo = async (req:Request, res:Response) => {
    const { id } = req.params;

    try {
        const result = await prisma.todoList.delete({
        where: { id: id },
        });

        res.status(200).json(result);
    } 
    catch (error) {
        res.json({error: `Post with id ${id} not found`});
    }
}

// Get Todo List
export const getTodo = async (req:Request, res:Response) => {   

    try {
       const result = await prisma.todoList.findMany();
       res.status(200).json(result);
    }
    catch (error) {
        res.json({error: `No post found`});
    }
}