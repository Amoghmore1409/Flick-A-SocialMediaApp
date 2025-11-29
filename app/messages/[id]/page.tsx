import { createServerClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { Navbar } from '@/components/Navbar'
import { Sidebar } from '@/components/Sidebar'
import { ChatWindow } from '@/components/ChatWindow'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default async function ConversationPage({
  params,
}: {
  params: { id: string }
}) {
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

  // Verify user is part of this conversation
  const { data: participant } = await supabase
    .from('conversation_participants')
    .select('*')
    .eq('conversation_id', params.id)
    .eq('user_id', user.id)
    .single()

  if (!participant) {
    notFound()
  }

  // Get other participant with proper typing
  const { data: participants } = await supabase
    .from('conversation_participants')
    .select(`
      user_id,
      users (
        id,
        username,
        display_name,
        avatar_url
      )
    `)
    .eq('conversation_id', params.id)
    .neq('user_id', user.id)

  const otherUser = participants && participants.length > 0 
    ? (participants[0] as any).users 
    : null

  return (
    <div className="min-h-screen">
      <Navbar user={currentUser} />
      <Sidebar user={currentUser} />
      
      <main className="lg:ml-64 pt-16">
        <div className="max-w-2xl mx-auto border-x border-gray-200 dark:border-gray-800 h-[calc(100vh-4rem)] flex flex-col">
          <div className="border-b border-gray-200 dark:border-gray-800 p-4 flex items-center space-x-3">
            <Link href="/messages" className="hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-full">
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="text-lg font-bold">{otherUser?.display_name || 'Unknown User'}</h1>
              <p className="text-sm text-gray-500">@{otherUser?.username || 'unknown'}</p>
            </div>
          </div>

          <ChatWindow
            conversationId={params.id}
            currentUserId={user.id}
            otherUser={otherUser}
          />
        </div>
      </main>
    </div>
  )
}
