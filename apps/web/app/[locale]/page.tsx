import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { nextAuthOptions } from './auth/options'

export default async function RootPage() {
  const session = await getServerSession(nextAuthOptions)
  const defaultOrg = process.env.NEXT_PUBLIC_LEARNHOUSE_DEFAULT_ORG || 'default'

  // Se o usuário está autenticado, redireciona para /home
  if (session) {
    redirect('/home')
  }

  // Se não está autenticado, redireciona para a landing page pública
  redirect(`/orgs/${defaultOrg}`)
}
