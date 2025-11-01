import { createServerClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Navbar } from '@/components/Navbar'
import { Sidebar } from '@/components/Sidebar'
import { NotificationList } from '@/components/NotificationList'

export default async function NotificationsPage() {
  const supabase = await createServerClient()
  
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const { data: userProfile } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  // Get notifications
  const { data: notifications } = await supabase
    .from('notifications')
    .select(`
      *,
      actor:users!notifications_actor_id_fkey(*),
      post:posts(*)
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(50)

  return (
    <div className="min-h-screen">
      <Navbar user={userProfile} />
      <Sidebar user={userProfile} />
      
      <main className="lg:ml-64 pt-16">
        <div className="max-w-2xl mx-auto border-x border-gray-200 dark:border-gray-800 min-h-screen">
          <div className="border-b border-gray-200 dark:border-gray-800 p-4">
            <h1 className="text-xl font-bold">Notifications</h1>
          </div>

          <NotificationList notifications={notifications as any || []} />
        </div>
      </main>
    </div>
  )
}
