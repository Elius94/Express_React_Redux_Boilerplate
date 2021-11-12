const nmailer = require('nodemailer')

require('dotenv').config({ path: '../.env' })

/**
 * @description Generate an email from a template
 * @param {String} title
 * Title of the email
 * @param {String} subtitle
 * Subtitle of the email
 * @param {String} call
 * Call to action of the email
 * @param {String} text
 * Text of the email
 * @param {String} footer
 * Footer of the email
 * @param {String} credits
 * Credits of the email
 * @param {String} legal
 * Legal information of the email
 * @return {String}
 * The generated email
 * @see https://nodemailer.com/message/
 * @see https://nodemailer.com/smtp/
 * @see https://nodemailer.com/extras/
 * @see https://nodemailer.com/about/
 * @see https://nodemailer.com/docs/
 * @see https://nodemailer.com/docs/transport-smtp/
 * @see https://nodemailer.com/docs/sending-mail/
 * @see https://nodemailer.com/docs/messages/ 
 */
function generateEmailFromTemplate(title, subtitle, call, text, footer, credits, legal) {
    if (title && subtitle && call && text && footer && credits && legal) {

        return htmlTemplate = `<!doctype html>
        <html>
          <head>
            <meta name="viewport" content="width=device-width">
            <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
            <title>${title}</title>
            <style>
            @media only screen and (max-width: 620px) {
              table[class=body] h1 {
                font-size: 28px !important;
                margin-bottom: 10px !important;
              }
              table[class=body] p,
                    table[class=body] ul,
                    table[class=body] ol,
                    table[class=body] td,
                    table[class=body] span,
                    table[class=body] a {
                font-size: 16px !important;
              }
              table[class=body] .wrapper,
                    table[class=body] .article {
                padding: 10px !important;
              }
              table[class=body] .content {
                padding: 0 !important;
              }
              table[class=body] .container {
                padding: 0 !important;
                width: 100% !important;
              }
              table[class=body] .main {
                border-left-width: 0 !important;
                border-radius: 0 !important;
                border-right-width: 0 !important;
              }
              table[class=body] .btn table {
                width: 100% !important;
              }
              table[class=body] .btn a {
                width: 100% !important;
              }
              table[class=body] .img-responsive {
                height: auto !important;
                max-width: 100% !important;
                width: auto !important;
              }
            }
        
            @media all {
              .ExternalClass {
                width: 100%;
              }
              .ExternalClass,
                    .ExternalClass p,
                    .ExternalClass span,
                    .ExternalClass font,
                    .ExternalClass td,
                    .ExternalClass div {
                line-height: 100%;
              }
              .apple-link a {
                color: inherit !important;
                font-family: inherit !important;
                font-size: inherit !important;
                font-weight: inherit !important;
                line-height: inherit !important;
                text-decoration: none !important;
              }
              #MessageViewBody a {
                color: inherit;
                text-decoration: none;
                font-size: inherit;
                font-family: inherit;
                font-weight: inherit;
                line-height: inherit;
              }
              .btn-primary table td:hover {
                background-color: #34495e !important;
              }
              .btn-primary a:hover {
                background-color: #34495e !important;
                border-color: #34495e !important;
              }
            }
            </style>
          </head>
          <body class="" style="background-color: #f6f6f6; font-family: sans-serif; -webkit-font-smoothing: antialiased; font-size: 14px; line-height: 1.4; margin: 0; padding: 0; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;">
            <span class="preheader" style="color: transparent; display: none; height: 0; max-height: 0; max-width: 0; opacity: 0; overflow: hidden; mso-hide: all; visibility: hidden; width: 0;">This is preheader text. Some clients will show this text as a preview.</span>
            <table border="0" cellpadding="0" cellspacing="0" class="body" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; background-color: #f6f6f6;">
              <tr>
                <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;">&nbsp;</td>
                <td class="container" style="font-family: sans-serif; font-size: 14px; vertical-align: top; display: block; Margin: 0 auto; max-width: 580px; padding: 10px; width: 580px;">
                  <div class="content" style="box-sizing: border-box; display: block; Margin: 0 auto; max-width: 580px; padding: 10px;">
        
                    <!-- START CENTERED WHITE CONTAINER -->
                    <table class="main" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; background: #ffffff; border-radius: 3px;">
        
                      <!-- START MAIN CONTENT AREA -->
                      <tr>
                        <td class="wrapper" style="font-family: sans-serif; font-size: 14px; vertical-align: top; box-sizing: border-box; padding: 20px;">
                          <table border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;">
                            <tr>
                              <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;">
                                <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">${title}</p>
                                <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">${subtitle}</p>
                                <table border="0" cellpadding="0" cellspacing="0" class="btn btn-primary" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; box-sizing: border-box;">
                                  <tbody>
                                    <tr>
                                      <td align="left" style="font-family: sans-serif; font-size: 14px; vertical-align: top; padding-bottom: 15px;">
                                        <table border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: auto;">
                                          <tbody>
                                            <tr>
                                              <td style="font-family: sans-serif; font-size: 14px; vertical-align: top; background-color: #3498db; border-radius: 5px; text-align: center;"> <a href="${call.href}" target="_blank" style="display: inline-block; color: #ffffff; background-color: #3498db; border: solid 1px #3498db; border-radius: 5px; box-sizing: border-box; cursor: pointer; text-decoration: none; font-size: 14px; font-weight: bold; margin: 0; padding: 12px 25px; text-transform: capitalize; border-color: #3498db;">${call.text}</a> </td>
                                            </tr>
                                          </tbody>
                                        </table>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                                <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;"><i>${text}</i></p>
                                <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">${footer}</p>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
        
                    <!-- END MAIN CONTENT AREA -->
                    </table>
        
                    <!-- START FOOTER -->
                    <div class="footer" style="clear: both; Margin-top: 10px; text-align: center; width: 100%;">
                      <table border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;">
                        <tr>
                          <td class="content-block" style="font-family: sans-serif; vertical-align: top; padding-bottom: 10px; padding-top: 10px; font-size: 12px; color: #999999; text-align: center;">
                            <span class="apple-link" style="color: #999999; font-size: 12px; text-align: center;">${credits.signature}</span>
                            <br>${legal.unsubscribeQuestion}<a href="${legal.unsubscribeLink}" style="text-decoration: underline; color: #999999; font-size: 12px; text-align: center;">${legal.unsubscribeText}</a>.
                          </td>
                        </tr>
                        <tr>
                          <td class="content-block powered-by" style="font-family: sans-serif; vertical-align: top; padding-bottom: 10px; padding-top: 10px; font-size: 12px; color: #999999; text-align: center;">
                            ${credits.poweredByText}<a href="${credits.link}" style="color: #999999; font-size: 12px; text-align: center; text-decoration: none;">${credits.name}</a>.
                          </td>
                        </tr>
                      </table>
                    </div>
                    <!-- END FOOTER -->
        
                  <!-- END CENTERED WHITE CONTAINER -->
                  </div>
                </td>
                <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;">&nbsp;</td>
              </tr>
            </table>
          </body>
        </html>`
    } else {
        return false
    }
}

