import User from "@/models/userModels";
import nodemailer from "nodemailer";
import bcryptjs from "bcryptjs"

export const sendEmail = async ({ email, emailType, userId }: any) => {

    try {

        const hashedToken = bcryptjs.hash(userId.toSting(), 10)

        if (emailType === "VERIFY") {
            await User.findByIdAndUpdate(userId, { verifyToken: hashedToken, verifyTokenExpiry: Date.now() + 360000 })
        } else if (emailType === "RESET") {
            await User.findByIdAndUpdate(userId, { forgotPasswordToken: hashedToken, forgotPasswordTokenExpiry: Date.now() + 360000 })
        }



        var transport = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
                user: "fa01dfe95ecdc4",
                pass: "cc31c56ba2e0fc"
            }
        });

        // mails options 
        const mailOptions = {
            from: 'info@codereveals.com', // sender address
            to: email, // list of receivers
            subject: emailType === 'VERIFY' ? "Verify your email" : "Reset your Password", // Subject line
            text: "Hello world?", // plain text body
            html: `<p>Click <a href="${process.env.DOMAIN}/verifyemail?token=${hashedToken}">Here</a> to ${emailType === "VERIFY" ? "Verify Your Passwprd" : "Reset Your Password"} or copy and paste the link on browser.
            <br>
            ${process.env.DOMAIN}/verifyemail?token=${hashedToken}
            </p>`, // html body
        }

        // send mail //

        const mailResponse = await transport.sendMail(mailOptions)
        return mailResponse;

    } catch (error) {
        console.log(error)
    }

}