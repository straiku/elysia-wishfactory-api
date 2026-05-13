import { Elysia, t } from "elysia"
import jwt from "@elysiajs/jwt"
import {
  exchangeCodeForTokens,
  findOrCreateUser,
  getGoogleUrl,
  getGoogleUser,
} from "./auth.service"
import { config } from "../config"

export const authRoutes = new Elysia({ prefix: "/auth" })
  .use(
    jwt({
      name: "jwt",
      secret: config.jwtSecret.value,
      exp: config.jwtSecret.expires,
    }),
  )
  .get("/google", ({ redirect }) => {
    return redirect(getGoogleUrl())
  })
  .get(
    "/google/callback",
    async ({ query, set, jwt }) => {
      const code = query.code

      try {
        const tokens = await exchangeCodeForTokens(code)
        const googleUser = await getGoogleUser(tokens.access_token)
        const user = await findOrCreateUser(googleUser)
        const accessToken = await jwt.sign({
          sub: user.id,
          email: user.email,
        })
        return {
          success: true,
          token: accessToken,
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            picture: user.picture,
          },
        }
      } catch (err) {
        set.status = 500
        return { error: "Authentication failed" }
      }
    },
    {
      query: t.Object({
        code: t.String(),
      }),
    },
  )
