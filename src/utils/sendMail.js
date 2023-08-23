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

export default async (title, message) => {
    return await transporter.sendMail({
        from: '<DecorateMe>',
        to: config.GMAIL_USER_APP,
        subject: 'DecorateMe message',
        html: `<h1>${title}</h1>
        <p>${message}</p>`
    })
}