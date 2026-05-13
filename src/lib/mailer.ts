import nodemailer from "nodemailer"
import { config } from "../config"

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: `${config.gmail.user}`,
    pass: config.gmail.password,
  },
})

transporter.verify().catch((err) => console.error("Error al conectarse con servicio Gmail: ", err))

export default transporter
