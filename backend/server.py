from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
from datetime import datetime, timezone
import os
from dotenv import load_dotenv
import hashlib
from pydantic import BaseModel
from typing import Optional, List
import secrets

load_dotenv()

app = FastAPI(title="Portfolio API")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB connection
MONGO_URL = os.environ.get("MONGO_URL", "mongodb://localhost:27017")
DB_NAME = os.environ.get("DB_NAME", "portfolio_db")
client = MongoClient(MONGO_URL)
db = client[DB_NAME]
visitors_collection = db["visitors"]
stats_collection = db["stats"]
admin_collection = db["admin"]
content_collection = db["content"]

# Admin credentials from environment
ADMIN_EMAIL = os.environ.get("ADMIN_EMAIL", "")
ADMIN_PASSWORD = os.environ.get("ADMIN_PASSWORD", "")

# Initialize stats if not exists
def init_stats():
    if stats_collection.count_documents({"type": "global"}) == 0:
        stats_collection.insert_one({
            "type": "global",
            "total_visits": 0,
            "unique_visitors": 0,
            "page_views": 0,
            "created_at": datetime.now(timezone.utc).isoformat()
        })

init_stats()

def get_visitor_hash(request: Request):
    """Generate a hash from IP and user agent for unique visitor tracking"""
    ip = request.client.host if request.client else "unknown"
    user_agent = request.headers.get("user-agent", "unknown")
    raw = f"{ip}:{user_agent}"
    return hashlib.md5(raw.encode()).hexdigest()

# Pydantic models
class LoginRequest(BaseModel):
    email: str
    password: str

class AboutUpdate(BaseModel):
    text: str
    image_url: Optional[str] = None

class EducationItem(BaseModel):
    institution: str
    degree: str
    period: str
    location: str
    courses: List[str]
    logo_url: Optional[str] = None
    website_url: Optional[str] = None

class ExperienceItem(BaseModel):
    company: str
    title: str
    period: str
    location: str
    description: List[str]
    logo_url: Optional[str] = None
    website_url: Optional[str] = None

class ProjectItem(BaseModel):
    title: str
    description: str
    link: str
    image_url: Optional[str] = None

class SkillCategory(BaseModel):
    category: str
    skills: List[str]

@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now(timezone.utc).isoformat()}

@app.post("/api/visitors/track")
async def track_visitor(request: Request):
    """Track a visitor and return updated stats"""
    visitor_hash = get_visitor_hash(request)
    now = datetime.now(timezone.utc).isoformat()
    
    existing_visitor = visitors_collection.find_one({"hash": visitor_hash})
    is_new_visitor = existing_visitor is None
    
    if is_new_visitor:
        visitors_collection.insert_one({
            "hash": visitor_hash,
            "first_visit": now,
            "last_visit": now,
            "visit_count": 1
        })
        stats_collection.update_one(
            {"type": "global"},
            {
                "$inc": {
                    "total_visits": 1,
                    "unique_visitors": 1,
                    "page_views": 1
                }
            }
        )
    else:
        visitors_collection.update_one(
            {"hash": visitor_hash},
            {
                "$set": {"last_visit": now},
                "$inc": {"visit_count": 1}
            }
        )
        stats_collection.update_one(
            {"type": "global"},
            {"$inc": {"total_visits": 1, "page_views": 1}}
        )
    
    stats = stats_collection.find_one({"type": "global"}, {"_id": 0})
    
    return {
        "success": True,
        "is_new_visitor": is_new_visitor,
        "stats": stats
    }

@app.get("/api/visitors/stats")
async def get_stats():
    """Get visitor statistics"""
    stats = stats_collection.find_one({"type": "global"}, {"_id": 0})
    if not stats:
        return {
            "total_visits": 0,
            "unique_visitors": 0,
            "page_views": 0
        }
    return stats

@app.post("/api/visitors/pageview")
async def track_pageview():
    """Track a page view"""
    stats_collection.update_one(
        {"type": "global"},
        {"$inc": {"page_views": 1}}
    )
    stats = stats_collection.find_one({"type": "global"}, {"_id": 0})
    return {"success": True, "stats": stats}

# Admin Authentication
@app.post("/api/admin/login")
async def admin_login(login: LoginRequest):
    """Admin login endpoint"""
    if login.email == ADMIN_EMAIL and login.password == ADMIN_PASSWORD:
        token = secrets.token_hex(32)
        admin_collection.update_one(
            {"type": "session"},
            {"$set": {"token": token, "created_at": datetime.now(timezone.utc).isoformat()}},
            upsert=True
        )
        return {"success": True, "token": token}
    return {"success": False, "message": "Invalid credentials"}

@app.post("/api/admin/verify")
async def verify_admin(request: Request):
    """Verify admin token"""
    auth_header = request.headers.get("Authorization", "")
    if auth_header.startswith("Bearer "):
        token = auth_header[7:]
        session = admin_collection.find_one({"type": "session", "token": token})
        if session:
            return {"valid": True}
    return {"valid": False}

# Content Management Endpoints
@app.get("/api/content/about")
async def get_about():
    """Get about section content"""
    content = content_collection.find_one({"section": "about"}, {"_id": 0})
    return content or {"text": "", "image_url": ""}

@app.post("/api/content/about")
async def update_about(about: AboutUpdate):
    """Update about section"""
    content_collection.update_one(
        {"section": "about"},
        {"$set": {"text": about.text, "image_url": about.image_url}},
        upsert=True
    )
    return {"success": True}

@app.get("/api/content/education")
async def get_education():
    """Get education items"""
    items = list(content_collection.find({"section": "education"}, {"_id": 0}).limit(50))
    return items

@app.post("/api/content/education")
async def add_education(item: EducationItem):
    """Add education item"""
    content_collection.insert_one({
        "section": "education",
        **item.dict()
    })
    return {"success": True}

@app.get("/api/content/experience")
async def get_experience():
    """Get experience items"""
    items = list(content_collection.find({"section": "experience"}, {"_id": 0}).limit(50))
    return items

@app.post("/api/content/experience")
async def add_experience(item: ExperienceItem):
    """Add experience item"""
    content_collection.insert_one({
        "section": "experience",
        **item.dict()
    })
    return {"success": True}

@app.get("/api/content/projects")
async def get_projects():
    """Get project items"""
    items = list(content_collection.find({"section": "projects"}, {"_id": 0}).limit(100))
    return items

@app.post("/api/content/projects")
async def add_project(item: ProjectItem):
    """Add project item"""
    content_collection.insert_one({
        "section": "projects",
        **item.dict()
    })
    return {"success": True}

@app.get("/api/content/skills")
async def get_skills():
    """Get skill categories"""
    items = list(content_collection.find({"section": "skills"}, {"_id": 0}).limit(50))
    return items

@app.post("/api/content/skills")
async def add_skill_category(item: SkillCategory):
    """Add skill category"""
    content_collection.insert_one({
        "section": "skills",
        **item.dict()
    })
    return {"success": True}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
