# Flick

**Flick** is a modern, feature-rich social networking platform that lets you share moments, connect with friends, and engage with a vibrant community. Built with cutting-edge technologies, it offers real-time interactions, beautiful UI/UX, and all the essentials of a complete social media experience.

A full-stack social networking application built with Next.js, TypeScript, Tailwind CSS, and Supabase.

## 🎯 Features

- **User Authentication**: Email/password authentication with Supabase Auth
- **User Profiles**: Customizable profiles with display name, bio, avatar, and banner
- **Posts**: Create text posts (up to 280 characters) with up to 4 images
- **Interactions**: Like, share, and comment on posts
- **Following System**: Follow/unfollow users and see posts from followed users
- **Realtime Updates**: See new posts and likes in real-time
- **Notifications**: Get notified of likes, comments, shares, and follows
- **Search**: Search for users and posts
- **Media Upload**: Upload images for posts and profiles using Supabase Storage
- **Dark/Light Mode**: Toggle between dark and light themes

## 🧩 Tech Stack

- **Frontend**: Next.js 14 (App Router) with TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth + Storage + Realtime)
- **Deployment**: Vercel (Frontend) + Supabase (Backend)

## 📁 Project Structure

```
flick/
├── app/
│   ├── auth/
│   │   ├── login/page.tsx
│   │   └── signup/page.tsx
│   ├── timeline/page.tsx
│   ├── profile/[username]/page.tsx
│   ├── post/[id]/page.tsx
│   ├── notifications/page.tsx
│   ├── settings/page.tsx
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── Navbar.tsx
│   ├── Sidebar.tsx
│   ├── PostComposer.tsx
│   ├── PostCard.tsx
│   ├── ProfileHeader.tsx
│   ├── NotificationList.tsx
│   └── ThemeProvider.tsx
├── lib/
│   ├── supabase/
│   │   └── client.ts
│   ├── database.types.ts
│   ├── types.ts
│   └── storage.ts
├── supabase/
│   ├── schema.sql
│   └── functions/
│       ├── toggle-like/index.ts
│       ├── toggle-follow/index.ts
│       └── create-post/index.ts
├── public/
├── .env.local.example
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- A Supabase account ([supabase.com](https://supabase.com))
- Git installed

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd flick
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Supabase

1. Create a new project on [Supabase](https://supabase.com)
2. Go to **Settings** > **API** and copy:
   - Project URL
   - Anon/Public Key

### 4. Configure Environment Variables

Create a `.env.local` file in the root directory:

```bash
cp .env.local.example .env.local
```

Update the values in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 5. Set Up the Database

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy the contents of `supabase/schema.sql`
4. Run the SQL to create all tables, policies, and functions

### 6. Set Up Storage Buckets

1. Go to **Storage** in your Supabase dashboard
2. Create three public buckets:
   - `avatars`
   - `banners`
   - `post-media`

### 7. Deploy Edge Functions (Optional)

If you want to use Edge Functions:

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link your project
supabase link --project-ref your-project-ref

# Deploy functions
supabase functions deploy toggle-like
supabase functions deploy toggle-follow
supabase functions deploy create-post
```

### 8. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🗄️ Database Schema

### Tables

- **users**: User profiles (extends Supabase Auth)
- **posts**: Text posts with optional media
- **post_media**: Images/videos attached to posts
- **follows**: Following relationships
- **likes**: Post likes
- **shares**: Post shares (retweets)
- **notifications**: User notifications

### Row Level Security (RLS)

All tables have RLS enabled with policies that:
- Allow everyone to read public data
- Only allow users to modify their own data
- Prevent unauthorized access

## 🔑 Key Features Implementation

### Authentication

Users can sign up and log in using email/password through Supabase Auth. The auth system automatically creates a user profile in the `users` table via a database trigger.

### Posts

- Create posts with text (up to 280 characters)
- Attach up to 4 images per post
- Reply to posts (threaded conversations)
- View posts in a timeline (newest first)

### Interactions

- **Like**: Click the heart icon to like/unlike posts
- **Share**: Click the retweet icon to share posts
- **Comment**: Reply to posts to start conversations

### Following

- Follow other users to see their posts in your timeline
- View follower/following counts on profiles
- Get notified when someone follows you

### Notifications

Receive real-time notifications for:
- New likes on your posts
- Comments on your posts
- Shares of your posts
- New followers

### Media Upload

Upload images for:
- Profile avatars
- Profile banners
- Post attachments (up to 4 per post)

All media is stored securely in Supabase Storage.

## 🎨 Customization

### Themes

The app supports dark and light modes. Toggle between themes using the button in the navbar.

### Styling

All styles are built with Tailwind CSS. Customize the theme in `tailwind.config.ts`:

```typescript
theme: {
  extend: {
    colors: {
      primary: {
        // Customize your primary color
      },
    },
  },
}
```

## 📦 Deployment

### Deploy Frontend to Vercel

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Import your repository
4. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Deploy!

### Supabase is Already Hosted

Your Supabase database, auth, storage, and edge functions are automatically hosted on Supabase's infrastructure.

## 🔒 Security Best Practices

1. **Row Level Security**: All tables have RLS enabled
2. **Environment Variables**: Never commit `.env.local` to Git
3. **Storage Policies**: Only authenticated users can upload; users can only delete their own files
4. **Input Validation**: Text limits enforced (280 chars for posts)
5. **Authentication**: Supabase handles secure password hashing and JWT tokens

## 🛠️ Development Tips

### Database Changes

When making database changes:
1. Update `supabase/schema.sql`
2. Run the SQL in Supabase SQL Editor
3. Regenerate types if needed

### Type Safety

The app uses TypeScript for type safety. Types are defined in:
- `lib/database.types.ts` - Database table types
- `lib/types.ts` - Extended types with relations

### Realtime Features

To enable realtime updates:
1. Use Supabase Realtime channels
2. Subscribe to table changes in your components
3. Update UI when changes occur

## 🐛 Troubleshooting

### "Cannot find module" errors

Run `npm install` to ensure all dependencies are installed.

### Database connection errors

Check that your `.env.local` file has the correct Supabase URL and Anon Key.

### Storage upload fails

Ensure you've created the storage buckets (`avatars`, `banners`, `post-media`) in Supabase.

### RLS policy errors

Make sure you've run the complete `schema.sql` file in Supabase SQL Editor.

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the MIT License.

## 🎉 Future Features

Potential enhancements:
- Direct messaging (DMs)
- User analytics dashboard
- Advanced search with filters
- Trending topics/hashtags
- User verification badges
- Post scheduling
- Video uploads
- Story/Status feature
- Bookmarks/Saved posts
- Mute/Block functionality

---

Built with ❤️ using Next.js and Supabase
