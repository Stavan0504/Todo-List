import { Request, Response } from "express";
import prisma from "../prisma/index";
import { cookieToken } from "../utils/cookieToken";
import bcrypt from "bcrypt";

// User Sign Up 
export const signUp = async (req: Request, res: Response) => {
    const { name, email, password } = req.body;

    try {
        // Check if all fields are provided
        if (!name || !email || !password) {
            throw new Error('Please provide all required fields (name, email, password)');
        }

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email: email },
        });
        if (existingUser) {
            res.status(400).json({ error: 'User already exists' });
        }

        // Hash the password before storing it
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the user in the database
        const user = await prisma.user.create({
            data: {
                username: name,
                email: email,
                password: hashedPassword,
            },
        });

        // Set the token cookie for the user (assuming cookieToken sets a JWT)
        cookieToken(user, res);

        // Return a success response

    } catch (error) {
        console.error(error);
        throw new Error('An error occurred during registration');
    }
};



// User Sign In
export const signIn = async (req: Request, res: Response) => {

    try {
        const { email, password } = req.body;
        if (!email || !password) {
            throw new Error("please provide fields");
        }

        const user = await prisma.user.findUnique({
            where: {
                email: email,
                password: password
            }
        });

        //if there is no user
        if (!user) {
            throw new Error("User not found");
        }
        //if password is incorrect
        if (user.password !== password) {
            throw new Error("Invalid credentials");
        }

        cookieToken(user, res);
    }
    catch (error) {
        console.log(error);
    }
}



// User Sign Out
export const signOut = async (req: Request, res: Response) => {
    try {
        res.status(200).clearCookie("token").json({
            success: true,
        });
    }
    catch (error) {
        console.log(error);
    }
};