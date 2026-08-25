from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import resume
from app.routers import user
from app.database.database import engine, Base
from app.models.user import User
from app.models.resume import Resume
from app.routers import ats

# Create all database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="CareerPilot AI API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
        "http://localhost:3000",
        "http://127.0.0.1:3000"
    ],
    allow_origin_regex=r"^https?://(localhost|127\.0\.0\.1)(:\d+)?$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(user.router, prefix="/api/users", tags=["Users"])

app.include_router(
    resume.router,
    prefix="/api/resume",
    tags=["Resume"]
)
app.include_router(
    ats.router,
    prefix="/api/ats",
    tags=["ATS"]
)
@app.get("/")
def home():
    return {
        "message": "Welcome to CareerPilot AI Backend!"
    }