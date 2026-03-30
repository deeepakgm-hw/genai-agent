from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from agent import career_agent

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "AI Career Agent Running 🚀"}

@app.get("/ask")
def ask(q: str):
    return {"response": career_agent(q)}