/**
 * Initialize a transporter to send emails
 * @returns {Mail}
 * An object to send emails
 */
async function initTransporter() {
    // I'm assuming credentials are available as environment variables
    if (!(process.env.MAIL_HOST) || !(process.env.MAIL_PORT) ||
        !(process.env.MAIL_SECURE) || !(process.env.MAIL_USER) ||
        !(process.env.MAIL_PASS)) {
        console.error('sendEmail(): credentials missing, cannot send email')
        throw new Error('email credentials not set')
    }
    // Set up the mail sender
    const transporter = nmailer.createTransport({
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        // Defaults security to true unless the env says 'false' explicitly
        secure: !(process.env.MAIL_SECURE === 'false'),
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS
        }
    })
    return transporter
}

/** 
 * @description Send an email to the receiver
 * @param {Mail} transporter - The transporter object to send the email
 * @param {string} receiver - The email address to send the email to
 * @param {string} username - The username of the user to send the email to
 * @returns {Promise} - A promise that resolves when the email has been sent
 * @throws {Error} - If the email cannot be sent
 */
async function sendEmail(transporter, receiver, username) {
    // Actually send the email
    const info = await transporter.sendMail({
        from: `"WEBAPP EMAIL" <${process.env.MAIL_USER}>`,
        to: receiver,
        subject: `Welcome to this mailing list`,
        html: generateEmailFromTemplate(
            `Ciao ${username},`,
            `Hai ricevuto questa email perchè il sistema lo ha ritenuto giusto...` +
            '\nControlla al più presto la situazione!', {
                href: `http://${process.env.REACT_APP_BK_IPV4_ADDRESS}/`,
                text: 'Vai alla Dashboard'
            },
            'Email generata automaticamente dal sistema di controllo dispositivi di sicurezza, non rispondere a questo messaggio.',
            'Grazie, buon lavoro.', {
                signature: 'Elia Lazzari © 2021 - Bologna (BO)',
                poweredByText: 'Powered by',
                link: 'https://www.t3lab.it/',
                name: 'T3LAB'
            }, {
                unsubscribeQuestion: 'Non vuoi più ricevere queste email?',
                unsubscribeLink: `http://${process.env.REACT_APP_BK_IPV4_ADDRESS}/`,
                unsubscribeText: 'Accedi e richiedi al gestore del tuo account di disattivarti la notifica Email.'
            })
    })
    console.log('Email message sent:', info.messageId)
}

module.exports = {
    initTransporter,
    sendEmail,
}