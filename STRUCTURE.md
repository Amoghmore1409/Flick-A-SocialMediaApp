# Project Structure

Complete folder and file organization for the social networking app.

```
Twitter/
│
├── 📁 app/                          # Next.js App Router
│   ├── 📁 auth/                     # Authentication pages
│   │   ├── 📁 login/
│   │   │   └── page.tsx             # Login page
│   │   └── 📁 signup/
│   │       └── page.tsx             # Signup page
│   │
│   ├── 📁 timeline/                 # Main feed
│   │   └── page.tsx                 # Timeline page
│   │
│   ├── 📁 profile/                  # User profiles
│   │   └── 📁 [username]/
│   │       └── page.tsx             # Dynamic profile page
│   │
│   ├── 📁 post/                     # Individual posts
│   │   └── 📁 [id]/
│   │       └── page.tsx             # Post detail page
│   │
│   ├── 📁 notifications/            # Notifications
│   │   └── page.tsx                 # Notifications page
│   │
│   ├── 📁 settings/                 # User settings
│   │   └── page.tsx                 # Settings page
│   │
│   ├── layout.tsx                   # Root layout
│   ├── page.tsx                     # Home redirect
│   └── globals.css                  # Global styles
│
├── 📁 components/                   # Reusable components
│   ├── Navbar.tsx                   # Top navigation bar
│   ├── Sidebar.tsx                  # Side navigation
│   ├── PostComposer.tsx             # Create post form
│   ├── PostCard.tsx                 # Post display card
│   ├── ProfileHeader.tsx            # Profile info display
│   ├── NotificationList.tsx         # Notifications list
│   └── ThemeProvider.tsx            # Dark/light mode
│
├── 📁 lib/                          # Utilities & helpers
│   ├── 📁 supabase/
│   │   └── client.ts                # Supabase client setup
│   ├── database.types.ts            # Generated DB types
│   ├── types.ts                     # Custom types
│   └── storage.ts                   # Storage helpers
│
├── 📁 supabase/                     # Supabase config
│   ├── 📁 functions/                # Edge functions
│   │   ├── 📁 toggle-like/
│   │   │   └── index.ts             # Like/unlike function
│   │   ├── 📁 toggle-follow/
│   │   │   └── index.ts             # Follow/unfollow function
│   │   └── 📁 create-post/
│   │       └── index.ts             # Create post function
│   │
│   ├── schema.sql                   # Database schema
│   ├── helpers.sql                  # Helper functions
│   └── seed.sql                     # Sample data
│
├── 📁 public/                       # Static assets
│   └── (images, fonts, etc.)
│
├── 📄 Configuration Files
├── .env.local.example               # Environment template
├── .gitignore                       # Git ignore rules
├── next.config.js                   # Next.js config
├── tailwind.config.ts               # Tailwind config
├── tsconfig.json                    # TypeScript config
├── postcss.config.js                # PostCSS config
├── package.json                     # Dependencies
└── package-lock.json                # Locked dependencies
│
└── 📄 Documentation Files
    ├── README.md                    # Main documentation
    ├── QUICKSTART.md                # Quick setup guide
    ├── DEPLOYMENT.md                # Deploy instructions
    ├── API.md                       # API documentation
    ├── FEATURES.md                  # Feature checklist
    ├── TROUBLESHOOTING.md           # Common issues
    ├── PROJECT_SUMMARY.md           # Overview
    └── STRUCTURE.md                 # This file
```

---

## 📂 Detailed Breakdown

### `/app` Directory (Next.js 14 App Router)

The main application pages using Next.js App Router.

**Key Concepts**:
- Each folder with `page.tsx` becomes a route
- `layout.tsx` wraps all child pages
- Server components by default (use `'use client'` for client components)
- Dynamic routes use `[parameter]` syntax

**Routes Map**:
```
/                          → app/page.tsx
/auth/login                → app/auth/login/page.tsx
/auth/signup               → app/auth/signup/page.tsx
/timeline                  → app/timeline/page.tsx
/profile/johndoe           → app/profile/[username]/page.tsx
/post/abc-123              → app/post/[id]/page.tsx
/notifications             → app/notifications/page.tsx
/settings                  → app/settings/page.tsx
```

### `/components` Directory

Reusable React components used across pages.

**Component Hierarchy**:
```
Layout Components:
  └── Navbar (always visible)
  └── Sidebar (desktop only)

Content Components:
  └── PostComposer (create posts)
  └── PostCard (display posts)
  └── ProfileHeader (user info)
  └── NotificationList (notifications)

Context Providers:
  └── ThemeProvider (dark/light mode)
```

### `/lib` Directory

Shared utilities, helpers, and configurations.

**Structure**:
```
lib/
├── supabase/
│   └── client.ts          # Supabase connection
├── database.types.ts      # Auto-generated types
├── types.ts               # Custom TypeScript types
└── storage.ts             # Image upload helpers
```

### `/supabase` Directory

Backend configuration and database setup.

**Files**:
- `schema.sql`: Complete database setup
- `helpers.sql`: Useful queries and views
- `seed.sql`: Test data
- `functions/`: Edge Functions (serverless)

---

## 🗂️ File Types Explained

### `.tsx` Files (TypeScript + JSX)
React components and pages with TypeScript.

