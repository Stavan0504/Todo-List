import express from "express";
import { createTodo, updateTodo, deleteTodo, getTodo } from "../controller/todoController";
import isLoggedIn from "../middlewares/isLoggedIn";

const router = express.Router();

router.route('/todo/create').post( isLoggedIn, createTodo );
router.route('/todo/update/:id').put( isLoggedIn, updateTodo );
router.route('/todo/delete/:id').delete( isLoggedIn, deleteTodo );
router.route('/todo/get').get( isLoggedIn, getTodo );




export default router;