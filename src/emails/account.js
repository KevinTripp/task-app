const sgMail = require("@sendgrid/mail")
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'k.tripp1@gmail.com',
        subject: 'Welcome to Tasker',
        text: `Welcome to the app, ${name}. Let me know how you like the app.`
    })
}

const sendCancellationEmail = (email, name) => {
    sgMail.send({
    to: email,
    from: 'k.tripp1@gmail.com',
    subject: 'Sorry to see you go!',
    text: `We are sorry to see you leave, ${name}. What could we have done to make things better for next time?.`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendCancellationEmail
}
// sgMail.send({
//     to: 'k.tripp1@gmail.com',
//     from: 'k.tripp1@gmail.com',
//     subject: 'First test email',
//     text: 'This is a first email, but hey!'
// })
