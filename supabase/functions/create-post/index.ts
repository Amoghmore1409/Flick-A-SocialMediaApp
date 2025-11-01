import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    const {
      data: { user },
    } = await supabaseClient.auth.getUser()

    if (!user) {
      throw new Error('Not authenticated')
    }

    const { text, reply_to, media_urls } = await req.json()

    if (!text || text.length > 280) {
      throw new Error('Post text is required and must be 280 characters or less')
    }

    // Create post
    const { data: post, error: postError } = await supabaseClient
      .from('posts')
      .insert({
        user_id: user.id,
        text,
        reply_to: reply_to || null,
      })
      .select()
      .single()

    if (postError) throw postError

    // Add media if provided
    if (media_urls && media_urls.length > 0) {
      const mediaRecords = media_urls.map((url: string) => ({
        post_id: post.id,
        url,
        type: 'image',
      }))

      await supabaseClient.from('post_media').insert(mediaRecords)
    }

    // Create notification if replying
    if (reply_to) {
      const { data: parentPost } = await supabaseClient
        .from('posts')
        .select('user_id')
        .eq('id', reply_to)
        .single()

      if (parentPost && parentPost.user_id !== user.id) {
        await supabaseClient.from('notifications').insert({
          user_id: parentPost.user_id,
          actor_id: user.id,
          type: 'comment',
          post_id: post.id,
        })
      }
    }

    return new Response(JSON.stringify({ post }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
