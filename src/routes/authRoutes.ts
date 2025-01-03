import express,  { RequestHandler }  from "express";
import { registerUser, loginUser } from "../controllers/authController";
import { validateRegister, validateLogin } from "../middlewares/validateInput"; 

const authRoutes = express.Router();

authRoutes.post("/register", [validateRegister, registerUser] as RequestHandler[]);
authRoutes.post("/login", [validateLogin, loginUser] as RequestHandler[]);


export default authRoutes;