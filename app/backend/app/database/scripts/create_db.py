import os
import sys
import psycopg2
from psycopg2 import sql

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..")))

from app.config import get_settings

settings = get_settings()

db_name = settings.database_name
db_host = settings.database_hostname
db_port = settings.database_port
db_user = settings.database_username.get_secret_value()
db_password = settings.database_password.get_secret_value()

try:
    conn = psycopg2.connect(dbname="postgres", user=db_user, password=db_password, host=db_host, port=db_port)
    conn.autocommit = True 
    cursor = conn.cursor()

    cursor.execute("SELECT 1 FROM pg_catalog.pg_database WHERE datname = %s", [db_name])
    exists = cursor.fetchone()

    if not exists:
        print(f"Database '{db_name}' does not exist.")
        print('Creating databae...')
        
        cursor.execute(sql.SQL("CREATE DATABASE {}").format(sql.Identifier(db_name)))
        print(f"Database '{db_name}' created successfully.")
    else:
        print(f"Database '{db_name}' already exists.")

except Exception as e:
    print(f"Error: {e}")
finally:
    if conn:
        cursor.close()
        conn.close()
