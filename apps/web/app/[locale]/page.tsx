import { redirect } from 'next/navigation'

export default function RootPage() {
  // Redireciona para login com orgslug padrão
  const defaultOrg = process.env.NEXT_PUBLIC_LEARNHOUSE_DEFAULT_ORG || 'default'
  redirect(`/auth/login?orgslug=${defaultOrg}`)
}
