import { redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/client'
import { cookies } from 'next/headers'

export default async function Home() {
  const cookieStore = cookies()
  const supabase = createServerClient(cookieStore)
  
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    redirect('/auth/login')
  } else {
    redirect('/timeline')
  }
}
