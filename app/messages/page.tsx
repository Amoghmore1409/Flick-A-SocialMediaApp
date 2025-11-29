import { createServerClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Navbar } from '@/components/Navbar'
import { Sidebar } from '@/components/Sidebar'
import { ChatList } from '@/components/ChatList'

export default async function MessagesPage() {
  const supabase = await createServerClient()
  
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    redirect('/auth/login')
  }

  const { data: currentUser } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!currentUser) {
    redirect('/auth/login')
  }

  return (
    <div className="min-h-screen">
      <Navbar user={currentUser} />
      <Sidebar user={currentUser} />
      
      <main className="lg:ml-64 pt-16">
        <div className="max-w-2xl mx-auto border-x border-gray-200 dark:border-gray-800 min-h-screen">
          <div className="border-b border-gray-200 dark:border-gray-800 p-4">
            <h1 className="text-xl font-bold">Messages</h1>
          </div>

          <ChatList currentUserId={user.id} />
        </div>
      </main>
    </div>
  )
}
