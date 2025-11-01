# Deployment Guide

## 🚀 Deploy to Production

### Prerequisites
- GitHub account
- Vercel account (free)
- Supabase project already set up

---

## Part 1: Deploy Frontend to Vercel

### Step 1: Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

### Step 2: Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) and log in with GitHub
2. Click "Add New Project"
3. Import your repository
4. Configure your project:
   - **Framework Preset**: Next.js
   - **Root Directory**: ./
   - **Build Command**: `npm run build`
   - **Output Directory**: .next

### Step 3: Add Environment Variables

In Vercel project settings, add:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### Step 4: Deploy

Click "Deploy" and wait for the build to complete (~2-3 minutes)

### Step 5: Update Image Domains

In `next.config.js`, update the domains array with your Supabase project URL:

```javascript
images: {
  domains: ['your-project.supabase.co'],
}
```

Commit and push to trigger a new deployment.

---

## Part 2: Configure Supabase for Production

### Step 1: Update CORS Settings

If using Edge Functions, configure CORS in Supabase:

1. Go to **Settings** > **API**
2. Add your Vercel domain to allowed origins

### Step 2: Set Up Custom Domain (Optional)

In Vercel:
1. Go to **Settings** > **Domains**
2. Add your custom domain
3. Follow DNS configuration instructions

### Step 3: Enable Realtime (Optional)

In Supabase:
1. Go to **Database** > **Replication**
2. Enable replication for tables you want real-time updates on:
   - posts
   - likes
   - notifications

---

## Part 3: Production Checklist

### Security
- ✅ All RLS policies are in place
- ✅ Storage policies are configured
- ✅ Environment variables are set
- ✅ HTTPS is enabled (automatic with Vercel)

### Performance
- ✅ Database indexes are created (done in schema.sql)
- ✅ Images are optimized (use Next.js Image component)
- ✅ Proper caching headers

### Monitoring
- ✅ Set up Vercel Analytics (optional)
- ✅ Monitor Supabase metrics
- ✅ Set up error tracking (Sentry, LogRocket, etc.)

---

## Part 4: Post-Deployment

### Test Everything

1. **Authentication**
   - Sign up new user
   - Log in
   - Log out

2. **Posts**
   - Create text post
   - Create post with images
   - Reply to post
   - Delete post

3. **Interactions**
   - Like/unlike posts
   - Share posts
   - Follow/unfollow users

4. **Notifications**
   - Verify notifications are created
   - Mark as read

5. **Profile**
   - Update profile info
   - Upload avatar
   - Upload banner

### Monitor Performance

Check Vercel Analytics for:
- Page load times
- Core Web Vitals
- Visitor stats

Check Supabase Dashboard for:
- Database performance
- Storage usage
- API usage

---

## Troubleshooting

### Build Fails on Vercel

**Error**: "Module not found"
- Run `npm install` locally and commit `package-lock.json`

**Error**: "TypeScript errors"
- Fix all TypeScript errors locally first
- Run `npm run build` to verify

### Database Connection Issues

- Verify environment variables are correct
- Check Supabase project is active
- Ensure RLS policies are set up

### Images Not Loading

- Check storage buckets are public
- Verify storage policies
- Add Supabase domain to Next.js image config

### Slow Performance

- Add database indexes for frequently queried columns
- Enable database connection pooling in Supabase
- Use Next.js Image optimization
- Implement pagination for long lists

---

## Scaling Tips

### When you grow...

1. **Database**
   - Upgrade Supabase plan for more connections
   - Add database indexes
   - Use database functions for complex queries

2. **Storage**
   - Implement CDN for media files
   - Add image compression
   - Set up automatic image resizing

3. **Hosting**
   - Upgrade Vercel plan if needed
   - Consider edge functions for better performance
   - Enable ISR (Incremental Static Regeneration)

4. **Monitoring**
   - Set up proper logging
   - Add performance monitoring
   - Track user behavior

---

## Cost Estimates

### Free Tier (Suitable for development/small projects)

- **Vercel**: Free (Hobby)
  - Unlimited deployments
  - 100 GB bandwidth/month
  
- **Supabase**: Free
  - 500 MB database
  - 1 GB storage
  - 2 GB bandwidth

### Paid Plans (For production)

- **Vercel Pro**: $20/month
  - 1 TB bandwidth
  - Better performance
  
- **Supabase Pro**: $25/month
  - 8 GB database
  - 100 GB storage
  - 250 GB bandwidth

---

## Support

If you encounter issues:
1. Check [Vercel Documentation](https://vercel.com/docs)
2. Check [Supabase Documentation](https://supabase.com/docs)
3. Review error logs in both platforms
4. Open an issue on GitHub

---

**Congratulations!** 🎉 Your social network is now live!
