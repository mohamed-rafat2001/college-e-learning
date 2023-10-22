const nodemailer = require('nodemailer')
const uniqid = require('uniqid')
const email = async (user) => {
    const token = uniqid()
    user.passwordResetToken = token
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.MAIL_ID, // generated ethereal user
            pass: process.env.MP
            , // generated ethereal password
        },
    });

    // send mail with defined transport object

    let info = await transporter.sendMail({
        from: '"mohamed 👻" <college@gmail.com>', // sender address
        to: user.email, // list of receivers
        subject: "forgot password", // Subject line
        text: `hey ${user.firstName} ${user.lastName} \n this your verify code to reset password =>>  ${token}`, // plain text body
        html: '', // html body
    })
    return 0
}

module.exports = email