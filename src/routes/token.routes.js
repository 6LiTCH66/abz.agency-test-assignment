import {Router} from "express";
import TokenController from "../controllers/token.controller.js";

const tokenRoutes = new Router()
const tokenController = new TokenController()

tokenRoutes.get("/token", tokenController.generateToken)

export default tokenRoutes;