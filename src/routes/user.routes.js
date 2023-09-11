import {Router} from "express";
import UserController from "../controllers/user.controller.mjs";
import {query, param, body, check} from "express-validator";
import multer from "multer"
import verifyToken from "../middleware/verifyToken.js";
import fs from "fs";

const userRoute = new Router();
const userController = new UserController();


const upload = multer({
    dest: 'images/'});


userRoute.post("/create-users",
    verifyToken,
    upload.single('photo'),
    [
        body("name")
            .bail()
            .not().isEmpty().withMessage("The name field is required.")
            .bail()
            .isLength({min: 2, max: 60}).withMessage("The name must be at least 2 characters."),

        body("email")
            .bail()
            .not().isEmpty().withMessage("The email field is required.")
            .bail()
            .isEmail().withMessage("The email must be a valid email address."),

        body("phone")
            .bail()
            .not().isEmpty().withMessage("The name phone is required.")
            .bail()
            .matches(/^\+380\d{9}$/).withMessage("Number should start with code of Ukraine +380"),

        body("position_id")
            .bail()
            .not().isEmpty().withMessage("The position_id field is required.")
            .bail()
            .isInt().withMessage("The position id must be an integer."),
        check("photo").custom((value, {req}) => {
            if (req.file && req.file.size > 5 * 1024 * 1024) {

                throw new Error('The photo may not be greater than 5 Mbytes.');
            }
            return true;
        })
    ],
    userController.createUser)

userRoute.get("/users",
    [
        query("count").isInt().withMessage("The count must be an integer."),
        query("page").isInt({ gt: 0 }).withMessage("The page must be at least 1.")
    ], userController.getUsers)

userRoute.get("/users/:id",
    [
        param("id").isInt().withMessage("The user_id must be an integer.")
    ],
    userController.getOneUser)



export default userRoute;