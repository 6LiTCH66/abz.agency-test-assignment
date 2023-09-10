import {Router} from "express";
import PositionsController from "../controllers/positions.controller.js";

const positionsRoute = new Router();
const positionsController = new PositionsController()

positionsRoute.get("/positions", positionsController.getAllPositions)

export default positionsRoute;



