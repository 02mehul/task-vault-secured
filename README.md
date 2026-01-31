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

## Deployment Context

This project (`task-vault-secured`) is the frontend application. It is designed to be deployed as part of the **AventaLovable** deployment suite.

If you are looking at this folder as `app/` inside the AventaLovable folder, here is how the structure works:

- **`app/`**: This directory (where you are now) contains the source code for the TaskVault frontend.
- **`../docker/`**: (Part of **AventaLovable**) Contains the Docker configuration for the backend services (Supabase, Kong, etc.).
- **`../start.sh`**: (Part of **AventaLovable**) The automation script in the parent directory that orchestrates the full deployment.

## Deployment

To deploy this application, you must use the **AventaLovable** parent project scripts.

**Do not** try to deploy solely from inside this `app` directory.

1.  **Navigate to the parent directory** (`AventaLovable`).
2.  **Run the start script**:
    ```bash
    ./start.sh
    ```

The `start.sh` script will:
- Build this frontend application using the docker configuration from the parent project.
- Start the entire Supabase backend stack.
- Serve the application at `http://localhost:3000`.

## Getting Started (Local Development)

If you want to run the **frontend locally** while connecting to the Docker-hosted backend (or a cloud Supabase instance), follow these steps.

### Prerequisites

- Node.js 18+ and npm
- A running Supabase instance (either the local Docker setup or a hosted project)

### Installation

**Important:** Make sure you are inside the `app/` directory.

```bash
# If you are in the root directory:
cd app

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
```

## Authentication Flow

1. Unauthenticated users visiting `/` are redirected to `/login`
2. Users can sign up or sign in with email/password
3. After authentication, users are redirected to `/`
4. Sign up requires email confirmation (configure in Supabase Auth settings)

## Security

- **Row Level Security**: All database queries are filtered by `user_id`
- **Client-side validation**: Form inputs are validated before submission
- **Auth state**: Managed via Supabase's `onAuthStateChange` listener

## Troubleshooting

### "Error: ENOENT: no such file or directory, open 'package.json'"

**Cause:** You are likely trying to run `npm install` or `npm run dev` from the **root** directory of the repository, or even the `docker/` directory.

**Solution:**
- If you are trying to run the **frontend locally**: `cd app` first, then run your npm commands.
- If you are trying to **deploy with Docker**: Run `./start.sh` from the **root** directory. Do not run npm commands manually unless you are developing.

### "App directory is empty"

**Cause:** If you cloned this repository recursively or as a submodule, the `app/` folder might not have been initialized.

**Solution:**
```bash
git submodule update --init --recursive
```

## License

MIT
