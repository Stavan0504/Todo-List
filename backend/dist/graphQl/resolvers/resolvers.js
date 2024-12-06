"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const userResolvers_1 = require("./userResolvers");
const todoResolvers_1 = require("./todoResolvers");
const resolvers = {
    Query: Object.assign(Object.assign({}, userResolvers_1.userResolvers.Query), todoResolvers_1.todoResolvers.Query),
    Mutation: Object.assign(Object.assign({}, userResolvers_1.userResolvers.Mutation), todoResolvers_1.todoResolvers.Mutation)
};
exports.default = resolvers;
