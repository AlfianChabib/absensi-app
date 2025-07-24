import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import prisma from "./db";

export const auth = betterAuth({
  appName: "Absen Siswa",
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  trustedOrigins: ["https://192.168.1.84"],
  logger: {
    enabled: true,
    level: "debug",
    transport: "console",
  },
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  session: {
    disableSessionRefresh: false,
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day (every 1 day the session expiration is updated)
    freshAge: 60 * 5,
  },
  plugins: [nextCookies()],
});
