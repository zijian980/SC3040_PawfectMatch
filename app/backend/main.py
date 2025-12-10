import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List

class User(BaseModel):
    name: str

class Users(BaseModel):
    users: List[User]
    
app = FastAPI(debug=True)

origins = [ "http://localhost:3000" ]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

memory_db = {"users": []}

@app.get("/users", response_model=Users)
def get_users():
    return Users(users=memory_db["users"])

@app.post("/user")
def add_user(user: User):
    memory_db["users"].append(user)
    return user
    

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)