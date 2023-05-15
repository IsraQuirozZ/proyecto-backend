import { Router } from "express";

const router = Router()

router.get('/chatbot', async (req, res, next) => {
    try {
        return res.render('chatbot', {
            title: 'Chat',
            script: '/public/scripts/chat.js'
        })
    } catch (error) {
        next(error)
    }
})

export default router