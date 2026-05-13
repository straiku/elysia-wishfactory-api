export const config = {
  google: {
    clientId: Bun.env.GOOGLE_CLIENT_ID ?? "",
    clientSecret: Bun.env.GOOGLE_CLIENT_SECRET ?? "",
    redirectUri: Bun.env.GOOGLE_REDIRECT_URI ?? "",
  },
  gmail: {
    user: Bun.env.GMAIL_APP_USER ?? "",
    password: Bun.env.GMAIL_APP_PASSWORD ?? "",
  },
  backend: {
    port: Bun.env.BACK_PORT,
  },
  jwtSecret: { value: Bun.env.JWT_SECRET ?? "", expires: Bun.env.JWT_SECRET_EXPIRES ?? "7d" },
}

if (!config.google.clientId) {
  throw new Error("MISSING GOOGLE_CLIENT_ID in .env")
}

if (!config.jwtSecret.value) {
  throw new Error("MISSING JWT_SECRET in .env")
}
