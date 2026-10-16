import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
    host : "smtp.gmail.com",
    port : 465,
    secure : true,
    auth : {
        user : process.env.SMTP_USER,
        pass : process.env.SMTP_PASS
    }
})

export const sendRegistrationEmail = async (recipient :string, otp :string) => {
    await transporter.sendMail({
        from : process.env.SMTP_USER,
        to : recipient,
        subject : "Solo Email Verification",
        text : "Hey",
        html : `<h2>Solo</h2>
            <p>Please enter this otp for email verification provided as it will become invalid in 5 minutes<p/>
            <b>${otp}</b>
        `
    })
}

export const sendPasswordResetEmail = async (recipient :string, otp :string) => {
    await transporter.sendMail({
        from : process.env.SMTP_USER,
        to : recipient,
        subject : "Solo Password Reset OTP",
        text : "Hey",
        html : `<h2>Solo</h2>
            <p>Please enter this otp provided for password reset as it will become invalid in 5 seconds<p/>
            <b>${otp}</b>
        `
    })
}