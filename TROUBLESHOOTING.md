# Troubleshooting Guide

Common issues and their solutions.

---

## Installation Issues

### ❌ `npm install` fails

**Problem**: Package installation errors

**Solutions**:
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### ❌ TypeScript errors during install

**Problem**: Type definition conflicts

**Solution**:
```bash
# Install with legacy peer deps
npm install --legacy-peer-deps
```

---

## Development Server Issues

### ❌ Port 3000 already in use

**Problem**: Another process is using port 3000

**Solutions**:
```bash
# Option 1: Kill the process
# On Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# On Mac/Linux:
lsof -ti:3000 | xargs kill -9

# Option 2: Use different port
npm run dev -- -p 3001
```

### ❌ Module not found errors

**Problem**: Import paths incorrect

**Solutions**:
1. Check `tsconfig.json` has correct path mapping
2. Verify file exists at import path
3. Restart development server
4. Clear `.next` folder: `rm -rf .next`

---

## Supabase Connection Issues

### ❌ "Invalid API Key" error

**Problem**: Environment variables not loaded

**Solutions**:
1. Check `.env.local` exists in root directory
2. Verify variable names match exactly:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Restart development server
4. Check no extra spaces in `.env.local`

**Correct format**:
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
```

### ❌ "Failed to fetch" error

**Problem**: Supabase project not accessible

**Solutions**:
1. Check Supabase project is active (not paused)
2. Verify project URL is correct
3. Check internet connection
4. Try accessing Supabase dashboard directly

---

## Database Issues

### ❌ RLS policy violation

**Problem**: Row Level Security blocking access

**Solutions**:
1. Verify you're logged in
2. Check RLS policies are created:
   ```sql
   SELECT * FROM pg_policies WHERE schemaname = 'public';
   ```
3. Re-run `schema.sql` if policies missing
4. Check user has permission for the operation

### ❌ "relation does not exist"

**Problem**: Database tables not created

**Solution**:
1. Go to Supabase SQL Editor
2. Run complete `supabase/schema.sql` file
3. Check for any error messages
4. Verify all tables created:
   ```sql
   SELECT table_name FROM information_schema.tables 
   WHERE table_schema = 'public';
   ```

### ❌ Foreign key constraint error

**Problem**: Trying to insert data with invalid references

**Solution**:
1. Ensure referenced records exist first
2. Check cascade delete policies
3. Verify user IDs match authenticated user

### ❌ Unique constraint violation

**Problem**: Duplicate values in unique columns

**Common cases**:
- Username already exists
- Already liked a post
- Already following a user

**Solution**: Check for existing record before inserting

---

## Authentication Issues

### ❌ "User not found" after signup

**Problem**: User profile not created automatically

**Solution**:
1. Check trigger function exists:
   ```sql
   SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';
   ```
2. If missing, run schema.sql
3. Try creating user again

### ❌ Session expires immediately

**Problem**: JWT configuration issue

**Solutions**:
1. Check Supabase Auth settings
2. Verify JWT secret is correct
3. Clear browser cookies and try again
4. Check system time is correct

### ❌ Can't log in after signup

**Problem**: Email confirmation required

**Solution**:
1. Check email for confirmation link
2. Or disable email confirmation in Supabase:
   - Go to Authentication > Settings
   - Disable "Enable email confirmations"

---

## Storage/Upload Issues

### ❌ Upload fails with 404

**Problem**: Storage bucket doesn't exist

**Solution**:
1. Go to Supabase Storage
2. Create buckets:
   - `avatars` (public)
   - `banners` (public)
   - `post-media` (public)
3. Verify buckets are public

### ❌ Upload succeeds but image doesn't display

**Problem**: Image domain not configured

**Solution**:
1. Add Supabase domain to `next.config.js`:
   ```javascript
   images: {
     domains: ['your-project.supabase.co'],
   }
   ```
2. Restart dev server

### ❌ "Storage policy violation"

**Problem**: Storage RLS policies not set

**Solution**:
1. Run storage policy SQL from `schema.sql`
2. Verify policies exist:
   ```sql
   SELECT * FROM storage.policies;
   ```

### ❌ File size too large

**Problem**: Exceeds upload limit

**Solution**:
1. Compress image before upload
2. Or increase limit in Supabase Storage settings
3. Default limit is 50MB

---

## Build/Deployment Issues

### ❌ Build fails with TypeScript errors

**Problem**: Type checking failed

**Solutions**:
```bash
# Run type check locally
npm run build

