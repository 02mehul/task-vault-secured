# TaskVault

A secure task management app built with React, Vite, TypeScript, and Supabase.

## Features

- 🔐 Email/Password authentication
- ✅ Full CRUD operations for tasks
- 🔒 Row Level Security (RLS) - users only see their own tasks
- 📱 Responsive, clean UI
- ⚡ Static SPA export (deployable anywhere)

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, shadcn/ui
- **Backend**: Supabase (Auth + PostgreSQL)
- **Routing**: React Router (client-side)

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Supabase project (hosted or local)

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd taskvault

# Install dependencies
npm install
```

### Environment Variables

Create a `.env.local` file in the project root:

```env
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

#### For Hosted Supabase

1. Go to [supabase.com](https://supabase.com) and create a project
2. Find your project URL and anon key in **Settings > API**
3. Add them to `.env.local`

#### For Local Supabase (via CLI)

1. Install the [Supabase CLI](https://supabase.com/docs/guides/cli)
2. Run `supabase start` in your project directory
3. Get your local credentials from `supabase status`:
   - API URL: typically `http://127.0.0.1:54321`
   - Anon Key: shown in the status output
4. Access Supabase Studio at `http://127.0.0.1:54323`

```env
VITE_SUPABASE_URL=http://127.0.0.1:54321
VITE_SUPABASE_ANON_KEY=<your-local-anon-key>
```

### Database Setup

Run the SQL in `supabase/schema.sql` in your Supabase SQL Editor:

1. **Hosted**: Go to your project's SQL Editor in the dashboard
2. **Local**: Use Studio at `http://127.0.0.1:54323` > SQL Editor

This creates:
- `tasks` table with all required columns
- Row Level Security policies for user isolation
- Performance indexes

### Development

```bash
# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Building for Production

```bash
# Build static files to dist/
npm run build

# Preview the production build locally
npm run preview
```

The `dist/` folder contains a fully static SPA that can be deployed to any static hosting service (Vercel, Netlify, GitHub Pages, S3, etc.).

## Project Structure

```
src/
├── components/
│   ├── ui/              # shadcn/ui components
│   ├── CreateTaskForm.tsx
│   ├── TaskItem.tsx
│   └── ProtectedRoute.tsx
├── contexts/
│   └── AuthContext.tsx  # Auth state management
├── hooks/
│   └── useTasks.ts      # Task CRUD operations
├── lib/
│   ├── supabaseClient.ts # Supabase client config
│   └── utils.ts
├── pages/
│   ├── Index.tsx        # Protected home page
│   ├── Login.tsx        # Auth page
│   └── NotFound.tsx
├── types/
│   └── task.ts          # TypeScript types
├── App.tsx              # Routes & providers
└── main.tsx             # Entry point

supabase/
└── schema.sql           # Database schema + RLS policies
scripts/
└── test_signup.js       # Script to test user signup flow
test-db.js               # Simple database connection test
```

## Scripts & Utilities

The project includes helper scripts to verify backend connectivity and functionality.

### Database Connection Test
Run `node test-db.js` to verify that the application can connect to your local Supabase PostgreSQL instance.

### Signup Flow Test
Run `node scripts/test_signup.js` to verify the user signup process programmatically using the Supabase client. This script reads credentials from your `.env` file.


## Authentication Flow

1. Unauthenticated users visiting `/` are redirected to `/login`
2. Users can sign up or sign in with email/password
3. After authentication, users are redirected to `/`
4. Sign up requires email confirmation (configure in Supabase Auth settings)

## Security

- **Row Level Security**: All database queries are filtered by `user_id`
- **Client-side validation**: Form inputs are validated before submission
- **Auth state**: Managed via Supabase's `onAuthStateChange` listener

## License

MIT
