import express from "express";
import { signIn, signOut, signUp } from "../controller/userController";
const router = express.Router();

router.route('/signup').post( signUp );
router.route('/signin').post( signIn );
router.route('/signout').get( signOut );

export default router;