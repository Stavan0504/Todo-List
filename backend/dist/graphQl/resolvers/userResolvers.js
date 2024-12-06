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
exports.userResolvers = void 0;
const graphql_1 = require("graphql");
const bcrypt_1 = __importDefault(require("bcrypt"));
const index_1 = __importDefault(require("../../prisma/index"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
exports.userResolvers = {
    Query: {
        getUser: (_1, _a) => __awaiter(void 0, [_1, _a], void 0, function* (_, { id }) {
            try {
                const user = yield index_1.default.user.findUnique({
                    where: {
                        id: id,
                    },
                    include: {
                        todos: {
                            include: {
                                author: true
                            }
                        }
                    }
                });
                return user;
            }
            catch (error) {
                console.error(error);
            }
        }),
    },
    Mutation: {
        signUp: (_1, _a) => __awaiter(void 0, [_1, _a], void 0, function* (_, { name, email, password }) {
            try {
                if (!name || !email || !password) {
                    throw new graphql_1.GraphQLError('Please provide all required fields (name, email, password)');
                }
                // Check if user already exists
                const existingUser = yield index_1.default.user.findUnique({
                    where: {
                        email: email
                    },
                });
                if (existingUser) {
                    throw new graphql_1.GraphQLError('User already exists');
                }
                // Hash the password before storing it
                const hashedPassword = yield bcrypt_1.default.hash(password, 10);
                // Create the user in the database
                const user = yield index_1.default.user.create({
                    data: {
                        username: name,
                        email: email,
                        password: hashedPassword,
                    },
                });
                return { user };
            }
            catch (error) {
                console.error('Error during registration:', error);
                throw new graphql_1.GraphQLError('An error occurred during registration');
            }
        }),
        signIn: (_1, _a) => __awaiter(void 0, [_1, _a], void 0, function* (_, { email, password }) {
            try {
                const user = yield index_1.default.user.findUnique({
                    where: {
                        email
                    }
                });
                if (!user) {
                    throw new graphql_1.GraphQLError('User not found');
                }
                const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
                if (!isPasswordValid) {
                    throw new graphql_1.GraphQLError('Invalid email or password');
                }
                const token = jsonwebtoken_1.default.sign({ userId: user.id }, process.env.JWT_SECRET_KEY || 'defaultSecret', {
                    expiresIn: '1d',
                });
                return {
                    token,
                    user,
                };
            }
            catch (error) {
                console.error(error);
                throw new Error('Failed to sign in');
            }
        }),
        signOut: () => __awaiter(void 0, void 0, void 0, function* () {
            try {
                // No user-specific actions are needed here.
                return {
                    message: 'Sign out successful',
                };
            }
            catch (error) {
                console.error(error);
                throw new Error('Failed to sign out');
            }
        })
    }
};
