import prisma from '../prisma/index';
import jwt from 'jsonwebtoken';
import { Response, NextFunction } from 'express';

// Middleware to check if user is logged in before accessing protected routes
const isLoggedIn = async (req:any, res:Response, next:NextFunction): Promise<any> => {

    const cookieHeader = req.headers['cookie'];
    const token = cookieHeader
    .split(';')
    .find((c: string) => c.trim().startsWith('token='))
    ?.split('=')[1];

   try{
   
    if (!token) {
            return res.status(401).json({message: "Not authorized to access this route"});
        }      

    if (!process.env.JWT_SECRET_KEY) {
            return res.status(500).json({ message: "JWT secret key is not defined" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY) as jwt.JwtPayload;
        req.user = await prisma.user.findUnique({
            where:{
                id:decoded.userId
            }
        })

        next();
   }
   catch(error){
       return res.status(401).json({message: "Not authorized to access this route"});
   }
}
export default isLoggedIn;