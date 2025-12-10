# Frontend

This is the frontend of the SC3040 project.
It is a React + TypeScript application.

## ⚙️ Setup

1. Install dependences

   ```bash
   npm install
   ```

1. Add `.env` file

   ```
   VITE_API_URL=http://localhost:8000
   ```

1. Run development server

   ```bash
   npm run dev
   ```

## 📂 Project Structure

```bash
frontend/
 ┣ public/               # Static assets
 ┣ src/
 ┃ ┣ api/                # API client
 ┃ ┣ app/                # Router, app-level providers
 ┃ ┣ components/         # Reusable UI components
 ┃ ┣ pages/              # UI pages
 ┃ ┗ main.tsx            # App entry point
 ┣ .eslintrc.js          # ESLint config
 ┣ .prettierrc           # Prettier config
 ┣ tsconfig.json         # TypeScript config
 ┣ vite.config.ts        # Vite config
 ┗ package.json
```

## 🧹 Code Quality

**Linting:** Analyze the code for potential errors and bad practices

```bash
npm run lint
```

**Formatting:** Automatically format the code according to the project’s style guide

```bash
npm run format
```
