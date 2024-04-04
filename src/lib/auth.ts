import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { nanoid } from 'nanoid'
import { NextAuthOptions, getServerSession } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import { db } from './db'
import { Role } from '@prisma/client'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    // TODO: ⚠⚠⚠⚠ Remove this provider in production
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Ім\'я користувача', type: 'text' },
        password: { label: 'Пароль', type: 'password' },
      },
      async authorize(_credentials) {
        return {
          id: 'demoId',
          email: 'demo@e-u.edu.ua',
        }
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id
        session.user.name = token.name
        session.user.email = token.email

        if (token.image && typeof token.image === 'string') {
          session.user.image = token.image
        }

        session.user.username = token.username
        session.user.role = token.role as Role
      }

      return session
    },

    async jwt({ token, user }) {
      const dbUser = await db.user.findFirst({
        where: { email: token.email },
      })

      if (!dbUser) {
        token.id = user!.id
        return token
      }

      // force random username
      // if (!dbUser.username) {
      //   await db.user.update({
      //     where: { id: dbUser.id },
      //     data: { username: nanoid(10) },
      //   })
      // }

      return {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        image: dbUser.image,
        username: dbUser.username,
        role: dbUser.role,
      }
    },

    redirect() {
      return '/'
    },
  },
}

export const getSession = () => getServerSession(authOptions)
