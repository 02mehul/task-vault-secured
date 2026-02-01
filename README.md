# TaskVault (Lovable App Deployment)

This guide explains how to run the TaskVault app using the `LovableStartup` deployment infrastructure.

**Goal:** Run the full application (Frontend + Backend + Database) on your local machine.

This is the recommended way to simulate the full deployment stack.


### Install Prerequisites
Before you start, make sure you have these installed:
1.  **Docker Desktop**: Open it and make sure it is running.
2.  **Node.js (v20 or higher)**:
    *   Open your terminal and check: `node -v`
    *   If you have v18 or older, **you must upgrade** to v20+ from [nodejs.org](https://nodejs.org/).
3.  **Git Bash**: Recommended for running commands on Windows.


## Deployment Context

This project (`task-vault-secured`) is the frontend application. It is designed to be deployed as part of the **AventaLovable** deployment suite.

If you are looking at this folder as `app/` inside the AventaLovable folder, here is how the structure works:

- **`app/`**: This directory (where you are now) contains the source code for the TaskVault frontend.
- **`../docker/`**: (Part of **AventaLovable**) Contains the Docker configuration for the backend services (Supabase, Kong, etc.).
- **`../start.sh`**: (Part of **AventaLovable**) The automation script in the parent directory that orchestrates the full deployment.



## Deployment

To deploy this application, you must use the **AventaLovable** parent project scripts.

## Getting Started (Local Development)

### Step 1: Configure the Environment

1.  Open your terminal in the root `LovableStartup` folder.
2.  Go to the `docker` folder:
    ```bash
    cd docker
    ```
3.  Create the configuration file:
    ```bash
    cp .env.example .env
    ```
4.  **Important Fix:** To prevent email errors, open the new `.env` file in a text editor.
    *   Find the line: `ENABLE_EMAIL_AUTOCONFIRM=false`
    *   Change it to: `ENABLE_EMAIL_AUTOCONFIRM=true`
    *   *(This automatically verifies new users so you don't need an email server.)*
---

Step 2 - **Important:** Make sure you are inside the `app/` directory.

# If you are in the root directory:
cd app

# Install dependencies
npm install 

=======
### Step 3: Start the Backend (Docker)
Now start the database and backend services.

1.  Still in the `docker` folder, run:
    ```bash
    docker compose up -d
    ```
2.  Wait a minute for everything to start.

---


Step 3.  **Run Database Migration**:
    This creates the tables in your database. Copy and run this *exact* command:
    ```bash
    npx supabase db push --db-url "postgresql://postgres:your-super-secret-and-long-postgres-password@localhost:54322/postgres?sslmode=disable" --include-all
    ```
    *   *Note: If this fails, make sure you are in the `app/` folder and Docker is running.*

---

### Step 4: Run the App!
You are ready.

1.  Start the frontend:
    ```bash
    npm run dev
    ```
2.  Open your browser to: **[http://localhost:5173](http://localhost:5173)**

---
---

------------------------------------------------------------------------------------------------------------------------------------------------------------------

## 💻 Option 2: Run Standalone (Without LovableStartup)

If you just want to run the React frontend (e.g., for UI development), or if you already have a backend running elsewhere (like a cloud project).

### 1. Installation
Navigate to the `app` folder:
```bash
cd app
npm install
```

### 2. Configure Environment
Create a `.env.local` file inside the `app` folder with your backend details:

```env
# Example for local backend (Docker):
VITE_SUPABASE_URL=http://localhost:8000
VITE_SUPABASE_ANON_KEY=<your-anon-key-from-docker-env>

# Example for cloud backend:
# VITE_SUPABASE_URL=https://your-project.supabase.co
# VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5c...
```
*(You can find the keys in `../docker/.env` or inside your Supabase dashboard)*

### 3. Start Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

> **Note:** Standalone mode only runs the UI. Authentication and Database features require a valid backend connection via the `.env.local` variables above.

---

## 🛠️ Common Problems & Fixes

**"TLS Error" or "Connection Refused" during migration**
*   Make sure you copy the *exact* migration command in Step 4. The part `?sslmode=disable` is critical.
*   Make sure you ran `npm install` first. We configured a specific version of the Supabase tool (`v1.163.0`) in `package.json` that works best on Windows.

**"Error sending confirmation email"**
*   You missed Step 2, point 4.
*   Go to `docker/.env`, set `ENABLE_EMAIL_AUTOCONFIRM=true`, and then restart Docker (`docker compose down` then `docker compose up -d`).

**"Auth Error: Database Error Saving New User"**
*   Your database password might be out of sync.
*   Reset everything:
    1.  `docker compose down` (in `docker/` folder)
    2.  Delete the `docker/volumes/db` folder.
    3.  `docker compose up -d`
    4.  Run the migration command from Step 4 again.

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
=======
---

## 📂 Project Overview for Developers

*   **`app/`**: The Frontend (React + Vite).
*   **`docker/`**: The Backend infrastructure (Supabase, Database, Auth).
*   **`start.sh`**: A script in the root that automates Step 3.

**Tech Stack:** React 18, TypeScript, Tailwind CSS, Supabase.
