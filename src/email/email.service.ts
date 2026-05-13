import { config } from "../config"
import transporter from "../lib/mailer"

interface SendVerificationEmailParams {
  userEmail: string
  verificationUrl: string
}

export async function sendVerificationEmail({
  userEmail,
  verificationUrl,
}: SendVerificationEmailParams) {
  const mailOptions = {
    from: `"WishPlattform" <${config.gmail.user}@gmail.com>`,
    to: userEmail,
    subject: "Verifica tu dirección de correo electrónico",
    html: `
      <h1>¡Bienvenido a WishPlattform!</h1>
      <p>Haz clic en el siguiente enlace para verificar tu correo electrónico:</p>
      <a href="${verificationUrl}" style="background-color: #4CAF50; color: white; padding: 14px 25px; text-align: center; text-decoration: none; display: inline-block;">Verificar Correo</a>
      <p>Este enlace expirará en 24 horas.</p>
      <p>Si no has creado una cuenta, puedes ignorar este mensaje.</p>
    `,
  }

  try {
    const info = await transporter.sendMail(mailOptions)
    console.log("Correo enviado: %s", info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error("Error al enviar el correo:", error)
    throw new Error("No se pudo enviar el correo de verificación.")
  }
}
