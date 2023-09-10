import jwt from "jsonwebtoken"

class TokenController{
    async generateToken(req, res){

        const token = jwt.sign({}, process.env.JWT_TOKEN, { expiresIn: '40m' })

        return res.status(200).json({
            "success": true,
            token
        })

    }
}

export default TokenController;