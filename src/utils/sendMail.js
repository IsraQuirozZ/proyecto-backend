import nodemailer from 'nodemailer'
import config from '../config/config.js'

const transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user: config.GMAIL_USER_APP,
        pass: config.GMAIL_PASS_APP
    }
})

export default async () => {
    return await transporter.sendMail({
        from: 'test <pivaguadalupe1504@gmail.com>',
        to: 'pivaguadalupe1504@gmail.com',
        subject: 'Prueba',
        html: '<h1>Correo de prueba</h1>'
    })
}