import { createServerClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { Navbar } from '@/components/Navbar'
import { Sidebar } from '@/components/Sidebar'
import { PostCard } from '@/components/PostCard'
import { PostComposer } from '@/components/PostComposer'

export default async function PostPage({
  params,
}: {
  params: { id: string }
}) {
  const supabase = await createServerClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const { data: currentUser } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  // Get the post
  const { data: post, error: postError } = await supabase
    .from('posts')
    .select('*, users(*), post_media(*)')
    .eq('id', params.id)
    .single()

  if (postError || !post) {
    notFound()
  }

  // Get replies
  const { data: replies } = await supabase
    .from('posts')
    .select('*, users(*), post_media(*)')
    .eq('reply_to', params.id)
    .order('created_at', { ascending: true })

  return (
    <div className="min-h-screen">
      <Navbar user={currentUser} />
      <Sidebar user={currentUser} />
      
      <main className="lg:ml-64 pt-16">
        <div className="max-w-2xl mx-auto border-x border-gray-200 dark:border-gray-800 min-h-screen">
          <div className="border-b border-gray-200 dark:border-gray-800 p-4">
            <h1 className="text-xl font-bold">Post</h1>
          </div>

          <PostCard post={post} currentUserId={user.id} />

          <div className="border-t border-gray-200 dark:border-gray-800 p-4">
            <PostComposer replyTo={params.id} />
          </div>

          {replies && replies.length > 0 && (
            <div className="border-t border-gray-200 dark:border-gray-800">
              {replies.map((reply: any) => (
                <PostCard
                  key={reply.id}
                  post={reply}
                  currentUserId={user.id}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
