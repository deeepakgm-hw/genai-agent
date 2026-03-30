from fastapi import FastAPI
from agent import career_agent

app = FastAPI()

@app.get("/")
def home():
    return {"message": "AI Career Agent Running 🚀"}

@app.get("/ask")
def ask(q: str):
    return {"response": career_agent(q)}
