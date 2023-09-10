import {Positions, User} from "../../models/index.mjs"
import {validationResult} from "express-validator";
import {Op} from "sequelize";
import tinify from "tinify"
import sharp from "sharp";
import fs from "fs";
import path from "path";


function formatErrors(errors) {
    let formattedErrors = {};

    errors.forEach(error => {
        if (!formattedErrors[error.path]) {
            formattedErrors[error.path] = [];
        }
        formattedErrors[error.path].push(error.msg);
    });

    return {
        fails: formattedErrors
    };
}

async function cropImage(imagePath){
    tinify.key = process.env.TINIFY_KEY

    // resize image to 70x70
    const croppedBuffer = await sharp(imagePath)
        .resize(70, 70, {
            fit: 'cover',
            position: 'center'
        })
        .jpeg({ quality: 90 })
        .toBuffer();

    // Optimize image with tinify
    const optimizedBuffer = await tinify.fromBuffer(croppedBuffer).toBuffer();

    // Save optimized image to folder
    const outputPath = path.join('images', `${Date.now()}.jpg`);
    fs.writeFileSync(outputPath, optimizedBuffer);

    fs.unlinkSync(imagePath);

    return outputPath
}


class UserController{
    async getUsers(req, res, next){

        try{
            const errors = validationResult(req)


            if (!errors.isEmpty()){
                const fails = formatErrors(errors.array()).fails

                return res.status(422).json({
                    "success": false,
                    "message": "Validation failed",
                    fails: fails
                })
            }


            const page = parseInt(req.query.page)
            const count = parseInt(req.query.count)

            const startIndex = (page - 1) * count
            const endIndex = page * count

            const total_users = await User.count();
            const total_pages = Math.ceil(total_users / count);

            const results = {}


            if (endIndex < total_users) {

                results.next_url = `${process.env.BASE_URL}/api/v1/users?page=${page + 1}&count=${count}`
            }else{
                results.next_url = null
            }


            if (startIndex > 0) {
                results.prev_url = `${process.env.BASE_URL}/api/v1/users?page=${page - 1}&count=${count}`
            }else{
                results.prev_url = null
            }

            if (total_users < page){

                return res.status(404).json({
                    "success": false,
                    "message": "Page not found"
                })
            }

            const users = await User.findAll({limit: count, offset: startIndex});


            return res.status(200).json({
                success: true,
                page: page,
                total_users: total_users,
                total_pages: total_pages,
                count: count,
                links: results,
                users: users,
            });

        }catch (error){
            return res.status(500).json({
                success: false,
                error: 'Server Error',
                details: error.message,
            });
        }
    }

    async getOneUser(req, res, next){
        try{
            const id = parseInt(req.params.id);
            const errors = validationResult(req);

            if (!errors.isEmpty()){
                const fails = formatErrors(errors.array()).fails

                return res.status(400).json({
                    "success": false,
                    "message": "Validation failed",
                    fails: fails

                })
            }

            const user = await User.findByPk(id)

            if (user === null){
                return res.status(404).json({
                    "success": false,
                    "message": "The user with the requested identifier does not exist",

                    "fails": {
                        "user_id" : [
                            "User not found"
                        ]
                    }
                })
            }
            return res.status(200).json({
                success: true,
                user
            })

        }catch (error){
            return res.status(500).json({
                success: false,
                error: 'Server Error',
                details: error.message,
            });
        }
    }

    async createUser(req, res, next){
        try{
            const {name, email, phone, position_id} = req.body;

            const errors = validationResult(req);

            if (!errors.isEmpty()){
                const fails = formatErrors(errors.array()).fails

                if (req.file) {
                    fs.unlinkSync(req.file.path);
                }

                return res.status(422).json({
                    "success": false,
                    "message": "Validation failed",
                    fails: fails
                })
            }

            const candidate = await User.findOne({
                where: {
                    [Op.or]: [
                        {email: email},
                        {phone: phone}
                    ]
                }
            })

            if (candidate){

                if (req.file) {
                    fs.unlinkSync(req.file.path);
                }

                return res.status(409).json({
                    "success": false,
                    "message": "User with this phone or email already exist"
                })
            }

            const position = await Positions.findByPk(position_id)


            const outputPath = await cropImage(req.file.path)

            const newUser = {
                name: name,
                email: email,
                phone: phone,
                position_id: position_id,
                position: position.name,
                photo: `${process.env.BASE_URL}/${outputPath}`,
                createdAt: new Date(),
                updatedAt: new Date(),
            }

            const newUserRecord = await User.create(newUser)

            return res.status(200).json({
                "success": true,
                "user_id": newUserRecord.id,
                "message": "New user successfully registered",
            })


        }catch (error){
            return res.status(500).json({
                success: false,
                error: 'Server Error',
                details: error.message,
            });
        }
    }
}
export default UserController;


