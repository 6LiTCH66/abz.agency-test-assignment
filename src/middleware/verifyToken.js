import jwt from "jsonwebtoken"

function verifyToken(req, res, next){
    const token = req.headers['token'];

    if (!token){
        return res.status(401).json({
            "success": false,
            "message": "Invalid token. Try to get a new one by the method GET api/v1/token."
        })
    }

    jwt.verify(token, process.env.JWT_TOKEN, (error, token) => {
        if (error){
            return res.status(401).json({
                "success": false,
                "message": "The token expired."
            })
        }
        req.token = token
        next()
    })
}

export default verifyToken;