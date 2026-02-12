from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
from bson import ObjectId
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

def serialize_doc(doc):
    """Convert MongoDB document to JSON-serializable dict"""
    if doc is None:
        return None
    doc = dict(doc)
    if "_id" in doc:
        doc["id"] = str(doc["_id"])
        del doc["_id"]
    return doc

# Pydantic models
class LoginRequest(BaseModel):
    email: str
    password: str

class AboutUpdate(BaseModel):
    text: str
    image_url: Optional[str] = None

class EducationItem(BaseModel):
    id: Optional[str] = None
    institution: str
    degree: str
    period: str
    location: str
    courses: str  # Comma separated
    logo_url: Optional[str] = None
    website_url: Optional[str] = None

class ExperienceItem(BaseModel):
    id: Optional[str] = None
    company: str
    title: str
    period: str
    location: str
    description: str  # Newline separated bullet points
    logo_url: Optional[str] = None
    website_url: Optional[str] = None

class ProjectItem(BaseModel):
    id: Optional[str] = None
    title: str
    description: str
    link: str
    image_url: Optional[str] = None

class SkillCategory(BaseModel):
    id: Optional[str] = None
    category: str
    skills: str  # Comma or newline separated

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

# ============ ABOUT SECTION ============
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
        {"$set": {"section": "about", "text": about.text, "image_url": about.image_url}},
        upsert=True
    )
    return {"success": True}

# ============ EDUCATION SECTION ============
@app.get("/api/content/education")
async def get_education():
    """Get education items"""
    items = list(content_collection.find({"section": "education"}).limit(50))
    return [serialize_doc(item) for item in items]

@app.post("/api/content/education")
async def save_education(item: EducationItem):
    """Add or update education item"""
    data = {
        "section": "education",
        "institution": item.institution,
        "degree": item.degree,
        "period": item.period,
        "location": item.location,
        "courses": item.courses,
        "logo_url": item.logo_url or "",
        "website_url": item.website_url or ""
    }
    
    if item.id:
        content_collection.update_one(
            {"_id": ObjectId(item.id)},
            {"$set": data}
        )
        return {"success": True, "id": item.id}
    else:
        result = content_collection.insert_one(data)
        return {"success": True, "id": str(result.inserted_id)}

@app.delete("/api/content/education/{item_id}")
async def delete_education(item_id: str):
    """Delete education item"""
    content_collection.delete_one({"_id": ObjectId(item_id)})
    return {"success": True}

# ============ EXPERIENCE SECTION ============
@app.get("/api/content/experience")
async def get_experience():
    """Get experience items"""
    items = list(content_collection.find({"section": "experience"}).limit(50))
    return [serialize_doc(item) for item in items]

@app.post("/api/content/experience")
async def save_experience(item: ExperienceItem):
    """Add or update experience item"""
    data = {
        "section": "experience",
        "company": item.company,
        "title": item.title,
        "period": item.period,
        "location": item.location,
        "description": item.description,
        "logo_url": item.logo_url or "",
        "website_url": item.website_url or ""
    }
    
    if item.id:
        content_collection.update_one(
            {"_id": ObjectId(item.id)},
            {"$set": data}
        )
        return {"success": True, "id": item.id}
    else:
        result = content_collection.insert_one(data)
        return {"success": True, "id": str(result.inserted_id)}

@app.delete("/api/content/experience/{item_id}")
async def delete_experience(item_id: str):
    """Delete experience item"""
    content_collection.delete_one({"_id": ObjectId(item_id)})
    return {"success": True}

# ============ PROJECTS SECTION ============
@app.get("/api/content/projects")
async def get_projects():
    """Get project items"""
    items = list(content_collection.find({"section": "projects"}).limit(100))
    return [serialize_doc(item) for item in items]

@app.post("/api/content/projects")
async def save_project(item: ProjectItem):
    """Add or update project item"""
    data = {
        "section": "projects",
        "title": item.title,
        "description": item.description,
        "link": item.link,
        "image_url": item.image_url or ""
    }
    
    if item.id:
        content_collection.update_one(
            {"_id": ObjectId(item.id)},
            {"$set": data}
        )
        return {"success": True, "id": item.id}
    else:
        result = content_collection.insert_one(data)
        return {"success": True, "id": str(result.inserted_id)}

@app.delete("/api/content/projects/{item_id}")
async def delete_project(item_id: str):
    """Delete project item"""
    content_collection.delete_one({"_id": ObjectId(item_id)})
    return {"success": True}

# ============ SKILLS SECTION ============
@app.get("/api/content/skills")
async def get_skills():
    """Get skill categories"""
    items = list(content_collection.find({"section": "skills"}).limit(50))
    return [serialize_doc(item) for item in items]

@app.post("/api/content/skills")
async def save_skill_category(item: SkillCategory):
    """Add or update skill category"""
    data = {
        "section": "skills",
        "category": item.category,
        "skills": item.skills
    }
    
    if item.id:
        content_collection.update_one(
            {"_id": ObjectId(item.id)},
            {"$set": data}
        )
        return {"success": True, "id": item.id}
    else:
        result = content_collection.insert_one(data)
        return {"success": True, "id": str(result.inserted_id)}

@app.delete("/api/content/skills/{item_id}")
async def delete_skill_category(item_id: str):
    """Delete skill category"""
    content_collection.delete_one({"_id": ObjectId(item_id)})
    return {"success": True}

# ============ GET ALL CONTENT ============
@app.get("/api/content/all")
async def get_all_content():
    """Get all portfolio content for rendering"""
    about = content_collection.find_one({"section": "about"}, {"_id": 0})
    education = [serialize_doc(item) for item in content_collection.find({"section": "education"}).limit(50)]
    experience = [serialize_doc(item) for item in content_collection.find({"section": "experience"}).limit(50)]
    projects = [serialize_doc(item) for item in content_collection.find({"section": "projects"}).limit(100)]
    skills = [serialize_doc(item) for item in content_collection.find({"section": "skills"}).limit(50)]
    
    return {
        "about": about or {"text": "", "image_url": ""},
        "education": education,
        "experience": experience,
        "projects": projects,
        "skills": skills
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
