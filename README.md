# SiteTrack

SiteTrack is a web-based application for managing construction tools, equipment assignments, inspections, damage reports, maintenance, alerts, and jobsites.

The application uses:

- React and TypeScript for the frontend (will be hosted later)
- Node.js and Express for the backend (Will be hosted later)
- PostgreSQL hosted with Neon for the database
- GitHub for source control

## Getting Started

These instructions are for setting up SiteTrack on a new computer.

### 1. Install the Required Programs

Install:

- Visual Studio Code
- Git
- Node.js

You do not need to install PostgreSQL because SiteTrack uses a hosted Neon PostgreSQL database.

### 2. Clone the Repository

Open a terminal and run:

```bash
git clone https://github.com/Jacob-Michael-Morris/sitetrack.git
```

Then enter the project folder:

```bash
cd sitetrack
```

### 3. Install the Backend

Enter the server folder:

```bash
cd server
```

Install the required packages:

```bash
npm install
```

### 4. Configure the Backend

Inside the `server` folder, create a file named:

```text
.env
```

Use `server/.env.example` as a guide.

The required environment values will be provided privately and not uploaded here.

Do not upload or commit the `.env` file to GitHub.
-it should be part of your .gitignore

### 5. Start the Backend

From the `server` folder, run:

```bash
npm run dev
```

Leave this terminal open.

The API normally runs at:

```text
http://localhost:3000
```

### 6. Install the Frontend

Open a second terminal.

From the SiteTrack project folder, enter the client folder:

```bash
cd client
```

Install the required packages:

```bash
npm install
```

### 7. Start the Frontend

Run:

```bash
npm run dev
```

Leave this terminal open.

Open the address displayed by Vite. It will normally be:

```text
http://localhost:5173
```

### 8. Log In

Use the SiteTrack account I provided to you.


---

# Development Workflow

Do not make changes directly on the `main` branch.

The project uses:

```text
main
  ↑
develop
  ↑
feature branches
```

## If you would like to make changes before starting do the following!

Switch to `develop`:

```bash
git checkout develop
```

Download the latest changes:

```bash
git pull
```

Create your own branch:

```bash
git checkout -b feature/name-of-work
```

Example:

```bash
git checkout -b feature/testing-fixes
```

## Save Your Work to GitHub

When finished:

```bash
git add .
git commit -m "Describe what was changed"
git push -u origin feature/name-of-work
```

Then create a Pull Request on GitHub to merge the feature branch into `develop`.

-If you are unsure about a merge, do not merge it into `main`!

---

# Project Structure


sitetrack/
├── client/                 React frontend
├── server/                 Node.js / Express backend
│   └── src/
│       ├── controllers/
│       ├── database/
│       ├── middleware/
│       ├── models/
│       ├── routes/
│       ├── scripts/
│       └── services/
├── docs/                   Project documentation
└── README.md


The backend generally follows this structure:


Route
  ↓
Controller
  ↓
Service
  ↓
Domain Model
  ↓
PostgreSQL


SiteTrack uses object-oriented classes for its major business areas, including tools, jobsites, users, assignments, inspections, damage reports, work orders, alerts, and audit logging.

---

# Important

Never commit any of the following to GitHub:

- Database passwords
- Neon connection strings
- JWT secrets
- Account passwords
- `.env` files