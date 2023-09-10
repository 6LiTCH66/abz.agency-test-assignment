import {Positions} from "../../models/index.mjs"
class PositionsController{
    async getAllPositions(req, res, next){
        try{
            const positions = await Positions.findAll()

            if (positions.length === 0){
                return res.status(422).json({
                    "success": false,
                    "message": "Positions not found"
                })
            }

            return res.status(200).json({
                "success": true,
                positions
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

export default PositionsController;