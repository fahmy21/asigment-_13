import nodemailer from "nodemailer"
import { env } from "../../../config/env.service.js"
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: env.google_account_email,
        pass: env.google_app_password
    }
})
export const sendemail = async ({ to, subject, html }) => {
    const info = await transporter.sendMail({
        from: `Mohamed Ben Azima <${env.google_account_email}`,
        to,
        subject,
        html
    })
    console.log("mail send");

}