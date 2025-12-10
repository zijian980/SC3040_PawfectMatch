# Backend

This is the backend of the SC3040 project.

## ⚙️ Setup

1. Setup python virtual environment

   ```bash
   python -m venv venv

   # Mac/Linux
   source ./venv/bin/activate

   # Windows
   .\venv\Scripts\activate
   ```

1. Install dependencies

   ```bash
   pip install -r requirements-runtime.txt
   pip install -r requirements-dev.txt
   ```

1. Ensure local PostgreSQL instance is running

   - Use the provided Docker Compose file to run PostgreSQL in a container

     ```bash
     docker compose up -d
     ```

   - Or, Install PostgreSQL locally on your machine.

1. Create .env file under /app with the following values

   ```env
   APP_NAME=
   FRONTEND_SCHEME=
   FRONTEND_HOST=
   FRONTEND_PORT=
   database_hostname=
   database_port=
   database_password=
   database_name=
   database_username=
   GOOGLE_CLIENT_ID=
   GOOGLE_CLIENT_SECRET=
   ```

1. Setup database

   ```bash
   # Create Database + Run Migrations + Insert Mock Data
   make setup
   ```

   - Create Database

     ```bash
     make create_db
     # OR
     python app/database/scripts/create_db.py
     ```

   - Run Migrations

     ```bash
     make migrate
     # OR
     alembic upgrade head
     ```

   - Insert Mock Data

     ```bash
     make mock_data
     # OR
     python app/database/scripts/mock_data.py
     ```

1. Run development server

   ```bash
   uvicorn app.main:app --host 0.0.0.0 --port 8000
   ```
