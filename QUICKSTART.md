# Quick Start Guide

## 🚀 Get Your Social Network Running in 10 Minutes

### Step 1: Install Dependencies (1 min)

```bash
npm install
```

### Step 2: Set Up Supabase (3 mins)

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project (choose a region close to you)
3. Wait for the project to be ready (~2 minutes)

### Step 3: Configure Environment (1 min)

1. In Supabase, go to **Settings** > **API**
2. Copy your Project URL and anon/public key
3. Create `.env.local` file:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### Step 4: Set Up Database (2 mins)

1. In Supabase, go to **SQL Editor**
2. Click "New Query"
3. Copy the entire content from `supabase/schema.sql`
4. Paste and click "Run"

### Step 5: Create Storage Buckets (1 min)

1. In Supabase, go to **Storage**
2. Click "Create bucket" for each:
   - Name: `avatars`, Public: ✅
   - Name: `banners`, Public: ✅
   - Name: `post-media`, Public: ✅

### Step 6: Run the App (1 min)

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Step 7: Create Your Account

1. Click "Sign up"
2. Enter your details
3. Start posting!

## 🎉 You're Done!

Your social network is now running locally. 

### Next Steps:

- **Customize**: Edit `tailwind.config.ts` to change colors
- **Deploy**: Push to GitHub and deploy on Vercel
- **Invite Friends**: Share your deployed URL

## 💡 Common Issues

**Problem**: Can't connect to database
**Solution**: Double-check your `.env.local` file has the correct Supabase credentials

**Problem**: Storage upload fails
**Solution**: Make sure you created all three storage buckets and they're set to public

**Problem**: RLS errors when posting
**Solution**: Ensure you ran the complete `schema.sql` file in Supabase

## 📞 Need Help?

Check the main [README.md](./README.md) for detailed documentation.
