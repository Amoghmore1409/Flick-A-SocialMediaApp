# 🚀 START HERE

Welcome! This guide will get you up and running in **10 minutes**.

---

## Step-by-Step Setup

### ⏱️ Step 1: Install Node Packages (1 minute)

Open PowerShell in this directory and run:

```powershell
npm install
```

Wait for installation to complete (~1 minute).

---

### ⏱️ Step 2: Create Supabase Account (2 minutes)

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign up with GitHub (fastest)
4. Create a new organization
5. Create a new project:
   - Name: `my-social-network`
   - Database Password: (choose a strong password)
   - Region: (choose closest to you)
6. Click "Create new project"
7. Wait 1-2 minutes for setup

---

### ⏱️ Step 3: Get Your API Keys (1 minute)

1. In Supabase dashboard, click **Settings** (gear icon)
2. Click **API** in sidebar
3. Copy these two values:
   - **Project URL** (starts with `https://`)
   - **anon public** key (long string starting with `eyJ`)

---

### ⏱️ Step 4: Configure Environment (1 minute)

1. Copy `.env.local.example` to `.env.local`:

```powershell
Copy-Item .env.local.example .env.local
```

2. Open `.env.local` in VS Code
3. Paste your values:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...your-key-here
```

4. Save the file (Ctrl+S)

---

### ⏱️ Step 5: Set Up Database (2 minutes)

1. In Supabase, click **SQL Editor** (left sidebar)
2. Click **+ New query**
3. Open `supabase/schema.sql` in VS Code
4. Copy EVERYTHING (Ctrl+A, Ctrl+C)
5. Paste into Supabase SQL Editor (Ctrl+V)
6. Click **Run** (or press F5)
7. Wait ~10 seconds
8. You should see "Success. No rows returned"

---

### ⏱️ Step 6: Create Storage Buckets (2 minutes)

1. In Supabase, click **Storage** (left sidebar)
2. Click **Create a new bucket**
3. Create bucket named `avatars`
   - Make sure "Public bucket" is **checked** ✅
   - Click "Create bucket"
4. Repeat for `banners` (public)
5. Repeat for `post-media` (public)

You should now have 3 buckets.

---

### ⏱️ Step 7: Start the App (1 minute)

Back in PowerShell:

```powershell
npm run dev
```

Wait for:
```
✓ Ready in 2.5s
○ Local:   http://localhost:3000
```

---

### 🎉 Step 8: Use Your Social Network!

1. Open browser to http://localhost:3000
2. Click "Sign up"
3. Fill in details:
   - Display Name: Your Name
   - Username: yourname (no spaces)
   - Email: your@email.com
   - Password: (at least 6 characters)
4. Click "Sign Up"
5. You're in! 🎊

---

## ✅ Quick Test

Try these to make sure everything works:

1. **Create a post**:
   - Type "Hello world!"
   - Click "Post"
   - See it appear below

2. **Upload an image**:
   - Click the image icon
   - Select a photo
   - Click "Post"
   - See post with image

3. **Toggle dark mode**:
   - Click the moon/sun icon in navbar
   - See theme switch

4. **Visit your profile**:
   - Click "Profile" in navbar
   - See your profile page

5. **Edit your profile**:
   - Click "Settings"
   - Change your display name
   - Click "Save Changes"

---

## 🎯 What Now?

### Customize Your App

**Change Colors** (5 minutes):
1. Open `tailwind.config.ts`
2. Find `colors: { primary: {`
3. Change the color values
4. Save and reload

**Change App Name** (2 minutes):
1. Open `components/Navbar.tsx`
2. Find `SocialNet`
3. Replace with your name
4. Save

### Learn the Code

Start with these files:
1. `app/timeline/page.tsx` - Main feed
2. `components/PostCard.tsx` - How posts display
3. `supabase/schema.sql` - Database structure

### Deploy to Internet

When ready, follow [DEPLOYMENT.md](./DEPLOYMENT.md) to put it online!

---

## ❌ Problems?

### "npm install" fails
```powershell
npm cache clean --force
Remove-Item -Recurse -Force node_modules
npm install
```

### Can't connect to database
- Check `.env.local` has correct values
- Verify no extra spaces
- Restart dev server: Ctrl+C, then `npm run dev`

### Storage upload fails
- Make sure you created all 3 buckets
- Verify buckets are set to PUBLIC
- Check bucket names are exactly: `avatars`, `banners`, `post-media`

### More help?
See [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)

---

## 📚 Documentation Guide

Read these in order:

1. **START_HERE.md** ← You are here
2. **QUICKSTART.md** - Detailed setup
3. **README.md** - Feature overview
4. **STRUCTURE.md** - Code organization
5. **API.md** - How to use the API
6. **DEPLOYMENT.md** - Go to production
7. **TROUBLESHOOTING.md** - Fix issues

---

## 💡 Quick Tips

**Save Time**:
- Use Ctrl+` to open terminal in VS Code
- Use Ctrl+P to quickly open files
- Use F12 on imports to jump to definition

**Best Practices**:
- Always check browser console (F12)
- Read error messages carefully
- Save files before testing changes

**Learning**:
- Read inline code comments
- Check the documentation files
- Experiment and break things!

---

## 🎓 Next Steps

### Beginner
- [ ] Create your first post
- [ ] Upload a profile picture
- [ ] Follow yourself from another account
- [ ] Try dark mode

### Intermediate
- [ ] Change the color scheme
- [ ] Modify the post character limit
- [ ] Add a new field to user profiles
- [ ] Customize the UI

### Advanced
- [ ] Add a search feature
- [ ] Implement direct messaging
- [ ] Add hashtag support
- [ ] Deploy to production

---

## 🚀 Ready to Launch?

Once everything works locally:

1. Push code to GitHub
2. Connect to Vercel
3. Add environment variables
4. Deploy!

Full instructions: [DEPLOYMENT.md](./DEPLOYMENT.md)

---

## 🎉 Success!

If you made it here, you now have:
- ✅ Working social network
- ✅ Posts with images
- ✅ User profiles
- ✅ Likes and shares
- ✅ Notifications
- ✅ Dark mode

**Time taken: ~10 minutes**

---

## 🆘 Need Help?

1. Check [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
2. Read error messages in:
   - Browser console (F12)
   - PowerShell terminal
   - VS Code Problems tab
3. Search error message online
4. Check Supabase dashboard logs

---

## 📞 Resources

- **Supabase Docs**: https://supabase.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Tailwind Docs**: https://tailwindcss.com/docs

---

**Congratulations! You're now running a social network!** 🎊

Ready to build something amazing? Happy coding! 💻✨

---

**Pro Tip**: Bookmark this file - you'll reference it often as you learn!
