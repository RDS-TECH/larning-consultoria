import NextAuth from 'next-auth'
import { nextAuthOptions } from '@/app/[locale]/auth/options'

const handler = NextAuth(nextAuthOptions as any)

export { handler as GET, handler as POST }