**Example**:
```typescript
// app/timeline/page.tsx
export default function TimelinePage() {
  return <div>Timeline</div>
}
```

### `.ts` Files (TypeScript)
Utility functions and type definitions.

**Example**:
```typescript
// lib/types.ts
export type User = {
  id: string
  username: string
}
```

### `.sql` Files
Database queries and schema definitions.

**Example**:
```sql
-- supabase/schema.sql
CREATE TABLE posts (
  id UUID PRIMARY KEY,
  text TEXT NOT NULL
);
```

### `.css` Files
Stylesheets (using Tailwind CSS).

**Example**:
```css
/* app/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### `.md` Files
Markdown documentation.

---

## 📊 Import Paths

Using TypeScript path aliases (defined in `tsconfig.json`):

```typescript
// Instead of:
import { Navbar } from '../../components/Navbar'

// Use:
import { Navbar } from '@/components/Navbar'
```

**Available aliases**:
- `@/*` → Root directory

---

## 🔄 Data Flow

### Creating a Post

```
User Input (PostComposer.tsx)
    ↓
Upload Images (storage.ts)
    ↓
Insert Post (Supabase client)
    ↓
Database (posts table)
    ↓
Update UI (React state)
    ↓
Display (PostCard.tsx)
```

### Authentication Flow

```
Login Page (auth/login/page.tsx)
    ↓
Supabase Auth (client.ts)
    ↓
Create Session
    ↓
Redirect to Timeline
    ↓
Fetch User Data
    ↓
Display Navbar with user info
```

---

## 🎨 Styling Architecture

### Tailwind CSS Classes

**Utility Classes**:
```typescript
<div className="bg-white dark:bg-gray-900 p-4 rounded-lg">
```

**Custom Classes** (in globals.css):
```css
.btn-primary {
  @apply bg-primary-500 text-white px-4 py-2 rounded-full;
}
```

**Theme Colors**:
- `primary-*`: Main brand color
- `gray-*`: Neutral colors
- `red-*`, `green-*`, etc.: Semantic colors

---

## 🔐 Security Layers

### Database (RLS)
```sql
-- Only users can modify their own posts
CREATE POLICY "Users can update their own posts"
ON posts FOR UPDATE
USING (auth.uid() = user_id);
```

### Storage (Policies)
```sql
-- Only authenticated users can upload
CREATE POLICY "Users can upload files"
ON storage.objects FOR INSERT
WITH CHECK (auth.role() = 'authenticated');
```

### Frontend (Auth Check)
```typescript
// Redirect if not logged in
if (!user) {
  redirect('/auth/login')
}
```

---

## 📝 Naming Conventions

### Files
- **Pages**: `page.tsx`
- **Components**: `PascalCase.tsx` (e.g., `PostCard.tsx`)
- **Utilities**: `camelCase.ts` (e.g., `storage.ts`)
- **Types**: `camelCase.types.ts`

### Variables
- **Components**: `PascalCase`
- **Functions**: `camelCase`
- **Constants**: `UPPER_SNAKE_CASE`
- **Types**: `PascalCase`

### Database
- **Tables**: `lowercase` (e.g., `posts`)
- **Columns**: `snake_case` (e.g., `user_id`)
- **Functions**: `snake_case` (e.g., `get_user_feed`)

---

## 🔧 Configuration Files

### `package.json`
- Defines dependencies
- Defines npm scripts
- Project metadata

### `next.config.js`
- Next.js configuration
- Image domains
- Build settings

### `tailwind.config.ts`
- Tailwind CSS customization
- Theme colors
- Responsive breakpoints

### `tsconfig.json`
- TypeScript settings
- Path aliases
- Compiler options

---

## 📦 Dependencies Overview

### Core
- `next`: React framework
- `react`: UI library
- `typescript`: Type safety

### Supabase
- `@supabase/supabase-js`: Database client
- `@supabase/auth-helpers-nextjs`: Auth helpers

### UI
- `tailwindcss`: Styling
- `lucide-react`: Icons
- `date-fns`: Date formatting

---

## 🚀 Build Process

### Development
```bash
npm run dev
```
- Starts dev server
- Hot reload enabled
- Source maps available

### Production Build
```bash
npm run build
```
1. TypeScript compilation
2. Bundle optimization
3. Image optimization
4. Static page generation

### Deployment
```bash
npm run start
```
- Serves production build
- Optimized for performance

---

## 📚 Related Files

Different file types work together:

**Example: Creating a Post**

1. **UI Component**: `components/PostComposer.tsx`
2. **Database Query**: Uses `lib/supabase/client.ts`
3. **Storage Upload**: Uses `lib/storage.ts`
4. **Database Table**: Defined in `supabase/schema.sql`
5. **Types**: Defined in `lib/types.ts`
6. **Page Display**: `app/timeline/page.tsx`

---

## 💡 Tips for Navigation

**Finding Things**:
- Pages: Look in `/app`
- Components: Look in `/components`
- Database: Look in `/supabase`
- Utilities: Look in `/lib`
- Documentation: Root directory `.md` files

**Following Imports**:
- Use VS Code "Go to Definition" (F12)
- Use "Find All References" (Shift+F12)
- Search with Ctrl+P for files

---

This structure follows Next.js 14 App Router best practices and is designed for scalability and maintainability.
