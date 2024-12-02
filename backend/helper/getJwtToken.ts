import jwt from "jsonwebtoken";

const getWebToken = (userId: string) => {
        return jwt.sign(
            { userId: userId }, 
            process.env.JWT_SECRET_KEY as string, 
            {
                expiresIn: "1d",
            });
    };
    
    export default getWebToken;