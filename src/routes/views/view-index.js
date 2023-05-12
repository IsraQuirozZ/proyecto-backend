import { Router } from "express";
import newProduct_router from "./newProduct.js";

const router = Router()

router.get('/', async (req, res, next) => {
    try {
        return res.render('index', {
            title: 'Home'
        })
    } catch (error) {
        next(error)
    }
})

router.use('new-product', newProduct_router)

export default router