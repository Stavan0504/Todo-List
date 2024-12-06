"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.todoResolvers = void 0;
const index_1 = __importDefault(require("../../prisma/index"));
const graphql_1 = require("graphql");
exports.todoResolvers = {
    Query: {
        getTodos: () => __awaiter(void 0, void 0, void 0, function* () {
            const todos = yield index_1.default.todoList.findMany();
            return todos;
        }),
        getTodo: (_1, _a) => __awaiter(void 0, [_1, _a], void 0, function* (_, { id }) {
            const todo = yield index_1.default.todoList.findUnique({
                where: {
                    id: id,
                },
            });
            return todo;
        }),
        getUserTodos: (_1, _a) => __awaiter(void 0, [_1, _a], void 0, function* (_, { userId }) {
            const todos = yield index_1.default.todoList.findMany({
                where: {
                    authorId: userId,
                },
                include: {
                    author: true
                }
            });
            return todos;
        })
    },
    Mutation: {
        createTodo: (_1, _a) => __awaiter(void 0, [_1, _a], void 0, function* (_, { todo, description, authorId }) {
            try {
                const newTodo = yield index_1.default.todoList.create({
                    data: {
                        todo,
                        description,
                        authorId,
                    },
                });
                return newTodo;
            }
            catch (error) {
                throw new graphql_1.GraphQLError(error.message);
            }
        }),
        updateTodo: (_1, _a) => __awaiter(void 0, [_1, _a], void 0, function* (_, { id, todo, description, isPending }) {
            try {
                const updatedTodo = yield index_1.default.todoList.update({
                    where: {
                        id: id,
                    },
                    data: {
                        todo,
                        description,
                        isPending
                    },
                });
                return updatedTodo;
            }
            catch (error) {
                throw new graphql_1.GraphQLError(error.message);
            }
        }),
        deleteTodo: (_1, _a) => __awaiter(void 0, [_1, _a], void 0, function* (_, { id }) {
            try {
                const deletedTodo = yield index_1.default.todoList.delete({
                    where: {
                        id: id,
                    },
                });
                return true;
            }
            catch (error) {
                throw new graphql_1.GraphQLError(error.message);
            }
        }),
    }
};
