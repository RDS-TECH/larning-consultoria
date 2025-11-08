import { redirect } from 'next/navigation'

export default function RootPage() {
  // Redireciona para login - se já estiver logado, o /login irá redirecionar para /home
  redirect('/login')
}