# Fix errors shown
# Common fixes:
# 1. Add missing type imports
# 2. Fix any type usage
# 3. Add @ts-ignore for edge cases (not recommended)
```

### ❌ Build fails on Vercel

**Problem**: Build environment issue

**Solutions**:
1. Check environment variables are set in Vercel
2. Verify Node.js version compatibility
3. Check build logs for specific errors
4. Try building locally first

### ❌ App works locally but not in production

**Problem**: Environment difference

**Solutions**:
1. Check all environment variables in Vercel
2. Verify API keys are production keys
3. Check browser console for errors
4. Review Vercel function logs

---

## UI/Display Issues

### ❌ Dark mode not working

**Problem**: Theme provider not wrapping app

**Solution**:
1. Verify `ThemeProvider` wraps app in `layout.tsx`
2. Check local storage for theme preference
3. Clear browser cache

### ❌ Images not loading

**Problem**: Multiple possible causes

**Solutions**:
1. Check browser console for errors
2. Verify image URLs are valid
3. Check Next.js Image domain configuration
4. Ensure storage bucket is public
5. Try accessing image URL directly

### ❌ Styles not applying

**Problem**: Tailwind CSS issue

**Solutions**:
```bash
# Rebuild Tailwind
rm -rf .next
npm run dev

# Verify tailwind.config.ts content paths
# Should include: "./app/**/*.{js,ts,jsx,tsx}"
```

### ❌ Icons not showing

**Problem**: Lucide React not installed

**Solution**:
```bash
npm install lucide-react
```

---

## Performance Issues

### ❌ Slow initial load

**Solutions**:
1. Optimize images (use Next.js Image)
2. Implement pagination for long lists
3. Add loading states
4. Use Suspense boundaries

### ❌ Slow database queries

**Solutions**:
1. Check indexes are created (in schema.sql)
2. Add `.limit()` to queries
3. Use `.select()` to fetch only needed columns
4. Check Supabase performance insights

### ❌ Memory issues during build

**Solution**:
```bash
# Increase Node memory
NODE_OPTIONS="--max-old-space-size=4096" npm run build
```

---

## Notification Issues

### ❌ Notifications not appearing

**Problem**: Not being created in database

**Solutions**:
1. Check notification insert logic
2. Verify no self-notifications
3. Check RLS policies allow insert
4. Look at Supabase logs

### ❌ Realtime not updating

**Problem**: Realtime not configured

**Solutions**:
1. Enable Realtime in Supabase
2. Check table replication settings
3. Verify channel subscription code
4. Check browser console for errors

---

## Edge Function Issues

### ❌ Edge function not found

**Problem**: Function not deployed

**Solution**:
```bash
# Deploy function
supabase functions deploy function-name
```

### ❌ CORS errors with edge functions

**Problem**: CORS headers missing

**Solution**:
Verify CORS headers in function:
```typescript
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}
```

---

## Data Issues

### ❌ Posts not showing

**Solutions**:
1. Check posts exist in database
2. Verify RLS policies allow read
3. Check query filters
4. Look at network tab for errors

### ❌ User profile not found

**Solutions**:
1. Verify username is correct
2. Check user exists in users table
3. Check RLS policies
4. Try direct database query

---

## Profile Issues

### ❌ "Edit Profile" button shows error

**Problem**: 404 error when clicking Edit Profile

**Solutions**:
1. Verify the route exists at `/settings/profile` or `/settings`
2. Check the navigation path in `ProfileHeader.tsx`
3. Ensure the settings page component is properly exported

**Fix**:
Update `ProfileHeader.tsx` to navigate to the correct path:
```tsx
const onEditProfile = () => {
  router.push('/settings') // or '/settings/profile'
}
```

### ❌ Profile settings not saving

**Problem**: Changes don't persist after clicking Save

**Solutions**:
1. Check browser console for errors
2. Verify user authentication
3. Check RLS policies allow updates
4. Ensure form validation passes

---

## Getting More Help

### Check Logs

**Browser Console**:
```
F12 > Console tab
```

**Network Tab**:
```
F12 > Network tab > Filter: Fetch/XHR
```

**Supabase Logs**:
```
Supabase Dashboard > Logs
```

**Vercel Logs**:
```
Vercel Dashboard > Deployments > [your-deployment] > Logs
```

### Debugging Tips

1. **Use console.log extensively**:
   ```typescript
   console.log('Debug:', { user, post, error })
   ```

2. **Check Supabase SQL Editor**:
   Run queries directly to test

3. **Use React DevTools**:
   Inspect component state

4. **Check Network requests**:
   Verify API calls are correct

5. **Validate data**:
   Ensure data format matches expectations

---

## Still Having Issues?

1. Check the [README.md](./README.md)
2. Review [API.md](./API.md) documentation
3. Check [Supabase Docs](https://supabase.com/docs)
4. Check [Next.js Docs](https://nextjs.org/docs)
5. Search for error message online
6. Check GitHub issues

---

## Prevention Tips

✅ Always check browser console for errors
✅ Verify environment variables before starting
✅ Run database migrations in order
✅ Test locally before deploying
✅ Keep dependencies updated
✅ Use TypeScript for type safety
✅ Handle errors gracefully
✅ Add loading states
✅ Validate user input
✅ Check Supabase dashboard regularly

---

**Most issues are caused by**:
1. Missing environment variables (40%)
2. Database not set up correctly (30%)
3. Storage buckets not created (15%)
4. RLS policies missing (10%)
5. Other (5%)

Always start by checking these first!
