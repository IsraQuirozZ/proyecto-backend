import { Router } from "express";
import validator from '../../middlewares/validator.js'
import password_validator from "../../middlewares/passwordValidator.js";
import User from "../../dao/models/User.js";

const router = Router()

router.post('/register', validator, password_validator, async (req, res, next) => {
    try {

        let newUser = await User.create(req.body)

        if (newUser) {
            return res.status(201).json({
                success: true,
                response: `User ${newUser._id} created`
            })
        }

        return res.status(500).json({
            success: true,
            response: 'User not created'
        })

    } catch (error) {
        next(error)
    }
})

export default router