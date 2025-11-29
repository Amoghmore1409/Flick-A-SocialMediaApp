import { createServerClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { Navbar } from '@/components/Navbar'
import { Sidebar } from '@/components/Sidebar'
import { ProfileHeader } from '@/components/ProfileHeader'
import { PostCard } from '@/components/PostCard'
import type { User } from '@/lib/types'

export default async function ProfilePage({
  params,
}: {
  params: { username: string }
}) {
  const supabase = await createServerClient()
  
  const { data: { user: currentUser } } = await supabase.auth.getUser()

  if (!currentUser) {
    redirect('/auth/login')
  }

  const { data: currentUserProfile } = await supabase
    .from('users')
    .select('*')
    .eq('id', currentUser.id)
    .single()

  // Get profile user
  const { data: profileUser, error: profileError } = await supabase
    .from('users')
    .select('*')
    .eq('username', params.username)
    .single()

  if (profileError || !profileUser) {
    notFound()
  }

  // Type assertion to tell TypeScript profileUser is not null
  const validProfileUser = profileUser as User

  // Get posts with simplified query
  const { data: posts } = await supabase
    .from('posts')
    .select('*, users(*), post_media(*)')
    .eq('user_id', validProfileUser.id)
    .is('reply_to', null)
    .order('created_at', { ascending: false })
    .limit(50)

  // Get counts separately for better performance
  const [
    { count: followersCount },
    { count: followingCount },
    { data: followData }
  ] = await Promise.all([
    supabase
      .from('follows')
      .select('*', { count: 'exact', head: true })
      .eq('followee_id', validProfileUser.id),
    supabase
      .from('follows')
      .select('*', { count: 'exact', head: true })
      .eq('follower_id', validProfileUser.id),
    supabase
      .from('follows')
      .select('*')
      .eq('follower_id', currentUser.id)
      .eq('followee_id', validProfileUser.id)
      .maybeSingle()
  ])

  const isOwnProfile = currentUser.id === validProfileUser.id
  const isFollowing = !!followData

  return (
    <div className="min-h-screen">
      <Navbar user={currentUserProfile} />
      <Sidebar user={currentUserProfile} />
      
      <main className="lg:ml-64 pt-16">
        <div className="max-w-2xl mx-auto border-x border-gray-200 dark:border-gray-800 min-h-screen">
          <ProfileHeader
            user={validProfileUser}
            isOwnProfile={isOwnProfile}
            followersCount={followersCount ?? 0}
            followingCount={followingCount ?? 0}
            postsCount={posts?.length ?? 0}
            isFollowing={isFollowing}
            currentUserId={currentUser?.id}
          />

          <div className="border-t border-gray-200 dark:border-gray-800">
            <div className="border-b border-gray-200 dark:border-gray-800 p-4">
              <h2 className="text-lg font-semibold">Posts</h2>
            </div>

            {posts && posts.length > 0 ? (
              posts.map((post: any) => (
                <PostCard
                  key={post.id}
                  post={post}
                  currentUserId={currentUser.id}
                />
              ))
            ) : (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                <p>No posts yet</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
