import { redirect } from 'next/navigation'

export default function RootPage() {
  // Redireciona para auth/login - rota correta do sistema
  redirect('/auth/login')
}
