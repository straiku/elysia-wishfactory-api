import { nanoid } from "nanoid"
import db from "../db"
import { config } from "../config"
interface GoogleUser {
  sub: string
  email: string
  name: string
  picture: string
  email_verified: boolean
}

export function getGoogleUrl() {
  const params = new URLSearchParams({
    client_id: config.google.clientId,
    redirect_uri: config.google.redirectUri,
    response_type: "code",
    scope: "openid email profile",
  })

  return `https://accounts.google.com/o/oauth2/v2/auth?${params}`
}

export async function exchangeCodeForTokens(code: string) {
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code: code,
      client_id: config.google.clientId,
      client_secret: config.google.clientSecret,
      redirect_uri: config.google.redirectUri,
      grant_type: "authorization_code",
    }),
  })

  if (!response.ok) {
    throw new Error(`Google Token Exchange failed: ${response.statusText}`)
  }

  return response.json()
}

export async function getGoogleUser(accessToken: string): Promise<GoogleUser> {
  const response = await fetch("https://openidconnect.googleapis.com/v1/userinfo", {
    method: "GET",
    headers: { Authorization: `Bearer ${accessToken}` },
  })

  if (!response.ok) {
    throw new Error("Failed to fetch Google user info")
  }

  return response.json()
}

function genUserName(email: string) {
  const domain = email.split("@")[0]
  return `${domain}_${nanoid(6)}`
}

export async function findOrCreateUser(googleUser: GoogleUser) {
  let user = await db.user.findUnique({ where: { googleId: googleUser.sub } })

  if (!user) {
    user = await db.user.create({
      data: {
        googleId: googleUser.sub,
        email: googleUser.email,
        fullname: googleUser.name,
        username: genUserName(googleUser.email),
        picture: googleUser.picture,
      },
    })
  } else {
    await db.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } })
  }

  return user
}
