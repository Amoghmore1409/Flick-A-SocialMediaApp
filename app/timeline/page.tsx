import { createServerClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Navbar } from '@/components/Navbar'
import { Sidebar } from '@/components/Sidebar'
import { PostComposer } from '@/components/PostComposer'
import { PostCard } from '@/components/PostCard'
import { PostWithAuthor } from '@/lib/types'

async function getPosts() {
  const supabase = await createServerClient()
  
  const { data: posts, error } = await supabase
    .from('posts')
    .select(`
      *,
      users!posts_user_id_fkey(*),
      post_media(*),
      likes(count),
      shares(count)
    `)
    .is('reply_to', null)
    .order('created_at', { ascending: false })
    .limit(50)

  if (error) {
    console.error('Error fetching posts:', error)
    return []
  }

  return posts as unknown as PostWithAuthor[]
}

export default async function TimelinePage() {
  const supabase = await createServerClient()
  
  const { data: { user }, error } = await supabase.auth.getUser()

  console.log('Timeline - User check:', { user: !!user, error })

  if (!user) {
    redirect('/auth/login')
  }

  const { data: userProfile } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  const posts = await getPosts()

  return (
    <div className="min-h-screen">
      <Navbar user={userProfile} />
      <Sidebar user={userProfile} />
      
      <main className="lg:ml-64 pt-16">
        <div className="max-w-2xl mx-auto border-x border-gray-200 dark:border-gray-800 min-h-screen">
          <div className="border-b border-gray-200 dark:border-gray-800 p-4">
            <h1 className="text-xl font-bold">Home</h1>
          </div>

          <div className="border-b border-gray-200 dark:border-gray-800 p-4">
            <PostComposer />
          </div>

          <div>
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                currentUserId={user.id}
              />
            ))}
          </div>

          {posts.length === 0 && (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <p>No posts yet. Be the first to post!</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
